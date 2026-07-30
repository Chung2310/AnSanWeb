'use client';

import dynamic from 'next/dynamic';

const TetGiftPopup = dynamic(() => import('@/components/homepage/tet-gift-popup'), { ssr: false });
const StickyBar = dynamic(() => import('@/components/layout/sticky-bar'), { ssr: false });
const MobileActionBar = dynamic(() => import('@/components/layout/mobile-action-bar'), { ssr: false });
const MobileBottomBar = dynamic(() => import('@/components/layout/mobile-bottom-bar'), { ssr: false });
const ScrollToTopButton = dynamic(() => import('@/components/layout/scroll-to-top'), { ssr: false });

export default function ClientOnlyWidgets() {
  return (
    <>
      <TetGiftPopup />
      <StickyBar />
      <MobileActionBar />
      <MobileBottomBar />
      <ScrollToTopButton />
    </>
  );
}
