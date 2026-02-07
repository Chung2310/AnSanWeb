'use client';

import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
);

const HotlineIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);

const MessengerIcon = (props: React.SVGProps<SVGSVGElement>) => (
     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
);


const actions = [
  {
    label: 'Trang chủ',
    href: '/',
    icon: HomeIcon,
  },
  {
    label: 'Hotline',
    href: 'tel:0933333313',
    icon: HotlineIcon,
  },
  {
    label: 'Zalo',
    href: 'https://id.zalo.me/account/login?continue=http%3A%2F%2Fzalo.me%2F0933333313',
    icon: "https://res.cloudinary.com/dxukxjf6w/image/upload/v1770454912/icons8-zalo-50_qgmbxj.png",
  },
  {
    label: 'Messenger',
    href: 'https://www.facebook.com/people/R%C6%B0%E1%BB%A3u-Vang-An-San/100075802071016/',
    icon: MessengerIcon,
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
                                {typeof action.icon === 'string' ? 
                                    <Image src={action.icon} alt={action.label} width={28} height={28} className="h-7 w-7" /> :
                                    <action.icon className="h-7 w-7" />
                                }
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
