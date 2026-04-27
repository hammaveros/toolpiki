'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { isRestrictedPath } from '@/lib/seo/restricted-slugs';

interface KakaoAdfitProps {
  unit: string;
  width: number;
  height: number;
  className?: string;
}

// 전역: SDK 스크립트 로드 여��
let sdkAppended = false;

export function KakaoAdfit({ unit, width, height, className = '' }: KakaoAdfitProps) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!containerRef.current || initialized.current) return;
    if (isRestrictedPath(pathname)) return;
    initialized.current = true;

    // ins 엘리먼트 생성
    const ins = document.createElement('ins');
    ins.className = 'kakao_ad_area';
    ins.style.display = 'none';
    ins.setAttribute('data-ad-unit', unit);
    ins.setAttribute('data-ad-width', String(width));
    ins.setAttribute('data-ad-height', String(height));
    containerRef.current.appendChild(ins);

    // SDK 스크립트 1회만 추가
    if (!sdkAppended && !document.querySelector('script[src*="ba.min.js"]')) {
      sdkAppended = true;
      const script = document.createElement('script');
      script.src = '//t1.daumcdn.net/kas/static/ba.min.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, [unit, width, height, pathname]);

  if (isRestrictedPath(pathname)) return null;

  return <div ref={containerRef} className={className} />;
}
