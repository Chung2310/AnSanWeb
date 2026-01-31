'use client';

import { useState } from 'react';
import { useFirebase } from '@/firebase';
import { doc, deleteDoc, collection, getDocs, query, where, writeBatch } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { Category, Product } from '@/lib/types';
import { useAuthStore } from '@/stores/auth-store';

export function useDeleteCategory() {
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const { user } = useAuthStore();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteCategory = async (category: Category, onSuccess?: () => void) => {
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
      const batch = writeBatch(firestore);
      const categoriesCollection = collection(firestore, 'categories');

      // Find all descendant categories
      const descendantIds: string[] = [];
      const queue: string[] = [category.id];
      const allCategoriesSnapshot = await getDocs(categoriesCollection);
      const allCategories = allCategoriesSnapshot.docs.map(d => d.data() as Category);

      const processed = new Set<string>();

      while (queue.length > 0) {
        const currentId = queue.shift()!;
        if (processed.has(currentId)) continue;
        
        descendantIds.push(currentId);
        processed.add(currentId);

        const children = allCategories.filter(c => c.parentId === currentId);
        children.forEach(child => queue.push(child.id));
      }
      
      // Delete all category documents in the hierarchy
      descendantIds.forEach(id => {
        const categoryDocRef = doc(firestore, 'categories', id);
        batch.delete(categoryDocRef);
      });

      // Remove tags from products
      if (descendantIds.length > 0) {
          const productsRef = collection(firestore, 'products');
          const q = query(productsRef, where('tags', 'array-contains-any', descendantIds));
          const productsSnapshot = await getDocs(q);

          productsSnapshot.forEach(productDoc => {
            const productData = productDoc.data() as Product;
            const newTags = productData.tags?.filter(tag => !descendantIds.includes(tag));
            batch.update(productDoc.ref, { tags: newTags });
          });
      }
      
      await batch.commit();

      toast({
        title: 'Thành công',
        description: `Danh mục "${category.name}" và các danh mục con đã được xóa.`,
      });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Không thể xóa danh mục. Vui lòng thử lại.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteCategory, isDeleting };
}
