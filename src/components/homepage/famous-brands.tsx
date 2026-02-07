'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { motion, useInView, useAnimation } from 'framer-motion';

const brandLogos = [
  'brand-chivas-regal',
  'brand-mortlach',
  'brand-royal-salute',
  'brand-singleton',
  'brand-macallan-new',
  'brand-ballantines-new',
  'brand-coli',
  'brand-johnnie-walker',
  'brand-ballantines-finest',
  'brand-unnamed-design',
  'brand-piandimare',
  'brand-cantine-sgarzi-luigi',
  'brand-piandimare-alt',
  'brand-c-and-c',
  'brand-domaine-de-la-baume',
  'brand-barbanera',
  'brand-hechtsheimer-winzer',
  'brand-gcf',
];

const FamousBrands = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const mainControls = useAnimation();

  useEffect(() => {
      if (isInView) {
          mainControls.start("visible");
      }
  }, [isInView, mainControls]);

  return (
    <motion.section 
        ref={ref}
        variants={{
            hidden: { opacity: 0, y: 75 },
            visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration: 1, delay: 0.3 }}
        className="py-16 bg-white">
      <div className="container">
        <h2 className="text-center font-headline text-3xl font-black uppercase" style={{color: '#5a5a5a'}}>
          Những Thương Hiệu Nổi Tiếng
        </h2>
        <div className="relative mt-12 w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
            <div className="flex animate-marquee-slow">
                {[...brandLogos, ...brandLogos].map((logoId, index) => {
                    const logo = PlaceHolderImages.find(img => img.id === logoId);
                    if (!logo || logoId === 'brand-ichiros') return null;
                    return (
                        <div key={`${logoId}-${index}`} className="relative h-24 w-44 flex-shrink-0 mx-8">
                            <Image
                                src={logo.imageUrl}
                                alt={logo.description}
                                fill
                                sizes="20vw"
                                className={cn(
                                    "object-contain",
                                    (logoId === 'brand-lakes' || logoId === 'brand-sgarzi-luigi') && 'mix-blend-multiply'
                                )}
                                data-ai-hint={logo.imageHint}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
      </div>
    </motion.section>
  );
};

export default FamousBrands;
