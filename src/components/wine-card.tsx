import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import type { Wine } from '@/lib/types';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

type WineCardProps = {
  wine: Wine;
};

export default function WineCard({ wine }: WineCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <Card className="group overflow-hidden rounded-lg border-none shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card">
      <Link href={`/san-pham/${wine.slug}`}>
        <div className="overflow-hidden">
          <Image
            src={wine.image.imageUrl}
            alt={wine.nameVN}
            width={600}
            height={800}
            className="h-80 w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            data-ai-hint={wine.image.imageHint}
          />
        </div>
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground">{wine.origin} - {wine.alcohol}%</p>
          <h3 className="mt-1 font-headline text-lg font-semibold leading-tight text-foreground truncate">{wine.nameVN}</h3>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-lg font-bold text-primary">{formatPrice(wine.price)}</p>
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
              Xem chi tiết <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
