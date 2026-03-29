'use client';

import { toolsEn } from '@/data/tools-en';
import { categoryListEn } from '@/data/categories-en';
import { ToolsClientPageEn } from '@/components/tools/ToolsClientPageEn';
import { HomeContentEn } from '@/components/home/HomeContentEn';
import { useState } from 'react';

export default function HomePageEn() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      {/* Hero Section */}
      <section className="relative hero-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/80 via-white/60 to-white dark:from-indigo-950/40 dark:via-[#0f1117]/80 dark:to-[#0f1117] pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 pt-14 pb-10 text-center">
          <p className="text-4xl md:text-5xl font-extrabold mb-3">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ToolPiki
            </span>
          </p>
          <h1 className="text-base md:text-lg text-gray-500 dark:text-gray-400 mb-2">
            100+ Free Online Tools — No Signup Required
          </h1>
          <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
            JSON, QR Code, Image Compress <span className="text-blue-600 dark:text-blue-400">& 100+</span>
          </p>

          {/* Search */}
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
              placeholder="Search tools by name or feature (e.g. base64, image compress...)"
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

      {/* Tool Grid */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        <ToolsClientPageEn tools={toolsEn} categories={categoryListEn} isMainPage initialSearch={searchQuery} />
      </section>

      {/* Site Content */}
      <section className="max-w-6xl mx-auto px-4 py-8 border-t border-gray-200 dark:border-gray-700">
        <HomeContentEn />
      </section>
    </>
  );
}
