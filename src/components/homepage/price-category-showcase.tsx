'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Autoplay from "embla-carousel-autoplay";

interface PriceCategory {
  imageId: string;
  title: string;
  href: string;
  bgColor: string;
}

const priceCategories: PriceCategory[] = [
  {
    imageId: 'price-category-20',
    title: 'WHISKY DƯỚI 20 TRIỆU',
    href: '/danh-muc/duoi-20-trieu',
    bgColor: '#982c24'
  },
  {
    imageId: 'price-category-10',
    title: 'WHISKY DƯỚI 10 TRIỆU',
    href: '/danh-muc/duoi-10-trieu',
    bgColor: '#8a7d6a'
  },
  {
    imageId: 'price-category-5',
    title: 'WHISKY DƯỚI 5 TRIỆU',
    href: '/danh-muc/duoi-5-trieu',
    bgColor: '#3a3a3a'
  },
    {
    imageId: 'price-category-under-5',
    title: 'WHISKY DƯỚI 4 TRIỆU',
    href: '/danh-muc/duoi-4-trieu',
    bgColor: '#6a5d4d'
  }
];

const getImage = (id: string): ImagePlaceholder | undefined => {
  return PlaceHolderImages.find(img => img.id === id);
}

export default function PriceCategoryShowcase() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    
    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };
    
    api.on("select", onSelect);
    
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <section className="py-12" style={{ backgroundColor: '#fdfaf5' }}>
      <div className="container mx-auto max-w-screen-xl">
        <Carousel
          setApi={setApi}
          plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]}
          opts={{ loop: true, align: 'start' }}
        >
          <CarouselContent className="-ml-4">
            {priceCategories.map((category, index) => {
              const image = getImage(category.imageId);
              if (!image) return null;

              return (
                <CarouselItem key={index} className="pl-4 md:basis-1/2">
                  <div className="relative h-[450px] flex items-center justify-center p-8 overflow-hidden" style={{backgroundColor: category.bgColor}}>
                     <div className="absolute inset-0 z-0">
                         <Image 
                            src={image.imageUrl}
                            alt={category.title}
                            fill
                            className="object-cover"
                            data-ai-hint={image.imageHint}
                         />
                     </div>
                    <div className="relative z-10 text-center text-white">
                      <h3 className="font-headline text-4xl font-black uppercase">
                        {category.title}
                      </h3>
                      <Button asChild variant="outline" className="mt-6 bg-transparent border-white text-white hover:bg-white hover:text-black rounded-sm px-8 py-5 transition-all text-xs font-bold tracking-widest">
                        <Link href={category.href}>KHÁM PHÁ SẢN PHẨM</Link>
                      </Button>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <div className="flex justify-center mt-8 space-x-2">
            {priceCategories.map((_, index) => (
                <button
                    key={index}
                    onClick={() => api?.scrollTo(index)}
                    className={cn(
                        "w-2.5 h-2.5 rounded-full transition-colors",
                        current === index ? "bg-stone-800" : "bg-stone-400 hover:bg-stone-600"
                    )}
                    aria-label={`Go to slide ${index + 1}`}
                />
            ))}
          </div>
        </Carousel>
      </div>
    </section>
  );
}
