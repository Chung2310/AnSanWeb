'use client';

import { useState, useMemo, useEffect } from "react";
import WineCard from "@/components/wine-card";
import { Button } from "@/components/ui/button";
import type { Product, Category } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, Check } from "lucide-react";
import CategoryBanner, { type CategoryBannerProps } from "./category-banner";
import { useCategories } from "@/hooks/use-categories";
import CategoryNav from "./category-nav";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

const staticFiltersData = {
    "ĐỘ TUỔI": [
      { label: "DƯỚI 12 NĂM", value: [0, 11] },
      { label: "12-18 NĂM", value: [12, 18] },
      { label: "18-30 NĂM", value: [19, 30] },
      { label: "TRÊN 30 NĂM", value: [31, 999] },
    ],
    "LOẠI THÙNG": [
      { label: "BOURBON" },
      { label: "PORT" },
      { label: "SHERRY" },
    ],
    "LỌC LẠNH": [
      { label: "CÓ LỌC LẠNH" },
      { label: "KHÔNG CÓ LỌC LẠNH" },
    ],
    "KHOẢNG GIÁ": [
        { label: "DƯỚI 5 TRIỆU", value: [0, 5000000] },
        { label: "5-10 TRIỆU", value: [5000000, 10000000] },
        { label: "10-20 TRIỆU", value: [10000000, 20000000] },
        { label: "20-50 TRIỆU", value: [20000000, 50000000] },
        { label: "50-100 TRIỆU", value: [50000000, 100000000] },
        { label: "TRÊN 100 TRIỆU", value: [100000000, Infinity] },
    ],
};

const allBrands = [
  "GLEN SCOTIA", "HAZELBURN", "LONGROW", "SPRINGBANK", "THE MACALLAN",
  "GLENFIDDICH", "ARDBEG", "DALMORE", "TALISKER", "YAMAZAKI", "HIBIKI",
  "THE LAKES", "REDBREAST", "HENNESSY", "BARON DE SIGOGNAC"
];

const sortingOptions = ["MẶC ĐỊNH", "MỚI NHẤT", "GIÁ TĂNG DẦN", "GIÁ GIẢM DẦN"] as const;
type SortingOption = typeof sortingOptions[number];

type ActiveFilters = {
  [key: string]: string[];
};

interface ProductListingProps {
    initialProducts: Product[];
    title: string;
    bannerData?: CategoryBannerProps;
}

const BrandFilterDropdown = ({ options, onFilterChange, activeFilters }: {
    options: any[];
    onFilterChange: (group: string, value: string) => void;
    activeFilters: string[];
}) => {
    return (
        <div className="mb-8">
            <h3 className="text-sm font-bold tracking-widest uppercase text-foreground mb-4">THƯƠNG HIỆU</h3>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between rounded-none">
                        <span>{activeFilters.length > 0 ? `${activeFilters.length} đã chọn` : "Chọn thương hiệu"}</span>
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-60 overflow-y-auto">
                    <DropdownMenuLabel>Lọc theo thương hiệu</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {options.map((option, index) => {
                        const label = option.label;
                        if (option.count === 0) return null;
                        
                        return (
                            <DropdownMenuCheckboxItem
                                key={index}
                                checked={activeFilters.includes(label)}
                                onCheckedChange={() => onFilterChange("THƯƠNG HIỆU", label)}
                                onSelect={(e) => e.preventDefault()} // Prevent closing on select
                            >
                                {label} ({option.count})
                            </DropdownMenuCheckboxItem>
                        );
                    })}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};


const FilterGroup = ({ title, options, onFilterChange, activeFilters }: {
    title: string;
    options: any[];
    onFilterChange: (group: string, value: string) => void;
    activeFilters: string[];
}) => (
  <div className="mb-8">
    <h3 className="text-sm font-bold tracking-widest uppercase text-foreground mb-4">{title}</h3>
    <div className="flex flex-wrap gap-2">
      {options.map((option, index) => {
        const label = typeof option === 'string' ? option : option.label;
        const displayLabel = typeof option === 'object' && option.count ? `${label} (${option.count})` : label;
        const isActive = activeFilters.includes(label);
        
        if (typeof option === 'object' && option.hasOwnProperty('count') && option.count === 0) return null;

        return (
          <Button
            key={index}
            variant={isActive ? "default" : "outline"}
            className={cn(
              "rounded-none text-xs h-auto py-1 px-3 border-gray-300",
              !isActive && "bg-secondary text-secondary-foreground hover:bg-gray-300 hover:text-black"
            )}
            onClick={() => onFilterChange(title, label)}
          >
            {displayLabel}
          </Button>
        )
      })}
    </div>
  </div>
);


export default function ProductListing({ initialProducts, title, bannerData }: ProductListingProps) {
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});
  const [activeSort, setActiveSort] = useState<SortingOption>("MẶC ĐỊNH");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 18;

  const [clientProducts, setClientProducts] = useState(initialProducts);

  useEffect(() => {
    setClientProducts(initialProducts);
  }, [initialProducts]);

  const filtersData = useMemo(() => {
    const brandsInProducts = allBrands.map(brand => {
      const count = clientProducts.filter(product => product.nameVN.toUpperCase().includes(brand)).length;
      return { label: brand, count: count };
    });

    return {
      "THƯƠNG HIỆU": brandsInProducts,
      ...staticFiltersData
    }
  }, [clientProducts]);

  const handleFilterChange = (group: string, value: string) => {
    setActiveFilters(prev => {
        const currentGroupFilters = prev[group] || [];
        const newGroupFilters = currentGroupFilters.includes(value)
            ? currentGroupFilters.filter(item => item !== value)
            : [...currentGroupFilters, value];
        
        return { ...prev, [group]: newGroupFilters };
    });
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleCategoryNavSelect = () => {
    setCurrentPage(1);
  };

  const filteredAndSortedProducts = useMemo(() => {
    let products = [...clientProducts];

    // Filtering logic from sidebar
    Object.entries(activeFilters).forEach(([group, values]) => {
      if (values.length === 0) return;

      if (group === "THƯƠNG HIỆU") {
        products = products.filter(p => {
          return values.some(v => p.nameVN.toUpperCase().includes(v));
        });
      }
      if (group === "KHOẢNG GIÁ") {
          const priceRanges = values.map(v => staticFiltersData["KHOẢNG GIÁ"].find(opt => opt.label === v)?.value);
          products = products.filter(p => 
              priceRanges.some(range => range && p.price >= range[0] && p.price < range[1])
          );
      }
      if (group === "ĐỘ TUỔI") {
        const ageRanges = values.map(v => staticFiltersData["ĐỘ TUỔI"].find(opt => opt.label === v)?.value);
        products = products.filter(p => 
            p.age !== undefined && ageRanges.some(range => range && p.age >= range[0] && p.age <= range[1])
        );
      }
      if (group === "LOẠI THÙNG") {
        products = products.filter(p =>
            p.cask && values.some(v => p.cask?.toUpperCase().includes(v))
        );
      }
      if (group === "LỌC LẠNH") {
        products = products.filter(p => {
            if (values.length === 2 || values.length === 0) return true;
            if (values.includes("CÓ LỌC LẠNH")) {
                return p.nonChillFiltered === false;
            }
            if (values.includes("KHÔNG CÓ LỌC LẠNH")) {
                return p.nonChillFiltered === true;
            }
            return true;
        });
      }
    });

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
        // No sort or sort by a default criteria
        break;
    }

    return products;
  }, [clientProducts, activeFilters, activeSort]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / productsPerPage);
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }

  const firstItemIndex = (currentPage - 1) * productsPerPage + 1;
  const lastItemIndex = Math.min(currentPage * productsPerPage, filteredAndSortedProducts.length);

  return (
    <div className="bg-white text-black">
      {bannerData ? <CategoryBanner {...bannerData} /> : (
         <div className="container pt-12 text-left">
             <h1 className="font-headline text-xl font-bold uppercase tracking-wider">{title}</h1>
         </div>
      )}
      
      <CategoryNav onCategorySelect={handleCategoryNavSelect} selectedCategory={null} />
      
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <h2 className="text-lg font-bold uppercase tracking-wider mb-6">Lọc sản phẩm</h2>
            {Object.entries(filtersData).map(([groupTitle, options]) => {
                if (groupTitle === 'THƯƠNG HIỆU') {
                    return (
                        <BrandFilterDropdown
                            key={groupTitle}
                            options={options.map(opt => ({ ...opt, label: opt.label }))}
                            onFilterChange={handleFilterChange}
                            activeFilters={activeFilters[groupTitle] || []}
                        />
                    );
                }
                return (
                    <FilterGroup
                        key={groupTitle}
                        title={groupTitle}
                        options={options.map(opt => (typeof opt === 'string' ? { label: opt } : { ...opt, label: opt.label }))}
                        onFilterChange={handleFilterChange}
                        activeFilters={activeFilters[groupTitle] || []}
                    />
                );
            })}
          </div>

          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6 text-sm">
              <p>HIỂN THỊ {paginatedProducts.length > 0 ? firstItemIndex : 0}-{lastItemIndex} CỦA {filteredAndSortedProducts.length} KẾT QUẢ</p>
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
