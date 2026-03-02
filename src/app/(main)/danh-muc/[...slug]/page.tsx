'use client';
import { useProducts } from '@/hooks/use-products';
import ProductListing from '@/components/product-listing';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo, Suspense } from 'react';
import { useParams, notFound, useSearchParams } from 'next/navigation';
import { useCategories } from '@/hooks/use-categories';
import type { Category } from '@/lib/types';
import { staticFiltersData, type ActiveFilters } from '@/components/sidebar-filter';

export const dynamic = 'force-dynamic';

function CategoryPageContent() {
  const params = useParams();
  const slug = params?.slug;
  const searchParams = useSearchParams();
  const slugParts = Array.isArray(slug) ? slug : [slug].filter(Boolean);
  const finalSlug = slugParts.length > 0 ? slugParts[slugParts.length - 1] : '';

  const { products, isLoading: isLoadingProducts } = useProducts();
  const { categories, isLoading: isLoadingCategories } = useCategories();
  const isLoading = isLoadingProducts || isLoadingCategories;

  const queryFilters = useMemo(() => {
    const filters: ActiveFilters = {};
    if (!searchParams) {
        return filters;
    }
    for (const filterKey in staticFiltersData) {
        const paramKey = `filter_${filterKey.replace(/ /g, '_')}`;
        const paramValue = searchParams.get(paramKey);
        if (paramValue) {
            // @ts-ignore
            filters[filterKey] = paramValue.split(',');
        }
    }
    return filters;
  }, [searchParams]);

  const categoryInfo = useMemo(() => {
    if (!categories || !finalSlug) return null;
    return categories.find(c => c.slug === finalSlug) || null;
  }, [categories, finalSlug]);


  if (!isLoading && !categoryInfo) {
      notFound();
  }

  if (isLoading) {
    return (
       <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
                <Skeleton className="h-12 w-full mb-8" />
                <Skeleton className="h-64 w-full" />
            </div>
            <div className="lg:col-span-3">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 9 }).map((_, i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="h-64 w-full" />
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    )
  }

  return (
    <ProductListing
      key={categoryInfo?.id || 'all'}
      initialProducts={products || []}
      title={categoryInfo?.name || 'Danh mục sản phẩm'}
      categoryDescription={categoryInfo?.description}
      initialCategory={categoryInfo}
      queryFilters={queryFilters}
    />
  );
}

export default function CategoryPage() {
    return (
        <Suspense fallback={
            <div className="container py-12 flex items-center justify-center min-h-[400px]">
                <Skeleton className="h-32 w-32 rounded-full" />
            </div>
        }>
            <CategoryPageContent />
        </Suspense>
    );
}