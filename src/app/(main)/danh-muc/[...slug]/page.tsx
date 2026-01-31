
'use client';
import { useProducts } from '@/hooks/use-products';
import ProductListing from '@/components/product-listing';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';
import { useParams, notFound } from 'next/navigation';
import { useCategories } from '@/hooks/use-categories';
import type { Category } from '@/lib/types';

export default function ProductsPage() {
  const params = useParams();
  const slugParts = (params.slug as string[]) || [];

  const { products, isLoading: isLoadingProducts } = useProducts();
  const { categories, isLoading: isLoadingCategories } = useCategories();

  // Find the target category by validating the full hierarchical slug path.
  const categoryInfo = useMemo(() => {
    if (!categories || slugParts.length === 0) return null;

    let currentParentId: string | null = null;
    let foundCategory: Category | null = null;

    for (const slug of slugParts) {
      const category = categories.find(c => c.slug === slug && c.parentId === currentParentId);
      
      if (category) {
        foundCategory = category;
        currentParentId = category.id;
      } else {
        // If any part of the path does not resolve, the entire path is invalid.
        return null;
      }
    }
    
    return foundCategory;
  }, [categories, slugParts]);


  const pageTitle = categoryInfo ? categoryInfo.name : "Danh mục sản phẩm";
  const isLoading = isLoadingProducts || isLoadingCategories;

  // Memoized function to get all descendant IDs for a given category.
  const getDescendantIds = useMemo(() => {
    const getIds = (parentId: string, allCategories: Category[]): string[] => {
        const children = allCategories.filter(cat => cat.parentId === parentId);
        let ids = children.map(cat => cat.id);
        children.forEach(child => {
            ids = [...ids, ...getIds(child.id, allCategories)];
        });
        return ids;
    };
    return getIds;
  }, []);

  const filteredProducts = useMemo(() => {
    if (!products || !categories || !categoryInfo) return [];

    // Get the ID of the current category and all its descendants.
    const descendantIds = getDescendantIds(categoryInfo.id, categories);
    const allCategoryIds = [categoryInfo.id, ...descendantIds];

    // Filter products that have at least one tag matching any of the category IDs.
    return products.filter(wine => 
      wine.tags?.some(tag => allCategoryIds.includes(tag))
    );
  }, [products, categories, categoryInfo, getDescendantIds]);

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

  // After loading, if we couldn't find a valid category for the slug, it's a 404.
  if (!isLoading && !categoryInfo) {
      notFound();
  }

  return (
    <ProductListing
      key={pageTitle}
      initialProducts={filteredProducts}
      title={pageTitle}
      categoryDescription={categoryInfo?.description}
    />
  );
}
