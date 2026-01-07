'use client';
import { useState } from 'react';
import type { ImageInfo } from '@/lib/types';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  UploadTask,
  UploadTaskSnapshot,
} from 'firebase/storage';
import { useFirebase } from '@/firebase';

interface UploadResult {
  progress: number;
  isUploading: boolean;
  startUpload: (file: File, pathPrefix?: string) => Promise<ImageInfo | null>;
}

export function useUploadStorage(): UploadResult {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { storage } = useFirebase();

  const startUpload = (file: File, pathPrefix = 'products'): Promise<ImageInfo | null> => {
    return new Promise((resolve, reject) => {
      if (!file) {
        const err = new Error('No file provided for upload.');
        reject(err);
        return;
      }
      
      if (!storage) {
        const err = new Error('Firebase Storage is not initialized.');
        reject(err);
        return;
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
          reject(uploadError); // Reject the promise with the error
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
            resolve(imageInfo);
          } catch (urlError) {
            console.error("Failed to get download URL:", urlError);
            setIsUploading(false);
            setProgress(0);
            reject(urlError); // Reject the promise with the error
          }
        }
      );
    });
  };

  return { progress, isUploading, startUpload };
}
