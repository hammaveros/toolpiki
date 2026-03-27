import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getToolBySlug, getAllToolSlugs } from '@/data/tools';
import { generateToolMetadata } from '@/lib/seo/metadata';
import { ToolLayout } from '@/components/tools';

// 도구 컴포넌트 동적 import
import { getToolComponent } from '@/tools/registry';

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

// SSG를 위한 정적 경로 생성
export async function generateStaticParams() {
  return getAllToolSlugs().map((slug) => ({ slug }));
}

// 동적 메타데이터 생성
export async function generateMetadata({
  params,
}: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return { title: '도구를 찾을 수 없습니다' };
  }

  return generateToolMetadata(tool);
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;

  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  // 도구 컴포넌트 가져오기
  const ToolComponent = getToolComponent(slug);

  if (!ToolComponent) {
    // 아직 구현되지 않은 도구
    return (
      <ToolLayout meta={tool}>
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            이 도구는 준비 중입니다.
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
            곧 사용하실 수 있습니다.
          </p>
        </div>
      </ToolLayout>
    );
  }

  return (
    <ToolLayout meta={tool}>
      <ToolComponent />
    </ToolLayout>
  );
}
