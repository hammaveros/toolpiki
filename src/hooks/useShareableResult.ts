'use client';

import { useState, useEffect, useCallback } from 'react';

interface ShareableData {
  [key: string]: string | number | boolean | null | string[] | number[];
}

// URL 최대 길이 (브라우저/서버 호환성을 위해 2000자로 제한)
const MAX_URL_LENGTH = 2000;
// 데이터 최대 크기 (base64 인코딩 후 약 1500자 => 원본 약 1000자)
const MAX_DATA_SIZE = 1000;

interface ShareResult {
  url: string;
  success: boolean;
  error?: 'TOO_LARGE' | 'ENCODE_ERROR';
}

/**
 * 결과 공유를 위한 hash 기반 상태 관리 훅
 * URL hash를 사용하여 SEO에 영향을 주지 않음
 *
 * 사용 예:
 * const { data, setShareData, shareUrl, isFromShare } = useShareableResult<MyData>();
 */
export function useShareableResult<T extends ShareableData>() {
  const [data, setData] = useState<T | null>(null);
  const [isFromShare, setIsFromShare] = useState(false);

  // 페이지 로드 시 hash에서 데이터 복원
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hash = window.location.hash;
    if (hash.startsWith('#share=')) {
      try {
        const encoded = hash.slice(7); // '#share=' 제거
        const decoded = decodeURIComponent(atob(encoded));
        const parsed = JSON.parse(decoded) as T;
        setData(parsed);
        setIsFromShare(true);
      } catch {
        // 파싱 실패 시 무시
        console.warn('Failed to parse share data from URL hash');
      }
    }
  }, []);

  // 공유 데이터 설정
  const setShareData = useCallback((newData: T) => {
    setData(newData);
    setIsFromShare(false);
  }, []);

  // 공유 URL 생성 (성공 여부 포함)
  const getShareUrl = useCallback((shareData?: T): ShareResult => {
    if (typeof window === 'undefined') {
      return { url: '', success: false, error: 'ENCODE_ERROR' };
    }

    const dataToShare = shareData || data;
    const baseUrl = window.location.href.split('#')[0];

    if (!dataToShare) {
      return { url: baseUrl, success: true };
    }

    try {
      const json = JSON.stringify(dataToShare);

      // 데이터 크기 체크
      if (json.length > MAX_DATA_SIZE) {
        return { url: baseUrl, success: false, error: 'TOO_LARGE' };
      }

      const encoded = btoa(encodeURIComponent(json));
      const fullUrl = `${baseUrl}#share=${encoded}`;

      // URL 길이 체크
      if (fullUrl.length > MAX_URL_LENGTH) {
        return { url: baseUrl, success: false, error: 'TOO_LARGE' };
      }

      return { url: fullUrl, success: true };
    } catch {
      return { url: baseUrl, success: false, error: 'ENCODE_ERROR' };
    }
  }, [data]);

  // 간단한 URL만 반환 (기존 호환성)
  const getShareUrlSimple = useCallback((shareData?: T): string => {
    const result = getShareUrl(shareData);
    return result.url;
  }, [getShareUrl]);

  // 공유 가능 여부 체크
  const canShare = useCallback((shareData?: T): boolean => {
    const result = getShareUrl(shareData);
    return result.success;
  }, [getShareUrl]);

  // hash 초기화 (공유 링크로 들어온 후 수정 시)
  const clearShareHash = useCallback(() => {
    if (typeof window === 'undefined') return;

    const baseUrl = window.location.href.split('#')[0];
    window.history.replaceState(null, '', baseUrl);
    setIsFromShare(false);
  }, []);

  return {
    data,
    setShareData,
    getShareUrl,
    getShareUrlSimple,
    canShare,
    isFromShare,
    clearShareHash,
  };
}
