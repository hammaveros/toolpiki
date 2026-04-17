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
          시행일: {new Date().toISOString().split('T')[0]}
        </p>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            1. 개요
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            ToolPiki(toolpiki.com)는 이용자의 프라이버시를 존중하며,
            개인정보 보호를 위해 최선을 다하고 있습니다.
            본 방침은 당 사이트에서 정보를 어떻게 다루는지 안내합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            2. 데이터 처리 방식
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            ToolPiki의 모든 도구는 클라이언트 측(사용자의 브라우저)에서 동작합니다.
            입력한 텍스트, 이미지, 파일 등은 외부 서버로 전송되지 않으며,
            브라우저를 닫으면 자동으로 사라집니다.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            별도의 계정 생성이나 로그인 절차가 없으므로,
            이름, 이메일 주소, 전화번호 등의 개인식별정보를 요구하지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            3. 자동 수집 정보
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            웹사이트 운영 및 품질 향상을 위해 아래 항목이 자동으로 기록될 수 있습니다:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-2 space-y-1">
            <li>접속 시각 및 IP 주소</li>
            <li>사용 중인 기기, 브라우저, OS 정보</li>
            <li>페이지 조회 내역 및 체류 시간</li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            해당 정보는 익명화된 형태로 활용되며, 개별 이용자를 식별하는 데 사용되지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            4. 쿠키 및 로컬 저장소
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            ToolPiki는 다크모드 설정, 즐겨찾기 등 사용자 환경을 기억하기 위해
            브라우저의 로컬 저장소(localStorage)를 사용합니다.
            이 데이터는 기기에만 저장되며, 서버로 전송되지 않습니다.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            또한, 광고 및 분석 서비스에서 쿠키를 설정할 수 있습니다.
            브라우저 설정에서 쿠키를 차단하거나 삭제할 수 있으나,
            일부 기능이 정상 작동하지 않을 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            5. 제3자 광고 (Google AdSense)
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            ToolPiki는 운영 비용 충당을 위해 Google AdSense 광고를 게재할 수 있습니다.
            Google은 이용자의 웹 활동 기반으로 맞춤형 광고를 표시하며,
            이를 위해 쿠키나 웹 비콘을 활용할 수 있습니다.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            맞춤 광고 수신을 원하지 않는 경우{' '}
            <a
              href="https://adssettings.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Google 광고 설정
            </a>
            에서 비활성화할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            6. 정보 보관 기간
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            자동 수집된 로그 데이터는 분석 완료 후 지체 없이 삭제하며,
            법령에 별도 보관 의무가 있는 경우 해당 기간 동안 보관합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            7. 방침 변경 안내
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            본 개인정보처리방침은 관련 법률이나 서비스 변경에 따라 수정될 수 있으며,
            변경 사항은 이 페이지를 통해 공지합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            8. 연락처
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            개인정보 관련 질문이나 요청이 있으시면 아래로 문의해 주세요.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            이메일: hammaveros@gmail.com
          </p>
        </section>
      </div>
    </div>
  );
}
