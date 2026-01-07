import { NextResponse } from 'next/server';
import { initializeApp, getApps, getApp, type App } from 'firebase-admin/app';
import { getStorage, type Bucket } from 'firebase-admin/storage';
import { firebaseConfig } from '@/firebase/config';
import { tmpdir } from 'os';
import { join } from 'path';
import { writeFile } from 'fs/promises';

let adminApp: App;
let bucket: Bucket;

// This function initializes the admin app and storage bucket.
// It's designed to run only once, ensuring no re-initialization errors.
function initializeAdminApp() {
  if (getApps().length === 0) {
    // In a Google Cloud environment (like App Hosting), initializeApp() with no args
    // automatically uses Application Default Credentials.
    adminApp = initializeApp({
      storageBucket: firebaseConfig.storageBucket,
    });
  } else {
    adminApp = getApp();
  }
  bucket = getStorage(adminApp).bucket();
}

// Call the initialization function when the module is loaded.
initializeAdminApp();

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    // Convert the file to a buffer and write it to a temporary file
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const tempFilePath = join(tmpdir(), file.name);
    await writeFile(tempFilePath, fileBuffer);
    
    // Define the destination path in Firebase Storage
    const fileId = `${Date.now()}-${Math.random().toString(36).substring(2)}`;
    const fileExtension = file.name.split('.').pop();
    const fileName = `${fileId}.${fileExtension}`;
    const storagePath = `products/${fileName}`;

    // Use the bucket.upload method which is robust for server-side uploads
    const [uploadedFile] = await bucket.upload(tempFilePath, {
      destination: storagePath,
      metadata: {
        contentType: file.type,
      },
    });

    // Make the file public to get a downloadable URL
    await uploadedFile.makePublic();
    const downloadURL = uploadedFile.publicUrl();

    return NextResponse.json({
      url: downloadURL,
      path: storagePath,
    });

  } catch (e: any) {
    console.error('Upload API Error:', e);
    const errorMessage = e.message || 'Internal server error during file upload.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
