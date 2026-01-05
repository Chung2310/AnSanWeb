import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'World Class Whisky & Spirit | AnSan',
  description: 'Trải qua hành trình 10 năm học, hiểu và “ngấm” Whisky, chúng tôi tin rằng đây không chỉ là một thứ đồ uống thông thường. Nơi đây chứa đựng lịch sử, là kiến thức, nghệ thuật và đôi khi là trải nghiệm của cả một đời người.',
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
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
        <link href="https://cdn.jsdelivr.net/gh/hung1001/font-awesome-pro@4cac1a6/css/all.css" rel="stylesheet" type="text/css" />
        <style dangerouslySetInnerHTML={{ __html: `
          @font-face {
            font-family: 'SaaSeriesVN';
            src: url('/fonts/SaaSeriesVN-Regular.woff2') format('woff2'),
                 url('/fonts/SaaSeriesVN-Regular.woff') format('woff');
            font-weight: normal;
            font-style: normal;
          }
          @font-face {
            font-family: 'SaaSeriesVN';
            src: url('/fonts/SaaSeriesVN-Bold.woff2') format('woff2'),
                 url('/fonts/SaaSeriesVN-Bold.woff') format('woff');
            font-weight: bold;
            font-style: normal;
          }
        `}} />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body text-foreground antialiased'
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
