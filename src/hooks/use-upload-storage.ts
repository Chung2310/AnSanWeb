'use client';
import { useState } from 'react';
import type { ImageInfo } from '@/lib/types';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getStorage,
  UploadTask,
  UploadTaskSnapshot,
} from 'firebase/storage';
import { useFirebase } from '@/firebase';

interface UploadResult {
  progress: number;
  isUploading: boolean;
  startUpload: (file: File, pathPrefix?: string) => Promise<ImageInfo>;
}

export function useUploadStorage(): UploadResult {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { firebaseApp } = useFirebase();

  const startUpload = (file: File, pathPrefix = 'products'): Promise<ImageInfo> => {
    return new Promise((resolve, reject) => {
      if (!firebaseApp) {
        setIsUploading(false);
        return reject(new Error('Firebase app is not initialized.'));
      }
      const storage = getStorage(firebaseApp);
      
      if (!file) {
        setIsUploading(false);
        return reject(new Error('No file provided for upload.'));
      }

      setIsUploading(true);
      setProgress(0);

      const fileId = `${Date.now()}-${Math.random().toString(36).substring(2)}`;
      const fileExtension = file.name.split('.').pop();
      const fileName = `${fileId}.${fileExtension}`;
      const storagePath = `${pathPrefix}/${fileName}`;
      const storageRef = ref(storage, storagePath);

      const uploadTask: UploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot: UploadTaskSnapshot) => {
          const progressValue = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progressValue);
        },
        (uploadError) => {
          console.error("Upload failed:", uploadError);
          setIsUploading(false);
          setProgress(0);
          reject(uploadError); // Reject the promise on error
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            const imageInfo: ImageInfo = {
              url: downloadURL,
              path: storagePath,
            };
            setIsUploading(false);
            setProgress(100);
            resolve(imageInfo); // Resolve the promise with image info
          } catch (urlError) {
            console.error("Failed to get download URL:", urlError);
            setIsUploading(false);
            setProgress(0);
            reject(urlError); // Reject on URL retrieval error
          }
        }
      );
    });
  };

  return { progress, isUploading, startUpload };
}
