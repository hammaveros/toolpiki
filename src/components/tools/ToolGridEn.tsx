import type { ToolMeta } from '@/types';
import { ToolCardEn } from './ToolCardEn';

interface ToolGridEnProps {
  tools: ToolMeta[];
  title?: string;
  compact?: boolean;
}

/**
 * EN Tool Grid Layout
 */
export function ToolGridEn({ tools, title, compact = false }: ToolGridEnProps) {
  if (tools.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No tools found.</p>
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
          <ToolCardEn key={tool.slug} tool={tool} compact={compact} />
        ))}
      </div>
    </section>
  );
}
