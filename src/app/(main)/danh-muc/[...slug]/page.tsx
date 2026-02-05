

'use client';
import { useProducts } from '@/hooks/use-products';
import ProductListing from '@/components/product-listing';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo, useCallback } from 'react';
import { useParams, notFound } from 'next/navigation';
import { useCategories } from '@/hooks/use-categories';
import type { Category } from '@/lib/types';

export default function ProductsPage() {
  const params = useParams();
  const slugParts = params?.slug ? (params.slug as string[]) : [];
  const finalSlug = slugParts.length > 0 ? slugParts[slugParts.length - 1] : '';

  const { products, isLoading: isLoadingProducts } = useProducts();
  const { categories, isLoading: isLoadingCategories } = useCategories();
  const isLoading = isLoadingProducts || isLoadingCategories;

  const categoryInfo = useMemo(() => {
    if (!categories || !finalSlug) return null;
    // Simplified logic: Find category by the final slug, assuming slugs are unique.
    // This avoids complex path-walking which was causing issues.
    return categories.find(c => c.slug === finalSlug) || null;
  }, [categories, finalSlug]);


  const getDescendantIds = useCallback((parentId: string, allCategories: Category[]): string[] => {
    const findChildren = (id: string): string[] => {
      const children = allCategories.filter(cat => cat.parentId === id);
      let ids: string[] = children.map(c => c.id);
      for (const child of children) {
        ids = [...ids, ...findChildren(child.id)];
      }
      return ids;
    }
    return findChildren(parentId);
  }, []);

  const filteredProducts = useMemo(() => {
    if (!products || !categories || !categoryInfo) return [];

    const descendantIds = getDescendantIds(categoryInfo.id, categories);
    const allCategoryIds = new Set([categoryInfo.id, ...descendantIds]);

    return products.filter(product => 
      product.tags?.some(tag => allCategoryIds.has(tag))
    );
  }, [products, categories, categoryInfo, getDescendantIds]);

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
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
      initialProducts={filteredProducts}
      title={categoryInfo?.name || 'Danh mục sản phẩm'}
      categoryDescription={categoryInfo?.description}
      initialCategory={categoryInfo}
    />
  );
}
