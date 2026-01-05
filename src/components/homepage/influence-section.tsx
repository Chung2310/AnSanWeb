import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import Link from 'next/link';

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 8.15c-1.33 0-2.4 1.07-2.4 2.4v5.3c0 1.33-1.07 2.4-2.4 2.4H8.15c-1.33 0-2.4-1.07-2.4-2.4V8.15c0-1.33-1.07-2.4-2.4-2.4H3" />
        <path d="M12 18.25V3" />
        <path d="M12 3a4 4 0 1 1 4 4" />
    </svg>
);


export default function InfluenceSection() {
  const influenceImage = PlaceHolderImages.find(img => img.id === 'influence-image');

  if (!influenceImage) return null;

  return (
    <section className="py-20" style={{ backgroundColor: '#fdfaf5' }}>
      <div className="container mx-auto max-w-screen-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column */}
          <div className="text-center lg:text-left">
            <p className="font-semibold tracking-widest uppercase text-sm" style={{ color: '#8a7d6a' }}>AnSan's INFLUENCE</p>
            <h2 className="mt-2 text-4xl lg:text-5xl font-black leading-tight" style={{ color: '#3a3a3a' }}>
              SỨC ẢNH HƯỞNG VÀ LAN TỎA<br />CỦA AnSan
            </h2>
            <div className="mt-8 aspect-w-4 aspect-h-3">
              <Image
                src={influenceImage.imageUrl}
                alt={influenceImage.description}
                width={800}
                height={600}
                className="w-full h-full object-cover rounded-lg shadow-lg"
                data-ai-hint={influenceImage.imageHint}
              />
            </div>
          </div>
          {/* Right Column */}
          <div className="flex flex-col justify-center text-gray-700">
            <p className="text-base leading-relaxed">
              AnSan đang là một trong những kênh truyền thông về Whisky & Rượu Mạnh uy tín hàng đầu trên rất nhiều nền tảng mạng xã hội. Qua những bài viết, hình ảnh, video chia sẻ kiến thức, đánh giá và những trải nghiệm cá nhân, tôi đã và đang truyền cảm hứng, xây dựng và phát triển cộng đồng thưởng thức giàu văn hóa hơn.
            </p>
            <div className="mt-12">
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
            </div>
            <div className="border-t border-gray-300 my-10" />
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-5xl font-black" style={{ color: '#8a7d6a' }}>110,000</p>
                <p className="mt-2 text-sm font-semibold tracking-wider text-gray-600">LƯỢT THEO DÕI</p>
              </div>
              <div>
                <p className="text-5xl font-black" style={{ color: '#8a7d6a' }}>18,000,000</p>
                <p className="mt-2 text-sm font-semibold tracking-wider text-gray-600">LƯỢT XEM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
