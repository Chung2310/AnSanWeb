'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { cn } from '@/lib/utils';

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
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!api) {
            return
        }

        const onSelect = () => {
            setCurrent(api.selectedScrollSnap())
        }

        api.on("select", onSelect)

        return () => {
            api.off("select", onSelect)
        }
    }, [api])

    const scrollTo = useCallback((index: number) => {
        api?.scrollTo(index);
    }, [api]);

    const heroCharacterImage = PlaceHolderImages.find(img => img.id === 'hero-character');

    if (!mounted) {
        return <div className="h-[700px] w-full bg-primary/80"></div>; 
    }

    return (
        <div className="relative w-full text-white bg-primary/80 font-body overflow-hidden">
            {/* Background Carousel */}
            <Carousel
                setApi={setApi}
                className="absolute inset-0 w-full h-full"
                plugins={[ Autoplay({ delay: 5000, stopOnInteraction: true }) ]}
                opts={{ loop: true }}
            >
                <CarouselContent className="h-full -ml-0">
                    {heroSlides.map((slide, index) => {
                        const image = PlaceHolderImages.find(img => img.id === slide.imageId);
                        if (!image) return null;
                        return (
                            <CarouselItem key={index} className="pl-0 h-full">
                                <div className="relative w-full h-full">
                                    <Image
                                        src={image.imageUrl}
                                        alt={image.description}
                                        fill
                                        priority={index === 0}
                                        className="w-full h-full object-cover object-center"
                                        data-ai-hint={image.imageHint}
                                        sizes="100vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/70 via-primary/30 to-transparent" />
                                </div>
                            </CarouselItem>
                        )
                    })}
                </CarouselContent>
            </Carousel>
            
            {/* Main Content */}
            <div className="relative z-10 flex flex-col min-h-[700px]">
                <div className="container relative flex-1 flex flex-col md:flex-row items-center max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Left Column: Text Content */}
                    <div className="w-full md:w-1/2 flex-shrink-0 text-center md:text-left py-12 md:py-0">
                        <div className="max-w-md mx-auto md:mx-0">
                             <p className="font-semibold tracking-widest uppercase text-sm text-amber-400 font-headline">
                               ROMANEE-CONTI 1982
                            </p>
                            <h1 className="mt-2 text-4xl lg:text-5xl font-extrabold leading-none tracking-tight uppercase font-headline">
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

                    {/* Right Column: Overlapping Image */}
                    {heroCharacterImage && (
                        <div className="relative w-full md:w-1/2 h-80 md:h-full mt-8 md:mt-0">
                             <div className="absolute bottom-0 left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 w-[300px] h-[500px] md:w-[500px] md:h-[750px] lg:w-[650px] lg:h-[900px] lg:translate-x-20">
                                <Image
                                    src={heroCharacterImage.imageUrl}
                                    alt={heroCharacterImage.description}
                                    fill
                                    priority
                                    className="object-contain drop-shadow-2xl"
                                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 60vw, 70vw"
                                    data-ai-hint={heroCharacterImage.imageHint}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Bar: Controls */}
             <div className="relative z-20 w-full bg-primary/80 backdrop-blur-sm py-4 border-t border-white/20">
                <div className="container max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
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
    );
}
