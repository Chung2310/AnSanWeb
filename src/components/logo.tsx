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
        className="object-contain"
      />
    </div>
  );
}
