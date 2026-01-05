'use client';

import { sampleBlogPosts } from "@/lib/placeholder-data";
import Link from "next/link";
import { Separator } from "./ui/separator";
import { Calendar } from "lucide-react";

export default function PostSidebar({ currentPostId }: { currentPostId: string }) {
    // Get the 4 most recent posts, excluding the current one
    const recentPosts = sampleBlogPosts
        .filter(p => p.id !== currentPostId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 4);
    
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    }

    return (
        <aside className="sticky top-24">
            <h3 className="font-headline text-xl font-black uppercase text-neutral-700 mb-6">
                Bài Viết Mới Nhất
            </h3>
            <div className="space-y-6">
                {recentPosts.map((post, index) => (
                    <div key={post.id}>
                        <Link href={`/tin-tuc/${post.slug}`} className="group block">
                            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#8a7d6a' }}>
                                {post.categories.join(', ')}
                            </p>
                            <h4 className="font-bold uppercase text-sm mt-2 text-neutral-700 group-hover:text-primary transition-colors">
                                {post.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-2 text-xs" style={{ color: '#8a7d6a' }}>
                                <Calendar className="h-3 w-3" />
                                <span>{formatDate(post.date)}</span>
                            </div>
                        </Link>
                        {index < recentPosts.length - 1 && <Separator className="mt-6" />}
                    </div>
                ))}
            </div>
        </aside>
    );
}
