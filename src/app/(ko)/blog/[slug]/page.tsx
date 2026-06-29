import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { blogPostsKr, getBlogPost } from '@/data/blog';
import { siteConfig } from '@/data/site';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPostsKr.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug, 'kr');
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `${siteConfig.url}/blog/${slug}`,
      languages: {
        ko: `${siteConfig.url}/blog/${slug}`,
        en: `${siteConfig.url}/en/blog/${slug}`,
      },
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${siteConfig.url}/blog/${slug}`,
      siteName: siteConfig.name,
      type: 'article',
      publishedTime: post.date,
    },
  };
}

const contentMap: Record<string, () => Promise<{ default: React.ComponentType }>> = {
  'character-counter': () => import('@/content/blog/kr/character-counter'),
  'json-formatter': () => import('@/content/blog/kr/json-formatter'),
  'image-compress': () => import('@/content/blog/kr/image-compress'),
  'qr-generator': () => import('@/content/blog/kr/qr-generator'),
  'base64': () => import('@/content/blog/kr/base64'),
  'text-diff': () => import('@/content/blog/kr/text-diff'),
  'url-encoder': () => import('@/content/blog/kr/url-encoder'),
  'morse-code': () => import('@/content/blog/kr/morse-code'),
  'markdown-preview': () => import('@/content/blog/kr/markdown-preview'),
  'yaml-json-converter': () => import('@/content/blog/kr/yaml-json-converter'),
  'image-convert': () => import('@/content/blog/kr/image-convert'),
  'video-gif-converter': () => import('@/content/blog/kr/video-gif-converter'),
  'color-converter': () => import('@/content/blog/kr/color-converter'),
  'password-strength': () => import('@/content/blog/kr/password-strength'),
  'date-calculator': () => import('@/content/blog/kr/date-calculator'),
  'unit-converter': () => import('@/content/blog/kr/unit-converter'),
  'random-picker': () => import('@/content/blog/kr/random-picker'),
  'regex-tester': () => import('@/content/blog/kr/regex-tester'),
  'unix-timestamp': () => import('@/content/blog/kr/unix-timestamp'),
  'pomodoro-timer': () => import('@/content/blog/kr/pomodoro-timer'),
  'case-converter': () => import('@/content/blog/kr/case-converter'),
  'duplicate-line-remover': () => import('@/content/blog/kr/duplicate-line-remover'),
  'line-break-remover': () => import('@/content/blog/kr/line-break-remover'),
  'line-number': () => import('@/content/blog/kr/line-number'),
  'message-length-checker': () => import('@/content/blog/kr/message-length-checker'),
  'string-escape': () => import('@/content/blog/kr/string-escape'),
  'text-sorter': () => import('@/content/blog/kr/text-sorter'),
  'word-frequency': () => import('@/content/blog/kr/word-frequency'),
  'ascii-converter': () => import('@/content/blog/kr/ascii-converter'),
  'base-converter': () => import('@/content/blog/kr/base-converter'),
  'emoji-picker': () => import('@/content/blog/kr/emoji-picker'),
  'reading-time-calculator': () => import('@/content/blog/kr/reading-time-calculator'),
  'html-entity': () => import('@/content/blog/kr/html-entity'),
  'unicode-converter': () => import('@/content/blog/kr/unicode-converter'),
  'hex-viewer': () => import('@/content/blog/kr/hex-viewer'),
  'base64-image': () => import('@/content/blog/kr/base64-image'),
  'cron-parser': () => import('@/content/blog/kr/cron-parser'),
  'url-query-parser': () => import('@/content/blog/kr/url-query-parser'),
  'json-csv-converter': () => import('@/content/blog/kr/json-csv-converter'),
  'json-path-tester': () => import('@/content/blog/kr/json-path-tester'),
  'sql-formatter': () => import('@/content/blog/kr/sql-formatter'),
  'xml-formatter': () => import('@/content/blog/kr/xml-formatter'),
  'html-boilerplate': () => import('@/content/blog/kr/html-boilerplate'),
  'html-preview': () => import('@/content/blog/kr/html-preview'),
  'minifier': () => import('@/content/blog/kr/minifier'),
  'code-diff': () => import('@/content/blog/kr/code-diff'),
  'http-status-code': () => import('@/content/blog/kr/http-status-code'),
  'jwt-decoder': () => import('@/content/blog/kr/jwt-decoder'),
  'mermaid-diagram': () => import('@/content/blog/kr/mermaid-diagram'),
  'og-preview': () => import('@/content/blog/kr/og-preview'),
  'favicon-generator': () => import('@/content/blog/kr/favicon-generator'),
  'image-color-picker': () => import('@/content/blog/kr/image-color-picker'),
  'image-crop': () => import('@/content/blog/kr/image-crop'),
  'image-resize': () => import('@/content/blog/kr/image-resize'),
  'image-rotate': () => import('@/content/blog/kr/image-rotate'),
  'letter-qr': () => import('@/content/blog/kr/letter-qr'),
  'protobuf-decoder': () => import('@/content/blog/kr/protobuf-decoder'),
  'screen-ruler': () => import('@/content/blog/kr/screen-ruler'),
  'server-time': () => import('@/content/blog/kr/server-time'),
  'speed-test': () => import('@/content/blog/kr/speed-test'),
  'color-blender': () => import('@/content/blog/kr/color-blender'),
  'color-blind-simulator': () => import('@/content/blog/kr/color-blind-simulator'),
  'color-blindness-image': () => import('@/content/blog/kr/color-blindness-image'),
  'color-perception-test': () => import('@/content/blog/kr/color-perception-test'),
  'contrast-checker': () => import('@/content/blog/kr/contrast-checker'),
  'batch-color-converter': () => import('@/content/blog/kr/batch-color-converter'),
  'palette-generator': () => import('@/content/blog/kr/palette-generator'),
  'border-radius-generator': () => import('@/content/blog/kr/border-radius-generator'),
  'gradient-generator': () => import('@/content/blog/kr/gradient-generator'),
  'box-shadow-generator': () => import('@/content/blog/kr/box-shadow-generator'),
  'css-unit-converter': () => import('@/content/blog/kr/css-unit-converter'),
  'flexbox-playground': () => import('@/content/blog/kr/flexbox-playground'),
  'ip-lookup': () => import('@/content/blog/kr/ip-lookup'),
  'reaction-time-test': () => import('@/content/blog/kr/reaction-time-test'),
  'timer': () => import('@/content/blog/kr/timer'),
  'age-calculator': () => import('@/content/blog/kr/age-calculator'),
  'bmi-calculator': () => import('@/content/blog/kr/bmi-calculator'),
  'loan-calculator': () => import('@/content/blog/kr/loan-calculator'),
  'salary-calculator': () => import('@/content/blog/kr/salary-calculator'),
  'timing-test': () => import('@/content/blog/kr/timing-test'),
  'interest-calculator': () => import('@/content/blog/kr/interest-calculator'),
  'meeting-cost-calculator': () => import('@/content/blog/kr/meeting-cost-calculator'),
  'file-size-calculator': () => import('@/content/blog/kr/file-size-calculator'),
  'percentage': () => import('@/content/blog/kr/percentage'),
  'ratio-calculator': () => import('@/content/blog/kr/ratio-calculator'),
  'hash-generator': () => import('@/content/blog/kr/hash-generator'),
  'random-string-generator': () => import('@/content/blog/kr/random-string-generator'),
  'uuid-generator': () => import('@/content/blog/kr/uuid-generator'),
  'fake-data-generator': () => import('@/content/blog/kr/fake-data-generator'),
  'lorem-ipsum': () => import('@/content/blog/kr/lorem-ipsum'),
  'random-decision-maker': () => import('@/content/blog/kr/random-decision-maker'),
  'invoice-generator': () => import('@/content/blog/kr/invoice-generator'),
  'order-picker': () => import('@/content/blog/kr/order-picker'),
  'pros-cons-comparator': () => import('@/content/blog/kr/pros-cons-comparator'),
  'regex-generator': () => import('@/content/blog/kr/regex-generator'),
  'team-picker': () => import('@/content/blog/kr/team-picker'),
  'typing-game': () => import('@/content/blog/kr/typing-game'),
  'ladder-game': () => import('@/content/blog/kr/ladder-game'),
  'number-guess': () => import('@/content/blog/kr/number-guess'),
  'shell-game': () => import('@/content/blog/kr/shell-game'),
  'typing-practice': () => import('@/content/blog/kr/typing-practice'),
  'daily-tarot': () => import('@/content/blog/kr/daily-tarot'),
  'fortune-cookie': () => import('@/content/blog/kr/fortune-cookie'),
  'lotto-generator': () => import('@/content/blog/kr/lotto-generator'),
  'roulette-selector': () => import('@/content/blog/kr/roulette-selector'),
  'korean-english-converter': () => import('@/content/blog/kr/korean-english-converter'),
  'name-compatibility': () => import('@/content/blog/kr/name-compatibility'),
  'nickname-generator': () => import('@/content/blog/kr/nickname-generator'),
  'birthday-compatibility': () => import('@/content/blog/kr/birthday-compatibility'),
  'menu-recommender': () => import('@/content/blog/kr/menu-recommender'),
  'rest-recommender': () => import('@/content/blog/kr/rest-recommender'),
  'weekend-recommender': () => import('@/content/blog/kr/weekend-recommender'),
  'saju-compatibility': () => import('@/content/blog/kr/saju-compatibility'),
  'saju-reading': () => import('@/content/blog/kr/saju-reading'),
  'team-saju': () => import('@/content/blog/kr/team-saju'),
};

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug, 'kr');
  if (!post || !contentMap[slug]) notFound();

  const { default: PostContent } = await contentMap[slug]();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav className="mb-8 text-sm text-gray-500 dark:text-gray-400">
        <Link href="/" className="hover:text-gray-900 dark:hover:text-white transition-colors">홈</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-gray-900 dark:hover:text-white transition-colors">블로그</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">{post.title}</span>
      </nav>

      <PostContent />

      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <Link
          href="/blog"
          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← 블로그 목록으로
        </Link>
      </div>
    </div>
  );
}
