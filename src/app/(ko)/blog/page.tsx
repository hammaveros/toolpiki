import type { Metadata } from 'next';
import { siteConfig } from '@/data/site';
import { BlogListKr } from '@/components/blog/BlogListKr';

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
      <BlogListKr />
    </div>
  );
}
