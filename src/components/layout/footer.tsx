'use client';

import Link from 'next/link';
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
      className="bg-white text-black border-t">
        <div className="container mx-auto max-w-screen-2xl px-4 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-sm">
                
                {/* Col 1: Business Info */}
                <div className="space-y-4">
                    <h3 className="font-bold uppercase tracking-wider text-base">HỘ KINH DOANH NGÔ QUANG HÙNG</h3>
                    <div className="space-y-2 text-gray-700">
                        <p><span className='font-semibold'>Người đại diện:</span> Ngô Quang Hùng</p>
                        <p><span className='font-semibold'>Địa chỉ:</span> Vườn Hoa, Ngõ Quy Chế, TX. Từ Sơn, Bắc Ninh</p>
                        <p><span className='font-semibold'>Hotline:</span> 0933.333.313</p>
                        <p><span className='font-semibold'>Email:</span> ruouvangansan@gmail.com</p>
                    </div>
                </div>

                {/* Col 2: Wine Categories */}
                <div className="space-y-4">
                    <h3 className="font-bold uppercase tracking-wider text-base">DANH MỤC RƯỢU</h3>
                    <div className="flex gap-12">
                        <div className="space-y-2">
                            <h4 className="font-semibold text-gray-800">Quốc gia</h4>
                            <Link href="/danh-muc/ruou-vang/vang-tay-ban-nha" className="block text-gray-700 hover:text-primary">Tây Ban Nha</Link>
                            <Link href="/danh-muc/ruou-vang/vang-uc" className="block text-gray-700 hover:text-primary">Úc</Link>
                            <Link href="/danh-muc/ruou-vang/vang-phap" className="block text-gray-700 hover:text-primary">Pháp</Link>
                            <Link href="/danh-muc/ruou-vang/vang-y" className="block text-gray-700 hover:text-primary">Ý</Link>
                            <Link href="/danh-muc/ruou-vang/vang-duc" className="block text-gray-700 hover:text-primary">Đức</Link>
                            <Link href="/danh-muc/ruou-vang/vang-nga" className="block text-gray-700 hover:text-primary">Nga</Link>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-semibold text-gray-800">Loại rượu</h4>
                            <Link href="/danh-muc/ruou-manh" className="block text-gray-700 hover:text-primary">Whisky</Link>
                            <Link href="/danh-muc/ruou-vang/champagne" className="block text-gray-700 hover:text-primary">Champagne</Link>
                            <Link href="/danh-muc/ruou-vang/ruou-vang-do" className="block text-gray-700 hover:text-primary">Vang đỏ</Link>
                            <Link href="/danh-muc/ruou-vang/ruou-vang-trang" className="block text-gray-700 hover:text-primary">Vang trắng</Link>
                            <Link href="/danh-muc/ruou-vang/ruou-vang-sui" className="block text-gray-700 hover:text-primary">Vang sủi</Link>
                            <Link href="/danh-muc/ruou-vang" className="block text-gray-700 hover:text-primary">Vang 0 độ</Link>
                        </div>
                    </div>
                </div>

                {/* Col 3: Customer Support */}
                <div className="space-y-4">
                    <h3 className="font-bold uppercase tracking-wider text-base">HỖ TRỢ KHÁCH HÀNG</h3>
                    <div className="space-y-2">
                        <Link href="#" className="block text-gray-700 hover:text-primary">Chính sách bảo mật</Link>
                        <Link href="#" className="block text-gray-700 hover:text-primary">Chính sách đổi trả</Link>
                        <Link href="#" className="block text-gray-700 hover:text-primary">Chính sách mua hàng & thanh toán</Link>
                        <Link href="#" className="block text-gray-700 hover:text-primary">Điều khoản & điều kiện</Link>
                    </div>
                </div>
                
                {/* Col 4: Social */}
                <div className="space-y-4">
                    <h3 className="font-bold uppercase tracking-wider text-base">KẾT NỐI VỚI CHÚNG TÔI</h3>
                    <div className="space-y-2">
                        <Link href="https://www.facebook.com/people/R%C6%B0%E1%BB%A3u-Vang-An-San/100075802071016/" target="_blank" rel="noopener noreferrer" className="block text-gray-700 hover:text-primary">FACEBOOK</Link>
                        <Link href="https://zalo.me/0933333313" target="_blank" rel="noopener noreferrer" className="block text-gray-700 hover:text-primary">ZALO</Link>
                    </div>
                </div>
            </div>

            <div className="mt-12">
                <h3 className="font-bold uppercase tracking-wider text-base mb-4">BẢN ĐỒ</h3>
                <div className="overflow-hidden rounded-md border relative">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.5517269147593!2d105.9529555759163!3d21.20986568048601!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31350f5800000001%3A0x10f73f446377708!2zUsaw4bujdSBWYW5nIEFuIFNhbg!5e0!3m2!1sen!2sus"
                        width="100%"
                        height="300"
                        style={{ border: 0 }}
                        allowFullScreen={false}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                     <a 
                        href="https://www.google.com/maps/place/R%C6%B0%E1%BB%A3u+Vang+An+San/@21.2098657,105.9555305,17z/data=!3m1!4b1!4m6!3m5!1s0x31350f5800000001:0x10f73f446377708!8m2!3d21.2098657!4d105.9555305!16s%2Fg%2F11f3y739xh?entry=ttu" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="absolute inset-0"
                        aria-label="Mở bản đồ trong tab mới"
                    >
                        {/* This overlay captures the click */}
                    </a>
                </div>
            </div>
        </div>

        <div className="bg-gray-100">
            <div className="container mx-auto max-w-screen-2xl px-4 py-8 text-center">
                <p className="text-xs text-black/70 max-w-4xl mx-auto">
                    CHẤP HÀNH NGHỊ ĐỊNH SỐ 105/2017/NĐ-CP CỦA CHÍNH PHỦ VỀ KINH DOANH RƯỢU VÀ CÁC QUY ĐỊNH VỀ QUẢN LÝ THƯƠNG MẠI ĐIỆN TỬ, AnSan KHÔNG KINH DOANH QUA MẠNG INTERNET CÁC LOẠI RƯỢU, BIA, ĐỒ UỐNG CÓ CỒN VÀ KHÔNG BÁN SẢN PHẨM CHỨA CỒN CHO NGƯỜI DƯỚI 18 TUỔI. WEBSITE CHỈ MANG TÍNH THAM KHẢO VÀ CUNG CẤP THÔNG TIN VỀ SẢN PHẨM.
                </p>
            </div>
        </div>

        <div className="bg-gray-200">
            <div className="container mx-auto max-w-screen-2xl px-4 py-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center sm:justify-center">
                    <p className="text-center text-xs text-black/60">
                        2026 &copy; AnSan. ALL RIGHTS RESERVED.
                    </p>
                </div>
            </div>
        </div>
    </motion.footer>
  );
}
