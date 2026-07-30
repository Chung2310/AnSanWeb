'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';
import type { Category } from '@/lib/types';
import { useAuthStore } from '@/stores/auth-store';

export function useDeleteCategory() {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteCategory = async (category: Category, onSuccess?: () => void) => {
    if (!user || !category.id) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Không thể xóa danh mục. Vui lòng đăng nhập lại.',
      });
      return;
    }

    setIsDeleting(true);
    try {
      await apiClient.delete(`/categories/${category.id}`);

      toast({
        title: 'Thành công',
        description: `Danh mục "${category.name}" và các danh mục con đã được xóa thành công.`,
      });
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Error deleting category:', error);
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: error.message || 'Không thể xóa danh mục. Vui lòng thử lại.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteCategory, isDeleting };
}
