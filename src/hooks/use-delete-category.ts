'use client';

import { useState } from 'react';
import { useFirebase } from '@/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { Category } from '@/lib/types';
import { useAuthStore } from '@/stores/auth-store';

export function useDeleteCategory() {
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const { user } = useAuthStore();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteCategory = async (category: Category) => {
    if (!user || !category.id) {
        toast({
            variant: 'destructive',
            title: 'Lỗi',
            description: 'Không thể xóa danh mục. Vui lòng thử lại.',
        });
        return;
    }

    setIsDeleting(true);
    try {
      const categoryDocRef = doc(firestore, 'categories', category.id);
      await deleteDoc(categoryDocRef);

      toast({
        title: 'Thành công',
        description: `Danh mục "${category.name}" đã được xóa.`,
      });

    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Không thể xóa danh mục. Vui lòng thử lại.',
      });
    } finally {
      // It's important to set isDeleting to false, but the component might unmount
      // before this is called if the list re-renders. The key is that the state
      // is isolated to the button instance.
      setIsDeleting(false);
    }
  };

  return { deleteCategory, isDeleting };
}
