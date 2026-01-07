import { NextResponse } from 'next/server';
import { initializeApp, getApps, getApp, type App } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { firebaseConfig } from '@/firebase/config';

// Initialize Firebase Admin SDK
function initializeAdminApp(): App {
  if (getApps().length > 0) {
    return getApp();
  }
  return initializeApp({
    storageBucket: firebaseConfig.storageBucket,
  });
}

export async function POST(request: Request) {
  try {
    const adminApp = initializeAdminApp();
    const bucket = getStorage(adminApp).bucket();
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    const fileArrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(fileArrayBuffer);
    
    const fileId = `${Date.now()}-${Math.random().toString(36).substring(2)}`;
    const fileExtension = file.name.split('.').pop();
    const fileName = `${fileId}.${fileExtension}`;
    const storagePath = `products/${fileName}`;
    
    const fileUpload = bucket.file(storagePath);

    await fileUpload.save(buffer, {
      metadata: {
        contentType: file.type,
      },
    });

    // Make the file public and get the URL
    await fileUpload.makePublic();
    const downloadURL = fileUpload.publicUrl();


    return NextResponse.json({
      url: downloadURL,
      path: storagePath,
    });

  } catch (e: any) {
    console.error('Upload API Error:', e);
    // Provide a more specific error if available
    const errorMessage = e.message || 'Internal server error during file upload.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
