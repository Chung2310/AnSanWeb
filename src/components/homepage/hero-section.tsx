'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Autoplay from "embla-carousel-autoplay";

const heroSlides = [
    { imageId: 'hero-macallan', label: 'MACALLAN 84', href: '#' },
    { imageId: 'hero-sale', label: '10% OFF', href: '#' },
    { imageId: 'hero-armagnac', label: 'ARMAGNAC', href: '#' },
    { imageId: 'hero-smws', label: 'SMWS', href: '#' },
    { imageId: 'hero-wine', label: 'WINE', href: '#' },
    { imageId: 'hero-lakes', label: 'LAKES MỚI', href: '#' },
];

export default function HeroSection() {
    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        if (!api) return;
        
        const onSelect = () => {
            setCurrent(api.selectedScrollSnap())
        };

        api.on("select", onSelect);
        onSelect(); // Set initial value

        return () => {
            api.off("select", onSelect);
        };
    }, [api]);

    const scrollTo = useCallback((index: number) => {
        api?.scrollTo(index);
    }, [api]);

    return (
        <div className="w-full bg-primary text-primary-foreground font-body">
             <div className="container mx-auto max-w-screen-2xl">
                <div className="flex flex-col min-h-[700px] justify-between py-12">
                    {/* Main content: 2 columns */}
                    <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                        {/* Left Column: Text */}
                        <div className="flex flex-col justify-center text-center md:text-left">
                            <div className="max-w-md mx-auto md:mx-0">
                                <p className="font-semibold tracking-widest uppercase text-sm text-amber-400 font-headline">
                                    ROMANEE-CONTI 1982
                                </p>
                                <h1 className="mt-2 text-4xl lg:text-5xl font-black leading-none tracking-tight uppercase font-headline">
                                    SIÊU PHẨM RƯỢU VANG <span className="text-amber-400">GIÀ NHẤT THẾ GIỚI</span>
                                </h1>
                                <p className="mt-6 font-light text-white/80 text-sm">
                                    ĐÃ CÓ MẶT TẠI DANGTAU WHISKY – HÃY CHỜ ĐÓN VIDEO BẬT MÍ SIÊU PHẨM NÀY TRÊN YOUTUBE!
                                </p>
                                <Button asChild variant="outline" className="mt-8 bg-amber-500 border-amber-500 text-primary-foreground hover:bg-amber-600 hover:border-amber-600 rounded-none px-10 py-6 transition-transform hover:scale-105">
                                    <Link href="#">XEM NGAY</Link>
                                </Button>
                            </div>
                        </div>

                        {/* Right Column: Carousel */}
                        <div className="w-full h-full min-h-[450px]">
                            <Carousel 
                                setApi={setApi} 
                                className="w-full h-full"
                                plugins={[ Autoplay({ delay: 4000, stopOnInteraction: true }) ]}
                                opts={{ loop: true }}
                            >
                                <CarouselContent className="h-full">
                                    {heroSlides.map((slide) => {
                                        const image = PlaceHolderImages.find(img => img.id === slide.imageId);
                                        if (!image) return null;
                                        return (
                                            <CarouselItem key={slide.imageId} className="h-full">
                                                <div className="relative w-full h-full">
                                                    <Image
                                                        src={image.imageUrl}
                                                        alt={image.description}
                                                        fill
                                                        className="object-cover rounded-lg"
                                                        sizes="(max-width: 768px) 100vw, 50vw"
                                                        priority
                                                    />
                                                </div>
                                            </CarouselItem>
                                        );
                                    })}
                                </CarouselContent>
                            </Carousel>
                        </div>
                    </div>
                    
                    {/* Bottom Bar: Controls */}
                    <div className="w-full bg-primary/50 backdrop-blur-sm py-4 border-t border-white/20 mt-8">
                        <div className="flex items-center justify-center md:justify-start">
                            {heroSlides.map((badge, index) => (
                                <React.Fragment key={badge.label}>
                                    <Button
                                        variant="outline"
                                        onClick={() => scrollTo(index)}
                                        className={cn(
                                            "bg-transparent text-white/80 border-white/50 rounded-none px-3 py-1.5 md:px-4 md:py-2 text-xs font-semibold hover:bg-white hover:text-primary transition-all text-center",
                                            current === index && "bg-white text-primary border-white"
                                        )}>
                                        {badge.label}
                                    </Button>
                                    {index < heroSlides.length - 1 && (
                                        <div className="flex-grow h-px bg-white/50 mx-1 md:mx-2 w-4 md:w-16"></div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
