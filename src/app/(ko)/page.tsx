'use client';

import { tools } from '@/data/tools';
import { categoryList } from '@/data/categories';
import { ToolsClientPage } from '@/components/tools/ToolsClientPage';
import { HomeContent } from '@/components/home/HomeContent';
import { ChatWidget } from '@/components/chat/ChatWidget';
import { useState } from 'react';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      {/* 히어로 섹션 */}
      <section className="relative hero-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/80 via-white/60 to-white dark:from-indigo-950/40 dark:via-[#0f1117]/80 dark:to-[#0f1117] pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 pt-14 pb-10 text-center">
          <p className="text-4xl md:text-5xl font-extrabold mb-3">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ToolPiki
            </span>
          </p>
          <h1 className="text-base md:text-lg text-gray-500 dark:text-gray-400 mb-2">
            설치 없이 바로 쓰는 100가지 무료 온라인 도구
          </h1>
          <p className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-6">
            글자수세기, QR코드, 이미지 압축 <span className="text-blue-600 dark:text-blue-400">외 100+</span>
          </p>

          {/* 검색창 */}
          <div className="relative max-w-xl mx-auto">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="도구 이름이나 기능으로 검색 (예: base64, 이미지 압축...)"
              className="w-full pl-12 pr-10 py-3.5 text-base rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-[var(--bg-surface)] focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 카테고리 필터 + 도구 그리드 */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        {/* 랜선 탕비실 위젯 */}
        <ChatWidget />
        <ToolsClientPage tools={tools} categories={categoryList} isMainPage initialSearch={searchQuery} />
      </section>

      {/* 사이트 소개 콘텐츠 */}
      <section className="max-w-6xl mx-auto px-4 py-8 border-t border-gray-200 dark:border-[var(--border-subtle)]">
        <HomeContent />
      </section>
    </>
  );
}
