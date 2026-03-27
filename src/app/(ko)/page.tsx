'use client';

import { tools } from '@/data/tools';
import { categoryList } from '@/data/categories';
import { ToolsClientPage } from '@/components/tools/ToolsClientPage';
import { HomeContent } from '@/components/home/HomeContent';

export default function HomePage() {
  return (
    <>
      {/* 히어로 + 간단 소개 섹션 */}
      <section className="bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="container mx-auto px-4 pt-10 pb-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              JSSpace
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              웹에서 바로 쓰는 무료 온라인 도구 모음
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              <p>
                텍스트 변환, Base64 인코딩, JSON 포맷터, 이미지 압축, 색상 코드 변환 등<br />
                <strong className="text-gray-700 dark:text-gray-300">100개 이상의 무료 도구</strong>를 회원가입 없이 바로 사용하세요.
              </p>
              <p className="mt-2">
                모든 작업은 브라우저에서 처리되어 파일이 서버로 전송되지 않습니다.<br />
                개인정보 걱정 없이 안심하고 사용할 수 있어요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 카테고리 필터 + 도구 그리드 (즐겨찾기, 최근사용 포함) */}
      <section className="container mx-auto px-4 py-4">
        <ToolsClientPage tools={tools} categories={categoryList} isMainPage />
      </section>

      {/* 사이트 소개 콘텐츠 (AdSense용) */}
      <section className="container mx-auto px-4 py-8 border-t border-gray-200 dark:border-gray-700">
        <HomeContent />
      </section>
    </>
  );
}
