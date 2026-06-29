import Link from 'next/link';

export default function CodeDiffPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">개발도구 · 2026년 7월 9일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        두 코드 버전 차이 빠르게 보고 싶을 때 쓰는 diff 도구
      </h1>

      <p className="mb-4">
        <Link href="/tools/code-diff" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 코드 Diff 비교 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        파일 두 버전이 어디가 달라졌는지, git 없이 빠르게 확인하고 싶을 때가 있다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">코드 Diff가 필요한 상황</h2>

      <p className="mb-3">이런 경우들:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>설정 파일 두 버전 비교 → dev와 prod 환경 설정 차이</li>
        <li>AI가 수정한 코드 → 원본과 뭐가 바뀌었는지 확인</li>
        <li>API 응답 변화 확인 → 이전 응답과 새 응답 비교</li>
        <li>git 없는 환경 → 버전 관리 없이 두 파일 비교</li>
        <li>텍스트 파일 비교 → CSV, JSON, XML 두 버전</li>
        <li>코드 리뷰 준비 → 변경 사항 미리 파악</li>
      </ul>

      <p className="mb-4">
        Git이 있으면 <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">git diff</code>로 보면 되지만,
        복붙으로 가져온 두 텍스트를 빠르게 비교할 때는 별도 도구가 필요하다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">diff 결과 읽는 법</h2>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 overflow-x-auto">
        <pre className="text-sm text-gray-700 dark:text-gray-300">
{`// 원본 (왼쪽)
function greet(name) {
  const message = "Hello, " + name;
  console.log(message);
  return message;
}

// 수정본 (오른쪽)
function greet(name, lang = "en") {
  const message = lang === "ko"
    ? "안녕하세요, " + name
    : "Hello, " + name;
  console.log(message);
  return message;
}

// diff 결과
- function greet(name) {          // 삭제 (빨간색)
+ function greet(name, lang = "en") {  // 추가 (초록색)
- const message = "Hello, " + name;
+ const message = lang === "ko"
+   ? "안녕하세요, " + name
+   : "Hello, " + name;`}
        </pre>
      </div>

      <p className="mb-3">색상 표기:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>빨간색 (- 기호) → 삭제된 라인</li>
        <li>초록색 (+ 기호) → 추가된 라인</li>
        <li>흰색 → 변경 없는 라인 (문맥 표시)</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>diff 명령어 → 파일로 저장해야 함, 터미널 필요</li>
        <li>VS Code diff → 파일로 저장하고 에디터에서 직접 열어야 함</li>
        <li>온라인 사이트 → 코드 내용 올리기 꺼려짐</li>
        <li>눈으로 비교 → 시간 걸리고 실수 많음</li>
      </ul>

      <p className="mb-4">그냥 두 텍스트 붙여넣고 차이만 보여줬으면.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">주요 기능:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>왼쪽/오른쪽에 각 버전 붙여넣기</li>
        <li>추가/삭제 라인 색상 하이라이트</li>
        <li>라인 번호 표시</li>
        <li>변경된 부분만 보기 / 전체 보기 선택</li>
        <li>인라인 diff / 사이드바이사이드 diff 선택</li>
        <li>변경 라인 수 통계</li>
      </ul>

      <p className="mb-3">추가 기능:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>공백 무시 옵션 (들여쓰기 차이 무시)</li>
        <li>대소문자 무시 옵션</li>
        <li>언어별 문법 하이라이팅</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">JSON 비교 예시</h2>

      <p className="mb-3">설정 파일 변경 확인에 유용하다:</p>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 overflow-x-auto">
        <pre className="text-sm text-gray-700 dark:text-gray-300">
{`// 이전 설정
{
  "server": {
    "port": 3000,
    "host": "localhost"
  },
  "database": {
    "host": "localhost",
    "port": 5432
  }
}

// 새 설정 (port 변경, timeout 추가)
{
  "server": {
    "port": 8080,
    "host": "0.0.0.0"
  },
  "database": {
    "host": "db.example.com",
    "port": 5432,
    "timeout": 5000
  }
}`}
        </pre>
      </div>

      <p className="mb-4">
        이런 변경사항을 눈으로 찾으면 시간도 걸리고 빠트리기 쉽다.
        diff 도구로 보면 초 단위로 파악된다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>사이드바이사이드 뷰 → 한눈에 비교</li>
        <li>공백 무시 → 들여쓰기만 바뀐 경우 실제 변경 사항만</li>
        <li>변경 라인 수 통계 → 얼마나 많이 바뀌었는지 파악</li>
        <li>브라우저에서만 처리 → 코드 유출 없음</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>파일 업로드는 안 되고 텍스트 붙여넣기만</li>
        <li>3-way merge는 안 됨</li>
        <li>바이너리 파일 비교 불가</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>왼쪽 영역에 원본 코드 붙여넣기</li>
        <li>오른쪽 영역에 수정본 붙여넣기</li>
        <li>diff 결과 확인</li>
        <li>공백 무시 등 옵션 조정</li>
      </ol>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/code-diff" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 코드 Diff 비교 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">
        두 버전 빠르게 비교해야 할 때 편하다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #코드비교 #Diff도구 #텍스트비교 #코드리뷰 #개발도구
      </p>
    </article>
  );
}
