'use client';

import Link from 'next/link';
import { Search, Clock, Phone, ChevronDown, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/logo';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from '../ui/input';
import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';


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
    label: 'Kiến thức',
  },
];

const categoryNavLinks = [
    { 
        href: '/danh-muc/scotch-whisky', 
        label: 'Scotch Whisky',
        sublinks: [
            { href: '/danh-muc/scotch-whisky/whisky-campbeltown', label: 'Whisky Campbeltown' },
            { href: '/danh-muc/scotch-whisky/whisky-highland', label: 'Whisky Highland' },
            { href: '/danh-muc/scotch-whisky/whisky-islay', label: 'Whisky Islay' },
            { href: '/danh-muc/scotch-whisky/whisky-lowland', label: 'Whisky Lowland' },
            { href: '/danh-muc/scotch-whisky/whisky-speyside', label: 'Whisky Speyside' },
            { href: '/danh-muc/scotch-whisky/whisky-islands', label: 'Whisky Islands' },
        ]
    },
    { 
        href: '/danh-muc/world-whisky', 
        label: 'World Whisky',
        sublinks: [
            { href: '/danh-muc/world-whisky/whisky-ireland', label: 'Whiskey Ireland' },
            { href: '/danh-muc/world-whisky/whisky-nhat', label: 'Whisky Nhật' },
            { href: '/danh-muc/world-whisky/whisky-the-lakes', label: 'Whisky The Lakes' },
            { href: '/danh-muc/world-whisky/whisky-khac', label: 'Bourbon Whiskey' },
        ]
    },
    { href: '/danh-muc/old-rare', label: 'Old & Rare' },
    { href: '/danh-muc/armagnac', label: 'Armagnac' },
    { href: '/danh-muc/wine', label: 'Wine' },
    { href: '/danh-muc/bo-qua-tang', label: 'Bộ quà tặng' },
    { href: '/danh-muc/set-thu-ruou', label: 'Set thử rượu' },
    { href: '/danh-muc/khac-ten-len-chai', label: 'Khắc Tên Lên Chai' },
];

const NavLink = ({ href, label, sublinks, className }: { href: string; label: string; sublinks?: {href: string, label: string}[], className?: string }) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = pathname.startsWith(href);

  const linkClasses = cn(
    'transition-colors text-sm font-medium uppercase',
    isActive ? 'text-foreground' : 'text-header-nav hover:text-header-nav-hover',
    className
  );

  if (sublinks) {
    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <div 
            onMouseEnter={() => setOpen(true)} 
            onMouseLeave={() => setOpen(false)}
            className={cn("flex items-center gap-1 p-0 h-auto cursor-pointer", linkClasses)}
          >
            <span>{label}</span>
            <ChevronDown className="h-4 w-4" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          onMouseEnter={() => setOpen(true)} 
          onMouseLeave={() => setOpen(false)}
          className="bg-white"
        >
          {sublinks.map(link => (
            <DropdownMenuItem key={link.href} asChild>
              <Link href={link.href}>{link.label}</Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
  return (
    <Link
      href={href}
      className={linkClasses}
    >
      {label}
    </Link>
  )
}


export default function Header() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

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
        <div className="container flex h-20 max-w-screen-2xl items-center justify-between px-4">
            <div className="relative w-1/3 lg:w-1/4">
                <Input type="text" placeholder="Tìm kiếm" className="bg-transparent border-0 border-b rounded-none border-secondary-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-b-secondary-foreground pl-0 pr-8 placeholder:text-secondary-foreground/80" />
                <Search className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-foreground/80" />
            </div>

            <div className="absolute left-1/2 -translate-x-1/2">
                <Link href="/">
                    <Logo />
                </Link>
            </div>

            <nav className="hidden lg:flex items-center gap-6">
                {mainNavLinks.map((link) => <NavLink key={link.href} {...link} />)}
            </nav>

            <div className="lg:hidden">
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full bg-white p-6">
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
        </div>
      </div>

      {/* Category Nav */}
      <div className="bg-secondary text-secondary-foreground border-t border-border hidden lg:block">
          <div className="container flex h-14 max-w-screen-2xl items-center justify-center">
              <nav className="flex items-center gap-8">
                  {categoryNavLinks.map((link) => <NavLink key={link.href} {...link}/>)}
              </nav>
          </div>
      </div>
    </header>
  );
}
