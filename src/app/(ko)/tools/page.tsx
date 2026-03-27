import type { Metadata } from 'next';
import { tools } from '@/data/tools';
import { categoryList } from '@/data/categories';
import { generateToolsPageMetadata } from '@/lib/seo/metadata';
import { ToolsServerList } from '@/components/tools/ToolsServerList';
import { ToolsClientWrapper } from '@/components/tools/ToolsClientWrapper';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  generateToolListJsonLd,
  generateBreadcrumbJsonLd,
} from '@/lib/seo/jsonld';

export const metadata: Metadata = generateToolsPageMetadata();

export default function ToolsPage() {
  const toolListJsonLd = generateToolListJsonLd(tools);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: '홈', url: '/' },
    { name: '모든 도구', url: '/tools' },
  ]);

  return (
    <div className="container mx-auto px-4 py-6">
      <JsonLd data={toolListJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      {/* 페이지 제목 - SEO용 */}
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        무료 온라인 도구 모음
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        텍스트 변환, 이미지 편집, 색상 도구, 계산기 등 100개 이상의 도구를 무료로 사용하세요.
      </p>

      {/* 클라이언트 래퍼: 필터, 즐겨찾기 등 인터랙션 */}
      <ToolsClientWrapper tools={tools} categories={categoryList}>
        {/* 서버 렌더링 도구 목록 (SEO용 - HTML에 포함됨) */}
        <ToolsServerList tools={tools} categories={categoryList} />
      </ToolsClientWrapper>

    </div>
  );
}
