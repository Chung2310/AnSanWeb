
'use client';

import Link from 'next/link';
import Logo from '@/components/logo';
import { motion, useInView, useAnimation } from 'framer-motion';
import { useEffect, useRef } from 'react';

const containerVariants = {
    hidden: { opacity: 0, y: 75 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, delay: 0.2 } },
};

export default function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const mainControls = useAnimation();

  useEffect(() => {
      if (isInView) {
          mainControls.start("visible");
      }
  }, [isInView, mainControls]);

  return (
    <motion.footer 
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={mainControls}
      className="bg-[#f7f7f7] text-black">
      <div className="container mx-auto max-w-screen-xl px-4 py-12 text-center">
        <div className="flex justify-center">
          <Logo />
        </div>
        
        <div className="mt-8 text-sm text-black/80 space-y-2">
            <p className="font-headline text-lg font-bold">Rượu Vang An San</p>
            <p>
                <Link href="https://zalo.me/0933333313" target="_blank" rel="noopener noreferrer" className="hover:underline">
                    Người đại diện: Phạm Đăng Thành
                </Link>
            </p>
            <p>
                <Link href="https://www.google.com/maps/search/?api=1&query=R%C6%B0%E1%BB%A3u+Vang+An+San" target="_blank" rel="noopener noreferrer" className="hover:underline">
                    Địa chỉ: Công Viên Quy Chế - P. Đông Ngàn - TP Từ Sơn
                </Link>
            </p>
            <p>
                <Link href="tel:0933333313" className="hover:underline">
                    Hotline: 093 333 33 13
                </Link>
            </p>
            <p>Email: ruouvangansan@gmail.com</p>
        </div>

        <div className="mt-8 text-xs text-black/60 max-w-4xl mx-auto">
          <p>
            CHẤP HÀNH NGHỊ ĐỊNH SỐ 105/2017/NĐ-CP CỦA CHÍNH PHỦ VỀ KINH DOANH RƯỢU VÀ CÁC QUY ĐỊNH VỀ QUẢN LÝ THƯƠNG MẠI ĐIỆN TỬ, AnSan KHÔNG KINH DOANH QUA MẠNG INTERNET CÁC LOẠI RƯỢU, BIA, ĐỒ UỐNG CÓ CỒN VÀ KHÔNG BÁN SẢN PHẨM CHỨA CỒN CHO NGƯỜI DƯỚI 18 TUỔI. WEBSITE CHỈ MANG TÍNH THAM KHẢO VÀ CUNG CẤP THÔNG TIN VỀ SẢN PHẨM.
          </p>
        </div>
      </div>

      <div className="border-t border-black/10">
        <div className="container mx-auto max-w-screen-xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <p className="text-center text-xs text-black/60">
              2026 &copy; AnSan. ALL RIGHTS RESERVED.
            </p>

            <div className="mt-4 flex justify-center text-xs text-black/60 sm:mt-0 sm:justify-start">
               {/* Placeholder for "Powered by" logo if available as component/SVG */}
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
