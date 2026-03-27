'use client';

import { useEffect, useRef } from 'react';

interface KakaoAdfitProps {
  unit: string;
  width: number;
  height: number;
  className?: string;
}

export function KakaoAdfit({ unit, width, height, className = '' }: KakaoAdfitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/kas/static/ba.min.js';
    script.async = true;

    const ins = document.createElement('ins');
    ins.className = 'kakao_ad_area';
    ins.style.display = 'none';
    ins.setAttribute('data-ad-unit', unit);
    ins.setAttribute('data-ad-width', String(width));
    ins.setAttribute('data-ad-height', String(height));

    if (containerRef.current) {
      containerRef.current.appendChild(ins);
      containerRef.current.appendChild(script);
    }

    return () => {
      // cleanup
    };
  }, [unit, width, height]);

  return <div ref={containerRef} className={className} />;
}
