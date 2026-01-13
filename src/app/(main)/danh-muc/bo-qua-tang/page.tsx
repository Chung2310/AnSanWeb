'use client';
import { useProducts } from '@/hooks/use-products';
import ProductListing from '@/components/product-listing';
import { Skeleton } from '@/components/ui/skeleton';
import { useCategories } from '@/hooks/use-categories';
import { useMemo } from 'react';

export default function ProductsPage() {
  const { products, isLoading: isLoadingProducts } = useProducts();
  const { categories, isLoading: isLoadingCategories } = useCategories();
  const pageTitle = "Bộ quà tặng";

  const giftSetProducts = useMemo(() => {
    if (!products || !categories) return [];
    
    // Find the parent "Bộ quà tặng" category by its slug
    const giftSetParentCategory = categories.find(c => c.slug === 'bo-qua-tang');
    if (!giftSetParentCategory) return [];
    
    // Find all direct children of the parent category
    const childCategoryIds = categories
      .filter(c => c.parentId === giftSetParentCategory.id)
      .map(c => c.id);
      
    // Combine the parent ID and all child IDs to create a comprehensive list
    const allGiftCategoryIds = [giftSetParentCategory.id, ...childCategoryIds];

    // Filter products that have a tag matching any of the identified category IDs
    return products.filter(wine => wine.tags?.some(tag => allGiftCategoryIds.includes(tag)));
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
      initialProducts={giftSetProducts}
      title={pageTitle}
    />
  );
}
