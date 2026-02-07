'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { cn } from '@/lib/utils';
import Autoplay from "embla-carousel-autoplay";
import { motion, useInView, useAnimation } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';


const brandLogos = [
  'brand-chivas-regal',
  'brand-mortlach',
  'brand-royal-salute',
  'brand-singleton',
  'brand-macallan-new',
  'brand-ballantines-new',
  'brand-coli',
  'brand-johnnie-walker',
  'brand-ballantines-finest',
  'brand-unnamed-design',
  'brand-piandimare',
  'brand-cantine-sgarzi-luigi',
  'brand-piandimare-alt',
  'brand-c-and-c',
  'brand-domaine-de-la-baume',
  'brand-barbanera',
  'brand-hechtsheimer-winzer',
  'brand-gcf',
];

export default function FamousBrands() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  
  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  )

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const mainControls = useAnimation();
  const isMobile = useIsMobile();
  const chunkSize = isMobile ? 3 : 5;
  const logoChunks = [];
  for (let i = 0; i < brandLogos.length; i += chunkSize) {
      const chunk = brandLogos.slice(i, i + chunkSize);
      logoChunks.push(chunk);
  }

  useEffect(() => {
      if (isInView) {
          mainControls.start("visible");
      }
  }, [isInView, mainControls]);

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    const onSelect = (api: CarouselApi) => {
      if (!api) {
        return;
      }
      setCurrent(api.selectedScrollSnap())
    }

    api.on("select", onSelect)
    
    return () => {
      api.off("select", onSelect)
    }
  }, [api, isMobile])

  return (
    <motion.section 
        ref={ref}
        variants={{
            hidden: { opacity: 0, y: 75 },
            visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration: 1, delay: 0.3 }}
        className="py-16 bg-white">
      <div className="container">
        <h2 className="text-center font-headline text-3xl font-black uppercase" style={{color: '#5a5a5a'}}>
          Những Thương Hiệu Nổi Tiếng
        </h2>
        <Carousel
          setApi={setApi}
          className="w-full mt-12"
          plugins={[plugin.current]}
          opts={{
            align: "start",
            loop: true,
          }}
          key={chunkSize}
        >
          <CarouselContent className="-ml-4">
            {logoChunks.map((chunk, chunkIndex) => (
                <CarouselItem key={chunkIndex} className="basis-full pl-4">
                  <div className="flex justify-center items-center gap-4 h-24">
                    {chunk.map((logoId) => {
                      const logo = PlaceHolderImages.find(img => img.id === logoId);
                      if (!logo) return null;
                      // Skip rendering the white logo
                      if (logoId === 'brand-ichiros') return null;
                      return (
                          <div key={logoId} className="relative h-24 w-36">
                            <Image
                              src={logo.imageUrl}
                              alt={logo.description}
                              fill
                              sizes="(max-width: 768px) 33vw, 20vw"
                              className={cn(
                                "object-contain",
                                (logoId === 'brand-lakes' || logoId === 'brand-sgarzi-luigi') && 'mix-blend-multiply'
                              )}
                              data-ai-hint={logo.imageHint}
                            />
                          </div>
                      )
                    })}
                  </div>
                </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: count }).map((_, index) => (
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
