import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: {
    default: 'AnSan Wine & Spirit | Rượu Vang & Rượu Mạnh Nhập Khẩu Chính Hãng',
    template: '%s | AnSan Wine & Spirit',
  },
  description: 'AnSan Wine & Spirit - Đơn vị nhập khẩu và phân phối rượu vang, rượu mạnh, whisky chính hãng hàng đầu. Cam kết chất lượng, giá tốt nhất, giao hàng nhanh chóng.',
  keywords: ['rượu vang', 'whisky', 'rượu mạnh', 'cigar', 'quà tặng tết', 'ansan', 'rượu vang nhập khẩu'],
  authors: [{ name: 'AnSan' }],
  openGraph: {
    title: 'AnSan Wine & Spirit | Rượu Vang & Rượu Mạnh Nhập Khẩu Chính Hãng',
    description: 'Khám phá bộ sưu tập rượu vang và rượu mạnh đẳng cấp tại AnSan. Cam kết hàng chính hãng, tư vấn chuyên sâu.',
    url: 'https://ruouvangansan.vn',
    siteName: 'AnSan Wine & Spirit',
    images: [
      {
        url: 'https://res.cloudinary.com/dxukxjf6w/image/upload/v1770450627/Banner_5_ef3phq.png',
        width: 1200,
        height: 630,
        alt: 'AnSan Wine & Spirit',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AnSan Wine & Spirit | Rượu Vang & Rượu Mạnh Nhập Khẩu Chính Hãng',
    description: 'Đơn vị phân phối rượu vang và rượu mạnh uy tín hàng đầu Việt Nam.',
    images: ['https://res.cloudinary.com/dxukxjf6w/image/upload/v1770450627/Banner_5_ef3phq.png'],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Montserrat:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body text-base text-foreground antialiased pb-20 lg:pb-0'
        )}
      >
        <FirebaseClientProvider>
          {children}
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
