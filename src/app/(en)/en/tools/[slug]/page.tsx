import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getToolBySlugEn, getAllToolSlugsEn } from '@/data/tools-en';
import { ToolLayoutEn } from '@/components/tools/ToolLayoutEn';
import { siteConfig } from '@/data/site';
import { tools } from '@/data/tools';

// Tool component registry (reuse KR components)
import { getToolComponent } from '@/tools/registry';

interface ToolPageEnProps {
  params: Promise<{ slug: string }>;
}

// Generate static paths for SSG
export async function generateStaticParams() {
  return getAllToolSlugsEn().map((slug) => ({ slug }));
}

// Generate metadata
export async function generateMetadata({
  params,
}: ToolPageEnProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlugEn(slug);

  if (!tool) {
    return { title: 'Tool Not Found' };
  }

  const title = tool.name;
  const description = tool.seoDescription || tool.description;

  const canonicalSlug = slug;

  return {
    title,
    description,
    keywords: tool.keywords,
    openGraph: {
      title: `${title} | ToolPiki`,
      description,
      type: 'website',
      locale: 'en_US',
    },
    alternates: {
      canonical: `${siteConfig.url}/en/tools/${canonicalSlug}`,
      languages: (() => {
        const krSlug = canonicalSlug.replace(/-en$/, '');
        const hasKrVersion = tools.some(t => t.slug === krSlug);
        return {
          ...(hasKrVersion ? { 'ko': `${siteConfig.url}/tools/${krSlug}` } : {}),
          'en': `${siteConfig.url}/en/tools/${canonicalSlug}`,
        };
      })(),
    },
  };
}

export default async function ToolPageEn({ params }: ToolPageEnProps) {
  const { slug } = await params;

  const tool = getToolBySlugEn(slug);

  if (!tool) {
    notFound();
  }

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
    <ToolLayoutEn meta={tool}>
      <ToolComponent />
    </ToolLayoutEn>
  );
}
