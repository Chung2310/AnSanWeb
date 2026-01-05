import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Dang Tau Whisky',
  description: 'Khám phá thế giới whisky hảo hạng.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark" style={{ colorScheme: 'dark' }} suppressHydrationWarning>
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
