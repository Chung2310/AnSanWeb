
'use client';

import { useState, useMemo, useEffect, Suspense, useRef, useCallback } from "react";
import WineCard from "@/components/wine-card";
import { Button } from "@/components/ui/button";
import type { Product, Category } from "@/lib/types";
import CategoryBanner, { type CategoryBannerProps } from "./category-banner";
import CategoryNav from "./category-nav";
import SidebarFilter, { type ActiveFilters, staticFiltersData } from "./sidebar-filter";
import { Paginator } from "./paginator";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useCategories } from "@/hooks/use-categories";

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
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const descriptionContainerRef = useRef<HTMLDivElement>(null);
  const { categories: allCategories } = useCategories();

   const getDescendants = useCallback((parentId: string, categories: Category[]): Category[] => {
        const results: Category[] = [];
        const queue: string[] = [parentId];
        const visited = new Set<string>();

        const initialCat = categories.find(c => c.id === parentId || c.slug === parentId);
        if (initialCat) results.push(initialCat);

        while(queue.length > 0) {
            const currentId = queue.shift()!;
            if (!visited.has(currentId)) {
                visited.add(currentId);
                const children = categories.filter(c => c.parentId === currentId);
                children.forEach(child => {
                    results.push(child);
                    queue.push(child.id);
                });
            }
        }
        return results;
    }, []);

  const { descriptionInitial, descriptionRest, isDescriptionLong } = useMemo(() => {
    if (!categoryDescription) {
      return { descriptionInitial: null, descriptionRest: null, isDescriptionLong: false };
    }
    const firstParagraphEnd = categoryDescription.indexOf('</p>');

    if (firstParagraphEnd === -1) {
        return { descriptionInitial: categoryDescription, descriptionRest: null, isDescriptionLong: false };
    }
    
    const initialPart = categoryDescription.substring(0, firstParagraphEnd + 4);
    const restPart = categoryDescription.substring(firstParagraphEnd + 4);

    const hasMeaningfulRest = restPart.replace(/<[^>]*>/g, '').trim().length > 0;

    if (hasMeaningfulRest) {
      return {
        descriptionInitial: initialPart,
        descriptionRest: restPart,
        isDescriptionLong: true,
      };
    }

    return { descriptionInitial: categoryDescription, descriptionRest: null, isDescriptionLong: false };
  }, [categoryDescription]);
  
  const categoryType = useMemo(() => {
    if (!initialCategory || !allCategories) return { isWine: false, isSpirit: false, isGiftSet: false, isGlassware: false, isCigar: false };
    
    const getRootId = (catId: string): string => {
        const cat = allCategories.find(c => c.id === catId || c.slug === catId);
        if (!cat) return catId;
        if (!cat.parentId) return cat.id;
        return getRootId(cat.parentId);
    };

    const rootId = getRootId(initialCategory.id);
    return {
        isWine: rootId === 'ruou-vang',
        isSpirit: rootId === 'ruou-manh',
        isGiftSet: rootId === 'bo-qua-tang',
        isGlassware: rootId === 'ly-coc-pha-le',
        isCigar: rootId === 'cigar'
    };
  }, [initialCategory, allCategories]);

  const { isWine: isWineCategory, isSpirit: isSpiritCategory, isGiftSet: isGiftSetCategory } = categoryType;

  const getInitialFilters = useMemo(() => {
    if (!initialCategory || !allCategories) return queryFilters || {};
    
    let filters: ActiveFilters = queryFilters ? { ...queryFilters } : {};

    const findGroupAndLabel = (categoryId: string): { group: string, label: string } | null => {
        for (const group of Object.keys(staticFiltersData)) {
            if (group === "KHOẢNG GIÁ") continue;
            const options = staticFiltersData[group as keyof typeof staticFiltersData] as { label: string, value: string }[];
            const found = options.find(o => o.value === categoryId);
            if (found) {
                return { group, label: found.label };
            }
        }
        return null;
    };

    const categoryAndParents: Category[] = [];
    let current: Category | undefined = initialCategory;
    while(current) {
        categoryAndParents.push(current);
        current = allCategories.find(c => c.id === current?.parentId);
    }

    for (const cat of categoryAndParents) {
        const filterInfo = findGroupAndLabel(cat.id);
        if (filterInfo) {
            if (!filters[filterInfo.group]) {
                filters[filterInfo.group] = [];
            }
            if (!filters[filterInfo.group].includes(filterInfo.label)) {
                filters[filterInfo.group].push(filterInfo.label);
            }
        }
    }
    
    return filters;
  }, [initialCategory, allCategories, queryFilters]);
  
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>(getInitialFilters);

  useEffect(() => {
    setCurrentPage(1);
    setActiveFilters(getInitialFilters);
  }, [initialProducts, getInitialFilters]);

  const filteredProducts = useMemo(() => {
    let productsToFilter = [...initialProducts];

    // 1. Filter by category hierarchy from URL
    if (initialCategory && allCategories) {
        const descendants = getDescendants(initialCategory.id, allCategories);
        const matchIds = new Set(descendants.map(d => d.id));
        const matchSlugs = new Set(descendants.map(d => d.slug));

        productsToFilter = productsToFilter.filter(p =>
            p.tags?.some(tag => matchIds.has(tag) || matchSlugs.has(tag))
        );
    }
    
    // 2. Apply sidebar filters
    const activeFilterGroups = Object.keys(activeFilters).filter(
      (group) => activeFilters[group]?.length > 0
    );

    if (activeFilterGroups.length === 0) {
      return productsToFilter;
    }

    // Price filter
    const priceRanges = activeFilters["KHOẢNG GIÁ"]?.map(label => {
      const option = (staticFiltersData["KHOẢNG GIÁ"] || []).find(o => o.label === label);
      return option?.value;
    }).filter(Boolean) as [number, number][];

    if (priceRanges && priceRanges.length > 0) {
      productsToFilter = productsToFilter.filter(p =>
        priceRanges.some(range => p.price >= range[0] && p.price < range[1])
      );
    }

    // Tag-based filters (Region, Grape, Brand, etc.)
    const tagFilterGroups = activeFilterGroups.filter(g => g !== "KHOẢNG GIÁ");
    if (tagFilterGroups.length > 0) {
      productsToFilter = productsToFilter.filter(p => {
        return tagFilterGroups.every(group => {
          const activeLabels = activeFilters[group];
          if (!activeLabels || activeLabels.length === 0) return true;

          const idsToFilter = activeLabels.map(label => {
            const options = staticFiltersData[group as keyof typeof staticFiltersData] as { label: string, value: string }[];
            const option = options.find(o => o.label === label);
            return option?.value;
          }).filter(Boolean) as string[];

          if (idsToFilter.length === 0) return true;
          return p.tags?.some(tag => idsToFilter.includes(tag));
        });
      });
    }

    return productsToFilter;
  }, [initialProducts, initialCategory, allCategories, activeFilters, getDescendants]);

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
  
  const handleToggleDescription = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDescriptionExpanded(!isDescriptionExpanded);
    // CRITICAL: Removed any scrollTo logic to prevent page jumping to top
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

      {categoryDescription && (
        <div ref={descriptionContainerRef} className="container pt-12">
            <div className="mx-auto border rounded-lg p-6 bg-secondary/30 text-gray-700 leading-relaxed prose prose-lg max-w-none">
                 {descriptionInitial && <div dangerouslySetInnerHTML={{ __html: descriptionInitial }} />}
            
                {isDescriptionLong && (
                    <AnimatePresence initial={false}>
                        {isDescriptionExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                {descriptionRest && <div dangerouslySetInnerHTML={{ __html: descriptionRest }} />}
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}

                {isDescriptionLong && (
                    <div className="text-center mt-4">
                        <Button
                            variant="link"
                            type="button"
                            onClick={handleToggleDescription}
                            className="text-primary hover:text-primary/80 no-underline hover:no-underline"
                        >
                            {isDescriptionExpanded ? 'Thu gọn' : 'Xem thêm'}
                            {isDescriptionExpanded ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
                        </Button>
                    </div>
                )}
            </div>
        </div>
      )}
      
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
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                    {paginatedProducts.map((product) => (
                        <WineCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <p className="text-lg text-muted-foreground">Không tìm thấy sản phẩm nào phù hợp.</p>
                </div>
            )}
            
            <Suspense fallback={<div className="flex justify-center mt-12">Đang tải phân trang...</div>}>
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
