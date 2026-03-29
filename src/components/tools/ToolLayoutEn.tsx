'use client';

import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import type { ToolMeta } from '@/types';
import { RelatedToolsEn } from './RelatedToolsEn';
import { JsonLd } from '@/components/seo/JsonLd';
import { generateWebAppJsonLdEn, generateBreadcrumbJsonLdEn } from '@/lib/seo/jsonld-en';
import { ArrowLeftIcon } from '@/components/icons';
import { cn } from '@/lib/utils/cn';
import { ShareButtonsEn } from '@/components/share/ShareButtonsEn';

// Entertainment/fortune tools — show disclaimer
const ENTERTAINMENT_SLUGS_EN = new Set([
  'daily-horoscope', 'love-calculator',
  'daily-tarot-en', 'saju-reading-en', 'saju-compatibility-en',
  'name-compatibility-en', 'birthday-compatibility-en',
  'fortune-cookie-en',
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

function ToolLayoutEnContent({ meta, children }: ToolLayoutEnProps) {
  const searchParams = useSearchParams();
  const focusMode = searchParams.get('focus') === '1';

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
        {!focusMode && (() => {
          const badge = CATEGORY_BADGE_EN[meta.category];
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
        })()}

        {focusMode && (
          <div className="mb-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{meta.name}</h1>
          </div>
        )}

        <div className="tool-content">{children}</div>

        {/* SEO Content Block - Below tool UI, above middle ad */}
        {!focusMode && meta.seoContent && (
          <section className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div
              className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-sm prose-headings:font-semibold prose-headings:mb-2 prose-p:text-gray-600 prose-p:dark:text-gray-400 prose-p:leading-relaxed prose-p:text-sm"
              dangerouslySetInnerHTML={{
                __html: meta.seoContent
                  .replace(/^## (.+)$/gm, '<h2>$1</h2>')
                  .replace(/\n\n/g, '</p><p>')
                  .replace(/^/, '<p>')
                  .replace(/$/, '</p>')
                  .replace(/<p><h2>/g, '<h2>')
                  .replace(/<\/h2><\/p>/g, '</h2>')
                  .replace(/<p><\/p>/g, ''),
              }}
            />
          </section>
        )}

        {/* FAQ Section - visible to both crawlers and users */}
        {!focusMode && meta.faqs && meta.faqs.length > 0 && (
          <section className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Frequently Asked Questions</h2>
            <dl className="space-y-3">
              {meta.faqs.map((faq, i) => (
                <div key={i}>
                  <dt className="text-sm font-medium text-gray-800 dark:text-gray-200">{faq.question}</dt>
                  <dd className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {!focusMode && ENTERTAINMENT_SLUGS_EN.has(meta.slug) && (
          <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <p className="text-xs text-amber-700 dark:text-amber-400">
              This tool is for entertainment purposes only. Results have no scientific basis and should not be used for real decisions.
            </p>
          </div>
        )}

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
        {(() => {
          const badge = CATEGORY_BADGE_EN[meta.category];
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
        })()}

        <div className="tool-content">{children}</div>

        {/* SEO Content Block */}
        {meta.seoContent && (
          <section className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div
              className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-sm prose-headings:font-semibold prose-headings:mb-2 prose-p:text-gray-600 prose-p:dark:text-gray-400 prose-p:leading-relaxed prose-p:text-sm"
              dangerouslySetInnerHTML={{
                __html: meta.seoContent
                  .replace(/^## (.+)$/gm, '<h2>$1</h2>')
                  .replace(/\n\n/g, '</p><p>')
                  .replace(/^/, '<p>')
                  .replace(/$/, '</p>')
                  .replace(/<p><h2>/g, '<h2>')
                  .replace(/<\/h2><\/p>/g, '</h2>')
                  .replace(/<p><\/p>/g, ''),
              }}
            />
          </section>
        )}


        {meta.relatedSlugs && meta.relatedSlugs.length > 0 && (
          <RelatedToolsEn slugs={meta.relatedSlugs} />
        )}

      </article>
    </>
  );
}

/**
 * EN Tool Page Layout
 */
export function ToolLayoutEn({ meta, children }: ToolLayoutEnProps) {
  return (
    <Suspense fallback={<ToolLayoutEnFallback meta={meta}>{children}</ToolLayoutEnFallback>}>
      <ToolLayoutEnContent meta={meta}>{children}</ToolLayoutEnContent>
    </Suspense>
  );
}
