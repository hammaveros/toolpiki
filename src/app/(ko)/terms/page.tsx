import type { Metadata } from 'next';
import { siteConfig } from '@/data/site';

export const metadata: Metadata = {
  title: `이용약관 - ${siteConfig.name}`,
  description: `${siteConfig.name}의 서비스 이용약관입니다.`,
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        이용약관
      </h1>

      <div className="prose dark:prose-invert max-w-none space-y-6">
        <p className="text-gray-600 dark:text-gray-400">
          시행일: {new Date().toISOString().split('T')[0]}
        </p>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            1. 약관의 적용
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            본 약관은 ToolPiki(toolpiki.com, 이하 &quot;사이트&quot;)가 제공하는 온라인 도구 서비스의
            이용 조건을 정합니다. 사이트를 이용하는 것은 본 약관에 동의하는 것으로 간주됩니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            2. 서비스 개요
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            ToolPiki는 별도 설치나 가입 없이 웹 브라우저에서 바로 쓸 수 있는
            각종 유틸리티를 무상으로 제공합니다. 주요 도구 분야는 아래와 같습니다:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-2 space-y-1">
            <li>텍스트 분석 및 가공</li>
            <li>데이터 인코딩 및 변환</li>
            <li>코드 포맷팅 및 정리</li>
            <li>이미지 처리 및 최적화</li>
            <li>색상 도구 및 팔레트</li>
            <li>각종 계산기 및 생성 도구</li>
            <li>재미/엔터테인먼트 도구</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            3. 이용 조건
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            가. 사이트의 모든 도구는 가입 절차 없이 자유롭게 이용할 수 있습니다.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            나. 이용자가 입력하는 데이터는 브라우저 내부에서만 처리되며,
            사이트 운영자의 서버에 저장되거나 외부에 공유되지 않습니다.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            다. 사이트는 상시 접속 가능하도록 노력하나, 정기 점검이나
            예기치 못한 장애로 서비스가 일시 중단될 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            4. 금지 행위
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            이용자는 아래 행위를 해서는 안 됩니다:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-2 space-y-1">
            <li>자동화 스크립트를 이용한 대량 요청 등 서비스 운영에 지장을 주는 행위</li>
            <li>위법 또는 유해한 목적으로 도구를 활용하는 행위</li>
            <li>사이트의 소스코드나 콘텐츠를 허락 없이 재배포하는 행위</li>
            <li>타인의 권리를 침해하거나 법령을 위반하는 행위</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            5. 책임 제한
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            가. 사이트는 무료 서비스이며, 이용 결과에 대해 어떠한 법적 책임도 부담하지 않습니다.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            나. 도구의 출력물이 항상 정확하거나 완벽함을 보장하지 않으며,
            중요한 용도에 사용할 경우 이용자가 직접 결과를 검증해야 합니다.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            다. 이용자가 처리한 데이터의 관리 및 백업 책임은 전적으로 이용자에게 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            6. 저작권
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            사이트에 포함된 UI 디자인, 아이콘, 텍스트 콘텐츠, 로고 등에 대한
            권리는 사이트 운영자에게 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            7. 약관 개정
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            운영자는 필요한 경우 본 약관을 수정할 수 있으며,
            개정된 내용은 이 페이지에 게시하는 것으로 효력이 발생합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            8. 연락처
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            약관에 대한 질문은 아래 이메일을 통해 문의해 주세요.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            이메일: hammaveros@gmail.com
          </p>
        </section>
      </div>
    </div>
  );
}
