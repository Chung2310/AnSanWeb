
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
  const pageTitle = "Rượu Vang";
  
  const wineProducts = useMemo(() => {
    if (!products || !categories) return [];
    
    const bestChoiceProductNames = [
      "Old Vine Cabernet Sauvignon",
      "Old Vine Shiraz",
      "Gigino Grande (Phiên bản kỷ niệm 80 năm) – Vang Đỏ",
      "Sgarzi Luigi Primitivo di Manduria DOC",
      "Piandimare \"Tassanera\" Montepulciano d'Abruzzo Riserva",
      "Enzo Vincenzo Appassimento Puglia IGT",
      "Grande Alberone Moscato",
    ].map(name => name.replace(/\u200B/g, '').trim());

    const getDescendantIds = (parentId: string, allCategories: Category[]): string[] => {
        const children = allCategories.filter(cat => cat.parentId === parentId);
        let ids = children.map(cat => cat.id);
        children.forEach(child => {
            ids = [...ids, ...getDescendantIds(child.id, allCategories)];
        });
        return ids;
    };

    // Find the 'ruou-vang' category and its descendants
    const wineCategory = categories.find(c => c.slug === 'ruou-vang');
    if (!wineCategory) return [];

    const descendantCategoryIds = getDescendantIds(wineCategory.id, categories);
    const allWineIds = [wineCategory.id, ...descendantCategoryIds];
    
    // Get all products belonging to the wine category
    const allWineProducts = products.filter(wine => wine.tags?.some(tag => allWineIds.includes(tag)));

    // Separate into best choice and others
    const bestChoiceProducts: typeof products = [];
    const otherProducts: typeof products = [];

    allWineProducts.forEach(product => {
      const normalizedName = product.nameVN.replace(/\u200B/g, '').trim();
      if (bestChoiceProductNames.includes(normalizedName)) {
        bestChoiceProducts.push(product);
      } else {
        otherProducts.push(product);
      }
    });

    // Combine them with best choice products at the top
    return [...bestChoiceProducts, ...otherProducts];
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
      initialProducts={wineProducts}
      title={pageTitle}
    />
  );
}
