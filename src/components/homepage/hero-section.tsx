'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
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
        bgColor: 'bg-primary',
        textColor: 'text-white',
        external: true
    },
    {
        imageId: 'hero-sale',
        label: '10% OFF',
        href: '/collection/sales-10',
        tag: '10% OFF',
        titleLine1: 'AnSan OUTLET',
        titleAccent: 'SALE 10% OFF',
        description: 'Tri ân khách hàng với chương trình giảm giá đặc biệt 10% cho các sản phẩm outlet. Đây là cơ hội vàng để bạn sở hữu những chai whisky chất lượng với mức giá cực kỳ hấp dẫn. Khám phá ngay để không bỏ lỡ!',
        bgColor: 'bg-primary',
        textColor: 'text-white'
    },
    {
        imageId: 'hero-armagnac',
        label: 'ARMAGNAC',
        href: '/danh-muc/armagnac',
        tag: 'ARMAGNAC',
        titleLine1: 'ARMAGNAC RƯỢU MẠNH',
        titleAccent: 'PHÁP LỊCH SỬ 700 NĂM',
        description: 'Khám phá Armagnac, loại rượu brandy hay còn gọi là Eau-De-Vie lâu đời nhất của Pháp, với lịch sử hơn 700 năm - có trước cả Cognac hơn 150 năm từ năm 1310. Armagnac là đặc trưng của vùng Gascony, nằm ở phía Tây Nam Bordeaux, nơi nổi tiếng với kỷ lục người dân sống thọ nhất nước Pháp.',
        bgColor: 'bg-primary',
        textColor: 'text-white'
    },
    {
        imageId: 'hero-smws',
        label: 'SMWS',
        href: '/blog/5-dieu-ban-khong-biet-ve-smws',
        tag: 'SMWS',
        titleLine1: 'WHISKY NGUYÊN CHẤT',
        titleAccent: '100% CASK STRENGTH',
        description: 'Hiệp hội đóng chai độc lập này mang đến những chai Scotch Whisky nguyên chất 100%, được tuyển chọn kỹ lưỡng từ những thùng rượu hảo hạng nhất. SMWS không chỉ đơn thuần là nơi để thưởng thức Whisky, mà còn là nơi thay đổi hoàn toàn trải nghiệm thẩm Whisky, đưa bạn về với bản chất đích thực của việc thưởng thức Whisky: hương vị.',
        bgColor: 'bg-primary',
        textColor: 'text-white',
        external: true
    },
    {
        imageId: 'hero-wine',
        label: 'WINE',
        href: '/danh-muc/wine',
        tag: 'WINE',
        titleLine1: 'KHÔNG CHỈ RƯỢU MẠNH,',
        titleAccent: 'AnSan CŨNG TUYỂN CHỌN NHỮNG CHAI VANG HẢO HẠNG NHẤT',
        description: 'Chúng tôi không dừng lại ở rượu mạnh mà còn đưa cuộc phiêu lưu của mình sang “vùng đất” tuyển chọn những chai vang thượng hạng từ khắp thế giới. Mỗi chai vang là một tác phẩm nghệ thuật, kể câu chuyện về vùng đất và con người. Khám phá thế giới vang đa sắc màu, cùng chuyên gia tìm kiếm chai vang hoàn hảo cho riêng bạn.',
        bgColor: 'bg-primary',
        textColor: 'text-white'
    },
    {
        imageId: 'hero-lakes',
        label: 'LAKES MỚI',
        href: '/danh-muc/world-whisky/whisky-the-lakes',
        tag: 'LAKES MỚI',
        titleLine1: 'ANH EM HỌ CỦA',
        titleAccent: 'THE LAKES NO.7 BỚT CAY THÊM ÊM ÁI',
        description: 'Chúng tôi không dừng lại ở rượu mạnh mà còn đưa cuộc phiêu lưu của mình sang “vùng đất” tuyển chọn những chai vang thượng hạng từ khắp thế giới. Mỗi chai vang là một tác phẩm nghệ thuật, kể câu chuyện về vùng đất và con người. Khám phá thế giới vang đa sắc màu, cùng chuyên gia tìm kiếm chai vang hoàn hảo cho riêng bạn.',
        bgColor: 'bg-primary',
        textColor: 'text-white'
    },
];

const containerVariants = {
    initial: { transition: { staggerChildren: 0.1, staggerDirection: -1 } },
    animate: { transition: { staggerChildren: 0.1, delayChildren: 0.2, staggerDirection: 1 } },
    exit: { transition: { staggerChildren: 0.1, staggerDirection: -1 } },
};

const textItemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } },
};

export default function HeroSection() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrent((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearTimeout(timer);
    }, [current]);
    
    const currentSlide = heroSlides[current];
    const image = PlaceHolderImages.find(img => img.id === currentSlide.imageId);

    const linkProps = currentSlide.external ? { target: "_blank", rel: "noopener noreferrer" } : {};

    return (
        <section className="relative w-full font-body h-[85vh] min-h-[700px] md:h-screen md:min-h-[800px] overflow-hidden">
            <div className="w-full h-full">
                <AnimatePresence initial={false} mode="wait">
                    <motion.div
                        key={current}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="absolute inset-0"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                            {/* Left Column: Text */}
                            <motion.div 
                                className={cn("flex flex-col justify-center items-center text-center p-8", currentSlide.bgColor, currentSlide.textColor)}
                                variants={containerVariants}
                            >
                               <div className="max-w-md">
                                     <motion.p variants={textItemVariants} className="font-semibold tracking-widest uppercase text-sm text-white/80 font-headline">
                                         {currentSlide.tag}
                                     </motion.p>
                                     <motion.h1 variants={textItemVariants} className="mt-4 text-3xl lg:text-4xl font-black leading-tight uppercase font-headline">
                                         {currentSlide.titleLine1} <span className="text-white">{currentSlide.titleAccent}</span>
                                     </motion.h1>
                                     <motion.p variants={textItemVariants} className={cn("mt-6 font-light text-sm max-w-xl mx-auto", currentSlide.textColor === 'text-white' ? 'text-white/80' : 'text-black/80')}>
                                         {currentSlide.description}
                                     </motion.p>
                                     <motion.div variants={textItemVariants}>
                                        <Button 
                                            asChild 
                                            variant="outline" 
                                            className={cn(
                                                "mt-8 bg-transparent rounded-none px-10 py-6 transition-all hover:scale-105",
                                                currentSlide.textColor === 'text-white' 
                                                    ? "border-white text-white hover:bg-white hover:text-black" 
                                                    : "border-black text-black hover:bg-black hover:text-white"
                                            )}
                                        >
                                            <Link href={currentSlide.href} {...linkProps}>TÌM HIỂU THÊM</Link>
                                        </Button>
                                     </motion.div>
                                 </div>
                            </motion.div>
                            {/* Right Column: Image */}
                            <motion.div 
                                className="relative h-full hidden md:block"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1, transition: { duration: 0.7, ease: 'easeInOut' } }}
                                exit={{ opacity: 0, transition: { duration: 0.3, ease: 'easeInOut' } }}
                            >
                                {image && (
                                    <Image
                                        src={image.imageUrl}
                                        alt={image.description}
                                        fill
                                        className="object-cover"
                                        sizes="50vw"
                                        priority
                                        data-ai-hint={image.imageHint}
                                    />
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
            
             {/* Mobile background image */}
             <AnimatePresence>
                <motion.div
                    key={`mobile-bg-${current}`}
                    className="absolute inset-0 md:hidden -z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.7 } }}
                    exit={{ opacity: 0, transition: { duration: 0.3 } }}
                >
                    {image && (
                        <Image
                            src={image.imageUrl}
                            alt={image.description}
                            fill
                            className="object-cover"
                            sizes="100vw"
                            priority
                            data-ai-hint={image.imageHint}
                        />
                    )}
                    <div className="absolute inset-0 bg-black/50" />
                </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-10 md:bottom-20 left-0 right-0 z-10">
                <div className="container mx-auto max-w-screen-xl px-4">
                     <div className="flex items-center justify-center space-x-2 overflow-x-auto pb-2">
                        {heroSlides.map((slide, index) => (
                             <div key={slide.label} className="flex items-center">
                                <button
                                    onClick={() => setCurrent(index)}
                                    className={cn(
                                        "whitespace-nowrap rounded-none border border-white/80 bg-transparent px-3 py-1 text-xs font-semibold uppercase text-white/80 transition-colors duration-300 hover:bg-white/20",
                                        current === index && "border-white bg-white text-black"
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
    
