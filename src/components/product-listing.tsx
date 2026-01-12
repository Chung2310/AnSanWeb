'use client';

import { useState, useMemo, useEffect } from "react";
import WineCard from "@/components/wine-card";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import CategoryBanner, { type CategoryBannerProps } from "./category-banner";
import CategoryNav from "./category-nav";
import SidebarFilter from "./sidebar-filter";

const sortingOptions = ["MẶC ĐỊNH", "MỚI NHẤT", "GIÁ TĂNG DẦN", "GIÁ GIẢM DẦN"] as const;
type SortingOption = typeof sortingOptions[number];

interface ProductListingProps {
    initialProducts: Product[];
    title: string;
    bannerData?: CategoryBannerProps;
}

export default function ProductListing({ initialProducts, title, bannerData }: ProductListingProps) {
  const [activeSort, setActiveSort] = useState<SortingOption>("MẶC ĐỊNH");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 18;

  const [filteredProducts, setFilteredProducts] = useState(initialProducts);
  
  useEffect(() => {
    setFilteredProducts(initialProducts);
    setCurrentPage(1); // Reset to page 1 on new category
  }, [initialProducts]);


  const sortedProducts = useMemo(() => {
    let products = [...filteredProducts];

    // Sorting logic
    switch (activeSort) {
      case "GIÁ TĂNG DẦN":
        products.sort((a, b) => a.price - b.price);
        break;
      case "GIÁ GIẢM DẦN":
        products.sort((a, b) => b.price - a.price);
        break;
      case "MỚI NHẤT":
        products.sort((a, b) => {
            // @ts-ignore
            const dateA = a.createdAt?.seconds ? new Date(a.createdAt.seconds * 1000).getTime() : 0;
            // @ts-ignore
            const dateB = b.createdAt?.seconds ? new Date(b.createdAt.seconds * 1000).getTime() : 0;
            return dateB - dateA;
        });
        break;
      default: // MẶC ĐỊNH
        // The default order is already present in filteredProducts
        break;
    }

    return products;
  }, [filteredProducts, activeSort]);

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  const paginatedProducts = useMemo(() => {
    return sortedProducts.slice(
      (currentPage - 1) * productsPerPage,
      currentPage * productsPerPage
    );
  }, [sortedProducts, currentPage, productsPerPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }

  const handleFilterChange = (newFilteredProducts: Product[]) => {
    setFilteredProducts(newFilteredProducts);
    setCurrentPage(1);
  };


  const firstItemIndex = (currentPage - 1) * productsPerPage + 1;
  const lastItemIndex = Math.min(currentPage * productsPerPage, sortedProducts.length);

  return (
    <div className="bg-white text-black">
      {bannerData ? <CategoryBanner {...bannerData} /> : (
         <div className="border-b border-t">
            <div className="container flex h-16 items-center">
                <h1 className="font-headline text-xl font-bold uppercase tracking-wider">{title}</h1>
            </div>
         </div>
      )}
      
      {!bannerData && <CategoryNav onCategorySelect={() => {}} selectedCategory={null} />}
      
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <SidebarFilter products={initialProducts} onFilterChange={handleFilterChange} />
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
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {paginatedProducts.map((product) => (
                        <WineCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <p className="text-lg text-muted-foreground">Không tìm thấy sản phẩm nào phù hợp.</p>
                </div>
            )}


            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-6 mt-12 text-lg" style={{color: '#8a7d6a'}}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                        <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            className={cn(
                                "font-headline font-bold transition-colors hover:text-black",
                                currentPage === pageNumber ? "text-black underline underline-offset-4" : ""
                            )}
                        >
                            {pageNumber}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="transition-colors hover:text-black disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
