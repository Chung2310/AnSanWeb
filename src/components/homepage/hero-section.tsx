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
        href: 'https://youtu.be/hBG0J3qLLuA?si=B5h9_53jgFCKnIAP',
        tag: 'Macallan 84',
        titleLine1: 'CHAI WHISKY GIÀ NHẤT THẾ GIỚI ĐÃ CÓ MẶT TẠI AnSan',
        titleAccent: '',
        description: 'Hãy chờ đón video bật mí siêu phẩm này trên youtube của chúng tôi nhé!',
        bgColor: 'bg-primary'
    },
    { 
        imageId: 'hero-sale', 
        label: '10% OFF', 
        href: '/collection/sales-10/',
        tag: '10% OFF',
        titleLine1: 'AnSan OUTLET',
        titleAccent: 'SALE 10% OFF',
        description: 'Tri ân khách hàng với chương trình giảm giá đặc biệt 10% cho các sản phẩm outlet. Đây là cơ hội vàng để bạn sở hữu những chai whisky chất lượng với mức giá cực kỳ hấp dẫn. Khám phá ngay để không bỏ lỡ!',
        bgColor: 'bg-primary'
    },
    { 
        imageId: 'hero-armagnac', 
        label: 'ARMAGNAC', 
        href: '/product-category/armagnac',
        tag: 'ARMAGNAC',
        titleLine1: 'ARMAGNAC RƯỢU MẠNH',
        titleAccent: 'PHÁP LỊCH SỬ 700 NĂM',
        description: 'Khám phá Armagnac, loại rượu brandy hay còn gọi là Eau-De-Vie lâu đời nhất của Pháp, với lịch sử hơn 700 năm - có trước cả Cognac hơn 150 năm từ năm 1310. Armagnac là đặc trưng của vùng Gascony, nằm ở phía Tây Nam Bordeaux, nơi nổi tiếng với kỷ lục người dân sống thọ nhất nước Pháp.',
        bgColor: 'bg-[#987d4f]'
    },
    { 
        imageId: 'hero-smws', 
        label: 'SMWS', 
        href: '/blog/5-dieu-ban-khong-biet-ve-smws/',
        tag: 'SMWS',
        titleLine1: 'WHISKY NGUYÊN CHẤT',
        titleAccent: '100% CASK STRENGTH',
        description: 'Hiệp hội đóng chai độc lập này mang đến những chai Scotch Whisky nguyên chất 100%, được tuyển chọn kỹ lưỡng từ những thùng rượu hảo hạng nhất. SMWS không chỉ đơn thuần là nơi để thưởng thức Whisky, mà còn là nơi thay đổi hoàn toàn trải nghiệm thẩm Whisky, đưa bạn về với bản chất đích thực của việc thưởng thức Whisky: hương vị.',
        bgColor: 'bg-primary'
    },
    { 
        imageId: 'hero-wine', 
        label: 'WINE', 
        href: '/wine/',
        tag: 'WINE',
        titleLine1: 'KHÔNG CHỈ RƯỢU MẠNH,',
        titleAccent: 'AnSan CŨNG TUYỂN CHỌN NHỮNG CHAI VANG HẢO HẠNG NHẤT',
        description: 'Chúng tôi không dừng lại ở rượu mạnh mà còn đưa cuộc phiêu lưu của mình sang “vùng đất” tuyển chọn những chai vang thượng hạng từ khắp thế giới. Mỗi chai vang là một tác phẩm nghệ thuật, kể câu chuyện về vùng đất và con người. Khám phá thế giới vang đa sắc màu, cùng chuyên gia tìm kiếm chai vang hoàn hảo cho riêng bạn.',
        bgColor: 'bg-primary'
    },
    { 
        imageId: 'hero-lakes', 
        label: 'LAKES MỚI', 
        href: '/wine/',
        tag: 'LAKES MỚI',
        titleLine1: 'ANH EM HỌ CỦA',
        titleAccent: 'THE LAKES NO.7 BỚT CAY THÊM ÊM ÁI',
        description: 'Chúng tôi không dừng lại ở rượu mạnh mà còn đưa cuộc phiêu lưu của mình sang “vùng đất” tuyển chọn những chai vang thượng hạng từ khắp thế giới. Mỗi chai vang là một tác phẩm nghệ thuật, kể câu chuyện về vùng đất và con người. Khám phá thế giới vang đa sắc màu, cùng chuyên gia tìm kiếm chai vang hoàn hảo cho riêng bạn.',
        bgColor: 'bg-primary'
    },
];

const textVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

export default function HeroSection() {
    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)

    const scrollTo = useCallback((index: number) => {
        api?.scrollTo(index);
    }, [api]);

    useEffect(() => {
        if (!api) return;
        
        const onSelect = () => setCurrent(api.selectedScrollSnap());
        api.on("select", onSelect);
        
        return () => {
            api.off("select", onSelect);
        };
    }, [api]);
    
    const currentSlide = heroSlides[current];

    return (
        <section className="relative w-full text-white font-body h-[85vh] min-h-[700px] md:h-screen md:min-h-[800px] overflow-hidden">
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
                             <motion.div
                                key={index}
                                className="w-full h-full flex-shrink-0"
                                initial="initial"
                                animate={current === index ? "animate" : "exit"}
                                exit="exit"
                                variants={{
                                    initial: { opacity: 0 },
                                    animate: { opacity: 1 },
                                    exit: { opacity: 0 },
                                }}
                                transition={{ duration: 0.5, ease: 'easeInOut' }}
                                style={{
                                    flexBasis: '100%',
                                    position: 'absolute',
                                    left: `${(index - current) * 100}%`,
                                }}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                                    {/* Left Column: Text */}
                                    <div className={cn(
                                        "flex flex-col justify-center items-center text-center p-8",
                                        slide.bgColor
                                    )}>
                                        <AnimatePresence initial={false}>
                                            <motion.div
                                                key={current}
                                                variants={textVariants}
                                                initial="initial"
                                                animate="animate"
                                                exit="exit"
                                                transition={{ duration: 0.5, ease: 'easeInOut' }}
                                                className="max-w-md"
                                            >
                                                <p className="font-semibold tracking-widest uppercase text-sm text-accent font-headline">
                                                    {slide.tag}
                                                </p>
                                                <h1 className="mt-4 text-3xl lg:text-4xl font-black leading-tight uppercase font-headline">
                                                    {slide.titleLine1} <span className="text-accent">{slide.titleAccent}</span>
                                                </h1>
                                                <p className="mt-6 font-light text-white/80 text-sm max-w-xl mx-auto">
                                                    {slide.description}
                                                </p>
                                                <Button asChild variant="outline" className="mt-8 bg-transparent border-white text-white hover:bg-white hover:text-black rounded-none px-10 py-6 transition-all hover:scale-105">
                                                    <Link href={slide.href} target="_blank" rel="noopener noreferrer">XEM NGAY</Link>
                                                </Button>
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>
                                    {/* Right Column: Image */}
                                    <div className="relative h-full hidden md:block">
                                        <Image
                                            src={image.imageUrl}
                                            alt={image.description}
                                            fill
                                            className="object-cover"
                                            sizes="50vw"
                                            priority={index === 0}
                                            data-ai-hint={image.imageHint}
                                        />
                                    </div>
                                </div>
                                <div className="absolute inset-0 md:hidden">
                                        <Image
                                            src={image.imageUrl}
                                            alt={image.description}
                                            fill
                                            className="object-cover -z-10"
                                            sizes="100vw"
                                            priority={index === 0}
                                            data-ai-hint={image.imageHint}
                                        />
                                        <div className="absolute inset-0 bg-black/50 -z-10" />
                                    </div>
                            </motion.div>
                        );
                    })}
                </CarouselContent>
            </Carousel>
            
            <div className="absolute bottom-10 md:bottom-20 left-0 right-0 z-10">
                <div className="container mx-auto max-w-screen-xl px-4">
                     <div className="flex items-center justify-center space-x-2 overflow-x-auto pb-2">
                        {heroSlides.map((slide, index) => (
                             <div key={slide.label} className="flex items-center">
                                <button
                                    onClick={() => scrollTo(index)}
                                    className={cn(
                                        "whitespace-nowrap rounded-none border border-white/80 bg-transparent px-3 py-1 text-xs font-semibold uppercase text-white/80 transition-colors duration-300 hover:bg-white/20",
                                        current === index && "border-accent bg-accent text-accent-foreground"
                                    )}
                                >
                                    {slide.label}
                                </button>
                                {index < heroSlides.length - 1 && (
                                     <div className="w-8 h-px bg-white/50 mx-2 hidden md:block"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
