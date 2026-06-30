import type { Metadata } from 'next';
import { siteConfig } from '@/data/site';
import { BlogListEn } from '@/components/blog/BlogListEn';

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
      <BlogListEn />
    </div>
  );
}
