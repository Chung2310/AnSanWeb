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
        label: 'Macallan 84', 
        href: '#',
        tag: 'Macallan 84',
        titleLine1: 'CHAI WHISKY GIÀ NHẤT THẾ GIỚI ĐÃ CÓ MẶT TẠI ANSAN',
        titleAccent: '',
        description: 'Hãy chờ đón video bật mí siêu phẩm này trên youtube của chúng tôi nhé!',
    },
    { 
        imageId: 'hero-sale', 
        label: '10% OFF', 
        href: '#',
        tag: '10% OFF',
        titleLine1: 'ANSAN OUTLET',
        titleAccent: 'SALE 10% OFF',
        description: 'Tri ân khách hàng với chương trình giảm giá đặc biệt 10% cho các sản phẩm outlet. Đây là cơ hội vàng để bạn sở hữu những chai whisky chất lượng với mức giá cực kỳ hấp dẫn. Khám phá ngay để không bỏ lỡ!',
    },
    { 
        imageId: 'hero-armagnac', 
        label: 'ARMAGNAC', 
        href: '#',
        tag: 'ARMAGNAC',
        titleLine1: 'ARMAGNAC RƯỢU MẠNH',
        titleAccent: 'PHÁP LỊCH SỬ 700 NĂM',
        description: 'Khám phá Armagnac, loại rượu brandy hay còn gọi là Eau-De-Vie lâu đời nhất của Pháp, với lịch sử hơn 700 năm - có trước cả Cognac hơn 150 năm từ năm 1310. Armagnac là đặc trưng của vùng Gascony, nằm ở phía Tây Nam Bordeaux, nơi nổi tiếng với kỷ lục người dân sống thọ nhất nước Pháp.',
    },
    { 
        imageId: 'hero-smws', 
        label: 'SMWS', 
        href: '#',
        tag: 'SMWS',
        titleLine1: 'WHISKY NGUYÊN CHẤT',
        titleAccent: '100% CASK STRENGTH',
        description: 'Hiệp hội đóng chai độc lập này mang đến những chai Scotch Whisky nguyên chất 100%, được tuyển chọn kỹ lưỡng từ những thùng rượu hảo hạng nhất. SMWS không chỉ đơn thuần là nơi để thưởng thức Whisky, mà còn là nơi thay đổi hoàn toàn trải nghiệm thẩm Whisky, đưa bạn về với bản chất đích thực của việc thưởng thức Whisky: hương vị.',
    },
    { imageId: 'hero-wine', 
        label: 'WINE', 
        href: '#',
        tag: 'WINE',
        titleLine1: 'KHÔNG CHỈ RƯỢU MẠNH,',
        titleAccent: 'ANSAN CŨNG TUYỂN CHỌN NHỮNG CHAI VANG HẢO HẠNG NHẤT',
        description: 'Chúng tôi không dừng lại ở rượu mạnh mà còn đưa cuộc phiêu lưu của mình sang “vùng đất” tuyển chọn những chai vang thượng hạng từ khắp thế giới. Mỗi chai vang là một tác phẩm nghệ thuật, kể câu chuyện về vùng đất và con người. Khám phá thế giới vang đa sắc màu, cùng chuyên gia tìm kiếm chai vang hoàn hảo cho riêng bạn.',
    },
    { 
        imageId: 'hero-lakes', 
        label: 'LAKES MỚI', 
        href: '#',
        tag: 'LAKES MỚI',
        titleLine1: 'ANH EM HỌ CỦA',
        titleAccent: 'THE LAKES NO.7 BỚT CAY THÊM ÊM ÁI',
        description: 'Chúng tôi không dừng lại ở rượu mạnh mà còn đưa cuộc phiêu lưu của mình sang “vùng đất” tuyển chọn những chai vang thượng hạng từ khắp thế giới. Mỗi chai vang là một tác phẩm nghệ thuật, kể câu chuyện về vùng đất và con người. Khám phá thế giới vang đa sắc màu, cùng chuyên gia tìm kiếm chai vang hoàn hảo cho riêng bạn.',
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
        // Initial call
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
                        <div className="w-full min-h-[600px] relative">
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
                                            <CarouselItem key={index} className="relative h-full">
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
