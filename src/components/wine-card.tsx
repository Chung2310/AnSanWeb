'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import React from 'react';
import { Maximize2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

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
        <div className="relative overflow-hidden group/image">
            {product.isGoodPrice ? (
                 <div className="absolute top-2 left-2 z-10 flex items-center rounded-sm bg-destructive px-3 py-1.5 text-xs font-bold uppercase text-destructive-foreground animate-flash">
                    <span>Giá Đặc biệt</span>
                </div>
            ) : hasDiscount ? (
                <div className="absolute top-2 left-2 z-10 flex items-center rounded-sm bg-destructive px-3 py-1.5 text-xs font-bold uppercase text-destructive-foreground animate-flash">
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

            {/* Zoom Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity bg-black/5">
                <Dialog>
                    <DialogTrigger asChild>
                        <button 
                            className="bg-white/90 p-3 rounded-full shadow-lg hover:bg-white transition-colors transform hover:scale-110 pointer-events-auto"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                        >
                            <Maximize2 className="w-5 h-5 text-gray-700" />
                        </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-none bg-transparent shadow-none flex items-center justify-center">
                        <DialogHeader className="sr-only">
                            <DialogTitle>Phóng to ảnh sản phẩm</DialogTitle>
                        </DialogHeader>
                        <div className="relative w-full h-full flex items-center justify-center bg-black/5 backdrop-blur-sm rounded-lg p-2">
                            <Image
                                src={product.image?.url || '/placeholder.svg'}
                                alt={product.nameVN}
                                width={1200}
                                height={1200}
                                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
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
