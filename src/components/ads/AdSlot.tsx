'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface AdSlotProps {
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle' | 'autorelaxed';
  slotId?: string;
  className?: string;
  responsive?: boolean;
  onBlocked?: () => void;
}

declare global {
  interface Window {
    adsbygoogle: Record<string, unknown>[];
  }
}

// 전역: 구글 광고 로드 실패 기억 (페이지 내 재시도 방지)
let adsenseFailedGlobal = false;

/**
 * Google AdSense 광고 슬롯 컴포넌트
 * - 반응형: data-ad-format + data-full-width-responsive
 * - 광고 미충전 시 컨테이너 숨김
 */
export function AdSlot({ format = 'auto', slotId = '5499882149', className, responsive = true, onBlocked }: AdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const insRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);
  const [filled, setFilled] = useState(!adsenseFailedGlobal);

  const pushAd = useCallback(() => {
    if (pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // adsbygoogle not available
    }
  }, []);

  useEffect(() => {
    if (adsenseFailedGlobal) {
      setFilled(false);
      return;
    }
    if (typeof window.adsbygoogle !== 'undefined') {
      pushAd();
    } else {
      let attempts = 0;
      let timerId: ReturnType<typeof setTimeout>;
      const poll = () => {
        if (typeof window.adsbygoogle !== 'undefined') {
          pushAd();
          return;
        }
        attempts++;
        if (attempts >= 5) {
          adsenseFailedGlobal = true;
          if (!pushed.current) setFilled(false);
          return;
        }
        timerId = setTimeout(poll, 500);
      };
      timerId = setTimeout(poll, 500);
      return () => clearTimeout(timerId);
    }
  }, [pushAd]);

  useEffect(() => {
    if (!insRef.current) return;

    const observer = new MutationObserver(() => {
      const ins = insRef.current;
      if (!ins) return;
      if (ins.getAttribute('data-ad-status') === 'unfilled') {
        setFilled(false);
      }
    });

    observer.observe(insRef.current, {
      attributes: true,
      attributeFilter: ['data-ad-status'],
    });

    const heightCheck = setTimeout(() => {
      const ins = insRef.current;
      if (ins && ins.offsetHeight === 0) {
        setFilled(false);
      }
    }, 3000);

    return () => {
      observer.disconnect();
      clearTimeout(heightCheck);
    };
  }, []);

  useEffect(() => {
    if (!filled && onBlocked) {
      onBlocked();
    }
  }, [filled, onBlocked]);

  if (!filled) return null;

  return (
    <div
      ref={containerRef}
      className={className}
      aria-label="광고 영역"
      tabIndex={-1}
      style={{ outline: 'none' }}
      onFocus={(e) => e.preventDefault()}
    >
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{
          display: 'block',
          ...(format === 'horizontal' ? { minHeight: '90px' } : {}),
        }}
        data-ad-client="ca-pub-3612035754086019"
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
