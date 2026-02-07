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

const MobileBottomBar = () => {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
            <div className="bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] border-t">
                <div className="container mx-auto max-w-screen-xl px-4">
                    <div className="flex justify-around items-center h-16">
                        {actions.map((action) => (
                            <Link
                                key={action.label}
                                href={action.href}
                                target={action.href.startsWith('http') ? '_blank' : '_self'}
                                rel={action.href.startsWith('http') ? 'noopener noreferrer' : ''}
                                className="flex flex-col items-center gap-1 text-xs text-gray-600 hover:text-primary transition-colors"
                            >
                                <action.icon className="h-7 w-7" />
                                <span>{action.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileBottomBar;
