'use client';
import { useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useFirebase } from '@/firebase';
import type { ImageInfo } from '@/lib/types';

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
      if (!file) {
        return reject(new Error('No file provided for upload.'));
      }
      if (!firebaseApp) {
        return reject(new Error('Firebase app is not initialized.'));
      }

      setIsUploading(true);
      setProgress(0);

      const storage = getStorage(firebaseApp);
      
      const fileId = `${Date.now()}-${Math.random().toString(36).substring(2)}`;
      const fileExtension = file.name.split('.').pop();
      const fileName = `${fileId}.${fileExtension}`;
      const storagePath = `${pathPrefix}/${fileName}`;
      
      const storageRef = ref(storage, storagePath);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        (snapshot) => {
          const progressValue = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progressValue);
        },
        (error) => {
          setIsUploading(false);
          console.error("Upload Error:", error);
          let errorMessage = 'Upload failed. Please try again.';
          switch (error.code) {
            case 'storage/unauthorized':
              errorMessage = 'Permission denied. Please check storage security rules.';
              break;
            case 'storage/canceled':
              errorMessage = 'Upload was canceled.';
              break;
            case 'storage/unknown':
              errorMessage = 'An unknown error occurred on the server.';
              break;
          }
          reject(new Error(errorMessage));
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setIsUploading(false);
            setProgress(100);
            const imageInfo: ImageInfo = {
              url: downloadURL,
              path: storagePath,
            };
            resolve(imageInfo);
          }).catch(error => {
            setIsUploading(false);
            console.error("Get Download URL Error:", error);
            reject(new Error('Could not get download URL after upload.'));
          });
        }
      );
    });
  };

  return { progress, isUploading, startUpload };
}
