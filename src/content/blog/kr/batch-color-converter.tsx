import Link from 'next/link';

export default function BatchColorConverterPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">색상 · 2026-07-16 · 5분 읽기</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        색상 20개 하나씩 변환하다 지쳐서 일괄 변환 도구 만들었음
      </h1>

      <p className="mb-4">
        <Link href="/tools/batch-color-converter" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 여러 색상 일괄 변환 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        디자인 시스템 색상 토큰 정리하다가 HEX 20개를 하나씩 RGB로 바꾸는 나 자신을 발견함. 이건 아니다 싶었음.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 필요한지</h2>

      <p className="mb-3">혼자 색상 하나 바꾸는 건 괜찮음. 근데 이런 상황이 되면 얘기가 달라짐:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>디자인 시스템 구축 → 피그마에서 뽑은 색상 토큰 수십 개를 CSS 변수로 정리할 때</li>
        <li>Tailwind 커스텀 팔레트 → <code>tailwind.config.js</code>에 넣을 색상들 형식 통일 필요</li>
        <li>디자이너 핸드오프 → 피그마 HEX 값 일괄 RGB/HSL로 변환해서 스펙 문서에 넣을 때</li>
        <li>다크모드 토큰 정리 → 라이트/다크 두 세트 색상 동시에 변환할 때</li>
        <li>레거시 코드 마이그레이션 → 구버전에서 쓰던 색상 형식 새 형식으로 일괄 교체</li>
        <li>브랜드 가이드라인 작성 → 동일 색상을 HEX/RGB/CMYK 전부 표기해야 할 때</li>
        <li>CSS-in-JS 전환 → styled-components로 갈아타면서 색상 코드 형식 바꿔야 할 때</li>
      </ul>

      <p className="mb-4">공통점이 뭐냐면, 색상 하나가 아니라 <strong>여러 개를 동시에</strong> 처리해야 한다는 거임. 이럴 때 하나씩 변환하는 건 진짜 비효율 중에 비효율.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법 문제</h2>

      <p className="mb-3">뭐 방법이 없는 건 아님. 근데 다 불편함:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>구글 "hex to rgb" 검색 → 한 번에 하나씩만 됨. 20개면 20번 검색.</li>
        <li>색상 변환 사이트 → 대부분 단일 입력 UI. 여러 개 붙여넣기 안 됨.</li>
        <li>피그마 플러그인 → 있긴 한데 팀 플랜 아니면 제한 있거나 설치 귀찮음.</li>
        <li>직접 스크립트 짜기 → 가능하긴 한데 매번 짜는 것도 귀찮고, 출력 포맷도 신경 써야 함.</li>
        <li>엑셀/스프레드시트 → 색상 변환 공식 넣어서 쓰는 사람도 있는데 세팅이 번거롭고 공유 안 됨.</li>
      </ul>

      <p className="mb-4">결국 "에라 모르겠다 하나씩 하자"가 됨. 근데 30개 되면 진짜 고통임 ㅋㅋ</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">여러 색상 코드를 한 번에 붙여넣고 원하는 형식으로 일괄 변환하는 도구:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>HEX 여러 개 한꺼번에 입력 → RGB / HSL / CMYK 동시 변환</li>
        <li>지원 형식: HEX, RGB, RGBA, HSL, HSLA, CMYK</li>
        <li>입력 형식 자동 감지 → HEX 섞여 있어도, RGB 섞여 있어도 알아서 파싱</li>
        <li>변환 결과 전체 복사 → 한 번에 클립보드로, 바로 붙여넣기 가능</li>
        <li>미리보기 스와치 → 색상이 실제로 어떻게 보이는지 바로 확인</li>
        <li>CSS 변수 형식 내보내기 → <code>--color-primary: #1E90FF;</code> 형태로 바로 복사</li>
      </ul>

      <p className="mb-4">디자인 시스템 작업할 때 "색상 토큰 정리"에 드는 시간이 진짜 확 줄었음. 예전엔 색상 하나씩 복붙하면서 30분 걸리던 거 이제 2분도 안 걸림.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">색상 코드 형식 간단 정리</h2>

      <p className="mb-3">헷갈리는 사람 있을까봐 짧게 설명:</p>

      <ul className="space-y-2 mb-4 text-gray-700 dark:text-gray-300">
        <li>
          <strong>HEX (#RRGGBB)</strong> — 디자이너 도구 기본값. 피그마, Adobe XD, Sketch 전부 HEX. 예: <code>#1E90FF</code>
        </li>
        <li>
          <strong>RGB (r, g, b)</strong> — CSS 웹 개발 기본. 각 채널 0~255. 예: <code>rgb(30, 144, 255)</code>
        </li>
        <li>
          <strong>RGBA</strong> — RGB + 불투명도(alpha). 반투명 배경, 오버레이에 필수. 예: <code>rgba(30, 144, 255, 0.5)</code>
        </li>
        <li>
          <strong>HSL (hue, saturation%, lightness%)</strong> — 색조/채도/명도. 프로그래밍으로 색상 조작할 때 직관적. 다크모드 색상 파생에 자주 씀.
        </li>
        <li>
          <strong>CMYK</strong> — 인쇄용. 실제 인쇄물 제작할 때 인쇄소에 넘기는 형식. 디지털 화면에서는 잘 안 씀.
        </li>
      </ul>

      <p className="mb-4">프론트엔드 개발하면서 가장 자주 필요한 건 HEX ↔ RGB/RGBA ↔ HSL 이 세 가지임. CMYK는 인쇄 작업할 때나 쓰고.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-3"><strong>좋은 점:</strong></p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>디자인 시스템 색상 토큰 정리가 진짜 빠르게 됨</li>
        <li>피그마에서 뽑은 값 그대로 붙여넣으면 알아서 파싱해줌</li>
        <li>색상 미리보기가 있어서 변환 중 실수 바로 발견 가능</li>
        <li>CSS 변수 형식으로 바로 내보내기 가능 → 코드에 그냥 붙여넣으면 됨</li>
        <li>로그인/회원가입 없음. 그냥 쓰면 됨.</li>
      </ul>

      <p className="mb-3"><strong>한계:</strong></p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>색상 이름(name) 기반 변환은 안 됨 — <code>dodgerblue</code> 같은 CSS 색상 이름은 HEX로 먼저 바꿔야 함</li>
        <li>Sass/Less 변수 파일 형식으로 직접 내보내기는 아직 없음</li>
        <li>색상 100개 이상 되면 살짝 느릴 수 있음 (50개 이하는 즉시 됨)</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">활용 팁</h2>

      <p className="mb-3">이런 식으로 쓰면 더 편함:</p>

      <ul className="space-y-2 mb-4 text-gray-700 dark:text-gray-300">
        <li>
          <strong>피그마에서 색상 토큰 추출</strong> → 플러그인으로 HEX 값 내보내기 → 이 도구에 붙여넣기 → CSS 변수로 변환 → <code>tokens.css</code>에 붙여넣기
        </li>
        <li>
          <strong>Tailwind 색상 팔레트 만들기</strong> → 브랜드 컬러 HEX들 입력 → RGB 형식으로 변환 → <code>tailwind.config.js</code>에 RGB 값 넣으면 opacity 조절 편함
        </li>
        <li>
          <strong>다크모드 색상 파생</strong> → 라이트 모드 색상 HSL로 변환 → Lightness 값만 조정해서 다크 모드 색상 만들기
        </li>
        <li>
          <strong>브랜드 가이드 작성</strong> → 주요 색상들 HEX/RGB/CMYK 세 형식 동시에 변환 → 가이드 문서에 일괄 붙여넣기
        </li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-2 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>색상 코드 여러 개를 입력창에 붙여넣기 (한 줄에 하나씩, 또는 쉼표로 구분)</li>
        <li>변환할 대상 형식 선택 (RGB / HSL / CMYK 등)</li>
        <li>실시간으로 변환 결과 확인 — 색상 스와치로 맞는지 눈으로도 체크</li>
        <li>전체 복사 버튼 → 클립보드에 복사</li>
        <li>CSS 변수 형식 필요하면 "CSS 변수로 내보내기" 클릭</li>
        <li>코드에 붙여넣기. 끝.</li>
      </ol>

      <p className="mb-4">피그마 색상 20개 → CSS 변수 파일 → 2분 이내.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/batch-color-converter" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 여러 색상 일괄 변환 바로 가기
        </Link>
      </p>

      <p className="mb-4">디자인 시스템 정리하거나 색상 토큰 작업 중이라면 한 번 써봐. 하나씩 변환하던 시간이 얼마나 날아가는지 체감됨 ㅋㅋ</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #색상변환 #디자인시스템 #HEX #RGB #HSL #CSS색상 #색상코드 #일괄변환 #프론트엔드
      </p>
    </article>
  );
}
