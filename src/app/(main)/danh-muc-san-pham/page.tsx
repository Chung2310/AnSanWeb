'use client';
import { useProducts } from '@/hooks/use-products';
import ProductListing from '@/components/product-listing';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';

function AllProductsContent() {
  const { products, isLoading } = useProducts();
  const pageTitle = "Tất cả sản phẩm";

  if (isLoading) {
    return (
       <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
                <Skeleton className="h-12 w-full mb-8" />
                <Skeleton className="h-64 w-full" />
            </div>
            <div className="lg:col-span-3">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 9 }).map((_, i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="h-64 w-full" />
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    )
  }

  return (
    <ProductListing 
      key={pageTitle}
      initialProducts={products || []}
      title={pageTitle}
      itemsPerPage={12}
    />
  );
}

export default function AllProductsPage() {
    return (
        <Suspense fallback={<div className="container py-20 text-center">Đang tải sản phẩm...</div>}>
            <AllProductsContent />
        </Suspense>
    );
}
