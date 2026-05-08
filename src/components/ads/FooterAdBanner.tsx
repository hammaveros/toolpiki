'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { AdSlot } from './AdSlot';
import { KakaoAdfit } from './KakaoAdfit';
import { isRestrictedPath } from '@/lib/seo/restricted-slugs';

/**
 * 하단 광고 배너
 * - Google AdSense 우선, 차단 시 카카오 애드핏 fallback
 * - PC: 728x90
 * - 모바일: 카카오 unit 없으면 생략
 */
export function FooterAdBanner({
  disableFallback = false,
  isEnglish = false,
}: {
  disableFallback?: boolean;
  isEnglish?: boolean;
}) {
  const pathname = usePathname();
  const [adBlocked, setAdBlocked] = useState(false);

  // AdSense 정책상 회색지대(사주/운세/타로/궁합/복권/채팅)에서는 광고 미노출
  if (isRestrictedPath(pathname)) return null;

  const label = isEnglish ? 'Sponsored' : '광고';

  if (adBlocked && !disableFallback) {
    return (
      <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-6 bg-gray-50 dark:bg-gray-900/50">
        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mb-2">{label}</p>
        <div className="flex justify-center py-1">
          <div className="hidden md:block">
            <KakaoAdfit unit="DAN-FQao7kKjxM9YUvZK" width={250} height={250} />
          </div>
          <div className="block md:hidden">
            <KakaoAdfit unit="DAN-AqCk7ya3V9db3oTi" width={320} height={100} />
          </div>
        </div>
      </div>
    );
  }

  if (adBlocked) return null;

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-6 bg-gray-50 dark:bg-gray-900/50">
      <p className="text-center text-xs text-gray-400 dark:text-gray-500 mb-2">{label}</p>
      <div className="flex justify-center py-1">
        <div className="w-full max-w-[728px] px-2 md:px-4">
          <AdSlot format="autorelaxed" slotId="5755192113" onBlocked={() => setAdBlocked(true)} />
        </div>
      </div>
    </div>
  );
}
