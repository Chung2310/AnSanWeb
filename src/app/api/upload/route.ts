
import { NextResponse } from 'next/server';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase-admin/storage';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { firebaseConfig } from '@/firebase/config';

// Function to initialize Firebase Admin SDK
function initializeAdminApp() {
  if (getApps().length > 0 && getApps().some(app => app.name === 'admin')) {
    return getApps().find(app => app.name === 'admin');
  }

  // Check for service account credentials in environment variables
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : null;

  if (!serviceAccount) {
    throw new Error('Firebase service account key is not set in environment variables.');
  }

  return initializeApp({
    credential: cert(serviceAccount),
    storageBucket: firebaseConfig.storageBucket,
  }, 'admin');
}

export async function POST(request: Request) {
  try {
    const adminApp = initializeAdminApp();
    if (!adminApp) {
        throw new Error("Admin SDK initialization failed.");
    }

    const storage = getStorage(adminApp);
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
    const fileRef = ref(storage.bucket().name, storagePath);

    await uploadBytes(fileRef, buffer, {
      contentType: file.type,
    });

    const downloadURL = await getDownloadURL(fileRef);

    return NextResponse.json({
      url: downloadURL,
      path: storagePath,
    });

  } catch (e: any) {
    console.error('Upload API Error:', e);
    return NextResponse.json({ error: `Upload failed: ${e.message}` }, { status: 500 });
  }
}
