'use client';

import { Card } from '@/components/ui/Card';

export function HomeContent() {
  return (
    <div className="space-y-6 text-gray-700 dark:text-gray-300">
      {/* 사이트 소개 */}
      <section className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          툴피키(ToolPiki)란?
        </h2>
        <p className="leading-relaxed mb-3">
          툴피키(ToolPiki)는 회원가입 없이 바로 쓰는 무료 웹 도구 모음 사이트입니다.
          글자수 세기, JSON 정리, 이미지 압축, QR 코드 생성, 색상 변환 등 일상과 업무에서
          반복적으로 발생하는 작업을 브라우저 하나로 빠르게 해결할 수 있도록 설계했습니다.
          매번 새 프로그램을 깔거나 광고 가득한 사이트를 검색할 필요 없이, 한 곳에서 필요한 도구를 골라 쓰는 것이 목표입니다.
        </p>
        <p className="leading-relaxed mb-3">
          가장 큰 특징은 <strong>모든 처리가 사용자의 브라우저 안에서 이루어진다는 점</strong>입니다.
          입력한 텍스트, 업로드한 이미지, 첨부한 파일은 외부 서버로 전송되지 않으며, 브라우저를 닫으면 자동으로 사라집니다.
          그래서 회사 내부 자료나 개인 정보가 담긴 파일도 비교적 안심하고 사용할 수 있습니다.
          별도의 로그인 절차나 결제 단계가 없고, 숨겨진 유료 기능도 두지 않았습니다.
        </p>
        <p className="leading-relaxed">
          데스크톱은 물론 스마트폰, 태블릿에서도 동일한 기능을 사용할 수 있도록 반응형으로 만들었으며,
          다크 모드도 지원합니다. 현재 100가지가 넘는 도구를 운영 중이고,
          이용자 피드백을 받아 매주 새로운 도구를 추가하거나 기존 도구를 개선하고 있습니다.
          툴피키는 거창한 플랫폼이 아니라, 검색 한 번이면 끝나는 작은 작업들을 더 깔끔하게 처리할 수 있는 작업대 같은 사이트가 되는 것을 지향합니다.
        </p>
      </section>

      {/* 카테고리 소개 */}
      <section className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          어떤 도구가 있나요?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card variant="bordered" className="p-4 bg-white dark:bg-gray-900">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">📝 텍스트 처리</h3>
            <p className="text-sm leading-relaxed">
              글자수 세기, 단어 빈도 분석, 줄 정렬과 중복 제거, 두 텍스트 비교, 공백 정리,
              대소문자 변환, 한영 자판 변환 등 글을 다듬고 데이터를 정돈할 때 자주 쓰는 도구를 모았습니다.
              블로그 글, 보고서, 자기소개서처럼 분량이 정해진 글을 작성할 때 특히 유용합니다.
            </p>
          </Card>
          <Card variant="bordered" className="p-4 bg-white dark:bg-gray-900">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🔐 인코딩/변환</h3>
            <p className="text-sm leading-relaxed">
              Base64 인코딩과 디코딩, URL 인코딩, MD5/SHA 해시 생성, JWT 토큰 분석,
              유니코드 변환 등 개발 작업 중 자주 필요한 데이터 변환 기능을 한곳에 모았습니다.
              결과는 즉시 표시되고, 클립보드 복사 기능도 모든 도구에 기본 제공됩니다.
            </p>
          </Card>
          <Card variant="bordered" className="p-4 bg-white dark:bg-gray-900">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">📋 코드 포맷터</h3>
            <p className="text-sm leading-relaxed">
              JSON, XML, SQL, YAML, CSS, JavaScript, HTML 등 다양한 포맷의 코드를 보기 좋게 정리하거나,
              반대로 압축(minify)할 수 있는 도구입니다. 들여쓰기 단위 조정, 따옴표 통일,
              JSON 유효성 검사 등 세부 옵션도 함께 지원합니다.
            </p>
          </Card>
          <Card variant="bordered" className="p-4 bg-white dark:bg-gray-900">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🖼️ 이미지 편집</h3>
            <p className="text-sm leading-relaxed">
              이미지 압축, 크기 조절, 자르기, 회전, 포맷 변환(JPG/PNG/WebP), 파비콘 생성,
              Base64 변환 등 가벼운 이미지 작업을 별도 프로그램 설치 없이 처리할 수 있습니다.
              원본 파일을 수정하지 않고 새 파일로 저장하기 때문에 안심하고 쓸 수 있습니다.
            </p>
          </Card>
          <Card variant="bordered" className="p-4 bg-white dark:bg-gray-900">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🎨 색상 도구</h3>
            <p className="text-sm leading-relaxed">
              HEX/RGB/HSL 색상 코드 변환, 팔레트 생성, 그라데이션 생성기, 이미지에서 색상 추출,
              접근성 대비(WCAG) 검사 등 디자인과 퍼블리싱 작업에 도움이 되는 도구를 모았습니다.
              색상 코드를 외우지 않아도 클릭 몇 번으로 필요한 값을 얻을 수 있습니다.
            </p>
          </Card>
          <Card variant="bordered" className="p-4 bg-white dark:bg-gray-900">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🔢 계산기/생성기</h3>
            <p className="text-sm leading-relaxed">
              UUID 생성, QR 코드 생성, 비밀번호 생성, 단위 환산, 진법 변환, 날짜/D-day 계산,
              퍼센트 계산기 등 자주 쓰는 계산 및 생성 도구를 모았습니다. 각 도구는 결과를 즉시 보여주고,
              자주 쓰는 옵션은 다음에 다시 사용할 수 있도록 브라우저에 기억해 둡니다.
            </p>
          </Card>
        </div>
      </section>

      {/* 사용 방법 */}
      <section className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          이용 방법
        </h2>
        <div className="space-y-2">
          <p>복잡한 절차 없이 누구나 바로 사용할 수 있도록 만들었습니다. 일반적으로 다음 순서로 사용합니다.</p>
          <ol className="list-decimal list-inside space-y-2 ml-2">
            <li>
              상단 검색창에 키워드를 입력하거나, 메인 페이지에서 카테고리(텍스트, 이미지, 색상 등)를 선택해 원하는 도구를 찾습니다.
              검색은 도구명, 설명, 태그를 모두 대상으로 합니다.
            </li>
            <li>
              도구 화면에서 텍스트를 붙여 넣거나, 파일을 드래그 앤 드롭으로 올리거나, 옵션 값을 입력합니다.
              대부분의 도구는 입력과 동시에 결과를 자동으로 갱신합니다.
            </li>
            <li>
              필요에 따라 옵션(들여쓰기, 압축률, 출력 포맷 등)을 조정합니다. 각 옵션 옆에는 짧은 설명을 함께 표시했습니다.
            </li>
            <li>
              결과 영역의 복사 버튼으로 클립보드에 바로 옮기거나, 다운로드 버튼으로 파일을 저장합니다.
              QR 코드, 이미지 같은 결과물은 PNG/JPG 등 원하는 포맷으로 내려받을 수 있습니다.
            </li>
            <li>
              자주 쓰는 도구는 별표 아이콘을 눌러 즐겨찾기에 추가해 두면 다음 방문 시 메인 화면에서 빠르게 열 수 있습니다.
              최근 사용 이력도 자동으로 기록되어 가까운 시점에 쓴 도구를 다시 찾기 편합니다.
            </li>
          </ol>
        </div>
      </section>

      {/* 주의사항 */}
      <section className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          알아두면 좋은 점
        </h2>
        <ul className="list-disc list-inside space-y-2 ml-2">
          <li>
            도구의 출력 결과는 참고 자료입니다. 계약서, 회계 자료, 의료 정보처럼 정확성이 중요한 용도에 쓰실 때는
            반드시 다른 방법으로 결과를 한 번 더 검증해 주세요.
          </li>
          <li>
            이미지 도구는 원본 파일을 수정하지 않고 새 파일을 만들어 제공합니다.
            업로드한 이미지는 브라우저 메모리에서만 처리되며 닫으면 자동으로 사라집니다.
          </li>
          <li>
            구형 브라우저(예: Internet Explorer)에서는 일부 기능이 정상 동작하지 않을 수 있습니다.
            Chrome, Edge, Safari, Firefox의 최신 버전 사용을 권장합니다.
          </li>
          <li>
            파일 크기가 매우 클 경우 브라우저 메모리 한계로 처리가 중단되거나 느려질 수 있습니다.
            동영상이나 고해상도 이미지는 미리 크기를 조정한 뒤 사용하시면 안정적입니다.
          </li>
          <li>
            결과물의 활용은 전적으로 이용자 책임이며, 정확도를 100% 보증하지 않습니다.
            특히 해시 생성, 토큰 분석 같은 보안 관련 작업은 참고용으로만 사용하시기 바랍니다.
          </li>
          <li>
            운세, 사주풀이, 심리 테스트, 추천 도구 등 재미 카테고리의 결과는 오락 목적의 콘텐츠입니다.
            중요한 결정의 근거로 사용하지 않으시는 것을 권장합니다.
          </li>
          <li>
            일부 도구는 외부 라이브러리를 활용해 동작하며, 라이브러리 버전 차이로 동일한 입력에 대해
            결과가 미세하게 다르게 보일 수 있습니다. 이런 경우 다른 도구의 결과와 교차 확인해 주세요.
          </li>
        </ul>
      </section>

      {/* 개인정보/쿠키/광고 안내 */}
      <section className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          데이터 보호 및 광고 정책
        </h2>
        <ul className="list-disc list-inside space-y-2 ml-2">
          <li>
            입력 데이터, 첨부 파일, 도구 옵션 값은 모두 사용자의 브라우저 안에서만 처리되며,
            툴피키 운영 서버로 전송되거나 저장되지 않습니다.
          </li>
          <li>
            서비스 품질 개선을 위해 페이지뷰, 기기 종류, 접속 경로 같은 익명 통계가 수집될 수 있습니다.
            이 데이터로 개별 사용자를 식별하지는 않습니다.
          </li>
          <li>
            즐겨찾기, 최근 사용 기록, 다크 모드 설정 같은 환경 값은 브라우저의 로컬 스토리지에만 저장되며
            본인 기기에서만 유지됩니다. 다른 기기에는 자동 동기화되지 않습니다.
          </li>
          <li>
            운영비 충당을 위해 일부 페이지에 광고가 노출됩니다. 광고는 <strong>Google AdSense</strong>와
            <strong> 카카오 애드핏(Kakao AdFit)</strong> 광고 네트워크를 통해 송출되며,
            이들 네트워크는 맞춤 광고 제공을 위해 쿠키를 사용할 수 있습니다.
          </li>
          <li>
            맞춤 광고를 원하지 않으시면 Google 광고 설정 페이지에서 비활성화하실 수 있습니다.
            브라우저 설정에서 쿠키를 차단하는 것도 가능합니다.
          </li>
          <li>
            운세, 사주풀이, 타로, 궁합, 복권, 채팅 페이지에는 광고를 게재하지 않으며,
            검색엔진에서도 색인되지 않도록 처리해 두었습니다.
          </li>
          <li>
            보다 자세한 사항은 <a href="/privacy" className="text-blue-600 dark:text-blue-400 underline">개인정보처리방침</a>과
            {' '}<a href="/terms" className="text-blue-600 dark:text-blue-400 underline">이용약관</a>을 참고해 주세요.
          </li>
        </ul>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          자주 묻는 질문 (FAQ)
        </h2>
        <div className="space-y-2">
          <details className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-gray-900 dark:text-white">
              Q. 정말 무료인가요? 결제 페이지는 없나요?
              <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">
              A. 네, 모든 도구를 무료로 제한 없이 사용하실 수 있습니다. 회원가입이나 카드 등록 절차가 없으며,
              유료 멤버십이나 잠겨 있는 프리미엄 기능도 두지 않았습니다. 운영비는 광고 수익으로만 충당합니다.
            </p>
          </details>
          <details className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-gray-900 dark:text-white">
              Q. 입력한 내용이 외부로 새지 않나요?
              <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">
              A. 거의 모든 도구는 서버를 거치지 않고 브라우저 안에서 직접 처리합니다.
              따라서 입력한 텍스트나 업로드한 파일이 툴피키 서버로 전송되지 않습니다.
              개발자 도구의 네트워크 탭에서 실제 요청을 확인하실 수도 있습니다.
            </p>
          </details>
          <details className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-gray-900 dark:text-white">
              Q. 인터넷이 끊겨도 작동하나요?
              <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">
              A. 페이지를 한 번 불러온 뒤에는 대부분의 도구가 오프라인 상태에서도 정상적으로 동작합니다.
              단, QR 코드 스캔처럼 외부 자원을 활용하는 일부 기능은 인터넷 연결이 필요할 수 있습니다.
            </p>
          </details>
          <details className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-gray-900 dark:text-white">
              Q. 즐겨찾기가 다른 기기에서도 보이나요?
              <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">
              A. 즐겨찾기와 최근 사용 기록은 각 브라우저의 로컬 스토리지에 저장되기 때문에
              다른 기기 또는 다른 브라우저에서는 동기화되지 않습니다. 시크릿 모드에서도 일시적으로만 유지됩니다.
            </p>
          </details>
          <details className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-gray-900 dark:text-white">
              Q. 어떤 브라우저를 써야 하나요?
              <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">
              A. Chrome, Edge, Safari, Firefox, Whale 등 최신 버전 브라우저라면 큰 문제 없이 사용하실 수 있습니다.
              모바일에서는 iOS Safari, 안드로이드 Chrome, 삼성 인터넷 등 주요 브라우저를 지원합니다.
            </p>
          </details>
          <details className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-gray-900 dark:text-white">
              Q. 도구 결과를 업무에 그대로 사용해도 되나요?
              <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">
              A. 일반적인 변환 도구(글자수 세기, JSON 포맷, 색상 변환 등)의 결과는 업무에 활용해도 무방합니다.
              다만 100% 정확성을 보증하지는 않으므로 중요한 결과물은 한 번 더 검토해 주세요.
              계약, 의료, 회계 등 결과 정확성이 매우 중요한 분야는 전문 도구와 함께 교차 확인하시는 것을 권장합니다.
            </p>
          </details>
          <details className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-gray-900 dark:text-white">
              Q. 광고는 모든 페이지에 노출되나요?
              <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">
              A. 아닙니다. 운세, 사주, 타로, 궁합, 복권, 채팅처럼 광고 정책상 적합하지 않거나 민감할 수 있는 페이지에는
              광고를 게재하지 않습니다. 일반 도구 페이지에는 Google AdSense와 카카오 애드핏 광고가 표시될 수 있습니다.
            </p>
          </details>
          <details className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-gray-900 dark:text-white">
              Q. 새로운 도구는 어떻게 추가되나요?
              <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">
              A. 운영자가 직접 사용해 보고 필요하다고 판단한 도구를 추가하거나, 이용자 피드백 중에서 수요가 있는 기능을 우선적으로 구현합니다.
              모든 도구는 직접 만들거나 검토한 뒤 게시하며, 비슷한 기능이 이미 있을 경우 중복 등록은 피하고 있습니다.
            </p>
          </details>
          <details className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-gray-900 dark:text-white">
              Q. 도구 제안이나 버그 제보는 어떻게 하나요?
              <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">
              A. <a href="/contact" className="text-blue-600 dark:text-blue-400 underline">문의하기</a> 페이지의 이메일 주소로 보내주시면 됩니다.
              버그 제보 시에는 사용한 브라우저, 입력 값, 발생한 화면을 함께 알려주시면 더 빠르게 확인할 수 있습니다.
            </p>
          </details>
          <details className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-gray-900 dark:text-white">
              Q. 모바일에서도 똑같이 쓸 수 있나요?
              <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">
              A. 네, 모든 도구는 모바일 화면에 맞춰 자동으로 레이아웃을 바꿉니다.
              다만 코드 포맷터처럼 가로로 긴 결과를 다루는 도구는 데스크톱에서 더 편하게 사용하실 수 있습니다.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}
