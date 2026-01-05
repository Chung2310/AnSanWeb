import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('relative', className)} style={{ width: '150px', height: '100px' }}>
      <Image
        src="/logo.png"
        alt="AnSan Logo"
        layout="fill"
        objectFit="contain"
      />
    </div>
  );
}
