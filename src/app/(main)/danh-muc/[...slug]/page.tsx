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
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/api/v1';
  try {
    const res = await fetch(`${BACKEND_URL}/categories/slug/${finalSlug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as Category;
  } catch (err) {
    console.error('Failed to getCategory:', err);
    return null;
  }
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const sParams = await searchParams;
  const category = await getCategory(slug);

  if (!category) return {};

  const description = category.description?.substring(0, 160).replace(/<[^>]*>/g, '') || `Bộ sưu tập ${category.name} tại AnSan Wine & Spirit.`;

  // Prevent bot index for filtered URLs
  const hasFilters = Object.keys(sParams).some(key => 
    key.startsWith('filter_') || 
    ['loai-vang', 'nong-do', 'quoc-gia', 'giong-nho', 'gia', 'page'].includes(key)
  );

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

    const filterCount = Object.keys(sParams).filter(k => 
        k.startsWith('filter_') || ['nong-do', 'quoc-gia', 'loai-vang', 'giong-nho'].includes(k)
    ).length;
    
    if (filterCount > 5) {
        return (
            <div className="container py-20 text-center">
                <h2 className="text-xl font-bold text-primary">Yêu cầu quá phức tạp</h2>
                <p className="mt-4 text-muted-foreground">Vui lòng sử dụng ít bộ lọc hơn để có kết quả tốt nhất.</p>
            </div>
        );
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
