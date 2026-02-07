'use client';
import { useProducts } from '@/hooks/use-products';
import { Skeleton } from '@/components/ui/skeleton';
import type { Product } from '@/lib/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const formatPrice = (price: number) => {
    if (isNaN(price)) return '';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const GiaTotProductCard = ({ product }: { product: Product }) => {
    const salePrice = Number(product.price);
    const originalPrice = product.secondaryPrice ? Number(product.secondaryPrice) : null;
    const hasDiscount = originalPrice !== null && isFinite(originalPrice) && isFinite(salePrice) && originalPrice > salePrice;

    return (
        <div className="bg-white rounded-lg shadow-md p-4 flex flex-col text-center relative overflow-hidden group">
            <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm z-10">
                Giá Đặc Biệt
            </div>
            
            <Link href={`/san-pham/${product.slug}`}>
                <div className="relative aspect-square w-full my-4">
                    <Image
                        src={product.image?.url || '/placeholder.svg'}
                        alt={product.nameVN}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
            </Link>

            <div className="mt-auto">
                <div className="h-12 flex items-center justify-center">
                    {hasDiscount ? (
                        <div className="flex items-baseline justify-center gap-2">
                            <span className="text-sm text-gray-400 line-through">{formatPrice(originalPrice!)}</span>
                            <span className="text-xl font-bold text-red-700">{formatPrice(salePrice)}</span>
                        </div>
                    ) : (
                        <span className="text-xl font-bold text-red-700">{formatPrice(salePrice)}</span>
                    )}
                </div>
            </div>

            <Button style={{ backgroundColor: '#8B181F' }} className="mt-2 w-full text-white hover:bg-[#7f1d1d] uppercase font-bold rounded-md">
                THÊM VÀO GIỎ HÀNG
            </Button>

            <h3 className="mt-3 text-sm font-semibold text-gray-800 h-10 flex items-center justify-center">
                <Link href={`/san-pham/${product.slug}`} className="hover:text-primary">
                    {product.nameVN}
                </Link>
            </h3>
        </div>
    );
}

const ProductCardSkeleton = () => (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col text-center">
        <Skeleton className="relative aspect-square w-full my-4" />
        <Skeleton className="h-8 w-3/4 mx-auto" />
        <Skeleton className="h-10 w-full mt-4 rounded-md" />
        <Skeleton className="h-5 w-full mt-3" />
    </div>
);

export default function GiaTotPage() {
  const { products, isLoading } = useProducts();
  
  const goodPriceProducts = products?.filter(wine => wine.isGoodPrice) || [];

  if (isLoading) {
    return (
       <div style={{ backgroundColor: '#fdf2e9' }}>
          <div className="container mx-auto max-w-screen-xl px-4 py-12">
            <div className="text-center mb-12">
                <div className="flex items-center justify-center">
                    <span className="flex-grow border-t border-red-800/30"></span>
                    <Skeleton className="h-10 w-1/3 mx-8" />
                    <span className="flex-grow border-t border-red-800/30"></span>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {Array.from({ length: 8 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                ))}
            </div>
          </div>
       </div>
    )
  }

  return (
    <section style={{ backgroundColor: '#fdf2e9' }}>
      <div className="container mx-auto max-w-screen-xl px-4 py-12">
        <div className="text-center mb-12">
            <div className="flex items-center justify-center">
                <span className="flex-grow border-t border-red-800/30"></span>
                <h2 className="mx-8 font-headline text-3xl font-bold uppercase" style={{ color: '#7f1d1d' }}>
                    Ưu đãi giá tốt
                </h2>
                <span className="flex-grow border-t border-red-800/30"></span>
            </div>
        </div>

        {goodPriceProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {goodPriceProducts.map(product => (
                    <GiaTotProductCard key={product.id} product={product} />
                ))}
            </div>
        ) : (
            <div className="text-center py-20 text-gray-500">
                <p>Hiện không có sản phẩm giá tốt nào.</p>
            </div>
        )}
      </div>
    </section>
  );
}
