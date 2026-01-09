'use client'

import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import { User, Calendar } from "lucide-react";
import PostSidebar from "@/components/post-sidebar";
import type { BlogPost } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import Lottie from 'lottie-react';
import loadingAnimation from '@/components/loading.json';
import { useBlogPostBySlug } from "@/hooks/use-blog-post-by-slug";

const PostPageSkeleton = () => (
    <div className="flex h-screen w-full items-center justify-center bg-white">
        <Lottie animationData={loadingAnimation} className="h-32 w-32" />
    </div>
);

function PostDetailView({ post }: { post: BlogPost }) {
    const postDate = post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString('vi-VN') : null;

    return (
        <div className="bg-white text-black py-16">
            <div className="container max-w-screen-xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Main Content */}
                    <div className="lg:col-span-8">
                        <div className="flex flex-wrap items-center space-x-6 text-xs font-bold uppercase tracking-widest mb-6" style={{color: '#8a7d6a'}}>
                            <div className="flex items-center gap-2">
                               <User className="h-4 w-4" />
                               <span>BY {post.author || 'AnSan'}</span>
                            </div>
                             {postDate && (
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>{postDate}</span>
                                </div>
                            )}
                            {post.categories && post.categories.length > 0 && (
                                <div className="flex items-center gap-2">
                                    <span>{post.categories.join(' / ')}</span>
                                </div>
                            )}
                        </div>
                        
                        <h1 className="font-headline text-4xl font-black uppercase text-neutral-700 mb-8">
                            {post.title}
                        </h1>

                        {post.image && post.image.url && (
                             <Image 
                                src={post.image.url} 
                                alt={post.title}
                                width={1200}
                                height={600}
                                className="w-full rounded-lg my-8"
                                data-ai-hint={post.image.imageHint}
                                priority
                            />
                        )}
                        
                        {post.content && (
                            <article 
                                className="prose prose-lg max-w-none prose-headings:font-headline prose-headings:text-neutral-700" 
                                style={{color: '#5a5a5a'}}
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            >
                            </article>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4">
                        <PostSidebar currentPostId={post.id} />
                    </div>
                </div>
            </div>
        </div>
    );
}


export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { post, isLoading, error } = useBlogPostBySlug(slug);

  if (isLoading) {
    return <PostPageSkeleton />;
  }

  // After loading, if there's an error or the post is null (not found), show 404.
  if (error || !post) {
    console.error("Error fetching post or post not found:", error);
    notFound();
  }

  // If the post is found, render it.
  return <PostDetailView post={post} />;
}
