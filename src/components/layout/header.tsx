'use client';

import Link from 'next/link';
import { Search, Clock, Phone, ChevronDown, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/logo';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { Input } from '../ui/input';
import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '../ui/sheet';
import { useHydration } from '@/hooks/use-hydration';


const mainNavLinks = [
  { 
    href: '/trac-nghiem-whisky', 
    label: 'Trắc nghiệm Whisky',
  },
  { 
    href: '/gioi-thieu', 
    label: 'Về chúng tôi',
    sublinks: [
        { href: '/gioi-thieu', label: 'Về AnSan' },
        { href: '/gioi-thieu/nha-sang-lap', label: 'Về nhà sáng lập' },
    ]
  },
  {
    href: '/tin-tuc',
    label: 'Tin Tức',
  },
];

const categoryNavLinks = [
    {
        href: '/danh-muc/ruou-vang',
        label: 'RƯỢU VANG',
        sublinks: [
            { href: '/danh-muc/ruou-vang/vang-y', label: 'Vang Ý' },
            { href: '/danh-muc/ruou-vang/vang-phap', label: 'Vang Pháp' },
            { href: '/danh-muc/ruou-vang/vang-tay-ban-nha', label: 'Vang Tây Ban Nha' },
            { href: '/danh-muc/ruou-vang/vang-uc', label: 'Vang Úc' },
            { href: '/danh-muc/ruou-vang/vang-nga', label: 'Vang Nga' },
            { href: '/danh-muc/ruou-vang/vang-duc', label: 'Vang Đức' },
        ],
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
    { href: '/danh-muc/bo-qua-tang', label: 'BỘ QUÀ TẶNG' },
    { href: '/danh-muc/khac-ten-len-chai', label: 'KHẮC TÊN LÊN CHAI' },
];

const NavLink = ({ href, label, sublinks, className }: { href: string; label: string; sublinks?: {href: string, label: string, sublinks?: {href: string, label: string}[]}[] | undefined, className?: string }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const isActive = pathname.startsWith(href);

  const linkClasses = cn(
    'transition-colors text-sm font-medium uppercase flex items-center',
    isActive ? 'text-foreground' : 'text-header-nav hover:text-header-nav-hover',
    className
  );

  if (sublinks) {
    return (
      <div 
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="relative"
      >
        <Link href={href} className={linkClasses}>
          {label}
          <ChevronDown className="h-4 w-4 ml-1" />
        </Link>
        {isOpen && (
           <div className="absolute top-full left-0 mt-0 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
             <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
               {sublinks.map((link) => (
                  <div key={link.href} className="relative group">
                     <Link 
                       href={link.href} 
                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
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
    <Link href={href} className={linkClasses}>
      {label}
    </Link>
  );
};


export default function Header() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const isHydrated = useHydration();

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
                <div className="relative w-full max-w-xs">
                    <Input type="text" placeholder="Tìm kiếm" className="bg-transparent border-0 border-b rounded-none border-secondary-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-b-secondary-foreground pl-0 pr-8 placeholder:text-secondary-foreground/80" />
                    <Search className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-foreground/80" />
                </div>
            </div>

            <div className="flex-1 flex justify-center">
                <Link href="/">
                    <Logo />
                </Link>
            </div>
            
            {isHydrated && (
              <>
                <nav className="hidden lg:flex flex-1 justify-end items-center gap-6">
                    {mainNavLinks.map((link) => <NavLink key={link.href} {...link} />)}
                </nav>

                <div className="lg:hidden flex-1 flex justify-end">
                  <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Menu className="h-6 w-6" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-full bg-white p-6">
                      <SheetHeader className="sr-only">
                        <SheetTitle>Main Menu</SheetTitle>
                        <SheetDescription>Main navigation links for the website.</SheetDescription>
                      </SheetHeader>
                      <div className="flex flex-col space-y-6">
                        <Link href="/" onClick={() => setIsSheetOpen(false)}><Logo /></Link>
                        <nav className="flex flex-col space-y-4">
                          {mainNavLinks.map(link => (
                            <Link key={link.href} href={link.href} onClick={() => setIsSheetOpen(false)} className="text-lg font-medium uppercase">{link.label}</Link>
                          ))}
                        </nav>
                        <div className="border-t pt-4">
                          <h3 className="font-bold uppercase mb-4">Danh mục</h3>
                           <nav className="flex flex-col space-y-3">
                            {categoryNavLinks.map(link => (
                               <Link key={link.href} href={link.href} onClick={() => setIsSheetOpen(false)} className="text-md uppercase">{link.label}</Link>
                            ))}
                          </nav>
                        </div>
                      </div>
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
