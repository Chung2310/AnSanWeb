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


    if (!mounted) {
        return <div className="h-[600px] w-full bg-primary"></div>; 
    }

    return (
        <div className="relative w-full text-white bg-primary">
            {/* Main Content + Carousel */}
            <div className="flex flex-col h-[600px]">
                <div className="container flex-1 flex max-w-screen-2xl">
                    {/* Left Column: Text Content */}
                    <div className="w-1/2 flex flex-col justify-center items-start p-8">
                        <div className="max-w-md">
                            <p className="font-semibold tracking-widest uppercase text-sm">MACALLAN 84</p>
                            <h1 className="mt-2 text-5xl font-black leading-none tracking-tight uppercase">
                                CHAI WHISKY GIÀ NHẤT THẾ GIỚI ĐÃ CÓ MẶT TẠI DANGTAU WHISKY
                            </h1>
                            <p className="mt-6 font-light text-white/80 text-sm">
                                Hãy chờ đón video bật mí siêu phẩm này trên youtube của chúng tôi nhé!
                            </p>
                            <Button asChild variant="outline" className="mt-8 bg-transparent border-white text-white hover:bg-white hover:text-primary rounded-none px-10 py-6">
                                <Link href="#">XEM NGAY</Link>
                            </Button>
                        </div>
                    </div>

                    {/* Right Column: Image Carousel */}
                    <div className="w-1/2 h-full relative">
                        <Carousel
                            setApi={setApi}
                            className="w-full h-full"
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
                                                />
                                                 <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/30 to-transparent" />
                                            </div>
                                        </CarouselItem>
                                    )
                                })}
                            </CarouselContent>
                        </Carousel>
                    </div>
                </div>
            </div>
             {/* Bottom Bar: Controls */}
             <div className="w-full bg-primary py-4 border-t border-white/20">
                <div className="container max-w-screen-2xl">
                    <div className="flex items-center">
                        {heroSlides.map((badge, index) => (
                            <React.Fragment key={badge.label}>
                                <Button
                                    variant="outline"
                                    onClick={() => scrollTo(index)}
                                    className={cn(
                                        "bg-transparent text-white border-white/80 rounded-none px-4 py-2 text-xs font-semibold hover:bg-white hover:text-primary transition-all",
                                        current === index && "bg-white text-primary"
                                    )}>
                                    {badge.label}
                                </Button>
                                {index < heroSlides.length - 1 && (
                                    <div className="flex-grow h-px bg-white/80 mx-2 w-16"></div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
