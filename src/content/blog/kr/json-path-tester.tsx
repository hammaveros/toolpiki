import Link from 'next/link';

export default function JsonPathTesterPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">개발도구 · 2026년 7월 7일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        JSONPath 표현식 직접 써가며 확인하려고 만든 것
      </h1>

      <p className="mb-4">
        <Link href="/tools/json-path-tester" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 JSONPath 테스터 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        중첩된 JSON에서 원하는 값만 뽑아오는 표현식이 맞는지 실행해보기 전까지 확신이 없다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">JSONPath가 필요한 상황</h2>

      <p className="mb-3">이런 때 쓴다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>복잡한 API 응답에서 원하는 필드만 추출</li>
        <li>Elasticsearch 쿼리 작성 시 JSON 경로 확인</li>
        <li>Postman / Insomnia 테스트 스크립트 → 응답 값 검증</li>
        <li>Gatling, k6 등 부하 테스트 → 응답 필드 추출</li>
        <li>Grafana / 모니터링 도구 → JSON 데이터 소스 필드 설정</li>
        <li>데이터 변환 파이프라인 → 특정 필드만 골라내기</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">JSONPath 기본 문법</h2>

      <p className="mb-3">XPath와 비슷한 개념이다:</p>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 overflow-x-auto">
        <pre className="text-sm text-gray-700 dark:text-gray-300">
{`// 예시 JSON
{
  "store": {
    "books": [
      {"title": "클린코드", "price": 25000, "author": "로버트 마틴"},
      {"title": "리팩터링", "price": 32000, "author": "마틴 파울러"},
      {"title": "DDD", "price": 40000, "author": "에릭 에반스"}
    ],
    "name": "개발서점"
  }
}

// JSONPath 예시
$.store.name                    → "개발서점"
$.store.books[0].title         → "클린코드"
$.store.books[*].title         → ["클린코드", "리팩터링", "DDD"]
$.store.books[?(@.price<30000)].title  → ["클린코드"]
$..price                       → [25000, 32000, 40000]`}
        </pre>
      </div>

      <p className="mb-3">자주 쓰는 문법 요약:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">$</code> → 루트</li>
        <li><code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">.key</code> → 자식 키 접근</li>
        <li><code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">[*]</code> → 배열 전체</li>
        <li><code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">[0]</code> → 인덱스</li>
        <li><code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">[0,2]</code> → 복수 인덱스</li>
        <li><code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">[?(@.price &gt; 10000)]</code> → 필터 표현식</li>
        <li><code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">..</code> → 재귀 탐색</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Node.js → jsonpath 패키지 설치 후 코드 짜서 실행</li>
        <li>Python → jsonpath-ng 라이브러리, 환경 필요</li>
        <li>Postman → API 호출 후 Test 탭에서 확인, JSON 따로 못 넣음</li>
        <li>머릿속으로 계산 → 중첩 3단계 넘어가면 헷갈림</li>
      </ul>

      <p className="mb-4">
        표현식 한 번 써보고 맞는지 확인하는 데 이렇게 많은 단계가 필요하면 안 된다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">주요 기능:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>JSON 데이터 + JSONPath 표현식 입력 → 결과 즉시 출력</li>
        <li>매칭된 값 하이라이트</li>
        <li>배열 결과일 때 개수 표시</li>
        <li>문법 오류 감지 및 안내</li>
        <li>예제 JSONPath 모음 클릭해서 바로 테스트</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">필터 표현식 활용 예시</h2>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 overflow-x-auto">
        <pre className="text-sm text-gray-700 dark:text-gray-300">
{`// 특정 조건으로 필터링
$.users[?(@.age >= 18)]           // 성인만
$.products[?(@.stock > 0)]        // 재고 있는 것만
$.orders[?(@.status == "완료")]    // 완료된 주문만

// 여러 조건 (구현에 따라 다름)
$.items[?(@.price < 10000 && @.category == "도서")]`}
        </pre>
      </div>

      <p className="mb-4">
        필터 표현식이 생각보다 강력하다. API 응답에서 조건 맞는 항목만 뽑을 때 유용하다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>JSON 붙여넣고 바로 표현식 테스트 → 즉각적인 피드백</li>
        <li>결과에 매칭 개수 표시 → 얼마나 뽑히는지 바로 확인</li>
        <li>잘못된 경로 입력 시 바로 에러 표시</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>JSONPath 구현체마다 문법이 조금씩 달라서 다른 환경에서 안 될 수 있음</li>
        <li>스크립트 표현식 (eval()) 등 복잡한 구문은 지원 제한</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>JSON 데이터 붙여넣기</li>
        <li>JSONPath 표현식 입력 (예: <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">$.users[*].name</code>)</li>
        <li>결과 확인</li>
        <li>맞을 때까지 표현식 수정</li>
      </ol>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/json-path-tester" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 JSONPath 테스터 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">
        API 응답 구조 파악하거나 데이터 추출 표현식 짤 때 써보면 편함.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #JSONPath #JSON파싱 #데이터추출 #API응답 #개발도구
      </p>
    </article>
  );
}
