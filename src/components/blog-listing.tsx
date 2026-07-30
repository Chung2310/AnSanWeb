'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import Link from "next/link";
import Image from "next/image";
import { cn } from '@/lib/utils';
import type { BlogPost } from '@/lib/types';
import { Skeleton } from './ui/skeleton';
import { useBlogPosts } from '@/hooks/use-blog-posts';
import { useSearchParams } from 'next/navigation';

const allCategories = [
    'DISTILLERIES',
    'NEWS',
    'SPIRITS',
    'WHISKY BASICS',
    'WHISKY REVIEW',
];

const BlogCard = ({ post }: { post: BlogPost }) => {
    return (
        <Link href={`/tin-tuc/${post.slug}`} className="group block">
            <div className="relative">
                {post.image && (
                    <div className="aspect-[4/3] overflow-hidden">
                        <Image 
                            src={post.image.url}
                            alt={post.title}
                            width={600}
                            height={400}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                            quality={70}
                            data-ai-hint={post.image.imageHint || 'blog post'}
                        />
                    </div>

                )}
            </div>
            <div className="mt-4 text-left">
                <div className="flex items-center text-xs font-bold uppercase tracking-widest gap-2" style={{ color: '#8a7d6a' }}>
                    <span>{post.categories.join(' / ')}</span>
                </div>
                <h2 className="font-headline text-xl font-black uppercase mt-2 text-neutral-700 group-hover:text-primary transition-colors">
                    {post.title}
                </h2>
                <p className="text-sm text-neutral-600 mt-3 line-clamp-2">
                    {post.excerpt}
                </p>
                <p className="text-xs font-bold uppercase tracking-widest mt-4" style={{ color: '#8a7d6a' }}>
                    ĐỌC TIẾP
                </p>
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

function BlogListingContent() {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get('category');
    
    const [activeCategory, setActiveCategory] = useState<string | null>(initialCategory);
    const { blogPosts, isLoading } = useBlogPosts();

    useEffect(() => {
        setActiveCategory(initialCategory);
    }, [initialCategory]);

    const getCategoryCount = (category: string) => {
        if (!blogPosts) return 0;
        return blogPosts.filter(post => post.categories.includes(category)).length;
    }
    
    const filteredPosts = useMemo(() => {
        if (!blogPosts) return [];
        if (!activeCategory) return blogPosts;
        return blogPosts.filter(post => post.categories.includes(activeCategory));
    }, [blogPosts, activeCategory]);

    const handleCategoryClick = (category: string | null) => {
        setActiveCategory(category);
         // Update URL without reloading the page
        const newUrl = category ? `/tin-tuc?category=${category}` : '/tin-tuc';
        window.history.pushState({}, '', newUrl);
    };

    return (
        <div className="container py-12 bg-white text-black">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 mb-10">
                <h1 className="font-headline text-xl font-black uppercase text-neutral-700 mb-4 md:mb-0">
                    TIN TỨC MỚI NHẤT
                </h1>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-bold uppercase tracking-widest">
                    <button 
                        onClick={() => handleCategoryClick(null)}
                        className={cn(
                            "hover:text-black transition-colors",
                            activeCategory === null ? "text-black" : "text-neutral-500"
                        )}
                    >
                        TẤT CẢ
                    </button>
                    {allCategories.map(category => {
                        const count = getCategoryCount(category);
                        if (count === 0 && !isLoading) return null;
                        return (
                            <button 
                                key={category}
                                onClick={() => handleCategoryClick(category)}
                                className={cn(
                                    "hover:text-black transition-colors",
                                    activeCategory === category ? "text-black" : "text-neutral-500"
                                )}
                            >
                                {category} {isLoading ? '' : `(${count})`}
                            </button>
                        )
                    })}
                </div>
            </div>
            
            <div className="grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
                {isLoading ? (
                    Array.from({ length: 6 }).map((_, i) => <BlogCardSkeleton key={i} />)
                ) : (
                    filteredPosts?.map(post => (
                        <BlogCard key={post.id} post={post} />
                    ))
                )}
                 {!isLoading && filteredPosts?.length === 0 && (
                    <p className="text-center col-span-full text-muted-foreground">Không có bài viết nào trong danh mục này.</p>
                )}
            </div>
        </div>
    )
}

export default function BlogListing() {
    return (
        <Suspense fallback={<div>Đang tải...</div>}>
            <BlogListingContent />
        </Suspense>
    )
}
