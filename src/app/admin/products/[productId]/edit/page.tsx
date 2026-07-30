'use client';

import { useParams } from 'next/navigation';
import ProductForm from '@/components/admin/products/product-form';
import type { FullProduct } from '@/lib/types';
import Lottie from 'lottie-react';
import loadingAnimation from '@/components/loading.json';
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export default function EditProductPage() {
  const params = useParams();
  const productId = params.productId as string;
  const [product, setProduct] = useState<FullProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;
    setIsLoading(true);
    apiClient
      .get(`/products/${productId}`)
      .then((res) => {
        if (res.data) {
          setProduct(res.data);
        }
      })
      .catch((err) => {
        console.error('Error fetching product:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [productId]);

  if (isLoading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Lottie animationData={loadingAnimation} className="h-32 w-32" />
      </div>
    );
  }

  if (!product) {
    return <div>Không tìm thấy sản phẩm.</div>;
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Chỉnh sửa sản phẩm</h1>
      <ProductForm initialData={product} />
    </div>
  );
}
