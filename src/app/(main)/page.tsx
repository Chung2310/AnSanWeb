'use client';

import EngravingSection from '@/components/homepage/engraving-section';
import FamousBrands from '@/components/homepage/famous-brands';
import WhiskyRegionShowcase from '@/components/homepage/whisky-region-showcase';
import GiftSetsSection from '@/components/homepage/gift-sets-section';
import HeroSection from '@/components/homepage/hero-section';
import InfluenceSection from '@/components/homepage/influence-section';
import PriceCategoryShowcase from '@/components/homepage/price-category-showcase';
import Testimonials from '@/components/homepage/testimonials';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FamousBrands />
      <InfluenceSection />
      <WhiskyRegionShowcase />
      <PriceCategoryShowcase />
      <GiftSetsSection />
      <Testimonials />
      <EngravingSection />
    </>
  );
}
