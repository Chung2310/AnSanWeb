'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProducts } from '@/hooks/use-products';
import ProductListing from '@/components/product-listing';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const { products, isLoading } = useProducts();

  const filteredProducts = useMemo(() => {
    if (!products || !query) {
      return [];
    }
    const lowercasedQuery = query.toLowerCase();
    return products.filter(product =>
      product.nameVN.toLowerCase().includes(lowercasedQuery)
    );
  }, [products, query]);

  if (isLoading) {
    return (
      <div className="container py-12">
        <Skeleton className="h-8 w-1/2 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
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
    );
  }

  const pageTitle = query ? `Kết quả tìm kiếm cho "${query}"` : 'Tìm kiếm';

  return (
    <ProductListing
      key={query} // Use query as key to force re-render on new search
      initialProducts={filteredProducts}
      title={pageTitle}
    />
  );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchResults />
        </Suspense>
    )
}
