'use client';

import Link from 'next/link';
import { MapPin, BadgePercent, Gift } from 'lucide-react';


const actions = [
  {
    label: 'TÌM CỬA HÀNG',
    href: '/lien-he#map-section',
    icon: MapPin,
  },
  {
    label: 'NHẬN ƯU ĐÃI',
    href: '/collection/gia-tot',
    icon: BadgePercent,
  },
  {
    label: 'QUÀ TẶNG DOANH NGHIỆP',
    href: '/danh-muc/bo-qua-tang',
    icon: Gift,
  },
];

const StickyBar = () => {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 hidden lg:block">
            <div className="bg-primary text-primary-foreground shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
                <div className="container mx-auto max-w-screen-xl px-4">
                    <div className="flex justify-around items-center h-14">
                        {actions.map((action) => (
                            <Link
                                key={action.label}
                                href={action.href}
                                className="flex items-center gap-3 text-sm font-bold uppercase tracking-wider hover:opacity-80 transition-opacity"
                            >
                                <action.icon className="h-6 w-6" />
                                <span>{action.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StickyBar;