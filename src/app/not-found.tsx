'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

// KR 인기 도구
const popularToolsKr = [
  { slug: 'character-counter', name: '글자수 세기', icon: '🔢' },
  { slug: 'json-formatter', name: 'JSON 포맷터', icon: '📋' },
  { slug: 'image-compress', name: '이미지 압축', icon: '📦' },
  { slug: 'qr-generator', name: 'QR 코드 생성', icon: '📱' },
  { slug: 'color-converter', name: '색상 변환기', icon: '🎨' },
];

// EN 인기 도구
const popularToolsEn = [
  { slug: 'character-counter-en', name: 'Character Counter', icon: '🔢' },
  { slug: 'json-formatter-en', name: 'JSON Formatter', icon: '📋' },
  { slug: 'image-compress-en', name: 'Image Compress', icon: '📦' },
  { slug: 'qr-generator-en', name: 'QR Generator', icon: '📱' },
  { slug: 'color-converter-en', name: 'Color Converter', icon: '🎨' },
];

// KR 카테고리
const categoriesKr = [
  { slug: 'text', name: '텍스트', icon: '📝' },
  { slug: 'image', name: '이미지', icon: '🖼️' },
  { slug: 'calculator', name: '계산/생성', icon: '🔢' },
  { slug: 'fun', name: '재미/테스트', icon: '🎮' },
];

// EN 카테고리
const categoriesEn = [
  { slug: 'text', name: 'Text', icon: '📝' },
  { slug: 'image', name: 'Image', icon: '🖼️' },
  { slug: 'calculator', name: 'Calculator', icon: '🔢' },
  { slug: 'fun', name: 'Fun & Games', icon: '🎮' },
];

export default function NotFound() {
  const [isEn, setIsEn] = useState(false);

  useEffect(() => {
    setIsEn(window.location.pathname.startsWith('/en'));
  }, []);

  const popularTools = isEn ? popularToolsEn : popularToolsKr;
  const categories = isEn ? categoriesEn : categoriesKr;
  const homeHref = isEn ? '/en' : '/';
  const toolsBase = isEn ? '/en/tools' : '/tools';
  const categoryBase = isEn ? '/en' : '/';

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 애니메이션 */}
        <div className="relative mb-8">
          <h1 className="text-[120px] md:text-[180px] font-black text-gray-100 dark:text-gray-800 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl md:text-8xl animate-bounce">🔍</span>
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
          {isEn ? "Oops! Nothing here..." : '앗, 여기엔 아무것도 없어요!'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
          {isEn
            ? "The page you're looking for might have been moved or doesn't exist."
            : '찾으시는 페이지가 사라졌거나 주소가 잘못됐을 수도 있어요.'}
          <br />
          {isEn ? 'How about trying one of these instead? 👇' : '대신 이런 도구들은 어때요? 👇'}
        </p>

        {/* 홈으로 버튼 */}
        <Link
          href={homeHref}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition-all hover:scale-105 mb-12"
        >
          <span>🏠</span>
          {isEn ? 'Back to Home' : '홈으로 돌아가기'}
        </Link>

        {/* 인기 도구 TOP 5 */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-2">
            <span>🔥</span> {isEn ? 'Popular Tools TOP 5' : '인기 도구 TOP 5'}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {popularTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`${toolsBase}/${tool.slug}`}
                className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <span className="text-2xl">{tool.icon}</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                  {tool.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* 카테고리 바로가기 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-2">
            <span>📂</span> {isEn ? 'Browse Categories' : '카테고리 둘러보기'}
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`${categoryBase}?category=${cat.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
              >
                <span>{cat.icon}</span>
                <span className="text-sm font-medium">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
