import type { MetadataRoute } from 'next';
import { siteConfig } from '@/data/site';
import { NOINDEX_SLUGS_KR, NOINDEX_SLUGS_EN, NOINDEX_STATIC_PATHS } from '@/lib/seo/restricted-slugs';

export const dynamic = 'force-static';

// noindex 만으로는 크롤 자체를 막지 못한다(색인만 제외됨).
// 회색지대/얇은 페이지는 크롤러가 아예 읽지 않도록 Disallow 로 차단한다.
function buildDisallowList(): string[] {
  const paths = ['/api/'];

  for (const slug of NOINDEX_SLUGS_KR) {
    paths.push(`/tools/${slug}`);
  }
  for (const slug of NOINDEX_SLUGS_EN) {
    paths.push(`/en/tools/${slug}`);
  }
  for (const path of NOINDEX_STATIC_PATHS) {
    paths.push(path);
    paths.push(`/en${path}`);
  }

  // 색상 상세 페이지는 템플릿형(저품질 판정 리스크)이라 sitemap/색인에서 제외 중 → 크롤도 차단
  paths.push('/tools/color/');
  paths.push('/en/tools/color/');

  return [...new Set(paths)].sort();
}

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: buildDisallowList(),
    },
    sitemap: [
      `${siteConfig.url}/sitemap.xml`,
      `${siteConfig.url}/en/sitemap.xml`,
    ],
  };
}
