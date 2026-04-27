'use client';

import { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { Header, Footer } from '@/components/layout';
import { HeaderAdBanner } from '@/components/ads/HeaderAdBanner';
import { FooterAdBanner } from '@/components/ads/FooterAdBanner';
import { isRestrictedPath } from '@/lib/seo/restricted-slugs';

export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showAds = !isRestrictedPath(pathname);

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
