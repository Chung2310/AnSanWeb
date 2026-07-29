'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';
import type { FullProduct } from '@/lib/types';

export function useDeleteProduct() {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteProduct = async (product: FullProduct) => {
    setIsDeleting(true);
    try {
      await apiClient.delete(`/products/${product.id}`);

      toast({
        title: 'Thành công',
        description: `Sản phẩm "${product.nameVN}" đã được xóa thành công.`,
      });
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: error.message || 'Không thể xóa sản phẩm. Vui lòng thử lại.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteProduct, isDeleting };
}