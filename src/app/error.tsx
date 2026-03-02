'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <h1 className="font-headline text-4xl font-bold text-primary">Đã có lỗi xảy ra</h1>
      <p className="mt-4 text-lg text-muted-foreground max-w-md mx-auto">
        Chúng tôi xin lỗi vì sự cố này. Hệ thống đã ghi nhận lỗi và sẽ sớm được khắc phục.
      </p>
      <div className="mt-10 flex items-center justify-center gap-4">
        <Button onClick={() => reset()} size="lg">Thử lại</Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/">Về trang chủ</Link>
        </Button>
      </div>
    </div>
  );
}