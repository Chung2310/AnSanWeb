'use client';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('relative', className)} style={{ width: '120px', height: '80px' }}>
      <Image
        src="/logo.png"
        alt="AnSan Logo"
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-contain"
      />
    </div>
  );
}
