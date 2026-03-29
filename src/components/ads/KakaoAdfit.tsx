'use client';

import { useEffect, useRef, useId } from 'react';

interface KakaoAdfitProps {
  unit: string;
  width: number;
  height: number;
  className?: string;
}

declare global {
  interface Window {
    adfit?: {
      render: (id: string) => void;
      destroy: (id: string) => void;
    };
  }
}

// 전역: SDK 로드 상태
let sdkLoaded = false;
let sdkLoading = false;
const sdkCallbacks: (() => void)[] = [];

function loadSdk(callback: () => void) {
  if (sdkLoaded) {
    callback();
    return;
  }

  sdkCallbacks.push(callback);

  if (sdkLoading) return;
  sdkLoading = true;

  // 이미 script 태그가 있는지 확인
  if (document.querySelector('script[src*="ba.min.js"]')) {
    sdkLoaded = true;
    sdkLoading = false;
    sdkCallbacks.forEach((cb) => cb());
    sdkCallbacks.length = 0;
    return;
  }

  const script = document.createElement('script');
  script.src = '//t1.daumcdn.net/kas/static/ba.min.js';
  script.async = true;
  script.onload = () => {
    sdkLoaded = true;
    sdkLoading = false;
    sdkCallbacks.forEach((cb) => cb());
    sdkCallbacks.length = 0;
  };
  script.onerror = () => {
    sdkLoading = false;
  };
  document.head.appendChild(script);
}

export function KakaoAdfit({ unit, width, height, className = '' }: KakaoAdfitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const adId = useId().replace(/:/g, '_');
  const rendered = useRef(false);

  useEffect(() => {
    if (!containerRef.current || rendered.current) return;

    // ins 엘리먼트 생성
    const ins = document.createElement('ins');
    ins.className = 'kakao_ad_area';
    ins.style.display = 'none';
    ins.id = `kakao-ad-${adId}`;
    ins.setAttribute('data-ad-unit', unit);
    ins.setAttribute('data-ad-width', String(width));
    ins.setAttribute('data-ad-height', String(height));
    containerRef.current.appendChild(ins);

    // SDK 로드 후 렌더링
    loadSdk(() => {
      if (rendered.current) return;
      rendered.current = true;
      try {
        window.adfit?.render(`kakao-ad-${adId}`);
      } catch {
        // 렌더링 실패 시 무시 (graceful fallback)
      }
    });

    return () => {
      // cleanup: 슬롯 해제
      try {
        window.adfit?.destroy(`kakao-ad-${adId}`);
      } catch {}
      rendered.current = false;
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [unit, width, height, adId]);

  return <div ref={containerRef} className={className} />;
}
