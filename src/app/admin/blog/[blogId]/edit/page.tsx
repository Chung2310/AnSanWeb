'use client';

import { useParams } from 'next/navigation';
import BlogForm from '@/components/admin/blog/blog-form';
import Lottie from 'lottie-react';
import loadingAnimation from '@/components/loading.json';
import type { BlogPost } from '@/lib/types';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

export default function EditBlogPage() {
  const params = useParams();
  const blogId = params.blogId as string;
  const firestore = useFirestore();
  
  const postRef = useMemoFirebase(
    () => (blogId ? doc(firestore, 'blogPosts', blogId) : null),
    [firestore, blogId]
  );
  
  const { data: post, isLoading } = useDoc<BlogPost>(postRef);


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
