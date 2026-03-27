import type { Metadata } from 'next';
import { toolsEn } from '@/data/tools-en';
import { categoryListEn } from '@/data/categories-en';
import { ToolsServerListEn } from '@/components/tools/ToolsServerListEn';
import { ToolsClientWrapperEn } from '@/components/tools/ToolsClientWrapperEn';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  generateToolListJsonLdEn,
  generateBreadcrumbJsonLdEn,
} from '@/lib/seo/jsonld-en';

export const metadata: Metadata = {
  title: 'All Tools - 100+ Free Online Utilities',
  description: 'Browse all free online tools: JSON formatter, Base64 encoder, image tools, color converters, calculators, and more.',
  keywords: ['online tools', 'web tools', 'developer tools', 'free utilities'],
  openGraph: {
    title: 'All Tools - 100+ Free Online Utilities | ToolPiki',
    description: 'Browse all free online tools for developers and everyday use.',
  },
};

export default function ToolsPageEn() {
  const toolListJsonLd = generateToolListJsonLdEn(toolsEn);
  const breadcrumbJsonLd = generateBreadcrumbJsonLdEn([
    { name: 'Home', url: '/en' },
    { name: 'All Tools', url: '/en/tools' },
  ]);

  return (
    <div className="container mx-auto px-4 py-6">
      <JsonLd data={toolListJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      {/* Page Title - SEO */}
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Free Online Tools
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Text converters, image editors, color tools, calculators and 100+ free tools.
      </p>

      {/* Client Wrapper: filters, favorites, etc. */}
      <ToolsClientWrapperEn tools={toolsEn} categories={categoryListEn}>
        {/* Server rendered tool list (SEO - included in HTML) */}
        <ToolsServerListEn tools={toolsEn} categories={categoryListEn} />
      </ToolsClientWrapperEn>

    </div>
  );
}
