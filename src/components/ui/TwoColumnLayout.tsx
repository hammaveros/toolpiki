'use client';

import { cn } from '@/lib/utils/cn';
import type { ReactNode } from 'react';

interface TwoColumnLayoutProps {
  leftLabel?: string;
  rightLabel?: string;
  leftHeader?: ReactNode;
  rightHeader?: ReactNode;
  left: ReactNode;
  right: ReactNode;
  className?: string;
}

/**
 * 2단 레이아웃 컴포넌트
 * - 모바일: 세로 (위아래)
 * - PC (lg 이상): 가로 (좌우)
 * - 양쪽 헤더와 컨텐츠가 같은 높이에서 시작
 */
export function TwoColumnLayout({
  leftLabel,
  rightLabel,
  leftHeader,
  rightHeader,
  left,
  right,
  className,
}: TwoColumnLayoutProps) {
  const hasAnyHeader = leftLabel || leftHeader || rightLabel || rightHeader;

  return (
    <div className={cn('grid grid-cols-1 lg:grid-cols-2 gap-6', className)}>
      {/* 왼쪽 (입력) */}
      <div className="flex flex-col">
        {hasAnyHeader && (
          <div className="flex justify-between items-center h-9 mb-2">
            {leftLabel ? (
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {leftLabel}
              </label>
            ) : (
              <span />
            )}
            <div className="flex items-center">{leftHeader}</div>
          </div>
        )}
        <div className="flex-1">{left}</div>
      </div>

      {/* 오른쪽 (출력) */}
      <div className="flex flex-col">
        {hasAnyHeader && (
          <div className="flex justify-between items-center h-9 mb-2">
            {rightLabel ? (
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {rightLabel}
              </label>
            ) : (
              <span />
            )}
            <div className="flex items-center">{rightHeader}</div>
          </div>
        )}
        <div className="flex-1">{right}</div>
      </div>
    </div>
  );
}
