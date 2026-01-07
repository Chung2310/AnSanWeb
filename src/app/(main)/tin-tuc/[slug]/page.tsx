'use client'

import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User } from "lucide-react";
import PostSidebar from "@/components/post-sidebar";
import TableOfContents from "@/components/table-of-contents";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import type { BlogPost } from "@/lib/types";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// This is a placeholder for a function that would parse content and extract headings
const generateHeadings = (content: string) => {
    // In a real app, you'd parse the content to find h2, h3, etc.
    // For now, we'll use a static example based on the UI.
    const headings = [];
    const matches = content.matchAll(/<h([2-3]) id="([^"]+)">([^<]+)<\/h\1>/g);
    for (const match of matches) {
        headings.push({
            level: parseInt(match[1]),
            id: match[2],
            text: match[3],
        });
    }
    // if no headings found, create some from text
    if (headings.length === 0) {
        const lines = content.split('\n');
        // get first 4 non-empty lines
        const a = lines.filter(line => line.trim() !== '').slice(1, 5);
        return a.map((line, i) => ({
            id: `heading-${i}`,
            text: line.substring(0, 50),
            level: 2,
        }));
    }
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
  const firestore = useFirestore();

  const postsCollection = useMemoFirebase(() => collection(firestore, 'blogPosts'), [firestore]);
  const postQuery = useMemoFirebase(() => postsCollection && query(postsCollection, where('slug', '==', slug)), [postsCollection, slug]);

  const { data: posts, isLoading } = useCollection<BlogPost>(postQuery);
  
  const post = useMemo(() => (posts && posts.length > 0 ? posts[0] : null), [posts]);

  if (isLoading) {
    return <PostPageSkeleton />;
  }

  if (!post) {
    notFound();
  }

  const headings = generateHeadings(post.content || ""); 
  const date = new Date(post.date);
  const formattedDate = `${date.getDate()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;

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
                         <div className="flex items-center gap-2">
                           <Calendar className="h-4 w-4" />
                           <span>{formattedDate}</span>
                        </div>
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
                            src={post.image.imageUrl} 
                            alt={post.title}
                            width={1200}
                            height={600}
                            className="w-full rounded-lg my-8"
                            data-ai-hint={post.image.imageHint}
                        />
                    )}
                    
                    <article 
                        className="prose prose-lg max-w-none" 
                        style={{color: '#5a5a5a'}}
                        dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
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
