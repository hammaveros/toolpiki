import Link from 'next/link';

export default function HtmlBoilerplatePost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">개발도구 · 2026년 7월 8일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        HTML 기본 구조 외우기 귀찮아서 만든 템플릿 생성기
      </h1>

      <p className="mb-4">
        <Link href="/tools/html-boilerplate" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 HTML 보일러플레이트 생성기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        새 HTML 파일 만들 때마다 기본 구조 타이핑하는 게 귀찮다. 빠진 거 있는지도 불안하고.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">HTML 보일러플레이트가 필요한 상황</h2>

      <p className="mb-3">이런 경우들:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>빠른 프로토타입 → 프레임워크 없이 순수 HTML</li>
        <li>이메일 템플릿 → 이메일용 HTML 구조는 웹과 다름</li>
        <li>랜딩페이지 → 간단한 정적 페이지</li>
        <li>HTML 강의/교육 → 학생들에게 나눠줄 시작 파일</li>
        <li>GitHub Pages → 정적 사이트 빠르게 올릴 때</li>
        <li>코딩 테스트 → 제한 시간 내에 빠르게 시작</li>
      </ul>

      <p className="mb-4">
        VS Code에서 <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">!</code> + Tab으로 Emmet 자동완성 쓰면 되는데,
        거기서 빠진 것들(OG 태그, 파비콘, 다크모드 meta)을 자꾸 찾아봐야 해서 불편했다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">좋은 HTML 기본 구조란</h2>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 overflow-x-auto">
        <pre className="text-sm text-gray-700 dark:text-gray-300">
{`<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="">
  <meta property="og:title" content="">
  <meta property="og:description" content="">
  <meta property="og:image" content="">
  <title>페이지 제목</title>
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <!-- CSS -->
</head>
<body>
  <!-- 내용 -->
  <!-- Scripts -->
</body>
</html>`}
        </pre>
      </div>

      <p className="mb-3">포함되어야 할 것들:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">lang</code> 속성 → 스크린 리더, 검색엔진용</li>
        <li><code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">charset=UTF-8</code> → 한글 깨짐 방지</li>
        <li><code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">viewport</code> → 모바일 대응</li>
        <li><code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">description</code> → SEO</li>
        <li>OG 태그 → SNS 공유 미리보기</li>
        <li>파비콘 → 브라우저 탭 아이콘</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Emmet ! 단축키 → 기본 구조만 나옴, OG 태그 없음</li>
        <li>이전 프로젝트에서 복붙 → 이전 프로젝트 정보가 섞여 들어옴</li>
        <li>온라인 검색 → "html boilerplate 2024" 검색하면 오래된 글 많음</li>
        <li>기억에 의존 → 뭔가 빠트린 것 같은 불안감</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">옵션별로 원하는 것만 골라서 생성:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>언어 선택 (한국어/영어 → lang 속성)</li>
        <li>타이틀 입력</li>
        <li>SEO 메타태그 포함 여부</li>
        <li>OG 태그 포함 여부</li>
        <li>파비콘 포함 여부</li>
        <li>CSS 초기화 (reset, normalize) 포함 여부</li>
        <li>Tailwind CSS CDN 포함 여부</li>
        <li>Bootstrap CDN 포함 여부</li>
        <li>다크모드 prefers-color-scheme 포함 여부</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Tailwind 포함 버전 예시</h2>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 overflow-x-auto">
        <pre className="text-sm text-gray-700 dark:text-gray-300">
{`<!DOCTYPE html>
<html lang="ko" class="h-full">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>내 페이지</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="h-full bg-white dark:bg-gray-900">
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
      Hello World
    </h1>
  </div>
</body>
</html>`}
        </pre>
      </div>

      <p className="mb-4">
        프로토타이핑할 때 Tailwind CDN 버전 쓰면 빠르다.
        물론 배포용에는 빌드 도구 설정해야 하지만 로컬 테스트엔 이게 더 빠름.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>체크박스로 필요한 것만 골라서 생성</li>
        <li>복사 버튼 하나로 끝</li>
        <li>OG 태그, 다크모드 등 자주 빠트리는 것들 포함</li>
        <li>최신 HTML 관행 반영</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>React/Vue 같은 SPA 보일러플레이트는 각 CLI 도구 쓰는 게 나음</li>
        <li>복잡한 프로젝트 구조 생성은 안 됨</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>타이틀, 언어 입력</li>
        <li>포함할 기능 체크박스 선택</li>
        <li>생성 버튼 클릭</li>
        <li>복사해서 새 HTML 파일에 붙여넣기</li>
      </ol>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/html-boilerplate" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 HTML 보일러플레이트 생성기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">
        새 HTML 파일 시작할 때 기본 구조 빠르게 뽑아서 쓰면 편함.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #HTML보일러플레이트 #HTML템플릿 #웹개발 #프론트엔드 #HTML기본구조
      </p>
    </article>
  );
}
