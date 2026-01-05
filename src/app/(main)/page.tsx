'use client';

import BrandStory from '@/components/homepage/brand-story';
import FamousBrands from '@/components/homepage/famous-brands';
import FeaturedProduct from '@/components/homepage/featured-product';
import HeroSection from '@/components/homepage/hero-section';
import InfluenceSection from '@/components/homepage/influence-section';
import ProductSection from '@/components/homepage/product-section';
import Testimonials from '@/components/homepage/testimonials';
import { sampleWines } from '@/lib/placeholder-data';

export default function HomePage() {
  const newArrivals = sampleWines.filter(wine => wine.isNew);

  return (
    <>
      <HeroSection />
      <FamousBrands />
      <InfluenceSection />
      <FeaturedProduct />
      <ProductSection
        title="Hàng Mới Về"
        description="Những sự bổ sung mới nhất cho bộ sưu tập của chúng tôi, hứa hẹn mang đến những trải nghiệm hương vị độc đáo."
        wines={newArrivals}
      />
      <BrandStory />
      <Testimonials />
    </>
  );
}
