
'use client';

import { useMemo } from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { collection, query, where, doc } from 'firebase/firestore';
import { useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import type { Product, ProductDetail, FullProduct } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { allTags } from '@/lib/tags-data';

function ProductDetailPageSkeleton() {
  return (
    <div className="bg-white text-black py-12 md:py-20">
      <div className="container max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <Skeleton className="w-full aspect-square" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const firestore = useFirestore();

  const productsCollection = useMemoFirebase(() => collection(firestore, 'products'), [firestore]);
  const productQuery = useMemoFirebase(() => productsCollection && query(productsCollection, where('slug', '==', slug)), [productsCollection, slug]);

  const { data: products, isLoading: isProductLoading } = useCollection<Product>(productQuery);
  const product = useMemo(() => (products && products.length > 0 ? products[0] : null), [products]);

  const detailRef = useMemoFirebase(() => product && doc(firestore, 'product_details', product.id), [firestore, product]);
  const { data: productDetail, isLoading: isDetailLoading } = useDoc<ProductDetail>(detailRef);

  const fullProduct: FullProduct | null = useMemo(() => {
    if (!product) return null;
    return { ...product, ...productDetail };
  }, [product, productDetail]);

  const isLoading = isProductLoading || isDetailLoading;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };
  
  const getTagLabel = (tagId: string) => {
    return allTags.find(t => t.id === tagId)?.label || tagId;
  }

  if (isLoading) {
    return <ProductDetailPageSkeleton />;
  }

  if (!fullProduct) {
    notFound();
  }

  return (
    <div className="bg-white text-black">
      <div className="container mx-auto max-w-5xl py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Image Column */}
          <div className="sticky top-24">
            {fullProduct.image?.url && (
              <div className="bg-secondary rounded-lg p-8">
                <Image
                  src={fullProduct.image.url}
                  alt={fullProduct.nameVN}
                  width={800}
                  height={800}
                  className="w-full h-auto object-contain aspect-square drop-shadow-2xl"
                  priority
                />
              </div>
            )}
            {fullProduct.isNew && (
                <Badge className="absolute top-4 left-4" variant="destructive">MỚI</Badge>
            )}
             {fullProduct.isFeatured && (
                <Badge className="absolute top-4 right-4">NỔI BẬT</Badge>
            )}
          </div>

          {/* Details Column */}
          <div className="space-y-8">
            <div>
              <h1 className="font-headline text-3xl md:text-4xl font-bold text-gray-800">
                {fullProduct.nameVN}
              </h1>
              <p className="text-3xl font-semibold text-primary mt-4">
                {formatPrice(fullProduct.price)}
              </p>
            </div>

            <Separator />
            
            <div>
                <h2 className="text-lg font-bold text-gray-700 mb-4">Thông tin chi tiết</h2>
                <div className="space-y-3 text-gray-600">
                    {fullProduct.attributes.map(attr => (
                        <div key={attr.label} className="grid grid-cols-2 gap-4">
                            <span className="font-semibold">{attr.label}:</span>
                            <span>{attr.value}</span>
                        </div>
                    ))}
                    <div className="grid grid-cols-2 gap-4">
                        <span className="font-semibold">Tình trạng:</span>
                        <span>Còn hàng</span>
                    </div>
                </div>
            </div>

            <Button size="lg" className="w-full h-12 text-lg">
              Liên Hệ Đặt Hàng
            </Button>
            
            {fullProduct.tags && fullProduct.tags.length > 0 && (
                 <div>
                    <h2 className="text-lg font-bold text-gray-700 mb-4">Loại sản phẩm</h2>
                    <div className="flex flex-wrap gap-2">
                        {fullProduct.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="font-normal">
                                {getTagLabel(tag)}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}
          </div>
        </div>

        {/* Description Section */}
        {fullProduct.description && (
          <div className="mt-20">
            <Separator />
            <div className="py-12 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
                Mô Tả Sản Phẩm
              </h2>
              <div 
                className="prose prose-lg dark:prose-invert max-w-none text-gray-600 leading-relaxed" 
                dangerouslySetInnerHTML={{ __html: fullProduct.description.replace(/\n/g, '<br />') }}
              >
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
