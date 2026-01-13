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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-stretch">
          {/* Left Column */}
          <motion.div variants={itemVariants} className="text-center lg:text-left">
            <p className="font-semibold tracking-widest uppercase text-sm" style={{ color: '#8a7d6a' }}>AnSan's INFLUENCE</p>
            <h2 className="mt-2 text-4xl lg:text-5xl font-black leading-tight" style={{ color: '#3a3a3a' }}>
              SỨC ẢNH HƯỞNG VÀ LAN TỎA CỦA  AN SAN
            </h2>
            <motion.div variants={itemVariants} className="mt-8 h-[400px]">
               <Carousel
                  plugins={[plugin.current]}
                  className="w-full h-full"
                  opts={{
                    loop: true,
                  }}
                >
                  <CarouselContent className="h-full">
                    {carouselImages.map((src, index) => (
                      <CarouselItem key={index} className="h-full">
                        <div className="relative h-full w-full">
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
            <motion.div variants={itemVariants} className="text-base leading-relaxed space-y-4">
              <p className="font-bold">VÌ SAO NÊN CHỌN AN SAN</p>
              <p>An San cam kết “Vang thật – Giá trị thật”. Chúng tôi tuyển chọn rượu vang nhập khẩu chính hãng, nguồn gốc rõ ràng, đến từ các quốc gia danh tiếng như Pháp, Ý, Tây Ban Nha, Úc, Đức…, đầy đủ hoá đơn VAT, được bảo quản và trưng bày theo tiêu chuẩn quốc tế với giá bán cạnh tranh.</p>
              <p>Khách hàng được thưởng thức rượu miễn phí trước khi mua, đảm bảo lựa chọn đúng gu và đúng giá trị.</p>
              <p>Dịch vụ tại An San được xây dựng trên sự chuyên nghiệp – tận tâm – am hiểu, với đội ngũ tư vấn giàu kiến thức, hỗ trợ 24/7, giao hàng nhanh chóng</p>
              <p>Đến An San không chỉ để mua rượu vang, mà để trải nghiệm trọn vẹn nghệ thuật thưởng vang.</p>
            </motion.div>
            
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
