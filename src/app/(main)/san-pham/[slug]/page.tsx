import { sampleWines } from "@/lib/placeholder-data";
import { notFound } from "next/navigation";
import Image from "next/image";
import ProductSection from "@/components/homepage/product-section";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Truck, ShieldCheck, Gem, User, Handshake } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const ZaloIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12.55,10.36c-1.39-0.08-2.58,1.03-2.66,2.42c-0.08,1.39,1.03,2.58,2.42,2.66c1.39,0.08,2.58-1.03,2.66-2.42C15.05,11.43,13.94,10.28,12.55,10.36z M8.13,12.82c0-2.61,2.12-4.73,4.73-4.73c2.61,0,4.73,2.12,4.73,4.73c0,2.61-2.12,4.73-4.73,4.73C10.25,17.55,8.13,15.43,8.13,12.82z M20.93,3.07c-1.5-1.5-3.48-2.33-5.59-2.33h-6.22c-4.43,0-8.03,3.6-8.03,8.03v6.22c0,4.43,3.6,8.03,8.03,8.03h6.22c4.43,0,8.03-3.6,8.03-8.03v-6.22C23.25,6.55,22.43,4.57,20.93,3.07z M17.58,12.82c0,2.9-2.36,5.25-5.25,5.25c-2.9,0-5.25-2.36-5.25-5.25c0-2.9,2.36-5.25,5.25-5.25C15.22,7.57,17.58,9.92,17.58,12.82z" />
    </svg>
);

const perks = [
    { icon: Truck, text: "Giao hàng MIỄN PHÍ trong 60 phút, bán kính 5km nội thành Hà Nội" },
    { icon: Gem, text: "UỐNG THỬ MIỄN PHÍ tại showroom 31 Nguyễn Gia Thiều, Hà Nội" },
    { icon: ShieldCheck, text: "Cam kết 100% sản phẩm CHẤT LƯỢNG" },
    { icon: Handshake, text: "Cam kết giá bán CẠNH TRANH" },
    { icon: User, text: "Nhiều chương trình sinh hoạt cộng đồng gia tăng trải nghiệm khách hàng" },
    { icon: Phone, text: "Cam kết bồi thường nếu xảy ra vấn đề trong quá trình vận chuyển" },
]

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const wine = sampleWines.find((w) => w.slug === params.slug);

  if (!wine) {
    notFound();
  }
  
  const relatedWines = sampleWines.filter(w => w.type === wine.type && w.id !== wine.id).slice(0, 4);

  return (
    <div className="bg-white text-black">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Image Column */}
        <div className="md:col-span-1 bg-secondary flex items-center justify-center p-4 min-h-screen">
            <Image
              src={wine.image.imageUrl}
              alt={wine.nameVN}
              width={800}
              height={1000}
              className="w-auto h-full max-h-[80vh] object-contain drop-shadow-2xl"
              data-ai-hint={wine.image.imageHint}
              priority
            />
        </div>
        {/* Details Column */}
        <div className="md:col-span-1 container py-12 md:py-20">
          <div className="max-w-2xl">
            <div className="flex items-center text-xs uppercase font-medium text-muted-foreground tracking-widest mb-4">
                <Link href="/" className="hover:text-primary">Trang chủ</Link>
                <ChevronRight className="h-4 w-4 mx-1" />
                <Link href="/danh-muc-san-pham" className="hover:text-primary">{wine.type}</Link>
            </div>
            <h1 className="font-headline text-3xl md:text-5xl font-black uppercase tracking-wide">{wine.nameVN}</h1>
            <p className="mt-6 text-base text-foreground/80 leading-relaxed">{wine.description}</p>
            
            <Separator className="my-8" />
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-6 text-center">
              <div>
                <p className="text-xs uppercase text-muted-foreground tracking-widest">Độ tuổi</p>
                <p className="mt-1 font-bold text-lg">{wine.age ? `${wine.age}` : 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-muted-foreground tracking-widest">Nồng độ cồn</p>
                <p className="mt-1 font-bold text-lg">{wine.alcohol}%</p>
              </div>
              <div>
                <p className="text-xs uppercase text-muted-foreground tracking-widest">Dung tích</p>
                <p className="mt-1 font-bold text-lg">700ml</p>
              </div>
              <div>
                <p className="text-xs uppercase text-muted-foreground tracking-widest">Tình trạng</p>
                <p className="mt-1 font-bold text-lg">Còn hàng</p>
              </div>
            </div>

            <Separator className="my-8" />

            <div>
              <h3 className="font-bold text-sm tracking-wider uppercase mb-4">Liên hệ để nhận tư vấn</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="rounded-none justify-start gap-2 h-12 text-xs font-bold tracking-widest"><Phone className="h-4 w-4"/> ĐIỆN THOẠI</Button>
                <Button variant="outline" className="rounded-none justify-start gap-2 h-12 text-xs font-bold tracking-widest"><MessageCircle className="h-4 w-4"/> MESSENGER</Button>
                <Button variant="outline" className="rounded-none justify-start gap-2 h-12 text-xs font-bold tracking-widest"><ZaloIcon className="h-4 w-4"/> ZALO</Button>
                <Button variant="outline" className="rounded-none justify-start gap-2 h-12 text-xs font-bold tracking-widest"><MessageCircle className="h-4 w-4"/> WHATSAPP</Button>
              </div>
            </div>

            <Separator className="my-8" />
            
            <div>
              <h3 className="font-bold text-sm tracking-wider uppercase mb-6">Giá độc quyền trên website</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                {perks.map((perk, index) => (
                    <div key={index} className="flex items-center gap-4">
                        <perk.icon className="h-7 w-7 text-primary/80 shrink-0" />
                        <p className="text-sm text-foreground/70">{perk.text}</p>
                    </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {relatedWines.length > 0 && (
        <div className="bg-white">
            <ProductSection
                title="Sản Phẩm Tương Tự"
                description="Những chai vang khác cùng loại có thể bạn sẽ thích."
                wines={relatedWines}
            />
        </div>
      )}
    </div>
  );
}
