import type { Metadata } from 'next';
import Link from 'next/link';
import { blogPostsEn } from '@/data/blog';
import { siteConfig } from '@/data/site';

export const metadata: Metadata = {
  title: `Blog - ${siteConfig.name}`,
  description: 'Practical tips on using online tools, developer workflows, and solutions to everyday friction points.',
  alternates: {
    canonical: `${siteConfig.url}/en/blog`,
  },
};

export default function BlogPageEn() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Blog</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-10">
        Practical tips on online tools, developer workflows, and everyday friction points.
      </p>

      <div className="space-y-6">
        {blogPostsEn.map((post) => (
          <article key={post.slug} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                {post.category}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">{post.date}</span>
              <span className="text-xs text-gray-400 dark:text-gray-500">· {post.readingTime} min read</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              <Link href={`/en/blog/${post.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {post.title}
              </Link>
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              {post.description}
            </p>
            <Link
              href={`/en/blog/${post.slug}`}
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              Read more →
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
