'use client';

import { useState, useMemo, useEffect } from "react";
import type { Product, Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCategories } from "@/hooks/use-categories";

export type ActiveFilters = {
  [key: string]: string[];
};

const staticFiltersData = {
    "KHOẢNG GIÁ": [
        { label: "DƯỚI 5 TRIỆU", value: [0, 5000000] },
        { label: "5-10 TRIỆU", value: [5000000, 10000000] },
        { label: "10-20 TRIỆU", value: [10000000, 20000000] },
        { label: "20-50 TRIỆU", value: [20000000, 50000000] },
        { label: "50-100 TRIỆU", value: [50000000, 100000000] },
        { label: "TRÊN 100 TRIỆU", value: [100000000, Infinity] },
    ],
    // Other static filters can be re-enabled here if needed
    // "ĐỘ TUỔI": [ ... ],
    // "LOẠI THÙNG": [ ... ],
    // "LỌC LẠNH": [ ... ],
};

const getSubCategoryMap = (allCategories: Category[] | null | undefined): Record<string, string[]> => {
    if (!allCategories) return {};
    const map: Record<string, string[]> = {};
    allCategories.forEach(cat => {
        if (cat.parentId) {
            if (!map[cat.parentId]) {
                map[cat.parentId] = [];
            }
            map[cat.parentId].push(cat.id);
        }
    });

    const finalMap: Record<string, string[]> = {};
    allCategories.forEach(cat => {
      if (!cat.parentId && map[cat.id]) {
        finalMap[cat.slug] = allCategories.filter(c => c.parentId === cat.id).map(c => c.id);
      }
    });

    return finalMap;
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
    onFilterChange: (activeFilters: ActiveFilters) => void;
}

export default function SidebarFilter({ products, onFilterChange }: SidebarFilterProps) {
    const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});
    const { categories: allCategories } = useCategories();

    // When products change (navigating to a new category), reset local filters
    useEffect(() => {
        setActiveFilters({});
    }, [products]);

    // When local filters change, notify the parent component
    useEffect(() => {
        onFilterChange(activeFilters);
    }, [activeFilters, onFilterChange]);


    const handleFilterClick = (group: string, value: string) => {
        setActiveFilters(prev => {
            const currentGroupFilters = prev[group] || [];
            const newGroupFilters = currentGroupFilters.includes(value)
                ? currentGroupFilters.filter(item => item !== value)
                : [...currentGroupFilters, value];
            
            return { ...prev, [group]: newGroupFilters };
        });
    };

    const getCountForPriceRange = (range: number[]) => {
      return products.filter(p => p.price >= range[0] && p.price < range[1]).length;
    }

    return (
        <div>
            <h2 className="text-lg font-bold uppercase tracking-wider mb-6">Lọc sản phẩm</h2>
            {Object.entries(staticFiltersData).map(([groupTitle, options]) => (
                 <FilterGroup
                    key={groupTitle}
                    title={groupTitle}
                    options={options.map(opt => {
                        let count = 0;
                        if (groupTitle === 'KHOẢNG GIÁ' && opt.value) {
                           count = getCountForPriceRange(opt.value);
                        } else {
                           count = products.length > 0 ? 1 : 0;
                        }
                        return { label: opt.label, count };
                    })}
                    onFilterChange={handleFilterClick}
                    activeFilters={activeFilters[groupTitle] || []}
                />
            ))}
        </div>
    );
}

// Expose static data for parent component if needed
SidebarFilter.staticFiltersData = staticFiltersData;
