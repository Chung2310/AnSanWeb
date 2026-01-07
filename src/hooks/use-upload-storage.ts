'use client';
import { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL, StorageError } from 'firebase/storage';
import { useFirebaseApp } from '@/firebase';
import type { ImageInfo } from '@/lib/types';


interface UploadResult {
  progress: number;
  url: string | null;
  error: string | null;
  isUploading: boolean;
  startUpload: (file: File, pathPrefix?: string) => Promise<ImageInfo | null>;
}

export function useUploadStorage(): UploadResult {
  const firebaseApp = useFirebaseApp();
  const storage = getStorage(firebaseApp);

  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const startUpload = (file: File, pathPrefix = 'uploads'): Promise<ImageInfo | null> => {
    return new Promise(async (resolve, reject) => {
      if (!file) {
        const err = 'No file provided for upload.';
        setError(err);
        reject(err);
        return;
      }
      
      const fileId = `${Date.now()}-${Math.random().toString(36).substring(2)}`;
      const fileExtension = file.name.split('.').pop();
      const fileName = `${fileId}.${fileExtension}`;
      const storagePath = `${pathPrefix}/${fileName}`;
      const storageRef = ref(storage, storagePath);

      setIsUploading(true);
      setError(null);
      setProgress(0); // Indicate start

      try {
        // Use uploadBytes for a simpler, non-resumable upload
        const snapshot = await uploadBytes(storageRef, file);
        setProgress(50); // Halfway after upload promise resolves

        const downloadURL = await getDownloadURL(snapshot.ref);
        
        setUrl(downloadURL);
        setProgress(100); // Complete
        const imageInfo: ImageInfo = { url: downloadURL, path: storagePath };
        
        setIsUploading(false);
        resolve(imageInfo);
      } catch (uploadError) {
        const finalError = uploadError as StorageError;
        setError(finalError.message);
        console.error("Upload failed:", finalError);
        setIsUploading(false);
        reject(finalError);
      }
    });
  };

  return { progress, url, error, isUploading, startUpload };
}
