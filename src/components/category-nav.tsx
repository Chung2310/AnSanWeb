

'use client';
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
import { useCategories } from '@/hooks/use-categories';
import type { Category } from '@/lib/types';


const mainCategoriesConfig = [
    {
        label: "Rượu Vang",
        slug: "ruou-vang",
        href: '/danh-muc/ruou-vang',
    },
    {
        label: "Rượu Mạnh",
        slug: "ruou-manh",
        href: '/danh-muc/ruou-manh',
    },
    {
        label: "Cigar",
        slug: "cigar",
        href: "/danh-muc/cigar",
    },
    {
        label: "Ly & Cốc Pha Lê",
        slug: "ly-coc-pha-le",
        href: '/danh-muc/ly-coc-pha-le',
    },
    { 
        label: "Bộ Quà Tặng", 
        slug: "bo-qua-tang", 
        href: "/danh-muc/bo-qua-tang",
    },
];

export default function CategoryNav({ onCategorySelect, selectedCategory }: CategoryNavProps) {
    const { products, isLoading: isLoadingProducts } = useProducts();
    const { categories, isLoading: isLoadingCategories } = useCategories();
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const categoryCounts = useMemo(() => {
        if (isLoadingProducts || isLoadingCategories || !products || !categories) {
            return {};
        }

        const counts: { [key: string]: number } = {};

        const getDescendantIds = (parentId: string, allCategories: Category[]): string[] => {
            const children = allCategories.filter(cat => cat.parentId === parentId);
            let ids = children.map(cat => cat.id);
            children.forEach(child => {
                ids = [...ids, ...getDescendantIds(child.id, allCategories)];
            });
            return ids;
        };

        mainCategoriesConfig.forEach(mainCat => {
            const parentCategory = categories.find(c => c.slug === mainCat.slug);
            if (parentCategory) {
                const descendantIds = getDescendantIds(parentCategory.id, categories);
                const allCategoryIds = [parentCategory.id, ...descendantIds];
                
                const count = products.filter(p => 
                    p.tags?.some(tag => allCategoryIds.includes(tag))
                ).length;
                counts[mainCat.slug] = count;
            } else {
                 counts[mainCat.slug] = 0;
            }
        });

        return counts;
    }, [products, categories, isLoadingProducts, isLoadingCategories]);

    
    const allProductsCount = useMemo(() => {
        if(isLoadingProducts || !products) return 0;
        return products.length;
    }, [products, isLoadingProducts]);

    return (
        <div className="border-b border-t">
            <div className="container py-4 flex items-center gap-8 text-sm uppercase font-semibold text-gray-500">
                <div className="flex-grow flex items-center gap-x-6 overflow-x-auto">
                    <Link
                        href="/danh-muc-san-pham"
                        className={cn(
                            "hover:text-black transition-colors whitespace-nowrap",
                            selectedCategory === null ? "text-black font-bold" : ""
                        )}
                    >
                        Tất cả ({allProductsCount})
                    </Link>
                    {mainCategoriesConfig.map(cat => {
                        const count = categoryCounts[cat.slug] || 0;
                        if (count === 0 && !isLoadingProducts && !isLoadingCategories) return null;

                        const isActive = selectedCategory === cat.slug;

                        if ((cat as any).subCategories) {
                             return (
                                <DropdownMenu key={cat.slug} open={openDropdown === cat.slug} onOpenChange={(isOpen) => setOpenDropdown(isOpen ? cat.slug : null)}>
                                    <div 
                                        onMouseEnter={() => setOpenDropdown(cat.slug)}
                                        onMouseLeave={() => setOpenDropdown(null)}
                                        className="flex items-center"
                                    >
                                        <Button
                                            variant="ghost"
                                            asChild
                                            className={cn(
                                                "p-0 h-auto no-focus-border transition-colors whitespace-nowrap text-sm uppercase font-semibold text-gray-500",
                                                isActive ? "text-black font-bold" : "",
                                                'hover:text-black hover:bg-transparent'
                                            )}
                                        >
                                            <Link href={cat.href || '#'}>
                                                {cat.label} ({count})
                                            </Link>
                                        </Button>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className={cn(
                                                    "p-0 h-auto no-focus-border transition-colors whitespace-nowrap text-sm uppercase font-semibold text-gray-500",
                                                    isActive ? "text-black font-bold" : "",
                                                    'hover:text-black hover:bg-transparent'
                                                )}
                                            >
                                                <ChevronDown className={cn("h-4 w-4 ml-1 transition-transform", openDropdown === cat.slug && "rotate-180")} />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent 
                                            className="bg-white"
                                            onMouseEnter={() => setOpenDropdown(cat.slug)}
                                            onMouseLeave={() => setOpenDropdown(null)}
                                        >
                                            {(cat as any).subCategories.map((subLink: any) => (
                                                <DropdownMenuItem key={subLink.href} asChild>
                                                    <Link href={subLink.href}>{subLink.label}</Link>
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </div>
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

interface CategoryNavProps {
    onCategorySelect: (slug: string | null) => void;
    selectedCategory: string | null;
}
