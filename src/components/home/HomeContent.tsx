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
          툴피키(ToolPiki)는 매일 반복되는 귀찮은 작업을 몇 초 만에 끝낼 수 있도록 도와주는 웹 기반 도구 모음입니다.
          JSON 정리가 급할 때, 이미지 크기를 빠르게 줄여야 할 때, 색상 코드를 변환해야 할 때 — 검색하고 프로그램 깔 필요 없이 바로 해결할 수 있습니다.
        </p>
        <p className="leading-relaxed mb-3">
          가장 큰 특징은 데이터가 내 컴퓨터 밖으로 나가지 않는다는 점입니다. 모든 처리가 브라우저 안에서 이루어지기 때문에 민감한 정보가 담긴 파일도 걱정 없이 다룰 수 있습니다.
          별도의 로그인이나 결제도 없습니다.
        </p>
        <p className="leading-relaxed">
          데스크톱은 물론 스마트폰, 태블릿에서도 동일하게 동작합니다.
          현재 100여 가지 도구를 갖추고 있으며, 사용자 의견을 반영해 꾸준히 업데이트하고 있습니다.
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
            <p className="text-sm">
              글자수 확인, 줄 정렬, 공백 정리, 단어 빈도 분석, 두 텍스트 비교 등 글을 쓰거나 데이터를 정리할 때 유용한 기능을 모았습니다.
            </p>
          </Card>
          <Card variant="bordered" className="p-4 bg-white dark:bg-gray-900">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🔐 인코딩/변환</h3>
            <p className="text-sm">
              Base64, URL 인코딩, 해시 생성, JWT 분석, 유니코드 변환 등 개발 중 자주 쓰이는 데이터 변환 기능을 한 곳에서 이용할 수 있습니다.
            </p>
          </Card>
          <Card variant="bordered" className="p-4 bg-white dark:bg-gray-900">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">📋 코드 포맷터</h3>
            <p className="text-sm">
              JSON, XML, SQL, YAML 등 코드를 보기 좋게 정리하거나 CSS/JS를 압축하는 등 포맷 관련 도구를 지원합니다.
            </p>
          </Card>
          <Card variant="bordered" className="p-4 bg-white dark:bg-gray-900">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🖼️ 이미지 편집</h3>
            <p className="text-sm">
              이미지 압축, 크기 조절, 포맷 변환, 자르기, 배경 제거, 파비콘 만들기 등 간단한 이미지 작업을 설치 없이 처리합니다.
            </p>
          </Card>
          <Card variant="bordered" className="p-4 bg-white dark:bg-gray-900">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🎨 색상 관련</h3>
            <p className="text-sm">
              색상 코드 변환(HEX/RGB/HSL), 팔레트 추천, 그라데이션 생성, 접근성 대비 검사 등 디자인 워크플로에 도움이 되는 도구입니다.
            </p>
          </Card>
          <Card variant="bordered" className="p-4 bg-white dark:bg-gray-900">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🔢 계산기/생성기</h3>
            <p className="text-sm">
              UUID, QR코드, 비밀번호 생성부터 날짜 차이 계산, 단위 환산, 진법 변환까지 다양한 생성 및 계산 도구를 제공합니다.
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
          <p>복잡한 절차 없이 누구나 바로 사용할 수 있습니다.</p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>상단 검색창에 키워드를 입력하거나, 카테고리 목록에서 원하는 도구를 찾습니다.</li>
            <li>도구 화면에서 데이터를 입력하거나 파일을 드래그 앤 드롭합니다.</li>
            <li>옵션을 조정하고 실행하면 즉시 결과가 표시됩니다.</li>
            <li>결과를 클립보드에 복사하거나 파일로 내려받을 수 있습니다.</li>
          </ol>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            별표 아이콘을 눌러 즐겨찾기에 등록하면, 다음에 더 빠르게 접근할 수 있습니다. 최근 사용 이력도 자동 기록됩니다.
          </p>
        </div>
      </section>

      {/* 주의사항 */}
      <section className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          알아두면 좋은 점
        </h2>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>도구의 출력 결과는 참고 목적이므로, 업무용으로 사용할 경우 반드시 재확인 바랍니다.</li>
          <li>이미지 관련 도구는 원본을 건드리지 않고 새 파일을 생성합니다.</li>
          <li>구형 브라우저에서는 일부 기능이 정상 동작하지 않을 수 있으니 최신 브라우저를 권장합니다.</li>
          <li>파일 크기가 매우 클 경우 브라우저 자체 메모리 한계로 처리가 중단될 수 있습니다.</li>
          <li>결과물의 활용은 전적으로 사용자 책임이며, 정확도를 100% 보증하지 않습니다.</li>
        </ul>
      </section>

      {/* 개인정보/쿠키/광고 안내 */}
      <section className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          데이터 보호 및 광고 정책
        </h2>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>입력 데이터와 첨부 파일은 사용자의 브라우저 내에서만 처리되며, 외부 서버로 전송되지 않습니다.</li>
          <li>서비스 품질 개선을 위해 방문 통계(페이지뷰, 기기 정보 등)가 익명으로 수집될 수 있습니다.</li>
          <li>즐겨찾기와 최근 사용 기록은 로컬 스토리지에 보관되므로 본인 기기에서만 유지됩니다.</li>
          <li>운영비 충당을 위해 광고가 게재될 수 있으며, 광고 네트워크에서 쿠키를 활용할 수 있습니다.</li>
          <li>보다 자세한 사항은 <a href="/privacy" className="text-blue-600 dark:text-blue-400 underline">개인정보처리방침</a>을 참고해 주세요.</li>
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
              Q. 완전 무료인가요?
              <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">A. 네, 모든 기능을 무료로 제한 없이 이용하실 수 있습니다. 숨겨진 유료 기능은 없습니다.</p>
          </details>
          <details className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-gray-900 dark:text-white">
              Q. 내 데이터가 외부로 유출될 위험이 있나요?
              <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">A. 아닙니다. 모든 작업은 브라우저 안에서 처리되며, 입력 내용이 서버로 전송되는 일은 없습니다.</p>
          </details>
          <details className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-gray-900 dark:text-white">
              Q. 인터넷 연결이 끊겨도 작동하나요?
              <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">A. 처음 페이지를 로드한 뒤에는 대부분의 도구가 오프라인에서도 정상 동작합니다.</p>
          </details>
          <details className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-gray-900 dark:text-white">
              Q. 즐겨찾기 기록이 다른 기기에서도 보이나요?
              <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">A. 즐겨찾기는 각 브라우저의 로컬 스토리지에 저장되므로, 다른 기기에서는 동기화되지 않습니다.</p>
          </details>
          <details className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-gray-900 dark:text-white">
              Q. 어떤 브라우저를 써야 하나요?
              <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">A. Chrome, Edge, Safari, Firefox 등 최신 버전이라면 문제없이 사용할 수 있습니다.</p>
          </details>
          <details className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-gray-900 dark:text-white">
              Q. 도구 제안이나 버그 제보는 어떻게 하나요?
              <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">A. 페이지 하단의 피드백 링크를 통해 의견을 보내주시면 빠르게 반영하겠습니다.</p>
          </details>
        </div>
      </section>
    </div>
  );
}
