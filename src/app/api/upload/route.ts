import { NextResponse } from 'next/server';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firebaseConfig } from '@/firebase/config';

// Initialize Firebase on the server-side
function initializeServerApp() {
  const apps = getApps();
  if (apps.length) {
    return getApp();
  }
  return initializeApp(firebaseConfig);
}

export async function POST(request: Request) {
  try {
    const app = initializeServerApp();
    const storage = getStorage(app);
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    const fileArrayBuffer = await file.arrayBuffer();
    
    const fileId = `${Date.now()}-${Math.random().toString(36).substring(2)}`;
    const fileExtension = file.name.split('.').pop();
    const fileName = `${fileId}.${fileExtension}`;
    const storagePath = `products/${fileName}`;
    
    const storageRef = ref(storage, storagePath);

    // Pass the ArrayBuffer directly to uploadBytes
    const snapshot = await uploadBytes(storageRef, fileArrayBuffer, {
      contentType: file.type,
    });

    const downloadURL = await getDownloadURL(snapshot.ref);

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
