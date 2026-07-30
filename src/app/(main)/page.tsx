'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import HeroSection from '@/components/homepage/hero-section';
import { SectionSkeleton } from '@/components/ui/section-skeleton';

// Above-the-fold: load ngay
// Below-the-fold: lazy load để giảm initial bundle size

const FamousBrands = dynamic(() => import('@/components/homepage/famous-brands'), {
  loading: () => <SectionSkeleton height="h-28" />,
  ssr: false,
});

const DrinkCategoryShowcase = dynamic(() => import('@/components/homepage/drink-category-showcase'), {
  loading: () => <SectionSkeleton height="h-72" />,
  ssr: false,
});

const BestChoiceSection = dynamic(() => import('@/components/homepage/best-choice-section'), {
  loading: () => <SectionSkeleton height="h-96" />,
  ssr: false,
});

const WhiskyRegionShowcase = dynamic(() => import('@/components/homepage/whisky-region-showcase'), {
  loading: () => <SectionSkeleton height="h-96" />,
  ssr: false,
});

const InfluenceSection = dynamic(() => import('@/components/homepage/influence-section'), {
  loading: () => <SectionSkeleton height="h-80" />,
  ssr: false,
});

const PriceCategoryShowcase = dynamic(() => import('@/components/homepage/price-category-showcase'), {
  loading: () => <SectionSkeleton height="h-96" />,
  ssr: false,
});

const GiftSetsSection = dynamic(() => import('@/components/homepage/gift-sets-section'), {
  loading: () => <SectionSkeleton height="h-80" />,
  ssr: false,
});

const Testimonials = dynamic(() => import('@/components/homepage/testimonials'), {
  loading: () => <SectionSkeleton height="h-60" />,
  ssr: false,
});

const HomepageBlogSection = dynamic(() => import('@/components/homepage/homepage-blog-section'), {
  loading: () => <SectionSkeleton height="h-80" />,
  ssr: false,
});

export default function HomePage() {
  return (
    <>
      {/* Hero - above the fold, load ngay */}
      <HeroSection />

      {/* Below the fold - lazy load */}
      <Suspense fallback={<SectionSkeleton height="h-28" />}>
        <FamousBrands />
      </Suspense>

      <Suspense fallback={<SectionSkeleton height="h-72" />}>
        <DrinkCategoryShowcase />
      </Suspense>

      <Suspense fallback={<SectionSkeleton height="h-96" />}>
        <BestChoiceSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton height="h-96" />}>
        <WhiskyRegionShowcase />
      </Suspense>

      <Suspense fallback={<SectionSkeleton height="h-80" />}>
        <InfluenceSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton height="h-96" />}>
        <PriceCategoryShowcase />
      </Suspense>

      <Suspense fallback={<SectionSkeleton height="h-80" />}>
        <GiftSetsSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton height="h-60" />}>
        <Testimonials />
      </Suspense>

      <Suspense fallback={<SectionSkeleton height="h-80" />}>
        <HomepageBlogSection />
      </Suspense>
    </>
  );
}
