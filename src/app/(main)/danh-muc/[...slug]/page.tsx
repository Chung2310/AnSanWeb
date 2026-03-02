import { initializeFirebase } from '@/firebase/init';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import type { Category } from '@/lib/types';
import CategoryPageContent from './category-page-content';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ slug: string[] }>;
};

async function getCategory(slugParts: string[]) {
  const finalSlug = slugParts[slugParts.length - 1];
  const { firestore } = initializeFirebase();
  const categoriesCol = collection(firestore, 'categories');
  const q = query(categoriesCol, where('slug', '==', finalSlug), limit(1));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) return null;
  return { ...snapshot.docs[0].data(), id: snapshot.docs[0].id } as Category;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const category = await getCategory(slug);

  if (!category) return {};

  const description = category.description?.substring(0, 160).replace(/<[^>]*>/g, '') || `Bộ sưu tập ${category.name} tại AnSan Wine & Spirit.`;

  return {
    title: category.name,
    description: description,
    openGraph: {
      title: `${category.name} | AnSan`,
      description: description,
      url: `https://ruouvangansan.vn/danh-muc/${slug.join('/')}`,
      images: category.image ? [{ url: category.image.url }] : [],
    },
  };
}

export default async function CategoryPage({ params }: Props) {
    const slug = (await params).slug;
    return (
        <Suspense fallback={
            <div className="container py-12 flex items-center justify-center min-h-[400px]">
                <Skeleton className="h-32 w-32 rounded-full" />
            </div>
        }>
            <CategoryPageContent slug={slug} />
        </Suspense>
    );
}
