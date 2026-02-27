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

const MobileBottomBar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
      <div className="bg-white shadow-[0_-2px_15px_rgba(0,0,0,0.15)] border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-around items-center h-16">
            {actions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                target={action.href.startsWith('http') ? '_blank' : '_self'}
                rel={action.href.startsWith('http') ? 'noopener noreferrer' : ''}
                className="flex flex-col items-center gap-1 group"
              >
                <div className="relative h-7 w-7 transition-transform group-active:scale-90">
                  <Image 
                    src={action.icon} 
                    alt={action.label} 
                    fill 
                    className="object-contain"
                  />
                </div>
                <span className="text-[10px] font-bold uppercase text-gray-500 group-hover:text-primary">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileBottomBar;
