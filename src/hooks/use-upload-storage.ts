'use client';
import { useState } from 'react';
import type { ImageInfo } from '@/lib/types';

interface UploadResult {
  progress: number;
  isUploading: boolean;
  startUpload: (file: File, pathPrefix?: string) => Promise<ImageInfo>;
}

export function useUploadStorage(): UploadResult {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const startUpload = (file: File, pathPrefix = 'products'): Promise<ImageInfo> => {
    return new Promise((resolve, reject) => {
      if (!file) {
        return reject(new Error('No file provided for upload.'));
      }

      setIsUploading(true);
      setProgress(0);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('pathPrefix', pathPrefix);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/upload', true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progressValue = (event.loaded / event.total) * 100;
          setProgress(progressValue);
        }
      };

      xhr.onload = () => {
        setIsUploading(false);
        if (xhr.status === 200) {
          try {
            const imageInfo: ImageInfo = JSON.parse(xhr.responseText);
            setProgress(100);
            resolve(imageInfo);
          } catch (e) {
            reject(new Error('Failed to parse server response.'));
          }
        } else {
          try {
            const errorResponse = JSON.parse(xhr.responseText);
            reject(new Error(errorResponse.error || 'Upload failed with status ' + xhr.status));
          } catch (e) {
            reject(new Error('Upload failed with status ' + xhr.status));
          }
        }
      };

      xhr.onerror = () => {
        setIsUploading(false);
        reject(new Error('Upload failed due to a network error.'));
      };

      xhr.send(formData);
    });
  };

  return { progress, isUploading, startUpload };
}
