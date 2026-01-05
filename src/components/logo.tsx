import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('relative', className)} style={{ width: '200px', height: '40px' }}>
      <Image
        src="/logo.png"
        alt="AnSan Logo"
        layout="fill"
        objectFit="contain"
      />
    </div>
  );
}
