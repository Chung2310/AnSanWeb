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
  url: string | null;
  error: string | null;
  isUploading: boolean;
  startUpload: (file: File, pathPrefix?: string) => Promise<ImageInfo | null>;
}

export function useUploadStorage(): UploadResult {
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { storage } = useFirebase();

  const startUpload = (file: File, pathPrefix = 'products'): Promise<ImageInfo | null> => {
    return new Promise((resolve, reject) => {
      if (!file) {
        const err = 'No file provided for upload.';
        setError(err);
        reject(new Error(err));
        return;
      }
      
      if (!storage) {
        const err = 'Firebase Storage is not initialized.';
        setError(err);
        reject(new Error(err));
        return;
      }

      setIsUploading(true);
      setError(null);
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
          setError(uploadError.message);
          setIsUploading(false);
          reject(uploadError);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            const imageInfo: ImageInfo = {
              url: downloadURL,
              path: storagePath,
            };
            setUrl(downloadURL);
            setIsUploading(false);
            setProgress(100);
            resolve(imageInfo);
          } catch (urlError) {
            console.error("Failed to get download URL:", urlError);
            setError((urlError as Error).message);
            setIsUploading(false);
            reject(urlError);
          }
        }
      );
    });
  };

  return { progress, url, error, isUploading, startUpload };
}
