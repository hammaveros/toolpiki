'use client';

import type { ReactNode } from 'react';
import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import type { ToolMeta } from '@/types';
import { RelatedToolsEn } from './RelatedToolsEn';
import { JsonLd } from '@/components/seo/JsonLd';
import { generateWebAppJsonLdEn, generateBreadcrumbJsonLdEn } from '@/lib/seo/jsonld-en';
import { ArrowLeftIcon } from '@/components/icons';
import { cn } from '@/lib/utils/cn';
import { useRecentTools } from '@/hooks/useRecentTools';
import { ShareButtonsEn } from '@/components/share/ShareButtonsEn';
import { AdSlot } from '@/components/ads/AdSlot';

const ENTERTAINMENT_SLUGS_EN = new Set([
  'daily-horoscope-en', 'love-calculator-en',
  'us-lotto-generator-en', 'personality-color-quiz-en',
]);

const CATEGORY_BADGE_EN: Record<string, { label: string; color: string }> = {
  text: { label: '📝 Text', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  encoding: { label: '🔐 Encoding', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  formatter: { label: '📋 Format', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  image: { label: '🖼️ Image', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  color: { label: '🎨 Color', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' },
  calculator: { label: '🔢 Calculate', color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400' },
  fun: { label: '🎮 Fun & Tests', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
};

interface ToolLayoutEnProps {
  meta: ToolMeta;
  children: ReactNode;
}

function ToolHeroEn({ meta, focusMode }: { meta: ToolMeta; focusMode: boolean }) {
  const badge = CATEGORY_BADGE_EN[meta.category];

  if (focusMode) {
    return (
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">{meta.name}</h1>
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-2xl bg-gradient-to-br from-white via-gray-50 to-blue-50/50 dark:from-[var(--bg-surface)] dark:via-[var(--bg-surface)] dark:to-indigo-950/20 border border-gray-200 dark:border-[var(--border-subtle)] p-5 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <Link
          href="/en/tools"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-[var(--bg-elevated)] rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <ArrowLeftIcon size={12} />
          All Tools
        </Link>
        <ShareButtonsEn
          url={`https://toolpiki.com/en/tools/${meta.slug}`}
          title={meta.name}
          description={meta.description}
        />
      </div>
      <div className="flex items-start gap-4">
        <span className="text-4xl md:text-5xl flex-shrink-0" role="img" aria-hidden="true">
          {meta.icon}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              {meta.name}
            </h1>
            {badge && (
              <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold', badge.color)}>
                {badge.label}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            {meta.description}
          </p>
        </div>
      </div>
    </div>
  );
}

function ToolLayoutEnContent({ meta, children }: ToolLayoutEnProps) {
  const searchParams = useSearchParams();
  const focusMode = searchParams.get('focus') === '1';
  const { recordToolUsage } = useRecentTools();

  useEffect(() => {
    recordToolUsage(meta.slug);
  }, [meta.slug, recordToolUsage]);

  const jsonLd = generateWebAppJsonLdEn(meta);
  const breadcrumb = generateBreadcrumbJsonLdEn([
    { name: 'Home', url: '/en' },
    { name: 'Tools', url: '/en/tools' },
    { name: meta.name },
  ]);

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumb} />

      <article className="max-w-5xl mx-auto px-4 py-4 md:py-6">
        <ToolHeroEn meta={meta} focusMode={focusMode} />

        <div className="tool-content">{children}</div>

        {/* Mid ad */}
        {!focusMode && (
          <div className="mt-8 flex justify-center">
            <AdSlot format="auto" slotId="5012956081" className="w-full max-w-3xl" />
          </div>
        )}

        {/* SEO Content */}
        {!focusMode && meta.seoContent && (
          <section className="mt-8 p-5 md:p-6 bg-white dark:bg-[var(--bg-surface)] rounded-2xl border border-gray-200 dark:border-[var(--border-subtle)]">
            <div
              className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-base prose-headings:font-bold prose-headings:text-gray-900 prose-headings:dark:text-white prose-headings:mb-3 prose-p:text-gray-600 prose-p:dark:text-gray-400 prose-p:leading-relaxed prose-p:text-sm"
              dangerouslySetInnerHTML={{
                __html: meta.seoContent
                  .replace(/^## (.+)$/gm, '<h2>$1</h2>')
                  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                  .replace(/^- (.+)$/gm, '<li>$1</li>')
                  .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
                  .replace(/\n\n/g, '</p><p>')
                  .replace(/^/, '<p>')
                  .replace(/$/, '</p>')
                  .replace(/<p><h2>/g, '<h2>')
                  .replace(/<\/h2><\/p>/g, '</h2>')
                  .replace(/<p><ul>/g, '<ul>')
                  .replace(/<\/ul><\/p>/g, '</ul>')
                  .replace(/<p><\/p>/g, ''),
              }}
            />
          </section>
        )}

        {/* FAQ — rendered by component's own FaqSection, not here (avoid duplication) */}

        {/* Disclaimer */}
        {!focusMode && ENTERTAINMENT_SLUGS_EN.has(meta.slug) && (
          <div className="mt-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <p className="text-xs text-amber-700 dark:text-amber-400">
              This tool is for entertainment purposes only. Results have no scientific basis and should not be used for real decisions.
            </p>
          </div>
        )}

        {/* Related tools */}
        {!focusMode && meta.relatedSlugs && meta.relatedSlugs.length > 0 && (
          <RelatedToolsEn slugs={meta.relatedSlugs} />
        )}
      </article>
    </>
  );
}

function ToolLayoutEnFallback({ meta, children }: ToolLayoutEnProps) {
  const jsonLd = generateWebAppJsonLdEn(meta);
  const breadcrumb = generateBreadcrumbJsonLdEn([
    { name: 'Home', url: '/en' },
    { name: 'Tools', url: '/en/tools' },
    { name: meta.name },
  ]);

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumb} />
      <article className="max-w-5xl mx-auto px-4 py-4 md:py-6">
        <ToolHeroEn meta={meta} focusMode={false} />
        <div className="tool-content">{children}</div>
        {meta.relatedSlugs && meta.relatedSlugs.length > 0 && (
          <RelatedToolsEn slugs={meta.relatedSlugs} />
        )}
      </article>
    </>
  );
}

export function ToolLayoutEn({ meta, children }: ToolLayoutEnProps) {
  return (
    <Suspense fallback={<ToolLayoutEnFallback meta={meta}>{children}</ToolLayoutEnFallback>}>
      <ToolLayoutEnContent meta={meta}>{children}</ToolLayoutEnContent>
    </Suspense>
  );
}
