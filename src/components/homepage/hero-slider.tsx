'use client';

import Image from 'next/image';
import Link from 'next/link';
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const slides = [
  {
    image: PlaceHolderImages.find(img => img.id === 'hero-1')!,
    title: 'Rượu Vang Thượng Hạng',
    subtitle: 'Từ Các Vùng Đất Nổi Tiếng Thế Giới',
    cta: 'Khám Phá Ngay',
  },
  {
    image: PlaceHolderImages.find(img => img.id === 'hero-2')!,
    title: 'Nghệ Thuật Của Hương Vị',
    subtitle: 'Mỗi Chai Vang Là Một Câu Chuyện Độc Đáo',
    cta: 'Tìm Hiểu Thêm',
  },
  {
    image: PlaceHolderImages.find(img => img.id === 'hero-3')!,
    title: 'Khoảnh Khắc Vô Giá',
    subtitle: 'Hoàn Hảo Cho Mọi Dịp Đặc Biệt',
    cta: 'Xem Bộ Sưu Tập',
  },
];

export default function HeroSlider() {
  return (
    <div className="relative">
      <Carousel 
        className="w-full"
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index}>
              <div className="relative h-[60vh] min-h-[400px] w-full md:h-[80vh]">
                <Image
                  src={slide.image.imageUrl}
                  alt={slide.image.description}
                  fill
                  priority={index === 0}
                  className="object-cover"
                  data-ai-hint={slide.image.imageHint}
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
                  <div className="container">
                    <h1 className="font-headline text-4xl font-bold tracking-tighter text-white sm:text-6xl md:text-7xl lg:text-8xl">
                      {slide.title}
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-white/80 md:text-xl">
                      {slide.subtitle}
                    </p>
                    <Button asChild size="lg" className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground">
                      <Link href="/danh-muc-san-pham">{slide.cta}</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-white/20 hover:bg-white/40 border-none" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-white/20 hover:bg-white/40 border-none" />
      </Carousel>
    </div>
  );
}
