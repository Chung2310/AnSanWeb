'use client';

import Link from 'next/link';
import { Button } from '../ui/button';
import { motion, useAnimation, useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
};

const regions = [
  { name: 'SCOTCH WHISKY', href: '/danh-muc/scotch-whisky', prominent: true },
  { name: 'JAPANESE WHISKY', href: '/danh-muc/world-whisky/whisky-nhat', prominent: false },
  { name: 'WORLD WHISKY', href: '/danh-muc/world-whisky', prominent: false },
];

export default function WhiskyRegionShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const mainControls = useAnimation();
  const featuredImage = PlaceHolderImages.find((img) => img.id === 'featured-macallan-25');

  useEffect(() => {
    if (isInView) {
      mainControls.start('visible');
    }
  }, [isInView, mainControls]);

  if (!featuredImage) return null;

  return (
    <section ref={ref} className="relative text-white py-20 bg-background overflow-hidden min-h-[600px] flex items-center">
       <Image
        src={featuredImage.imageUrl}
        alt={featuredImage.description}
        fill
        className="object-cover"
        data-ai-hint={featuredImage.imageHint}
        sizes="100vw"
      />
      {/* <div className="absolute inset-0 bg-black/60" /> */}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={mainControls}
        className="container relative z-10 flex flex-col items-start justify-center text-left"
      >
        <motion.p variants={itemVariants} className="font-semibold tracking-widest uppercase text-sm text-white/80">
          Lựa chọn vùng whisky
        </motion.p>
        <div className="my-6">
          {regions.map((region) => (
            <motion.div key={region.name} variants={itemVariants}>
              <Link
                href={region.href}
                className={`block font-headline font-black uppercase transition-all duration-300 hover:text-white hover:opacity-100 ${
                  region.prominent
                    ? 'text-6xl text-white'
                    : 'text-5xl text-white/60'
                }`}
              >
                {region.name}
              </Link>
            </motion.div>
          ))}
        </div>
        <motion.div variants={itemVariants}>
          <Button
            asChild
            variant="outline"
            className="mt-4 rounded-none border-2 border-white bg-transparent px-8 py-6 text-xs font-bold tracking-widest text-white transition-colors hover:bg-white hover:text-black"
          >
            <Link href="/danh-muc-san-pham">KHÁM PHÁ SẢN PHẨM</Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
