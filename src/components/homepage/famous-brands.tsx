
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { cn } from '@/lib/utils';
import Autoplay from "embla-carousel-autoplay";
import { motion, useInView, useAnimation } from 'framer-motion';


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
  const [count, setCount] = useState(0)
  
  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  )

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
  }, [api])


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
        className="py-16 bg-secondary">
      <div className="container">
        <h2 className="text-center text-3xl font-bold tracking-wider uppercase" style={{color: '#3a3a3a'}}>
          Những Thương Hiệu Nổi Tiếng
        </h2>
        <Carousel
          setApi={setApi}
          className="w-full mt-12"
          plugins={[plugin.current]}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
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
                <CarouselItem key={index} className="basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/5 pl-4 flex justify-center">
                   <div className="relative h-20 w-36">
                    <Image
                      src={logo.imageUrl}
                      alt={logo.description}
                      fill
                      sizes="(max-width: 768px) 33vw, 20vw"
                      className="object-contain"
                      data-ai-hint={logo.imageHint}
                    />
                  </div>
                </CarouselItem>
              )
            })}
          </CarouselContent>
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: count }).map((_, index) => (
                <button
                    key={index}
                    onClick={() => api?.scrollTo(index)}
                    className={cn(
                        "w-2 h-2 rounded-full",
                        current === index ? "bg-stone-800" : "bg-stone-300"
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
