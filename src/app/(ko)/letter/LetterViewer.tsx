'use client';

import { Suspense, useRef, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { toPng } from 'html-to-image';
import { getTemplate } from '@/tools/fun/letterTemplates';

function LetterViewerContent() {
  const searchParams = useSearchParams();
  const value = searchParams.get('v') || '';
  const templateId = parseInt(searchParams.get('t') || '1', 10);
  const template = getTemplate(templateId);
  const letterRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const decodedText = useMemo(() => {
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  }, [value]);

  // 글자수에 따른 폰트 크기
  const fontSize = useMemo(() => {
    const len = decodedText.length;
    if (len <= 20) return 'text-3xl md:text-4xl';
    if (len <= 50) return 'text-2xl md:text-3xl';
    if (len <= 100) return 'text-xl md:text-2xl';
    if (len <= 150) return 'text-lg md:text-xl';
    return 'text-base md:text-lg';
  }, [decodedText]);

  // 이미지 저장
  const handleSaveImage = async () => {
    if (!letterRef.current) return;
    setSaving(true);
    try {
      const dataUrl = await toPng(letterRef.current, {
        backgroundColor: template.bgColor,
        pixelRatio: 2,
      });
      const link = document.createElement('a');
      link.download = 'letter.png';
      link.href = dataUrl;
      link.click();
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  // URL 복사
  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!decodedText) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-6">✉️</div>
        <p className="text-gray-500 dark:text-gray-400 mb-4">편지 내용이 없습니다.</p>
        <a
          href="/tools/letter-qr"
          className="text-blue-500 hover:underline text-sm"
        >
          편지 QR 만들러 가기 →
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      {/* 편지 카드 */}
      <div
        ref={letterRef}
        className={`${template.cardClass} p-8 md:p-12 shadow-lg relative overflow-hidden`}
      >
        {template.cornerDecor && (
          <>
            {template.cornerDecor.topLeft && (
              <span className="absolute top-3 left-3 text-xl opacity-40">{template.cornerDecor.topLeft}</span>
            )}
            {template.cornerDecor.topRight && (
              <span className="absolute top-3 right-3 text-xl opacity-40">{template.cornerDecor.topRight}</span>
            )}
            {template.cornerDecor.bottomLeft && (
              <span className="absolute bottom-3 left-3 text-xl opacity-40">{template.cornerDecor.bottomLeft}</span>
            )}
            {template.cornerDecor.bottomRight && (
              <span className="absolute bottom-3 right-3 text-xl opacity-40">{template.cornerDecor.bottomRight}</span>
            )}
          </>
        )}
        <div className="text-center mb-6">
          <span className="text-5xl">{template.topDecor}</span>
        </div>
        <p className={`${fontSize} leading-relaxed ${template.textClass} whitespace-pre-wrap text-center`}>
          {decodedText}
        </p>
        <div className={`text-right mt-8 text-[10px] ${template.watermarkClass}`}>
          toolpiki.com
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex justify-center gap-3 mt-6">
        <button
          onClick={handleSaveImage}
          disabled={saving}
          className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
        >
          {saving ? '저장 중...' : '🖼️ 이미지 저장'}
        </button>
        <button
          onClick={handleCopyUrl}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          {copied ? '✅ 복사됨!' : '🔗 URL 복사'}
        </button>
      </div>

      {/* 나도 만들기 */}
      <div className="text-center mt-8">
        <a
          href="/tools/letter-qr"
          className="text-blue-500 hover:underline text-sm"
        >
          나도 편지 QR 만들기 →
        </a>
      </div>
    </div>
  );
}

export function LetterViewer() {
  return (
    <Suspense fallback={<div className="text-center py-16 text-gray-400">로딩 중...</div>}>
      <LetterViewerContent />
    </Suspense>
  );
}
