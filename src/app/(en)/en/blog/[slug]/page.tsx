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
