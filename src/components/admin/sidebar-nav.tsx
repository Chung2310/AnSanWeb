'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Package,
  Package2,
  Settings,
  ShoppingCart,
  Users2,
  LineChart,
  Newspaper,
  Tags,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from '../logo';

const navLinks = [
  { href: '/admin', icon: Home, label: 'Dashboard' },
  { href: '/admin/orders', icon: ShoppingCart, label: 'Đơn hàng' },
  { href: '/admin/products', icon: Package, label: 'Sản phẩm' },
  { href: '/admin/categories', icon: Tags, label: 'Danh mục' },
  { href: '/admin/news', icon: Newspaper, label: 'Tin tức' },
  { href: '/admin/users', icon: Users2, label: 'Khách hàng' },
  { href: '/admin/analytics', icon: LineChart, label: 'Phân tích' },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col gap-4 px-4 sm:py-5">
        <Link
          href="/admin"
          className="group mb-4 flex h-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:text-base"
        >
          <Logo className='w-24 h-auto' />
          <span className="sr-only">AnSan</span>
        </Link>
        {navLinks.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
              {
                'bg-muted text-primary': pathname.startsWith(href) && href !== '/admin' || pathname === href,
              }
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
            href="/admin/settings"
            className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                 {
                'bg-muted text-primary': pathname.startsWith('/admin/settings'),
              }
            )}
        >
            <Settings className="h-4 w-4" />
            Settings
        </Link>
      </nav>
    </aside>
  );
}
