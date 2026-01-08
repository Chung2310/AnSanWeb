import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';

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
          <h3 className="mt-2 font-bold text-lg leading-tight text-black uppercase group-hover:text-primary">
            {product.nameVN}
          </h3>
          <div className="mt-2 text-base font-semibold text-gray-800">
             <p>
                {formatPrice(product.price)}
                {product.priceDescription && <span className="text-sm font-normal ml-1">{product.priceDescription}</span>}
              </p>
              {product.secondaryPrice && (
                <p className="mt-1">
                  {formatPrice(product.secondaryPrice)}
                  {product.secondaryPriceDescription && <span className="text-sm font-normal ml-1">{product.secondaryPriceDescription}</span>}
                </p>
              )}
          </div>
        </div>
      </Link>
    </div>
  );
}
