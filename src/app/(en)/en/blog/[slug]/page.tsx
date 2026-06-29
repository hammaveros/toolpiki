import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { blogPostsEn, getBlogPost } from '@/data/blog';
import { siteConfig } from '@/data/site';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPostsEn.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug, 'en');
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `${siteConfig.url}/en/blog/${slug}`,
      languages: {
        en: `${siteConfig.url}/en/blog/${slug}`,
        ko: `${siteConfig.url}/blog/${slug}`,
      },
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${siteConfig.url}/en/blog/${slug}`,
      siteName: siteConfig.name,
      type: 'article',
      publishedTime: post.date,
    },
  };
}

const contentMap: Record<string, () => Promise<{ default: React.ComponentType }>> = {
  'character-counter': () => import('@/content/blog/en/character-counter'),
  'json-formatter': () => import('@/content/blog/en/json-formatter'),
  'image-compress': () => import('@/content/blog/en/image-compress'),
  'qr-generator': () => import('@/content/blog/en/qr-generator'),
  'base64': () => import('@/content/blog/en/base64'),
  'text-diff': () => import('@/content/blog/en/text-diff'),
  'url-encoder': () => import('@/content/blog/en/url-encoder'),
  'morse-code': () => import('@/content/blog/en/morse-code'),
  'markdown-preview': () => import('@/content/blog/en/markdown-preview'),
  'yaml-json-converter': () => import('@/content/blog/en/yaml-json-converter'),
  'image-convert': () => import('@/content/blog/en/image-convert'),
  'video-gif-converter': () => import('@/content/blog/en/video-gif-converter'),
  'color-converter': () => import('@/content/blog/en/color-converter'),
  'password-strength': () => import('@/content/blog/en/password-strength'),
  'date-calculator': () => import('@/content/blog/en/date-calculator'),
  'unit-converter': () => import('@/content/blog/en/unit-converter'),
  'random-picker': () => import('@/content/blog/en/random-picker'),
  'regex-tester': () => import('@/content/blog/en/regex-tester'),
  'unix-timestamp': () => import('@/content/blog/en/unix-timestamp'),
  'pomodoro-timer': () => import('@/content/blog/en/pomodoro-timer'),
  'case-converter': () => import('@/content/blog/en/case-converter'),
  'duplicate-line-remover': () => import('@/content/blog/en/duplicate-line-remover'),
  'line-break-remover': () => import('@/content/blog/en/line-break-remover'),
  'line-number': () => import('@/content/blog/en/line-number'),
  'message-length-checker': () => import('@/content/blog/en/message-length-checker'),
  'string-escape': () => import('@/content/blog/en/string-escape'),
  'text-sorter': () => import('@/content/blog/en/text-sorter'),
  'word-frequency': () => import('@/content/blog/en/word-frequency'),
  'ascii-converter': () => import('@/content/blog/en/ascii-converter'),
  'base-converter': () => import('@/content/blog/en/base-converter'),
  'emoji-picker': () => import('@/content/blog/en/emoji-picker'),
  'reading-time-calculator': () => import('@/content/blog/en/reading-time-calculator'),
  'html-entity': () => import('@/content/blog/en/html-entity'),
  'unicode-converter': () => import('@/content/blog/en/unicode-converter'),
  'hex-viewer': () => import('@/content/blog/en/hex-viewer'),
  'base64-image': () => import('@/content/blog/en/base64-image'),
  'cron-parser': () => import('@/content/blog/en/cron-parser'),
  'url-query-parser': () => import('@/content/blog/en/url-query-parser'),
  'json-csv-converter': () => import('@/content/blog/en/json-csv-converter'),
  'json-path-tester': () => import('@/content/blog/en/json-path-tester'),
  'sql-formatter': () => import('@/content/blog/en/sql-formatter'),
  'xml-formatter': () => import('@/content/blog/en/xml-formatter'),
  'html-boilerplate': () => import('@/content/blog/en/html-boilerplate'),
  'html-preview': () => import('@/content/blog/en/html-preview'),
  'minifier': () => import('@/content/blog/en/minifier'),
  'code-diff': () => import('@/content/blog/en/code-diff'),
  'http-status-code': () => import('@/content/blog/en/http-status-code'),
  'jwt-decoder': () => import('@/content/blog/en/jwt-decoder'),
  'mermaid-diagram': () => import('@/content/blog/en/mermaid-diagram'),
  'og-preview': () => import('@/content/blog/en/og-preview'),
  'image-color-picker': () => import('@/content/blog/en/image-color-picker'),
  'image-crop': () => import('@/content/blog/en/image-crop'),
  'image-resize': () => import('@/content/blog/en/image-resize'),
  'image-rotate': () => import('@/content/blog/en/image-rotate'),
  'favicon-generator': () => import('@/content/blog/en/favicon-generator'),
  'letter-qr': () => import('@/content/blog/en/letter-qr'),
  'protobuf-decoder': () => import('@/content/blog/en/protobuf-decoder'),
  'screen-ruler': () => import('@/content/blog/en/screen-ruler'),
  'color-blender': () => import('@/content/blog/en/color-blender'),
  'color-blind-simulator': () => import('@/content/blog/en/color-blind-simulator'),
  'server-time': () => import('@/content/blog/en/server-time'),
  'speed-test': () => import('@/content/blog/en/speed-test'),
  'color-blindness-image': () => import('@/content/blog/en/color-blindness-image'),
  'color-perception-test': () => import('@/content/blog/en/color-perception-test'),
  'contrast-checker': () => import('@/content/blog/en/contrast-checker'),
  'batch-color-converter': () => import('@/content/blog/en/batch-color-converter'),
  'gradient-generator': () => import('@/content/blog/en/gradient-generator'),
  'palette-generator': () => import('@/content/blog/en/palette-generator'),
  'border-radius-generator': () => import('@/content/blog/en/border-radius-generator'),
  'box-shadow-generator': () => import('@/content/blog/en/box-shadow-generator'),
  'css-unit-converter': () => import('@/content/blog/en/css-unit-converter'),
  'flexbox-playground': () => import('@/content/blog/en/flexbox-playground'),
  'timer': () => import('@/content/blog/en/timer'),
  'ip-lookup': () => import('@/content/blog/en/ip-lookup'),
  'reaction-time-test': () => import('@/content/blog/en/reaction-time-test'),
  'timing-test': () => import('@/content/blog/en/timing-test'),
  'bmi-calculator': () => import('@/content/blog/en/bmi-calculator'),
  'interest-calculator': () => import('@/content/blog/en/interest-calculator'),
  'loan-calculator': () => import('@/content/blog/en/loan-calculator'),
  'meeting-cost-calculator': () => import('@/content/blog/en/meeting-cost-calculator'),
  'file-size-calculator': () => import('@/content/blog/en/file-size-calculator'),
  'percentage': () => import('@/content/blog/en/percentage'),
  'ratio-calculator': () => import('@/content/blog/en/ratio-calculator'),
  'gpa-calculator': () => import('@/content/blog/en/gpa-calculator'),
  'hash-generator': () => import('@/content/blog/en/hash-generator'),
  'tip-calculator': () => import('@/content/blog/en/tip-calculator'),
  'uuid-generator': () => import('@/content/blog/en/uuid-generator'),
  'fake-data-generator': () => import('@/content/blog/en/fake-data-generator'),
  'lorem-ipsum': () => import('@/content/blog/en/lorem-ipsum'),
  'random-decision-maker': () => import('@/content/blog/en/random-decision-maker'),
  'random-string-generator': () => import('@/content/blog/en/random-string-generator'),
  'invoice-generator': () => import('@/content/blog/en/invoice-generator'),
  'pros-cons-comparator': () => import('@/content/blog/en/pros-cons-comparator'),
  'regex-generator': () => import('@/content/blog/en/regex-generator'),
  'order-picker': () => import('@/content/blog/en/order-picker'),
  'team-picker': () => import('@/content/blog/en/team-picker'),
  'typing-game': () => import('@/content/blog/en/typing-game'),
  'number-guess': () => import('@/content/blog/en/number-guess'),
  'shell-game': () => import('@/content/blog/en/shell-game'),
  'typing-practice': () => import('@/content/blog/en/typing-practice'),
  'daily-horoscope': () => import('@/content/blog/en/daily-horoscope'),
  'ladder-game': () => import('@/content/blog/en/ladder-game'),
  'roulette-selector': () => import('@/content/blog/en/roulette-selector'),
  'love-calculator': () => import('@/content/blog/en/love-calculator'),
  'ship-name-generator': () => import('@/content/blog/en/ship-name-generator'),
  'us-lotto-generator': () => import('@/content/blog/en/us-lotto-generator'),
  'personality-color-quiz': () => import('@/content/blog/en/personality-color-quiz'),
};

export default async function BlogPostPageEn({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug, 'en');
  if (!post || !contentMap[slug]) notFound();

  const { default: PostContent } = await contentMap[slug]();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav className="mb-8 text-sm text-gray-500 dark:text-gray-400">
        <Link href="/en" className="hover:text-gray-900 dark:hover:text-white transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/en/blog" className="hover:text-gray-900 dark:hover:text-white transition-colors">Blog</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">{post.title}</span>
      </nav>

      <PostContent />

      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <Link
          href="/en/blog"
          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Back to Blog
        </Link>
      </div>
    </div>
  );
}
