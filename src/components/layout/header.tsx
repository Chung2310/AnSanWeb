'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Clock, Phone, ChevronDown, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/logo';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { Input } from '../ui/input';
import { useState, useRef, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from '../ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  wineMegaMenuData,
  spiritsMegaMenuData,
  glasswareMegaMenuData,
  giftSetMegaMenuData,
} from '@/lib/mega-menu-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

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
  customMegaMenu?: 'gift-set';
};

const navLinks: NavLinkData[] = [
  {
    href: '/collection/gia-tot',
    label: 'GIÁ TỐT',
  },
  {
    href: '/danh-muc/ruou-vang',
    label: 'RƯỢU VANG',
    megaMenuColumns: [
      {
        title: 'Theo loại rượu',
        items: wineMegaMenuData.theoLoai.map((item) => ({
          href: `/danh-muc/ruou-vang/${item.slug}`,
          label: item.label,
        })),
      },
      {
        title: 'Theo quốc gia',
        items: wineMegaMenuData.theoQuocGia.map((item) => ({
          href: `/danh-muc/ruou-vang/${item.slug}`,
          label: item.label,
        })),
      },
      {
        title: 'Vùng làm vang',
        items: wineMegaMenuData.theoVung.map((item) => ({
          href: `/danh-muc/ruou-vang/${item.slug}`,
          label: item.label,
        })),
      },
      {
        title: 'Giống nho',
        items: wineMegaMenuData.theoGiongNho.map((item) => ({
          href: `/danh-muc/ruou-vang/${item.slug}`,
          label: item.label,
        })),
      },
    ],
  },
  {
    href: '/danh-muc/ruou-manh',
    label: 'RƯỢU MẠNH',
    megaMenuColumns: [
      {
        title: 'Loại Rượu',
        items: spiritsMegaMenuData.theoLoai.map((item) => ({
          href: `/danh-muc/ruou-manh/${item.slug}`,
          label: item.label,
        })),
      },
      {
        title: 'Thương hiệu',
        items: spiritsMegaMenuData.thuongHieu.map((item) => ({
          href: `/danh-muc/ruou-manh/${item.slug}`,
          label: item.label,
        })),
      },
    ],
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
        items: glasswareMegaMenuData.lyPhaLeRiedel.map((item) => ({
          href: `/danh-muc/ly-coc-pha-le/${item.slug}`,
          label: item.label,
        })),
      },
      {
        title: 'LY WHISKY',
        items: glasswareMegaMenuData.lyWhisky.map((item) => ({
          href: `/danh-muc/ly-coc-pha-le/${item.slug}`,
          label: item.label,
        })),
      },
      {
        title: 'KHÁC',
        items: glasswareMegaMenuData.khac.map((item) => ({
          href: `/danh-muc/ly-coc-pha-le/${item.slug}`,
          label: item.label,
        })),
      },
    ],
  },
  {
    href: '/danh-muc/bo-qua-tang',
    label: 'BỘ QUÀ TẶNG',
    customMegaMenu: 'gift-set',
  },
  {
    href: '/gioi-thieu',
    label: 'GIỚI THIỆU',
  },
  {
    href: '/tin-tuc',
    label: 'KIẾN THỨC',
  },
];

const MegaMenu = ({
  columns,
  isOpen,
  onMouseEnter,
  onMouseLeave,
  onLinkClick,
  customMegaMenu,
}: {
  columns?: MenuColumn[];
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onLinkClick: () => void;
  customMegaMenu?: string;
}) => {
  const [showAllGrapes, setShowAllGrapes] = useState(false);
  const [showAllRegions, setShowAllRegions] = useState(false);

  if (customMegaMenu === 'gift-set') {
    const giftItems = giftSetMegaMenuData.quaTang;

    return (
      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={cn(
          'absolute top-full left-0 right-0 bg-popover text-popover-foreground border-t shadow-lg',
          !isOpen && 'hidden'
        )}
      >
        <div className="container mx-auto max-w-screen-2xl p-8">
          <div className="grid grid-cols-3 gap-8">
            {giftItems.map((item: any) => {
              const image = PlaceHolderImages.find(
                (img) => img.id === item.imageId
              );
              return (
                <Link
                  key={item.slug}
                  href={`/danh-muc/bo-qua-tang/${item.slug}`}
                  onClick={onLinkClick}
                  className="group block text-center"
                >
                  <div className="overflow-hidden rounded-lg">
                    {image && (
                      <Image
                        src={image.imageUrl}
                        alt={item.label}
                        width={400}
                        height={300}
                        className="w-full object-cover aspect-[4/3] transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <h3 className="mt-4 font-headline text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                    {item.label}
                  </h3>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (!columns || columns.length === 0) return null;

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        'absolute top-full left-0 right-0 bg-popover text-popover-foreground border-t shadow-lg',
        !isOpen && 'hidden'
      )}
    >
      <div className="container mx-auto max-w-screen-2xl p-8">
        <div
          className={cn('grid gap-x-8')}
          style={{
            gridTemplateColumns: `repeat(${
              columns.length > 5 ? 5 : columns.length
            }, minmax(0, 1fr))`,
          }}
        >
          {columns.map((column, index) => {
            const isGiongNhoColumn = column.title === 'Giống nho';
            const isVungColumn = column.title === 'Vùng làm vang';
            
            const grapesLimit = 10;
            const vungLimit = 10;
            
            let itemsToShow = column.items;
            let hasMoreItems = false;
            let isExpanded = false;
            let toggleFn = () => {};
            let labelText = '';

            if (isGiongNhoColumn) {
              hasMoreItems = column.items.length > grapesLimit;
              isExpanded = showAllGrapes;
              itemsToShow = !isExpanded ? column.items.slice(0, grapesLimit) : column.items;
              labelText = isExpanded ? 'Thu gọn <<' : 'Xem tất cả giống nho >>';
              toggleFn = () => setShowAllGrapes(prev => !prev);
            } else if (isVungColumn) {
              hasMoreItems = column.items.length > vungLimit;
              isExpanded = showAllRegions;
              itemsToShow = !isExpanded ? column.items.slice(0, vungLimit) : column.items;
              labelText = isExpanded ? 'Thu gọn <<' : 'Xem tất cả vùng vang >>';
              toggleFn = () => setShowAllRegions(prev => !prev);
            }

            return (
              <div
                key={column.title || index}
                className={cn(index > 0 && column.title && 'pl-8 border-l')}
              >
                {column.title && (
                  <h3 className="font-semibold text-sm text-muted-foreground mb-4 tracking-wider uppercase">
                    {column.title}
                  </h3>
                )}
                <ul className="space-y-3">
                  {itemsToShow.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="font-medium text-foreground hover:text-primary transition-colors"
                        onClick={onLinkClick}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                  {hasMoreItems && (
                     <li>
                        <button
                          onClick={toggleFn}
                          className="font-medium text-primary hover:text-primary/80 transition-colors text-left w-full"
                        >
                          {labelText}
                        </button>
                      </li>
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const NavLink = (props: NavLinkData) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { href, label, megaMenuColumns, customMegaMenu } = props;

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  const hasDropdown = (!!megaMenuColumns && megaMenuColumns.length > 0) || !!customMegaMenu;
  const isMenuOpen = isOpen && hasDropdown;
  const isCurrentPage =
    pathname === href || (href !== '/' && pathname.startsWith(href));
  const isGiaTot = label === 'GIÁ TỐT';

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
          !isMenuOpen && 'hover:text-primary-foreground',
          isGiaTot && 'font-bold text-chart-4 animate-flash'
        )}
      >
        {isGiaTot && (
          <Image
            src="https://res.cloudinary.com/dqhgnzmtk/image/upload/v1770563238/flash-sale_xnwrp0.png"
            alt="Giá Tốt"
            width={28}
            height={28}
            className="mr-2"
          />
        )}
        {label}
        {hasDropdown && <ChevronDown className="h-4 w-4 ml-1" />}
      </Link>

      {hasDropdown && isMounted && (
        <MegaMenu
          columns={megaMenuColumns}
          isOpen={isMenuOpen}
          onMouseEnter={handleOpenMenu}
          onMouseLeave={handleCloseMenu}
          onLinkClick={handleImmediateClose}
          customMegaMenu={customMegaMenu}
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
    <header
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="bg-black text-white">
        <div className="container flex h-10 max-w-screen-2xl items-center justify-between px-4">
          <div className="lg:hidden"></div>
          <div className="flex items-center gap-6 text-xs font-light ml-auto">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>T2 - CN: 9H - 22H</span>
            </div>
            <a href="tel:0933333313" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Phone className="h-4 w-4" />
              <span>0933.333.313</span>
            </a>
          </div>
        </div>
      </div>

      <div className="bg-secondary text-secondary-foreground">
        <div className="container flex h-24 max-w-screen-2xl items-center justify-between px-4">
          <div className="flex-1 flex justify-start">
            <form
              onSubmit={handleSearch}
              className="relative w-full max-w-xs hidden lg:block"
            >
              <Input
                type="text"
                placeholder="Tìm kiếm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-0 border-b rounded-none border-secondary-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-b-secondary-foreground pl-0 pr-8 placeholder:text-secondary-foreground/80"
              />
              <Button
                type="submit"
                variant="ghost"
                className="absolute right-0 top-1/2 -translate-y-1/2 h-auto p-2 hover:bg-transparent"
              >
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
                <SheetContent
                  side="right"
                  className="w-full max-w-[400px] bg-white p-0 flex flex-col"
                >
                  <SheetHeader className="sr-only">
                    <SheetTitle>Main Menu</SheetTitle>
                    <SheetDescription>
                      Main navigation links for the website.
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="p-6 pb-2">
                    <Link href="/" onClick={() => setIsSheetOpen(false)}>
                      <Logo />
                    </Link>
                  </div>

                  <div className="flex-1 overflow-y-auto px-6 pb-10">
                    <form
                      onSubmit={handleSearch}
                      className="relative w-full mb-6"
                    >
                      <Input
                        type="text"
                        placeholder="Tìm kiếm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-gray-100 border-gray-300 focus:ring-primary focus:border-primary"
                      />
                      <Button
                        type="submit"
                        variant="ghost"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 h-auto p-2 hover:bg-transparent"
                      >
                        <Search className="h-5 w-5 text-gray-500" />
                      </Button>
                    </form>

                    <Accordion type="multiple" className="w-full">
                      {navLinks.map((link) => {
                        const hasSubItems = !!link.megaMenuColumns || !!link.customMegaMenu;
                        const isGiaTot = link.label === 'GIÁ TỐT';

                        if (hasSubItems) {
                          return (
                            <AccordionItem value={link.label} key={link.label}>
                              <AccordionTrigger className="hover:no-underline py-0 pr-2">
                                <span className={cn(
                                  "flex-1 py-4 font-semibold uppercase text-gray-800 text-left flex items-center",
                                  isGiaTot && "text-chart-4 animate-flash"
                                )}>
                                  {isGiaTot && (
                                    <Image
                                      src="https://res.cloudinary.com/dqhgnzmtk/image/upload/v1770563238/flash-sale_xnwrp0.png"
                                      alt="Giá Tốt"
                                      width={24}
                                      height={24}
                                      className="mr-2"
                                    />
                                  )}
                                  {link.label}
                                </span>
                              </AccordionTrigger>
                              <AccordionContent className="pl-4 pb-0">
                                {link.href && (
                                  <Link
                                    href={link.href}
                                    onClick={() => setIsSheetOpen(false)}
                                    className="block py-3 font-bold uppercase text-gray-700 border-b"
                                  >
                                    Tất cả {link.label}
                                  </Link>
                                )}
                                
                                {link.customMegaMenu === 'gift-set' ? (
                                  <div className="space-y-1 py-2">
                                    {giftSetMegaMenuData.quaTang.map((item: any) => (
                                      <Link
                                        key={item.slug}
                                        href={`/danh-muc/bo-qua-tang/${item.slug}`}
                                        onClick={() => setIsSheetOpen(false)}
                                        className="block py-2.5 text-muted-foreground hover:text-primary font-medium"
                                      >
                                        {item.label}
                                      </Link>
                                    ))}
                                  </div>
                                ) : (
                                  <Accordion type="multiple" className="w-full">
                                    {link.megaMenuColumns?.map((column) => {
                                      if (column.items.length === 0) return null;
                                      return (
                                        <AccordionItem
                                          value={column.title}
                                          key={column.title}
                                          className="border-none"
                                        >
                                          <AccordionTrigger className="font-semibold uppercase text-gray-600 py-3 text-sm">
                                            {column.title}
                                          </AccordionTrigger>
                                          <AccordionContent className="pl-4 space-y-1">
                                            {column.items.map((item) => (
                                              <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setIsSheetOpen(false)}
                                                className="block py-2 text-muted-foreground hover:text-primary"
                                              >
                                                {item.label}
                                              </Link>
                                            ))}
                                          </AccordionContent>
                                        </AccordionItem>
                                      );
                                    })}
                                  </Accordion>
                                )}
                              </AccordionContent>
                            </AccordionItem>
                          );
                        }

                        return (
                          <div className="border-b" key={link.label}>
                            <Link
                              href={link.href}
                              onClick={() => setIsSheetOpen(false)}
                              className={cn(
                                "flex items-center py-4 font-semibold uppercase text-gray-800",
                                isGiaTot && "text-chart-4 animate-flash"
                              )}
                            >
                              {isGiaTot && (
                                <Image
                                  src="https://res.cloudinary.com/dqhgnzmtk/image/upload/v1770563238/flash-sale_xnwrp0.png"
                                  alt="Giá Tốt"
                                  width={24}
                                  height={24}
                                  className="mr-2"
                                />
                              )}
                              {link.label}
                            </Link>
                          </div>
                        );
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
          {navLinks.map((link) => (
            <NavLink key={link.label} {...link} />
          ))}
        </div>
      </nav>
    </header>
  );
}
