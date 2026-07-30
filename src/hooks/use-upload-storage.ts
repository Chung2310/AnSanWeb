'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth-store';

export function useUploadStorage() {
  const { user } = useAuthStore();
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const startUpload = async (file: File, folder: string) => {
    if (!user) {
      throw new Error('Bạn cần đăng nhập để tải ảnh lên.');
    }

    setIsUploading(true);
    setProgress(30);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', folder);

      setProgress(60);
      const response = await apiClient.post('/upload', formData);
      setProgress(100);
      
      return {
        url: response.url,
        path: response.path,
      };
    } catch (error) {
      console.error('Lỗi tải tệp lên server:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return { startUpload, progress, isUploading };
}
