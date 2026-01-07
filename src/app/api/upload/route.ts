import { NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

// This is the correct way to initialize the admin SDK.
// It will automatically use the service account credentials provided
// by the environment (e.g., in a Cloud Function, App Engine, or via GOOGLE_APPLICATION_CREDENTIALS).
if (!admin.apps.length) {
  try {
    admin.initializeApp({
        // Use a server-side environment variable for the storage bucket
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
  } catch (error: any) {
    console.error('Firebase Admin Initialization Error:', error.message);
  }
}

// Get the default bucket from the initialized app.
// Ensure the bucket is retrieved only after initialization.
const bucket = admin.apps.length ? admin.storage().bucket() : null;


export async function POST(request: Request) {
  if (!bucket) {
    return NextResponse.json({ error: 'Firebase Admin SDK not initialized.' }, { status: 500 });
  }
  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const pathPrefix = formData.get('pathPrefix') as string || 'uploads';

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }
    
    // Create a buffer from the file
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Generate a unique filename
    const fileId = `${Date.now()}-${Math.random().toString(36).substring(2)}`;
    const fileExtension = file.name.split('.').pop();
    const fileName = `${fileId}.${fileExtension}`;
    const storagePath = `${pathPrefix}/${fileName}`;
    
    const blob = bucket.file(storagePath);
    
    // Use the save method with the buffer
    await blob.save(fileBuffer, {
        metadata: {
            contentType: file.type,
        },
    });

    // Make the file publicly readable
    await blob.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    
    const imageInfo = {
      url: publicUrl,
      path: storagePath,
    };
    
    return NextResponse.json(imageInfo, { status: 200 });

  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: error.message || 'An unknown error occurred.' }, { status: 500 });
  }
}
