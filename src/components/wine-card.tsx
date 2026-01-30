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

  return (
    <div className="group text-center">
      <Link href={`/san-pham/${product.slug}`} className="block">
        <div className="relative overflow-hidden">
            {product.bestChoice && (
                <div className="absolute top-2 left-2 z-10 rounded-sm bg-destructive px-3 py-1 text-xs font-bold uppercase text-destructive-foreground">
                    Best Choice
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
            <p className="mt-2 text-lg font-bold text-primary">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </div>
  );
}
