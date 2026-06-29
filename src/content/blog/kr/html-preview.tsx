import Link from 'next/link';

export default function HtmlPreviewPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">개발도구 · 2026년 7월 8일 · 읽는 시간 3분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        HTML 코드 결과 바로 보고 싶을 때 쓰는 미리보기
      </h1>

      <p className="mb-4">
        <Link href="/tools/html-preview" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 HTML 미리보기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        HTML 스니펫 하나 확인하려고 파일 만들고 브라우저에서 열기가 귀찮다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">HTML 미리보기가 필요한 상황</h2>

      <p className="mb-3">이런 경우들:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>이메일 템플릿 HTML → 결과 확인용</li>
        <li>ChatGPT, Claude 등 AI가 생성한 HTML → 바로 렌더링 확인</li>
        <li>Stack Overflow 답변 HTML → 동작 확인</li>
        <li>HTML 스니펫 테스트 → 파일 만들기 전에 빠르게 확인</li>
        <li>CSS 스타일링 실험 → 인라인 스타일 빠른 테스트</li>
        <li>Markdown → HTML 변환 결과 확인</li>
      </ul>

      <p className="mb-4">
        VSCode Live Preview 확장 쓰면 되는데, 그것도 프로젝트 열고 파일 만들어야 해서
        간단한 스니펫 테스트엔 오버다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>파일 만들어서 브라우저에서 열기 → 파일 관리 귀찮음</li>
        <li>CodePen/JSFiddle → 회원가입, 무겁고, 인터넷 필요</li>
        <li>브라우저 콘솔 → document.write 같은 방식으로 테스트, 불편함</li>
        <li>VS Code Preview → IDE 전체 켜야 함</li>
      </ul>

      <p className="mb-4">그냥 붙여넣으면 바로 옆에 렌더링 결과 보여줬으면.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">주요 기능:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>HTML 붙여넣기 → 오른쪽에 실시간 렌더링</li>
        <li>분할 화면 / 탭 전환 뷰</li>
        <li>iframe 안에서 안전하게 렌더링</li>
        <li>전체화면 미리보기 모드</li>
        <li>모바일/태블릿 크기 미리보기 (반응형 테스트)</li>
      </ul>

      <p className="mb-3">추가 기능:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>HTML + CSS + JS 분리 입력 (CSS/JS 패널 선택)</li>
        <li>실시간 업데이트 vs 버튼 클릭 업데이트 선택</li>
        <li>다운로드 (현재 코드를 .html 파일로 저장)</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">이메일 HTML 테스트 예시</h2>

      <p className="mb-3">이메일 템플릿은 테이블 레이아웃 쓰는 경우가 많다:</p>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 overflow-x-auto">
        <pre className="text-sm text-gray-700 dark:text-gray-300">
{`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; }
    .header { background: #3b82f6; color: white; padding: 20px; }
    .content { padding: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>안녕하세요!</h1>
    </div>
    <div class="content">
      <p>이메일 본문 내용입니다.</p>
    </div>
  </div>
</body>
</html>`}
        </pre>
      </div>

      <p className="mb-4">
        이런 걸 이메일 전송 전에 미리보기로 확인하면 좋다.
        실제 이메일 클라이언트 렌더링과는 차이가 있을 수 있지만, 기본적인 레이아웃 확인용으로 충분하다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>실시간 렌더링 → 타이핑하면서 바로 결과 확인</li>
        <li>iframe 격리 → 렌더링이 현재 페이지에 영향 없음</li>
        <li>반응형 크기 테스트 → 모바일에서 어떻게 보이는지 확인</li>
        <li>파일 저장 버튼 → 완성되면 바로 .html 파일로</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>외부 CDN 리소스 (Bootstrap 등) 로드 안 될 수 있음 (CSP 설정에 따라)</li>
        <li>서버 사이드 렌더링 결과 확인 불가 (클라이언트 HTML만)</li>
        <li>실제 이메일 클라이언트(Gmail, Outlook) 렌더링 차이 존재</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>HTML 코드 붙여넣기</li>
        <li>오른쪽 또는 아래에 렌더링 결과 확인</li>
        <li>수정하면서 실시간 확인</li>
        <li>완성되면 파일로 저장</li>
      </ol>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/html-preview" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 HTML 미리보기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">
        HTML 스니펫 빠르게 테스트해야 할 때 편하다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #HTML미리보기 #HTML테스트 #이메일템플릿 #웹개발 #프론트엔드
      </p>
    </article>
  );
}
