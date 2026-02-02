'use client';

import * as React from 'react';
import Link from 'next/link';
import { Search, Clock, Phone, ChevronDown, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/logo';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { Input } from '../ui/input';
import { useState, useRef, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '../ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { wineMegaMenuData, spiritsMegaMenuData, glasswareMegaMenuData, giftSetMegaMenuData } from '@/lib/mega-menu-data';

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

const staticNavLinks: NavLinkData[] = [
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
                items: wineMegaMenuData.theoLoai.map(item => ({ href: `/danh-muc/${item.slug}`, label: item.label }))
            },
            {
                title: 'Theo quốc gia',
                items: wineMegaMenuData.theoQuocGia.map(item => ({ href: `/danh-muc/${item.slug}`, label: item.label }))
            },
            {
                title: 'Theo vùng',
                items: wineMegaMenuData.theoVung.map(item => ({ href: `/danh-muc/${item.slug}`, label: item.label }))
            },
            {
                title: 'Theo giống nho',
                items: wineMegaMenuData.theoGiongNho.map(item => ({ href: `/danh-muc/${item.slug}`, label: item.label }))
            },
        ]
    },
    {
        href: '/danh-muc/ruou-manh',
        label: 'RƯỢU MẠNH',
        megaMenuColumns: [
            {
                title: 'Theo loại rượu',
                items: spiritsMegaMenuData.theoLoai.map(item => ({ href: `/danh-muc/${item.slug}`, label: item.label }))
            },
            {
                title: 'Thương hiệu',
                items: spiritsMegaMenuData.thuongHieu.map(item => ({ href: `/danh-muc/${item.slug}`, label: item.label }))
            },
            {
                title: 'Quà tặng',
                items: spiritsMegaMenuData.quaTang.map(item => ({ href: `/danh-muc/${item.slug}`, label: item.label }))
            }
        ]
    },
    {
        href: '/danh-muc/cigar',
        label: 'CIGAR',
    },
    {
        href: '/danh-muc/ly-coc-pha-le',
        label: 'LY - CỐC PHA LÊ',
        megaMenuColumns: [
            {
                title: 'LY PHA LÊ RIEDEL',
                items: glasswareMegaMenuData.lyPhaLeRiedel.map(item => ({ href: `/danh-muc/${item.slug}`, label: item.label }))
            },
            {
                title: 'LY WHISKY',
                items: glasswareMegaMenuData.lyWhisky.map(item => ({ href: `/danh-muc/${item.slug}`, label: item.label }))
            },
            {
                title: 'KHÁC',
                items: glasswareMegaMenuData.khac.map(item => ({ href: `/danh-muc/${item.slug}`, label: item.label }))
            }
        ]
    },
    { 
        href: '/danh-muc/bo-qua-tang', 
        label: 'BỘ QUÀ TẶNG',
        megaMenuColumns: [
            {
                title: 'Quà tặng',
                items: giftSetMegaMenuData.quaTang.map(item => ({
                    href: `/danh-muc/${item.slug}`,
                    label: item.label
                })),
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

const MegaMenu = ({ columns, isOpen, onMouseEnter, onMouseLeave, onLinkClick }: { 
    columns: MenuColumn[];
    isOpen: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onLinkClick: () => void;
}) => {
    if (!columns || columns.length === 0) return null;
    
    return (
        <div 
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={cn(
                "absolute top-full left-0 right-0 bg-popover text-popover-foreground border-t shadow-lg",
                "transition-all duration-150 ease-in-out transform",
                isOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
            )}
        >
            <div className="container mx-auto max-w-screen-2xl p-8">
                <div className={cn("grid gap-x-8")} style={{ gridTemplateColumns: `repeat(${columns.length > 5 ? 5 : columns.length}, minmax(0, 1fr))` }}>
                    {columns.map((column, index) => (
                        <div key={column.title} className={cn(index > 0 && "pl-8 border-l")}>
                            <h3 className="font-semibold text-sm text-muted-foreground mb-4 tracking-wider">{column.title}</h3>
                            <ul className="space-y-3">
                                {column.items.map(item => (
                                    <li key={item.label}>
                                        <Link 
                                            href={item.href} 
                                            className="font-bold text-foreground hover:text-primary transition-colors"
                                            onClick={onLinkClick}
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
    }
    setIsOpen(true);
  };

  const handleCloseMenu = () => {
    timerRef.current = setTimeout(() => {
        setIsOpen(false);
    }, 150);
  };

  const handleImmediateClose = () => {
    if (timerRef.current) {
        clearTimeout(timerRef.current);
    }
    setIsOpen(false);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);
  
  const hasDropdown = !!megaMenuColumns && megaMenuColumns.length > 0;
  const isMenuOpen = isOpen && hasDropdown;
  const isCurrentPage = pathname === href || (href !== '/' && pathname.startsWith(href));
  
  return (
      <div 
        className={cn('h-full flex items-center', hasDropdown && 'static')}
        onMouseEnter={handleOpenMenu}
        onMouseLeave={handleCloseMenu}
      >
        <Link
            href={href}
            onClick={handleImmediateClose}
            className={cn(
                'transition-colors text-sm font-medium uppercase flex items-center h-full px-4 py-2',
                isMenuOpen
                  ? 'bg-popover text-primary'
                  : isCurrentPage
                  ? 'text-primary-foreground font-bold'
                  : 'text-primary-foreground/80',
                !isMenuOpen && 'hover:text-primary-foreground'
            )}
        >
          {label}
          { hasDropdown && <ChevronDown className="h-4 w-4 ml-1" /> }
        </Link>
        
        {hasDropdown && (
            <MegaMenu 
                columns={megaMenuColumns}
                isOpen={isMenuOpen}
                onMouseEnter={handleOpenMenu}
                onMouseLeave={handleCloseMenu}
                onLinkClick={handleImmediateClose}
            />
        )}
      </div>
  );
};


export default function Header() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

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
                    <Button type="submit" variant="ghost" className="absolute right-0 top-1/2 -translate-y-1/2 h-auto p-2 hover:bg-transparent">
                      <Search className="h-5 w-5 text-secondary-foreground/80" />
                    </Button>
                </form>
            </div>

            <div className="flex-1 flex justify-center">
                <Link href="/">
                    <Logo />
                </Link>
            </div>
            
            <div className="flex-1 flex justify-end">
                <div className="lg:hidden">
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
                                <Button type="submit" variant="ghost" className="absolute right-2.5 top-1/2 -translate-y-1/2 h-auto p-2 hover:bg-transparent">
                                  <Search className="h-5 w-5 text-gray-500" />
                                </Button>
                            </form>

                            <Accordion type="multiple" className="w-full flex-grow">
                                {staticNavLinks.map(link => {
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
                                            <AccordionItem value={link.label} key={link.label}>
                                                <AccordionTrigger className="hover:no-underline py-0">
                                                    {mainContent}
                                                </AccordionTrigger>
                                                <AccordionContent className="pl-4 pb-0">
                                                    {link.href && (
                                                        <Link href={link.href} onClick={() => setIsSheetOpen(false)} className="block py-3 font-bold uppercase text-gray-700 border-b">
                                                            Tất cả {link.label}
                                                        </Link>
                                                    )}
                                                    <Accordion type="multiple" className="w-full">
                                                        {link.megaMenuColumns.map(column => {
                                                            if (column.items.length === 0) {
                                                                return null;
                                                            }
                                                            return (
                                                                <AccordionItem value={column.title} key={column.title}>
                                                                    <AccordionTrigger className="font-semibold uppercase text-gray-800">{column.title}</AccordionTrigger>
                                                                    <AccordionContent className="pl-4">
                                                                        {column.items.map(item => (
                                                                            <Link key={item.href} href={item.href} onClick={() => setIsSheetOpen(false)} className="block py-2 text-muted-foreground hover:text-primary">
                                                                                {item.label}
                                                                            </Link>
                                                                        ))}
                                                                    </AccordionContent>
                                                                </AccordionItem>
                                                            )
                                                        })}
                                                    </Accordion>
                                                </AccordionContent>
                                            </AccordionItem>
                                        )
                                    }

                                    return <div className="border-b" key={link.label}>{mainContent}</div>
                                })}
                            </Accordion>
                        </div>
                    </SheetContent>
                  </Sheet>
                </div>
            </div>
        </div>
      </div>

      <nav className="bg-primary relative hidden lg:flex">
            <div className="container relative flex h-14 items-center justify-center gap-x-2">
                {staticNavLinks.map((link) => <NavLink key={link.label} {...link}/>)}
            </div>
        </nav>
    </header>
  );
}
