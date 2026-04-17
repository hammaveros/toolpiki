import type { Metadata } from 'next';
import { siteConfig } from '@/data/site';

export const metadata: Metadata = {
  title: `소개 - ${siteConfig.name}`,
  description: `${siteConfig.name}은 브라우저에서 바로 쓸 수 있는 무료 온라인 도구 모음입니다.`,
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
            ToolPiki 소개
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            ToolPiki는 &quot;필요한 도구를 골라 쓴다&quot;는 뜻을 담은 온라인 웹 도구 플랫폼입니다.
            설치나 로그인 없이 브라우저만 있으면 텍스트 가공, 이미지 편집, 데이터 변환 등
            다양한 작업을 즉시 처리할 수 있습니다.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            입력 데이터는 사용자의 기기에서만 처리되기 때문에 외부 유출 걱정이 없습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            도구 카테고리
          </h2>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
            <li><strong>텍스트</strong> - 글자수 카운터, 텍스트 비교, 단어 빈도 분석 등</li>
            <li><strong>인코딩</strong> - Base64, URL 인코딩, 해시 변환 등</li>
            <li><strong>포맷터</strong> - JSON, CSS, HTML, SQL 등 코드 정리</li>
            <li><strong>이미지</strong> - 압축, 포맷 변환, 크기 조절 등</li>
            <li><strong>색상</strong> - HEX/RGB/HSL 변환, 팔레트 생성</li>
            <li><strong>계산기</strong> - 단위 환산, QR 생성, 정규식 테스트 등</li>
            <li><strong>재미</strong> - 운세, 심리 테스트, 랜덤 뽑기 등</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            프로젝트 운영
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            ToolPiki는 한 명의 개발자가 만들고 관리하는 사이드 프로젝트입니다.
            어떤 회사나 단체와도 연관되어 있지 않으며, 광고 외 별도의 수익 활동은 없습니다.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            새로운 도구 제안이나 개선 아이디어가 있다면 언제든 보내주세요.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            연락처
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            궁금한 점이나 건의사항은 아래 이메일로 보내주시면 확인 후 답변드리겠습니다.
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
