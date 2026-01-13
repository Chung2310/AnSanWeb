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
        { label: "DƯỚI 5 TRĂM", value: [0, 500000] },
        { label: "5 TRĂM - 1 TRIỆU", value: [500000, 1000000] },
        { label: "1 - 2 TRIỆU", value: [1000000, 2000000] },
        { label: "2 - 3 TRIỆU", value: [2000000, 3000000] },
        { label: "TRÊN 3 TRIỆU", value: [3000000, Infinity] },
    ],
};

const FilterGroup = ({ title, options, onFilterChange, activeFilters }: {
    title: string;
    options: { label: string, count: number }[];
    onFilterChange: (group: string, value: string) => void;
    activeFilters: string[];
}) => (
  <div className="mb-8">
    <h3 className="text-sm font-bold tracking-widest uppercase text-foreground mb-4">{title}</h3>
    <div className="flex flex-col items-start gap-2">
      {options.map((option, index) => {
        const isActive = activeFilters.includes(option.label);
        if (option.count === 0 && !isActive) return null;

        return (
          <Button
            key={index}
            variant={isActive ? "default" : "ghost"}
            className={cn(
              "rounded-none text-xs h-auto py-1 px-3 justify-start",
              isActive 
                ? "font-bold"
                : "text-muted-foreground hover:text-foreground hover:bg-transparent"
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
    const { categories: allCategories, isLoading: isLoadingCategories } = useCategories();

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
    
    const dynamicCategoryFilter = useMemo(() => {
        if (isLoadingCategories || !allCategories || products.length === 0) {
            return null;
        }

        const productCategoryIds = new Set(products.flatMap(p => p.tags || []));
        
        let parentCategory: Category | undefined;
        let potentialParents = allCategories.filter(c => !c.parentId && productCategoryIds.has(c.id));

        if (potentialParents.length === 1) {
            parentCategory = potentialParents[0];
        } else if (potentialParents.length > 1) {
             const productSlugs = new Set(products.map(p => p.slug));
             const parentCounts = potentialParents.map(p => {
                const childIds = allCategories.filter(c => c.parentId === p.id).map(c => c.id);
                const count = products.filter(prod => prod.tags?.some(t => childIds.includes(t))).length;
                return { parent: p, count };
             });
             parentCategory = parentCounts.sort((a,b) => b.count - a.count)[0]?.parent;
        } else {
             // Try to find common parent if no top-level category matches
             const firstProductTags = products[0]?.tags;
             if(firstProductTags && firstProductTags.length > 0) {
                 const firstCat = allCategories.find(c => c.id === firstProductTags[0]);
                 if (firstCat?.parentId) {
                     parentCategory = allCategories.find(c => c.id === firstCat.parentId);
                 }
             }
        }

        if (!parentCategory) {
            return null;
        }
        
        const subCategories = allCategories.filter(c => c.parentId === parentCategory?.id);
        if (subCategories.length === 0) return null;
        
        const getCountForSubCategory = (subCatId: string) => {
             const descendantIds = (function getIds(id: string): string[] {
                const children = allCategories.filter(c => c.parentId === id);
                return [id, ...children.flatMap(c => getIds(c.id))];
            })(subCatId);

            return products.filter(p => p.tags?.some(tag => descendantIds.includes(tag))).length;
        }


        const options = subCategories.map(subCat => ({
            label: subCat.name,
            count: getCountForSubCategory(subCat.id),
        }));

        return (
            <FilterGroup
                title="Danh mục con"
                options={options}
                onFilterChange={handleFilterClick}
                activeFilters={activeFilters["Danh mục con"] || []}
            />
        );

    }, [products, allCategories, isLoadingCategories, activeFilters]);

    return (
        <div>
            <h2 className="text-lg font-bold uppercase tracking-wider mb-6">Lọc sản phẩm</h2>
            
            {dynamicCategoryFilter}

            {Object.entries(staticFiltersData).map(([groupTitle, options]) => (
                 <FilterGroup
                    key={groupTitle}
                    title={groupTitle}
                    options={options.map(opt => ({
                        label: opt.label,
                        count: getCountForPriceRange(opt.value)
                    }))}
                    onFilterChange={handleFilterClick}
                    activeFilters={activeFilters[groupTitle] || []}
                />
            ))}
        </div>
    );
}

// Expose static data for parent component if needed
SidebarFilter.staticFiltersData = staticFiltersData;
