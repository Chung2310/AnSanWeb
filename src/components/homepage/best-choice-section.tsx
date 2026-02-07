'use client';
import { useProducts } from '@/hooks/use-products';
import { Skeleton } from '@/components/ui/skeleton';
import type { Product } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const formatPrice = (price: number) => {
    if (isNaN(price)) return '';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

// This card is based on GiaTotProductCard
const BestChoiceProductCard = ({ product }: { product: Product }) => {
    const salePrice = Number(product.price);
    const originalPrice = product.secondaryPrice ? Number(product.secondaryPrice) : null;
    const hasDiscount = originalPrice !== null && isFinite(originalPrice) && isFinite(salePrice) && originalPrice > salePrice;

    return (
        <div className="bg-white rounded-lg p-4 flex flex-col text-center relative overflow-hidden group">
            <div className="absolute top-3 right-3 bg-destructive text-white text-xs font-bold uppercase px-3 py-1.5 rounded-sm z-10 flex items-center gap-1 animate-flash">
                Best Choice
            </div>
            
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

const ProductSectionSkeleton = () => (
     <div className="bg-[#f8f0e5] rounded-2xl p-8 md:p-12 shadow-lg">
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
);

export default function BestChoiceSection() {
    const { products, isLoading } = useProducts();
    
    const bestChoiceProducts = React.useMemo(() => {
        if (!products) return [];

        const bestChoiceProductNames = [
            "Old Vine Cabernet Sauvignon",
            "Old Vine Shiraz",
            "Gigino Grande (Phiên bản kỷ niệm 80 năm) – Vang Đỏ",
            "Sgarzi Luigi Primitivo di Manduria DOC",
            "Piandimare \"Tassanera\" Montepulciano d'Abruzzo Riserva",
            "Enzo Vincenzo Appassimento Puglia IGT",
            "Grande Alberone Moscato",
        ].map(name => name.replace(/\u200B/g, '').trim());

        return products.filter(p => bestChoiceProductNames.includes(p.nameVN.replace(/\u200B/g, '').trim()));
    }, [products]);

    if (isLoading) {
        return <div className="bg-white py-12"><div className="container"><ProductSectionSkeleton /></div></div>
    }

    if (!bestChoiceProducts || bestChoiceProducts.length === 0) {
        return null;
    }

    return (
        <section className="bg-white py-12">
            <div className="container mx-auto max-w-screen-xl px-4">
                <div className="bg-[#f8f0e5] rounded-2xl p-8 md:p-12 shadow-lg">
                    <div className="text-center mb-10">
                        <div className="flex items-center justify-center">
                            <span className="flex-grow border-t border-red-800/30"></span>
                            <h2 className="mx-6 font-headline text-2xl md:text-3xl font-bold uppercase" style={{ color: '#7f1d1d' }}>
                                Khách hàng yêu thích
                            </h2>
                            <span className="flex-grow border-t border-red-800/30"></span>
                        </div>
                         <p className="mt-4 text-lg text-gray-600">Các dòng vang đặc biệt nhà Ansan - Hiển thị các sản phẩm best choice</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {bestChoiceProducts.map(product => (
                            <BestChoiceProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
