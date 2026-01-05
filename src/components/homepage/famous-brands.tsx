'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { cn } from '@/lib/utils';
import Autoplay from "embla-carousel-autoplay";

const brandLogos = [
  'brand-macallan',
  'brand-lakes',
  'brand-ichiros',
  'brand-springbank',
  'brand-yamazaki',
  'brand-glenfiddich',
];

export default function FamousBrands() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }
    setCurrent(api.selectedScrollSnap() + 1)
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])


  return (
    <section className="py-16 bg-white">
      <div className="container">
        <h2 className="text-center text-3xl font-bold tracking-wider uppercase" style={{color: '#8a7d6a'}}>
          Những Thương Hiệu Nổi Tiếng
        </h2>
        <Carousel
          setApi={setApi}
          className="w-full mt-12"
          plugins={[ Autoplay({ delay: 3000, stopOnInteraction: true }) ]}
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="-ml-4">
            {brandLogos.map((logoId, index) => {
              const logo = PlaceHolderImages.find(img => img.id === logoId);
              if (!logo) return null;
              return (
                <CarouselItem key={index} className="basis-1/4 md:basis-1/5 lg:basis-1/6 pl-4 flex justify-center">
                  <Image
                    src={logo.imageUrl}
                    alt={logo.description}
                    width={150}
                    height={80}
                    className="object-contain"
                    data-ai-hint={logo.imageHint}
                  />
                </CarouselItem>
              )
            })}
          </CarouselContent>
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: Math.ceil(brandLogos.length / 5) }).map((_, index) => (
                <button
                    key={index}
                    onClick={() => api?.scrollTo(index * 5)}
                    className={cn(
                        "w-2 h-2 rounded-full",
                        Math.ceil(current / 5) -1 === index ? "bg-stone-800" : "bg-stone-300"
                    )}
                />
            ))}
          </div>
        </Carousel>
      </div>
    </section>
  );
}
