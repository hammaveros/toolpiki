import Link from 'next/link';

export default function ScreenRulerPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">계산/생성 · 2026년 7월 12일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        화면에서 픽셀 거리 재기, 자 가져다 대면 되는 도구
      </h1>

      <p className="mb-4">
        <Link href="/tools/screen-ruler" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 화면 픽셀 자 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        디자이너가 준 시안에서 버튼 간격이 몇 픽셀인지 확인하고 싶다. 눈대중으로는 모르겠고.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">화면 픽셀 측정이 필요한 순간</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>UI 구현 → 디자인 시안 보면서 여백, 크기 픽셀 확인</li>
        <li>디자인 리뷰 → 개발 결과물과 시안 수치 비교</li>
        <li>반응형 체크 → 브레이크포인트별 요소 크기 측정</li>
        <li>스크린샷 분석 → 캡처된 화면에서 요소 간 간격 확인</li>
        <li>웹 접근성 → 클릭 타겟 크기가 최소 44×44px 이상인지 확인</li>
        <li>광고 배너 사이즈 확인 → 실제 렌더링 크기 측정</li>
      </ul>

      <p className="mb-4">Figma나 Zeplin이 있으면 치수가 나오긴 한데, 개발하면서 브라우저에서 빠르게 재고 싶을 때는 개발자 도구에서 요소 선택해서 확인하는 게 번거로울 수 있다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>크롬 개발자 도구 → 요소 선택해야만 측정 가능, DOM에 없는 시각 요소 측정 어려움</li>
        <li>Figma → 원본 디자인 파일 있어야 함</li>
        <li>macOS 픽셀 자 유틸리티 → 별도 앱 설치 필요</li>
        <li>화면 캡처 후 포토샵 → 너무 번거로움</li>
        <li>눈대중 → 픽셀 단위로 정확하지 않음</li>
      </ul>

      <p className="mb-4">그냥 화면 위에 자 올려놓고 드래그하면 픽셀 나오면 되잖아.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">화면 위에 자 올려놓는 방식</h2>

      <p className="mb-3">브라우저 탭 하나에서 가로/세로 픽셀 자를 화면에 올려놓고 측정한다.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">주요 기능:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>드래그로 측정 영역 지정 → 시작점부터 끝점까지 픽셀 표시</li>
        <li>가로/세로 동시 측정 → X축, Y축 각각</li>
        <li>px/cm/inch 단위 전환 → DPI 기반 실제 물리 단위로도 확인 가능</li>
        <li>이미지 위에서 측정 → 스크린샷 올려놓고 측정 가능</li>
        <li>눈금 표시 → 10px 단위, 100px 단위 등</li>
        <li>측정 기록 → 여러 거리 측정값 목록 보관</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">활용 패턴:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>브라우저 창 옆에 띄워놓고 → 개발하면서 수시로 확인</li>
        <li>스크린샷 붙여넣기 → 화면 캡처 후 그 위에서 바로 측정</li>
        <li>모바일 시뮬레이터 → 작은 화면에서 터치 타겟 크기 확인</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>설치 없이 브라우저 탭 하나로 됨</li>
        <li>이미지 위에서 측정 가능 → 시안 스크린샷 올리고 바로 확인</li>
        <li>단위 전환 → px를 cm로 보고 싶을 때 바로</li>
        <li>측정값 히스토리 → 여러 군데 재고 비교 가능</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>다른 앱 화면 위에 올려서 측정은 안 됨 → 브라우저 내에서만</li>
        <li>OS 전체 화면 픽셀 자 앱 같은 기능은 아님</li>
        <li>touch 입력에서 정밀 드래그는 다소 불편할 수 있음</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>도구 열기 (이미지 붙여넣기 또는 그냥 빈 화면에서 시작)</li>
        <li>측정하려는 영역 드래그</li>
        <li>픽셀 값 확인</li>
      </ol>

      <p className="mb-4">3초면 된다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/screen-ruler" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 화면 픽셀 자 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">설치 없이 브라우저에서 바로 픽셀 측정.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #픽셀측정 #화면자 #UI개발 #프론트엔드 #디자인검토 #웹개발도구
      </p>
    </article>
  );
}
