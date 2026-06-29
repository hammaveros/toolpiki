import Link from 'next/link';

export default function StringEscapePost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">텍스트 · 2026년 7월 2일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        JSON 문자열 이스케이프, 손으로 하다가 놓치는 경우가 생김
      </h1>

      <p className="mb-4">
        <Link href="/tools/string-escape" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 문자열 이스케이프 도구 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        사용자 입력 텍스트를 JSON 값에 넣어야 하는데, 따옴표와 백슬래시를 직접 이스케이프하다가 파싱 에러가 났다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">이스케이프가 필요한 상황</h2>

      <p className="mb-3">개발하다 보면 꽤 자주 만난다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>사용자 입력을 JSON 문자열로 저장 → 따옴표, 백슬래시 이스케이프 필요</li>
        <li>SQL 쿼리 문자열 → 작은따옴표 이스케이프</li>
        <li>HTML 안에 사용자 텍스트 삽입 → XSS 방지를 위한 엔티티 인코딩</li>
        <li>URL에 한글/특수문자 포함 → 퍼센트 인코딩</li>
        <li>정규식 문자열 → 특수 문자 이스케이프</li>
        <li>셸 명령 인자 → 공백/특수문자 처리</li>
      </ul>

      <p className="mb-4">이스케이프 처리 하나 빠지면 파싱 에러, 보안 취약점, 데이터 손상으로 이어진다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">이스케이프가 헷갈리는 이유</h2>

      <p className="mb-3">형식마다 이스케이프 규칙이 다르다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>JSON</strong> → \n, \t, \", \\, \/ 등</li>
        <li><strong>HTML</strong> → &amp;, &lt;, &gt;, &quot;, &#x27; 등 엔티티</li>
        <li><strong>URL</strong> → %20 (공백), %2F (/), %3A (:) 등 퍼센트 인코딩</li>
        <li><strong>정규식</strong> → ., *, +, ?, ^, $, {"{}"}, [], () 등 앞에 \</li>
        <li><strong>JavaScript 문자열</strong> → \n, \t, \\, \', \" 등</li>
      </ul>

      <p className="mb-4">형식별로 규칙이 달라서 헷갈리고, 하나 놓치면 에러가 난다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">텍스트 붙여넣으면 형식별로 이스케이프/언이스케이프 해준다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>JSON 이스케이프</strong> → JSON 문자열 값으로 사용 가능하게</li>
        <li><strong>HTML 이스케이프</strong> → HTML 엔티티로 변환 (XSS 방지)</li>
        <li><strong>URL 인코딩</strong> → 퍼센트 인코딩 처리</li>
        <li><strong>JavaScript 이스케이프</strong> → JS 문자열로 안전하게</li>
        <li><strong>정규식 이스케이프</strong> → 정규식 특수문자 처리</li>
      </ul>

      <p className="mb-3">반대 방향도 가능:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>이스케이프된 문자열 → 원본 텍스트로 복원 (언이스케이프)</li>
        <li>URL 디코딩 → 퍼센트 인코딩 → 원본 문자로</li>
        <li>HTML 엔티티 → 실제 문자로</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">JSON 이스케이프 대상 문자 정리</h2>

      <p className="mb-3">JSON 문자열에서 이스케이프해야 하는 문자들:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>"</strong> → \" (큰따옴표)</li>
        <li><strong>\</strong> → \\ (백슬래시)</li>
        <li><strong>줄바꿈</strong> → \n (newline)</li>
        <li><strong>탭</strong> → \t (tab)</li>
        <li><strong>캐리지리턴</strong> → \r</li>
        <li><strong>폼피드</strong> → \f</li>
        <li><strong>백스페이스</strong> → \b</li>
        <li><strong>제어문자</strong> → \u00XX 형식</li>
      </ul>

      <p className="mb-4">이 중에서 실수로 가장 많이 놓치는 건 백슬래시와 큰따옴표다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>형식 선택하면 즉시 변환 → 버튼 따로 안 눌러도 됨</li>
        <li>이스케이프/언이스케이프 양방향 지원</li>
        <li>어떤 문자가 변환됐는지 하이라이트 표시</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>복잡한 중첩 이스케이프(JSON 안의 HTML 등)는 한 번에 처리 안 됨</li>
        <li>언어별 특수 이스케이프 방식은 모두 지원하지 않음</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>이스케이프할 텍스트 붙여넣기</li>
        <li>형식 선택 (JSON, HTML, URL 등)</li>
        <li>결과 복사</li>
        <li>끝</li>
      </ol>

      <p className="mb-4">3초면 된다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/string-escape" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 문자열 이스케이프 도구 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">회원가입 없이 바로 쓸 수 있다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #문자열이스케이프 #JSON이스케이프 #HTML이스케이프 #URL인코딩 #개발도구 #텍스트도구
      </p>
    </article>
  );
}
