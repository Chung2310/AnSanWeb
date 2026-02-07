'use client';

import Link from 'next/link';
import Image from 'next/image';

const ZaloIcon = (props: Omit<React.ComponentProps<typeof Image>, 'src' | 'alt'>) => (
    <Image
        src="https://res.cloudinary.com/dxukxjf6w/image/upload/v1770454912/icons8-zalo-50_qgmbxj.png"
        alt="Zalo Icon"
        width={28}
        height={28}
        {...props}
    />
);

const MessengerIcon = (props: Omit<React.ComponentProps<typeof Image>, 'src' | 'alt'>) => (
    <Image
        src="https://res.cloudinary.com/dxukxjf6w/image/upload/v1770455033/icons8-message-50_kyenco.png"
        alt="Messenger Icon"
        width={28}
        height={28}
        {...props}
    />
);

const HomeIcon = (props: Omit<React.ComponentProps<typeof Image>, 'src' | 'alt'>) => (
    <Image
        src="https://res.cloudinary.com/dxukxjf6w/image/upload/v1770455034/icons8-home-48_edka5r.png"
        alt="Home Icon"
        width={28}
        height={28}
        {...props}
    />
);

const HotlineIcon = (props: Omit<React.ComponentProps<typeof Image>, 'src' | 'alt'>) => (
    <Image
        src="https://res.cloudinary.com/dxukxjf6w/image/upload/v1770459880/phone-1_kmvtwq.png"
        alt="Hotline Icon"
        width={28}
        height={28}
        {...props}
    />
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
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 hidden lg:block">
      <div className="flex flex-col bg-primary rounded-lg overflow-hidden shadow-lg">
        {actions.map((action, index) => (
          <Link
            key={action.label}
            href={action.href}
            target={action.href.startsWith('http') ? '_blank' : '_self'}
            rel={action.href.startsWith('http') ? 'noopener noreferrer' : ''}
            className="flex flex-col items-center justify-center p-2 text-primary-foreground hover:bg-primary/90 transition-colors border-t border-primary-foreground/20 first:border-t-0"
            style={{width: '70px', height: '70px'}}
          >
            <action.icon className="h-7 w-7" />
            <span className="text-xs font-medium mt-1">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
