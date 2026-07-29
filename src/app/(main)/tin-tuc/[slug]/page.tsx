import { notFound } from "next/navigation";
import type { BlogPost } from "@/lib/types";
import PostDetailView from "./post-detail-view";
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function getPost(slug: string) {
  const BACKEND_URL = process.env.INTERNAL_API_URL || 'http://127.0.0.1:3001/api/v1';
  try {
    const res = await fetch(`${BACKEND_URL}/blog-posts/slug/${slug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as BlogPost;
  } catch (err) {
    console.error('Failed to getPost:', err);
    return null;
  }
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

  // Chuyển dữ liệu đã được làm sạch (serialized)
  return <PostDetailView post={post} />;
}
