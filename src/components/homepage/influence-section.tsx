'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import Link from 'next/link';
import { motion, useInView, useAnimation, animate } from 'framer-motion';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';


const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 8.15c-1.33 0-2.4 1.07-2.4 2.4v5.3c0 1.33-1.07 2.4-2.4 2.4H8.15c-1.33 0-2.4-1.07-2.4-2.4V8.15c0-1.33-1.07 2.4-2.4 2.4H3" />
        <path d="M12 18.25V3" />
        <path d="M12 3a4 4 0 1 1 4 4" />
    </svg>
);

const AnimatedNumber = ({ to }: { to: number }) => {
    const ref = useRef<HTMLParagraphElement>(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (!isInView) return;
        const node = ref.current;
        if (!node) return;

        const controls = animate(0, to, {
            duration: 2.5,
            ease: "easeOut",
            onUpdate(value) {
                node.textContent = new Intl.NumberFormat('vi-VN').format(Math.round(value));
            }
        });

        return () => controls.stop();
    }, [to, isInView]);

    return <p ref={ref} className="text-5xl font-black" style={{ color: '#8a7d6a' }} >0</p>;
};

const carouselImages = [
  '/images/2.webp',
  '/images/3.webp',
  '/images/4.webp',
];

export default function InfluenceSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });
    const mainControls = useAnimation();
    const plugin = React.useRef(Autoplay({ delay: 5000, stopOnInteraction: false }));

    useEffect(() => {
        if (isInView) {
            mainControls.start("visible");
        }
    }, [isInView, mainControls]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1, 
            transition: { staggerChildren: 0.5, delayChildren: 0.5 } 
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 75 },
        visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: "easeOut" } },
    };


  return (
    <motion.section 
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={mainControls}
        className="py-20" style={{ backgroundColor: '#fdfaf5' }}>
      <div className="container mx-auto max-w-screen-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column */}
          <motion.div variants={itemVariants} className="text-center lg:text-left">
            <p className="font-semibold tracking-widest uppercase text-sm" style={{ color: '#8a7d6a' }}>AnSan's INFLUENCE</p>
            <h2 className="mt-2 text-4xl lg:text-5xl font-black leading-tight" style={{ color: '#3a3a3a' }}>
              SỨC ẢNH HƯỞNG VÀ LAN TỎA CỦA  AN SAN
            </h2>
            <motion.div variants={itemVariants} className="mt-8">
               <Carousel
                  plugins={[plugin.current]}
                  className="w-full"
                  opts={{
                    loop: true,
                  }}
                >
                  <CarouselContent>
                    {carouselImages.map((src, index) => (
                      <CarouselItem key={index}>
                        <div className="relative h-[400px] w-full aspect-w-4 aspect-h-3">
                           <Image
                            src={src}
                            alt={`Influence image ${index + 1}`}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="w-full h-full object-cover rounded-lg shadow-lg"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
            </motion.div>
          </motion.div>
          {/* Right Column */}
          <motion.div 
            variants={containerVariants}
            className="flex flex-col justify-center text-gray-700 relative"
          >
            <motion.p variants={itemVariants} className="text-base leading-relaxed">
              AnSan đang là một trong những kênh truyền thông về Whisky & Rượu Mạnh uy tín hàng đầu trên rất nhiều nền tảng mạng xã hội. Qua những bài viết, hình ảnh, video chia sẻ kiến thức, đánh giá và những trải nghiệm cá nhân, tôi đã và đang truyền cảm hứng, xây dựng và phát triển cộng đồng thưởng thức giàu văn hóa hơn.
            </motion.p>
            <motion.div variants={itemVariants} className="mt-12">
              <h3 className="font-bold text-lg tracking-wider uppercase text-gray-800">
                ĐÁNH DẤU SỰ PHÁT TRIỂN MẠNH MẼ TRÊN<br/>FACEBOOK, INSTAGRAM, TIKTOK & YOUTUBE
              </h3>
              <div className="flex space-x-3 mt-4">
                <Link href="#" className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-md hover:opacity-80 transition-opacity">
                    <Facebook className="h-5 w-5" />
                </Link>
                 <Link href="#" className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-md hover:opacity-80 transition-opacity">
                    <Instagram className="h-5 w-5" />
                </Link>
                 <Link href="#" className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-md hover:opacity-80 transition-opacity">
                    <TikTokIcon className="h-5 w-5" />
                </Link>
                 <Link href="#" className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-md hover:opacity-80 transition-opacity">
                    <Youtube className="h-5 w-5" />
                </Link>
              </div>
            </motion.div>
            <motion.div variants={containerVariants} className="mt-10 grid grid-cols-2 gap-8">
              <motion.div variants={itemVariants}>
                <AnimatedNumber to={110000} />
                <p className="mt-2 text-sm font-semibold tracking-wider text-gray-600">LƯỢT THEO DÕI</p>
              </motion.div>
              <motion.div variants={itemVariants}>
                <AnimatedNumber to={18000000} />
                <p className="mt-2 text-sm font-semibold tracking-wider text-gray-600">LƯỢT XEM</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
