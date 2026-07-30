import dynamic from 'next/dynamic';
import Header from '@/components/layout/header';
import ClientOnlyWidgets from '@/components/layout/client-only-widgets';

// Footer và các component phụ không cần thiết khi tải trang lần đầu
// → dynamic import để tách chunk, giảm JS parse time ban đầu
const Footer = dynamic(() => import('@/components/layout/footer'), { ssr: true });

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ClientOnlyWidgets />
    </div>
  );
}
