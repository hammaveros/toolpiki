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

  // Dynamic font size based on text length
  const fontSize = useMemo(() => {
    const len = decodedText.length;
    if (len <= 30) return 'text-3xl md:text-4xl';
    if (len <= 80) return 'text-2xl md:text-3xl';
    if (len <= 150) return 'text-xl md:text-2xl';
    if (len <= 300) return 'text-lg md:text-xl';
    return 'text-base md:text-lg';
  }, [decodedText]);

  // Save as image
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

  // Copy URL
  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!decodedText) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-6">✉️</div>
        <p className="text-gray-500 dark:text-gray-400 mb-4">No letter content found.</p>
        <a
          href="/en/tools/letter-qr-en"
          className="text-blue-500 hover:underline text-sm"
        >
          Create your own Letter QR →
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      {/* Letter card */}
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
          jsspace.online
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-3 mt-6">
        <button
          onClick={handleSaveImage}
          disabled={saving}
          className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving...' : 'Save Image'}
        </button>
        <button
          onClick={handleCopyUrl}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          {copied ? 'Copied!' : 'Copy URL'}
        </button>
      </div>

      {/* Create your own */}
      <div className="text-center mt-8">
        <a
          href="/en/tools/letter-qr-en"
          className="text-blue-500 hover:underline text-sm"
        >
          Create your own Letter QR →
        </a>
      </div>
    </div>
  );
}

export function LetterViewerEn() {
  return (
    <Suspense fallback={<div className="text-center py-16 text-gray-400">Loading...</div>}>
      <LetterViewerContent />
    </Suspense>
  );
}
