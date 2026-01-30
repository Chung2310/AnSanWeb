import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import React from 'react';
import { Button } from './ui/button';
import { Grape, Wine, Home, Globe, Percent } from 'lucide-react';
import { cn } from '@/lib/utils';

type WineCardProps = {
  product: Product;
};

export default function WineCard({ product }: WineCardProps) {
  const formatPrice = (price: number) => {
    if (isNaN(price)) return '';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };
  
  const getAttribute = (labels: string[]): string | undefined => {
    if (!product.attributes) return undefined;
    for (const label of labels) {
        const found = product.attributes.find(a => a.label.toLowerCase().trim() === label.toLowerCase().trim());
        if (found && found.value) return found.value;
    }
    return undefined;
  };

  const grape = getAttribute(['giống nho']);
  const wineType = getAttribute(['loại']);
  const brand = getAttribute(['thương hiệu', 'nhà sản xuất/chưng cất']);
  const country = getAttribute(['xuất xứ', 'quốc gia']);
  const abv = getAttribute(['nồng độ', 'nồng độ cồn', 'alc']);
  
  const badgeText = product.bestChoice ? 'Best Choice' : product.isFeatured ? 'Nổi Bật' : null;

  return (
    <div className="relative group w-full rounded-lg bg-white p-6 border transition-shadow hover:shadow-lg">
      
      {badgeText && (
         <div className="absolute top-4 left-4 z-10 rounded-md bg-primary px-2 py-1 text-xs font-semibold uppercase text-primary-foreground">
            {badgeText}
        </div>
      )}

      {/* Top Section: Image + Specs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center border-b pb-6 mb-6">
        {/* Image Column */}
        <div className="md:col-span-1 flex items-center justify-center">
            <Link href={`/san-pham/${product.slug}`} className="block w-full">
                <div className="aspect-[3/4] w-full max-w-[150px] mx-auto relative">
                    <Image
                    src={product.image?.url || '/placeholder.svg'}
                    alt={product.nameVN}
                    fill
                    className="object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 15vw"
                    />
                </div>
            </Link>
        </div>
        
        {/* Specs Column */}
        <div className="md:col-span-2 flex flex-col justify-center space-y-3 text-sm font-medium">
             {grape && <div className="flex items-center gap-3 text-primary"><Grape className="h-5 w-5"/><span>{grape}</span></div>}
             {wineType && <div className="flex items-center gap-3 text-primary"><Wine className="h-5 w-5"/><span>{wineType}</span></div>}
             {brand && <div className="flex items-center gap-3 text-primary"><Home className="h-5 w-5"/><span>{brand}</span></div>}
             {country && <div className="flex items-center gap-3 text-primary"><Globe className="h-5 w-5"/><span>{country}</span></div>}
             {abv && <div className="flex items-center gap-3 text-primary"><Percent className="h-5 w-5"/><span>{abv}</span></div>}
        </div>
      </div>

      {/* Bottom Section: Info & Action */}
      <div>
        <Link href={`/san-pham/${product.slug}`}>
            <h3 className="font-headline text-xl font-bold leading-tight text-primary hover:text-primary/80 transition-colors">
                {product.nameVN}
            </h3>
        </Link>
        
        {product.shortDescription && <p className="mt-2 text-sm text-gray-600 line-clamp-3">{product.shortDescription}</p>}
      
        <div className="mt-4 flex items-end justify-between gap-4">
            <div>
                <p className="text-2xl font-bold text-red-600">
                    {formatPrice(product.price)}
                    {product.priceDescription && <span className="ml-1 text-sm font-normal text-gray-500">{product.priceDescription}</span>}
                </p>
                {product.secondaryPrice && (
                    <p className="text-sm font-bold text-red-600/80">
                    {formatPrice(product.secondaryPrice)}
                    {product.secondaryPriceDescription && <span className="ml-1 text-sm font-normal text-gray-500">{product.secondaryPriceDescription}</span>}
                    </p>
                )}
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase rounded-sm whitespace-nowrap shrink-0">
                Thêm vào giỏ hàng
            </Button>
        </div>
      </div>
    </div>
  );
}
