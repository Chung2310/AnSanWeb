'use client';
import { useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, UploadTask, StorageError } from 'firebase/storage';
import { useFirebaseApp } from '@/firebase';
import type { ImageInfo } from '@/lib/types';


interface UploadResult {
  progress: number;
  url: string | null;
  error: string | null;
  task: UploadTask | null;
  startUpload: (file: File, pathPrefix?: string) => Promise<ImageInfo | null>;
}

export function useUploadStorage(): UploadResult {
  const firebaseApp = useFirebaseApp();
  const storage = getStorage(firebaseApp);

  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [task, setTask] = useState<UploadTask | null>(null);

  const startUpload = (file: File, pathPrefix = 'uploads'): Promise<ImageInfo | null> => {
    return new Promise((resolve, reject) => {
      if (!file) {
        setError('No file provided for upload.');
        reject('No file provided for upload.');
        return;
      }
      
      const fileId = `${Date.now()}-${Math.random().toString(36).substring(2)}`;
      const fileExtension = file.name.split('.').pop();
      const fileName = `${fileId}.${fileExtension}`;
      const storagePath = `${pathPrefix}/${fileName}`;
      const storageRef = ref(storage, storagePath);

      const uploadTask = uploadBytesResumable(storageRef, file);
      setTask(uploadTask);

      uploadTask.on('state_changed',
        (snapshot) => {
          const currentProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(currentProgress);
        },
        (uploadError: StorageError) => {
          setError(uploadError.message);
          console.error("Upload failed:", uploadError);
          reject(uploadError);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setUrl(downloadURL);
            setProgress(100);
            const imageInfo: ImageInfo = { url: downloadURL, path: storagePath };
            resolve(imageInfo);
          } catch (e) {
            const finalError = e as StorageError;
            setError(finalError.message);
            console.error("Failed to get download URL:", finalError);
            reject(finalError);
          }
        }
      );
    });
  };

  return { progress, url, error, task, startUpload };
}
