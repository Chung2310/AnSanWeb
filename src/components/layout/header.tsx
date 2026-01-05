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
import { useEffect, useState } from 'react';


const mainNavLinks = [
  { 
    href: '/trac-nghiem-whisky', 
    label: 'Trắc nghiệm Whisky',
  },
  { 
    href: '/ve-chung-toi', 
    label: 'Về chúng tôi',
    sublinks: [
      { href: '/ve-chung-toi/ve-ansan', label: 'Về AnSan' },
      { href: '/ve-chung-toi/ve-nha-sang-lap', label: 'Về nhà sáng lập' },
    ]
  },
  { 
    href: '/kien-thuc-whisky', 
    label: 'Kiến thức Whisky',
    sublinks: [
        { href: '/danh-muc/distilleries', label: 'Distilleries' },
        { href: '/danh-muc/spirits', label: 'Spirits' },
        { href: '/danh-muc/whisky-basics', label: 'Whisky Basics' },
        { href: '/danh-muc/whisky-review', label: 'Whisky Review' },
    ]
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

export default function Header() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const NavLink = ({ href, label, sublinks, className }: { href: string; label: string; sublinks?: {href: string, label: string}[], className?: string }) => {
    if (sublinks) {
      if (!mounted) {
        // Render a placeholder or null on the server and initial client render
        return (
          <Button variant="ghost" className={cn("flex items-center gap-1 text-sm font-medium uppercase p-0 h-auto", className)} disabled>
            {label}
            <ChevronDown className="h-4 w-4" />
          </Button>
        );
      }
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
                    <span>0933.333.313</span>
                </div>
            </div>
        </div>
      </div>
      
      {/* Main Header */}
      <div className="bg-secondary text-secondary-foreground">
        <div className="container flex h-20 max-w-screen-2xl items-center justify-between">
            <div className="relative w-1/4">
                <Input type="text" placeholder="Tìm kiếm sản phẩm" className="bg-transparent border-0 border-b rounded-none border-secondary-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-b-secondary-foreground pl-0 pr-8 placeholder:text-secondary-foreground/80" />
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
