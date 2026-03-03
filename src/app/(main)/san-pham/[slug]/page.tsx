import React from 'react';
import { notFound } from 'next/navigation';
import { initializeFirebase } from '@/firebase/init';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import type { FullProduct } from '@/lib/types';
import ProductDetailView from './product-detail-view';
import type { Metadata, ResolvingMetadata } from 'next';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function getProduct(slug: string) {
  const { firestore } = initializeFirebase();
  const productsCol = collection(firestore, 'products');
  const q = query(productsCol, where('slug', '==', slug), limit(1));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) return null;
  const data = { ...snapshot.docs[0].data(), id: snapshot.docs[0].id };
  
  // Sanitize data for Client Component (Serialization fix for Firebase Timestamps)
  return JSON.parse(JSON.stringify(data)) as FullProduct;
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
