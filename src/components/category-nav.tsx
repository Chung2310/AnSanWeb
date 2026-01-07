'use client';
import { useCategories } from '@/hooks/use-categories';
import { useProducts } from '@/hooks/use-products';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link';
import { Button } from './ui/button';
import { ChevronDown } from 'lucide-react';
import { useState, useMemo } from 'react';

interface CategoryNavProps {
    onCategorySelect: (slug: string | null) => void;
    selectedCategory: string | null;
}

const mainCategoriesConfig = [
    { 
        label: "Scotch Whisky", 
        slug: "scotch-whisky",
        subCategories: ["whisky-campbeltown", "whisky-highland", "whisky-islands", "whisky-islay", "whisky-lowland", "whisky-speyside"]
    },
    { 
        label: "World Whisky", 
        slug: "world-whisky",
        subCategories: ["whisky-ireland", "whisky-khac", "whisky-nhat", "whisky-the-lakes"]
    },
    { label: "Spirits", slug: "spirits" },
    { label: "Old & Rare", slug: "old-rare" },
    { label: "Armagnac", slug: "armagnac" },
    { label: "Wine", slug: "wine" },
    { label: "Bộ Quà Tặng", slug: "bo-qua-tang" },
    { label: "Set Thử Rượu", slug: "set-thu-ruou" },
    { label: "Xì Gà", slug: "cigar", subCategories: ["cigar-hanos", "cigar-lotus", "cigar-vinaboss"]},
];


export default function CategoryNav({ onCategorySelect, selectedCategory }: CategoryNavProps) {
    const { products, isLoading: isLoadingProducts } = useProducts();
    const { categories, isLoading: isLoadingCategories } = useCategories();
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const categoryCounts = useMemo(() => {
        if (isLoadingProducts || !products) return {};
    
        const counts: { [key: string]: number } = {};
    
        mainCategoriesConfig.forEach(cat => {
            if (cat.subCategories) {
                counts[cat.slug] = products.filter(p => p.tags?.some(t => cat.subCategories?.includes(t))).length;
            } else {
                counts[cat.slug] = products.filter(p => p.tags?.includes(cat.slug)).length;
            }
        });
        return counts;
    }, [products, isLoadingProducts]);

    
    const allProductsCount = products?.length || 0;

    return (
        <div className="border-b border-t">
            <div className="container py-4 flex items-center gap-8 text-sm uppercase font-semibold text-gray-500">
                <h2 className="font-bold text-black whitespace-nowrap">Danh mục</h2>
                <div className="flex-grow flex items-center gap-x-6 overflow-x-auto">
                    <button
                        className={cn(
                            "hover:text-black transition-colors whitespace-nowrap",
                            selectedCategory === null ? "text-black font-bold" : ""
                        )}
                        onClick={() => onCategorySelect(null)}
                    >
                        Tất cả ({allProductsCount})
                    </button>
                    {mainCategoriesConfig.map(cat => {
                        const count = categoryCounts[cat.slug] || 0;
                        if (count === 0 && !isLoadingProducts) return null;

                        const isActive = selectedCategory === cat.slug;

                        if (cat.subCategories) {
                             return (
                                <DropdownMenu key={cat.slug} open={openDropdown === cat.slug} onOpenChange={(isOpen) => setOpenDropdown(isOpen ? cat.slug : null)}>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            onClick={() => onCategorySelect(cat.slug)}
                                            className={cn(
                                                "p-0 h-auto no-focus-border transition-colors whitespace-nowrap",
                                                isActive ? "text-black font-bold" : "",
                                                'hover:text-black hover:bg-transparent'
                                            )}
                                        >
                                            {cat.label} ({count})
                                            <ChevronDown className={cn("h-4 w-4 ml-1 transition-transform", openDropdown === cat.slug && "rotate-180")} />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="bg-white">
                                        {cat.subCategories.map(subSlug => {
                                            const subCat = categories?.find(c => c.slug === subSlug);
                                            if (!subCat) return null;
                                            return (
                                                <DropdownMenuItem key={subSlug} asChild>
                                                    <Link href={`/danh-muc/${cat.slug}/${subCat.slug}`}>{subCat.name}</Link>
                                                </DropdownMenuItem>
                                            )
                                        })}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )
                        }

                        return (
                            <button
                                key={cat.slug || 'all'}
                                className={cn(
                                    "hover:text-black transition-colors whitespace-nowrap",
                                    isActive ? "text-black font-bold" : ""
                                )}
                                onClick={() => onCategorySelect(cat.slug)}
                            >
                                {cat.label} ({count})
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
