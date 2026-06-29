import Link from 'next/link';

export default function FaviconGeneratorPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">이미지 · 2026년 7월 11일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        파비콘 만들기, PNG 하나 있으면 30초 안에 끝난다
      </h1>

      <p className="mb-4">
        <Link href="/tools/favicon-generator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 파비콘 생성기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        사이드 프로젝트 배포했는데 브라우저 탭에 기본 아이콘이 그대로다. 파비콘 만들어야 하는데 어떻게 하지.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">파비콘이 왜 필요한가</h2>

      <p className="mb-3">파비콘(favicon)은 브라우저 탭 좌측에 표시되는 작은 아이콘이다. 별거 아닌 것 같은데 없으면 티가 난다.</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>브라우저 탭에서 사이트 구분 → 탭 여러 개 열었을 때 아이콘으로 식별</li>
        <li>북마크 아이콘 → 즐겨찾기에 저장하면 파비콘이 표시됨</li>
        <li>모바일 홈 화면 바로가기 → PWA 아닌 사이트도 아이콘 필요</li>
        <li>검색 결과 → 일부 검색엔진에서 URL 옆에 파비콘 표시</li>
        <li>사이트 신뢰도 → 기본 아이콘이면 미완성처럼 보임</li>
      </ul>

      <p className="mb-4">처음 웹사이트 만들 때 파비콘은 항상 나중으로 미루는데, 막상 만들려고 하면 ICO 파일 변환이 애매하다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">파비콘 만들기가 귀찮은 이유</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>ICO 파일 형식 → 일반 이미지 편집 툴에서 저장 안 됨</li>
        <li>멀티사이즈 필요 → 16×16, 32×32, 48×48, 192×192 등 여러 사이즈</li>
        <li>Apple Touch Icon → iOS 홈 화면용 별도 PNG (180×180)</li>
        <li>Android Chrome 아이콘 → 192×192, 512×512</li>
        <li>포토샵 ICO 플러그인 → 설치 필요, 복잡함</li>
      </ul>

      <p className="mb-4">그냥 PNG 하나 있는데 이걸 여러 사이즈로 만들어주는 게 있으면 좋겠다고 생각했다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">PNG 하나로 파비콘 패키지 생성</h2>

      <p className="mb-3">이미지 올리면 필요한 사이즈 전부 자동으로 만들어준다.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">생성되는 파일:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>favicon.ico → 16×16, 32×32, 48×48 포함된 멀티사이즈 ICO</li>
        <li>favicon-16x16.png</li>
        <li>favicon-32x32.png</li>
        <li>apple-touch-icon.png → 180×180 (iOS 홈 화면)</li>
        <li>android-chrome-192x192.png</li>
        <li>android-chrome-512x512.png</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">추가 기능:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>배경색 선택 → 투명 배경 또는 원하는 배경색</li>
        <li>둥근 모서리 → iOS 아이콘 스타일</li>
        <li>미리보기 → 브라우저 탭, 북마크, 모바일 아이콘 형태로 미리 보기</li>
        <li>ZIP 압축 다운로드 → 한 번에 전부 받기</li>
      </ul>

      <p className="mb-3">HTML에 추가할 태그도 자동 생성해줘서 붙여넣기만 하면 된다.</p>

      <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs overflow-x-auto mb-4">
        {`<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">`}
      </pre>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>한 번에 모든 사이즈 생성 → 각각 만들 필요 없음</li>
        <li>HTML 코드 자동 생성 → 복붙만 하면 됨</li>
        <li>ZIP 다운로드 → public 폴더에 그냥 압축 풀면 끝</li>
        <li>파일이 서버로 안 감</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>SVG 파비콘 생성은 안 됨 → PNG/ICO 기반</li>
        <li>아이콘 디자인 자체는 직접 해야 함 → 도형 편집 기능 없음</li>
        <li>원본 이미지 해상도가 낮으면 결과물도 흐릿함</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>PNG 이미지 업로드 (512×512 이상 권장)</li>
        <li>배경색/모서리 설정</li>
        <li>미리보기 확인</li>
        <li>ZIP 다운로드</li>
        <li>HTML 코드 복사해서 head 태그 안에 붙여넣기</li>
      </ol>

      <p className="mb-4">30초면 된다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/favicon-generator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 파비콘 생성기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">PNG 하나면 파비콘 패키지 완성.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #파비콘생성 #파비콘만들기 #웹개발 #프론트엔드 #ICO파일 #사이드프로젝트
      </p>
    </article>
  );
}
