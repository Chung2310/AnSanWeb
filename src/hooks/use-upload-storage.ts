'use client';
import { useState } from 'react';
import type { ImageInfo } from '@/lib/types';

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

  const startUpload = (file: File): Promise<ImageInfo | null> => {
    return new Promise(async (resolve, reject) => {
      if (!file) {
        const err = 'No file provided for upload.';
        setError(err);
        reject(new Error(err));
        return;
      }

      setIsUploading(true);
      setError(null);
      setProgress(0);

      const formData = new FormData();
      formData.append('file', file);

      try {
        setProgress(30);
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        setProgress(70);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Upload failed');
        }

        const imageInfo: ImageInfo = await response.json();
        
        setUrl(imageInfo.url);
        setProgress(100);
        setIsUploading(false);
        resolve(imageInfo);

      } catch (uploadError: any) {
        setError(uploadError.message);
        console.error("Upload failed:", uploadError);
        setIsUploading(false);
        reject(uploadError);
      }
    });
  };

  return { progress, url, error, isUploading, startUpload };
}
