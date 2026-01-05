'use client';

import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Button } from '../ui/button';
import Link from 'next/link';

export default function FeaturedProduct() {
  const featuredImage = PlaceHolderImages.find((img) => img.id === 'featured-macallan-25');

  if (!featuredImage) return null;

  return (
    <section style={{ backgroundColor: '#8B3A3A' }} className="py-20 text-white overflow-hidden">
      <div className="container mx-auto max-w-screen-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Column: Text */}
          <div className="text-center md:text-left">
            <p className="font-semibold tracking-widest uppercase text-sm text-white/80">
              PHIÊN BẢN GIỚI HẠN
            </p>
            <h2 className="mt-4 font-headline text-4xl lg:text-5xl font-bold leading-tight uppercase">
              The Macallan 25 <br/> Sherry Oak
            </h2>
            <p className="mt-6 text-white/90 max-w-lg mx-auto md:mx-0">
              Một loại single malt whisky quý hiếm và sang trọng, được ủ trong những thùng gỗ sồi Sherry Oloroso chọn lọc từ Jerez, Tây Ban Nha. The Macallan 25 Years Old mang đến hương vị đậm đà của cam quýt, trái cây khô và khói gỗ.
            </p>
            <Button asChild variant="outline" size="lg" className="mt-10 bg-transparent border-white text-white hover:bg-white hover:text-primary rounded-none px-10 py-6 transition-transform hover:scale-105">
              <Link href="/san-pham/the-macallan-25-sherry-oak">KHÁM PHÁ NGAY</Link>
            </Button>
          </div>

          {/* Right Column: Image */}
          <div className="relative h-[500px] md:h-[600px] w-full">
            <Image
              src={featuredImage.imageUrl}
              alt={featuredImage.description}
              fill
              className="object-contain"
              data-ai-hint={featuredImage.imageHint}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
