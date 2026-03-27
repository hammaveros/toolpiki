import type { MetadataRoute } from 'next';
import { toolsEn } from '@/data/tools-en';
import { siteConfig } from '@/data/site';

export const dynamic = 'force-static';

// 사이트맵 lastModified 고정 날짜 (빌드마다 바뀌지 않도록)
const LAST_MODIFIED = new Date('2026-01-17');

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = `${siteConfig.url}/en`;

  // 정적 페이지
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // 도구 페이지 - 도구가 메인보다 높은 우선순위
  const toolPages: MetadataRoute.Sitemap = toolsEn.map((tool) => ({
    url: `${baseUrl}/tools/${tool.slug}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: 'weekly' as const,
    priority: tool.featured ? 0.95 : 0.9,
  }));

  return [...staticPages, ...toolPages];
}
