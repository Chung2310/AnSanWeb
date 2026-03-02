'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { motion, useInView, useAnimation } from 'framer-motion';
import { useRef, useEffect } from 'react';

const drinkCategories = [
    {
        title: 'VANG ĐỎ',
        imageId: 'drink-cat-red-wine',
        href: '/danh-muc/ruou-vang/ruou-vang-do',
    },
    {
        title: 'VANG TRẮNG',
        imageId: 'drink-cat-white-wine',
        href: '/danh-muc/ruou-vang/ruou-vang-trang',
    },
    {
        title: 'VANG SỦI',
        imageId: 'drink-cat-sparkling-wine',
        href: '/danh-muc/ruou-vang/ruou-vang-sui',
    },
    {
        title: 'VANG 0 ĐỘ',
        imageId: 'drink-cat-zero-degree-wine',
        href: '/danh-muc/ruou-vang/ruou-vang-0-do',
    },
    {
        title: 'WHISKY',
        imageId: 'drink-cat-whisky',
        href: '/danh-muc/ruou-manh/whisky',
    },
];

const getImage = (id: string) => {
    return PlaceHolderImages.find((img) => img.id === id);
};

export default function DrinkCategoryShowcase() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });
    const mainControls = useAnimation();

    useEffect(() => {
        if (isInView) {
            mainControls.start("visible");
        }
    }, [isInView, mainControls]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    return (
        <motion.section
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={mainControls}
            className="py-16"
            style={{ backgroundColor: '#f8f0e5' }}
        >
            <div className="container">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                    {drinkCategories.map((category) => {
                        const image = getImage(category.imageId);
                        if (!image) return null;
                        return (
                            <motion.div key={category.title} variants={itemVariants}>
                                <Link href={category.href} className="group relative block overflow-hidden rounded-lg aspect-square">
                                    <Image
                                        src={image.imageUrl}
                                        alt={category.title}
                                        fill
                                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        data-ai-hint={image.imageHint}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute inset-0 flex items-end justify-center p-4">
                                        <h3 className="font-headline text-xl font-bold text-white uppercase text-center">
                                            {category.title}
                                        </h3>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </motion.section>
    );
}
