import React from 'react';
import { notFound } from 'next/navigation';
import { initializeFirebase } from '@/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import type { FullProduct } from '@/lib/types';
import ProductDetailView from './product-detail-view';
import type { Metadata, ResolvingMetadata } from 'next';

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
  return { ...snapshot.docs[0].data(), id: snapshot.docs[0].id } as FullProduct;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = (await params).slug;
  const product = await getProduct(slug);

  if (!product) return {};

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: product.nameVN,
    description: product.shortDescription || product.description?.substring(0, 160),
    openGraph: {
      title: `${product.nameVN} | AnSan`,
      description: product.shortDescription || product.description?.substring(0, 160),
      url: `https://ruouvangansan.vn/san-pham/${slug}`,
      images: product.image ? [product.image.url, ...previousImages] : previousImages,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.nameVN} | AnSan`,
      description: product.shortDescription || product.description?.substring(0, 160),
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
