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
  // For a route like /danh-muc/ruou-vang/vang-y, slug will be ['ruou-vang', 'vang-y']
  const slugParts = (params.slug as string[]) || [];
  const currentSlug = slugParts[slugParts.length - 1];

  const { products, isLoading: isLoadingProducts } = useProducts();
  const { categories, isLoading: isLoadingCategories } = useCategories();

  const categoryInfo = useMemo(() => {
    if (!categories || !currentSlug) return null;
    return categories.find(c => c.slug === currentSlug);
  }, [categories, currentSlug]);

  const pageTitle = categoryInfo ? categoryInfo.name : "Danh mục sản phẩm";
  const isLoading = isLoadingProducts || isLoadingCategories;

  const getDescendantIds = (parentId: string, allCategories: Category[]): string[] => {
      const children = allCategories.filter(cat => cat.parentId === parentId);
      let ids = children.map(cat => cat.id);
      children.forEach(child => {
          ids = [...ids, ...getDescendantIds(child.id, allCategories)];
      });
      return ids;
  };

  const filteredProducts = useMemo(() => {
    if (!products || !categories || !categoryInfo) return [];

    const allCategoryIds = [categoryInfo.id, ...getDescendantIds(categoryInfo.id, categories)];

    return products.filter(wine => wine.tags?.some(tag => allCategoryIds.includes(tag)));
  }, [products, categories, categoryInfo]);

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

  // After loading, if we couldn't find category info for the slug, it's a 404
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
