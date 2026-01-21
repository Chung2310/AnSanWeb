
'use client';
import { useProducts } from '@/hooks/use-products';
import ProductListing from '@/components/product-listing';
import { Skeleton } from '@/components/ui/skeleton';
import { useCategories } from '@/hooks/use-categories';
import { useMemo } from 'react';
import type { Category } from '@/lib/types';

export default function ProductsPage() {
  const { products, isLoading: isLoadingProducts } = useProducts();
  const { categories, isLoading: isLoadingCategories } = useCategories();
  const pageTitle = "Ly & Cốc Pha Lê";

  const glassProducts = useMemo(() => {
    if (!products || !categories) return [];
    
    const glassCategory = categories.find(c => c.slug === 'ly-coc-pha-le');
    if (!glassCategory) return [];

    const getDescendantIds = (parentId: string, allCategories: Category[]): string[] => {
        const children = allCategories.filter(cat => cat.parentId === parentId);
        let ids = children.map(cat => cat.id);
        children.forEach(child => {
            ids = [...ids, ...getDescendantIds(child.id, allCategories)];
        });
        return ids;
    };

    const descendantCategoryIds = getDescendantIds(glassCategory.id, categories);
    const allGlassIds = [glassCategory.id, ...descendantCategoryIds];
    
    return products.filter(wine => wine.tags?.some(tag => allGlassIds.includes(tag)));
  }, [products, categories]);

  const isLoading = isLoadingProducts || isLoadingCategories;

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
      key={pageTitle}
      initialProducts={glassProducts}
      title={pageTitle}
    />
  );
}
