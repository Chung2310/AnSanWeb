
'use client';

import { useMemo } from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { useProducts } from '@/hooks/use-products';
import { Separator } from '@/components/ui/separator';

function ProductDetailPageSkeleton() {
  return (
    <div className="container mx-auto max-w-4xl py-12 md:py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <Skeleton className="w-full aspect-square" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { products, isLoading } = useProducts();

  const product = useMemo(() => {
    if (!products) return null;
    return products.find((p) => p.slug === slug) || null;
  }, [products, slug]);

  if (isLoading) {
    return <ProductDetailPageSkeleton />;
  }

  if (!product) {
    notFound();
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="bg-white text-black">
      <div className="container mx-auto max-w-4xl py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Image Column */}
          {product.image?.url && (
            <div className="bg-secondary rounded-lg p-8 sticky top-24">
              <Image
                src={product.image.url}
                alt={product.nameVN}
                width={800}
                height={800}
                className="w-full h-auto object-contain aspect-square"
                priority
              />
            </div>
          )}

          {/* Details Column */}
          <div className="space-y-6">
            <div>
              <h1 className="font-headline text-3xl md:text-4xl font-bold text-gray-800">
                {product.nameVN}
              </h1>
              <p className="text-3xl font-semibold text-primary mt-4">
                {formatPrice(product.price)}
              </p>
            </div>
            
            {product.description && (
                <div>
                    <Separator className="my-6" />
                    <h2 className="text-lg font-bold text-gray-700 mb-4">
                        Mô Tả Sản Phẩm
                    </h2>
                    <div 
                        className="prose prose-sm dark:prose-invert max-w-none text-gray-600 leading-relaxed" 
                        dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br />') }}
                    >
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
