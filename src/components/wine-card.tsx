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
    <div className="bg-white border rounded-lg p-4 flex flex-col h-full group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      
      <Link href={`/san-pham/${product.slug}`} className="block relative w-full h-48 mb-4">
        {badgeText && (
          <div className="absolute top-0 left-0 z-10 rounded-br-lg bg-primary px-2 py-1 text-xs font-semibold uppercase text-primary-foreground">
              {badgeText}
          </div>
        )}
        <Image
          src={product.image?.url || '/placeholder.svg'}
          alt={product.nameVN}
          fill
          className="object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
        />
      </Link>

      <div className="space-y-1.5 text-xs text-gray-500 mb-3">
        {grape && <div className="flex items-center gap-2 truncate"><Grape size={14} className="text-primary/70 shrink-0" /><span>{grape}</span></div>}
        {wineType && <div className="flex items-center gap-2 truncate"><Wine size={14} className="text-primary/70 shrink-0"/><span>{wineType}</span></div>}
        {brand && <div className="flex items-center gap-2 truncate"><Home size={14} className="text-primary/70 shrink-0"/><span>{brand}</span></div>}
        {country && <div className="flex items-center gap-2 truncate"><Globe size={14} className="text-primary/70 shrink-0"/><span>{country}</span></div>}
        {abv && <div className="flex items-center gap-2 truncate"><Percent size={14} className="text-primary/70 shrink-0"/><span>{abv}</span></div>}
      </div>

      <div className="flex-grow">
        <Link href={`/san-pham/${product.slug}`}>
            <h3 className="font-headline font-bold text-base leading-snug text-primary group-hover:text-primary/80 transition-colors line-clamp-2" title={product.nameVN}>
                {product.nameVN}
            </h3>
        </Link>
        {product.shortDescription && <p className="mt-2 text-xs text-gray-500 line-clamp-2">{product.shortDescription}</p>}
      </div>

      <div className="mt-4 pt-4 border-t flex items-center justify-between">
        <div className='flex flex-col'>
            <p className="text-base font-bold text-red-600 leading-tight">
              {formatPrice(product.price)}
              {product.priceDescription && <span className="ml-1 text-xs font-normal text-gray-500">{product.priceDescription}</span>}
            </p>
            {product.secondaryPrice && (
                <p className="text-xs font-bold text-red-600/80 leading-tight">
                {formatPrice(product.secondaryPrice)}
                {product.secondaryPriceDescription && <span className="ml-1 text-xs font-normal text-gray-500">{product.secondaryPriceDescription}</span>}
                </p>
            )}
        </div>
        <Button size="sm" className="bg-primary text-xs font-bold uppercase rounded-sm h-9 px-3">
            Thêm vào giỏ
        </Button>
      </div>
    </div>
  );
}
