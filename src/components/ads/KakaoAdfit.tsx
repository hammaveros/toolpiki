'use client';

import { useEffect, useRef } from 'react';

interface KakaoAdfitProps {
  unit: string;
  width: number;
  height: number;
  className?: string;
}

const ADFIT_SDK_SRC = '//t1.daumcdn.net/kas/static/ba.min.js';

/**
 * 카카오 애드핏 광고 슬롯.
 * SPA 특성상 SDK가 이미 로드된 뒤 추가된 ins 는 자동 스캔되지 않는다.
 * 따라서 인스턴스마다 ins 를 만든 뒤 ba.min.js 를 새로 붙여
 * 카카오 SDK 가 해당 ins 를 처리(렌더)하도록 한다.
 */
export function KakaoAdfit({ unit, width, height, className = '' }: KakaoAdfitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!containerRef.current || initialized.current) return;
    initialized.current = true;

    // ins 엘리먼트 생성 (카카오가 광고 충전 시 display 를 노출로 바꾼다)
    const ins = document.createElement('ins');
    ins.className = 'kakao_ad_area';
    ins.style.display = 'none';
    ins.setAttribute('data-ad-unit', unit);
    ins.setAttribute('data-ad-width', String(width));
    ins.setAttribute('data-ad-height', String(height));
    containerRef.current.appendChild(ins);

    // ins 바로 뒤에 SDK 스크립트를 새로 붙인다.
    // 스크립트가 (재)실행될 때 아직 처리되지 않은 kakao_ad_area 를 스캔·렌더한다.
    const script = document.createElement('script');
    script.src = ADFIT_SDK_SRC;
    script.async = true;
    containerRef.current.appendChild(script);
  }, [unit, width, height]);

  return <div ref={containerRef} className={className} />;
}
