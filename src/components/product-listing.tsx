'use client';

import { useState, useMemo, useEffect, Suspense } from "react";
import WineCard from "@/components/wine-card";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/types";
import CategoryBanner, { type CategoryBannerProps } from "./category-banner";
import CategoryNav from "./category-nav";
import SidebarFilter, { type ActiveFilters } from "./sidebar-filter";
import { Paginator } from "./paginator";

const sortingOptions = ["MẶC ĐỊNH", "MỚI NHẤT", "GIÁ TĂNG DẦN", "GIÁ GIẢM DẦN"] as const;
type SortingOption = typeof sortingOptions[number];

interface ProductListingProps {
    initialProducts: Product[];
    title: string;
    bannerData?: CategoryBannerProps;
    itemsPerPage?: number;
}

function ProductListingContent({ initialProducts, title, bannerData, itemsPerPage = 12 }: ProductListingProps) {
  const [activeSort, setActiveSort] = useState<SortingOption>("MẶC ĐỊNH");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});

  const isWineCategory = useMemo(() => {
    return title.toLowerCase().includes('vang');
  }, [title]);

  // Reset page to 1 when initialProducts change (i.e., category changes)
  useEffect(() => {
    setCurrentPage(1);
    setActiveFilters({});
  }, [initialProducts]);


  const filteredProducts = useMemo(() => {
    let filtered = [...initialProducts];

    // Category filters ("DANH MỤC")
    const categoryFilters = activeFilters["DANH MỤC"];
    if (categoryFilters && categoryFilters.length > 0) {
        const categoryIdsToFilter = categoryFilters.map(label => {
            const option = (SidebarFilter.staticFiltersData["DANH MỤC"] || []).find(o => o.label === label);
            return option?.value;
        }).filter((value): value is string => !!value);

        if (categoryIdsToFilter.length > 0) {
            filtered = filtered.filter(p => 
                p.tags?.some(tag => categoryIdsToFilter.includes(tag))
            );
        }
    }
    
    // Price range filtering
    const priceRanges = activeFilters["KHOẢNG GIÁ"]?.map(label => {
        const option = (SidebarFilter.staticFiltersData["KHOẢNG GIÁ"] || []).find(o => o.label === label);
        return option?.value;
    }).filter(Boolean);

    if (priceRanges && priceRanges.length > 0) {
        filtered = filtered.filter(p => 
            priceRanges.some(range => range && p.price >= (range as number[])[0] && p.price < (range as number[])[1])
        );
    }
    
    // Grape varietal filters ("GIỐNG NHO")
    const grapeFilters = activeFilters["GIỐNG NHO"];
    if (grapeFilters && grapeFilters.length > 0) {
        const grapeCategoryIdsToFilter = grapeFilters.map(label => {
            const option = (SidebarFilter.staticFiltersData["GIỐNG NHO"] || []).find(o => o.label === label);
            return option?.value;
        }).filter((value): value is string => !!value);

        if (grapeCategoryIdsToFilter.length > 0) {
            filtered = filtered.filter(p => 
                p.tags?.some(tag => grapeCategoryIdsToFilter.includes(tag))
            );
        }
    }

    return filtered;
  }, [initialProducts, activeFilters]);

  const sortedProducts = useMemo(() => {
    let products = [...filteredProducts];

    switch (activeSort) {
      case "GIÁ TĂNG DẦN":
        products.sort((a, b) => a.price - b.price);
        break;
      case "GIÁ GIẢM DẦN":
        products.sort((a, b) => b.price - a.price);
        break;
      case "MỚI NHẤT":
        products.sort((a, b) => {
            const dateA = a.createdAt?.seconds ? new Date(a.createdAt.seconds * 1000).getTime() : 0;
            const dateB = b.createdAt?.seconds ? new Date(b.createdAt.seconds * 1000).getTime() : 0;
            return dateB - dateA;
        });
        break;
      default:
        break;
    }

    return products;
  }, [filteredProducts, activeSort]);

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  const paginatedProducts = useMemo(() => {
    return sortedProducts.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [sortedProducts, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  const handleFilterChange = (newActiveFilters: ActiveFilters) => {
    setCurrentPage(1);
    setActiveFilters(newActiveFilters);
  };

  const firstItemIndex = (currentPage - 1) * itemsPerPage + 1;
  const lastItemIndex = Math.min(currentPage * itemsPerPage, sortedProducts.length);

  return (
    <div className="bg-white text-black">
      {bannerData ? <CategoryBanner {...bannerData} /> : (
         <div className="border-b border-t">
            <div className="container flex h-16 items-center">
                <h1 className="font-headline text-xl font-bold uppercase tracking-wider">{title}</h1>
            </div>
         </div>
      )}
      
      <CategoryNav onCategorySelect={() => {}} selectedCategory={bannerData?.slug ?? null} />
      
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <SidebarFilter 
              products={initialProducts} 
              onFilterChange={handleFilterChange}
              isWineCategory={isWineCategory}
            />
          </div>

          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6 text-sm">
              <p>HIỂN THỊ {paginatedProducts.length > 0 ? firstItemIndex : 0}-{lastItemIndex} CỦA {sortedProducts.length} KẾT QUẢ</p>
              <div className="flex items-center gap-2">
                <span className="uppercase">Sắp xếp theo</span>
                {sortingOptions.map((opt) => (
                  <Button
                      key={opt}
                      variant={activeSort === opt ? "outline" : "ghost"}
                      onClick={() => setActiveSort(opt)}
                      className={`text-xs h-auto py-1 px-3 rounded-none ${activeSort === opt ? 'border-black' : 'border-transparent'}`}
                  >
                      {opt}
                  </Button>
                ))}
              </div>
            </div>
            {paginatedProducts.length > 0 ? (
                <div className="grid grid-cols-1 gap-x-8 gap-y-12">
                    {paginatedProducts.map((product) => (
                        <WineCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <p className="text-lg text-muted-foreground">Không tìm thấy sản phẩm nào phù hợp.</p>
                </div>
            )}
            
            <Suspense fallback={<div className="flex justify-center mt-12">Loading pagination...</div>}>
                <Paginator 
                    totalPages={totalPages} 
                    onPageChange={handlePageChange} 
                />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}


export default function ProductListing(props: ProductListingProps) {
    return <ProductListingContent {...props} />;
}
