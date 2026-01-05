'use client';

import { useState } from 'react';
import { sampleBlogPosts } from "@/lib/placeholder-data";
import Link from "next/link";
import Image from "next/image";
import { cn } from '@/lib/utils';
import type { BlogPost } from '@/lib/types';

const allCategories = [
    'DISTILLERIES',
    'NEWS',
    'SPIRITS',
    'WHISKY BASICS',
    'WHISKY REVIEW',
];

const getCategoryCount = (category: string) => {
    return sampleBlogPosts.filter(post => post.categories.includes(category)).length;
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = `TH${date.getMonth() + 1}`;
    return { day, month };
}

const BlogCard = ({ post }: { post: BlogPost }) => {
    const { day, month } = formatDate(post.date);

    return (
        <Link href={`/tin-tuc/${post.slug}`} className="group block">
            <div className="relative">
                <div className="aspect-[4/3] overflow-hidden">
                    <Image 
                        src={post.image.imageUrl} 
                        alt={post.title}
                        width={600}
                        height={400}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        data-ai-hint={post.image.imageHint}
                    />
                </div>
                <div 
                    className="absolute top-4 left-0 bg-white text-center font-bold"
                    style={{
                        padding: '5px 10px 5px 10px',
                        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%)'
                    }}
                >
                    <div className="text-xl leading-none" style={{color: '#8a7d6a'}}>{day}</div>
                    <div className="text-xs leading-none" style={{color: '#8a7d6a'}}>{month}</div>
                </div>
            </div>
            <div className="mt-4 text-left">
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#8a7d6a' }}>
                    {post.categories.join(' ')}
                </p>
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

export default function BlogPage() {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const filteredPosts = activeCategory
        ? sampleBlogPosts.filter(post => post.categories.includes(activeCategory))
        : sampleBlogPosts;

    return (
        <div className="container py-12 bg-white text-black">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 mb-10">
                <h1 className="font-headline text-xl font-black uppercase text-neutral-700 mb-4 md:mb-0">
                    Danh mục bài viết
                </h1>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-bold uppercase tracking-widest">
                    <button 
                        onClick={() => setActiveCategory(null)}
                        className={cn(
                            "hover:text-black transition-colors",
                            activeCategory === null ? "text-black" : "text-neutral-500"
                        )}
                    >
                        TẤT CẢ
                    </button>
                    {allCategories.map(category => {
                        const count = getCategoryCount(category);
                        if (count === 0) return null;
                        return (
                            <button 
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={cn(
                                    "hover:text-black transition-colors",
                                    activeCategory === category ? "text-black" : "text-neutral-500"
                                )}
                            >
                                {category} ({count})
                            </button>
                        )
                    })}
                </div>
            </div>
            <div className="grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.map(post => (
                    <BlogCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    )
}
