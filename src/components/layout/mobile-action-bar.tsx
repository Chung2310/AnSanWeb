'use client';

import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import { Home, Phone, MessageCircle } from 'lucide-react';

const ZaloIcon = (props: { className?: string }) => (
    <Image src="https://res.cloudinary.com/dxukxjf6w/image/upload/v1770454912/icons8-zalo-50_qgmbxj.png" alt="Zalo" width={28} height={28} className={props.className} />
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
    icon: MessageCircle,
  },
];

export default function MobileActionBar() {
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[51] hidden lg:block">
      <div className="flex flex-col bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200">
        {actions.map((action, index) => (
          <Link
            key={action.label}
            href={action.href}
            target={action.href.startsWith('http') ? '_blank' : '_self'}
            rel={action.href.startsWith('http') ? 'noopener noreferrer' : ''}
            className="flex flex-col items-center justify-center p-3 text-gray-700 hover:bg-gray-100 transition-colors border-t border-gray-200 first:border-t-0"
            style={{width: '80px', height: '80px'}}
          >
            <action.icon className="h-7 w-7" />
            <span className="text-xs font-medium mt-1 text-center">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
