'use client';

import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';
import { motion, useInView, useAnimation } from 'framer-motion';
import { useRef, useEffect } from 'react';

interface GiftSetCardProps {
  imageId: string;
  title: string;
  href: string;
}

const giftCards: GiftSetCardProps[] = [
  {
    imageId: 'gift-set-tet',
    title: 'BỘ QUÀ TẾT 2026',
    href: '/danh-muc/bo-qua-tang',
  },
  {
    imageId: 'cigar-gift-set',
    title: 'CIGAR',
    href: '/danh-muc/cigar',
  },
];

const getImage = (id: string): ImagePlaceholder | undefined => {
  return PlaceHolderImages.find((img) => img.id === id);
};

function GiftCard({ card }: { card: GiftSetCardProps }) {
  const image = getImage(card.imageId);
  if (!image) return null;

  return (
    <div className="group flex h-full flex-col overflow-hidden bg-white text-black shadow-lg transition-shadow duration-300 hover:shadow-2xl">
      <Link href={card.href} className="block">
        <div className="relative aspect-video bg-gray-50">
          <Image
            src={image.imageUrl}
            alt={card.title}
            fill
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            data-ai-hint={image.imageHint}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </Link>
      <div className="flex flex-grow flex-col p-6 text-center">
        <h3 className="font-headline text-2xl font-black uppercase text-gray-800">
          {card.title}
        </h3>
        <div className="flex-grow" />
        <Button
          asChild
          variant="outline"
          className="mt-6 w-fit self-center rounded-none border-2 border-black bg-transparent px-8 py-3 text-xs font-bold uppercase tracking-widest text-black transition-colors hover:bg-black hover:text-white"
        >
          <Link href={card.href}>Khám Phá Sản Phẩm</Link>
        </Button>
      </div>
    </div>
  );
}


export default function GiftSetsSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });
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
            transition: { staggerChildren: 0.4 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 1.2 } }
    };

  return (
    <motion.section
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={mainControls}
        className="py-20" style={{backgroundColor: '#fdfaf5'}}>
      <div className="container mx-auto max-w-screen-xl">
        <motion.div variants={itemVariants} className="text-left mb-12">
          <h2 className="mt-2 font-headline text-4xl font-black uppercase" style={{ color: '#5a5a5a' }}>
            Quà Tết Ansan & Cigar
          </h2>
        </motion.div>
        <motion.div variants={containerVariants} className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {giftCards.map((card) => (
            <motion.div key={card.imageId} variants={itemVariants}>
              <GiftCard card={card} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
