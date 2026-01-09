'use client';

import { useState } from 'react';
import Link from "next/link";
import Image from "next/image";
import { cn } from '@/lib/utils';
import type { BlogPost } from '@/lib/types';
import { Skeleton } from './ui/skeleton';
import { useBlogPosts } from '@/hooks/use-blog-posts';
import { usePathname } from 'next/navigation';

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
                <div className="aspect-[4/3] overflow-hidden">
                    {post.image && (
                        <Image 
                            src={post.image.url}
                            alt={post.title}
                            width={600}
                            height={400}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            data-ai-hint={post.image.imageHint || 'blog post'}
                        />
                    )}
                </div>
            </div>
            <div className="mt-4 text-left">
                <div className="flex items-center text-xs font-bold uppercase tracking-widest gap-2" style={{ color: '#8a7d6a' }}>
                    <span>{post.categories.join(' / ')}</span>
                </div>
                <h2 className="font-headline text-xl font-black uppercase mt-2 text-neutral-700 group-hover:text-primary transition-colors">
                    {post.title}
                </h2>
                <p className="text-xs font-bold uppercase tracking-widest mt-3" style={{ color: '#8a7d6a' }}>
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
        <Skeleton className="h-4 w-1/4" />
    </div>
);


interface BlogListingProps {
    defaultCategory?: string | null;
}

export default function BlogListing({ defaultCategory = null }: BlogListingProps) {
    const [activeCategory, setActiveCategory] = useState<string | null>(defaultCategory);
    const { blogPosts, isLoading } = useBlogPosts();
    const pathname = usePathname();
    const isBlogIndex = pathname === '/tin-tuc';

    const getCategoryCount = (category: string) => {
        if (!blogPosts) return 0;
        return blogPosts.filter(post => post.categories.includes(category)).length;
    }
    
    const filteredPosts = activeCategory
        ? blogPosts?.filter(post => post.categories.includes(activeCategory))
        : blogPosts;

    const handleCategoryClick = (category: string | null) => {
        setActiveCategory(category);
    };

    return (
        <div className="container py-12 bg-white text-black">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 mb-10">
                <h1 className="font-headline text-xl font-black uppercase text-neutral-700 mb-4 md:mb-0">
                    {isBlogIndex ? 'Tin Tức Mới Nhất' : 'Danh mục bài viết'}
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
            
            {defaultCategory && !activeCategory && (
                 <div className="text-center mb-10">
                     <h1 className="font-headline text-4xl font-bold uppercase text-neutral-800">
                         Kiến thức {defaultCategory.toLowerCase().replace(/^\w/, c => c.toUpperCase())}
                     </h1>
                 </div>
            )}
            
            <div className="grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
                {isLoading ? (
                    Array.from({ length: 6 }).map((_, i) => <BlogCardSkeleton key={i} />)
                ) : (
                    filteredPosts?.map(post => (
                        <BlogCard key={post.id} post={post} />
                    ))
                )}
            </div>
        </div>
    )
}
