import type { MetadataRoute } from 'next';
import { toolsEn } from '@/data/tools-en';
import { siteConfig } from '@/data/site';
import { isRestrictedSlug } from '@/lib/seo/restricted-slugs';

export const dynamic = 'force-static';

const BUILD_DATE = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = `${siteConfig.url}/en`;

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: BUILD_DATE,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: BUILD_DATE,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date('2026-03-01'),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date('2026-03-01'),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date('2026-03-01'),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date('2026-03-01'),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // AdSense 정책 회색지대 도구는 noindex라 sitemap에서도 제외
  const toolPages: MetadataRoute.Sitemap = toolsEn
    .filter((tool) => !isRestrictedSlug(tool.slug))
    .map((tool) => ({
      url: `${baseUrl}/tools/${tool.slug}`,
      lastModified: BUILD_DATE,
      changeFrequency: 'weekly' as const,
      priority: tool.featured ? 0.95 : 0.9,
    }));

  return [...staticPages, ...toolPages];
}
