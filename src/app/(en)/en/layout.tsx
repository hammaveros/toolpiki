import { Suspense } from 'react';
import { HeaderEn, FooterEn } from '@/components/layout';
import { generateOrganizationJsonLdEn, generateWebSiteJsonLdEn } from '@/lib/seo/jsonld-en';

export default function EnLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* JSON-LD Structured Data for EN */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateOrganizationJsonLdEn()),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateWebSiteJsonLdEn()),
        }}
      />
      <Suspense fallback={null}>
        <HeaderEn />
      </Suspense>
      {children}
      <FooterEn />
    </>
  );
}
