'use client';

import { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { Header, Footer } from '@/components/layout';
import { HeaderAdBanner } from '@/components/ads/HeaderAdBanner';
import { FooterAdBanner } from '@/components/ads/FooterAdBanner';

export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isChatPage = pathname === '/chat';

  return (
    <>
      <Suspense fallback={null}>
        <Header />
      </Suspense>
      {!isChatPage && <HeaderAdBanner />}
      <main className="flex-1">{children}</main>
      {!isChatPage && <FooterAdBanner />}
      {!isChatPage && <Footer />}
    </>
  );
}
