import type { Metadata } from 'next';
import { siteConfig } from '@/data/site';

export const metadata: Metadata = {
  title: `개인정보처리방침 - ${siteConfig.name}`,
  description: `${siteConfig.name}의 개인정보처리방침입니다. 데이터 처리 방식, 쿠키, 광고 네트워크(Google AdSense, 카카오 애드핏), 검색엔진 도구 사용에 대해 안내합니다.`,
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        개인정보처리방침
      </h1>

      <div className="prose dark:prose-invert max-w-none space-y-6">
        <p className="text-gray-600 dark:text-gray-400">
          시행일: 2026-04-27
        </p>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            1. 개요
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            ToolPiki(toolpiki.com, 이하 &quot;사이트&quot;)는 이용자의 프라이버시를 중요하게 여기며,
            관련 법령을 준수하기 위해 노력하고 있습니다. 본 개인정보처리방침은 사이트가 어떤 정보를 어떻게
            처리하는지, 어떤 제3자 서비스를 활용하는지, 이용자가 어떤 권리를 행사할 수 있는지를 안내합니다.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            ToolPiki는 회원가입 절차가 없는 비로그인 서비스이므로, 일반적인 의미의 개인정보(이름, 이메일,
            전화번호 등)를 직접 수집하지 않습니다. 다만 광고 송출, 방문 통계, 검색 노출 등을 위해 일부
            자동 수집 데이터와 제3자 쿠키가 사용될 수 있어 그 범위를 아래에서 자세히 설명합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            2. 데이터 처리 방식 (도구 사용 데이터)
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            사이트의 거의 모든 도구는 클라이언트 측(이용자의 브라우저)에서 동작합니다.
            이용자가 입력한 텍스트, 업로드한 이미지, 첨부 파일, 옵션 값 등은 외부 서버로 전송되지 않으며,
            브라우저 메모리 안에서만 처리된 후 페이지를 닫으면 자동으로 사라집니다.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            별도의 계정 생성, 로그인, 결제 절차가 없으므로 이름, 이메일 주소, 전화번호, 주민등록번호 같은
            개인식별정보를 사이트가 직접 수집하는 일은 없습니다. 이용자가 자발적으로 문의 메일을 보내신 경우에 한해
            메일에 포함된 정보를 답변 목적으로만 활용합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            3. 자동 수집 정보
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            웹사이트 운영 및 품질 향상을 위해 아래 항목이 자동으로 기록될 수 있습니다.
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-2 space-y-1">
            <li>접속 시각 및 IP 주소(부분 마스킹 형태로 처리)</li>
            <li>사용 중인 기기 종류, 운영체제, 브라우저 종류 및 버전</li>
            <li>접속 경로(referrer), 페이지 조회 내역, 체류 시간</li>
            <li>화면 해상도, 언어 설정, 시간대 등 익명 분석용 환경 정보</li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            해당 정보는 익명화 또는 통계화된 형태로만 활용되며, 개별 이용자를 식별하는 데 사용되지 않습니다.
            서비스 안정성 모니터링, 인기 도구 파악, 오류 분석 등에 한해 사용됩니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            4. 쿠키 및 로컬 저장소
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            ToolPiki는 다음 두 종류의 클라이언트 저장 공간을 사용합니다.
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-2 space-y-1">
            <li>
              <strong>로컬 저장소(localStorage)</strong>: 다크 모드 설정, 즐겨찾기, 최근 사용 기록, 도구별 옵션
              기억 등 이용자 환경을 유지하기 위한 값입니다. 이 데이터는 이용자의 기기에만 저장되며 서버로
              전송되지 않습니다.
            </li>
            <li>
              <strong>쿠키(Cookie)</strong>: 광고 네트워크와 분석 서비스가 자체적으로 설정할 수 있습니다.
              자세한 내용은 아래 5번 항목을 참고해 주세요.
            </li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            브라우저 설정에서 쿠키를 차단하거나 삭제할 수 있으며, 이 경우 일부 기능(예: 즐겨찾기 유지,
            맞춤 광고)이 정상적으로 동작하지 않을 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            5. 제3자 광고 및 분석 서비스
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            사이트는 운영비 충당을 위해 아래 광고 네트워크를 통해 광고를 게재할 수 있으며, 이들 서비스는
            맞춤 광고 제공과 광고 효과 측정을 위해 자체 쿠키와 식별자를 활용할 수 있습니다.
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-2 space-y-2">
            <li>
              <strong>Google AdSense / Google Ad Manager / DoubleClick</strong>:
              Google이 운영하는 광고 네트워크로, 이용자의 웹 활동 정보를 기반으로 맞춤형 광고를 표시할 수 있습니다.
              Google 광고 정책과 데이터 처리 내용은 Google 광고 페이지에서 확인할 수 있으며,
              {' '}<a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Google 광고 설정</a>에서
              개인 맞춤 광고를 비활성화할 수 있습니다.
            </li>
            <li>
              <strong>카카오 애드핏(Kakao AdFit)</strong>: 카카오가 운영하는 광고 네트워크로, 광고 송출과
              효과 측정을 위해 쿠키 또는 광고 식별자를 활용할 수 있습니다.
            </li>
            <li>
              <strong>방문 통계 서비스</strong>: 익명화된 사이트 이용 통계를 분석하기 위해 분석 도구가
              사용될 수 있으며, 이 경우에도 개별 이용자 식별이 아닌 집계 데이터로만 활용됩니다.
            </li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300 mt-3">
            <strong>광고가 노출되지 않는 페이지.</strong> 운세, 사주풀이, 타로, 궁합, 복권 추천, 채팅 등
            정책상 적합하지 않거나 민감할 수 있는 페이지에는 광고를 게재하지 않으며, 검색 엔진에서도 색인되지
            않도록 처리해 두었습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            6. 검색엔진 도구
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            사이트 노출 관리를 위해 아래 검색엔진 운영 도구가 사용됩니다.
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-2 space-y-1">
            <li>
              <strong>Google Search Console</strong>: 색인 상태, 검색 성능, 에러 현황 등 사이트 운영을 위한
              집계 데이터를 확인하기 위해 사용합니다.
            </li>
            <li>
              <strong>Naver 서치어드바이저(Naver Search Advisor)</strong>: 네이버 검색 노출 점검을 위해 사용하며,
              사이트 인증 메타 태그가 포함되어 있습니다.
            </li>
            <li>
              <strong>Bing Webmaster Tools</strong> 등 다른 검색엔진 도구도 동일한 목적으로 사용될 수 있습니다.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            7. 정보 보관 기간
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            자동 수집된 로그 및 통계 데이터는 분석 완료 후 합리적인 기간 내에 삭제하며, 법령에 별도 보관 의무가
            있는 경우에는 해당 기간 동안 보관합니다. 광고 네트워크가 자체적으로 보관하는 데이터의 보관 기간은
            각 네트워크의 정책을 따릅니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            8. 이용자의 권리
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            이용자는 언제든지 다음 권리를 행사하실 수 있습니다.
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-2 space-y-1">
            <li>브라우저 설정을 통한 쿠키 차단 또는 삭제</li>
            <li>Google 광고 설정에서 맞춤 광고 비활성화</li>
            <li>로컬 저장소 데이터(즐겨찾기, 최근 사용 기록 등)의 삭제(브라우저 데이터 삭제 기능 활용)</li>
            <li>아래 연락처로 문의하여 본 방침 적용 범위 안에서의 정보 처리에 대한 질의</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            9. 방침 변경 안내
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            본 개인정보처리방침은 관련 법률, 서비스 정책, 광고 네트워크 정책 변경에 따라 수정될 수 있으며,
            변경 사항은 본 페이지를 통해 공지합니다. 중요한 변경의 경우 시행일 이전 합리적인 기간을 두고 안내합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            10. 연락처
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            개인정보 처리에 관한 질문이나 요청이 있으시면 아래로 문의해 주세요.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            이메일:{' '}
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {siteConfig.contactEmail}
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
