'use client';

import { useState } from 'react';
import { useFirebase } from '@/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, deleteObject } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';
import type { FullProduct } from '@/lib/types';

export function useDeleteProduct() {
  const { firestore, firebaseApp } = useFirebase();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteProduct = async (product: FullProduct) => {
    setIsDeleting(true);
    try {
      const storage = getStorage(firebaseApp);
      const imageDeletePromises: Promise<void>[] = [];

      // 1. Delete Cover Image
      if (product.image?.path) {
        const coverImageRef = ref(storage, product.image.path);
        imageDeletePromises.push(deleteObject(coverImageRef));
      }

      // 2. Delete Detail Images
      if (product.detailImages && product.detailImages.length > 0) {
        product.detailImages.forEach((image) => {
          if (image.path) {
            const detailImageRef = ref(storage, image.path);
            imageDeletePromises.push(deleteObject(detailImageRef));
          }
        });
      }

      // Execute all image deletions in parallel
      await Promise.all(
        imageDeletePromises.map(p => p.catch(e => {
            // Log individual image deletion errors but don't stop the process
            console.error(`Failed to delete an image:`, e);
        }))
      );
      
      // 3. Delete Firestore Document
      const productDocRef = doc(firestore, 'products', product.id);
      await deleteDoc(productDocRef);

      toast({
        title: 'Thành công',
        description: `Sản phẩm "${product.nameVN}" và các ảnh liên quan đã được xóa.`,
      });

    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Không thể xóa sản phẩm. Vui lòng thử lại.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteProduct, isDeleting };
}

    