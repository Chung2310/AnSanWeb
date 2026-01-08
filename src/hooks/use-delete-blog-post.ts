'use client';

import { useState } from 'react';
import { useFirebase } from '@/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, deleteObject } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';
import type { BlogPost } from '@/lib/types';
import { useAuthStore } from '@/stores/auth-store';

export function useDeleteBlogPost() {
  const { firestore, firebaseApp } = useFirebase();
  const { toast } = useToast();
  const { user } = useAuthStore();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteBlogPost = async (post: BlogPost) => {
    if (!user || !post.id) {
        toast({
            variant: 'destructive',
            title: 'Lỗi',
            description: 'Không thể xóa bài viết. Vui lòng thử lại.',
        });
        return;
    }

    setIsDeleting(true);
    try {
      const storage = getStorage(firebaseApp);
      
      // Delete associated images from storage
      const imageDeletePromises: Promise<void>[] = [];
      if (post.image?.path) {
        const imageRef = ref(storage, post.image.path);
        imageDeletePromises.push(deleteObject(imageRef).catch(e => console.error(`Failed to delete image ${post.image?.path}`, e)));
      }
      // You can also add logic here to parse post.content and delete any images uploaded via the rich text editor if their paths are stored.

      await Promise.all(imageDeletePromises);
      
      // Delete Firestore Document
      const postDocRef = doc(firestore, 'blogPosts', post.id);
      await deleteDoc(postDocRef);

      toast({
        title: 'Thành công',
        description: `Bài viết "${post.title}" đã được xóa.`,
      });

    } catch (error) {
      console.error("Error deleting blog post:", error);
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Không thể xóa bài viết. Vui lòng thử lại.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteBlogPost, isDeleting };
}
