'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { blogPostsKr } from '@/data/blog';

export function BlogListKr() {
  const [activeCategory, setActiveCategory] = useState('전체');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(blogPostsKr.map((p) => p.category))).sort();
    return ['전체', ...cats];
  }, []);

  const filtered =
    activeCategory === '전체'
      ? blogPostsKr
      : blogPostsKr.filter((p) => p.category === activeCategory);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const p of blogPostsKr) {
      map[p.category] = (map[p.category] || 0) + 1;
    }
    return map;
  }, []);

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCategory('전체')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            activeCategory === '전체'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          전체 <span className="ml-1 text-xs opacity-70">({blogPostsKr.length})</span>
        </button>
        {categories.slice(1).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {cat} <span className="ml-1 text-xs opacity-70">({counts[cat] || 0})</span>
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {filtered.map((post) => (
          <article
            key={post.slug}
            className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                {post.category}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">{post.date}</span>
              <span className="text-xs text-gray-400 dark:text-gray-500">· {post.readingTime}분</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              <Link
                href={`/blog/${post.slug}`}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
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
    </>
  );
}
