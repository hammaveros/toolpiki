import Link from 'next/link';
import type { ToolMeta, CategoryMeta } from '@/types';
import { cn } from '@/lib/utils/cn';

interface ToolsServerListProps {
  tools: ToolMeta[];
  categories: CategoryMeta[];
}

/**
 * 서버 컴포넌트 - SEO용 도구 목록
 * HTML에 모든 도구 링크가 포함되어 검색엔진이 크롤링 가능
 * 클라이언트 인터랙션(필터, 즐겨찾기)은 별도 컴포넌트에서 처리
 */
export function ToolsServerList({ tools, categories }: ToolsServerListProps) {
  // 카테고리별로 그룹핑
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
              <ToolCardServer key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

/**
 * 서버용 심플 도구 카드 - 인터랙션 없이 링크만 제공
 */
function ToolCardServer({ tool }: { tool: ToolMeta }) {
  const targetSlug = tool.slug;

  return (
    <Link
      href={`/tools/${targetSlug}`}
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
