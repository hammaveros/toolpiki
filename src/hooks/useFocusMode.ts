'use client';

import { useSearchParams } from 'next/navigation';

/**
 * Focus 모드 훅
 * URL 쿼리 파라미터 ?focus=1 로 Focus 모드 활성화
 * Focus 모드: 헤더/푸터 숨김, 도구만 표시
 */
export function useFocusMode(): boolean {
  const searchParams = useSearchParams();
  return searchParams.get('focus') === '1';
}
