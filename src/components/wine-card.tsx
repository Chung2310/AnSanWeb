import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';

type WineCardProps = {
  product: Product;
};

export default function WineCard({ product }: WineCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="group text-center">
      <Link href={`/san-pham/${product.slug}`} className="text-black hover:text-black">
        <div className="bg-secondary p-4">
          <Image
            src={product.image?.url || '/placeholder.svg'}
            alt={product.nameVN}
            width={600}
            height={800}
            className="h-64 w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-4 bg-white">
          <h3 className="mt-2 font-bold text-lg leading-tight text-black uppercase truncate group-hover:text-primary">
            {product.nameVN}
          </h3>
          <p className="mt-2 text-base font-semibold text-gray-800">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </div>
  );
}
