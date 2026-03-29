import type { MetadataRoute } from 'next';
import { tools } from '@/data/tools';
import { siteConfig } from '@/data/site';

export const dynamic = 'force-static';

// 빌드 시점의 날짜를 사용 (배포할 때마다 갱신됨)
const BUILD_DATE = new Date();

// 도구별 마지막 수정일 (주요 업데이트 시 갱신)
const TOOL_DATES: Record<string, string> = {
  'saju-reading': '2026-03-29',
  'reaction-time-test': '2026-03-29',
  'nickname-generator': '2026-03-29',
  'character-counter': '2026-03-15',
  'json-formatter': '2026-03-15',
  'image-compress': '2026-03-15',
  'qr-generator': '2026-03-15',
};

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

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

  const toolPages: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${baseUrl}/tools/${tool.slug}`,
    lastModified: TOOL_DATES[tool.slug] ? new Date(TOOL_DATES[tool.slug]) : BUILD_DATE,
    changeFrequency: 'weekly' as const,
    priority: tool.featured ? 0.95 : 0.9,
  }));

  return [...staticPages, ...toolPages];
}
