'use client';
import { useState } from 'react';
import { useStorage } from '@/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useAuthStore } from '@/stores/auth-store';

export function useUploadStorage() {
  const storage = useStorage();
  const { user } = useAuthStore();
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const startUpload = async (file: File, folder: string) => {
    if (!user) {
      throw new Error('User not authenticated for upload.');
    }

    setIsUploading(true);
    setProgress(0);
    const fileId = crypto.randomUUID();
    const storageRef = ref(storage, `${folder}/${fileId}-${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise<{ url: string; path: string }>((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        (error) => {
          console.error('Upload failed:', error);
          setIsUploading(false);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setIsUploading(false);
            resolve({ url: downloadURL, path: uploadTask.snapshot.ref.fullPath });
          });
        }
      );
    });
  };

  return { startUpload, progress, isUploading };
}
