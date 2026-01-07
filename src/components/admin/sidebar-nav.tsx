'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Package,
  Settings,
  ShoppingCart,
  Users2,
  LineChart,
  Newspaper,
  Tags,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from '../logo';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

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
        <TooltipProvider>
            {navLinks.map(({ href, icon: Icon, label }) => (
            <Tooltip key={href}>
                <TooltipTrigger asChild>
                <Link
                    href={href}
                    className={cn(
                    'flex h-9 w-full items-center justify-start gap-3 rounded-lg px-3 text-muted-foreground transition-colors hover:text-foreground md:h-8',
                    {
                        'bg-muted text-foreground': pathname.startsWith(href) && href !== '/admin' || pathname === href,
                    }
                    )}
                >
                    <Icon className="h-5 w-5" />
                    <span className="">{label}</span>
                </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{label}</TooltipContent>
            </Tooltip>
            ))}
        </TooltipProvider>
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
         <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                <Link
                    href="/admin/settings"
                    className={cn(
                        'flex h-9 w-full items-center justify-start gap-3 rounded-lg px-3 text-muted-foreground transition-colors hover:text-foreground md:h-8',
                        {
                        'bg-muted text-foreground': pathname.startsWith('/admin/settings'),
                        }
                    )}
                >
                    <Settings className="h-5 w-5" />
                    <span className="">Settings</span>
                </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>
        </TooltipProvider>
      </nav>
    </aside>
  );
}
