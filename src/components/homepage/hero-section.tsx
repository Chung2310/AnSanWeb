
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const heroSlides = [
    {
        imageId: 'hero-macallan',
        label: 'Master of Wine',
        href: '/danh-muc-san-pham',
        tag: 'Master of wine',
        titleLine1: 'Master of wine',
        titleAccent: '',
        description: 'Hơn 2000 sản phẩm nhập khẩu chính hãng\n\nGiao hàng toàn quốc\n\nHotline: 0933.333.313',
        bgColor: 'bg-primary',
        textColor: 'text-white',
    },
    {
        imageId: 'hero-sale',
        label: 'AN SAN',
        href: '/gioi-thieu',
        tag: '10% OFF',
        titleLine1: 'AnSan OUTLET',
        titleAccent: 'SALE 10% OFF',
        description: 'ANSAN không chỉ mang đến rượu vang, mà còn là cách thể hiện đẳng cấp, sự trân trọng và phong vị sống của người thưởng thức',
        bgColor: 'bg-primary',
        textColor: 'text-white'
    },
    {
        imageId: 'hero-armagnac',
        label: 'DONNELLI',
        href: '/danh-muc/armagnac',
        tag: 'ARMAGNAC',
        titleLine1: 'ARMAGNAC RƯỢU MẠNH',
        titleAccent: 'PHÁP LỊCH SỬ 700 NĂM',
        description: 'Donnelli không cồn – lựa chọn tinh tế cho những khoảnh khắc nâng ly trọn vẹn, nơi phong vị Ý được thưởng thức theo cách an toàn và lịch lãm',
        bgColor: 'bg-primary',
        textColor: 'text-white'
    },
    {
        imageId: 'hero-smws',
        label: 'QUÀ TẾT',
        href: '/blog/5-dieu-ban-khong-biet-ve-smws',
        tag: 'SMWS',
        
        titleAccent: '100% CASK STRENGTH',
        description: 'Quà Tết ANSAN – nơi mỗi món quà không chỉ trao gửi giá trị, mà còn thể hiện sự trân trọng, tinh tế và đẳng cấp của người tặng',
        bgColor: 'bg-primary',
        textColor: 'text-white',
        external: true
    },
    {
        imageId: 'hero-wine',
        label: 'WINE',
        href: '/danh-muc/wine',
        tag: 'WINE',      
        titleAccent: 'ANSAN CŨNG TUYỂN CHỌN NHỮNG CHAI VANG HẢO HẠNG NHẤT',
        description: 'Những dòng rượu mạnh được ANSAN tuyển chọn – dành cho khoảnh khắc nâng ly của người bản lĩnh, hiểu giá trị và trân trọng đẳng cấp',
        bgColor: 'bg-primary',
        textColor: 'text-white'
    },
];

const containerVariants = {
    initial: {},
    animate: { transition: { staggerChildren: 0.3, delayChildren: 0.8 } },
    exit: { transition: { staggerChildren: 0.1, staggerDirection: -1 } },
};

const textItemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.4, ease: 'easeIn' } },
};

const slideVariants = {
    initial: { opacity: 0, zIndex: 0 },
    animate: { opacity: 1, zIndex: 1, transition: { duration: 1.2, ease: 'easeOut' } },
    exit: { opacity: 0, zIndex: 0, transition: { duration: 1.2, ease: 'easeIn' } }
};


export default function HeroSection() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrent((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
        }, 8000);
        return () => clearTimeout(timer);
    }, [current]);
    
    return (
        <section className="relative w-full font-body h-[85vh] min-h-[700px] md:h-screen md:min-h-[800px] overflow-hidden">
            <div className="w-full h-full relative">
                <AnimatePresence initial={false}>
                    {heroSlides.map((slide, index) => {
                         const image = PlaceHolderImages.find(img => img.id === slide.imageId);
                         const linkProps = slide.external ? { target: "_blank", rel: "noopener noreferrer" } : {};
                         const isActive = index === current;

                        return (
                            <motion.div
                                key={index}
                                initial="initial"
                                animate={isActive ? 'animate' : 'initial'}
                                exit="exit"
                                variants={slideVariants}
                                className="absolute inset-0"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                                    {/* Left Column: Text */}
                                    <div className={cn("flex flex-col justify-center items-center text-center p-8", slide.bgColor, slide.textColor)}>
                                        <AnimatePresence>
                                            {isActive && (
                                                <motion.div 
                                                    className="max-w-md"
                                                    variants={containerVariants}
                                                    initial="initial"
                                                    animate="animate"
                                                    exit="exit"
                                                >
                                                    <motion.p variants={textItemVariants} className="font-semibold tracking-widest uppercase text-xl text-white/80 font-headline">
                                                        {slide.tag}
                                                    </motion.p>
                                                    <motion.h1 variants={textItemVariants} className="mt-4 text-6xl lg:text-7xl font-black leading-tight uppercase font-headline">
                                                        {slide.titleLine1} <span className="text-white">{slide.titleAccent}</span>
                                                    </motion.h1>
                                                    <motion.p variants={textItemVariants} className={cn("mt-6 font-light text-lg max-w-xl mx-auto whitespace-pre-line", slide.textColor === 'text-white' ? 'text-white/80' : 'text-black/80')}>
                                                        {slide.description}
                                                    </motion.p>
                                                    <motion.div variants={textItemVariants}>
                                                        <Button 
                                                            asChild 
                                                            variant="outline" 
                                                            className={cn(
                                                                "mt-8 bg-transparent rounded-none px-10 py-6 transition-all hover:scale-105",
                                                                slide.textColor === 'text-white' 
                                                                    ? "border-white text-white hover:bg-white hover:text-black" 
                                                                    : "border-black text-black hover:bg-black hover:text-white"
                                                            )}
                                                        >
                                                            <Link href={slide.href} {...linkProps}>TÌM HIỂU THÊM</Link>
                                                        </Button>
                                                    </motion.div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    {/* Right Column: Image */}
                                    <div className="relative h-full hidden md:block">
                                        {image && (
                                            <Image
                                                src={image.imageUrl}
                                                alt={image.description}
                                                fill
                                                className="object-cover"
                                                sizes="50vw"
                                                priority={isActive}
                                                data-ai-hint={image.imageHint}
                                            />
                                        )}
                                    </div>
                                </div>
                                 {/* Mobile background image */}
                                <div className="absolute inset-0 md:hidden -z-10">
                                    {image && (
                                        <Image
                                            src={image.imageUrl}
                                            alt={image.description}
                                            fill
                                            className="object-cover"
                                            sizes="100vw"
                                            priority={isActive}
                                            data-ai-hint={image.imageHint}
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-black/50" />
                                </div>
                            </motion.div>
                        )
                    })}
                </AnimatePresence>
            </div>
            
            <div className="absolute bottom-10 md:bottom-20 left-0 right-0 z-10">
                <div className="container mx-auto max-w-screen-2xl px-4">
                     <div className="flex items-center justify-center space-x-2 overflow-x-auto pb-2">
                        {heroSlides.map((slide, index) => (
                             <div key={slide.label} className="flex items-center">
                                <button
                                    onClick={() => setCurrent(index)}
                                    className={cn(
                                        "whitespace-nowrap rounded-none border border-white/80 bg-transparent px-3 py-1 font-semibold uppercase text-white/80 transition-colors duration-300 hover:bg-white/20",
                                        current === index && "border-white bg-white text-black"
                                    )}
                                    style={{ fontSize: '19px' }}
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
    

    
