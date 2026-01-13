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

interface CategoryNavProps {
    onCategorySelect: (slug: string | null) => void;
    selectedCategory: string | null;
}

const mainCategoriesConfig = [
    {
        label: "Rượu Vang",
        slug: "ruou-vang",
        href: '/danh-muc/ruou-vang',
        tags: ['wine', 'y', 'phap', 'tay-ban-nha', 'uc', 'nga', 'duc'],
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
        slug: "ruou-manh",
        href: '/danh-muc/ruou-manh',
        tags: ['spirits', 'john-walker', 'chivas', 'mortlach', 'ballantines', 'royal-salute', 'singleton', 'armagnac', 'scotch', 'world'],
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
        href: "/danh-muc/cigar",
        tags: ['cigar', 'cigar-hanos', 'cigar-lotus', 'cigar-vinaboss'],
        subCategories: [
            { label: 'Cigar Hanos', href: '/danh-muc/cigar/hanos' },
            { label: 'Cigar Lotus', href: '/danh-muc/cigar/lotus' },
            { label: "Cigar Vinaboss's", href: '/danh-muc/cigar/vinaboss' },
        ]
    },
    { label: "Bộ Quà Tặng", slug: "bo-qua-tang", href: "/danh-muc/bo-qua-tang", tags: ['gift-set'] },
      
];


export default function CategoryNav({ onCategorySelect, selectedCategory }: CategoryNavProps) {
    const { products, isLoading: isLoadingProducts } = useProducts();
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const categoryCounts = useMemo(() => {
        if (isLoadingProducts || !products) return {};
    
        const counts: { [key: string]: number } = {};
    
        mainCategoriesConfig.forEach(cat => {
            if (cat.tags) {
                 counts[cat.slug] = products.filter(p => p.tags?.some(t => cat.tags.includes(t))).length;
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
                        if (count === 0 && !isLoadingProducts) return null;

                        const isActive = selectedCategory === cat.slug;

                        if (cat.subCategories) {
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
                                            {cat.subCategories.map(subLink => (
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
