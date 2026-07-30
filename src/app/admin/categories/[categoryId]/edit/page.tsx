'use client';

import { useParams } from 'next/navigation';
import CategoryForm from '@/components/admin/categories/category-form';
import Lottie from 'lottie-react';
import loadingAnimation from '@/components/loading.json';
import type { Category } from '@/lib/types';
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export default function EditCategoryPage() {
  const params = useParams();
  const categoryId = params.categoryId as string;
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) return;
    setIsLoading(true);
    apiClient
      .get(`/categories/${categoryId}`)
      .then((res) => {
        if (res.data) {
          setCategory(res.data);
        }
      })
      .catch((err) => {
        console.error('Error fetching category:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [categoryId]);

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
