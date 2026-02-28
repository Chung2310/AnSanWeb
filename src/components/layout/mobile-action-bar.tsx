'use client';

import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

const actions = [
  {
    label: 'Trang chủ',
    href: '/',
    icon: 'https://res.cloudinary.com/dxukxjf6w/image/upload/v1772187927/icon-home_cq4oyj.png',
  },
  {
    label: 'Hotline',
    href: 'tel:0933333313',
    icon: 'https://res.cloudinary.com/dxukxjf6w/image/upload/v1772187927/icon_call_zaywdv.png',
  },
  {
    label: 'Zalo',
    href: 'https://id.zalo.me/account/login?continue=http%3A%2F%2Fzalo.me%2F0933333313',
    icon: 'https://res.cloudinary.com/dxukxjf6w/image/upload/v1772187927/icon_zalo_cnmcjs.png',
  },
  {
    label: 'Messenger',
    href: 'https://www.facebook.com/people/R%C6%B0%E1%BB%A3u-Vang-An-San/100075802071016/',
    icon: 'https://res.cloudinary.com/dxukxjf6w/image/upload/v1772187927/icon_messenger_ooliw3.png',
  },
];

export default function MobileActionBar() {
  return (
    <div className="fixed right-6 top-[60%] -translate-y-1/2 z-[51] hidden lg:block">
      <div className="flex flex-col bg-primary rounded-lg overflow-hidden shadow-2xl border border-white/10">
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            target={action.href.startsWith('http') ? '_blank' : '_self'}
            rel={action.href.startsWith('http') ? 'noopener noreferrer' : ''}
            className="flex flex-col items-center justify-center p-1 text-white/90 hover:bg-white/10 transition-colors border-t border-white/10 first:border-t-0 group"
            style={{ width: '55px', height: '55px' }}
          >
            <div className="relative h-5 w-5 transition-transform duration-300 group-hover:scale-110">
              <Image 
                src={action.icon} 
                alt={action.label} 
                fill 
                className="object-contain"
              />
            </div>
            <span className="text-[8px] font-bold uppercase mt-1 text-center text-white/70 group-hover:text-white leading-tight">
              {action.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}