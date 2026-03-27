'use client';

import type { ReactNode } from 'react';
import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import type { ToolMeta } from '@/types';
import { RelatedTools } from './RelatedTools';
import { JsonLd } from '@/components/seo/JsonLd';
import { generateWebAppJsonLd, generateBreadcrumbJsonLd, generateFAQJsonLd } from '@/lib/seo/jsonld';
import { ArrowLeftIcon } from '@/components/icons';
import { cn } from '@/lib/utils/cn';
import { useRecentTools } from '@/hooks/useRecentTools';
import { ShareButtons } from '@/components/share/ShareButtons';

// 오락/점술 도구 — 면책 문구 표시 대상
const ENTERTAINMENT_SLUGS = new Set([
  'saju-reading', 'saju-compatibility', 'daily-tarot',
  'name-compatibility', 'birthday-compatibility',
  'fortune-cookie', 'lotto-generator',
]);

interface ToolLayoutProps {
  meta: ToolMeta;
  children: ReactNode;
}

function ToolLayoutContent({ meta, children }: ToolLayoutProps) {
  const searchParams = useSearchParams();
  const focusMode = searchParams.get('focus') === '1';
  const { recordToolUsage } = useRecentTools();

  // 페이지 진입 시 최근 이용 도구 자동 기록
  useEffect(() => {
    recordToolUsage(meta.slug);
  }, [meta.slug, recordToolUsage]);

  const jsonLd = generateWebAppJsonLd(meta);
  const breadcrumb = generateBreadcrumbJsonLd([
    { name: '홈', url: '/' },
    { name: '도구', url: '/tools' },
    { name: meta.name },
  ]);
  const faqJsonLd = meta.faqs && meta.faqs.length > 0 ? generateFAQJsonLd(meta.faqs) : null;

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumb} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}

      <article className="container mx-auto px-4 py-1 md:py-2">
        {!focusMode && (
          <div className="mb-1">
            <Link
              href="/tools"
              className={cn(
                'inline-flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500',
                'hover:text-gray-600 dark:hover:text-gray-400 transition-colors'
              )}
            >
              <ArrowLeftIcon size={12} />
              <span>모든 도구</span>
            </Link>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              {meta.name}
            </h1>
            <div className="flex items-center justify-between">
              <p className="text-gray-600 dark:text-gray-400 text-sm flex-1">
                {meta.description}
              </p>
              <ShareButtons
                url={`https://jsspace.online/tools/${meta.slug}`}
                title={meta.name}
                description={meta.description}
                className="ml-3 flex-shrink-0"
              />
            </div>
          </div>
        )}

        {focusMode && (
          <div className="mb-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {meta.name}
            </h1>
          </div>
        )}

        <div className="tool-content">{children}</div>

        {/* SEO 콘텐츠 블록 - 도구 UI 아래, 광고 위 */}
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

        {/* FAQ 섹션 - 검색엔진 & 사용자 모두에게 노출 */}
        {!focusMode && meta.faqs && meta.faqs.length > 0 && (
          <section className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">자주 묻는 질문</h2>
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

        {!focusMode && ENTERTAINMENT_SLUGS.has(meta.slug) && (
          <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <p className="text-xs text-amber-700 dark:text-amber-400">
              이 도구는 재미와 오락 목적으로 제공됩니다. 과학적·학술적 근거가 없으며, 결과를 실제 의사결정에 사용하지 마세요.
            </p>
          </div>
        )}

        {!focusMode && meta.relatedSlugs && meta.relatedSlugs.length > 0 && (
          <RelatedTools slugs={meta.relatedSlugs} />
        )}

      </article>
    </>
  );
}

function ToolLayoutFallback({ meta, children }: ToolLayoutProps) {
  const jsonLd = generateWebAppJsonLd(meta);
  const breadcrumb = generateBreadcrumbJsonLd([
    { name: '홈', url: '/' },
    { name: '도구', url: '/tools' },
    { name: meta.name },
  ]);

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumb} />

      <article className="container mx-auto px-4 py-1 md:py-2">
        <div className="mb-1">
          <Link
            href="/tools"
            className={cn(
              'inline-flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500',
              'hover:text-gray-600 dark:hover:text-gray-400 transition-colors'
            )}
          >
            <ArrowLeftIcon size={12} />
            <span>모든 도구</span>
          </Link>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            {meta.name}
          </h1>
          <div className="flex items-center justify-between">
            <p className="text-gray-600 dark:text-gray-400 text-sm flex-1">
              {meta.description}
            </p>
            <ShareButtons
              url={`https://jsspace.online/tools/${meta.slug}`}
              title={meta.name}
              description={meta.description}
              className="ml-3 flex-shrink-0"
            />
          </div>
        </div>

        <div className="tool-content">{children}</div>


        {meta.relatedSlugs && meta.relatedSlugs.length > 0 && (
          <RelatedTools slugs={meta.relatedSlugs} />
        )}

      </article>
    </>
  );
}

/**
 * 도구 페이지 공통 레이아웃
 * - 제목, 설명
 * - 광고 슬롯
 * - 관련 도구
 * - JSON-LD 구조화 데이터
 */
export function ToolLayout({ meta, children }: ToolLayoutProps) {
  return (
    <Suspense fallback={<ToolLayoutFallback meta={meta}>{children}</ToolLayoutFallback>}>
      <ToolLayoutContent meta={meta}>{children}</ToolLayoutContent>
    </Suspense>
  );
}
