'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Mail,
  Settings,
  LifeBuoy,
  Package,
  MessageSquare,
  Newspaper,
  Home,
  Users,
  FileText,
} from 'lucide-react';
import Logo from '@/components/logo';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

const links = [
  { href: '/admin', label: 'Bảng điều khiển', icon: Home },
  { href: '/admin/products', label: 'Sản phẩm', icon: Package },
  { href: '/admin/product-details', label: 'Chi tiết Sản phẩm', icon: FileText },
  { href: '/admin/blog', label: 'Bài viết', icon: Newspaper },
  { href: '/admin/contacts', label: 'Tin nhắn', icon: MessageSquare },
  { href: '/admin/newsletters', label: 'Bản tin', icon: Mail },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Logo />
            <span className="">AnSan</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                  pathname.startsWith(link.href) && 'bg-muted text-primary'
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Card x-chunk="dashboard-02-chunk-0">
            <CardHeader className="p-2 pt-0 md:p-4">
              <CardTitle>Cần Hỗ Trợ?</CardTitle>
              <CardDescription>
                Liên hệ với chúng tôi để được giải đáp các thắc mắc.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
              <Button size="sm" className="w-full">
                <LifeBuoy className="mr-2 h-4 w-4" />
                Hỗ trợ
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
