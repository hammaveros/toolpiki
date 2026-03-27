'use client';

import { cn } from '@/lib/utils/cn';
import type { CategoryMeta } from '@/types';

interface CategoryFilterEnProps {
  categories: CategoryMeta[];
  activeCategory?: string;
  onCategoryChange?: (category: string | undefined) => void;
}

/**
 * EN Category Filter Component (flat buttons)
 */
export function CategoryFilterEn({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryFilterEnProps) {
  const handleCategoryClick = (slug: string | undefined) => {
    onCategoryChange?.(slug);
  };

  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2">
      {/* All Button */}
      <FilterButton
        active={!activeCategory}
        onClick={() => handleCategoryClick(undefined)}
      >
        All
      </FilterButton>

      {/* Category Buttons */}
      {categories.map((category) => (
        <FilterButton
          key={category.slug}
          active={activeCategory === category.slug}
          onClick={() => handleCategoryClick(category.slug)}
        >
          <span className="mr-1">{category.icon}</span>
          {category.name}
        </FilterButton>
      ))}
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors',
        'min-h-[32px] sm:min-h-[36px]',
        active
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
      )}
    >
      {children}
    </button>
  );
}
