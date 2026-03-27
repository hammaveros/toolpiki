import type { Metadata } from 'next';
import { siteConfig } from '@/data/site';

export const metadata: Metadata = {
  title: `소개 - ${siteConfig.name}`,
  description: `${siteConfig.name}은 무료 온라인 웹 도구 모음입니다. 텍스트 변환, 이미지 편집, 인코딩 등 다양한 도구를 제공합니다.`,
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        소개
      </h1>

      <div className="prose dark:prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            ToolPiki란?
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            ToolPiki는 일상에서 자주 필요한 웹 도구들을 무료로 제공하는 온라인 유틸리티 서비스입니다.
            회원가입 없이 누구나 바로 사용할 수 있으며, 모든 작업은 브라우저에서 처리되어
            개인정보가 서버로 전송되지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            제공하는 도구
          </h2>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
            <li><strong>텍스트 도구</strong> - 글자수 세기, 대소문자 변환, 텍스트 비교 등</li>
            <li><strong>인코딩/디코딩</strong> - Base64, URL 인코딩, 해시 생성 등</li>
            <li><strong>포맷터</strong> - JSON, SQL, CSS 정렬 및 압축</li>
            <li><strong>이미지 도구</strong> - 이미지 압축, 변환, 리사이즈</li>
            <li><strong>색상 도구</strong> - 색상 변환, 팔레트 생성</li>
            <li><strong>계산기</strong> - 나이 계산, 단위 변환, 정규식 테스트</li>
            <li><strong>재미 도구</strong> - 로또 번호 생성, 타로, 심리 테스트 등</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            운영 정보
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            ToolPiki는 개인이 운영하는 독립 프로젝트입니다.
            특정 기업, 에이전시, 조직과 무관하며 상업적 클라이언트 업무를 수행하지 않습니다.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            서비스 개선을 위한 피드백은 언제든 환영합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            문의
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            서비스 이용 중 문의사항이 있으시면 아래 이메일로 연락해 주세요.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            이메일:{' '}
            <a
              href="mailto:hammaveros@gmail.com"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              hammaveros@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
