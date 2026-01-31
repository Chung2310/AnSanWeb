'use client';
import { useProducts } from '@/hooks/use-products';
import ProductListing from '@/components/product-listing';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';
import { useParams, notFound } from 'next/navigation';
import { useCategories } from '@/hooks/use-categories';

export default function ProductsPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { products, isLoading: isLoadingProducts } = useProducts();
  const { categories, isLoading: isLoadingCategories } = useCategories();
  
  const categoryInfo = useMemo(() => {
    if (!categories) return null;
    return categories.find(c => c.slug === slug);
  }, [categories, slug]);
  
  const pageTitle = categoryInfo ? categoryInfo.name : "Sản phẩm";
  const isLoading = isLoadingProducts || isLoadingCategories;

  const filteredProducts = useMemo(() => {
    if (!products || !categoryInfo) return [];
    return products.filter(wine => wine.tags?.includes(categoryInfo.id));
  }, [products, categoryInfo]);

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
  if (!categoryInfo) {
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
