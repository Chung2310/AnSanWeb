'use client';
import { useProducts } from '@/hooks/use-products';
import ProductListing from '@/components/product-listing';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';
import { useParams, notFound } from 'next/navigation';
import { wineMegaMenuData } from '@/lib/mega-menu-data';

const findCategoryInfo = (slug: string) => {
    const allItems = [
        ...wineMegaMenuData.theoLoai,
        ...wineMegaMenuData.theoQuocGia,
        ...wineMegaMenuData.theoVung,
        ...wineMegaMenuData.theoGiongNho,
    ];
    return allItems.find(item => item.slug === slug);
}

export default function ProductsPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { products, isLoading } = useProducts();
  
  const categoryInfo = useMemo(() => findCategoryInfo(slug), [slug]);
  
  const pageTitle = categoryInfo ? categoryInfo.label : "Sản phẩm";

  const filteredProducts = useMemo(() => {
    if (!products || !categoryInfo) return [];
    return products.filter(wine => wine.tags?.includes(categoryInfo.category_id));
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
    />
  );
}
