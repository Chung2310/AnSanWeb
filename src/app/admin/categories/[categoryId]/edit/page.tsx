'use client';

import { useParams } from 'next/navigation';
import CategoryForm from '@/components/admin/categories/category-form';
import Lottie from 'lottie-react';
import loadingAnimation from '@/components/loading.json';
import type { Category } from '@/lib/types';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

export default function EditCategoryPage() {
  const params = useParams();
  const categoryId = params.categoryId as string;
  const firestore = useFirestore();
  
  const categoryRef = useMemoFirebase(
    () => (categoryId ? doc(firestore, 'categories', categoryId) : null),
    [firestore, categoryId]
  );
  
  const { data: category, isLoading } = useDoc<Category>(categoryRef);

  if (isLoading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Lottie animationData={loadingAnimation} className="h-32 w-32" />
      </div>
    );
  }

  if (!category) {
    return <div>Không tìm thấy danh mục.</div>;
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Chỉnh sửa danh mục</h1>
      <CategoryForm initialData={category} />
    </div>
  );
}
