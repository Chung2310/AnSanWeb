'use client';

import { useParams } from 'next/navigation';
import ProductForm from '@/components/admin/products/product-form';
import { useMemo } from 'react';
import { doc } from 'firebase/firestore';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import type { FullProduct } from '@/lib/types';
import Lottie from 'lottie-react';
import loadingAnimation from '@/components/loading.json';

export default function EditProductPage() {
  const params = useParams();
  const productId = params.productId as string;
  const firestore = useFirestore();

  const productRef = useMemoFirebase(
    () => doc(firestore, 'products', productId as string),
    [firestore, productId]
  );
  const { data: product, isLoading } = useDoc<FullProduct>(productRef);

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
