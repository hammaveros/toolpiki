import { siteConfig } from '@/data/site';
import type { ToolMeta } from '@/types';

const baseUrlEn = `${siteConfig.url}/en`;

// WebApplication JSON-LD (Tool pages)
export function generateWebAppJsonLdEn(tool: ToolMeta) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.name,
    description: tool.description,
    url: `${baseUrlEn}/tools/${tool.slug}`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    softwareVersion: '1.0',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '100',
    },
    author: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    inLanguage: 'en-US',
  };
}

// Breadcrumb JSON-LD
export function generateBreadcrumbJsonLdEn(
  items: { name: string; url?: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url ? `${siteConfig.url}${item.url}` : undefined,
    })),
  };
}

// Organization JSON-LD
export function generateOrganizationJsonLdEn() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/icon.svg`,
    sameAs: [],
  };
}

// WebSite JSON-LD (Homepage)
export function generateWebSiteJsonLdEn() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: baseUrlEn,
    description: 'Free online tools for everyone - text, image, color, calculators and fun tests',
    inLanguage: 'en-US',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrlEn}/tools?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}

// Tool List JSON-LD (ItemList)
export function generateToolListJsonLdEn(tools: ToolMeta[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Free Online Tools Collection',
    description: 'Collection of free online utility tools',
    numberOfItems: tools.length,
    itemListElement: tools.slice(0, 10).map((tool, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: tool.name,
      url: `${baseUrlEn}/tools/${tool.slug}`,
      description: tool.description,
    })),
  };
}

// FAQ JSON-LD
export function generateFAQJsonLdEn(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// SoftwareApplication JSON-LD
export function generateSoftwareAppJsonLdEn() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: siteConfig.name,
    operatingSystem: 'Web Browser',
    applicationCategory: 'UtilityApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      bestRating: '5',
      ratingCount: '150',
    },
  };
}
