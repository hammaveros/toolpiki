import Link from 'next/link';
import type { ToolMeta, CategoryMeta } from '@/types';
import { cn } from '@/lib/utils/cn';

interface ToolsServerListEnProps {
  tools: ToolMeta[];
  categories: CategoryMeta[];
}

/**
 * Server Component - SEO tool list for EN
 * All tool links are included in HTML for search engine crawling
 */
export function ToolsServerListEn({ tools, categories }: ToolsServerListEnProps) {
  // Group by category
  const toolsByCategory = categories.map((cat) => ({
    category: cat,
    tools: tools.filter((t) => t.category === cat.slug),
  })).filter(({ tools }) => tools.length > 0);

  return (
    <div className="space-y-8">
      {toolsByCategory.map(({ category, tools: catTools }) => (
        <section key={category.slug} id={`category-${category.slug}`}>
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <span>{category.icon}</span>
            {category.name}
            <span className="text-xs text-gray-400 dark:text-gray-500">
              ({catTools.length})
            </span>
          </h2>
          <div className="grid gap-2 sm:gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {catTools.map((tool) => (
              <ToolCardServerEn key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

/**
 * Simple server tool card - link only, no interaction
 */
function ToolCardServerEn({ tool }: { tool: ToolMeta }) {
  const targetSlug = tool.slug;

  return (
    <Link
      href={`/en/tools/${targetSlug}`}
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg border transition-all',
        'bg-white dark:bg-gray-800',
        'border-gray-200 dark:border-gray-700',
        'hover:border-blue-300 dark:hover:border-blue-700',
        'hover:bg-blue-50 dark:hover:bg-blue-900/20'
      )}
    >
      <span className="text-xl flex-shrink-0" role="img" aria-hidden="true">
        {tool.icon}
      </span>
      <span className="font-medium text-gray-900 dark:text-white truncate hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
        {tool.name}
      </span>
    </Link>
  );
}
