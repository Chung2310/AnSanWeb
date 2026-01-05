import { cn } from '@/lib/utils';

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center', className)}>
      <svg
        width="200"
        height="40"
        viewBox="0 0 200 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="object-contain"
        aria-label="AnSan Logo"
      >
        <text
          x="100"
          y="28"
          fontFamily="DangTau, sans-serif"
          fontSize="30"
          fill="currentColor"
          textAnchor="middle"
        >
          AnSan
        </text>
      </svg>
    </div>
  );
}
