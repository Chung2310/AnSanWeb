import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
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

type WineCardProps = {
  product: Product;
};

export default function WineCard({ product }: WineCardProps) {
  const formatPrice = (price: number) => {
    if (isNaN(price)) return '';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const salePrice = Number(product.price);
  const originalPrice = product.secondaryPrice ? Number(product.secondaryPrice) : null;

  const hasDiscount = originalPrice !== null && isFinite(originalPrice) && isFinite(salePrice) && originalPrice > salePrice;
  const discountPercentage = hasDiscount ? Math.round(((originalPrice! - salePrice!) / originalPrice!) * 100) : 0;

  return (
    <div className="group text-center">
      <Link href={`/san-pham/${product.slug}`} className="block">
        <div className="relative overflow-hidden">
            {product.isGoodPrice ? (
                 <div className="absolute top-2 left-2 z-10 flex items-center gap-1 rounded-sm bg-destructive px-3 py-1.5 text-xs font-bold uppercase text-destructive-foreground animate-flash">
                    <SaleIcon className="h-4 w-4" />
                    <span>Giá Đặc biệt</span>
                </div>
            ) : hasDiscount ? (
                <div className="absolute top-2 left-2 z-10 flex items-center gap-1 rounded-sm bg-destructive px-3 py-1.5 text-xs font-bold uppercase text-destructive-foreground animate-flash">
                    <SaleIcon className="h-4 w-4" />
                    <span>Giá đặc biệt</span>
                </div>
            ) : product.bestChoice && (
                <div className="absolute top-2 left-2 z-10 rounded-sm bg-destructive px-3 py-1 text-xs font-bold uppercase text-destructive-foreground">
                    Best Choice
                </div>
            )}
            {hasDiscount && (
                <div className="absolute top-2 right-2 z-10 rounded-md bg-destructive px-2 py-1 text-xs font-bold text-destructive-foreground">
                    -{discountPercentage}%
                </div>
            )}
            <Image
                src={product.image?.url || '/placeholder.svg'}
                alt={product.nameVN}
                width={400}
                height={400}
                className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
            />
        </div>
        <div className="mt-4">
            <h3 className="font-headline text-lg font-bold uppercase text-foreground transition-colors group-hover:text-primary" title={product.nameVN}>
                {product.nameVN}
            </h3>
            {hasDiscount ? (
                <div className="mt-2 flex items-baseline justify-center gap-2">
                    <span className="text-sm text-muted-foreground line-through">{formatPrice(originalPrice!)}</span>
                    <span className="text-lg font-bold text-destructive">{formatPrice(salePrice)}</span>
                </div>
            ) : (
                <p className="mt-2 text-lg font-bold text-primary">{formatPrice(salePrice)}</p>
            )}
        </div>
      </Link>
    </div>
  );
}
