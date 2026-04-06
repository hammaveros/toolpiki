'use client';

import { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { Header, Footer } from '@/components/layout';
import { HeaderAdBanner } from '@/components/ads/HeaderAdBanner';
import { FooterAdBanner } from '@/components/ads/FooterAdBanner';

// 광고를 표시하지 않을 경로
const AD_EXCLUDED_PATHS = ['/chat'];

export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showAds = !AD_EXCLUDED_PATHS.includes(pathname);

  return (
    <>
      <Suspense fallback={null}>
        <Header />
      </Suspense>
      {showAds && <HeaderAdBanner />}
      <main className="flex-1">{children}</main>
      {showAds && <FooterAdBanner />}
      <Footer />
    </>
  );
}
