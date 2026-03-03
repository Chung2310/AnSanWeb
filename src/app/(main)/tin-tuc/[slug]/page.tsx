import { notFound } from "next/navigation";
import { initializeFirebase } from "@/firebase/init";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import type { BlogPost } from "@/lib/types";
import PostDetailView from "./post-detail-view";
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function getPost(slug: string) {
  const { firestore } = initializeFirebase();
  const blogPostsCol = collection(firestore, 'blogPosts');
  const q = query(blogPostsCol, where('slug', '==', slug), limit(1));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) return null;
  const data = { ...snapshot.docs[0].data(), id: snapshot.docs[0].id };
  
  // Serialization fix: Chuyển đổi Firestore Timestamps sang Plain Object cho Next.js 15
  return JSON.parse(JSON.stringify(data)) as BlogPost;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = (await params).slug;
  const post = await getPost(slug);

  if (!post) return {};

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: post.title,
    description: post.excerpt || post.content?.substring(0, 160).replace(/<[^>]*>/g, ''),
    openGraph: {
      title: `${post.title} | AnSan`,
      description: post.excerpt || post.content?.substring(0, 160).replace(/<[^>]*>/g, ''),
      url: `https://ruouvangansan.vn/tin-tuc/${slug}`,
      images: post.image ? [post.image.url, ...previousImages] : previousImages,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | AnSan`,
      description: post.excerpt || post.content?.substring(0, 160).replace(/<[^>]*>/g, ''),
      images: post.image ? [post.image.url] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const slug = (await params).slug;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  // Chuyền dữ liệu đã được làm sạch (serialized)
  return <PostDetailView post={post} />;
}
