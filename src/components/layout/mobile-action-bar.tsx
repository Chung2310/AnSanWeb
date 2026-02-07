'use client';

import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

const actions = [
  {
    label: 'Trang chủ',
    href: '/',
    icon: 'https://res.cloudinary.com/dxukxjf6w/image/upload/v1770455034/icons8-home-48_edka5r.png',
  },
  {
    label: 'Hotline',
    href: 'tel:0933333313',
    icon: 'https://res.cloudinary.com/dxukxjf6w/image/upload/v1770459880/phone-1_kmvtwq.png',
  },
  {
    label: 'Zalo',
    href: 'https://id.zalo.me/account/login?continue=http%3A%2F%2Fzalo.me%2F0933333313',
    icon: 'https://res.cloudinary.com/dxukxjf6w/image/upload/v1770454912/icons8-zalo-50_qgmbxj.png',
  },
  {
    label: 'Messenger',
    href: 'https://www.facebook.com/people/R%C6%B0%E1%BB%A3u-Vang-An-San/100075802071016/',
    icon: 'https://res.cloudinary.com/dxukxjf6w/image/upload/v1770455033/icons8-message-50_kyenco.png',
  },
];

export default function MobileActionBar() {
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:block">
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
            <Image src={action.icon} alt={`${action.label} Icon`} width={28} height={28} className="h-7 w-7" />
            <span className="text-xs font-medium mt-1 text-center">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
