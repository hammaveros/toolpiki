'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';

interface ResultShareButtonsProps {
  url: string;
  title?: string;
  description?: string;
  className?: string;
  visible?: boolean;
  canShare?: boolean;
  shareError?: 'TOO_LARGE' | 'ENCODE_ERROR' | null;
}

/**
 * 결과 공유용 버튼 컴포넌트 (KR)
 * visible prop으로 결과가 있을 때만 표시
 * canShare가 false면 에러 메시지 표시
 */
export function ResultShareButtons({
  url,
  title = '',
  description = '',
  className,
  visible = true,
  canShare = true,
  shareError = null,
}: ResultShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  if (!visible) return null;

  // 공유 불가능한 경우 에러 메시지만 표시
  if (!canShare) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {shareError === 'TOO_LARGE' ? '결과가 너무 커서 공유 불가' : '공유 URL 생성 실패'}
        </span>
      </div>
    );
  }

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const buttonClass = cn(
    'inline-flex items-center justify-center rounded-lg transition-colors',
    'w-8 h-8 text-sm hover:opacity-80'
  );

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank', 'width=600,height=400');
  };

  const handleTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, '_blank', 'width=600,height=400');
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="text-xs text-gray-500 dark:text-gray-400">결과 공유</span>
      <div className="flex items-center gap-1">
        {/* 페이스북 */}
        <button
          onClick={handleFacebook}
          className={cn(buttonClass, 'bg-[#1877F2] text-white')}
          title="페이스북 공유"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </button>

        {/* 트위터/X */}
        <button
          onClick={handleTwitter}
          className={cn(buttonClass, 'bg-black text-white dark:bg-white dark:text-black')}
          title="X 공유"
        >
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </button>

        {/* 링크 복사 */}
        <button
          onClick={handleCopyLink}
          className={cn(
            buttonClass,
            'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
            copied && 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
          )}
          title={copied ? '복사됨!' : '링크 복사'}
        >
          {copied ? (
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
