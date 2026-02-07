'use client';

import Link from 'next/link';
import Image from 'next/image';

const MapPinIcon = (props: Omit<React.ComponentProps<typeof Image>, 'src' | 'alt'>) => (
    <Image
        src="https://res.cloudinary.com/dxukxjf6w/image/upload/v1770452970/Pngtree_c4d_metal_stereo_positioning_address_4665341_buxsvu.png"
        alt="Tìm cửa hàng"
        width={20}
        height={20}
        {...props}
    />
);

const PercentIcon = (props: Omit<React.ComponentProps<typeof Image>, 'src' | 'alt'>) => (
    <Image
        src="https://res.cloudinary.com/dxukxjf6w/image/upload/v1770453385/Pngtree_physical_gold_bar_cartoon_golden_5417513_gufffb.png"
        alt="Nhận ưu đãi"
        width={20}
        height={20}
        {...props}
    />
);

const GiftIcon = (props: Omit<React.ComponentProps<typeof Image>, 'src' | 'alt'>) => (
    <Image
        src="https://res.cloudinary.com/dxukxjf6w/image/upload/v1770453289/Pngtree_gift_wrapping_4471687_sxulov.png"
        alt="Quà tặng doanh nghiệp"
        width={20}
        height={20}
        {...props}
    />
);


const actions = [
  {
    label: 'TÌM CỬA HÀNG',
    href: '/lien-he#map-section',
    icon: MapPinIcon,
  },
  {
    label: 'NHẬN ƯU ĐÃI',
    href: '/collection/sales-10',
    icon: PercentIcon,
  },
  {
    label: 'QUÀ TẶNG DOANH NGHIỆP',
    href: '/danh-muc/bo-qua-tang',
    icon: GiftIcon,
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
                                className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider hover:opacity-80 transition-opacity"
                            >
                                <action.icon className="h-5 w-5" />
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
