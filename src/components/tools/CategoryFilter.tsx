'use client';

import { cn } from '@/lib/utils/cn';
import type { CategoryMeta } from '@/types';

interface CategoryFilterProps {
  categories: CategoryMeta[];
  activeCategory?: string;
  onCategoryChange?: (category: string | undefined) => void;
  toolCounts?: Record<string, number>;
  isEnglish?: boolean;
}

export function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
  toolCounts,
  isEnglish,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-nowrap gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none sm:flex-wrap sm:justify-center">
      <FilterButton
        active={!activeCategory}
        onClick={() => onCategoryChange?.(undefined)}
      >
        {isEnglish ? 'All' : '전체'}
      </FilterButton>
      {categories.map((category) => (
        <FilterButton
          key={category.slug}
          active={activeCategory === category.slug}
          onClick={() => onCategoryChange?.(category.slug)}
          slug={category.slug}
        >
          <span className="mr-1">{category.icon}</span>
          {category.name}
          {toolCounts && toolCounts[category.slug] !== undefined && (
            <span className="ml-1 text-[10px] opacity-70">{toolCounts[category.slug]}</span>
          )}
        </FilterButton>
      ))}
    </div>
  );
}

const CATEGORY_ACTIVE_COLORS: Record<string, string> = {
  popular: 'bg-red-500',
  text: 'bg-blue-500',
  encoding: 'bg-purple-500',
  formatter: 'bg-emerald-500',
  image: 'bg-amber-500',
  color: 'bg-pink-500',
  calculator: 'bg-cyan-500',
  fun: 'bg-orange-500',
};

function FilterButton({
  active,
  onClick,
  children,
  slug,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  slug?: string;
}) {
  const activeColor = slug ? CATEGORY_ACTIVE_COLORS[slug] || 'bg-blue-600' : 'bg-blue-600';

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0',
        'min-h-[32px] sm:min-h-[36px]',
        active
          ? `${activeColor} text-white shadow-sm`
          : 'bg-gray-100 dark:bg-[var(--bg-surface)] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[var(--bg-elevated)] hover:text-gray-900 dark:hover:text-white'
      )}
    >
      {children}
    </button>
  );
}
