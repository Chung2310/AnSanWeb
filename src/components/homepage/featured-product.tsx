'use client';

import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Button } from '../ui/button';
import Link from 'next/link';
import { motion, useInView, useAnimation } from 'framer-motion';
import { useEffect, useRef } from 'react';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.3,
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};


export default function FeaturedProduct() {
  const featuredImage = PlaceHolderImages.find((img) => img.id === 'featured-macallan-25');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView, mainControls]);

  if (!featuredImage) return null;

  return (
    <section ref={ref} className="relative py-20 text-white bg-background overflow-hidden min-h-[600px] flex items-center">
      <Image
        src={featuredImage.imageUrl}
        alt={featuredImage.description}
        fill
        className="object-cover"
        data-ai-hint={featuredImage.imageHint}
        sizes="100vw"
      />
      
      <div className="container mx-auto max-w-screen-xl relative z-10">
        <motion.div
            className="text-left md:w-1/2"
            variants={containerVariants}
            initial="hidden"
            animate={mainControls}
        >
          <motion.p variants={itemVariants} className="font-semibold tracking-widest uppercase text-sm text-white/80">
            PHIÊN BẢN GIỚI HẠN
          </motion.p>
          <motion.h2 variants={itemVariants} className="mt-4 font-headline text-4xl lg:text-5xl font-bold leading-tight uppercase">
            The Macallan 25 <br/> Sherry Oak
          </motion.h2>
          <motion.p variants={itemVariants} className="mt-6 text-white/90 max-w-lg">
            Một loại single malt whisky quý hiếm và sang trọng, được ủ trong những thùng gỗ sồi Sherry Oloroso chọn lọc từ Jerez, Tây Ban Nha. The Macallan 25 Years Old mang đến hương vị đậm đà của cam quýt, trái cây khô và khói gỗ.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Button asChild variant="outline" size="lg" className="mt-10 bg-transparent border-white text-white hover:bg-white hover:text-black rounded-none px-10 py-6 transition-all hover:scale-105">
              <Link href="/san-pham/the-macallan-25-sherry-oak">KHÁM PHÁ NGAY</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
