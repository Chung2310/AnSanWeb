'use client';

import Link from 'next/link';
import { Search, Clock, Phone, ChevronDown } from 'lucide-react';
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


const mainNavLinks = [
  { 
    href: '/trac-nghiem-whisky', 
    label: 'TRẮC NGHIỆM WHISKY',
  },
  { 
    href: '/ve-chung-toi', 
    label: 'VỀ CHÚNG TÔI',
    sublinks: [
      { href: '/ve-chung-toi/cau-chuyen', label: 'Câu chuyện' },
      { href: '/ve-chung-toi/lien-he', label: 'Liên hệ' },
    ]
  },
  { 
    href: '/kien-thuc-whisky', 
    label: 'KIẾN THỨC WHISKY',
    sublinks: [
      { href: '/kien-thuc-whisky/lich-su', label: 'Lịch sử' },
      { href: '/kien-thuc-whisky/loai-whisky', label: 'Các loại whisky' },
    ]
  },
];

const categoryNavLinks = [
    { 
        href: '/danh-muc/scotch-whisky', 
        label: 'SCOTCH WHISKY',
        sublinks: [
            { href: '/danh-muc/scotch-whisky/single-malt', label: 'Single Malt' },
            { href: '/danh-muc/scotch-whisky/blended', label: 'Blended' },
        ]
    },
    { 
        href: '/danh-muc/world-whisky', 
        label: 'WORLD WHISKY',
        sublinks: [
            { href: '/danh-muc/world-whisky/japanese', label: 'Japanese' },
            { href: '/danh-muc/world-whisky/american', label: 'American' },
        ]
    },
    { href: '/danh-muc/old-rare', label: 'OLD & RARE' },
    { href: '/danh-muc/armagnac', label: 'ARMAGNAC' },
    { href: '/danh-muc/wine', label: 'WINE' },
    { href: '/danh-muc/bo-qua-tang', label: 'BỘ QUÀ TẶNG' },
    { href: '/danh-muc/set-thu-ruou', label: 'SET THỬ RƯỢU' },
    { href: '/danh-muc/khac-ten-len-chai', label: 'KHẮC TÊN LÊN CHAI' },
];

export default function Header() {
  const pathname = usePathname();

  const NavLink = ({ href, label, sublinks, className }: { href: string; label: string; sublinks?: {href: string, label: string}[], className?: string }) => {
    if (sublinks) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className={cn("flex items-center gap-1 text-sm font-medium uppercase p-0 h-auto", className)}>
              {label}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
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
        className={cn(
          'transition-colors text-sm font-medium uppercase',
          pathname === href ? 'text-foreground' : '',
          className
        )}
      >
        {label}
      </Link>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top Bar */}
      <div className="bg-black text-white">
        <div className="container flex h-10 max-w-screen-2xl items-center justify-end">
            <div className="flex items-center gap-6 text-xs font-light">
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>THỨ 2 - CHỦ NHẬT: 9H00 - 22H00</span>
                </div>
                <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>090 929 3636</span>
                </div>
            </div>
        </div>
      </div>
      
      {/* Main Header */}
      <div className="bg-secondary text-secondary-foreground">
        <div className="container flex h-20 max-w-screen-2xl items-center justify-between">
            <div className="relative w-1/4">
                <Input type="text" placeholder="TÌM KIẾM SẢN PHẨM" className="bg-transparent border-0 border-b rounded-none border-secondary-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-b-secondary-foreground pl-0 pr-8 placeholder:text-secondary-foreground/80" />
                <Search className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-foreground/80" />
            </div>

            <div className="absolute left-1/2 -translate-x-1/2">
                <Link href="/">
                    <Logo />
                </Link>
            </div>

            <nav className="flex items-center gap-6">
                {mainNavLinks.map((link) => <NavLink key={link.href} {...link} className="text-header-nav hover:text-header-nav-hover" />)}
            </nav>
        </div>
      </div>

      {/* Category Nav */}
      <div className="bg-secondary text-secondary-foreground border-t border-border">
          <div className="container flex h-14 max-w-screen-2xl items-center justify-center">
              <nav className="flex items-center gap-8">
                  {categoryNavLinks.map((link) => <NavLink key={link.href} {...link} className="text-header-nav hover:text-header-nav-hover"/>)}
              </nav>
          </div>
      </div>
    </header>
  );
}
