

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

  const { products, isLoading: isLoadingProducts } = useProducts();
  const { categories, isLoading: isLoadingCategories } = useCategories();
  const isLoading = isLoadingProducts || isLoadingCategories;

  const categoryInfo = useMemo(() => {
    if (!categories || !slugParts || slugParts.length === 0) return null;

    const finalSlug = slugParts[slugParts.length - 1];
    
    // Find all categories that could potentially match the last part of the URL.
    const candidateCategories = categories.filter(c => c.slug === finalSlug);

    if (candidateCategories.length === 0) {
      return null;
    }
    
    // Create a map for quick parent lookup.
    const categoryMap = new Map(categories.map(c => [c.id, c]));

    // For each candidate, rebuild its full path and see if it matches the URL.
    for (const candidate of candidateCategories) {
      const path: string[] = [];
      let current: Category | undefined = candidate;

      while (current) {
        path.unshift(current.slug);
        current = current.parentId ? categoryMap.get(current.parentId) : undefined;
      }

      // If the reconstructed path matches the URL's slug parts, we've found our category.
      if (JSON.stringify(path) === JSON.stringify(slugParts)) {
        return candidate;
      }
    }

    return null; // No category found with a matching path.
  }, [categories, slugParts]);


  const getDescendantIds = useCallback((parentId: string, allCategories: Category[] | null): string[] => {
    if (!allCategories) return [];
    const descendantIds: string[] = [];
    const queue: string[] = [parentId];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      if(visited.has(currentId)) continue;
      visited.add(currentId);

      const children = allCategories.filter(cat => cat.parentId === currentId);
      for (const child of children) {
          descendantIds.push(child.id);
          queue.push(child.id);
      }
    }
    return descendantIds;
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
