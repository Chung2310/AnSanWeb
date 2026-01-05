'use client';

import FamousBrands from '@/components/homepage/famous-brands';
import FeaturedProduct from '@/components/homepage/featured-product';
import HeroSection from '@/components/homepage/hero-section';
import InfluenceSection from '@/components/homepage/influence-section';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FamousBrands />
      <InfluenceSection />
      <FeaturedProduct />
    </>
  );
}
