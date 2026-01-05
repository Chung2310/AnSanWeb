'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const heroImage = PlaceHolderImages.find(img => img.id === 'hero-main')!;
const productBadges = [
    { label: 'MACALLAN 84', href: '#' },
    { label: '10% OFF', href: '#' },
    { label: 'ARMAGNAC', href: '#' },
    { label: 'SMWS', href: '#' },
    { label: 'WINE', href: '#' },
    { label: 'LAKES MỚI', href: '#' },
];

export default function HeroSection() {
  return (
    <div className="relative w-full text-white">
      <div className="relative h-[600px] w-full">
        {/* Background Image */}
        <div className="absolute inset-0 w-1/2 right-0">
             <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                priority
                className="object-cover object-center"
                data-ai-hint={heroImage.imageHint}
            />
             <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent" />
        </div>
       
        {/* Content Section */}
        <div className="relative h-full flex flex-col">
            <div className="container flex-1 flex items-center max-w-screen-2xl">
                <div className="w-1/2 bg-primary h-full flex flex-col justify-center items-start p-8">
                    <div className="max-w-md">
                        <p className="text-sm font-semibold tracking-widest uppercase">MACALLAN 84</p>
                        <h1 className="mt-2 text-5xl font-black leading-none tracking-tight uppercase">
                        CHAI WHISKY GIÀ NHẤT THẾ GIỚI ĐÃ CÓ MẶT TẠI DANGTAU WHISKY
                        </h1>
                        <p className="mt-6 text-sm font-light text-white/80">
                        Hãy chờ đón video bật mí siêu phẩm này trên youtube của chúng tôi nhé!
                        </p>
                        <Button asChild variant="outline" className="mt-8 bg-transparent border-white text-white hover:bg-white hover:text-primary rounded-none px-10 py-6">
                            <Link href="#">XEM NGAY</Link>
                        </Button>
                    </div>
                </div>
            </div>

             {/* Product Badges Bar */}
            <div className="w-full bg-primary py-4">
                 <div className="container max-w-screen-2xl">
                     <div className="flex items-center">
                         {productBadges.map((badge, index) => (
                             <React.Fragment key={badge.label}>
                                <Button variant="outline" className="bg-transparent text-white border-white rounded-none px-4 py-2 text-base font-semibold hover:bg-white hover:text-primary">
                                    <Link href={badge.href}>{badge.label}</Link>
                                </Button>
                                {index < productBadges.length - 1 && (
                                <div className="flex-grow h-px bg-white/50 mx-2 w-16"></div>
                                )}
                            </React.Fragment>
                         ))}
                     </div>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
}
