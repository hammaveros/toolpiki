import type { Metadata } from 'next';
import { siteConfig } from '@/data/site';
import type { ToolMeta } from '@/types';
import { toolsEn } from '@/data/tools-en';

// EN slug 존재 여부 빠른 조회용
const enSlugSet = new Set(toolsEn.map(t => t.slug));

// 기본 메타데이터 생성
export function generateBaseMetadata(): Metadata {
  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: `${siteConfig.name} - ${siteConfig.defaultTitle}`,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.defaultDescription,
    keywords: siteConfig.defaultKeywords,
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    formatDetection: {
      email: false,
      telephone: false,
      address: false,
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: siteConfig.url,
      languages: {
        'ko': siteConfig.url,
        'en': `${siteConfig.url}/en`,
      },
    },
    openGraph: {
      type: 'website',
      locale: siteConfig.locale,
      url: siteConfig.url,
      siteName: siteConfig.name,
      title: `${siteConfig.name} - ${siteConfig.defaultTitle}`,
      description: siteConfig.defaultDescription,
      images: [
        {
          url: `${siteConfig.url}/og-image.png`,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} - 무료 온라인 도구 모음`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${siteConfig.name} - ${siteConfig.defaultTitle}`,
      description: siteConfig.defaultDescription,
      images: [`${siteConfig.url}/og-image.png`],
    },
    verification: {
      google: siteConfig.verification.google || undefined,
      other: {
        ...(siteConfig.verification.naver ? { 'naver-site-verification': siteConfig.verification.naver } : {}),
        ...(siteConfig.verification.bing ? { 'msvalidate.01': siteConfig.verification.bing } : {}),
      },
    },
    category: 'technology',
  };
}

// 도구 페이지 메타데이터 생성
export function generateToolMetadata(tool: ToolMeta): Metadata {
  const url = `${siteConfig.url}/tools/${tool.slug}`;

  // SEO 최적화된 타이틀/설명 우선 사용
  const title = tool.seoTitle || tool.name;
  const description = tool.seoDescription || tool.description;

  // 도구별 특화 키워드 (간결하게)
  const keywords = tool.keywords;

  const canonicalUrl = url;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: (() => {
        const enSlug = `${tool.slug}-en`;
        return {
          'ko': canonicalUrl,
          ...(enSlugSet.has(enSlug) ? { 'en': `${siteConfig.url}/en/tools/${enSlug}` } : {}),
        };
      })(),
    },
    openGraph: {
      type: 'website',
      url,
      title: `${title} | JSSpace`,
      description,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      images: [
        {
          url: `${siteConfig.url}/og-image.png`,
          width: 1200,
          height: 630,
          alt: `${tool.name} - JSSpace`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | JSSpace`,
      description,
      images: [`${siteConfig.url}/og-image.png`],
    },
  };
}

// 도구 목록 페이지 메타데이터
export function generateToolsPageMetadata(): Metadata {
  const url = `${siteConfig.url}/tools`;
  const title = '모든 도구 - 100개 이상의 무료 온라인 유틸리티';
  const description =
    '텍스트 변환, Base64 인코딩, JSON 포맷터, 이미지 압축, 색상 변환, 단위 변환 등 100개 이상의 무료 온라인 도구를 한 곳에서. 회원가입 없이 바로 사용하세요.';

  return {
    title: '모든 도구 - 100개 이상의 무료 온라인 유틸리티',
    description,
    keywords: [
      '온라인 도구 모음',
      '무료 도구',
      '웹 유틸리티',
      '개발자 도구',
      '텍스트 도구',
      '이미지 도구',
      '변환 도구',
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

// 카테고리 페이지 메타데이터
export function generateCategoryMetadata(category: { name: string; slug: string; description: string }): Metadata {
  const url = `${siteConfig.url}/tools?category=${category.slug}`;
  const title = `${category.name} - 무료 온라인 도구`;
  const description = `${category.description} 회원가입 없이 무료로 사용하세요.`;

  return {
    title: category.name,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      siteName: siteConfig.name,
    },
  };
}
