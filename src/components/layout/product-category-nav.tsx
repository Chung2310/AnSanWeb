'use client';

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sampleWines } from "@/lib/placeholder-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const categoryDefinitions = [
    { name: "SPIRITS", href: "/danh-muc/spirits", filter: (wine: any) => wine.tags?.includes('spirits') },
    { 
        name: "SCOTCH WHISKY", 
        href: "/danh-muc/scotch-whisky", 
        filter: (wine: any) => wine.tags?.includes('scotch'),
        sublinks: [
            { name: "Whisky Campbeltown", href: "/danh-muc/scotch-whisky/whisky-campbeltown", filter: (wine: any) => wine.tags?.includes('campbeltown') },
            { name: "Whisky Highland", href: "/danh-muc/scotch-whisky/whisky-highland", filter: (wine: any) => wine.tags?.includes('highland') },
            { name: "Whisky Islay", href: "/danh-muc/scotch-whisky/whisky-islay", filter: (wine: any) => wine.tags?.includes('islay') },
            { name: "Whisky Lowland", href: "/danh-muc/scotch-whisky/whisky-lowland", filter: (wine: any) => wine.tags?.includes('lowland') },
            { name: "Whisky Speyside", href: "/danh-muc/scotch-whisky/whisky-speyside", filter: (wine: any) => wine.tags?.includes('speyside') },
            { name: "Whisky Islands", href: "/danh-muc/scotch-whisky/whisky-islands", filter: (wine: any) => wine.tags?.includes('islands') },
        ]
    },
    { 
        name: "WORLD WHISKY", 
        href: "/danh-muc/world-whisky", 
        filter: (wine: any) => wine.tags?.includes('world'),
        sublinks: [
            { name: "Whiskey Ireland", href: "/danh-muc/world-whisky/whisky-ireland", filter: (wine: any) => wine.tags?.includes('ireland') },
            { name: "Whisky Nhật", href: "/danh-muc/world-whisky/whisky-nhat", filter: (wine: any) => wine.tags?.includes('japan') },
            { name: "Whisky The Lakes", href: "/danh-muc/world-whisky/whisky-the-lakes", filter: (wine: any) => wine.nameVN.includes('The Lakes') },
            { name: "Bourbon Whiskey", href: "/danh-muc/world-whisky/whisky-khac", filter: (wine: any) => wine.tags?.includes('bourbon') },
        ]
    },
    { name: "OLD & RARE", href: "/danh-muc/old-rare", filter: (wine: any) => wine.tags?.includes('old-rare') },
    { name: "ARMAGNAC", href: "/danh-muc/armagnac", filter: (wine: any) => wine.type === 'Armagnac' },
    { name: "WINE", href: "/danh-muc/wine", filter: (wine: any) => wine.tags?.includes('wine') },
    { name: "BỘ QUÀ TẶNG", href: "/danh-muc/bo-qua-tang", filter: (wine: any) => wine.type === 'Gift Set' },
    { name: "SET THỬ RƯỢU", href: "/danh-muc/set-thu-ruou", filter: (wine: any) => wine.type === 'Tasting Set' },
    { name: "XÌ GÀ", href: "#", filter: () => false }, // No products for this category yet
];

export default function ProductCategoryNav() {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const categoriesWithCounts = categoryDefinitions.map(cat => ({
        ...cat,
        count: sampleWines.filter(cat.filter).length,
        sublinks: cat.sublinks?.map(sub => ({
            ...sub,
            count: sampleWines.filter(sub.filter).length,
        }))
    }));

    const NavLink = ({ category }: { category: typeof categoriesWithCounts[0] }) => {
        const [open, setOpen] = useState(false);
        const isActive = pathname === category.href || (category.sublinks && pathname.startsWith(category.href));

        if (category.sublinks) {
            if (!mounted) {
                return (
                    <div className="flex items-center gap-1 hover:text-black">
                        <span className={isActive ? 'text-black font-bold' : ''}>{category.name} ({category.count})</span>
                        <ChevronDown className="w-4 h-4" />
                    </div>
                );
            }
            return (
                <DropdownMenu open={open} onOpenChange={setOpen}>
                    <DropdownMenuTrigger asChild>
                        <div 
                          onMouseEnter={() => setOpen(true)} 
                          onMouseLeave={() => setOpen(false)}
                          className="flex items-center gap-1 hover:text-black cursor-pointer"
                        >
                            <Link href={category.href} className={cn(isActive ? 'text-black font-bold' : '')}>
                                {category.name} ({category.count})
                            </Link>
                            <ChevronDown className="w-4 h-4" />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                        onMouseEnter={() => setOpen(true)} 
                        onMouseLeave={() => setOpen(false)}
                    >
                        {category.sublinks.map(link => (
                            <DropdownMenuItem key={link.href} asChild>
                                <Link href={link.href}>{link.name} ({link.count})</Link>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }

        return (
            <Link href={category.href} className="flex items-center gap-1 hover:text-black">
                <span className={pathname === category.href ? 'text-black font-bold' : ''}>{category.name} ({category.count})</span>
            </Link>
        );
    };

    return (
        <div className="border-y bg-white">
            <div className="container flex items-center h-14">
                <h2 className="font-bold text-sm uppercase tracking-wider mr-8">Danh mục</h2>
                <nav className="flex items-center gap-6 text-xs text-stone-500 font-medium">
                    {categoriesWithCounts.map(cat => (
                        <NavLink key={cat.name} category={cat} />
                    ))}
                </nav>
            </div>
        </div>
    );
}