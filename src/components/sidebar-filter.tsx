'use client';

import { useState, useMemo, useEffect } from "react";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { wineMegaMenuData } from "@/lib/mega-menu-data";

export type ActiveFilters = {
  [key: string]: string[];
};

const staticFiltersData = {
    "KHOẢNG GIÁ": [
        { label: 'DƯỚI 5 TRĂM', value: [0, 500000] },
        { label: '5 TRĂM - 1 TRIỆU', value: [500000, 1000000] },
        { label: '1 - 2 TRIỆU', value: [1000000, 2000000] },
        { label: '2 - 3 TRIỆU', value: [2000000, 3000000] },
        { label: 'TRÊN 3 TRIỆU', value: [3000000, Infinity] },
    ],
    "DANH MỤC": wineMegaMenuData.theoLoai.map(item => ({
        label: item.label,
        value: item.category_id,
    })),
};

const FilterGroup = ({ title, options, onFilterChange, activeFilters }: {
    title: string;
    options: { label: string }[];
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

            const newGroupFilters = isCurrentlyActive
                ? currentGroupFilters.filter(item => item !== value)
                : [...currentGroupFilters, value];
            
            return { ...prev, [group]: newGroupFilters };
        });
    };

    return (
        <div className="w-full">
            {Object.entries(staticFiltersData).map(([groupTitle, options]) => (
                 <FilterGroup
                    key={groupTitle}
                    title={groupTitle}
                    options={options.map(opt => ({
                        label: opt.label,
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
