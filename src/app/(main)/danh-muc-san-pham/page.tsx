'use client';
import { useProducts } from '@/hooks/use-products';
import ProductListing from '@/components/product-listing';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductPagination } from '@/components/product-pagination';
import React from 'react';

export default function ProductsPage() {
  const { products, isLoading } = useProducts();
  const [currentPage, setCurrentPage] = React.useState(1);
  const productsPerPage = 12;

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
  
  const totalProducts = products?.length || 0;
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  const paginatedProducts = products?.slice(
      (currentPage - 1) * productsPerPage,
      currentPage * productsPerPage
  ) || [];

  return (
    <div>
        <ProductListing 
          initialProducts={paginatedProducts}
          title="Tất cả sản phẩm"
        />
        {/* Example Usage of ProductPagination */}
        <div className="container pb-12">
            <h2 className="text-2xl font-bold mt-12 mb-4 text-center">Example: Reusable Pagination Component</h2>
            <div className="p-6 border rounded-lg bg-secondary">
                <p className="text-center text-sm text-muted-foreground mb-4">
                    Total Products: {totalProducts}, Products Per Page: {productsPerPage}
                </p>
                <ProductPagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    </div>
  );
}
