'use client';

import Link from "next/link";
import { Separator } from "./ui/separator";
import { Newspaper, Calendar } from "lucide-react";
import type { BlogPost } from "@/lib/types";
import { Skeleton } from "./ui/skeleton";
import { useBlogPosts } from "@/hooks/use-blog-posts";

export default function PostSidebar({ currentPostId }: { currentPostId: string }) {
    const { blogPosts: allRecentPosts, isLoading } = useBlogPosts();

    const recentPosts = allRecentPosts
        ?.filter(p => p.id !== currentPostId)
        .slice(0, 4);

    return (
        <aside className="sticky top-24">
            <h3 className="font-headline text-xl font-black uppercase text-neutral-700 mb-6">
                Bài Viết Mới Nhất
            </h3>
            <div className="space-y-6">
                 {isLoading && Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-4 w-1/2" />
                        <Separator className="mt-6 !mb-2" />
                    </div>
                ))}
                {!isLoading && recentPosts?.length === 0 && (
                    <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8 border rounded-md">
                        <Newspaper className="h-8 w-8 mb-2"/>
                        <p>Không có bài viết nào.</p>
                    </div>
                )}
                {!isLoading && recentPosts?.map((post, index) => {
                    const postDate = post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString('vi-VN') : null;
                    return (
                        <div key={post.id}>
                            <Link href={`/tin-tuc/${post.slug}`} className="group block">
                                <div className="text-xs font-bold uppercase tracking-widest flex items-center gap-4" style={{ color: '#8a7d6a' }}>
                                    <span>{post.categories.join(', ')}</span>
                                    {postDate && (
                                        <>
                                            <span className="text-neutral-400">|</span>
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="h-3.5 w-3.5" />
                                                <span>{postDate}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <h4 className="font-bold uppercase text-sm mt-2 text-neutral-700 group-hover:text-primary transition-colors">
                                    {post.title}
                                </h4>
                            </Link>
                            {index < recentPosts.length - 1 && <Separator className="mt-6" />}
                        </div>
                    )
                })}
            </div>
        </aside>
    );
}
