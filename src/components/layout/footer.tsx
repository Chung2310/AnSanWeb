import Link from 'next/link';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import Logo from '@/components/logo';
import NewsletterForm from '@/components/newsletter-form';

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto grid max-w-screen-2xl grid-cols-1 gap-8 px-4 py-16 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-1">
          <Logo />
          <p className="mt-4 text-sm text-secondary-foreground/80">
            Khám phá thế giới rượu vang thượng hạng. Chúng tôi tự hào mang đến những chai vang chất lượng từ các vùng đất danh tiếng.
          </p>
          <div className="mt-6 flex space-x-4">
            <Link href="#" className="text-secondary-foreground/80 hover:text-primary">
              <span className="sr-only">Facebook</span>
              <Facebook className="h-6 w-6" />
            </Link>
            <Link href="#" className="text-secondary-foreground/80 hover:text-primary">
              <span className="sr-only">Instagram</span>
              <Instagram className="h-6 w-6" />
            </Link>
            <Link href="#" className="text-secondary-foreground/80 hover:text-primary">
              <span className="sr-only">YouTube</span>
              <Youtube className="h-6 w-6" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 lg:col-span-3 lg:grid-cols-3">
          <div>
            <p className="font-headline font-semibold text-foreground">Sản Phẩm</p>
            <nav className="mt-4 flex flex-col space-y-2 text-sm">
              <Link href="/danh-muc-san-pham/vang-do" className="text-secondary-foreground/80 hover:text-primary">Vang Đỏ</Link>
              <Link href="/danh-muc-san-pham/vang-trang" className="text-secondary-foreground/80 hover:text-primary">Vang Trắng</Link>
              <Link href="/danh-muc-san-pham/vang-sui" className="text-secondary-foreground/80 hover:text-primary">Vang Sủi</Link>
              <Link href="/danh-muc-san-pham/vang-hong" className="text-secondary-foreground/80 hover:text-primary">Vang Hồng</Link>
            </nav>
          </div>

          <div>
            <p className="font-headline font-semibold text-foreground">Về Chúng Tôi</p>
            <nav className="mt-4 flex flex-col space-y-2 text-sm">
              <Link href="/gioi-thieu" className="text-secondary-foreground/80 hover:text-primary">Giới Thiệu</Link>
              <Link href="/tin-tuc" className="text-secondary-foreground/80 hover:text-primary">Tin Tức</Link>
              <Link href="/lien-he" className="text-secondary-foreground/80 hover:text-primary">Liên Hệ</Link>
              <Link href="/chinh-sach" className="text-secondary-foreground/80 hover:text-primary">Chính Sách</Link>
            </nav>
          </div>

          <div>
            <p className="font-headline font-semibold text-foreground">Đăng Ký Nhận Tin</p>
            <p className="mt-4 text-sm text-secondary-foreground/80">Nhận thông tin về sản phẩm mới và các chương trình ưu đãi đặc biệt.</p>
            <NewsletterForm />
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container mx-auto max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-secondary-foreground/60">
            &copy; {new Date().getFullYear()} Rượu Vang Cao Cấp. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
