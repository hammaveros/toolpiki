'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface AdSlotProps {
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  className?: string;
  responsive?: boolean;
  onBlocked?: () => void;
}

declare global {
  interface Window {
    adsbygoogle: Record<string, unknown>[];
  }
}

/**
 * Google AdSense 광고 슬롯 컴포넌트
 * - 반응형: data-ad-format + data-full-width-responsive
 * - 광고 미충전 시 컨테이너 숨김
 */
export function AdSlot({ format = 'auto', className, responsive = true, onBlocked }: AdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const insRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);
  const [filled, setFilled] = useState(true);

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
    if (typeof window.adsbygoogle !== 'undefined') {
      pushAd();
    } else {
      const interval = setInterval(() => {
        if (typeof window.adsbygoogle !== 'undefined') {
          pushAd();
          clearInterval(interval);
        }
      }, 200);
      const timeout = setTimeout(() => {
        clearInterval(interval);
        if (!pushed.current) setFilled(false);
      }, 5000);
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
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
    >
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-3612035754086019"
        data-ad-slot="5499882149"
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
