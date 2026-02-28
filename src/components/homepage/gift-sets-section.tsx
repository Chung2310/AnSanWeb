'use client';

import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView, useAnimation } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { Button } from '../ui/button';

interface GiftSetCardProps {
  imageId: string;
  subtitle: string;
  title: string;
  href: string;
}

const giftCards: GiftSetCardProps[] = [
  {
    imageId: 'gift-set-tet',
    subtitle: '',
    title: 'Quà Tết',
    href: '/danh-muc/bo-qua-tang',
  },
  {
    imageId: 'cigar-gift-set',
    subtitle: '',
    title: 'Cigar',
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
    <Link href={card.href} className="group relative block aspect-[16/9] overflow-hidden rounded-lg">
      <Image
        src={image.imageUrl}
        alt={card.title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        data-ai-hint={image.imageHint}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />
      <div className="absolute inset-0 p-8 flex flex-col justify-between items-start text-white">
        <div>
          {card.subtitle && card.subtitle.length > 0 && <p className="text-sm font-semibold uppercase tracking-widest text-white/80 text-shadow">{card.subtitle}</p>}
          <h3 className="mt-2 font-headline text-3xl font-bold uppercase text-shadow">{card.title}</h3>
        </div>
        <Button
            variant="outline"
            className="bg-transparent border-white text-white rounded-sm px-6 py-3 transition-colors text-xs font-bold tracking-widest hover:bg-white hover:text-black"
        >
            KHÁM PHÁ SẢN PHẨM
        </Button>
      </div>
    </Link>
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
        <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="font-headline text-3xl font-black uppercase" style={{color: '#5a5a5a'}}>
                Quà Tết An San & Cigar
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
