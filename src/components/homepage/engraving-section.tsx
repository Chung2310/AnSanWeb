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
        {/* The carousel has been removed as per your request. */}
      </div>
    </section>
  );
}
