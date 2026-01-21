'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Autoplay from "embla-carousel-autoplay";
import { motion, useInView, useAnimation } from 'framer-motion';

interface PriceCategory {
  src: string;
  title: string;
  href: string;
}

const priceCategories: PriceCategory[] = [
    {
        src: "https://res.cloudinary.com/dxukxjf6w/image/upload/v1768965642/Baner_r%C6%B0%E1%BB%A3u_web-06_und4dc.jpg",
        title: 'Vang Đức',
        href: '/danh-muc/ruou-vang/vang-duc',
    },
    {
        src: "https://res.cloudinary.com/dxukxjf6w/image/upload/v1768965639/Baner_r%C6%B0%E1%BB%A3u_web-07_enldf1.jpg",
        title: 'Vang Nga',
        href: '/danh-muc/ruou-vang/vang-nga',
    },
    {
        src: "https://res.cloudinary.com/dxukxjf6w/image/upload/v1768965639/Baner_r%C6%B0%E1%BB%A3u_web-04_lwieht.jpg",
        title: 'Vang Pháp',
        href: '/danh-muc/ruou-vang/vang-phap',
    },
    {
        src: "https://res.cloudinary.com/dxukxjf6w/image/upload/v1768965639/Baner_r%C6%B0%E1%BB%A3u_web-05_vq3ezy.jpg",
        title: 'Vang Tây Ban Nha',
        href: '/danh-muc/ruou-vang/vang-tay-ban-nha',
    },
    {
        src: "https://res.cloudinary.com/dxukxjf6w/image/upload/v1768965637/R%C6%B0%E1%BB%A3u_bestchoise-01_3_g5resg.jpg",
        title: 'Vang Ý',
        href: '/danh-muc/ruou-vang/vang-y',
    },
    {
        src: "https://res.cloudinary.com/dxukxjf6w/image/upload/v1768965638/Baner_r%C6%B0%E1%BB%A3u_web-08_z67cs4.jpg",
        title: 'Vang Úc',
        href: '/danh-muc/ruou-vang/vang-uc',
    },
    {
        src: '/images/homepage/Chivas.png',
        title: 'Chivas Series',
        href: '/danh-muc/ruou-manh/chivas',
    },
    {
        src: '/images/homepage/Chivas.png',
        title: 'John Walker Series',
        href: '/danh-muc/ruou-manh/john-walker',
    },
    {
        src: '/images/homepage/Chivas.png',
        title: 'Rượu mạnh khác',
        href: '/danh-muc/ruou-manh',
    }
];

export default function PriceCategoryShowcase() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView, mainControls]);

  useEffect(() => {
    if (!api) {
      return;
    }

    const onSelect = (api: CarouselApi) => {
      if (!api) return;
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <motion.section 
      ref={ref}
      variants={{
        hidden: { opacity: 0, y: 75 },
        visible: { opacity: 1, y: 0 },
      }}
      initial="hidden"
      animate={mainControls}
      transition={{ duration: 1, delay: 0.4 }}
      className="py-12" 
      style={{ backgroundColor: '#fdfaf5' }}
    >
      <div className="container mx-auto max-w-screen-xl">
        <Carousel
          setApi={setApi}
          plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]}
          opts={{ loop: true, align: 'start' }}
        >
          <CarouselContent className="items-center">
            {priceCategories.map((category, index) => (
              <CarouselItem 
                key={category.href}
                className="basis-full md:basis-4/5 lg:basis-4/5 pl-4 md:pl-6"
              >
                <Link href={category.href}>
                  <div className="relative aspect-[2/1] w-full text-white rounded-lg overflow-hidden">
                    <Image 
                      src={category.src}
                      alt={category.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 80vw"
                    />
                    <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end items-start">
                      <h3 className="font-headline text-3xl md:text-4xl font-black uppercase text-shadow">
                        {category.title}
                      </h3>
                      <Button 
                        asChild 
                        variant="outline" 
                        className="mt-4 bg-transparent border-white text-white hover:bg-white hover:text-black rounded-sm px-6 py-4 transition-all text-xs font-bold tracking-widest"
                      >
                        <span className="cursor-pointer">KHÁM PHÁ SẢN PHẨM</span>
                      </Button>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Dot navigation */}
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
        <style jsx>{`
            .text-shadow {
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
            }
        `}</style>
      </div>
    </motion.section>
  );
}
