'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Autoplay from "embla-carousel-autoplay";
import { motion, AnimatePresence } from 'framer-motion';

const heroSlides = [
    { 
        imageId: 'hero-macallan', 
        label: 'MACALLAN 84', 
        href: '#',
        tag: 'ROMANEE-CONTI 1982',
        titleLine1: 'SIÊU PHẨM RƯỢU VANG',
        titleAccent: 'GIÀ NHẤT THẾ GIỚI',
        description: 'ĐÃ CÓ MẶT TẠI DANGTAU WHISKY – HÃY CHỜ ĐÓN VIDEO BẬT MÍ SIÊU PHẨM NÀY TRÊN YOUTUBE!',
    },
    { 
        imageId: 'hero-sale', 
        label: '10% OFF', 
        href: '#',
        tag: 'ƯU ĐÃI ĐẶC BIỆT',
        titleLine1: 'GIẢM GIÁ 10% CHO',
        titleAccent: 'ĐƠN HÀNG ĐẦU TIÊN',
        description: 'Nhập mã WELCOME10 khi thanh toán để nhận ngay ưu đãi cho bộ sưu tập rượu vang của chúng tôi.',
    },
    { 
        imageId: 'hero-armagnac', 
        label: 'ARMAGNAC', 
        href: '#',
        tag: 'KHÁM PHÁ ARMAGNAC',
        titleLine1: 'HƯƠNG VỊ NGUYÊN BẢN',
        titleAccent: 'TỪ MIỀN TÂY NAM NƯỚC PHÁP',
        description: 'Trải nghiệm sự phong phú và phức hợp của Armagnac, một loại rượu brandy độc đáo và lâu đời.',
    },
    { 
        imageId: 'hero-smws', 
        label: 'SMWS', 
        href: '#',
        tag: 'THE SCOTCH MALT WHISKY SOCIETY',
        titleLine1: 'NHỮNG THÙNG RƯỢU',
        titleAccent: 'QUÝ HIẾM NHẤT',
        description: 'Khám phá các phiên bản đóng chai độc quyền từ The Scotch Malt Whisky Society (SMWS).',
    },
    { 
        imageId: 'hero-wine', 
        label: 'WINE', 
        href: '#',
        tag: 'BỘ SƯU TẬP VANG',
        titleLine1: 'TINH HOA CỦA',
        titleAccent: 'CÁC VÙNG ĐẤT DANH TIẾNG',
        description: 'Từ Bordeaux đến Napa, khám phá bộ sưu tập rượu vang được tuyển chọn kỹ lưỡng từ khắp nơi trên thế giới.',
    },
    { 
        imageId: 'hero-lakes', 
        label: 'LAKES MỚI', 
        href: '#',
        tag: 'SỰ XUẤT HIỆN CỦA THE LAKES',
        titleLine1: 'TINH THẦN CỦA',
        titleAccent: 'VÙNG HỒ NƯỚC ANH',
        description: 'Chào đón những sản phẩm mới nhất từ nhà máy chưng cất The Lakes, nổi tiếng với sự tinh tế và sáng tạo.',
    },
];

const textVariants = {
  slideDown: {
    initial: { y: -50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 50, opacity: 0 },
  },
  slideRight: {
    initial: { x: -50, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 50, opacity: 0 },
  },
};

export default function HeroSection() {
    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)
    const [currentContent, setCurrentContent] = useState(heroSlides[0]);

    useEffect(() => {
        if (!api) return;
        
        const onSelect = () => {
            const newIndex = api.selectedScrollSnap();
            setCurrent(newIndex);
            setCurrentContent(heroSlides[newIndex]);
        };

        api.on("select", onSelect);
        onSelect();

        return () => {
            api.off("select", onSelect);
        };
    }, [api]);

    const scrollTo = useCallback((index: number) => {
        api?.scrollTo(index);
    }, [api]);

    const currentAnimation = current === 0 ? 'slideDown' : 'slideRight';

    return (
        <div className="w-full bg-primary text-primary-foreground font-body">
             <div className="container mx-auto max-w-screen-2xl">
                <div className="flex flex-col">
                    {/* Top Bar: Controls */}
                    <div className="w-full bg-primary/50 backdrop-blur-sm py-4 border-b border-white/20 z-10">
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

                    {/* Main content: 2 columns */}
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* Left Column: Text */}
                        <div className="flex flex-col justify-center text-center md:text-left py-12 px-4 md:px-0 min-h-[600px] overflow-hidden">
                           <AnimatePresence mode="wait">
                                <motion.div
                                    key={current}
                                    variants={textVariants[currentAnimation]}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                                    className="max-w-md mx-auto md:mx-0"
                                >
                                    <p className="font-semibold tracking-widest uppercase text-sm text-accent font-headline">
                                        {currentContent.tag}
                                    </p>
                                    <h1 className="mt-2 text-4xl lg:text-5xl font-black leading-none tracking-tight uppercase font-headline">
                                        {currentContent.titleLine1} <span className="text-accent">{currentContent.titleAccent}</span>
                                    </h1>
                                    <p className="mt-6 font-light text-white/80 text-sm">
                                        {currentContent.description}
                                    </p>
                                    <Button asChild variant="outline" className="mt-8 bg-accent border-accent text-primary hover:bg-accent/90 hover:border-accent/90 rounded-none px-10 py-6 transition-transform hover:scale-105">
                                        <Link href="#">XEM NGAY</Link>
                                    </Button>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Right Column: Carousel */}
                         <div className="w-full min-h-[600px]">
                            <Carousel 
                                setApi={setApi} 
                                className="w-full h-full"
                                plugins={[ Autoplay({ delay: 4000, stopOnInteraction: true }) ]}
                                opts={{ loop: true }}
                            >
                                <CarouselContent className="h-full">
                                    {heroSlides.map((slide, index) => {
                                        const image = PlaceHolderImages.find(img => img.id === slide.imageId);
                                        if (!image) return null;
                                        return (
                                            <CarouselItem key={slide.imageId} className="relative h-full">
                                                <Image
                                                    src={image.imageUrl}
                                                    alt={image.description}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 768px) 100vw, 50vw"
                                                    priority={index === 0}
                                                    data-ai-hint={image.imageHint}
                                                />
                                            </CarouselItem>
                                        );
                                    })}
                                </CarouselContent>
                            </Carousel>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
