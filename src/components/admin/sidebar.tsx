'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Package, FileText, LogOut, Tags } from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from '../logo';
import { useAuthStore } from '@/stores/auth-store';

const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/products', label: 'Sản phẩm', icon: Package },
  { href: '/admin/categories', label: 'Content Seo', icon: Tags },
  { href: '/admin/blog', label: 'Bài viết', icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-background text-foreground">
      <div className="flex h-full flex-col">
        <div className="flex h-24 items-center justify-center border-b">
          <Link href="/admin">
            <Logo />
          </Link>
        </div>
        <nav className="flex-1 space-y-2 p-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                  isActive && 'bg-muted text-primary'
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
          >
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </button>
        </div>
      </div>
    </aside>
  );
}