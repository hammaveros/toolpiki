'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'jsspace:recent-tools';
const MAX_RECENT = 4;

/**
 * 최근 이용 도구 관리 훅
 * - localStorage 기반 영속 저장
 * - SSR 안전 (window 체크)
 * - 최대 4개 유지, 가장 최근이 맨 앞
 */
export function useRecentTools() {
  const [recentTools, setRecentTools] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 초기 로드
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentTools(parsed.slice(0, MAX_RECENT));
        }
      }
    } catch {
      // localStorage 접근 실패 시 빈 배열 유지
    }
    setIsLoaded(true);
  }, []);

  // localStorage 동기화
  const saveRecent = useCallback((tools: string[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tools));
    } catch {
      // 저장 실패 무시
    }
  }, []);

  // 도구 사용 기록 (페이지 진입 시 호출)
  const recordToolUsage = useCallback((slug: string) => {
    setRecentTools((prev) => {
      // 이미 있으면 제거 후 맨 앞에 추가
      const filtered = prev.filter((s) => s !== slug);
      const updated = [slug, ...filtered].slice(0, MAX_RECENT);
      saveRecent(updated);
      return updated;
    });
  }, [saveRecent]);

  // 특정 도구 삭제
  const removeRecent = useCallback((slug: string) => {
    setRecentTools((prev) => {
      const updated = prev.filter((s) => s !== slug);
      saveRecent(updated);
      return updated;
    });
  }, [saveRecent]);

  // 최근 기록 초기화
  const clearRecent = useCallback(() => {
    setRecentTools([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // 무시
    }
  }, []);

  return {
    recentTools,
    isLoaded,
    recordToolUsage,
    removeRecent,
    clearRecent,
  };
}
