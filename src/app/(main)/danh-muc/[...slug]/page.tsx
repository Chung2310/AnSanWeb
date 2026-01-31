
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
  // The slug can be a single part (e.g., /ruou-vang) or multiple parts (e.g., /ruou-vang/vang-phap)
  const slugParts = (params.slug as string[]) || [];

  const { products, isLoading: isLoadingProducts } = useProducts();
  const { categories, isLoading: isLoadingCategories } = useCategories();
  const isLoading = isLoadingProducts || isLoadingCategories;

  // 1. Find the target category based on the full hierarchical slug from the URL.
  const categoryInfo = useMemo(() => {
    if (!categories || slugParts.length === 0) return null;

    let currentParentId: string | null = null;
    let foundCategory: Category | null = null;

    // Traverse the slug parts to find the deepest matching category
    for (const slug of slugParts) {
      const category = categories.find(c => c.slug === slug && c.parentId === currentParentId);
      
      if (category) {
        foundCategory = category;
        currentParentId = category.id; // The found category becomes the parent for the next slug part
      } else {
        // If any part of the path doesn't resolve, the slug is invalid.
        return null;
      }
    }
    
    return foundCategory;
  }, [categories, slugParts]);

  // 2. Create a function to get all descendant category IDs for a given parent.
  //    This uses an iterative approach (queue) to avoid deep recursion issues.
  const getDescendantIds = useCallback((parentId: string, allCategories: Category[]): string[] => {
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

  // 3. Filter the products based on the resolved category and all its descendants.
  const filteredProducts = useMemo(() => {
    // Wait until all data is loaded and a valid category is found
    if (!products || !categories || !categoryInfo) return [];

    // Get the ID of the current category and all its children, grandchildren, etc.
    const descendantIds = getDescendantIds(categoryInfo.id, categories);
    
    // Create a Set for efficient lookup, including the parent category itself.
    const allCategoryIds = new Set([categoryInfo.id, ...descendantIds]);

    // Filter products: include a product if any of its tags are in our set of category IDs.
    return products.filter(product => 
      product.tags?.some(tag => allCategoryIds.has(tag))
    );
  }, [products, categories, categoryInfo, getDescendantIds]);

  // After loading, if we couldn't find a valid category for the slug, show a 404 page.
  if (!isLoading && !categoryInfo) {
      notFound();
  }

  // Show skeleton loaders while data is being fetched.
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
      key={categoryInfo?.id || 'all'} // Use category ID as key to re-mount component on category change
      initialProducts={filteredProducts}
      title={categoryInfo?.name || 'Danh mục sản phẩm'}
      categoryDescription={categoryInfo?.description}
    />
  );
}
