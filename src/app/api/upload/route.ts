import { NextResponse } from 'next/server';
import * as admin from 'firebase-admin';
import { Readable } from 'stream';

// Initialize Firebase Admin SDK
// This should only run once.
if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  } catch (error: any) {
    console.error('Firebase Admin Initialization Error:', error.message);
  }
}

const bucket = admin.storage().bucket();

export async function POST(request: Request) {
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
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.type,
      },
    });

    return new Promise((resolve, reject) => {
      blobStream.on('error', (err) => {
        console.error('Blob Stream Error:', err);
        reject(NextResponse.json({ error: 'Failed to upload file.' }, { status: 500 }));
      });

      blobStream.on('finish', async () => {
        try {
          // Make the file publicly readable
          await blob.makePublic();
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
          
          const imageInfo = {
            url: publicUrl,
            path: storagePath,
          };
          
          resolve(NextResponse.json(imageInfo, { status: 200 }));
        } catch (err) {
            console.error('Error making file public or getting URL:', err);
            reject(NextResponse.json({ error: 'Failed to finalize file upload.' }, { status: 500 }));
        }
      });

      // Use a readable stream to pipe the buffer to the blob stream
      const bufferStream = new Readable();
      bufferStream.push(fileBuffer);
      bufferStream.push(null); // Signal the end of the stream
      bufferStream.pipe(blobStream);
    });

  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: error.message || 'An unknown error occurred.' }, { status: 500 });
  }
}
