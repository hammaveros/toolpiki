'use client';

import { usePathname } from 'next/navigation';
import { HeaderAdBanner } from '@/components/ads/HeaderAdBanner';
import { FooterAdBanner } from '@/components/ads/FooterAdBanner';
import { isRestrictedPath } from '@/lib/seo/restricted-slugs';

export default function EnTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // AdSense 승인 전: 메인/소개/약관/연락처 등 핵심 페이지에서는 광고 슬롯 미노출 (도구 페이지만 광고 표시)
  const CORE_PAGES_NO_ADS = new Set([
    '/en',
    '/en/about',
    '/en/privacy',
    '/en/terms',
    '/en/contact',
    '/en/letter',
  ]);
  const showAds = !isRestrictedPath(pathname) && !CORE_PAGES_NO_ADS.has(pathname);

  return (
    <>
      {showAds && <HeaderAdBanner disableFallback />}
      <main className="flex-1">{children}</main>
      {showAds && <FooterAdBanner disableFallback isEnglish />}
    </>
  );
}
