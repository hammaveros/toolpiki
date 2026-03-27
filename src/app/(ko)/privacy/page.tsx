import type { Metadata } from 'next';
import { siteConfig } from '@/data/site';

export const metadata: Metadata = {
  title: `개인정보처리방침 - ${siteConfig.name}`,
  description: `${siteConfig.name}의 개인정보처리방침입니다.`,
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        개인정보처리방침
      </h1>

      <div className="prose dark:prose-invert max-w-none space-y-6">
        <p className="text-gray-600 dark:text-gray-400">
          최종 수정일: {new Date().toISOString().split('T')[0]}
        </p>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            1. 수집하는 개인정보
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            {siteConfig.name}은 별도의 회원가입 없이 이용 가능한 서비스로,
            사용자로부터 직접적인 개인정보를 수집하지 않습니다.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            단, 서비스 이용 과정에서 다음과 같은 정보가 자동으로 수집될 수 있습니다:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-2 space-y-1">
            <li>방문 일시, 접속 IP 주소</li>
            <li>브라우저 종류 및 운영체제</li>
            <li>방문 페이지 및 이용 기록</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            2. 개인정보의 이용 목적
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            수집된 정보는 다음의 목적으로만 이용됩니다:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-2 space-y-1">
            <li>서비스 제공 및 운영</li>
            <li>서비스 개선 및 통계 분석</li>
            <li>부정 이용 방지</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            3. 쿠키(Cookie) 사용
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            {siteConfig.name}은 사용자 경험 개선 및 광고 제공을 위해 쿠키를 사용합니다.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            쿠키는 브라우저 설정을 통해 거부하거나 삭제할 수 있으며,
            이 경우 일부 서비스 이용에 제한이 있을 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            4. 광고
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            {siteConfig.name}은 Google AdSense를 통해 광고를 게재합니다.
            Google은 사용자의 관심사에 기반한 광고를 표시하기 위해 쿠키를 사용할 수 있습니다.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            Google의 광고 관련 개인정보 처리에 대한 자세한 내용은{' '}
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Google 광고 정책
            </a>
            을 참고하시기 바랍니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            5. 개인정보의 보유 및 파기
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            자동 수집된 정보는 통계 분석 후 즉시 파기되거나,
            관련 법령에 따라 일정 기간 보관 후 파기됩니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            6. 문의
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            개인정보처리방침에 관한 문의사항이 있으시면 아래 연락처로 문의해 주시기 바랍니다.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            이메일: hammaveros@gmail.com
          </p>
        </section>
      </div>
    </div>
  );
}
