'use client';

import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';

export default function EngravingSection() {
  const image = PlaceHolderImages.find((img) => img.id === 'engraving-banner');
  if (!image) return null;

  return (
    <section className="relative h-[350px] w-full text-white">
      <Image
        src={image.imageUrl}
        alt={image.description}
        fill
        className="object-cover"
        data-ai-hint={image.imageHint}
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
        <p className="font-semibold tracking-widest uppercase text-sm">
          PERSONALISED ENGRAVING
        </p>
        <h2 className="mt-2 font-headline text-4xl font-black uppercase">
          KHẮC CHAI CÁ NHÂN HÓA
        </h2>
        <Button
          asChild
          variant="outline"
          className="mt-6 rounded-none border-2 border-white bg-transparent px-8 py-5 text-xs font-bold tracking-widest text-white transition-colors hover:bg-white hover:text-black"
        >
          <Link href="/danh-muc/khac-ten-len-chai">KHÁM PHÁ NGAY</Link>
        </Button>
      </div>
    </section>
  );
}

    