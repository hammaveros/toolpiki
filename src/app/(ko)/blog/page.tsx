import type { Metadata } from 'next';
import Link from 'next/link';
import { blogPostsKr } from '@/data/blog';
import { siteConfig } from '@/data/site';

export const metadata: Metadata = {
  title: `블로그 - ${siteConfig.name}`,
  description: '온라인 도구 활용법, 개발 팁, 실무에서 마주치는 불편함을 해결하는 방법을 정리한 글 모음입니다.',
  alternates: {
    canonical: `${siteConfig.url}/blog`,
  },
};

export default function BlogPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">블로그</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-10">
        온라인 도구 활용법, 개발 팁, 실무에서 마주치는 불편함을 해결하는 방법.
      </p>

      <div className="space-y-6">
        {blogPostsKr.map((post) => (
          <article key={post.slug} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                {post.category}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">{post.date}</span>
              <span className="text-xs text-gray-400 dark:text-gray-500">· {post.readingTime}분</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {post.title}
              </Link>
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              {post.description}
            </p>
            <Link
              href={`/blog/${post.slug}`}
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              읽기 →
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
