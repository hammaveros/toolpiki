'use client';

import { useMemo, Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { ToolMeta, CategoryMeta } from '@/types';
import { ToolCard } from './ToolCard';
import { CategoryFilter } from './CategoryFilter';
import { SearchBar } from './SearchBar';
import { useRecentTools } from '@/hooks/useRecentTools';

interface ToolsClientWrapperProps {
  tools: ToolMeta[];
  categories: CategoryMeta[];
  children: React.ReactNode; // 서버에서 렌더된 도구 목록
}

function ToolsClientWrapperContent({ tools, categories, children }: ToolsClientWrapperProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { recentTools, isLoaded: recentLoaded, removeRecent } = useRecentTools();
  const [isHydrated, setIsHydrated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const category = searchParams.get('category') || undefined;

  // 최근 사용 도구 목록
  const recentToolsList = useMemo(() => {
    if (!recentLoaded) return [];
    return recentTools
      .map((slug) => tools.find((t) => t.slug === slug))
      .filter((t): t is ToolMeta => t !== undefined);
  }, [recentTools, tools, recentLoaded]);

  // 검색 필터링 함수
  const filterBySearch = (toolList: ToolMeta[]) => {
    if (!searchQuery.trim()) return toolList;
    const query = searchQuery.toLowerCase().trim();
    return toolList.filter((tool) =>
      tool.name.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.tags?.some((tag) => tag.toLowerCase().includes(query)) ||
      tool.keywords?.some((kw) => kw.toLowerCase().includes(query))
    );
  };

  const filteredTools = useMemo(() => {
    let result: ToolMeta[];
    if (category) {
      result = tools.filter((tool) => tool.category === category);
    } else {
      result = tools;
    }
    return filterBySearch(result);
  }, [tools, category, searchQuery]);

  const handleCategoryChange = (newCategory: string | undefined) => {
    if (newCategory) {
      router.push(`/tools?category=${newCategory}`, { scroll: false });
    } else {
      router.push('/tools', { scroll: false });
    }
  };

  // 카테고리 필터가 없고 검색 중이 아닐 때만 최근 사용 섹션 표시
  const showPersonalSections = !category && !searchQuery && isHydrated && recentToolsList.length > 0;

  // 카테고리 필터가 선택되거나 검색 중인 경우 클라이언트 렌더링 사용
  const showClientList = category !== undefined || searchQuery.trim() !== '';

  return (
    <>
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

      {/* 검색 바 */}
      <div className="mb-4">
        <SearchBar
          placeholder="도구 검색..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </div>

      {/* 카테고리 필터 */}
      <div className="mb-6">
        <CategoryFilter
          categories={categories}
          activeCategory={category}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      {/* 도구 목록: 필터 없으면 서버 렌더링 사용, 필터 있으면 클라이언트 렌더링 */}
      {showClientList ? (
        // 카테고리 필터 또는 검색 적용 시 클라이언트 렌더링
        filteredTools.length > 0 ? (
          <div className="grid gap-2 sm:gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {filteredTools.map((tool) => (
              <ToolCard
                key={tool.slug}
                tool={tool}
                compact
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery ? `"${searchQuery}" 검색 결과가 없습니다` : '해당 조건의 도구가 없습니다'}
            </p>
          </div>
        )
      ) : (
        // 전체 보기: 서버에서 렌더된 도구 목록 사용 (SEO용)
        children
      )}
    </>
  );
}

export function ToolsClientWrapper({ tools, categories, children }: ToolsClientWrapperProps) {
  return (
    <Suspense fallback={children}>
      <ToolsClientWrapperContent tools={tools} categories={categories}>
        {children}
      </ToolsClientWrapperContent>
    </Suspense>
  );
}
