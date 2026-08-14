'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { AdSlot } from './AdSlot';
import { KakaoAdfit } from './KakaoAdfit';
import { isRestrictedPath } from '@/lib/seo/restricted-slugs';

/**
 * 상단 광고 배너
 * - Google AdSense 우선, 차단 시 카카오 애드핏 fallback
 * - PC: 728x90 수평형
 * - 모바일: 320x50 수평형
 */
export function HeaderAdBanner({ disableFallback = false }: { disableFallback?: boolean }) {
  const pathname = usePathname();
  const [mobileBlocked, setMobileBlocked] = useState(false);
  const [pcBlocked, setPcBlocked] = useState(false);

  // AdSense 정책상 회색지대(사주/운세/타로/궁합/복권/채팅)에서는 구글 광고 미노출.
  // 카카오 애드핏은 정책 제약이 덜해 이 페이지들에도 직접 노출한다.
  if (isRestrictedPath(pathname)) {
    return (
      <div className="flex justify-center border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="block md:hidden w-full overflow-hidden">
          <KakaoAdfit unit="DAN-qyGgTF12Ec3q4tYd" width={320} height={50} />
        </div>
        <div className="hidden md:block w-full max-w-[728px] overflow-hidden">
          <KakaoAdfit unit="DAN-uOW6bJeehVWdcX17" width={728} height={90} />
        </div>
      </div>
    );
  }

  const mobileHasAd = !mobileBlocked || (!disableFallback && mobileBlocked);
  const pcHasAd = !pcBlocked || (!disableFallback && pcBlocked);

  if (!mobileHasAd && !pcHasAd) return null;

  return (
    <div className="flex justify-center border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
      {/* 모바일 */}
      <div className="block md:hidden w-full overflow-hidden">
        {mobileBlocked && !disableFallback ? (
          <KakaoAdfit unit="DAN-qyGgTF12Ec3q4tYd" width={320} height={50} />
        ) : !mobileBlocked ? (
          <AdSlot format="horizontal" responsive={false} onBlocked={() => setMobileBlocked(true)} />
        ) : null}
      </div>
      {/* PC */}
      <div className="hidden md:block w-full max-w-[728px] overflow-hidden">
        {pcBlocked && !disableFallback ? (
          <KakaoAdfit unit="DAN-uOW6bJeehVWdcX17" width={728} height={90} />
        ) : !pcBlocked ? (
          <AdSlot format="horizontal" onBlocked={() => setPcBlocked(true)} />
        ) : null}
      </div>
    </div>
  );
}
