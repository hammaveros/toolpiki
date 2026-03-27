import type { ToolMeta } from '@/types';
import { ToolCard } from './ToolCard';

interface ToolGridProps {
  tools: ToolMeta[];
  title?: string;
  compact?: boolean;
}

/**
 * 도구 그리드 레이아웃
 * compact: 더 촘촘하게 배치 (4열)
 */
export function ToolGrid({ tools, title, compact = false }: ToolGridProps) {
  if (tools.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">도구가 없습니다.</p>
      </div>
    );
  }

  return (
    <section>
      {title && (
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {title}
        </h2>
      )}
      <div
        className={
          compact
            ? 'grid gap-2 sm:gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
            : 'grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        }
      >
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} compact={compact} />
        ))}
      </div>
    </section>
  );
}
