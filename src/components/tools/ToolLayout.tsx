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
import { AdSlot } from '@/components/ads/AdSlot';

function ToolMidAd() {
  return (
    <div className="mt-8 flex justify-center">
      <AdSlot format="auto" slotId="5012956081" className="w-full max-w-3xl" />
    </div>
  );
}

// 오락/점술 도구 — 면책 문구 표시 대상
const ENTERTAINMENT_SLUGS = new Set([
  'saju-reading', 'saju-compatibility', 'daily-tarot',
  'name-compatibility', 'birthday-compatibility',
  'fortune-cookie', 'lotto-generator',
]);

const CATEGORY_BADGE: Record<string, { label: string; color: string }> = {
  text: { label: '📝 텍스트', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  encoding: { label: '🔐 인코딩', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  formatter: { label: '📋 포맷/변환', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  image: { label: '🖼️ 이미지', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  color: { label: '🎨 색상', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' },
  calculator: { label: '🔢 계산/생성', color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400' },
  fun: { label: '🎮 재미/테스트', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
};

interface ToolLayoutProps {
  meta: ToolMeta;
  children: ReactNode;
}

function ToolHero({ meta, focusMode }: { meta: ToolMeta; focusMode: boolean }) {
  const badge = CATEGORY_BADGE[meta.category];

  if (focusMode) {
    return (
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">{meta.name}</h1>
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-2xl bg-gradient-to-br from-white via-gray-50 to-blue-50/50 dark:from-[var(--bg-surface)] dark:via-[var(--bg-surface)] dark:to-indigo-950/20 border border-gray-200 dark:border-[var(--border-subtle)] p-5 md:p-6">
      {/* 상단: 뒤로가기 + 공유 */}
      <div className="flex items-center justify-between mb-4">
        <Link
          href="/tools"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-[var(--bg-elevated)] rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <ArrowLeftIcon size={12} />
          모든 도구
        </Link>
        <ShareButtons
          url={`https://toolpiki.com/tools/${meta.slug}`}
          title={meta.name}
          description={meta.description}
        />
      </div>

      {/* 아이콘 + 제목 + 설명 */}
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

function ToolLayoutContent({ meta, children }: ToolLayoutProps) {
  const searchParams = useSearchParams();
  const focusMode = searchParams.get('focus') === '1';
  const { recordToolUsage } = useRecentTools();

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

      <article className="max-w-5xl mx-auto px-4 py-4 md:py-6">
        <ToolHero meta={meta} focusMode={focusMode} />

        {/* 메인 콘텐츠 */}
        <div className="tool-content">{children}</div>

        {/* 도구 중간 광고 */}
        {!focusMode && <ToolMidAd />}

        {/* SEO 콘텐츠 */}
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

        {/* FAQ는 각 도구 컴포넌트 내부 FaqSection에서 렌더링 (중복 방지) */}

        {/* 면책 문구 */}
        {!focusMode && ENTERTAINMENT_SLUGS.has(meta.slug) && (
          <div className="mt-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <p className="text-xs text-amber-700 dark:text-amber-400">
              이 도구는 재미와 오락 목적으로 제공됩니다. 과학적·학술적 근거가 없으며, 결과를 실제 의사결정에 사용하지 마세요.
            </p>
          </div>
        )}

        {/* 관련 도구 */}
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
      <article className="max-w-5xl mx-auto px-4 py-4 md:py-6">
        <ToolHero meta={meta} focusMode={false} />
        <div className="tool-content">{children}</div>
        {meta.relatedSlugs && meta.relatedSlugs.length > 0 && (
          <RelatedTools slugs={meta.relatedSlugs} />
        )}
      </article>
    </>
  );
}

export function ToolLayout({ meta, children }: ToolLayoutProps) {
  return (
    <Suspense fallback={<ToolLayoutFallback meta={meta}>{children}</ToolLayoutFallback>}>
      <ToolLayoutContent meta={meta}>{children}</ToolLayoutContent>
    </Suspense>
  );
}
