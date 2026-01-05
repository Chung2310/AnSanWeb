'use client';

import EngravingSection from '@/components/homepage/engraving-section';
import FamousBrands from '@/components/homepage/famous-brands';
import FeaturedProduct from '@/components/homepage/featured-product';
import GiftSetsSection from '@/components/homepage/gift-sets-section';
import HeroSection from '@/components/homepage/hero-section';
import InfluenceSection from '@/components/homepage/influence-section';
import PriceCategoryShowcase from '@/components/homepage/price-category-showcase';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FamousBrands />
      <InfluenceSection />
      <FeaturedProduct />
      <PriceCategoryShowcase />
      <GiftSetsSection />
      <EngravingSection />
    </>
  );
}

    