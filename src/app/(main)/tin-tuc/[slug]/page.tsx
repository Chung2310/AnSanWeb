'use client'

import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { User, Calendar } from "lucide-react";
import PostSidebar from "@/components/post-sidebar";
import TableOfContents from "@/components/table-of-contents";
import type { BlogPost } from "@/lib/types";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useBlogPosts } from "@/hooks/use-blog-posts";

// This is a placeholder for a function that would parse content and extract headings
const generateHeadings = (content: string) => {
    // In a real app, you'd parse the content to find h2, h3, etc.
    // For now, we'll use a static example based on the UI.
    const headings = [];
    const contentToParse = content || "";
    if (typeof window === 'undefined') return [];
    
    const doc = new DOMParser().parseFromString(contentToParse, 'text/html');
    const headingElements = doc.querySelectorAll('h1, h2, h3');

    headingElements.forEach((heading, index) => {
      const id = heading.textContent ? heading.textContent.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') : `heading-${index}`;
      heading.id = id;
      headings.push({
          level: parseInt(heading.tagName.substring(1)),
          id: id,
          text: heading.textContent || '',
      });
    });

    return headings;
}

const PostPageSkeleton = () => (
    <div className="bg-white text-black py-16">
        <div className="container max-w-screen-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8">
                    <div className="flex items-center space-x-6 mb-6">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-12 w-full mb-8" />
                    <Skeleton className="h-40 w-full mb-10" />
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-5/6" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-4/6" />
                        <Skeleton className="h-6 w-full" />
                    </div>
                </div>
                <div className="lg:col-span-4">
                    <Skeleton className="h-96 w-full" />
                </div>
            </div>
        </div>
    </div>
)

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { blogPosts, isLoading } = useBlogPosts();

  const post = useMemo(() => {
    if (!blogPosts) return undefined;
    return blogPosts.find(p => p.slug === slug);
  }, [blogPosts, slug]);


  if (isLoading) {
    return <PostPageSkeleton />;
  }

  if (!post) {
    notFound();
  }

  const headings = generateHeadings(post.content || ""); 
  const postDate = post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString('vi-VN') : null;


  return (
    <div className="bg-white text-black py-16">
        <div className="container max-w-screen-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* Main Content */}
                <div className="lg:col-span-8">
                    <div className="flex items-center space-x-6 text-xs font-bold uppercase tracking-widest mb-6" style={{color: '#8a7d6a'}}>
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
                        <div className="flex items-center gap-2">
                            {post.categories.map(cat => (
                                <Link key={cat} href="#" className="hover:text-black">{cat}</Link>
                            ))}
                        </div>
                    </div>
                    
                    <h1 className="font-headline text-4xl font-black uppercase text-neutral-700 mb-8">
                        {post.title}
                    </h1>

                    {headings.length > 0 && <TableOfContents headings={headings} />}
                    
                    {post.image && (
                         <Image 
                            src={post.image.url} 
                            alt={post.title}
                            width={1200}
                            height={600}
                            className="w-full rounded-lg my-8"
                            data-ai-hint={post.image.imageHint}
                        />
                    )}
                    
                    <article 
                        className="prose prose-lg max-w-none prose-headings:font-headline prose-headings:text-neutral-700" 
                        style={{color: '#5a5a5a'}}
                        dangerouslySetInnerHTML={{ __html: post.content || "" }}
                    >
                    </article>
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
