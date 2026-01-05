'use client';

import { useState, useMemo } from "react";
import WineCard from "@/components/wine-card";
import { Button } from "@/components/ui/button";
import ProductCategoryNav from "@/components/layout/product-category-nav";
import type { Wine } from "@/lib/types";
import { cn } from "@/lib/utils";

const filtersData = {
    "THƯƠNG HIỆU": [
      { label: "GLEN SCOTIA", count: 2 },
      { label: "HAZELBURN", count: 1 },
      { label: "LONGROW", count: 1 },
      { label: "SPRINGBANK", count: 10 },
      { label: "THE MACALLAN", count: 1 },
      { label: "GLENFIDDICH", count: 1 },
      { label: "ARDBEG", count: 1 },
      { label: "DALMORE", count: 1 },
      { label: "TALISKER", count: 1 },
      { label: "YAMAZAKI", count: 1 },
      { label: "HIBIKI", count: 1 },
      { label: "THE LAKES", count: 1 },
      { label: "REDBREAST", count: 1 },
    ],
    "ĐỘ TUỔI": [
      { label: "DƯỚI 12 NĂM", value: [0, 12] },
      { label: "12-18 NĂM", value: [12, 18] },
      { label: "18-30 NĂM", value: [18, 30] },
      { label: "TRÊN 30 NĂM", value: [30, 999] },
    ],
    "LOẠI THÙNG": [
      { label: "BOURBON", count: 10 },
      { label: "PORT", count: 1 },
      { label: "SHERRY", count: 3 },
    ],
    "LỌC LẠNH": [
      { label: "CÓ LỌC LẠNH", count: 3 },
      { label: "KHÔNG CÓ LỌC LẠNH", count: 11 },
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

const sortingOptions = ["MẶC ĐỊNH", "MỚI NHẤT", "GIÁ TĂNG DẦN", "GIÁ GIẢM DẦN"] as const;
type SortingOption = typeof sortingOptions[number];

type ActiveFilters = {
  [key: string]: string[];
};

interface ProductListingProps {
    initialProducts: Wine[];
    title: string;
}

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
        const displayLabel = typeof option === 'object' && option.count ? `${option.label} (${option.count})` : label;
        const isActive = activeFilters.includes(label);
        
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

export default function ProductListing({ initialProducts, title }: ProductListingProps) {
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});
  const [activeSort, setActiveSort] = useState<SortingOption>("MẶC ĐỊNH");

  const handleFilterChange = (group: string, value: string) => {
    setActiveFilters(prev => {
        const currentGroupFilters = prev[group] || [];
        const newGroupFilters = currentGroupFilters.includes(value)
            ? currentGroupFilters.filter(item => item !== value)
            : [...currentGroupFilters, value];
        
        return { ...prev, [group]: newGroupFilters };
    });
  };

  const filteredAndSortedProducts = useMemo(() => {
    let products = [...initialProducts];

    // Filtering logic
    Object.entries(activeFilters).forEach(([group, values]) => {
      if (values.length === 0) return;

      if (group === "THƯƠNG HIỆU") {
        products = products.filter(p => {
          const brand = p.nameVN.split(' ')[0].toUpperCase();
          return values.some(v => brand.includes(v));
        });
      }
      if (group === "KHOẢNG GIÁ") {
          const priceRanges = values.map(v => filtersData["KHOẢNG GIÁ"].find(opt => opt.label === v)?.value);
          products = products.filter(p => 
              priceRanges.some(range => range && p.price >= range[0] && p.price < range[1])
          );
      }
       // Add other filter logic here (e.g., ĐỘ TUỔI, LOẠI THÙNG)
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
        products.sort((a, b) => (b.isNew ? 1 : -1)); // Simple logic, needs refinement
        break;
      default: // MẶC ĐỊNH
        // No sort or sort by a default criteria
        break;
    }

    return products;
  }, [initialProducts, activeFilters, activeSort]);

  return (
    <div className="bg-white text-black">
      <ProductCategoryNav />
      <div className="container py-12">
        <div className="text-left mb-4">
          <h1 className="font-headline text-xl font-bold uppercase tracking-wider">{title}</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <h2 className="text-lg font-bold uppercase tracking-wider mb-6">Lọc sản phẩm</h2>
            {Object.entries(filtersData).map(([groupTitle, options]) => (
              <FilterGroup 
                key={groupTitle} 
                title={groupTitle} 
                options={options.map(opt => (typeof opt === 'string' ? opt : { ...opt, label: opt.label }))}
                onFilterChange={handleFilterChange}
                activeFilters={activeFilters[groupTitle] || []}
              />
            ))}
          </div>

          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6 text-sm">
              <p>HIỂN THỊ {filteredAndSortedProducts.length} CỦA {initialProducts.length} KẾT QUẢ</p>
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
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAndSortedProducts.map((wine) => (
                <WineCard key={wine.id} wine={wine} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
