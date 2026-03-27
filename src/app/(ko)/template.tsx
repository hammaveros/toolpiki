'use client';

import { Suspense } from 'react';
import { Header, Footer } from '@/components/layout';
import { HeaderAdBanner } from '@/components/ads/HeaderAdBanner';
import { FooterAdBanner } from '@/components/ads/FooterAdBanner';

export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={null}>
        <Header />
      </Suspense>
      <HeaderAdBanner />
      <main className="flex-1">{children}</main>
      <FooterAdBanner />
      <Footer />
    </>
  );
}
