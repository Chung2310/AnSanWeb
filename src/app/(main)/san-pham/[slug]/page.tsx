import React from 'react';
import { notFound } from 'next/navigation';
import type { FullProduct } from '@/lib/types';
import ProductDetailView from './product-detail-view';
import type { Metadata, ResolvingMetadata } from 'next';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function getProduct(slug: string) {
    const BACKEND_URL = process.env.INTERNAL_API_URL || 'http://127.0.0.1:3006/api/v1';
  try {
    const res = await fetch(`${BACKEND_URL}/products/slug/${slug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as FullProduct;
  } catch (err) {
    console.error('Failed to getProduct:', err);
    return null;
  }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = (await params).slug;
  const product = await getProduct(slug);

  if (!product) return {};

  const previousImages = (await parent).openGraph?.images || [];
  const description = product.shortDescription || product.description?.substring(0, 160).replace(/<[^>]*>/g, '');

  return {
    title: product.nameVN,
    description: description,
    openGraph: {
      title: `${product.nameVN} | AnSan`,
      description: description,
      url: `https://ruouvangansan.vn/san-pham/${slug}`,
      images: product.image ? [{ url: product.image.url, width: 800, height: 800 }] : previousImages,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.nameVN} | AnSan`,
      description: description,
      images: product.image ? [product.image.url] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const slug = (await params).slug;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailView product={product} />;
}
