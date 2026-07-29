'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';
import type { BlogPost } from '@/lib/types';
import { useAuthStore } from '@/stores/auth-store';

export function useDeleteBlogPost() {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteBlogPost = async (post: BlogPost) => {
    if (!user || !post.id) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Không thể xóa bài viết. Vui lòng đăng nhập lại.',
      });
      return;
    }

    setIsDeleting(true);
    try {
      await apiClient.delete(`/blog-posts/${post.id}`);

      toast({
        title: 'Thành công',
        description: `Bài viết "${post.title}" đã được xóa thành công.`,
      });
    } catch (error: any) {
      console.error('Error deleting blog post:', error);
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: error.message || 'Không thể xóa bài viết. Vui lòng thử lại.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteBlogPost, isDeleting };
}
