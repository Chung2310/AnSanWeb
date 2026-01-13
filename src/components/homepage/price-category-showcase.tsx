
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

// Tạm thời dùng chung 1 ảnh cho tất cả category
// Bạn sẽ cập nhật src riêng cho từng cái sau
const TEMP_IMAGE_SRC = '/images/homepage/Chivas.png';

const priceCategories: PriceCategory[] = [
    {
        src: TEMP_IMAGE_SRC,
        title: 'Vang Đức',
        href: '/danh-muc/ruou-vang/vang-duc',
    },
    {
        src: TEMP_IMAGE_SRC,
        title: 'Vang Nga',
        href: '/danh-muc/ruou-vang/vang-nga',
    },
    {
        src: TEMP_IMAGE_SRC,
        title: 'Vang Pháp',
        href: '/danh-muc/ruou-vang/vang-phap',
    },
    {
        src: TEMP_IMAGE_SRC,
        title: 'Vang Tây Ban Nha',
        href: '/danh-muc/ruou-vang/vang-tay-ban-nha',
    },
    {
        src: TEMP_IMAGE_SRC,
        title: 'Vang Ý',
        href: '/danh-muc/ruou-vang/vang-y',
    },
    {
        src: TEMP_IMAGE_SRC,
        title: 'Chivas Series',
        href: '/danh-muc/ruou-manh/chivas',
    },
    {
        src: TEMP_IMAGE_SRC,
        title: 'John Walker Series',
        href: '/danh-muc/ruou-manh/john-walker',
    },
    {
        src: TEMP_IMAGE_SRC,
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
                className="basis-full md:basis-4/5 lg:basis-1/2 pl-4 md:pl-6"
              >
                <Link href={category.href}>
                  <div className="relative aspect-[2/1] w-full text-white rounded-lg overflow-hidden">
                    <Image 
                      src={category.src}
                      alt={category.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 50vw"
                    />
                    <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end items-start bg-gradient-to-t from-black/70 to-transparent">
                      <h3 className="font-headline text-3xl md:text-4xl font-black uppercase">
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
      </div>
    </motion.section>
  );
}
