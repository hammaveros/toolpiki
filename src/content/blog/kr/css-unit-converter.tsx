import Link from 'next/link';

export default function CssUnitConverterPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">계산기 · 2026년 7월 18일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        px를 rem으로 바꿀 때마다 계산기 꺼내는 거 이제 그만
      </h1>

      <p className="mb-4">
        <Link href="/tools/css-unit-converter" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 CSS 단위 변환기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        디자인 시안은 px인데 코드는 rem으로 써야 하고... 16으로 나누는 거 맞는데 왜 이게 맨날 귀찮냐.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">이 상황 공감되면 계속 읽어봐</h2>

      <p className="mb-3">CSS 작업하다 보면 이런 순간들이 꼭 생긴다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>피그마 디자인은 px → 접근성 위해 rem으로 작성해야 할 때</li>
        <li>반응형 레이아웃 짜다가 vw 계산 필요할 때 → 뷰포트 1440px 기준으로 360px는 몇 vw?</li>
        <li>em 값 결정해야 하는데 부모 폰트 크기 달라서 헷갈릴 때</li>
        <li>Tailwind 쓰다가 커스텀 값 px로 넣어야 할 때 역으로 변환</li>
        <li>모바일/데스크톱 폰트 크기 조율할 때 px↔rem 왔다갔다</li>
      </ul>

      <p className="mb-4">
        이게 진짜 자주 있는 일인데, 매번 계산기 앱 열어서 나누기 하는 게 은근히 시간 잡아먹는다.
        특히 값 여러 개 한꺼번에 바꿔야 할 때.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법들의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>계산기 앱으로 직접 계산 → 오차 없는지 매번 확인해야 하고, 여러 값 처리하면 지침</li>
        <li>구글 검색에서 "24px to rem" → 나오긴 나오는데 기준 폰트가 16px 고정이라 프로젝트 설정이 다르면 다시 계산</li>
        <li>피그마 플러그인 → 설치해야 하고, 브라우저에서 작업할 때는 쓸 수 없음</li>
        <li>VSCode 확장 → 에디터에서만 작동, 빠른 단발성 변환엔 과함</li>
        <li>직접 CSS 변수로 만들어두기 → 프로젝트 안에서는 좋은데 사전 계산이 필요한 상황엔 그래도 변환기가 필요함</li>
      </ul>

      <p className="mb-4">
        결국 필요한 건 기준 폰트 크기를 내가 설정하고, 뷰포트도 내가 지정해서 변환해주는 웹 도구였다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 직접 만들었음</h2>

      <p className="mb-3">변환 지원 단위:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>px ↔ rem</strong> → 기준 폰트 크기 직접 설정 (기본 16px, 변경 가능)</li>
        <li><strong>px ↔ em</strong> → 부모 요소 폰트 크기 기준으로 계산</li>
        <li><strong>px ↔ vw / vh</strong> → 뷰포트 가로/세로 크기 입력하면 비율 계산</li>
        <li><strong>px ↔ %</strong> → 부모 요소 크기 기준 퍼센트 변환</li>
        <li><strong>pt ↔ px</strong> → 인쇄/앱 작업 시 포인트 단위 변환</li>
      </ul>

      <p className="mb-3">주요 기능:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>기준값 커스텀</strong> → 기준 폰트 크기 10px, 14px, 16px, 18px 등 자유 입력</li>
        <li><strong>뷰포트 크기 설정</strong> → 1280, 1440, 1920px 등 직접 지정</li>
        <li><strong>양방향 실시간 변환</strong> → px 입력하면 rem 나오고, rem 입력하면 px로 역변환</li>
        <li><strong>결과 복사 버튼</strong> → 클립보드에 바로 복사</li>
        <li><strong>일괄 변환 표</strong> → 주요 px 값들(8, 12, 14, 16, 20, 24, 32, 48, 64px)에 대한 rem/em 값 한눈에 보기</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">CSS 단위, 언제 뭘 써야 하나</h2>

      <p className="mb-3">변환 도구 쓰면서 한 번쯤 짚고 넘어가면 좋은 부분:</p>

      <ul className="space-y-2 mb-4 text-gray-700 dark:text-gray-300">
        <li>
          <strong>px</strong> → 고정 크기. 브라우저 폰트 크기 설정 변경해도 영향 안 받음.
          아이콘, 보더, 그림자 등 픽셀 단위로 제어해야 할 때 적합.
        </li>
        <li>
          <strong>rem</strong> → 루트(<code>html</code>) 폰트 크기 기준. 접근성 권장 단위.
          브라우저에서 폰트 크기 키워도 비율대로 커짐. 대부분 텍스트/여백에 권장.
        </li>
        <li>
          <strong>em</strong> → 부모 요소 폰트 크기 기준. 중첩되면 계산 복잡해질 수 있어서 주의 필요.
          컴포넌트 내부에서 상대적 크기 줄 때 유용.
        </li>
        <li>
          <strong>vw / vh</strong> → 뷰포트 크기 기준. 전체 화면 채우는 히어로 섹션, 풀페이지 레이아웃 등에 사용.
          작은 텍스트에 쓰면 너무 작아지거나 커질 수 있어서 clamp()랑 같이 쓰는 경우 많음.
        </li>
        <li>
          <strong>%</strong> → 부모 요소 기준 비율. 반응형 레이아웃에서 폭 지정할 때 자주 사용.
        </li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>기준 폰트 크기 바꿀 수 있어서 프로젝트 설정 다른 경우도 커버됨</li>
        <li>일괄 변환 표 → 매번 계산 안 해도 되고, 주요 값 한 번에 파악 가능</li>
        <li>양방향 변환 → rem → px 역으로도 되니까 기존 코드 분석할 때도 유용함</li>
        <li>복사 버튼 → 결과값 바로 코드에 붙여넣기 가능</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>CSS clamp() 같은 복합 함수 자동 생성은 없음</li>
        <li>Sass/Less 변수 형태로 내보내는 기능은 없음</li>
        <li>실제 렌더링 결과 미리보기는 없음 → 어디까지나 계산기</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-2 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>기준 폰트 크기 설정 (기본 16px, 프로젝트 다르면 변경)</li>
        <li>변환할 값 입력 (px 또는 rem/em 등)</li>
        <li>실시간으로 변환 결과 확인</li>
        <li>복사 버튼 눌러서 바로 코드에 사용</li>
        <li>vw/vh 변환 필요하면 뷰포트 크기도 입력</li>
      </ol>

      <p className="mb-4">
        10초면 된다. 계산기 열 시간에 이미 결과 나와있음.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/css-unit-converter" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 CSS 단위 변환기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">
        px 계산 매번 머리로 하던 거 이제 그냥 여기 와서 넣으면 됨.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #CSS단위변환 #px변환rem #CSS계산기 #프론트엔드 #웹개발 #반응형디자인
      </p>
    </article>
  );
}
