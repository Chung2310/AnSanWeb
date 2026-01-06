import Image from 'next/image';
import Link from 'next/link';
import type { Wine } from '@/lib/types';

type WineCardProps = {
  wine: Wine;
};

export default function WineCard({ wine }: WineCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="group text-center">
      <Link href={`/san-pham/${wine.slug}`} className="text-black hover:text-black">
        <div className="bg-secondary p-4">
          <Image
            src={wine.image?.url || '/placeholder.svg'}
            alt={wine.nameVN}
            width={600}
            height={800}
            className="h-64 w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-4 bg-white">
          <p className="text-xs text-gray-500 uppercase tracking-wider">{wine.attributes.find(a => a.label.toLowerCase() === 'xuất xứ')?.value || 'N/A'}</p>
          <h3 className="mt-2 font-bold text-lg leading-tight text-black uppercase truncate group-hover:text-primary">
            {wine.nameVN}
          </h3>
          <p className="mt-2 text-base font-semibold text-gray-800">{formatPrice(wine.price)}</p>
        </div>
      </Link>
    </div>
  );
}
