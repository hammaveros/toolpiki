import { getRelatedToolsEn } from '@/data/tools-en';
import { ToolCardEn } from './ToolCardEn';

interface RelatedToolsEnProps {
  slugs: string[];
}

/**
 * EN Related Tools Section
 */
export function RelatedToolsEn({ slugs }: RelatedToolsEnProps) {
  const relatedTools = getRelatedToolsEn(slugs);

  if (relatedTools.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Related Tools
      </h2>
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {relatedTools.map((tool) => (
          <ToolCardEn key={tool.slug} tool={tool} />
        ))}
      </div>
    </section>
  );
}
