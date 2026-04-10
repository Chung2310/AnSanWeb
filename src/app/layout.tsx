import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  metadataBase: new URL('https://ruouvangansan.vn'),
  title: {
    default: 'AnSan Wine & Spirit | World Class Whisky & Spirit',
    template: '%s | AnSan',
  },
  description: 'Trải qua hành trình 10 năm học, hiểu và “ngắm” Whisky, chúng tôi tin rằng đây không chỉ là một thứ đồ uống thông thường. Nơi đây chứa đựng lịch sử, là kiến thức, nghệ thuật và đôi khi là trải nghiệm cảm xúc cá nhân sâu sắc.',
  keywords: ['rượu vang', 'whisky', 'rượu mạnh', 'cigar', 'quà tặng tết', 'ansan', 'rượu vang nhập khẩu'],
  authors: [{ name: 'AnSan' }],
  openGraph: {
    title: 'AnSan Wine & Spirit | World Class Whisky & Spirit',
    description: 'Đơn vị phân phối rượu vang và rượu mạnh uy tín hàng đầu Việt Nam. Nơi đây chứa đựng lịch sử, kiến thức và nghệ thuật thưởng thức.',
    url: 'https://ruouvangansan.vn',
    siteName: 'AnSan Wine & Spirit',
    images: [
      {
        url: 'https://res.cloudinary.com/dvncucl8n/image/upload/q_auto/f_auto/v1775805153/logo_3_vnvogx.webp',
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
    title: 'AnSan Wine & Spirit | World Class Whisky & Spirit',
    description: 'Đơn vị phân phối rượu vang và rượu mạnh uy tín hàng đầu Việt Nam.',
    images: ['https://res.cloudinary.com/dvncucl8n/image/upload/q_auto/f_auto/v1775805153/logo_3_vnvogx.webp'],
  },
  icons: {
    icon: 'https://res.cloudinary.com/dvncucl8n/image/upload/q_auto/f_auto/v1775805153/logo_3_vnvogx.webp',
    apple: 'https://res.cloudinary.com/dvncucl8n/image/upload/q_auto/f_auto/v1775805153/logo_3_vnvogx.webp',
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
