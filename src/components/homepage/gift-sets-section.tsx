'use client';

import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';

interface GiftSetCardProps {
  imageId: string;
  category: string;
  title: string;
  href: string;
}

const giftCards: GiftSetCardProps[] = [
  {
    imageId: 'gift-set-tasting',
    category: 'Tasting Sets',
    title: 'TÌM RA HƯƠNG VỊ LAKES PHÙ HỢP',
    href: '/danh-muc/set-thu-ruou',
  },
  {
    imageId: 'gift-set-lakes',
    category: 'Gift Set',
    title: 'BỘ QUÀ TẾT THE LAKES SINGLE MALT',
    href: '/danh-muc/bo-qua-tang',
  },
];

const getImage = (id: string): ImagePlaceholder | undefined => {
  return PlaceHolderImages.find((img) => img.id === id);
};

function GiftCard({ card }: { card: GiftSetCardProps }) {
  const image = getImage(card.imageId);
  if (!image) return null;

  return (
    <Link href={card.href} className="group relative block h-[500px] w-full overflow-hidden text-white">
      <Image
        src={image.imageUrl}
        alt={card.title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        data-ai-hint={image.imageHint}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 p-8">
        <p className="font-semibold tracking-wider uppercase text-sm">{card.category}</p>
        <h3 className="mt-2 font-headline text-3xl font-black uppercase">{card.title}</h3>
        <Button
          variant="outline"
          className="mt-6 rounded-none border-2 border-white bg-transparent px-8 py-6 text-xs font-bold tracking-widest text-white transition-colors hover:bg-white hover:text-black"
        >
          KHÁM PHÁ SẢN PHẨM
        </Button>
      </div>
    </Link>
  );
}

export default function GiftSetsSection() {
  return (
    <section className="py-20" style={{ backgroundColor: '#fdfaf5' }}>
      <div className="container mx-auto max-w-screen-xl">
        <div className="text-center">
          <p className="font-semibold tracking-widest uppercase text-sm" style={{ color: '#8a7d6a' }}>
            GIFT & ACCESSORIES
          </p>
          <h2 className="mt-2 font-headline text-4xl font-black uppercase" style={{ color: '#5a5a5a' }}>
            NHỮNG SET THỬ & QUÀ TẶNG Ý NGHĨA
          </h2>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {giftCards.map((card) => (
            <GiftCard key={card.imageId} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
