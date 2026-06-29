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
