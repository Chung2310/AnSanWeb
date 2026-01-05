'use client';

import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';
import { motion, useInView, useAnimation } from 'framer-motion';
import { useRef, useEffect } from 'react';

export default function EngravingSection() {
  const image = PlaceHolderImages.find((img) => img.id === 'engraving-banner');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView, mainControls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.2, delayChildren: 0.2 } 
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (!image) return null;

  return (
    <section ref={ref} className="relative h-[350px] w-full text-white">
      <Image
        src={image.imageUrl}
        alt={image.description}
        fill
        className="object-cover"
        data-ai-hint={image.imageHint}
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/40" />
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate={mainControls}
        className="relative z-10 flex h-full flex-col items-center justify-center text-center">
        <motion.p variants={itemVariants} className="font-semibold tracking-widest uppercase text-sm">
          PERSONALISED ENGRAVING
        </motion.p>
        <motion.h2 variants={itemVariants} className="mt-2 font-headline text-4xl font-black uppercase">
          KHẮC CHAI CÁ NHÂN HÓA
        </motion.h2>
        <motion.div variants={itemVariants}>
          <Button
            asChild
            variant="outline"
            className="mt-6 rounded-none border-2 border-white bg-transparent px-8 py-5 text-xs font-bold tracking-widest text-white transition-colors hover:bg-white hover:text-black"
          >
            <Link href="/danh-muc/khac-ten-len-chai">KHÁM PHÁ NGAY</Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
