'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, LogOut, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Logo from '../logo';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';


const links = [
    { href: '/admin', label: 'Bảng điều khiển' },
    { href: '/admin/products', label: 'Sản phẩm' },
    { href: '/admin/blog', label: 'Bài viết' },
    { href: '/admin/contacts', label: 'Tin nhắn' },
    { href: '/admin/newsletters', label: 'Bản tin' },
];

export default function AdminHeader() {
  const pathname = usePathname();
  const auth = useAuth();
  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: 'Đăng xuất thành công',
      });
      router.push('/login');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Lỗi đăng xuất',
        description: 'Đã có lỗi xảy ra. Vui lòng thử lại.',
      });
    }
  };
  
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold mb-4"
            >
              <Logo />
              <span className="sr-only">AnSan</span>
            </Link>
            {links.map((link) => (
               <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                      "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
                      pathname === link.href && "bg-muted text-foreground"
                  )}
                >
                  {link.label}
                </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      <div className="w-full flex-1" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={user?.photoURL || "https://picsum.photos/seed/admin-avatar/100/100"}
                alt="Admin"
              />
              <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || 'A'}</AvatarFallback>
            </Avatar>
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{user?.email || 'Tài khoản của tôi'}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>
            <User className="mr-2 h-4 w-4" />
            Hồ sơ
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Đăng xuất
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
