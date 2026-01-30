
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import React from 'react';
import { Button } from './ui/button';
import { Grape, Wine, Home, Globe, Percent } from 'lucide-react';

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

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-lg transition-shadow hover:shadow-2xl">
      <Link href={`/san-pham/${product.slug}`} className="flex flex-col h-full">
        <div className="relative bg-secondary p-4">
          <div className="aspect-[1/1] w-full">
            <Image
              src={product.image?.url || '/placeholder.svg'}
              alt={product.nameVN}
              width={600}
              height={600}
              className="h-full w-full object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          {(product.isFeatured || product.bestChoice) && (
             <div className="absolute top-3 left-3 rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase text-primary-foreground shadow-lg">
                {product.bestChoice ? 'Best Choice' : 'Nổi Bật'}
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-6">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4 text-xs text-gray-700">
             {grape && <div className="flex items-center gap-2"><Grape className="h-4 w-4 text-primary/70"/><span>{grape}</span></div>}
             {wineType && <div className="flex items-center gap-2"><Wine className="h-4 w-4 text-primary/70"/><span>{wineType}</span></div>}
             {brand && <div className="flex items-center gap-2"><Home className="h-4 w-4 text-primary/70"/><span>{brand}</span></div>}
             {country && <div className="flex items-center gap-2"><Globe className="h-4 w-4 text-primary/70"/><span>{country}</span></div>}
             {abv && <div className="flex items-center gap-2"><Percent className="h-4 w-4 text-primary/70"/><span>{abv}</span></div>}
          </div>

          <h3 className="font-headline text-lg font-bold leading-tight text-primary">
            {product.nameVN}
          </h3>
          
          {product.shortDescription && <p className="mt-2 text-sm italic text-gray-600 flex-grow">{product.shortDescription}</p>}

          <div className="mt-auto pt-4">
            <div className="mb-4">
                 <p className="text-2xl font-bold text-red-600">
                    {formatPrice(product.price)}
                    {product.priceDescription && <span className="ml-1 text-sm font-normal text-gray-500">{product.priceDescription}</span>}
                </p>
                {product.secondaryPrice && (
                    <p className="text-base font-bold text-red-600/80">
                    {formatPrice(product.secondaryPrice)}
                    {product.secondaryPriceDescription && <span className="ml-1 text-sm font-normal text-gray-500">{product.secondaryPriceDescription}</span>}
                    </p>
                )}
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase">
              Thêm vào giỏ hàng
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
}
