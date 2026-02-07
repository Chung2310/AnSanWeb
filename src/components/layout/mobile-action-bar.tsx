'use client';

import Link from 'next/link';
import { Home, Phone } from 'lucide-react';
import Image from 'next/image';

const ZaloIcon = (props: Omit<React.ComponentProps<typeof Image>, 'src' | 'alt'>) => (
    <Image
        src="https://res.cloudinary.com/dxukxjf6w/image/upload/v1770451729/Icon_of_Zalo.svg_wifges.png"
        alt="Zalo Icon"
        width={20}
        height={20}
        {...props}
    />
);

const MessengerIcon = (props: Omit<React.ComponentProps<typeof Image>, 'src' | 'alt'>) => (
    <Image
        src="https://res.cloudinary.com/dxukxjf6w/image/upload/v1770451995/messenger-1495274_1280_wdksfs.png"
        alt="Messenger Icon"
        width={20}
        height={20}
        {...props}
    />
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
    icon: MessengerIcon,
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
