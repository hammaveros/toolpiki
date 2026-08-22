import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getToolBySlugEn, getAllToolSlugsEn } from '@/data/tools-en';
import { ToolLayoutEn } from '@/components/tools/ToolLayoutEn';
import { generateToolMetadata } from '@/lib/seo/metadata';
import { blogPostsEn } from '@/data/blog';
import { isRestrictedSlug } from '@/lib/seo/restricted-slugs';

// Tool component registry (reuse KR components)
import { getToolComponent } from '@/tools/registry';

interface ToolPageEnProps {
  params: Promise<{ slug: string }>;
}

// Generate static paths for SSG
export async function generateStaticParams() {
  return getAllToolSlugsEn().map((slug) => ({ slug }));
}

// Generate metadata (회색지대 슬러그는 generateToolMetadata 안에서 noindex가 자동 적용됨)
export async function generateMetadata({
  params,
}: ToolPageEnProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlugEn(slug);

  if (!tool) {
    return { title: 'Tool Not Found' };
  }

  return generateToolMetadata(tool);
}

export default async function ToolPageEn({ params }: ToolPageEnProps) {
  const { slug } = await params;

  const tool = getToolBySlugEn(slug);

  if (!tool) {
    notFound();
  }

  // Blog articles tied to this tool (promo posts of noindexed tools are excluded)
  const relatedArticles = isRestrictedSlug(slug)
    ? []
    : blogPostsEn
        .filter((post) => post.toolSlug === slug)
        .map(({ slug: postSlug, title, description }) => ({ slug: postSlug, title, description }));

  // Get tool component (reuse KR components)
  const ToolComponent = getToolComponent(slug);

  if (!ToolComponent) {
    return (
      <ToolLayoutEn meta={tool}>
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            This tool is coming soon.
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
            Please check back later.
          </p>
        </div>
      </ToolLayoutEn>
    );
  }

  return (
    <ToolLayoutEn meta={tool} articles={relatedArticles}>
      <ToolComponent />
    </ToolLayoutEn>
  );
}
