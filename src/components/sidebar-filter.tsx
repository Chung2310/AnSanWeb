'use client';

import { useState, useMemo, useEffect } from "react";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { wineMegaMenuData } from "@/lib/mega-menu-data";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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
    "GIỐNG NHO": wineMegaMenuData.theoGiongNho.map(item => ({
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

const AccordionFilterGroup = ({ title, options, onFilterChange, activeFilters }: {
    title: string;
    options: { label: string; value: string; }[];
    onFilterChange: (group: string, value: string) => void;
    activeFilters: string[];
}) => (
    <div className="mb-8 border p-4 rounded-md">
        <Accordion type="single" collapsible defaultValue="item-1">
            <AccordionItem value="item-1" className="border-b-0">
                <AccordionTrigger className="text-sm font-bold tracking-widest uppercase text-foreground hover:no-underline p-0">
                    {title}
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {options.map((option) => {
                            const isActive = activeFilters.includes(option.label);
                            return (
                                <div key={option.value} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={option.value}
                                        checked={isActive}
                                        onCheckedChange={() => onFilterChange(title, option.label)}
                                    />
                                    <Label htmlFor={option.value} className="font-normal cursor-pointer text-sm">
                                        {option.label}
                                    </Label>
                                </div>
                            );
                        })}
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </div>
);

interface SidebarFilterProps {
    products: Product[];
    onFilterChange: (activeFilters: ActiveFilters) => void;
    isWineCategory?: boolean;
}

export default function SidebarFilter({ products, onFilterChange, isWineCategory }: SidebarFilterProps) {
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
            <FilterGroup
                title="KHOẢNG GIÁ"
                options={staticFiltersData["KHOẢNG GIÁ"]}
                onFilterChange={handleFilterClick}
                activeFilters={activeFilters["KHOẢNG GIÁ"] || []}
            />
            {isWineCategory && (
                <>
                    <FilterGroup
                        title="DANH MỤC"
                        options={staticFiltersData["DANH MỤC"]}
                        onFilterChange={handleFilterClick}
                        activeFilters={activeFilters["DANH MỤC"] || []}
                    />
                    <AccordionFilterGroup
                        title="GIỐNG NHO"
                        options={staticFiltersData["GIỐNG NHO"]}
                        onFilterChange={handleFilterClick}
                        activeFilters={activeFilters["GIỐNG NHO"] || []}
                    />
                </>
            )}
        </div>
    );
}

// Expose static data for parent component if needed
SidebarFilter.staticFiltersData = staticFiltersData;
