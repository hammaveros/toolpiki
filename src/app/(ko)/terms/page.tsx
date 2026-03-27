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
          최종 수정일: {new Date().toISOString().split('T')[0]}
        </p>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            제1조 (목적)
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            본 약관은 {siteConfig.name}(이하 &quot;서비스&quot;)가 제공하는 온라인 웹 유틸리티
            도구의 이용과 관련하여 서비스와 이용자 간의 권리, 의무 및 책임사항을 규정함을
            목적으로 합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            제2조 (서비스의 제공)
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            서비스는 다음과 같은 기능을 무료로 제공합니다:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-2 space-y-1">
            <li>텍스트 변환 및 처리 도구</li>
            <li>인코딩/디코딩 도구</li>
            <li>포맷터 및 변환기</li>
            <li>이미지 편집 도구</li>
            <li>색상 관련 도구</li>
            <li>계산기 및 생성기</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            제3조 (서비스 이용)
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            1. 서비스는 별도의 회원가입 없이 누구나 이용할 수 있습니다.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            2. 모든 데이터 처리는 사용자의 브라우저에서 이루어지며,
            서버로 전송되거나 저장되지 않습니다.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            3. 서비스는 24시간 연중무휴 제공을 원칙으로 하나,
            시스템 점검 등의 사유로 일시 중단될 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            제4조 (이용자의 의무)
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            이용자는 다음 행위를 하여서는 안 됩니다:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-2 space-y-1">
            <li>서비스의 안정적 운영을 방해하는 행위</li>
            <li>서비스를 이용하여 불법적인 목적의 데이터를 처리하는 행위</li>
            <li>서비스의 콘텐츠를 무단으로 복제, 배포하는 행위</li>
            <li>기타 관련 법령에 위배되는 행위</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            제5조 (면책조항)
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            1. 서비스는 무료로 제공되며, 서비스 이용으로 인해 발생하는 어떠한 손해에 대해서도
            책임을 지지 않습니다.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            2. 서비스에서 제공하는 도구의 결과물에 대한 정확성, 완전성, 신뢰성에 대해
            보증하지 않습니다.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            3. 이용자가 서비스를 통해 처리한 데이터의 보안 및 백업은 이용자의 책임입니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            제6조 (지적재산권)
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            서비스의 디자인, 로고, 콘텐츠 등에 대한 지적재산권은 서비스 운영자에게 귀속됩니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            제7조 (약관의 변경)
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            본 약관은 필요에 따라 변경될 수 있으며, 변경된 약관은 서비스 내에 공지함으로써
            효력이 발생합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            제8조 (문의)
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            이용약관에 관한 문의사항이 있으시면 아래 연락처로 문의해 주시기 바랍니다.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            이메일: hammaveros@gmail.com
          </p>
        </section>
      </div>
    </div>
  );
}
