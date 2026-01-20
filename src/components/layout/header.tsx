'use client';

import * as React from 'react';
import Link from 'next/link';
import { Search, Clock, Phone, ChevronDown, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/logo';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { Input } from '../ui/input';
import { useState, useRef } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '../ui/sheet';
import { useHydration } from '@/hooks/use-hydration';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { wineMegaMenuData } from '@/lib/mega-menu-data';
import { ScrollArea } from '../ui/scroll-area';

// Define unified data structures for navigation
type MenuItem = {
    href: string;
    label: string;
};

type MenuColumn = {
    title: string;
    items: MenuItem[];
};

type NavLinkData = {
    href: string;
    label: string;
    megaMenuColumns?: MenuColumn[];
};

const categoryNavLinks: NavLinkData[] = [
    {
        href: '/collection/gia-tot',
        label: 'GIÁ TỐT',
    },
    {
        href: '/danh-muc/ruou-vang',
        label: 'RƯỢU VANG',
        megaMenuColumns: [
            {
                title: 'Theo loại',
                items: wineMegaMenuData.theoLoai.map(item => ({ href: `/danh-muc/ruou-vang/${item.slug}`, label: item.label }))
            },
            {
                title: 'Theo quốc gia',
                items: wineMegaMenuData.theoQuocGia.map(item => ({ href: `/danh-muc/ruou-vang/${item.slug}`, label: item.label }))
            },
            {
                title: 'Theo vùng',
                items: wineMegaMenuData.theoVung.map(item => ({ href: `/danh-muc/ruou-vang/${item.slug}`, label: item.label }))
            },
            {
                title: 'Theo giống nho',
                items: wineMegaMenuData.theoGiongNho.map(item => ({ href: `/danh-muc/ruou-vang/${item.slug}`, label: item.label }))
            },
        ]
    },
    {
        href: '/danh-muc/ruou-manh',
        label: 'RƯỢU MẠNH',
        megaMenuColumns: [
            {
                title: 'Theo loại rượu',
                items: [
                    { href: '/danh-muc/scotch-whisky', label: 'Whisky' },
                ]
            },
            {
                title: 'Thương hiệu',
                items: [
                    { href: '/danh-muc/ruou-manh/ballantines-finest', label: "Ballantine's Finest" },
                    { href: '/danh-muc/ruou-manh/john-walker', label: 'John Walker' },
                    { href: '/danh-muc/ruou-manh/mortlach', label: 'Mortlach' },
                    { href: '/danh-muc/ruou-manh/chivas', label: 'Chivas' },
                    { href: '/danh-muc/ruou-manh/royal-salute', label: 'Royal Salute' },
                    { href: '/danh-muc/ruou-manh/the-singleton', label: 'The Singleton' },
                ]
            },
            {
                title: 'Quà tặng',
                items: [
                    { href: '/danh-muc/bo-qua-tang/qua-tet-ruou-manh', label: 'Quà tặng rượu mạnh' }
                ]
            }
        ]
    },
    {
        href: '/danh-muc/cigar',
        label: 'CIGAR',
         megaMenuColumns: [
            {
                title: 'Thương hiệu',
                items: [
                    { href: '/danh-muc/cigar/hanos', label: 'Cigar Hanos' },
                    { href: '/danh-muc/cigar/lotus', label: 'Cigar Lotus' },
                    { href: '/danh-muc/cigar/vinaboss', label: "Cigar Vinaboss's" },
                ]
            }
        ]
    },
    { 
        href: '/danh-muc/bo-qua-tang', 
        label: 'BỘ QUÀ TẶNG',
        megaMenuColumns: [
            {
                title: 'Phân loại',
                items: [
                    { href: '/danh-muc/bo-qua-tang/qua-tet-ruou-manh', label: 'Quà Tết Rượu Mạnh' },
                    { href: '/danh-muc/bo-qua-tang/qua-tet-ruou-vang', label: 'Quà Tết Rượu Vang' },
                ]
            }
        ]
    },
    {
        href: '/gioi-thieu',
        label: 'GIỚI THIỆU',
    },
    {
        href: '/tin-tuc',
        label: 'KIẾN THỨC',
    }
];

const MegaMenu = ({ columns, isOpen }: { 
    columns: MenuColumn[];
    isOpen: boolean;
}) => {
    return (
        <div 
            className={cn(
                "absolute top-full left-0 right-0 bg-popover text-popover-foreground border-t shadow-lg z-50",
                "transition-opacity duration-300 ease-in-out",
                isOpen ? "opacity-100 visible" : "opacity-0 invisible"
            )}
        >
            <div className="container mx-auto max-w-screen-2xl p-8">
                <div className={cn("grid gap-x-8")} style={{ gridTemplateColumns: `repeat(${Math.min(columns.length, 4)}, minmax(0, 1fr))` }}>
                    {columns.map((column, index) => (
                        <div key={column.title} className={cn(index > 0 && "pl-8 border-l")}>
                            <h3 className="font-semibold text-sm uppercase text-muted-foreground mb-4 tracking-wider">{column.title}</h3>
                            <ul className="space-y-2">
                                {column.items.map(item => (
                                    <li key={item.label}>
                                        <Link 
                                            href={item.href} 
                                            className="font-medium text-foreground hover:text-primary transition-colors"
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const NavLink = ({ href, label, megaMenuColumns }: NavLinkData) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleOpenMenu = () => {
    if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
    }
    setIsOpen(true);
  };

  const handleCloseMenu = () => {
    timerRef.current = setTimeout(() => {
        setIsOpen(false);
    }, 300);
  };
  
  const hasDropdown = !!megaMenuColumns;
  const isActive = (isOpen && hasDropdown) || pathname.startsWith(href);

  return (
      <div 
        className={cn('h-full flex items-center', hasDropdown && 'static')}
        onMouseEnter={handleOpenMenu}
        onMouseLeave={handleCloseMenu}
      >
        <Link 
            href={href} 
            className={cn(
                'transition-colors text-sm font-medium uppercase flex items-center h-full px-4 py-2',
                'text-primary-foreground/80 hover:text-primary-foreground',
                 isActive ? 'text-popover-foreground bg-popover' : ''
            )}
        >
          {label}
          { hasDropdown && <ChevronDown className="h-4 w-4 ml-1" /> }
        </Link>
        
        {hasDropdown && (
            <MegaMenu 
                columns={megaMenuColumns}
                isOpen={isOpen}
            />
        )}
      </div>
  );
};

export default function Header() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const isHydrated = useHydration();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      if (isSheetOpen) setIsSheetOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top Bar */}
      <div className="bg-black text-white">
        <div className="container flex h-10 max-w-screen-2xl items-center justify-between px-4">
            <div className="lg:hidden"></div>
            <div className="flex items-center gap-6 text-xs font-light ml-auto">
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>T2 - CN: 9H - 22H</span>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>0933.333.313</span>
                </div>
            </div>
        </div>
      </div>
      
      {/* Main Header */}
      <div className="bg-secondary text-secondary-foreground">
        <div className="container flex h-24 max-w-screen-2xl items-center justify-between px-4">
            <div className="flex-1 flex justify-start">
                <form onSubmit={handleSearch} className="relative w-full max-w-xs hidden lg:block">
                    <Input 
                      type="text" 
                      placeholder="Tìm kiếm" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent border-0 border-b rounded-none border-secondary-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-b-secondary-foreground pl-0 pr-8 placeholder:text-secondary-foreground/80" 
                    />
                    <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2">
                      <Search className="h-5 w-5 text-secondary-foreground/80" />
                    </button>
                </form>
            </div>

            <div className="flex-1 flex justify-center">
                <Link href="/">
                    <Logo />
                </Link>
            </div>
            
            {isHydrated && (
              <>
                <div className="hidden lg:flex flex-1 justify-end items-center gap-6">
                </div>

                <div className="lg:hidden flex-1 flex justify-end">
                  <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Menu className="h-6 w-6" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-full max-w-[400px] bg-white p-0">
                        <div className="p-6 flex flex-col h-full">
                            <SheetHeader className="sr-only">
                              <SheetTitle>Main Menu</SheetTitle>
                              <SheetDescription>Main navigation links for the website.</SheetDescription>
                            </SheetHeader>
                            <div className="mb-6">
                              <Link href="/" onClick={() => setIsSheetOpen(false)}><Logo /></Link>
                            </div>
                            
                            <form onSubmit={handleSearch} className="relative w-full mb-6">
                                <Input 
                                  type="text" 
                                  placeholder="Tìm kiếm" 
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                  className="bg-gray-100 border-gray-300 focus:ring-primary focus:border-primary" 
                                />
                                <button type="submit" className="absolute right-2.5 top-1/2 -translate-y-1/2">
                                  <Search className="h-5 w-5 text-gray-500" />
                                </button>
                            </form>

                             <Accordion type="multiple" className="w-full flex-grow">
                                {categoryNavLinks.map(link => {
                                    const mainContent = (
                                        <Link 
                                            href={link.href} 
                                            onClick={() => {if (!link.megaMenuColumns) setIsSheetOpen(false)}}
                                            className="flex-1 py-3 font-semibold uppercase text-gray-800"
                                        >
                                            {link.label}
                                        </Link>
                                    );
                                    
                                    if(link.megaMenuColumns) {
                                        return (
                                            <AccordionItem value={link.label} key={link.href}>
                                                <AccordionTrigger className="hover:no-underline py-0">
                                                    {mainContent}
                                                </AccordionTrigger>
                                                <AccordionContent className="pl-4 pb-0">
                                                    <Accordion type="multiple" className="w-full">
                                                        {link.megaMenuColumns.map(column => (
                                                            <AccordionItem value={column.title} key={column.title}>
                                                                <AccordionTrigger>{column.title}</AccordionTrigger>
                                                                <AccordionContent className="pl-4">
                                                                    {column.items.map(item => (
                                                                        <Link key={item.href} href={item.href} onClick={() => setIsSheetOpen(false)} className="block py-2 text-muted-foreground">
                                                                            {item.label}
                                                                        </Link>
                                                                    ))}
                                                                </AccordionContent>
                                                            </AccordionItem>
                                                        ))}
                                                    </Accordion>
                                                </AccordionContent>
                                            </AccordionItem>
                                        )
                                    }

                                    return <div className="border-b" key={link.href}>{mainContent}</div>
                                })}
                             </Accordion>
                        </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </>
            )}
        </div>
      </div>

      <nav className="bg-primary relative">
            <div className="container relative flex h-14 items-center justify-center gap-x-2">
                {categoryNavLinks.map((link) => <NavLink key={link.href} {...link}/>)}
            </div>
        </nav>
    </header>
  );
}