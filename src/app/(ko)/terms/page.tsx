import type { Metadata } from 'next';
import { siteConfig } from '@/data/site';

export const metadata: Metadata = {
  title: `이용약관 - ${siteConfig.name}`,
  description: `${siteConfig.name}의 서비스 이용약관입니다. 도구 사용 책임 범위, 운영자 권한, 서비스 변경 및 중단 정책을 안내합니다.`,
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        이용약관
      </h1>

      <div className="prose dark:prose-invert max-w-none space-y-6">
        <p className="text-gray-600 dark:text-gray-400">
          시행일: 2026-04-27
        </p>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            1. 약관의 적용
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            본 약관은 ToolPiki(toolpiki.com, 이하 &quot;사이트&quot;)가 제공하는 온라인 도구 서비스의 이용 조건을
            정합니다. 사이트에 접속하거나 도구를 이용하는 행위는 본 약관에 동의한 것으로 간주됩니다.
            동의하지 않는 경우 이용을 중단해 주시기 바랍니다.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            본 약관은 함께 게시된 <a href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">개인정보처리방침</a>과
            함께 적용되며, 두 문서가 충돌하는 경우 본 약관이 우선합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            2. 서비스 개요
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            ToolPiki는 회원가입이나 별도 설치 없이 웹 브라우저에서 바로 사용할 수 있는 다양한 유틸리티를 무상으로
            제공합니다. 주요 도구 카테고리는 다음과 같습니다.
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-2 space-y-1">
            <li>텍스트 분석 및 가공 (글자수 세기, 정렬, 비교 등)</li>
            <li>데이터 인코딩 및 변환 (Base64, URL 인코딩, 해시 등)</li>
            <li>코드 포맷터 (JSON, XML, SQL, YAML, CSS 등)</li>
            <li>이미지 처리 및 최적화 (압축, 리사이즈, 포맷 변환 등)</li>
            <li>색상 도구 (HEX/RGB/HSL 변환, 팔레트, 그라데이션)</li>
            <li>각종 계산기 및 생성 도구 (UUID, QR 코드, 비밀번호 등)</li>
            <li>재미/엔터테인먼트 도구 (운세, 심리 테스트, 추천 등)</li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            대부분의 도구는 클라이언트 측에서 동작하며, 입력 데이터는 외부 서버로 전송되지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            3. 이용 조건
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            가. 사이트의 모든 도구는 회원가입 절차 없이 자유롭게 이용할 수 있습니다.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            나. 이용자가 입력하는 데이터는 브라우저 내부에서만 처리되며, 사이트 운영자의 서버에 저장되거나
            외부에 공유되지 않습니다. 자세한 처리 방식은 개인정보처리방침을 참고해 주세요.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            다. 사이트는 상시 접속 가능하도록 노력하나, 정기 점검, 시스템 업데이트, 외부 네트워크 장애 등
            예기치 못한 사정으로 일시 중단될 수 있습니다. 이러한 중단으로 인한 결과에 대해 운영자는 별도의 보상이나
            법적 책임을 부담하지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            4. 이용자의 책임 및 금지 행위
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            이용자는 사이트를 이용함에 있어 관련 법령과 본 약관을 준수해야 하며, 다음 행위를 해서는 안 됩니다.
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-2 space-y-1">
            <li>자동화 스크립트, 봇 등을 이용한 대량 요청으로 서비스 운영에 지장을 주는 행위</li>
            <li>불법, 유해, 음란, 폭력적인 목적으로 도구를 활용하거나 그러한 결과물을 생성하는 행위</li>
            <li>사이트의 소스코드, 디자인, 콘텐츠, UI 요소를 운영자의 명시적 허락 없이 복제, 재배포, 상업적 활용하는 행위</li>
            <li>사이트의 보안 취약점을 악용하거나, 정상적인 운영을 방해하는 행위</li>
            <li>타인의 저작권, 초상권, 개인정보 등 권리를 침해하는 행위</li>
            <li>관련 법령(저작권법, 정보통신망법 등)을 위반하는 행위</li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            금지 행위에 해당하는 이용이 확인된 경우, 운영자는 사전 통지 없이 해당 IP 또는 행위에 대한 접근을
            제한할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            5. 도구 사용에 대한 책임 범위
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            가. 사이트는 무상으로 제공되는 서비스이며, 도구의 이용 결과에 대해 어떠한 법적 책임도 부담하지 않습니다.
            도구의 출력물은 참고 자료로만 활용해 주시기 바랍니다.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            나. 도구의 출력 결과가 항상 정확하거나 완전함을 보장하지 않으며, 계약, 의료, 회계, 보안 등 정확성이
            중요한 용도에 사용할 경우 이용자가 직접 결과를 검증해야 합니다.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            다. 운세, 사주풀이, 타로, 궁합, 심리 테스트 등 <strong>재미 카테고리</strong>의 도구는 오락 목적의 콘텐츠이며,
            이용 결과를 중요한 결정의 근거로 활용하지 않으시기 바랍니다.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            라. 이용자가 도구를 통해 처리한 데이터의 관리, 보관, 백업 책임은 전적으로 이용자에게 있습니다.
            브라우저 종료, 캐시 삭제 등으로 인한 데이터 소실에 대해 운영자는 책임지지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            6. 운영자의 권한
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            운영자는 서비스의 품질 유지와 합리적 운영을 위해 다음 권한을 보유합니다.
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-2 space-y-1">
            <li>도구의 추가, 변경, 통합, 중단 결정</li>
            <li>이용량이 매우 적거나 유지보수가 어려워진 도구의 폐기</li>
            <li>광고 노출 위치 및 광고 네트워크의 변경</li>
            <li>약관 및 개인정보처리방침의 개정</li>
            <li>이용자의 약관 위반 행위에 대한 접근 제한</li>
            <li>법령 또는 권리 침해 신고에 따른 콘텐츠 수정 또는 삭제</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            7. 서비스 변경 및 중단
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            운영자는 서비스의 일부 또는 전부를 합리적 사유에 따라 변경하거나 중단할 수 있습니다. 중요한 변경
            사항은 사전에 공지하려고 노력하지만, 긴급한 보안 이슈, 외부 서비스 장애, 법령 변경 등 불가피한
            상황에서는 사전 공지 없이 변경될 수 있습니다.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            서비스 변경, 중단, 폐쇄로 인해 이용자에게 발생한 손해에 대해 운영자는 별도의 보상이나 법적 책임을
            부담하지 않습니다. 다만 사이트 운영을 종료할 경우 합리적인 기간 동안 사전 안내를 제공하도록 하겠습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            8. 광고
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            사이트는 운영비 충당을 위해 Google AdSense, 카카오 애드핏 등 광고 네트워크를 통한 광고를 게재할 수 있습니다.
            광고는 도구 사용을 방해하지 않는 위치에 배치되며, 운세, 사주, 타로, 궁합, 복권, 채팅 등 일부 페이지에는
            광고를 노출하지 않습니다.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            광고에 표시되는 상품 또는 서비스에 대한 거래는 광고주와 이용자 간에 직접 이루어지며, 사이트 운영자는
            해당 거래에 대해 어떠한 책임도 부담하지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            9. 저작권
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            사이트에 포함된 UI 디자인, 아이콘, 텍스트 콘텐츠, 로고, 도구 설명 등에 대한 권리는 사이트 운영자에게 있습니다.
            허락 없이 무단으로 복제, 재배포, 상업적 이용하는 행위를 금합니다.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            반면, 이용자가 도구를 통해 직접 생성한 결과물(예: QR 코드, 변환된 이미지, 색상 코드, 정리된 코드 등)에 대한
            활용 권한은 이용자에게 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            10. 약관 개정
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            운영자는 필요한 경우 본 약관을 수정할 수 있으며, 개정된 내용은 본 페이지에 게시하는 것으로 효력이
            발생합니다. 이용자에게 불리한 중대한 변경의 경우 시행일 이전에 합리적인 기간을 두고 사전 공지합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            11. 분쟁 해결 및 준거법
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            본 약관과 관련한 분쟁은 대한민국 법령에 따라 해석되며, 분쟁이 발생할 경우 운영자와 이용자는
            상호 협의를 통해 원만한 해결을 우선 모색합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            12. 연락처
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            약관에 대한 질문이나 의견이 있으시면 아래 이메일로 문의해 주세요.
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
