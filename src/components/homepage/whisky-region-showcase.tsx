'use client';

import Link from 'next/link';
import { Button } from '../ui/button';
import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';

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
  { name: 'VANG ĐỎ CHUẨN GU', href: '/danh-muc/ruou-vang/ruou-vang-do', prominent: true, imageId: 'featured-macallan-25' },
  { name: 'LY PHA LÊ ĐẲNG CẤP', href: '/danh-muc/ly-coc-pha-le', prominent: false, imageId: 'banner-japanese-whisky' },
  { name: 'VANG NHẸ - THƯỞNG THỨC BAN ĐẦU', href: '/danh-muc/ruou-vang/ruou-vang-trang', prominent: false, imageId: 'banner-world-whisky' },
];

const getImage = (id: string): ImagePlaceholder | undefined => {
  return PlaceHolderImages.find((img) => img.id === id);
};

export default function WhiskyRegionShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const mainControls = useAnimation();
  
  const defaultRegion = regions[0];
  const [activeImage, setActiveImage] = useState<ImagePlaceholder | undefined>(getImage(defaultRegion.imageId));
  const [selectedRegion, setSelectedRegion] = useState(defaultRegion.name);
  const [activeLink, setActiveLink] = useState(defaultRegion.href);

  useEffect(() => {
    if (isInView) {
      mainControls.start('visible');
    }
  }, [isInView, mainControls]);
  
  const handleClick = (imageId: string, regionName: string, href: string) => {
    const image = getImage(imageId);
    if (image) {
      setActiveImage(image);
      setSelectedRegion(regionName);
      setActiveLink(href);
    }
  };

  if (!defaultRegion) return null;

  return (
    <section ref={ref} className="relative text-white py-20 bg-background overflow-hidden min-h-[600px] flex items-center">
      <AnimatePresence>
        <motion.div
          key={activeImage?.id || 'default'}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1, transition: { duration: 0.7, ease: 'easeOut' } }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeIn' } }}
        >
          {activeImage && (
            <Image
              src={activeImage.imageUrl}
              alt={activeImage.description}
              fill
              className="object-cover"
              data-ai-hint={activeImage.imageHint}
              sizes="100vw"
              priority
            />
          )}
        </motion.div>
      </AnimatePresence>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={mainControls}
        className="container relative z-10 flex h-full flex-col items-start justify-center text-left"
      >
        <motion.p variants={itemVariants} className="font-semibold tracking-widest uppercase text-sm text-white/90 text-shadow-sm">
          GIÁ TỐT SIÊU ƯU ĐÃI
        </motion.p>
        <div className="my-6">
          {regions.map((region) => (
            <motion.div 
              key={region.name} 
              variants={itemVariants}
              onClick={() => handleClick(region.imageId, region.name, region.href)}
              className={`block font-headline font-black uppercase transition-all duration-300 cursor-pointer hover:text-white hover:opacity-100 text-shadow ${
                  selectedRegion === region.name
                    ? 'text-5xl text-white'
                    : 'text-4xl text-white/60'
                }`}
            >
              {region.name}
            </motion.div>
          ))}
        </div>
        <motion.div variants={itemVariants}>
          <Button
            asChild
            variant="outline"
            className="mt-4 rounded-none border-2 border-white bg-transparent px-8 py-6 text-xs font-bold tracking-widest text-white transition-colors hover:bg-white hover:text-black"
          >
            <Link href={activeLink}>KHÁM PHÁ SẢN PHẨM</Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
