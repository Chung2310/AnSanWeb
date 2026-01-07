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
        label: "Rượu Vang",
        slug: "wine",
        subCategories: [
            { label: 'VANG Ý', href: '/danh-muc/ruou-vang/vang-y' },
            { label: 'VANG PHÁP', href: '/danh-muc/ruou-vang/vang-phap' },
            { label: 'VANG TÂY BAN NHA', href: '/danh-muc/ruou-vang/vang-tay-ban-nha' },
            { label: 'VANG ÚC', href: '/danh-muc/ruou-vang/vang-uc' },
            { label: 'VANG NGA', href: '/danh-muc/ruou-vang/vang-nga' },
            { label: 'VANG ĐỨC', href: '/danh-muc/ruou-vang/vang-duc' },
        ]
    },
    {
        label: "Rượu Mạnh",
        slug: "spirits",
        subCategories: [
            { label: "BALLANTINE'S FINEST", href: '/danh-muc/ruou-manh/ballantines-finest' },
            { label: 'JOHN WALKER', href: '/danh-muc/ruou-manh/john-walker' },
            { label: 'MORTLACH', href: '/danh-muc/ruou-manh/mortlach' },
            { label: 'CHIVAS', href: '/danh-muc/ruou-manh/chivas' },
            { label: 'ROYAL SALUTE', href: '/danh-muc/ruou-manh/royal-salute' },
            { label: 'THE SINGLETON', href: '/danh-muc/ruou-manh/the-singleton' },
        ]
    },
    {
        label: "Cigar",
        slug: "cigar",
        subCategories: [
            { label: 'Cigar Hanos', href: '/danh-muc/cigar/hanos' },
            { label: 'Cigar Lotus', href: '/danh-muc/cigar/lotus' },
            { label: "Cigar Vinaboss's", href: '/danh-muc/cigar/vinaboss' },
        ]
    },
    { label: "Bộ Quà Tặng", slug: "bo-qua-tang", href: "/danh-muc/bo-qua-tang" },
    { label: "Khắc Tên Lên Chai", slug: "khac-ten-len-chai", href: "/danh-muc/khac-ten-len-chai" },
    { label: "Set Thử Rượu", slug: "set-thu-ruou", href: "/danh-muc/set-thu-ruou" },
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
                // For parent categories, count products that have ANY of the subcategory tags
                 const subCategorySlugs = categories?.filter(c => cat.subCategories.some(sc => sc.label.toLowerCase() === c.name.toLowerCase() || sc.href.includes(c.slug))).map(c => c.slug) || [];
                 counts[cat.slug] = products.filter(p => p.tags?.some(t => subCategorySlugs.includes(t)) || p.tags?.includes(cat.slug)).length;
            } else {
                counts[cat.slug] = products.filter(p => p.tags?.includes(cat.slug)).length;
            }
        });
        return counts;
    }, [products, isLoadingProducts, categories]);

    
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
                                        {cat.subCategories.map(subLink => (
                                            <DropdownMenuItem key={subLink.href} asChild>
                                                <Link href={subLink.href}>{subLink.label}</Link>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )
                        }

                        return (
                            <Link
                                key={cat.slug}
                                href={cat.href || '#'}
                                className={cn(
                                    "hover:text-black transition-colors whitespace-nowrap",
                                    isActive ? "text-black font-bold" : ""
                                )}
                                onClick={(e) => {
                                    if (!cat.href) {
                                        e.preventDefault();
                                        onCategorySelect(cat.slug);
                                    }
                                }}
                            >
                                {cat.label} ({count})
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
