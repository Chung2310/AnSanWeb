'use client';

import Link from 'next/link';
import { Home, Phone, MessageSquare } from 'lucide-react';

const ZaloIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g clipPath="url(#clip0_303_2)">
        <path d="M2.57142 10.4C2.57142 5.2 5.2 2.57142 10.4 2.57142H13.6C18.8 2.57142 21.4286 5.2 21.4286 10.4V13.6C21.4286 18.8 18.8 21.4286 13.6 21.4286H10.4C5.2 21.4286 2.57142 18.8 2.57142 13.6V10.4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8.72142 12.3143C8.72142 11.0857 9.8 10.0286 11.2 10.0286H12.8C13.56 10.0286 14.1857 10.6543 14.1857 11.4143V11.4143C14.1857 12.1743 13.56 12.8 12.8 12.8H10.0571V14.1429H12.8C14.2 14.1429 15.2571 13.0857 15.2571 11.7143V11.4143C15.2571 10.0286 14.2 8.72142 12.8 8.72142H11.2C9.8 8.72142 8.72142 9.77856 8.72142 11.1428" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip0_303_2">
          <rect width="24" height="24" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );

const actions = [
  {
    label: 'Trang chủ',
    href: '/',
    icon: Home,
  },
  {
    label: 'Hotline',
    href: 'tel:0933333313',
    icon: Phone,
  },
  {
    label: 'Zalo',
    href: 'https://id.zalo.me/account/login?continue=http%3A%2F%2Fzalo.me%2F0933333313',
    icon: ZaloIcon,
  },
  {
    label: 'Messenger',
    href: 'https://www.facebook.com/people/R%C6%B0%E1%BB%A3u-Vang-An-San/100075802071016/',
    icon: MessageSquare,
  },
];

export default function MobileActionBar() {
  return (
    <div className="fixed right-4 bottom-4 z-50 hidden lg:block">
      <div className="flex flex-col bg-primary rounded-lg overflow-hidden shadow-lg">
        {actions.map((action, index) => (
          <Link
            key={action.label}
            href={action.href}
            target={action.href.startsWith('http') ? '_blank' : '_self'}
            rel={action.href.startsWith('http') ? 'noopener noreferrer' : ''}
            className="flex flex-col items-center justify-center p-2 text-primary-foreground hover:bg-primary/90 transition-colors border-t border-primary-foreground/20 first:border-t-0"
            style={{width: '60px', height: '60px'}}
          >
            <action.icon className="h-5 w-5" />
            <span className="text-xs font-medium mt-1">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
