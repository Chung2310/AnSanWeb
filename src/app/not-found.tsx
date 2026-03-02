import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex flex-1 items-center justify-center py-20">
        <div className="container text-center">
          <h1 className="font-headline text-9xl font-black text-primary/20">404</h1>
          <h2 className="mt-4 font-headline text-4xl font-bold uppercase text-foreground">Không tìm thấy trang</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/">Quay về trang chủ</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/danh-muc-san-pham">Xem sản phẩm</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}