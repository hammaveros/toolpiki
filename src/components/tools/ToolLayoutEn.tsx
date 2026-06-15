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
      <div className="mb-2">
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">{meta.name}</h1>
      </div>
    );
  }

  return (
    <div className="mb-3 rounded-xl bg-gradient-to-br from-white via-gray-50 to-blue-50/50 dark:from-[var(--bg-surface)] dark:via-[var(--bg-surface)] dark:to-indigo-950/20 border border-gray-200 dark:border-[var(--border-subtle)] p-3 md:p-4">
      <div className="flex items-center justify-between mb-2">
        <Link
          href="/en/tools"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-[var(--bg-elevated)] rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
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
      <div className="flex items-start gap-3">
        <span className="text-2xl md:text-3xl flex-shrink-0 leading-none mt-0.5" role="img" aria-hidden="true">
          {meta.icon}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
              {meta.name}
            </h1>
            {badge && (
              <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold', badge.color)}>
                {badge.label}
              </span>
            )}
          </div>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 leading-snug line-clamp-2">
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

      <article className="max-w-7xl mx-auto px-3 md:px-4 py-2 md:py-3">
        <ToolHeroEn meta={meta} focusMode={focusMode} />

        <div className="tool-content">{children}</div>

        {/* Mid ad */}
        {!focusMode && (
          <div className="mt-4 flex justify-center">
            <AdSlot format="auto" slotId="5012956081" className="w-full max-w-3xl" />
          </div>
        )}

        {/*
          meta.seoContent is intentionally NOT rendered here.
          Each tool component already renders a richer, unique SeoContent() block.
          Rendering the generic tools-en.ts template on top of it produced a duplicate
          "What is ...?" section on the same page (AdSense thin/duplicate content). → removed.
          FAQ is rendered by the component's own FaqSection (avoid duplication).
        */}

        {/* Disclaimer */}
        {!focusMode && ENTERTAINMENT_SLUGS_EN.has(meta.slug) && (
          <div className="mt-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
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
      <article className="max-w-7xl mx-auto px-3 md:px-4 py-2 md:py-3">
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
