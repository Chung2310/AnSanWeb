'use client';

import FamousBrands from '@/components/homepage/famous-brands';
import WhiskyRegionShowcase from '@/components/homepage/whisky-region-showcase';
import GiftSetsSection from '@/components/homepage/gift-sets-section';
import HeroSection from '@/components/homepage/hero-section';
import PriceCategoryShowcase from '@/components/homepage/price-category-showcase';
import Testimonials from '@/components/homepage/testimonials';
import DrinkCategoryShowcase from '@/components/homepage/drink-category-showcase';
import HomepageBlogSection from '@/components/homepage/homepage-blog-section';
import BestChoiceSection from '@/components/homepage/best-choice-section';
import InfluenceSection from '@/components/homepage/influence-section';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FamousBrands />
      <DrinkCategoryShowcase />
      <WhiskyRegionShowcase />
      <InfluenceSection />
      <BestChoiceSection />
      <PriceCategoryShowcase />
      <GiftSetsSection />
      <Testimonials />
      <HomepageBlogSection />
    </>
  );
}
