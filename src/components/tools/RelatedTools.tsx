import { getRelatedTools } from '@/data/tools';
import { ToolCard } from './ToolCard';

interface RelatedToolsProps {
  slugs: string[];
}

/**
 * 관련 도구 섹션
 */
export function RelatedTools({ slugs }: RelatedToolsProps) {
  const relatedTools = getRelatedTools(slugs);

  if (relatedTools.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        관련 도구
      </h2>
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {relatedTools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </section>
  );
}
