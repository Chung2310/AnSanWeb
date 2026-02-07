'use client';

import Link from 'next/link';
import { MapPin, Gift } from 'lucide-react';

const StickyBar = () => {
    const iconColor = "#b99d6b";

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 hidden md:block">
            <div className="bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
                <div className="container mx-auto max-w-screen-xl px-4">
                    <div className="flex justify-around items-center h-14">
                        <Link href="/lien-he#map-section" className="flex items-center gap-3 text-sm font-semibold uppercase text-gray-800 hover:text-primary transition-colors">
                            <MapPin style={{ color: iconColor }} className="h-7 w-7" strokeWidth={1.5}/>
                            <span>TÌM CỬA HÀNG</span>
                        </Link>
                        <div className="h-8 w-px bg-gray-200"></div>
                        <Link href="/collection/gia-tot" className="flex items-center gap-3 text-sm font-semibold uppercase text-gray-800 hover:text-primary transition-colors">
                            <Gift style={{ color: iconColor }} className="h-7 w-7" strokeWidth={1.5}/>
                            <span>NHẬN ƯU ĐÃI</span>
                        </Link>
                        <div className="h-8 w-px bg-gray-200"></div>
                        <Link href="/danh-muc/bo-qua-tang" className="flex items-center gap-3 text-sm font-semibold uppercase text-gray-800 hover:text-primary transition-colors">
                            <Gift style={{ color: iconColor }} className="h-7 w-7" strokeWidth={1.5} />
                            <span>QUÀ TẶNG DOANH NGHIỆP</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StickyBar;
