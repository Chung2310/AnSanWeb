
'use client';
import { useProducts } from '@/hooks/use-products';
import { Skeleton } from '@/components/ui/skeleton';
import type { Product } from '@/lib/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

const SaleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 36 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M6 13H2" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        <path d="M9 16H2" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        <path d="M6 19H2" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        <path d="M24.5 2L15 14H22.5L20.5 28L32 16H24.5V2Z" fill="#FBBF24" stroke="#FDE68A" strokeWidth="1.5"/>
        <circle cx="18" cy="15" r="9" fill="#EF4444" stroke="#F87171" strokeWidth="1.5" />
        <text x="18" y="18.5" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="sans-serif">%</text>
    </svg>
);

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
                <div className="absolute top-3 left-3 bg-red-700 text-white text-xs font-bold uppercase px-3 py-1.5 rounded-sm z-10 flex items-center animate-flash">
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

  const sparklingWines = React.useMemo(() => 
    goodPriceProducts.filter(p => p.tags?.includes('ruou-vang-sui') || p.tags?.includes('ruou-vang-0-do') || p.tags?.includes('champagne'))
  , [goodPriceProducts]);

  if (isLoading) {
    return <PageSkeleton />
  }

  const allCategorizedIds = new Set([
    ...redWines.map(p => p.id),
    ...whiteWines.map(p => p.id),
    ...sparklingWines.map(p => p.id)
  ]);
  const otherWines = goodPriceProducts.filter(p => !allCategorizedIds.has(p.id));

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto max-w-screen-xl px-4">
        <ProductSection title="Giá hợp lý cho mọi khoảnh khắc trên bàn tiệc" products={otherWines} />
        <ProductSection title="Vang Đỏ Giá Tốt" products={redWines} />
        <ProductSection title="Vang Trắng Giá Tốt" products={whiteWines} />
        <ProductSection title="Vang 0 độ – Giá tốt dễ chọn, an tâm thưởng thức" products={sparklingWines} />
        
        {goodPriceProducts.length === 0 && !isLoading && (
            <div className="text-center py-20 text-gray-500">
                <p>Hiện không có sản phẩm giá tốt nào.</p>
            </div>
        )}
      </div>
    </section>
  );
}
