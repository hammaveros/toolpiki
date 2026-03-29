'use client';

import { useEffect, useRef } from 'react';

interface KakaoAdfitProps {
  unit: string;
  width: number;
  height: number;
  className?: string;
}

// 전역: 이미 로드된 유닛 추적
const loadedUnits = new Set<string>();

export function KakaoAdfit({ unit, width, height, className = '' }: KakaoAdfitProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || loadedUnits.has(unit)) return;
    loadedUnits.add(unit);

    const ins = document.createElement('ins');
    ins.className = 'kakao_ad_area';
    ins.style.display = 'none';
    ins.setAttribute('data-ad-unit', unit);
    ins.setAttribute('data-ad-width', String(width));
    ins.setAttribute('data-ad-height', String(height));

    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/kas/static/ba.min.js';
    script.async = true;

    containerRef.current.appendChild(ins);
    containerRef.current.appendChild(script);
  }, [unit, width, height]);

  return <div ref={containerRef} className={className} />;
}
