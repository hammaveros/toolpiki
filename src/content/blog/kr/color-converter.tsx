import Link from 'next/link';

export default function ColorConverterPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">색상 · 2026-06-20 · 4분 읽기</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        디자이너가 HEX 주면 개발자는 RGB로 바꿔야 함. 매번 검색하는 게 피곤해서 만들었음
      </h1>

      <p className="mb-4">
        <Link href="/tools/color-converter" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 색상 변환기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        디자이너: "#1E90FF 이 색 써주세요" → 개발자: "CSS에는 rgb()로 넣어야 하는데…" → 구글 검색 → 변환 사이트 찾기 → 광고 닫기 → 드디어 변환.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 필요한지</h2>

      <p className="mb-3">색상 코드 변환이 필요한 상황들:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>디자인 시스템 구축 → 피그마의 HEX 값을 CSS 변수로 정리할 때 HSL이 편함</li>
        <li>React/CSS 스타일링 → <code>rgba()</code>로 불투명도 조절이 필요한 경우</li>
        <li>Tailwind 커스텀 색상 → <code>tailwind.config.js</code>에 HEX 넣거나 RGB 넣거나 형식 통일 필요</li>
        <li>안드로이드/iOS 개발 → 각각 다른 색상 형식 사용 (안드로이드 <code>#AARRGGBB</code>, iOS는 0~1 범위)</li>
        <li>디자이너와 협업 → 피그마에서 준 색상을 코드에 정확히 반영하고 싶을 때</li>
        <li>색상 테마 커스터마이즈 → Material UI, Chakra UI 같은 라이브러리 테마 설정</li>
        <li>다크모드 색상 계산 → HSL로 변환하면 밝기(L) 값만 바꿔서 다크모드 색상 만들기 편함</li>
      </ul>

      <p className="mb-4">색상 코드 형식이 여러 가지라는 게 처음엔 귀찮은데, 알고 보면 각자 쓰임새가 다름.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">HEX / RGB / HSL이 뭔지 간단 설명</h2>

      <p className="mb-3">모를 수도 있으니까 짧게:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>HEX (#RRGGBB)</strong> → 디자이너들이 주로 씀. 피그마, 포토샵 기본값. 예: <code>#1E90FF</code></li>
        <li><strong>RGB (r, g, b)</strong> → CSS에서 자주 씀. 각 색상 채널을 0~255로. 예: <code>rgb(30, 144, 255)</code></li>
        <li><strong>RGBA (r, g, b, a)</strong> → RGB + 불투명도(0~1). 반투명 효과에 필수</li>
        <li><strong>HSL (h, s%, l%)</strong> → 색조, 채도, 명도로 표현. 프로그래밍으로 색상 조작할 때 직관적</li>
        <li><strong>HSLA (h, s%, l%, a)</strong> → HSL + 불투명도</li>
        <li><strong>HSV/HSB</strong> → 포토샵에서 쓰는 방식. HSL과 비슷하지만 밝기 계산 방식 다름</li>
        <li><strong>CMYK</strong> → 인쇄용. 디지털 화면이 아닌 프린트 디자인에서 씀</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>구글에서 "hex to rgb" 검색 → 상단 계산기가 나오긴 하는데 HSL은 별도 검색 필요</li>
        <li>색상 변환 사이트들 → 광고 많음, 모바일에서 불편, 한 번에 여러 형식 못 봄</li>
        <li>직접 계산 → 공식이 있긴 한데 매번 계산하기 귀찮음</li>
        <li>포토샵/피그마 → 앱 열어야 하고, 변환 결과 복사하는 과정이 번거로움</li>
        <li>개발자 도구 콘솔 → 직접 변환 코드 짜면 되는데 매번 짜기 귀찮음</li>
      </ul>

      <p className="mb-4">결국 "그냥 HEX로 쓰자" 하거나, 여러 사이트 왔다 갔다 하게 됨.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">한 화면에서 모든 형식 동시에 볼 수 있는 변환기:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>HEX → RGB / RGBA / HSL / HSLA / HSV / CMYK 한 번에</li>
        <li>어떤 형식이든 입력 → 나머지 다 자동 계산</li>
        <li>컬러 피커 → 색상 직접 선택해서 코드 확인 가능</li>
        <li>각 값 클릭하면 바로 복사 → 따로 드래그 선택 안 해도 됨</li>
        <li>색상 미리보기 → 어떤 색인지 실시간으로 확인</li>
        <li>불투명도 슬라이더 → RGBA/HSLA 값 조절 편하게</li>
      </ul>

      <p className="mb-3">제일 유용한 기능은 "어떤 형식이든 입력 가능"이라는 것. RGB로 시작했다가 HEX가 필요하면 별도 변환 없이 그냥 HEX 칸 보면 됨.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">개발할 때 색상 형식 선택 가이드</h2>

      <p className="mb-3">상황별로 뭘 쓸지:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>CSS 색상 변수 정의 → HEX나 HSL 둘 다 괜찮음</li>
        <li>불투명도 필요 → RGBA 또는 HSLA 써야 함. HEX로는 투명 처리 불편</li>
        <li>다크모드 색상 시스템 → HSL 추천. <code>hsl(220, 70%, 50%)</code>에서 L 값만 바꾸면 됨</li>
        <li>Tailwind CSS → HEX로 넣어도 내부에서 변환해줌</li>
        <li>Canvas API, Three.js → 0~1 범위 RGB 필요한 경우 있음 → RGB 255 값을 255로 나눔</li>
        <li>애니메이션 색상 변화 → HSL이 더 자연스러운 전환 나옴</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>HEX 하나 입력하면 모든 형식 동시에 보임 → 편함</li>
        <li>클릭 복사 → CSS 코드에 바로 붙여넣기 가능</li>
        <li>컬러 피커로 눈으로 보면서 색상 찾기 가능</li>
        <li>불투명도 조절 → RGBA 값 직접 계산 안 해도 됨</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>색상 팔레트 저장/관리 기능은 없음 → 단순 변환 용도</li>
        <li>색상 접근성 검사 (대비율 체크) → 별도 툴 필요</li>
        <li>색상 이름 검색 (예: "tomato" → #FF6347) → 지원 안 함</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>HEX 코드 입력 (또는 컬러 피커로 선택)</li>
        <li>모든 형식 자동으로 표시됨</li>
        <li>필요한 값 클릭해서 복사</li>
        <li>코드에 붙여넣기</li>
      </ol>

      <p className="mb-4">10초면 됨.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/color-converter" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 색상 변환기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">HEX 넣으면 바로 RGB, HSL 다 나옴.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #색상변환 #HEX변환 #RGB변환 #HSL #CSS색상 #컬러코드 #디자인개발협업
      </p>
    </article>
  );
}
