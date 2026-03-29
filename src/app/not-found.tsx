'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const popularToolsKr = [
  { slug: 'saju-reading', name: '사주풀이', icon: '☯️' },
  { slug: 'json-formatter', name: 'JSON 포맷터', icon: '📋' },
  { slug: 'image-compress', name: '이미지 압축', icon: '📦' },
  { slug: 'qr-generator', name: 'QR 코드 생성', icon: '📱' },
  { slug: 'reaction-time-test', name: '반응속도 테스트', icon: '⚡' },
  { slug: 'team-saju', name: '사주팀플', icon: '👥' },
];

const popularToolsEn = [
  { slug: 'json-formatter-en', name: 'JSON Formatter', icon: '📋' },
  { slug: 'image-compress-en', name: 'Image Compress', icon: '📦' },
  { slug: 'qr-generator-en', name: 'QR Generator', icon: '📱' },
  { slug: 'character-counter-en', name: 'Character Counter', icon: '🔢' },
  { slug: 'reaction-time-test-en', name: 'Reaction Test', icon: '⚡' },
  { slug: 'color-converter-en', name: 'Color Converter', icon: '🎨' },
];

export default function NotFound() {
  const [isEn, setIsEn] = useState(false);

  useEffect(() => {
    setIsEn(window.location.pathname.startsWith('/en'));
  }, []);

  const popularTools = isEn ? popularToolsEn : popularToolsKr;
  const homeHref = isEn ? '/en' : '/';
  const toolsBase = isEn ? '/en/tools' : '/tools';

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-4 py-16 md:py-24 text-center">
          {/* 404 */}
          <div className="mb-8">
            <p className="text-8xl md:text-9xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-none select-none">
              404
            </p>
            <div className="mt-4">
              <span className="text-4xl">🔍</span>
            </div>
          </div>

          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {isEn ? "Page not found" : '페이지를 찾을 수 없어요'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            {isEn
              ? "The page you're looking for doesn't exist or has been moved."
              : '주소가 잘못됐거나 삭제된 페이지예요.'}
          </p>

          {/* 홈으로 */}
          <Link
            href={homeHref}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-xl transition-all text-sm mb-10"
          >
            {isEn ? '← Back to Home' : '← 홈으로'}
          </Link>

          {/* 인기 도구 */}
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
              {isEn ? 'Try one of these instead' : '이런 도구는 어때요?'}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {popularTools.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`${toolsBase}/${tool.slug}`}
                  className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-[var(--bg-surface)] rounded-xl border border-gray-200 dark:border-[var(--border-subtle)] hover:border-blue-400 dark:hover:border-blue-600 transition-all text-sm"
                >
                  <span className="text-lg">{tool.icon}</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300 truncate">{tool.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
