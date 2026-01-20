import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';
import TetGiftPopup from '@/components/homepage/tet-gift-popup';

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
      <TetGiftPopup />
    </div>
  );
}
