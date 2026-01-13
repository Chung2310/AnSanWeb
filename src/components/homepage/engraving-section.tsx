'use client';

import React from 'react';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

const carouselImages = [
  '/images/2.webp',
  '/images/3.webp',
  '/images/4.webp',
];

export default function EngravingSection() {
  const plugin = React.useRef(Autoplay({ delay: 3000, stopOnInteraction: false }));

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto max-w-screen-xl">
        <Carousel
          plugins={[plugin.current]}
          className="w-full"
          opts={{
            loop: true,
          }}
        >
          <CarouselContent>
            {carouselImages.map((src, index) => (
              <CarouselItem key={index}>
                <div className="relative h-[400px] w-full">
                  <Image
                    src={src}
                    alt={`Engraving example ${index + 1}`}
                    fill
                    sizes="100vw"
                    className="object-contain"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
