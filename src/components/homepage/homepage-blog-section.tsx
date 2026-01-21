'use client';

import { useBlogPosts } from '@/hooks/use-blog-posts';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import type { BlogPost } from '@/lib/types';
import { motion, useInView, useAnimation } from 'framer-motion';
import React, { useRef, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const BlogCard = ({ post }: { post: BlogPost }) => {
    return (
        <Link href={`/tin-tuc/${post.slug}`} className="group block h-full">
            <div className="flex flex-col h-full">
                <div className="relative">
                    {post.image && (
                        <div className="aspect-[4/3] overflow-hidden">
                            <Image
                                src={post.image.url}
                                alt={post.title}
                                width={600}
                                height={400}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                data-ai-hint={post.image.imageHint || 'blog post'}
                            />
                        </div>
                    )}
                </div>
                <div className="mt-4 text-left flex-grow flex flex-col">
                    <div className="flex items-center text-xs font-bold uppercase tracking-widest gap-2" style={{ color: '#8a7d6a' }}>
                        <span>{post.categories.join(' / ')}</span>
                    </div>
                    <h2 className="font-headline text-xl font-black uppercase mt-2 text-neutral-700 group-hover:text-primary transition-colors">
                        {post.title}
                    </h2>
                    <p className="text-sm text-neutral-600 mt-3 line-clamp-3 flex-grow">
                        {post.excerpt}
                    </p>
                    <p className="text-xs font-bold uppercase tracking-widest mt-4" style={{ color: '#8a7d6a' }}>
                        ĐỌC TIẾP
                    </p>
                </div>
            </div>
        </Link>
    );
};


const BlogCardSkeleton = () => (
    <div className="space-y-4">
        <Skeleton className="aspect-[4/3] w-full" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-4 w-1/4" />
    </div>
);


export default function HomepageBlogSection() {
    const { blogPosts, isLoading } = useBlogPosts();
    const recentPosts = blogPosts?.slice(0, 6); // Use more posts for carousel

    const plugin = React.useRef(
      Autoplay({ delay: 5000, stopOnInteraction: true })
    )

    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });
    const mainControls = useAnimation();

    useEffect(() => {
        if (isInView) {
            mainControls.start("visible");
        }
    }, [isInView, mainControls]);

    const containerVariants = {
        hidden: { opacity: 0, y: 75 },
        visible: { opacity: 1, y: 0, transition: { duration: 1, delay: 0.3 } },
    };

    return (
        <motion.section 
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={mainControls}
            className="py-12 md:py-20 bg-white"
        >
            <div className="container">
                <div className="text-center mb-10">
                    <h2 className="font-headline text-3xl font-bold text-foreground md:text-4xl">
                        Tin Tức & Sự Kiện
                    </h2>
                    <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
                        Cập nhật những thông tin mới nhất từ thế giới rượu và AnSan.
                    </p>
                </div>
                
                {isLoading ? (
                    <div className="grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, i) => <BlogCardSkeleton key={i} />)}
                    </div>
                ) : (
                    <Carousel
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        plugins={[plugin.current]}
                        className="w-full max-w-screen-lg mx-auto"
                    >
                        <CarouselContent>
                            {recentPosts?.map(post => (
                                <CarouselItem key={post.id} className="md:basis-1/2 lg:basis-1/3">
                                    <div className="p-1 h-full">
                                        <BlogCard post={post} />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="hidden sm:flex" />
                        <CarouselNext className="hidden sm:flex" />
                    </Carousel>
                )}


                <div className="text-center mt-12">
                    <Button asChild size="lg" variant="outline">
                        <Link href="/tin-tuc">Xem tất cả bài viết</Link>
                    </Button>
                </div>
            </div>
        </motion.section>
    );
}
