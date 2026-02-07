'use client';
import { useProducts } from '@/hooks/use-products';
import { Skeleton } from '@/components/ui/skeleton';
import type { Product } from '@/lib/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Zap } from 'lucide-react';
import React from 'react';

const formatPrice = (price: number) => {
    if (isNaN(price)) return '';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

// New Card Component based on the image
const GiaTotProductCard = ({ product }: { product: Product }) => {
    const salePrice = Number(product.price);
    const originalPrice = product.secondaryPrice ? Number(product.secondaryPrice) : null;
    const hasDiscount = originalPrice !== null && isFinite(originalPrice) && isFinite(salePrice) && originalPrice > salePrice;

    return (
        <div className="bg-white rounded-lg p-4 flex flex-col text-center relative overflow-hidden group">
            {hasDiscount && (
                <div className="absolute top-3 right-3 bg-red-700 text-white text-xs font-bold uppercase px-3 py-1.5 rounded-sm z-10 flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Giá Đặc Biệt
                </div>
            )}
            
            <Link href={`/san-pham/${product.slug}`} className="block">
                <div className="relative h-56 w-full my-4">
                    <Image
                        src={product.image?.url || '/placeholder.svg'}
                        alt={product.nameVN}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
            </Link>

            <div className="mt-auto space-y-2">
                <div className="h-12 flex flex-col items-center justify-center">
                    {hasDiscount ? (
                        <>
                            <span className="text-sm text-gray-400 line-through">{formatPrice(originalPrice!)}</span>
                            <span className="text-lg font-bold text-red-700">{formatPrice(salePrice)}</span>
                        </>
                    ) : (
                        <span className="text-lg font-bold text-red-700">{formatPrice(salePrice)}</span>
                    )}
                </div>
                <Button style={{ backgroundColor: '#8B181F' }} className="w-full text-white hover:bg-[#7f1d1d] uppercase font-bold text-sm h-9">
                    THÊM VÀO GIỎ HÀNG
                </Button>
                <h3 className="pt-2 text-sm font-semibold text-gray-800 h-12 flex items-center justify-center">
                    <Link href={`/san-pham/${product.slug}`} className="hover:text-primary line-clamp-2">
                        {product.nameVN}
                    </Link>
                </h3>
            </div>
        </div>
    );
}

const ProductSection = ({ title, products }: { title: string, products: Product[] }) => {
    if (products.length === 0) {
        return null;
    }

    return (
        <div className="bg-[#f8f0e5] rounded-2xl p-8 md:p-12 mb-12 shadow-lg">
            <div className="text-center mb-10">
                <div className="flex items-center justify-center">
                    <span className="flex-grow border-t border-red-800/30"></span>
                    <h2 className="mx-6 font-headline text-2xl md:text-3xl font-bold uppercase" style={{ color: '#7f1d1d' }}>
                        {title}
                    </h2>
                    <span className="flex-grow border-t border-red-800/30"></span>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map(product => (
                    <GiaTotProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

const PageSkeleton = () => (
     <div className="bg-white px-4 py-12">
        <div className="bg-[#f8f0e5] rounded-2xl p-8 md:p-12 mb-12 shadow-lg">
             <div className="text-center mb-10">
                <div className="flex items-center justify-center">
                    <span className="flex-grow border-t border-red-800/30"></span>
                    <Skeleton className="h-10 w-2/3 md:w-1/3 mx-6" />
                    <span className="flex-grow border-t border-red-800/30"></span>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-lg p-4">
                        <Skeleton className="h-56 w-full" />
                        <Skeleton className="h-6 w-3/4 mx-auto mt-4" />
                        <Skeleton className="h-9 w-full mt-2" />
                        <Skeleton className="h-5 w-full mt-2" />
                    </div>
                ))}
            </div>
        </div>
     </div>
);

export default function GiaTotPage() {
  const { products, isLoading } = useProducts();
  
  const goodPriceProducts = React.useMemo(() => products?.filter(wine => wine.isGoodPrice) || [], [products]);
  
  const redWines = React.useMemo(() => 
    goodPriceProducts.filter(p => p.tags?.includes('ruou-vang-do'))
  , [goodPriceProducts]);
  
  const whiteWines = React.useMemo(() => 
    goodPriceProducts.filter(p => p.tags?.includes('ruou-vang-trang'))
  , [goodPriceProducts]);


  if (isLoading) {
    return <PageSkeleton />
  }

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto max-w-screen-xl px-4">
        <ProductSection title="Tiệc BBQ Đậm Chất Không Lo Về Giá" products={redWines} />
        <ProductSection title="Khai Tiệc Với Vang Trắng Giá Siêu Tốt" products={whiteWines} />
        
        {redWines.length === 0 && whiteWines.length === 0 && (
            <div className="text-center py-20 text-gray-500">
                <p>Hiện không có sản phẩm giá tốt nào.</p>
            </div>
        )}
      </div>
    </section>
  );
}