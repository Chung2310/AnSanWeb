'use client';

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const categories = [
    { name: "SPIRITS", count: 1, href: "#" },
    { name: "SCOTCH WHISKY", count: 330, href: "/danh-muc-san-pham", hasSubmenu: true },
    { name: "WORLD WHISKY", count: 94, href: "#", hasSubmenu: true },
    { name: "OLD & RARE", count: 113, href: "#" },
    { name: "ARMAGNAC", count: 19, href: "#" },
    { name: "WINE", count: 35, href: "#" },
    { name: "BỘ QUÀ TẶNG", count: 2, href: "/danh-muc/bo-qua-tang" },
    { name: "SET THỬ RƯỢU", count: 6, href: "/danh-muc/set-thu-ruou" },
    { name: "XÌ GÀ", count: 0, href: "#" },
];

export default function ProductCategoryNav() {
    const pathname = usePathname();

    return (
        <div className="border-y bg-white">
            <div className="container flex items-center h-14">
                <h2 className="font-bold text-sm uppercase tracking-wider mr-8">Danh mục</h2>
                <nav className="flex items-center gap-6 text-xs text-stone-500 font-medium">
                    {categories.map(cat => (
                        <Link key={cat.name} href={cat.href} className="flex items-center gap-1 hover:text-black">
                            <span className={pathname === cat.href ? 'text-black font-bold' : ''}>{cat.name} ({cat.count})</span>
                            {cat.hasSubmenu && <ChevronDown className="w-4 h-4" />}
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    )
}