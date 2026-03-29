'use client';

import { useMemo, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { ToolMeta, CategoryMeta } from '@/types';
import { ToolCard } from './ToolCard';
import { CategoryFilter } from './CategoryFilter';
import { useRecentTools } from '@/hooks/useRecentTools';
import Link from 'next/link';

interface ToolsClientPageProps {
  tools: ToolMeta[];
  categories: CategoryMeta[];
  isMainPage?: boolean;
  initialSearch?: string;
  isEnglish?: boolean;
}

function CategorySection({ category: cat, tools: catTools, basePath = '/tools' }: { category: CategoryMeta; tools: ToolMeta[]; basePath?: string }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
        <span className="text-xl" aria-hidden="true">{cat.icon}</span>
        {cat.name}
        <span className="text-sm font-normal text-gray-400 dark:text-gray-500">({catTools.length})</span>
      </h2>
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {catTools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} compact basePath={basePath} />
        ))}
      </div>
    </section>
  );
}

const POPULAR_SLUGS_KR = [
  'saju-reading', 'team-saju', 'qr-generator', 'json-formatter',
  'mermaid-diagram', 'reaction-time-test', 'pomodoro-timer', 'server-time',
];

const POPULAR_SLUGS_EN = [
  'qr-generator-en', 'json-formatter-en', 'mermaid-diagram-en', 'reaction-time-test-en',
  'pomodoro-timer-en', 'character-counter-en', 'server-time-en', 'us-lotto-generator-en',
];

function ToolsClientPageContent({ tools, categories, isMainPage, initialSearch = '', isEnglish = false }: ToolsClientPageProps) {
  const basePath = isEnglish ? '/en/tools' : '/tools';
  const toolsPath = isEnglish ? '/en/tools' : '/tools';
  const searchParams = useSearchParams();
  const router = useRouter();
  const { recentTools, isLoaded: recentLoaded, removeRecent } = useRecentTools();
  const [searchQuery, setSearchQuery] = useState('');

  const effectiveSearch = initialSearch || searchQuery;
  const category = isMainPage ? undefined : (searchParams.get('category') || undefined);

  const searchFilteredTools = useMemo(() => {
    if (!effectiveSearch.trim()) return tools;
    const query = effectiveSearch.toLowerCase().trim();
    return tools.filter((tool) =>
      tool.name.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.keywords?.some((k) => k.toLowerCase().includes(query)) ||
      tool.tags?.some((t) => t.toLowerCase().includes(query))
    );
  }, [tools, effectiveSearch]);

  const popularSlugs = isEnglish ? POPULAR_SLUGS_EN : POPULAR_SLUGS_KR;
  const popularTools = useMemo(() => {
    return popularSlugs
      .map((slug) => tools.find((t) => t.slug === slug))
      .filter((t): t is ToolMeta => t !== undefined);
  }, [tools, popularSlugs]);

  const toolCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    categories.forEach((cat) => {
      if (cat.slug === 'popular') {
        counts[cat.slug] = popularTools.length;
      } else {
        counts[cat.slug] = searchFilteredTools.filter((t) => t.category === cat.slug).length;
      }
    });
    return counts;
  }, [searchFilteredTools, categories, popularTools]);

  const recentToolsList = useMemo(() => {
    if (!recentLoaded) return [];
    return recentTools
      .map((slug) => searchFilteredTools.find((t) => t.slug === slug))
      .filter((t): t is ToolMeta => t !== undefined)
      .slice(0, 8);
  }, [recentTools, searchFilteredTools, recentLoaded]);

  const filteredTools = useMemo(() => {
    if (category === 'popular') return popularTools;
    if (category) return searchFilteredTools.filter((tool) => tool.category === category);
    return searchFilteredTools;
  }, [searchFilteredTools, category, popularTools]);

  const toolsByCategory = useMemo(() => {
    if (category) return null;
    const grouped: { category: CategoryMeta; tools: ToolMeta[] }[] = [];
    categories.forEach((cat) => {
      if (cat.slug === 'popular') {
        if (popularTools.length > 0) {
          grouped.push({ category: cat, tools: popularTools });
        }
      } else {
        const categoryTools = searchFilteredTools.filter((t) => t.category === cat.slug);
        if (categoryTools.length > 0) {
          grouped.push({ category: cat, tools: categoryTools });
        }
      }
    });
    return grouped;
  }, [searchFilteredTools, categories, category, popularTools]);

  const handleCategoryChange = (newCategory: string | undefined) => {
    if (newCategory) {
      router.push(`${toolsPath}?category=${newCategory}`, { scroll: false });
    } else {
      router.push(toolsPath, { scroll: false });
    }
  };

  const showPersonalSections = !category && !effectiveSearch.trim() && recentToolsList.length > 0;

  return (
    <>
      {/* 검색 (도구 페이지에서만) */}
      {!isMainPage && (
        <div className="mb-6 max-w-xl mx-auto">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isEnglish ? "Search tools (e.g. base64, image compress...)" : "도구 이름이나 기능으로 검색 (예: base64, 이미지 압축...)"}
              className="w-full pl-12 pr-10 py-3 text-sm rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-[var(--bg-surface)] focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {searchQuery.trim() && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
              {isEnglish ? `"${searchQuery}": ${searchFilteredTools.length} results` : `"${searchQuery}" 검색 결과: ${searchFilteredTools.length}개`}
            </p>
          )}
        </div>
      )}

      {/* 카테고리 필터 */}
      <div className="mb-8">
        <CategoryFilter
          categories={categories}
          activeCategory={category}
          onCategoryChange={handleCategoryChange}
          toolCounts={toolCounts}
          isEnglish={isEnglish}
        />
      </div>

      {/* 최근 사용 */}
      {showPersonalSections && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
            <span aria-hidden="true">🕘</span> {isEnglish ? 'Recent' : '최근 사용'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {recentToolsList.map((tool) => (
              <Link
                key={tool.slug}
                href={`${basePath}/${tool.slug}`}
                className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[var(--bg-surface)] border border-gray-200 dark:border-[var(--border-subtle)] hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 text-sm"
              >
                <span className="text-base">{tool.icon}</span>
                <span className="text-gray-700 dark:text-gray-300 font-medium">{tool.name}</span>
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeRecent(tool.slug); }}
                  className="text-gray-300 dark:text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity ml-0.5"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 검색 결과 없음 */}
      {effectiveSearch.trim() && searchFilteredTools.length === 0 && (
        <div className="text-center py-16">
          <p className="text-lg text-gray-400 dark:text-gray-500 mb-2">{isEnglish ? 'No results found' : '검색 결과가 없어요'}</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">{isEnglish ? 'Try a different keyword!' : '다른 키워드로 검색해 보세요!'}</p>
        </div>
      )}

      {/* 도구 그리드 */}
      {toolsByCategory ? (
        <div className="space-y-10">
          {toolsByCategory.map(({ category: cat, tools: catTools }) => (
            <CategorySection key={cat.slug} category={cat} tools={catTools} basePath={basePath} />
          ))}
        </div>
      ) : (
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} compact basePath={basePath} />
          ))}
        </div>
      )}
    </>
  );
}

function ToolsClientPageFallback({ tools, categories }: ToolsClientPageProps) {
  return (
    <>
      <div className="mb-6">
        <div className="flex gap-2 flex-wrap justify-center">
          {categories.map((cat) => (
            <div key={cat.slug} className="h-9 w-20 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse" />
          ))}
        </div>
      </div>
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tools.slice(0, 12).map((tool) => (
          <div key={tool.slug} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
        ))}
      </div>
    </>
  );
}

export function ToolsClientPage({ tools, categories, isMainPage, initialSearch }: ToolsClientPageProps) {
  return (
    <Suspense fallback={<ToolsClientPageFallback tools={tools} categories={categories} />}>
      <ToolsClientPageContent tools={tools} categories={categories} isMainPage={isMainPage} initialSearch={initialSearch} />
    </Suspense>
  );
}
