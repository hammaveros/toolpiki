'use client';

import { useMemo, Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { ToolMeta, CategoryMeta } from '@/types';
import { ToolCardEn } from './ToolCardEn';
import { CategoryFilterEn } from './CategoryFilterEn';
import { SearchBar } from './SearchBar';
import { useRecentTools } from '@/hooks/useRecentTools';

interface ToolsClientWrapperEnProps {
  tools: ToolMeta[];
  categories: CategoryMeta[];
  children: React.ReactNode; // Server rendered tool list
}

function ToolsClientWrapperEnContent({ tools, categories, children }: ToolsClientWrapperEnProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { recentTools, isLoaded: recentLoaded, removeRecent } = useRecentTools();
  const [isHydrated, setIsHydrated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const category = searchParams.get('category') || undefined;

  // Recent tools list
  const recentToolsList = useMemo(() => {
    if (!recentLoaded) return [];
    return recentTools
      .map((slug) => tools.find((t) => t.slug === slug))
      .filter((t): t is ToolMeta => t !== undefined);
  }, [recentTools, tools, recentLoaded]);

  // Search filter function
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
      router.push(`/en/tools?category=${newCategory}`, { scroll: false });
    } else {
      router.push('/en/tools', { scroll: false });
    }
  };

  // Show recent section only when no category filter and not searching
  const showPersonalSections = !category && !searchQuery && isHydrated && recentToolsList.length > 0;

  // Use client rendering when category is selected or searching
  const showClientList = category !== undefined || searchQuery.trim() !== '';

  return (
    <>
      {/* Recent section */}
      {showPersonalSections && (
        <div className="mb-8 space-y-6">
          <section>
            <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
              <span>🕘</span>
              Recently Used
            </h2>
            <div className="grid gap-2 sm:gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {recentToolsList.map((tool) => (
                <ToolCardEn
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

      {/* Search Bar */}
      <div className="mb-4">
        <SearchBar
          placeholder="Search tools..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <CategoryFilterEn
          categories={categories}
          activeCategory={category}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      {/* Tool list: server rendered for all, client rendered for filtered */}
      {showClientList ? (
        // Category filter or search applied - client rendering
        filteredTools.length > 0 ? (
          <div className="grid gap-2 sm:gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {filteredTools.map((tool) => (
              <ToolCardEn
                key={tool.slug}
                tool={tool}
                compact
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery ? `No results found for "${searchQuery}"` : 'No tools match the selected filter'}
            </p>
          </div>
        )
      ) : (
        // All view: use server rendered list (SEO)
        children
      )}
    </>
  );
}

export function ToolsClientWrapperEn({ tools, categories, children }: ToolsClientWrapperEnProps) {
  return (
    <Suspense fallback={children}>
      <ToolsClientWrapperEnContent tools={tools} categories={categories}>
        {children}
      </ToolsClientWrapperEnContent>
    </Suspense>
  );
}
