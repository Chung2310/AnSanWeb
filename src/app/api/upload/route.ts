
import { NextResponse } from 'next/server';
import * as storageAdmin from 'firebase-admin/storage';
import * as appAdmin from 'firebase-admin/app';
import { firebaseConfig } from '@/firebase/config';

// Function to initialize Firebase Admin SDK
function initializeAdminApp(): appAdmin.App {
  const adminAppName = 'admin-upload';
  const existingApp = appAdmin.getApps().find(app => app.name === adminAppName);
  if (existingApp) {
    return existingApp;
  }

  // In a managed environment like App Hosting, the SDK can auto-discover credentials.
  // We don't need to pass a service account key explicitly.
  return appAdmin.initializeApp({
    storageBucket: firebaseConfig.storageBucket,
  }, adminAppName);
}

export async function POST(request: Request) {
  try {
    const adminApp = initializeAdminApp();
    if (!adminApp) {
        throw new Error("Admin SDK initialization failed.");
    }

    const storage = storageAdmin.getStorage(adminApp);
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    const fileBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(fileBuffer);
    
    const fileId = `${Date.now()}-${Math.random().toString(36).substring(2)}`;
    const fileExtension = file.name.split('.').pop();
    const fileName = `${fileId}.${fileExtension}`;
    const storagePath = `products/${fileName}`;
    const fileRef = storageAdmin.ref(storage.bucket(), storagePath);

    await storageAdmin.uploadBytes(fileRef, buffer, {
      contentType: file.type,
    });

    const downloadURL = await storageAdmin.getDownloadURL(fileRef);

    return NextResponse.json({
      url: downloadURL,
      path: storagePath,
    });

  } catch (e: any) {
    console.error('Upload API Error:', e);
    // Ensure we don't leak internal implementation details in the error response
    const errorMessage = e.message.includes('is not a function') 
        ? 'Internal server error during file upload.' 
        : `Upload failed: ${e.message}`;
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
