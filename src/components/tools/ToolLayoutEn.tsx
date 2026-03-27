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

      <article className="container mx-auto px-4 py-1 md:py-2">
        {!focusMode && (
          <div className="mb-1">
            <Link
              href="/en/tools"
              className={cn(
                'inline-flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500',
                'hover:text-gray-600 dark:hover:text-gray-400 transition-colors'
              )}
            >
              <ArrowLeftIcon size={12} />
              <span>All Tools</span>
            </Link>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              {meta.name}
            </h1>
            <div className="flex items-center justify-between">
              <p className="text-gray-600 dark:text-gray-400 text-sm flex-1">
                {meta.description}
              </p>
              <ShareButtonsEn
                url={`https://jsspace.online/en/tools/${meta.slug}`}
                title={meta.name}
                description={meta.description}
                className="ml-3 flex-shrink-0"
              />
            </div>
          </div>
        )}

        {focusMode && (
          <div className="flex items-center gap-2 mb-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {meta.name}
            </h1>
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

      <article className="container mx-auto px-4 py-1 md:py-2">
        <div className="mb-1">
          <Link
            href="/en/tools"
            className={cn(
              'inline-flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500',
              'hover:text-gray-600 dark:hover:text-gray-400 transition-colors'
            )}
          >
            <ArrowLeftIcon size={12} />
            <span>All Tools</span>
          </Link>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            {meta.name}
          </h1>
          <div className="flex items-center justify-between">
            <p className="text-gray-600 dark:text-gray-400 text-sm flex-1">
              {meta.description}
            </p>
            <ShareButtonsEn
              url={`https://jsspace.online/en/tools/${meta.slug}`}
              title={meta.name}
              description={meta.description}
              className="ml-3 flex-shrink-0"
            />
          </div>
        </div>

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
