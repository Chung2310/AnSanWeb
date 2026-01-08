'use client';

import { useState, useMemo, useEffect } from "react";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { allTags } from "@/lib/tags-data";

type ActiveFilters = {
  [key: string]: string[];
};

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

const subCategoryMap: Record<string, string[]> = {
    'cigar': ['cigar-hanos', 'cigar-lotus', 'cigar-vinaboss'],
    'ruou-vang': ['y', 'phap', 'tay-ban-nha', 'uc', 'nga', 'duc'],
    'ruou-manh': ['ballantines', 'john-walker', 'mortlach', 'chivas', 'royal-salute', 'singleton'],
    'scotch-whisky': ['campbeltown', 'highland', 'islands', 'islay', 'lowland', 'speyside'],
    'world-whisky': ['ireland', 'bourbon', 'japan', 'lakes'],
};


const FilterGroup = ({ title, options, onFilterChange, activeFilters }: {
    title: string;
    options: { label: string, count: number }[];
    onFilterChange: (group: string, value: string) => void;
    activeFilters: string[];
}) => (
  <div className="mb-8">
    <h3 className="text-sm font-bold tracking-widest uppercase text-foreground mb-4">{title}</h3>
    <div className="flex flex-wrap gap-2">
      {options.map((option, index) => {
        const isActive = activeFilters.includes(option.label);
        if (option.count === 0 && !isActive) return null;

        return (
          <Button
            key={index}
            variant={isActive ? "default" : "outline"}
            className={cn(
              "rounded-none text-xs h-auto py-1 px-3 border-gray-300",
              !isActive && "bg-secondary text-secondary-foreground hover:bg-gray-300 hover:text-black"
            )}
            onClick={() => onFilterChange(title, option.label)}
          >
            {`${option.label} (${option.count})`}
          </Button>
        )
      })}
    </div>
  </div>
);

interface SidebarFilterProps {
    products: Product[];
    onFilterChange: (filteredProducts: Product[]) => void;
}

export default function SidebarFilter({ products, onFilterChange }: SidebarFilterProps) {
    const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});

    const dynamicFilters = useMemo(() => {
        if (!products || products.length === 0) return {};
        const currentCategoryTag = products[0]?.tags?.find(tag => Object.keys(subCategoryMap).includes(tag));
        if (!currentCategoryTag) return {};
        
        const subCategorySlugs = subCategoryMap[currentCategoryTag] || [];
        const subCategoryOptions = subCategorySlugs.map(slug => {
            const tagInfo = allTags.find(t => t.id === slug);
            if (!tagInfo) return null;

            const count = products.filter(p => p.tags?.includes(slug)).length;
            return { label: tagInfo.label, value: slug, count };
        }).filter((opt): opt is { label: string, value: string, count: number } => opt !== null);

        if (subCategoryOptions.length === 0) return {};

        return {
            "PHÂN LOẠI": subCategoryOptions
        };

    }, [products]);

    const handleFilterChange = (group: string, value: string) => {
        setActiveFilters(prev => {
            const currentGroupFilters = prev[group] || [];
            const newGroupFilters = currentGroupFilters.includes(value)
                ? currentGroupFilters.filter(item => item !== value)
                : [...currentGroupFilters, value];
            
            return { ...prev, [group]: newGroupFilters };
        });
    };

    const filteredProducts = useMemo(() => {
        let filtered = [...products];
    
        Object.entries(activeFilters).forEach(([group, values]) => {
          if (values.length === 0) return;
    
          if (group === "PHÂN LOẠI") {
            const valueSlugs = (dynamicFilters["PHÂN LOẠI"] || [])
              .filter(opt => values.includes(opt.label))
              .map(opt => opt.value);
            
            if (valueSlugs.length > 0) {
              filtered = filtered.filter(p => p.tags?.some(t => valueSlugs.includes(t)));
            }
          }

          if (group === "KHOẢNG GIÁ") {
              const priceRanges = values.map(v => staticFiltersData["KHOẢNG GIÁ"].find(opt => opt.label === v)?.value);
              filtered = filtered.filter(p => 
                  priceRanges.some(range => range && p.price >= range[0] && p.price < range[1])
              );
          }
          if (group === "ĐỘ TUỔI") {
            const ageRanges = values.map(v => staticFiltersData["ĐỘ TUỔI"].find(opt => opt.label === v)?.value);
            filtered = filtered.filter(p => 
                p.age !== undefined && ageRanges.some(range => range && p.age >= range[0] && p.age <= range[1])
            );
          }
          if (group === "LOẠI THÙNG") {
            filtered = filtered.filter(p =>
                p.cask && values.some(v => p.cask?.toUpperCase().includes(v))
            );
          }
          if (group === "LỌC LẠNH") {
            filtered = filtered.filter(p => {
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
    
        return filtered;
      }, [products, activeFilters, dynamicFilters]);

      useEffect(() => {
        onFilterChange(filteredProducts);
      }, [filteredProducts, onFilterChange]);


    return (
        <div>
            <h2 className="text-lg font-bold uppercase tracking-wider mb-6">Lọc sản phẩm</h2>
            {Object.keys(dynamicFilters).length > 0 && Object.entries(dynamicFilters).map(([groupTitle, options]) => (
                <FilterGroup
                    key={groupTitle}
                    title={groupTitle}
                    options={options.map(opt => ({ label: opt.label, count: opt.count }))}
                    onFilterChange={handleFilterChange}
                    activeFilters={activeFilters[groupTitle] || []}
                />
            ))}
            {Object.entries(staticFiltersData).map(([groupTitle, options]) => (
                 <FilterGroup
                    key={groupTitle}
                    title={groupTitle}
                    options={options.map(opt => {
                        let count = 0;
                        if (groupTitle === 'KHOẢNG GIÁ' && opt.value) {
                            count = products.filter(p => p.price >= opt.value[0] && p.price < opt.value[1]).length;
                        } else {
                            // This is a simplification. For other static filters, you'd need more specific logic.
                            // For now, we show all options if there are products.
                           count = products.length > 0 ? 1 : 0;
                        }
                        return { label: opt.label, count };
                    })}
                    onFilterChange={handleFilterChange}
                    activeFilters={activeFilters[groupTitle] || []}
                />
            ))}
        </div>
    );
}
