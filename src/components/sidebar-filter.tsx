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
    <div className="mb-8 border p-4 rounded-md">
        <h3 className="text-sm font-bold tracking-widest uppercase text-foreground mb-4">{title}</h3>
        <div className="grid grid-cols-2 gap-2">
        {options.map((option, index) => {
            const isActive = activeFilters.includes(option.label);
            return (
            <Button
                key={index}
                variant="outline"
                className={cn(
                "rounded-sm text-xs h-auto py-2 px-1 justify-center w-full font-semibold border-gray-300 whitespace-normal text-center",
                isActive 
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-white text-gray-600 hover:bg-gray-100 hover:border-gray-400"
                )}
                onClick={() => onFilterChange(title, option.label)}
            >
                {option.label}
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
            const isCurrentlyActive = currentGroupFilters.includes(value);
            
            // For price range, allow only one selection
            if (group === "KHOẢNG GIÁ") {
                 const newGroupFilters = isCurrentlyActive ? [] : [value];
                 return { ...prev, [group]: newGroupFilters };
            }

            // For other filters, allow multiple selections
            const newGroupFilters = isCurrentlyActive
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
             const parentCounts = potentialParents.map(p => {
                const childIds = allCategories.filter(c => c.parentId === p.id).map(c => c.id);
                const count = products.filter(prod => prod.tags?.some(t => childIds.includes(t))).length;
                return { parent: p, count };
             });
             parentCategory = parentCounts.sort((a,b) => b.count - a.count)[0]?.parent;
        } else {
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
        <div className="w-full">
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
