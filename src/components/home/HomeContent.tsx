'use client';

import { Card } from '@/components/ui/Card';

export function HomeContent() {
  return (
    <div className="space-y-6 text-gray-700 dark:text-gray-300">
      {/* 사이트 소개 */}
      <section className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          ToolPiki 소개
        </h2>
        <p className="leading-relaxed mb-3">
          ToolPiki는 일상과 업무에서 자주 필요한 작은 도구들을 웹에서 바로 사용할 수 있도록 제공하는 무료 온라인 유틸리티 사이트입니다.
          별도의 프로그램 설치나 회원가입 없이, 브라우저만 있으면 텍스트 변환, 이미지 편집, 데이터 포맷 정리, 색상 코드 변환 등 다양한 작업을 즉시 처리할 수 있습니다.
        </p>
        <p className="leading-relaxed mb-3">
          모든 도구는 브라우저에서 직접 처리되므로 입력한 텍스트나 업로드 파일이 서버로 전송되지 않습니다.
          개인정보가 포함된 문서도 안심하고 처리할 수 있으며, 인터넷 연결이 불안정해도 대부분의 기능을 사용할 수 있습니다.
        </p>
        <p className="leading-relaxed">
          PC와 모바일 환경 모두 편하게 사용할 수 있습니다.
          개발자, 디자이너, 마케터, 학생, 직장인 등 누구나 반복적인 단순 작업 시간을 줄이고 생산성을 높일 수 있습니다.
          현재 100개 이상의 도구를 제공하며, 계속해서 새로운 도구를 추가하고 있습니다.
        </p>
      </section>

      {/* 카테고리 소개 */}
      <section className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          주요 도구 카테고리
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card variant="bordered" className="p-4 bg-white dark:bg-gray-900">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">📝 텍스트 도구</h3>
            <p className="text-sm">
              글자수 세기, 대소문자 변환, 줄바꿈 제거, 중복 줄 제거, 텍스트 정렬 및 비교 등 문서 작업에 필요한 텍스트 처리 기능을 제공합니다.
            </p>
          </Card>
          <Card variant="bordered" className="p-4 bg-white dark:bg-gray-900">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🔐 인코딩/디코딩</h3>
            <p className="text-sm">
              Base64, URL 인코딩, HTML 엔티티, 유니코드, 모스부호, JWT 디코딩 등 다양한 데이터 변환 도구를 지원합니다.
            </p>
          </Card>
          <Card variant="bordered" className="p-4 bg-white dark:bg-gray-900">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">📋 포맷/변환</h3>
            <p className="text-sm">
              JSON, XML, SQL, YAML 포맷 정리 및 변환, CSS/JS 압축, 마크다운 미리보기 등 개발자와 일반 사용자 모두에게 유용한 포맷터를 제공합니다.
            </p>
          </Card>
          <Card variant="bordered" className="p-4 bg-white dark:bg-gray-900">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🖼️ 이미지 도구</h3>
            <p className="text-sm">
              이미지 리사이즈, 압축, 포맷 변환(PNG/JPG/WebP), 자르기, 회전, Base64 변환, 파비콘 생성 등 이미지 편집 기능을 브라우저에서 바로 사용할 수 있습니다.
            </p>
          </Card>
          <Card variant="bordered" className="p-4 bg-white dark:bg-gray-900">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🎨 색상 도구</h3>
            <p className="text-sm">
              HEX, RGB, HSL 색상 코드 변환, 팔레트 생성, 그라데이션 생성, 명도 대비 검사, 이미지 색상 추출 등 디자인 작업에 필요한 색상 관련 기능을 제공합니다.
            </p>
          </Card>
          <Card variant="bordered" className="p-4 bg-white dark:bg-gray-900">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🔢 계산/생성 도구</h3>
            <p className="text-sm">
              UUID 생성, QR코드 생성, 날짜 계산, 퍼센트 계산, 진법 변환, 단위 환산, 비밀번호 생성 등 실용적인 계산 및 데이터 생성 도구를 제공합니다.
            </p>
          </Card>
        </div>
      </section>

      {/* 사용 방법 */}
      <section className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          사용 방법
        </h2>
        <div className="space-y-2">
          <p>ToolPiki의 모든 도구는 동일한 방식으로 간편하게 사용할 수 있습니다.</p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>메인 페이지에서 필요한 도구를 검색하거나 카테고리에서 선택합니다.</li>
            <li>도구 페이지에서 텍스트를 입력하거나 파일을 업로드합니다.</li>
            <li>필요한 옵션을 설정한 후 변환/실행 버튼을 클릭합니다.</li>
            <li>결과를 확인하고, 복사하거나 다운로드합니다.</li>
          </ol>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            자주 사용하는 도구는 즐겨찾기에 추가하여 빠르게 접근할 수 있으며, 최근 사용한 도구 목록도 자동으로 저장됩니다.
          </p>
        </div>
      </section>

      {/* 주의사항 */}
      <section className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          결과 확인 및 주의사항
        </h2>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>모든 도구의 결과는 참고용으로 제공되며, 중요한 작업에는 결과를 다시 한번 확인해 주세요.</li>
          <li>이미지 변환, 압축 등의 작업은 원본 파일을 직접 수정하지 않으며, 별도의 결과 파일이 생성됩니다.</li>
          <li>브라우저 환경에 따라 일부 기능의 동작이 다를 수 있습니다. 최신 버전의 Chrome, Firefox, Safari, Edge 사용을 권장합니다.</li>
          <li>대용량 파일 처리 시 브라우저 메모리 제한으로 인해 처리 속도가 느려지거나 실패할 수 있습니다.</li>
          <li>도구 사용 결과에 대한 최종 책임은 사용자에게 있으며, 서비스 제공자는 결과의 정확성을 보장하지 않습니다.</li>
        </ul>
      </section>

      {/* 개인정보/쿠키/광고 안내 */}
      <section className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          개인정보 및 광고 안내
        </h2>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>도구에 입력한 텍스트나 업로드 파일은 서버로 전송되지 않으며, 브라우저에서만 처리됩니다.</li>
          <li>다만 서비스 운영/통계를 위해 접속 정보(IP, 브라우저 등)가 자동 수집될 수 있습니다.</li>
          <li>즐겨찾기, 최근 사용 기록은 브라우저 로컬 스토리지에 저장되며, 사용자 기기에만 남습니다.</li>
          <li>서비스 운영을 위해 광고가 표시될 수 있으며, 광고 제공업체의 쿠키가 사용될 수 있습니다.</li>
          <li>자세한 내용은 <a href="/privacy" className="text-blue-600 dark:text-blue-400 underline">개인정보처리방침</a> 페이지를 참고해 주세요.</li>
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
              Q. 회원가입이 필요한가요?
              <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">A. 아니요, 모든 도구는 회원가입 없이 무료로 사용할 수 있습니다.</p>
          </details>
          <details className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-gray-900 dark:text-white">
              Q. 업로드한 파일은 어디에 저장되나요?
              <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">A. 파일은 서버로 전송되지 않으며, 브라우저에서만 처리됩니다. 페이지를 닫으면 데이터는 사라집니다.</p>
          </details>
          <details className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-gray-900 dark:text-white">
              Q. 모바일에서도 사용할 수 있나요?
              <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">A. 네, 모든 도구는 모바일 브라우저에서도 사용할 수 있도록 최적화되어 있습니다.</p>
          </details>
          <details className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-gray-900 dark:text-white">
              Q. 처리할 수 있는 파일 크기에 제한이 있나요?
              <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">A. 브라우저 메모리 제한에 따라 대용량 파일(수십 MB 이상)은 처리가 어려울 수 있습니다.</p>
          </details>
          <details className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-gray-900 dark:text-white">
              Q. 오류가 발생하면 어떻게 하나요?
              <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">A. 페이지를 새로고침하거나 다른 브라우저에서 시도해 보세요. 문제가 지속되면 하단의 연락처로 알려주세요.</p>
          </details>
          <details className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-gray-900 dark:text-white">
              Q. 새로운 도구를 요청할 수 있나요?
              <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">A. 네, 필요한 도구가 있다면 문의를 통해 알려주시면 검토 후 추가해 보겠습니다.</p>
          </details>
        </div>
      </section>
    </div>
  );
}
