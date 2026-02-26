'use client';

import Link from 'next/link';
import { MapPin } from 'lucide-react';
import MapEmbed from './map-embed';

export default function Footer() {

  return (
    <footer className="bg-white text-black border-t">
        <div className="container mx-auto max-w-screen-2xl px-4 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 text-sm">
                
                {/* Col 1: Business Info */}
                <div className="space-y-4">
                    <h3 className="font-bold uppercase tracking-wider text-base">HỘ KINH DOANH NGÔ QUANG HÙNG</h3>
                    <div className="space-y-2 text-gray-700">
                        <p><span className='font-semibold'>Người đại diện:</span> Ngô Quang Hùng</p>
                        <p>
                          <span className='font-semibold'>Địa chỉ:</span>{' '}
                          <a
                            href="https://www.google.com/maps/place/R%C6%B0%E1%BB%A3u+Vang+An+San/@21.1188432,105.9584962,17z/data=!3m1!4b1!4m6!3m5!1s0x313507d363d71ddb:0x7a29b7c779b993e1!8m2!3d21.1188432!4d105.9610764!16s%2Fg%2F11h9q5p9_n?entry=ttu"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary transition-colors"
                          >
                            Đường Trần Phú, Phường Đình Bảng, thành phố Từ Sơn, Bắc Ninh
                          </a>
                        </p>
                        <p><span className='font-semibold'>Hotline:</span> 0933.333.313</p>
                        <p><span className='font-semibold'>Email:</span> ruouvangansan@gmail.com</p>
                    </div>
                </div>

                {/* Col 2: Wine Categories */}
                <div className="space-y-4 md:pl-16">
                    <h3 className="font-bold uppercase tracking-wider text-base">DANH MỤC RƯỢU</h3>
                    <div className="flex flex-col sm:flex-row gap-8">
                        <div className="space-y-2">
                            <h4 className="font-semibold text-gray-800">Quốc gia</h4>
                            <Link href="/danh-muc/ruou-vang/vang-chi-le" className="block text-gray-700 hover:text-primary">Vang Chile</Link>
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
                
                {/* Col 3: Social */}
                <div className="space-y-4">
                    <h3 className="font-bold uppercase tracking-wider text-base">KẾT NỐI VỚI CHÚNG TÔI</h3>
                    <div className="space-y-2">
                        <a href="https://www.facebook.com/profile.php?id=100075802071016" target="_blank" rel="noopener noreferrer" className="block text-gray-700 hover:text-primary">FACEBOOK</a>
                        <a href="https://id.zalo.me/account/login?continue=http%3A%2F%2Fzalo.me%2F0933333313" target="_blank" rel="noopener noreferrer" className="block text-gray-700 hover:text-primary">ZALO</a>
                    </div>
                </div>
            </div>

            <div id="map-section" className="mt-12 scroll-mt-24">
                <h3 className="font-bold uppercase tracking-wider text-base mb-4">BẢN ĐỒ</h3>
                <div className="overflow-hidden rounded-lg border shadow-lg">
                    <MapEmbed />
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
    </footer>
  );
}