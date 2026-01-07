'use client';

import { useParams } from 'next/navigation';
import BlogForm from '@/components/admin/blog/blog-form';
import { useMemo } from 'react';
import Lottie from 'lottie-react';
import loadingAnimation from '@/components/loading.json';
import { sampleBlogPosts } from '@/lib/placeholder-data';
import type { BlogPost } from '@/lib/types';

export default function EditBlogPage() {
  const params = useParams();
  const { blogId } = params;
  
  const isLoading = false;
  const post = useMemo(() => sampleBlogPosts.find(p => p.id === blogId), [blogId]);


  if (isLoading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Lottie animationData={loadingAnimation} className="h-32 w-32" />
      </div>
    );
  }

  if (!post) {
    return <div>Không tìm thấy bài viết.</div>;
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Chỉnh sửa bài viết</h1>
      <BlogForm initialData={post} />
    </div>
  );
}
