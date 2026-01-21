
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
        title: 'Master of Wine',
        href: '/danh-muc-san-pham',
        description: 'Hơn 2000 sản phẩm nhập khẩu chính hãng\n\nGiao hàng toàn quốc\n\nHotline: 0933.333.313',
    },
    {
        imageId: 'hero-sale',
        label: 'Grande Alberone',
        title: 'Grande Alberone',
        href: '/gioi-thieu',
        description: 'Grande Alberone – Tinh hoa vang Ý từ vùng Puglia, được Rượu vang An San độc quyền phân phối tại Việt Nam.',
    },
    {
        imageId: 'hero-armagnac',
        label: 'Rượu Vang Chính Hãng',
        title: ['Rượu Vang', 'Chính Hãng'],
        href: '/danh-muc/ruou-vang',
        description: 'Rượu vang nhập khẩu chính hãng\n\n Tinh tuyển từ các vùng vang danh tiếng thế giới, phân phối bởi Rượu vang An San',
    },
    {
        imageId: 'hero-smws',
        label: 'QUÀ TẾT',
        title: 'QUÀ TẾT',
        href: '/danh-muc/bo-qua-tang',
        description: 'Quà Tết ANSAN – nơi mỗi món quà không chỉ trao gửi giá trị, mà còn thể hiện sự trân trọng, tinh tế và đẳng cấp của người tặng',
    },
    {
        imageId: 'hero-wine',
        label: 'RƯỢU MẠNH',
        title: 'RƯỢU MẠNH',
        href: '/danh-muc/ruou-manh',
        description: 'Những dòng rượu mạnh được ANSAN tuyển chọn – dành cho khoảnh khắc nâng ly của người bản lĩnh, hiểu giá trị và trân trọng đẳng cấp',
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
        <section className="relative w-full font-body h-[calc(100vh-136px)] min-h-[700px] md:h-screen md:min-h-[700px] overflow-hidden">
            <div className="w-full h-full relative">
                <AnimatePresence initial={false}>
                    {heroSlides.map((slide, index) => {
                        const image = PlaceHolderImages.find(img => img.id === slide.imageId);
                        const linkProps = (slide as any).external ? { target: "_blank", rel: "noopener noreferrer" } : {};
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
                                <div className="relative h-full w-full">
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
                                    <div className="absolute inset-0 bg-black/40" />
                                    <div className="container relative z-10 flex h-full flex-col items-start justify-center text-left text-white lg:px-24">
                                        <AnimatePresence>
                                            {isActive && (
                                                <motion.div
                                                    className="max-w-3xl"
                                                    variants={containerVariants}
                                                    initial="initial"
                                                    animate="animate"
                                                    exit="exit"
                                                >
                                                    <motion.h1 variants={textItemVariants} className={cn("text-6xl lg:text-7xl font-black uppercase font-headline", 'leading-tight')}>
                                                        {Array.isArray(slide.title)
                                                            ? slide.title.map((line: string, i: number) => <span key={i} className="block">{line}</span>)
                                                            : slide.title
                                                        }
                                                    </motion.h1>
                                                    <motion.p variants={textItemVariants} className={cn("mt-6 font-light text-lg max-w-xl whitespace-pre-line text-white/90")}>
                                                        {slide.description}
                                                    </motion.p>
                                                    <motion.div variants={textItemVariants}>
                                                        <Button
                                                            asChild
                                                            variant="outline"
                                                            className="mt-8 bg-transparent rounded-none px-10 py-6 transition-all hover:scale-105 border-white text-white hover:bg-white hover:text-black"
                                                        >
                                                            <Link href={slide.href} {...linkProps}>TÌM HIỂU THÊM</Link>
                                                        </Button>
                                                    </motion.div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
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
