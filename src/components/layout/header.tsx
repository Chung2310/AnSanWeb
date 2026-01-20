
'use client';

import * as React from 'react';
import Link from 'next/link';
import { Search, Clock, Phone, ChevronDown, Menu, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/logo';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { Input } from '../ui/input';
import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '../ui/sheet';
import { useHydration } from '@/hooks/use-hydration';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from 'next/image';
import { ScrollArea } from '../ui/scroll-area';


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

const wineMegaMenuData = {
    theoLoai: [
        { label: "Rượu vang đỏ", href: "/danh-muc/ruou-vang/vang-do" },
        { label: "Rượu vang trắng", href: "/danh-muc/ruou-vang/vang-trang" },
        { label: "Rượu vang sủi", href: "/danh-muc/ruou-vang/vang-sui" },
        { label: "Champagne", href: "/danh-muc/ruou-vang/champagne" },
    ],
    theoQuocGia: [
        { label: "Vang Pháp", href: "/danh-muc/ruou-vang/vang-phap" },
        { label: "Vang Úc", href: "/danh-muc/ruou-vang/vang-uc" },
        { label: "Vang Ý", href: "/danh-muc/ruou-vang/vang-y" },
        { label: "Vang Tây Ban Nha", href: "/danh-muc/ruou-vang/vang-tay-ban-nha" },
        { label: "Vang Đức", href: "/danh-muc/ruou-vang/vang-duc" },
        { label: "Vang Nga", href: "/danh-muc/ruou-vang/vang-nga" },
    ],
    theoVung: [
        { label: "Saint-Émilion", href: "/danh-muc/ruou-vang/vung/saint-emilion" },
        { label: "Pomerol", href: "/danh-muc/ruou-vang/vung/pomerol" },
        { label: "Languedoc", href: "/danh-muc/ruou-vang/vung/languedoc" },
        { label: "Puglia", href: "/danh-muc/ruou-vang/vang-y/puglia" },
        { label: "Veneto", href: "/danh-muc/ruou-vang/vang-y/veneto" },
        { label: "Abruzzo", href: "/danh-muc/ruou-vang/vang-y/abruzzo" },
        { label: "Crecchio", href: "/danh-muc/ruou-vang/vung/crecchio" },
        { label: "Tuscany", href: "/danh-muc/ruou-vang/vang-y/toscana" },
        { label: "Salento", href: "/danh-muc/ruou-vang/vung/salento" },
        { label: "Sicily", href: "/danh-muc/ruou-vang/vang-y/sicilia" },
    ],
    theoGiongNho: [
        { label: "Cabernet Sauvignon", href: "/danh-muc/ruou-vang/giong-nho/cabernet-sauvignon" },
        { label: "Merlot", href: "/danh-muc/ruou-vang/giong-nho/merlot" },
        { label: "Shiraz", href: "/danh-muc/ruou-vang/giong-nho/shiraz" },
        { label: "Chardonnay", href: "/danh-muc/ruou-vang/giong-nho/chardonnay" },
        { label: "Garnacha", href: "/danh-muc/ruou-vang/giong-nho/garnacha" },
        { label: "Malvasia", href: "/danh-muc/ruou-vang/giong-nho/malvasia" },
        { label: "Montepulciano", href: "/danh-muc/ruou-vang/giong-nho/montepulciano" },
        { label: "Moscato", href: "/danh-muc/ruou-vang/giong-nho/moscato" },
        { label: "Negroamaro", href: "/danh-muc/ruou-vang/giong-nho/negroamaro" },
        { label: "Petit Verdot", href: "/danh-muc/ruou-vang/giong-nho/petit-verdot" },
        { label: "Pinot Grigio", href: "/danh-muc/ruou-vang/giong-nho/pinot-grigio" },
        { label: "Primitivo", href: "/danh-muc/ruou-vang/giong-nho/primitivo" },
        { label: "Riesling", href: "/danh-muc/ruou-vang/giong-nho/riesling" },
        { label: "Sangiovese", href: "/danh-muc/ruou-vang/giong-nho/sangiovese" },
        { label: "Tempranillo", href: "/danh-muc/ruou-vang/giong-nho/tempranillo" },
        { label: "Zinfandel", href: "/danh-muc/ruou-vang/giong-nho/zinfandel" },
    ],
    featuredProducts: [
        { name: "Old Vine Cabernet Sauvignon", price: 890000, imageURL: "/images/homepage/Chivas.png", link: "/san-pham/old-vine-cabernet-sauvignon" },
        { name: "Old Vine Shiraz", price: 890000, imageURL: "/images/homepage/Chivas.png", link: "/san-pham/old-vine-shiraz" },
        { name: "Gigino Grande (80 anniv.) – Vang Đỏ", price: 2100000, imageURL: "/images/homepage/Chivas.png", link: "/san-pham/gigino-grande-80-anniv" },
    ]
};

const MegaMenu = ({ isOpen, data }: { isOpen: boolean, data: typeof wineMegaMenuData }) => {
    if (!isOpen) return null;

    const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    return (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg z-20">
            <div className="container mx-auto max-w-screen-2xl p-8">
                <div className="grid grid-cols-5 gap-8">
                    {/* Column 1: Loại Vang */}
                    <div>
                        <h3 className="font-bold text-sm uppercase text-gray-500 mb-4">Theo loại</h3>
                        <ul className="space-y-2">
                            {data.theoLoai.map(item => (
                                <li key={item.label}><Link href={item.href} className="text-gray-700 hover:text-primary transition-colors">{item.label}</Link></li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 2: Xuất Xứ */}
                    <div>
                        <h3 className="font-bold text-sm uppercase text-gray-500 mb-4">Theo quốc gia</h3>
                         <ul className="space-y-2">
                            {data.theoQuocGia.map(item => (
                                <li key={item.label}><Link href={item.href} className="text-gray-700 hover:text-primary transition-colors">{item.label}</Link></li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Vùng Làm Vang */}
                    <div>
                        <h3 className="font-bold text-sm uppercase text-gray-500 mb-4">Theo vùng</h3>
                        <ScrollArea className="h-48">
                            <ul className="space-y-2">
                                {data.theoVung.map(item => (
                                    <li key={item.label}><Link href={item.href} className="text-gray-700 hover:text-primary transition-colors">{item.label}</Link></li>
                                ))}
                            </ul>
                        </ScrollArea>
                    </div>

                    {/* Column 4: Giống Nho */}
                    <div>
                        <h3 className="font-bold text-sm uppercase text-gray-500 mb-4">Theo giống nho</h3>
                        <ScrollArea className="h-48">
                            <ul className="space-y-2">
                                {data.theoGiongNho.map(item => (
                                    <li key={item.label}><Link href={item.href} className="text-gray-700 hover:text-primary transition-colors">{item.label}</Link></li>
                                ))}
                            </ul>
                        </ScrollArea>
                    </div>
                    
                    {/* Column 5: Featured Products */}
                    <div>
                        <h3 className="font-bold text-sm uppercase text-gray-500 mb-4">Sản phẩm bán chạy</h3>
                        <ul className="space-y-4">
                            {data.featuredProducts.map(product => (
                                <li key={product.name}>
                                    <Link href={product.link} className="flex items-center gap-4 group">
                                        <div className="w-16 h-16 relative flex-shrink-0">
                                            <Image src={product.imageURL} alt={product.name} fill className="object-contain" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800 group-hover:text-primary transition-colors text-sm">{product.name}</p>
                                            <p className="text-primary font-bold text-sm">{formatPrice(product.price)}</p>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
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
  const isActive = pathname.startsWith(href);

  const linkClasses = cn(
    'transition-colors text-sm font-medium uppercase flex items-center',
    isActive ? 'text-foreground' : 'text-header-nav hover:text-header-nav-hover',
    className
  );

  const megaMenuData = megaMenu ? wineMegaMenuData : null;

  if (megaMenuData) {
    return (
       <div 
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="relative h-14 flex items-center"
      >
        <Link href={href} className={linkClasses}>
          {label}
          <ChevronDown className="h-4 w-4 ml-1" />
        </Link>
        <MegaMenu isOpen={isOpen} data={megaMenuData} />
      </div>
    )
  }


  if (sublinks) {
    return (
      <div 
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="relative h-14 flex items-center"
      >
        <Link href={href} className={linkClasses}>
          {label}
          <ChevronDown className="h-4 w-4 ml-1" />
        </Link>
        {isOpen && (
           <div className="absolute top-full left-0 mt-0 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20 p-2">
             <div className="space-y-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
               {sublinks.map((link) => (
                  <div key={`${link.href}-${link.label}`} className="relative group p-1">
                     <Link 
                       href={link.href} 
                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left border border-transparent rounded-md"
                       role="menuitem"
                     >
                       {link.label}
                     </Link>
                  </div>
               ))}
             </div>
           </div>
        )}
      </div>
    );
  }

  return (
    <Link href={href} className={cn(linkClasses, 'h-14 flex items-center')}>
      {label}
    </Link>
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
                    <Link href="/trac-nghiem-ruou-vang" className='transition-colors text-sm font-medium uppercase text-header-nav hover:text-header-nav-hover'>Trắc nghiệm Rượu Vang</Link>
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
                                                                    {wineMegaMenuData.theoLoai.map(sub => <Link key={sub.href} href={sub.href} onClick={() => setIsSheetOpen(false)} className="block py-2 text-muted-foreground">{sub.label}</Link>)}
                                                                </AccordionContent>
                                                            </AccordionItem>
                                                             <AccordionItem value="quoc-gia">
                                                                <AccordionTrigger>Theo quốc gia</AccordionTrigger>
                                                                <AccordionContent className="pl-4">
                                                                    {wineMegaMenuData.theoQuocGia.map(sub => <Link key={sub.href} href={sub.href} onClick={() => setIsSheetOpen(false)} className="block py-2 text-muted-foreground">{sub.label}</Link>)}
                                                                </AccordionContent>
                                                            </AccordionItem>
                                                             <AccordionItem value="vung">
                                                                <AccordionTrigger>Theo vùng</AccordionTrigger>
                                                                <AccordionContent className="pl-4">
                                                                    {wineMegaMenuData.theoVung.map(sub => <Link key={sub.href} href={sub.href} onClick={() => setIsSheetOpen(false)} className="block py-2 text-muted-foreground">{sub.label}</Link>)}
                                                                </AccordionContent>
                                                            </AccordionItem>
                                                            <AccordionItem value="giong-nho">
                                                                <AccordionTrigger>Theo giống nho</AccordionTrigger>
                                                                <AccordionContent className="pl-4">
                                                                    {wineMegaMenuData.theoGiongNho.map(sub => <Link key={sub.href} href={sub.href} onClick={() => setIsSheetOpen(false)} className="block py-2 text-muted-foreground">{sub.label}</Link>)}
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
        <div className="bg-secondary text-secondary-foreground border-t border-border hidden lg:block">
            <div className="container flex h-auto min-h-14 items-center justify-center py-2">
                <nav className="flex items-center gap-8 flex-wrap justify-center">
                    {categoryNavLinks.map((link) => <NavLink key={link.href} {...link}/>)}
                </nav>
            </div>
        </div>
      )}
    </header>
  );
}
