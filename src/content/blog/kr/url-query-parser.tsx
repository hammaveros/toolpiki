import Link from 'next/link';

export default function UrlQueryParserPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">개발도구 · 2026년 7월 6일 · 읽는 시간 3분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        URL 쿼리스트링 한눈에 보고 싶어서 만든 것
      </h1>

      <p className="mb-4">
        <Link href="/tools/url-query-parser" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 URL 쿼리스트링 파서 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        URL이 길어지면 어떤 파라미터가 들어있는지 한눈에 파악이 안 된다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">URL 쿼리스트링 파싱이 필요한 상황</h2>

      <p className="mb-3">이런 상황들:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>API 디버깅 → 요청 URL의 파라미터 확인</li>
        <li>광고/마케팅 UTM 파라미터 분석 → utm_source, utm_medium 등 확인</li>
        <li>OAuth 콜백 URL → code, state 파라미터 추출</li>
        <li>URL 인코딩된 파라미터 → %EB%A7%88%EC%BC%80 같은 거 디코딩</li>
        <li>QA 테스트 → 링크의 파라미터 값 검증</li>
        <li>구글 애널리틱스 URL → 긴 추적 파라미터 파악</li>
      </ul>

      <p className="mb-4">
        특히 UTM 파라미터가 5~6개 달린 마케팅 링크나, 인코딩된 값들이 섞인 URL은 보기가 진짜 힘들다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">URL 쿼리스트링 구조</h2>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 overflow-x-auto">
        <pre className="text-sm text-gray-700 dark:text-gray-300">
{`https://example.com/search?q=검색어&sort=date&page=2&filter=true
                          ↑ ? 이후가 쿼리스트링

파라미터: q = 검색어
파라미터: sort = date
파라미터: page = 2
파라미터: filter = true`}
        </pre>
      </div>

      <p className="mb-3">URL 인코딩된 경우:</p>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 overflow-x-auto">
        <pre className="text-sm text-gray-700 dark:text-gray-300">
{`?q=%EA%B2%80%EC%83%89%EC%96%B4&category=%EA%B0%9C%EB%B0%9C

→ 디코딩하면
q = 검색어
category = 개발`}
        </pre>
      </div>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>브라우저 개발자 도구 Network 탭 → Headers에서 찾아야 하는데 번거로움</li>
        <li>JavaScript 콘솔 → <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">new URLSearchParams(...)</code> 직접 입력</li>
        <li>온라인 URL 디코더 → 인코딩만 풀어주고 파라미터 분리는 안 해줌</li>
        <li>수동 파싱 → &amp; 기준으로 눈으로 분리해서 읽기</li>
      </ul>

      <p className="mb-4">그냥 URL 붙여넣으면 파라미터별로 테이블로 정리됐으면 했다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">주요 기능:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>URL 전체 붙여넣기 → 파라미터별로 분리해서 테이블로 출력</li>
        <li>URL 인코딩된 값 자동 디코딩</li>
        <li>각 파라미터 키/값 개별 복사 가능</li>
        <li>URL 구성 요소 분리 (프로토콜, 도메인, 경로, 쿼리, 해시)</li>
        <li>파라미터 수정 후 URL 재조합</li>
      </ul>

      <p className="mb-3">추가 기능:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>중복 파라미터 키 감지 (배열 파라미터)</li>
        <li>빈 값 파라미터 표시</li>
        <li>JSON 형태로 파라미터 내보내기</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">UTM 파라미터 예시</h2>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 overflow-x-auto">
        <pre className="text-sm text-gray-700 dark:text-gray-300">
{`https://toolpiki.com/?utm_source=newsletter&utm_medium=email&utm_campaign=summer2026&utm_content=cta_button&utm_term=개발도구

→ 파싱 결과
utm_source   = newsletter
utm_medium   = email
utm_campaign = summer2026
utm_content  = cta_button
utm_term     = 개발도구`}
        </pre>
      </div>

      <p className="mb-4">
        마케팅 팀에서 공유한 링크의 UTM이 제대로 달렸는지 확인할 때도 유용하다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>긴 URL도 파라미터별로 깔끔하게 정리됨</li>
        <li>인코딩된 한국어도 자동으로 디코딩</li>
        <li>URL 전체를 붙여넣어도 되고 쿼리스트링만 넣어도 됨</li>
        <li>파라미터 수정 후 URL 다시 만들기 가능</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>중첩된 객체 파라미터 (qs 라이브러리 스타일) 완전 파싱은 안 될 수 있음</li>
        <li>매트릭스 파라미터 (;key=value) 방식은 지원 안 함</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>URL 전체 또는 쿼리스트링 부분 붙여넣기</li>
        <li>파라미터 목록 확인</li>
        <li>필요한 값 복사</li>
      </ol>

      <p className="mb-4">3초면 됨.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/url-query-parser" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 URL 쿼리스트링 파서 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">
        API 디버깅이나 마케팅 링크 확인할 때 편하다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #URL파싱 #쿼리스트링 #URLDecoder #UTM파라미터 #API디버깅
      </p>
    </article>
  );
}
