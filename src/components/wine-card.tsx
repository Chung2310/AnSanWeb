import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import React from 'react';

type WineCardProps = {
  product: Product;
};

export default function WineCard({ product }: WineCardProps) {
  const formatPrice = (price: number) => {
    if (isNaN(price)) return '';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const hasDiscount = product.secondaryPrice && product.secondaryPrice > product.price;
  const discountPercentage = hasDiscount ? Math.round(((product.secondaryPrice! - product.price) / product.secondaryPrice!) * 100) : 0;

  return (
    <div className="group text-center">
      <Link href={`/san-pham/${product.slug}`} className="block">
        <div className="relative overflow-hidden">
            {product.bestChoice && (
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
                    <span className="text-sm text-muted-foreground line-through">{formatPrice(product.secondaryPrice!)}</span>
                    <span className="text-lg font-bold text-destructive">{formatPrice(product.price)}</span>
                </div>
            ) : (
                <p className="mt-2 text-lg font-bold text-primary">{formatPrice(product.price)}</p>
            )}
        </div>
      </Link>
    </div>
  );
}
