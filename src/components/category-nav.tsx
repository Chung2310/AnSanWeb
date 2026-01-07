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
import { useState } from 'react';

interface CategoryNavProps {
    onCategorySelect: (slug: string | null) => void;
    selectedCategory: string | null;
}

const mainCategoriesConfig = [
    { label: "Tất cả", slug: null },
    { label: "Spirits", slug: "spirits" },
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

    const getProductCountForCategory = (slug: string) => {
        if (isLoadingProducts || !products) return 0;
        const category = categories?.find(c => c.slug === slug);
        if (!category) return products.filter(p => p.tags?.includes(slug)).length;
        
        const mainCatSlugs = mainCategoriesConfig.find(mc => mc.slug === slug)?.subCategories;
        if(mainCatSlugs){
             return products.filter(p => p.tags?.some(t => mainCatSlugs.includes(t))).length;
        }
        
        return products.filter(p => p.tags?.includes(slug)).length;
    };

    const allProductsCount = products?.length || 0;

    return (
        <div className="border-b border-t">
            <div className="container py-4 flex items-center gap-8 text-sm uppercase font-semibold text-gray-500">
                <h2 className="font-bold text-black whitespace-nowrap">Danh mục</h2>
                <div className="flex-grow flex items-center gap-x-6 overflow-x-auto">
                    {mainCategoriesConfig.map(cat => {
                        const count = cat.slug === null ? allProductsCount : getProductCountForCategory(cat.slug);
                        if (count === 0 && !isLoadingProducts && cat.slug !== null) return null;

                        const isActive = selectedCategory === cat.slug;

                        if (cat.subCategories) {
                             return (
                                <DropdownMenu key={cat.slug} open={openDropdown === cat.slug} onOpenChange={(isOpen) => setOpenDropdown(isOpen ? cat.slug : null)}>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            onClick={() => onCategorySelect(cat.slug)}
                                            className={cn(
                                                "p-0 h-auto hover:bg-transparent hover:text-black no-focus-border transition-colors whitespace-nowrap",
                                                isActive ? "text-black font-bold" : ""
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
                                                    <Link href={`/danh-muc/${subCat.slug}`}>{subCat.name}</Link>
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
