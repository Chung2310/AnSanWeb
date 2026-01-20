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
import { ScrollArea } from '../ui/scroll-area';
import { wineMegaMenuData } from '@/lib/mega-menu-data';
import Image from 'next/image';

const categoryNavLinks = [
    {
        href: '/collection/gia-tot',
        label: 'GIÁ TỐT',
    },
    {
        href: '/danh-muc/ruou-vang',
        label: 'RƯỢU VANG',
        megaMenu: true,
    },
    {
        href: '/danh-muc/ruou-manh',
        label: 'RƯỢU MẠNH',
        sublinks: [
            { href: '/danh-muc/ruou-manh/ballantines-finest', label: "Ballantine's Finest" },
            { href: '/danh-muc/ruou-manh/john-walker', label: 'John Walker' },
            { href: '/danh-muc/ruou-manh/mortlach', label: 'Mortlach' },
            { href: '/danh-muc/ruou-manh/chivas', label: 'Chivas' },
            { href: '/danh-muc/ruou-manh/royal-salute', label: 'Royal Salute' },
            { href: '/danh-muc/ruou-manh/the-singleton', label: 'The Singleton' },
        ]
    },
     {
        href: '/danh-muc/cigar',
        label: 'CIGAR',
        sublinks: [
            { href: '/danh-muc/cigar/hanos', label: 'Cigar Hanos' },
            { href: '/danh-muc/cigar/lotus', label: 'Cigar Lotus' },
            { href: '/danh-muc/cigar/vinaboss', label: "Cigar Vinaboss's" },
        ]
    },
    { 
        href: '/danh-muc/bo-qua-tang', 
        label: 'BỘ QUÀ TẶNG',
        sublinks: [
            { href: '/danh-muc/bo-qua-tang/qua-tet-ruou-manh', label: 'Quà Tết Rượu Mạnh' },
            { href: '/danh-muc/bo-qua-tang/qua-tet-ruou-vang', label: 'Quà Tết Rượu Vang' },
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

const MegaMenu = ({ isOpen, data, onMouseEnter, onMouseLeave }: { 
    isOpen: boolean;
    data: typeof wineMegaMenuData;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}) => {
    if (!isOpen) return null;

    return (
        <div 
            className="absolute top-full left-0 right-0 bg-white shadow-lg z-50"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className="container mx-auto max-w-screen-2xl p-8">
                <div className="grid grid-cols-4 gap-x-8">
                    {/* Column 1: Theo Loại */}
                    <div className="pr-8">
                        <h3 className="font-bold text-sm uppercase text-gray-400 mb-4 tracking-wider">Theo loại</h3>
                        <ul className="space-y-2">
                            {data.theoLoai.map(item => (
                                <li key={item.label}><Link href={`/danh-muc/ruou-vang/loai/${item.slug}`} className="font-bold text-gray-800 hover:text-primary transition-colors">{item.label}</Link></li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 2: Theo Quốc Gia */}
                    <div className="px-8 border-l border-gray-200">
                        <h3 className="font-bold text-sm uppercase text-gray-400 mb-4 tracking-wider">Theo quốc gia</h3>
                         <ul className="space-y-2">
                            {data.theoQuocGia.map(item => (
                                <li key={item.label}><Link href={`/danh-muc/ruou-vang/${item.slug}`} className="font-bold text-gray-800 hover:text-primary transition-colors">{item.label}</Link></li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Theo Vùng */}
                    <div className="px-8 border-l border-gray-200">
                        <h3 className="font-bold text-sm uppercase text-gray-400 mb-4 tracking-wider">Theo vùng</h3>
                        <ScrollArea className="h-48">
                            <ul className="space-y-2">
                                {data.theoVung.map(item => (
                                    <li key={item.label}><Link href={`/danh-muc/ruou-vang/vung/${item.slug}`} className="font-bold text-gray-800 hover:text-primary transition-colors">{item.label}</Link></li>
                                ))}
                            </ul>
                        </ScrollArea>
                    </div>

                    {/* Column 4: Theo Giống Nho */}
                    <div className="pl-8 border-l border-gray-200">
                        <h3 className="font-bold text-sm uppercase text-gray-400 mb-4 tracking-wider">Theo giống nho</h3>
                        <ScrollArea className="h-48">
                            <ul className="space-y-2">
                                {data.theoGiongNho.map(item => (
                                    <li key={item.label}><Link href={`/danh-muc/ruou-vang/giong-nho/${item.slug}`} className="font-bold text-gray-800 hover:text-primary transition-colors">{item.label}</Link></li>
                                ))}
                            </ul>
                        </ScrollArea>
                    </div>
                </div>
            </div>
        </div>
    );
};


const NavLink = ({ href, label, sublinks, megaMenu, className }: { 
  href: string; 
  label: string; 
  sublinks?: {href: string, label: string}[];
  megaMenu?: boolean;
  className?: string;
}) => {
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

  const isActive = pathname.startsWith(href);
  const megaMenuData = megaMenu ? wineMegaMenuData : null;
  const hasDropdown = !!(sublinks || megaMenuData);

  return (
      <div 
        onMouseEnter={handleOpenMenu}
        onMouseLeave={handleCloseMenu}
        className="relative h-full flex items-center"
      >
        <Link 
            href={href} 
            className={cn(
                'transition-colors text-sm font-medium uppercase flex items-center h-full px-4 py-2',
                (isOpen && hasDropdown)
                  ? 'text-gray-900 bg-white'
                  : 'text-white/90 hover:text-white',
                isActive && !isOpen && 'text-white',
                className
            )}
        >
          {label}
          { hasDropdown && <ChevronDown className="h-4 w-4 ml-1" /> }
        </Link>
        
        {megaMenuData ? (
          <MegaMenu 
            isOpen={isOpen} 
            data={megaMenuData}
            onMouseEnter={handleOpenMenu}
            onMouseLeave={handleCloseMenu}
          />
        ) : sublinks ? (
           <div 
             className={cn(
                "absolute top-full mt-0 w-56 rounded-b-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20 p-2",
                isOpen ? "block" : "hidden"
             )}
            onMouseEnter={handleOpenMenu}
            onMouseLeave={handleCloseMenu}
           >
             <div className="space-y-1" role="menu">
               {sublinks.map((link) => (
                  <Link 
                    key={`${link.href}-${link.label}`} 
                    href={link.href} 
                    className="block px-4 py-2 text-sm font-bold text-gray-800 hover:text-primary hover:bg-gray-100 w-full text-left rounded-md"
                    role="menuitem"
                  >
                    {link.label}
                  </Link>
               ))}
             </div>
           </div>
        ) : null}
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
                    <SheetContent side="right" className="w-full bg-white p-0 overflow-y-auto">
                        <ScrollArea className="h-full">
                          <div className="p-6">
                              <SheetHeader className="sr-only">
                                <SheetTitle>Main Menu</SheetTitle>
                                <SheetDescription>Main navigation links for the website.</SheetDescription>
                              </SheetHeader>
                              <div className="flex flex-col space-y-6">
                                <Link href="/" onClick={() => setIsSheetOpen(false)}><Logo /></Link>
                                
                                <form onSubmit={handleSearch} className="relative w-full">
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

                                 <Accordion type="multiple" className="w-full">
                                    {categoryNavLinks.map(link => {
                                        const mainContent = (
                                            <Link 
                                                href={link.href} 
                                                onClick={() => {if (!link.megaMenu && !link.sublinks) setIsSheetOpen(false)}}
                                                className="flex-1 py-3 font-semibold uppercase text-gray-800"
                                            >
                                                {link.label}
                                            </Link>
                                        );
                                        
                                        if(link.megaMenu) {
                                            return (
                                                <AccordionItem value={link.label} key={link.href}>
                                                    <AccordionTrigger className="hover:no-underline py-0">
                                                        {mainContent}
                                                    </AccordionTrigger>
                                                    <AccordionContent className="pl-4 pb-0">
                                                        <Accordion type="multiple" className="w-full">
                                                            <AccordionItem value="loai">
                                                                <AccordionTrigger>Theo loại</AccordionTrigger>
                                                                <AccordionContent className="pl-4">
                                                                    {wineMegaMenuData.theoLoai.map(sub => <Link key={sub.slug} href={`/danh-muc/ruou-vang/loai/${sub.slug}`} onClick={() => setIsSheetOpen(false)} className="block py-2 text-muted-foreground">{sub.label}</Link>)}
                                                                </AccordionContent>
                                                            </AccordionItem>
                                                             <AccordionItem value="quoc-gia">
                                                                <AccordionTrigger>Theo quốc gia</AccordionTrigger>
                                                                <AccordionContent className="pl-4">
                                                                    {wineMegaMenuData.theoQuocGia.map(sub => <Link key={sub.slug} href={`/danh-muc/ruou-vang/${sub.slug}`} onClick={() => setIsSheetOpen(false)} className="block py-2 text-muted-foreground">{sub.label}</Link>)}
                                                                </AccordionContent>
                                                            </AccordionItem>
                                                             <AccordionItem value="vung">
                                                                <AccordionTrigger>Theo vùng</AccordionTrigger>
                                                                <AccordionContent className="pl-4">
                                                                    {wineMegaMenuData.theoVung.map(sub => <Link key={sub.slug} href={`/danh-muc/ruou-vang/vung/${sub.slug}`} onClick={() => setIsSheetOpen(false)} className="block py-2 text-muted-foreground">{sub.label}</Link>)}
                                                                </AccordionContent>
                                                            </AccordionItem>
                                                            <AccordionItem value="giong-nho">
                                                                <AccordionTrigger>Theo giống nho</AccordionTrigger>
                                                                <AccordionContent className="pl-4">
                                                                    {wineMegaMenuData.theoGiongNho.map(sub => <Link key={sub.slug} href={`/danh-muc/ruou-vang/giong-nho/${sub.slug}`} onClick={() => setIsSheetOpen(false)} className="block py-2 text-muted-foreground">{sub.label}</Link>)}
                                                                </AccordionContent>
                                                            </AccordionItem>
                                                        </Accordion>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            )
                                        }

                                        if (link.sublinks) {
                                            return (
                                                <AccordionItem value={link.label} key={link.href}>
                                                    <AccordionTrigger className="hover:no-underline py-0">
                                                        {mainContent}
                                                    </AccordionTrigger>
                                                    <AccordionContent className="pl-4">
                                                        {link.sublinks.map(sublink => (
                                                            <Link key={sublink.href} href={sublink.href} onClick={() => setIsSheetOpen(false)} className="block py-2 text-muted-foreground">
                                                                {sublink.label}
                                                            </Link>
                                                        ))}
                                                    </AccordionContent>
                                                </AccordionItem>
                                            )
                                        }

                                        return <div className="border-b" key={link.href}>{mainContent}</div>
                                    })}
                                 </Accordion>
                              </div>
                          </div>
                      </ScrollArea>
                    </SheetContent>
                  </Sheet>
                </div>
              </>
            )}
        </div>
      </div>

      {/* Category Nav */}
      {isHydrated && (
        <div className="relative hidden lg:block border-t border-border" style={{ backgroundColor: '#b0955e' }}>
            <nav className="container relative flex h-14 items-center justify-center gap-x-2">
                {categoryNavLinks.map((link) => <NavLink key={link.href} {...link}/>)}
            </nav>
        </div>
      )}
    </header>
  );
}
