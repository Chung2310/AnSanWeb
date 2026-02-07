'use client';

import React from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

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

const FamousBrands = () => {
    const plugin = React.useRef(
        Autoplay({ delay: 2000, stopOnInteraction: false, stopOnMouseEnter: true })
    );

    return (
        <section className="py-16 bg-white">
            <div className="container">
                <h2 className="text-center font-headline text-3xl font-black uppercase" style={{ color: '#5a5a5a' }}>
                    Những Thương Hiệu Nổi Tiếng
                </h2>
                <div className="relative mt-12 w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
                    <Carousel
                        plugins={[plugin.current]}
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-4">
                            {brandLogos.map((logoId, index) => {
                                const logo = PlaceHolderImages.find(img => img.id === logoId);
                                if (!logo || logoId === 'brand-ichiros') return null;
                                return (
                                    <CarouselItem key={`${logoId}-${index}`} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6 pl-4">
                                        <div className="p-4">
                                            <div className="relative h-20">
                                                <Image
                                                    src={logo.imageUrl}
                                                    alt={logo.description}
                                                    fill
                                                    sizes="20vw"
                                                    className={cn(
                                                        "object-contain",
                                                        (logoId === 'brand-lakes' || logoId === 'brand-sgarzi-luigi') && 'mix-blend-multiply'
                                                    )}
                                                    data-ai-hint={logo.imageHint}
                                                />
                                            </div>
                                        </div>
                                    </CarouselItem>
                                );
                            })}
                        </CarouselContent>
                    </Carousel>
                </div>
            </div>
        </section>
    );
};

export default FamousBrands;
