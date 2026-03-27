'use client';

import { useMemo, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { ToolMeta, CategoryMeta } from '@/types';
import { ToolCard } from './ToolCard';
import { CategoryFilter } from './CategoryFilter';
import { useRecentTools } from '@/hooks/useRecentTools';

interface ToolsClientPageProps {
  tools: ToolMeta[];
  categories: CategoryMeta[];
  isMainPage?: boolean;
  initialSearch?: string;
}

function ToolsClientPageContent({ tools, categories, isMainPage, initialSearch = '' }: ToolsClientPageProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { recentTools, isLoaded: recentLoaded, removeRecent } = useRecentTools();
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  const category = isMainPage ? undefined : (searchParams.get('category') || undefined);

  // 검색 필터링
  const searchFilteredTools = useMemo(() => {
    if (!searchQuery.trim()) return tools;
    const query = searchQuery.toLowerCase().trim();
    return tools.filter((tool) =>
      tool.name.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.keywords?.some((k) => k.toLowerCase().includes(query)) ||
      tool.tags?.some((t) => t.toLowerCase().includes(query))
    );
  }, [tools, searchQuery]);

  // 최근 사용 도구 목록
  const recentToolsList = useMemo(() => {
    if (!recentLoaded) return [];
    return recentTools
      .map((slug) => searchFilteredTools.find((t) => t.slug === slug))
      .filter((t): t is ToolMeta => t !== undefined);
  }, [recentTools, searchFilteredTools, recentLoaded]);

  const filteredTools = useMemo(() => {
    if (category) {
      return searchFilteredTools.filter((tool) => tool.category === category);
    }
    return searchFilteredTools;
  }, [searchFilteredTools, category]);

  // 카테고리별 그룹핑 (전체 보기일 때)
  const toolsByCategory = useMemo(() => {
    if (category) return null;

    const grouped: { category: CategoryMeta; tools: ToolMeta[] }[] = [];

    categories.forEach((cat) => {
      const categoryTools = searchFilteredTools.filter((t) => t.category === cat.slug);
      if (categoryTools.length > 0) {
        grouped.push({ category: cat, tools: categoryTools });
      }
    });

    return grouped;
  }, [searchFilteredTools, categories, category]);

  const handleCategoryChange = (newCategory: string | undefined) => {
    if (newCategory) {
      router.push(`/tools?category=${newCategory}`, { scroll: false });
    } else {
      router.push('/tools', { scroll: false });
    }
  };

  // 카테고리 필터가 없을 때만 최근 사용 섹션 표시 (검색 중에는 숨김)
  const showPersonalSections = !category && !searchQuery.trim() && recentToolsList.length > 0;

  return (
    <>
      {/* 카테고리 필터 + 검색창 */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-3">
          {/* 카테고리 필터 */}
          <div className="flex-1 order-2 sm:order-1">
            <CategoryFilter
              categories={categories}
              activeCategory={category}
              onCategoryChange={handleCategoryChange}
            />
          </div>

          {/* 검색창 */}
          <div className="relative w-full sm:w-48 md:w-56 lg:w-64 order-1 sm:order-2 flex-shrink-0">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="도구 검색..."
              className="w-full px-3 py-2 pl-9 text-sm border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
            <svg
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
        {searchQuery.trim() && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            &quot;{searchQuery}&quot; 검색 결과: {searchFilteredTools.length}개
          </p>
        )}
      </div>

      {/* 최근 사용 섹션 */}
      {showPersonalSections && (
        <div className="mb-8 space-y-6">
          <section>
            <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
              <span>🕘</span>
              최근 사용
            </h2>
            <div className="grid gap-2 sm:gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {recentToolsList.map((tool) => (
                <ToolCard
                  key={tool.slug}
                  tool={tool}
                  compact
                  showRemove
                  onRemove={() => removeRecent(tool.slug)}
                />
              ))}
            </div>
          </section>

          <hr className="border-gray-200 dark:border-gray-700" />
        </div>
      )}

      {/* 도구 그리드 - 카테고리별 그룹핑 또는 단일 리스트 */}
      {toolsByCategory ? (
        // 전체 보기: 카테고리별 섹션
        <div className="space-y-8">
          {toolsByCategory.map(({ category: cat, tools: catTools }) => (
            <section key={cat.slug}>
              <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <span>{cat.icon}</span>
                {cat.name}
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  ({catTools.length})
                </span>
              </h2>
              <div className="grid gap-2 sm:gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                {catTools.map((tool) => (
                  <ToolCard
                    key={tool.slug}
                    tool={tool}
                    compact
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        // 특정 카테고리 선택: 단일 리스트
        <div className="grid gap-2 sm:gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {filteredTools.map((tool) => (
            <ToolCard
              key={tool.slug}
              tool={tool}
              compact
            />
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
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <div
              key={cat.slug}
              className="h-9 w-20 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>

      <div className="grid gap-2 sm:gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {tools.slice(0, 12).map((tool) => (
          <div
            key={tool.slug}
            className="h-20 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"
          />
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
