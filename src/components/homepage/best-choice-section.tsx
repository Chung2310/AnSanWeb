'use client';
import { useProducts } from '@/hooks/use-products';
import { Skeleton } from '@/components/ui/skeleton';
import type { Product } from '@/lib/types';
import WineCard from '@/components/wine-card';
import React from 'react';

const ProductSectionSkeleton = () => (
     <div className="bg-[#f8f0e5] rounded-2xl p-8 md:p-12 shadow-lg">
         <div className="text-center mb-10">
            <div className="flex items-center justify-center">
                <span className="flex-grow border-t border-red-800/30"></span>
                <Skeleton className="h-10 w-2/3 md:w-1/3 mx-6" />
                <span className="flex-grow border-t border-red-800/30"></span>
            </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
                         <p className="mt-4 text-lg text-Các dòng vang đặc biệt nhà Ansan-600 text-center"></p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {bestChoiceProducts.map(product => (
                            <WineCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
