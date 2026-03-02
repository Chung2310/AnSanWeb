import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  metadataBase: new URL('https://ruouvangansan.vn'),
  title: {
    default: 'World Class Whisky & Spirit | AnSan',
    template: '%s | AnSan',
  },
  description: 'Trải qua hành trình 10 năm học, hiểu và “ngắm” Whisky, chúng tôi tin rằng đây không chỉ là một thứ đồ uống thông thường. Nơi đây chứa đựng lịch sử, là kiến thức, nghệ thuật và đôi khi là trải nghiệm cảm xúc cá nhân sâu sắc.',
  keywords: ['rượu vang', 'whisky', 'rượu mạnh', 'cigar', 'quà tặng tết', 'ansan', 'rượu vang nhập khẩu'],
  authors: [{ name: 'AnSan' }],
  openGraph: {
    title: 'World Class Whisky & Spirit | AnSan',
    description: 'Trải qua hành trình 10 năm học, hiểu và “ngắm” Whisky, chúng tôi tin rằng đây không chỉ là một thứ đồ uống thông thường.',
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
    title: 'World Class Whisky & Spirit | AnSan',
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
