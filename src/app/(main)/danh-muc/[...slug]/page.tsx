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
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function getCategory(slugParts: string[]) {
  const finalSlug = slugParts[slugParts.length - 1];
  const { firestore } = initializeFirebase();
  const categoriesCol = collection(firestore, 'categories');
  const q = query(categoriesCol, where('slug', '==', finalSlug), limit(1));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) return null;
  const data = { ...snapshot.docs[0].data(), id: snapshot.docs[0].id };
  
  // Serialization fix: Chuyển đổi Firestore Timestamps sang dạng Plain Object cho Next.js 15
  return JSON.parse(JSON.stringify(data)) as Category;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const sParams = await searchParams;
  const category = await getCategory(slug);

  if (!category) return {};

  const description = category.description?.substring(0, 160).replace(/<[^>]*>/g, '') || `Bộ sưu tập ${category.name} tại AnSan Wine & Spirit.`;

  // Bảo vệ server: Nếu có tham số lọc, yêu cầu bot không index (Chống Crawler Trap)
  const hasFilters = Object.keys(sParams).some(key => key.startsWith('filter_') || key === 'loai-vang' || key === 'nong-do' || key === 'quoc-gia');

  return {
    title: category.name,
    description: description,
    robots: hasFilters ? 'noindex, nofollow' : 'index, follow',
    openGraph: {
      title: `${category.name} | AnSan`,
      description: description,
      url: `https://ruouvangansan.vn/danh-muc/${slug.join('/')}`,
      images: category.image ? [{ url: category.image.url }] : [],
    },
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
    const slug = (await params).slug;
    const sParams = await searchParams;

    // Bảo vệ server: Giới hạn số lượng bộ lọc cùng lúc để tránh sập SQL/NoSQL
    const filterCount = Object.keys(sParams).filter(k => k.startsWith('filter_') || k === 'nong-do' || k === 'quoc-gia').length;
    if (filterCount > 5) {
        return <div className="container py-20 text-center">Vui lòng sử dụng ít bộ lọc hơn để có kết quả chính xác nhất.</div>;
    }

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
