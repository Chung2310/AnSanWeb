'use client';

import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';
import { motion, useInView, useAnimation } from 'framer-motion';
import { useRef, useEffect } from 'react';

interface GiftSetCardProps {
  imageId: string;
  subtitle: string;
  title: string;
  href: string;
}

const giftCards: GiftSetCardProps[] = [
  {
    imageId: 'lakes-tasting-set',
    subtitle: '',
    title: 'Quà Tết',
    href: '/danh-muc/bo-qua-tang',
  },
  {
    imageId: 'lakes-gift-set',
    subtitle: 'GIFT SET',
    title: 'BỘ QUÀ TẶNG WHISKY TẾT 2025',
    href: '/danh-muc/bo-qua-tang',
  },
];

const getImage = (id: string): ImagePlaceholder | undefined => {
  return PlaceHolderImages.find((img) => img.id === id);
};

function GiftCard({ card }: { card: GiftSetCardProps }) {
  const image = getImage(card.imageId);
  if (!image) return null;

  return (
    <Link href={card.href} className="group relative block aspect-[4/3] overflow-hidden text-white rounded-lg">
        <Image
          src={image.imageUrl}
          alt={card.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          data-ai-hint={image.imageHint}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-8">
            {card.subtitle && <p className="text-xs font-bold uppercase tracking-widest text-white/90">{card.subtitle}</p>}
            <h3 className="mt-2 font-headline text-3xl font-black uppercase">
                {card.title}
            </h3>
            <Button
              asChild
              variant="outline"
              className="mt-6 w-fit rounded-none border-2 border-white bg-transparent px-8 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-black"
            >
              <span>Khám Phá Sản Phẩm</span>
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
