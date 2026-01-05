import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center', className)}>
      <Image 
        src="/logo.png" 
        alt="Dang Tau Whisky Logo" 
        width={200} 
        height={40}
        className="object-contain"
      />
    </div>
  );
}
