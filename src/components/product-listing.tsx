
'use client';

import { useState, useMemo, useEffect, Suspense } from "react";
import WineCard from "@/components/wine-card";
import { Button } from "@/components/ui/button";
import type { Product, Category } from "@/lib/types";
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
    categoryDescription?: string;
    initialCategory?: Category | null;
    queryFilters?: ActiveFilters;
}

function ProductListingContent({ initialProducts, title, bannerData, itemsPerPage = 12, categoryDescription, initialCategory, queryFilters }: ProductListingProps) {
  const [activeSort, setActiveSort] = useState<SortingOption>("MẶC ĐỊNH");
  const [currentPage, setCurrentPage] = useState(1);
  
  const getInitialFilters = useMemo(() => {
    if (!initialCategory) return queryFilters || {};
    
    let filters: ActiveFilters = queryFilters || {};
    const categoryId = initialCategory.id;

    const filterKeys: (keyof typeof SidebarFilter.staticFiltersData)[] = ["LOẠI RƯỢU", "QUỐC GIA", "VÙNG NỔI TIẾNG", "GIỐNG NHO", "QUÀ TẶNG", "THƯƠNG HIỆU"];

    for (const key of filterKeys) {
        const options = (SidebarFilter.staticFiltersData[key] as {label: string, value: string}[]);
        const option = options.find(o => o.value === categoryId);
        if (option) {
            filters[key] = [...(filters[key] || []), option.label];
            return filters;
        }
    }
    
    return filters;
  }, [initialCategory, queryFilters]);
  
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>(getInitialFilters);

  const isWineCategory = useMemo(() => {
    return title.toLowerCase().includes('vang') || !!initialCategory?.slug.includes('vang');
  }, [title, initialCategory]);

  const isGiftSetCategory = useMemo(() => {
    return title.toLowerCase().includes('quà tặng') || !!initialCategory?.slug.includes('bo-qua-tang');
  }, [title, initialCategory]);

  const isSpiritCategory = useMemo(() => {
    return title.toLowerCase().includes('mạnh') || !!initialCategory?.slug.includes('ruou-manh');
  }, [title, initialCategory]);

  useEffect(() => {
    setCurrentPage(1);
    setActiveFilters(getInitialFilters);
  }, [initialProducts, getInitialFilters]);


  const filteredProducts = useMemo(() => {
    let filtered = [...initialProducts];

    const applyTagFilter = (filterKey: keyof typeof SidebarFilter.staticFiltersData) => {
        const activeLabels = activeFilters[filterKey];
        if (activeLabels && activeLabels.length > 0) {
            const idsToFilter = activeLabels.map(label => {
                const option = (SidebarFilter.staticFiltersData[filterKey] as {label: string, value: any}[]).find(o => o.label === label);
                return option?.value;
            }).filter((value): value is string => !!value);

            if (idsToFilter.length > 0) {
                filtered = filtered.filter(p => 
                    p.tags?.some(tag => idsToFilter.includes(tag))
                );
            }
        }
    };
    
    const priceRanges = activeFilters["KHOẢNG GIÁ"]?.map(label => {
        const option = (SidebarFilter.staticFiltersData["KHOẢNG GIÁ"] || []).find(o => o.label === label);
        return option?.value;
    }).filter(Boolean);

    if (priceRanges && priceRanges.length > 0) {
        filtered = filtered.filter(p => 
            priceRanges.some(range => range && p.price >= (range as number[])[0] && p.price < (range as number[])[1])
        );
    }
    
    applyTagFilter("LOẠI RƯỢU");
    applyTagFilter("QUỐC GIA");
    applyTagFilter("VÙNG NỔI TIẾNG");
    applyTagFilter("GIỐNG NHO");
    applyTagFilter("QUÀ TẶNG");
    applyTagFilter("THƯƠNG HIỆU");


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
              isGiftSetCategory={isGiftSetCategory}
              isSpiritCategory={isSpiritCategory}
              activeFilters={activeFilters}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
      {categoryDescription && (
        <div className="container py-20">
            <div className="mx-auto border-t pt-10 text-gray-700 leading-relaxed prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: categoryDescription }} />
            </div>
        </div>
      )}
    </div>
  );
}


export default function ProductListing(props: ProductListingProps) {
    return <ProductListingContent {...props} />;
}
