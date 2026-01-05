import { cn } from '@/lib/utils';

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <svg
        className="h-8 w-auto text-primary"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.58c-1.78-.6-3.15-2.2-3.6-4.22l7.1-2.48c.1.9-.17 1.82-.78 2.53-1.02 1.2-2.73 1.5-3.72 1.17zm6.2-5.05l-7.1 2.48c-.45-2.02.92-3.62 2.7-4.22l3.62-1.28c.95.78 1.45 2.01 1.03 3.3l-.25.72z"
          opacity="0.4"
        />
        <path d="M11 17.58c-1-.33-2.7-.67-3.72-1.17-1.21-.61-1.88-1.63-1.78-2.53L12.6 16.36c.45 2.02-.92 3.62-2.7 4.22h.02c-1.78.6-3.15-2.2-3.6-4.22l7.1-2.48c.1.9-.17 1.82-.78 2.53-1.01 1.2-2.72 1.5-3.72 1.17zM17.2 12.53c-.42-1.29-.92-2.52-1.03-3.3l-3.62 1.28c1.78.6 3.15 2.2 3.6 4.22l7.1-2.48c-.1-.9.17-1.82.78-2.53l.25-.72z" />
      </svg>
      <span className="font-headline text-xl font-bold tracking-tight text-foreground">
        Rượu Vang Cao Cấp
      </span>
    </div>
  );
}
