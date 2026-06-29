import Link from 'next/link';

export default function SqlFormatterPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">포맷터 · 2026년 7월 7일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        쿼리 로그 해석하려고 SQL 포맷터 만들었음
      </h1>

      <p className="mb-4">
        <Link href="/tools/sql-formatter" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 SQL 포맷터 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        ORM이 생성한 쿼리 로그는 한 줄로 뭉쳐 있어서 어디서 문제가 생겼는지 파악하기 힘들다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">SQL 포맷팅이 필요한 상황</h2>

      <p className="mb-3">꽤 자주 마주침:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>ORM 쿼리 로그 디버깅 → JPA/Hibernate, Django ORM 생성 쿼리</li>
        <li>DB 마이그레이션 파일 → 한 줄로 된 긴 쿼리 정리</li>
        <li>레거시 쿼리 파악 → 유지보수 시 기존 쿼리 읽기</li>
        <li>코드 리뷰 → SQL이 인라인으로 박혀 있어서 읽기 힘들 때</li>
        <li>느린 쿼리 분석 → slow query log에서 가져온 쿼리 정리</li>
        <li>DBA와 협업 → 정리된 형태로 공유</li>
      </ul>

      <p className="mb-4">
        Hibernate show_sql=true로 켜놓으면 나오는 쿼리들 진짜 읽기 힘들다.
        들여쓰기도 없고 키워드도 대소문자 섞여있고.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">포맷팅 전후 비교</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">포맷팅 전:</p>
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 overflow-x-auto">
        <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
{`select u.id, u.name, u.email, o.order_date, o.total_amount, p.product_name from users u inner join orders o on u.id = o.user_id inner join order_items oi on o.id = oi.order_id inner join products p on oi.product_id = p.id where u.created_at >= '2026-01-01' and o.status = 'completed' order by o.order_date desc limit 100`}
        </pre>
      </div>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">포맷팅 후:</p>
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 overflow-x-auto">
        <pre className="text-sm text-gray-700 dark:text-gray-300">
{`SELECT
  u.id,
  u.name,
  u.email,
  o.order_date,
  o.total_amount,
  p.product_name
FROM
  users u
  INNER JOIN orders o ON u.id = o.user_id
  INNER JOIN order_items oi ON o.id = oi.order_id
  INNER JOIN products p ON oi.product_id = p.id
WHERE
  u.created_at >= '2026-01-01'
  AND o.status = 'completed'
ORDER BY
  o.order_date DESC
LIMIT 100`}
        </pre>
      </div>

      <p className="mb-4">조인이 3개인지 4개인지, WHERE 조건이 뭔지 한눈에 들어온다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>DataGrip / DBeaver → 쿼리 툴 켜서 붙여넣고 포맷팅, 매번 귀찮음</li>
        <li>온라인 SQL 포맷터 → 광고 넘치고 데이터가 서버로 가는 느낌</li>
        <li>VS Code SQL 확장 → 설치 필요, 가볍게 쓰기엔 무거움</li>
        <li>수동 정리 → 시간도 걸리고 실수도 생김</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">주요 기능:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>SQL 자동 들여쓰기 포맷팅</li>
        <li>키워드 대문자 자동 변환 (SELECT, FROM, WHERE 등)</li>
        <li>SQL 방언 선택 (MySQL, PostgreSQL, SQLite, Oracle, T-SQL)</li>
        <li>SQL 압축 (공백 제거)</li>
        <li>결과 복사 버튼</li>
      </ul>

      <p className="mb-3">추가 기능:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>서브쿼리 들여쓰기 처리</li>
        <li>CTE (WITH 절) 포맷팅</li>
        <li>주석 유지</li>
        <li>여러 쿼리 구분 처리 (세미콜론 기준)</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">자주 쓰는 SQL 패턴들</h2>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 overflow-x-auto">
        <pre className="text-sm text-gray-700 dark:text-gray-300">
{`-- CTE 사용 예시
WITH monthly_sales AS (
  SELECT
    DATE_FORMAT(order_date, '%Y-%m') AS month,
    SUM(total_amount) AS revenue
  FROM orders
  WHERE status = 'completed'
  GROUP BY month
)
SELECT
  month,
  revenue,
  LAG(revenue) OVER (ORDER BY month) AS prev_revenue
FROM monthly_sales;`}
        </pre>
      </div>

      <p className="mb-4">
        CTE나 윈도우 함수 쓴 복잡한 쿼리도 포맷팅하면 구조 파악이 훨씬 쉽다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>ORM 로그 복붙하면 바로 읽기 좋게 정리됨</li>
        <li>키워드 대문자 변환 → 컨벤션 맞추기 편함</li>
        <li>MySQL, PostgreSQL 방언 구분 → DB에 맞는 포맷</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>실행 계획 분석은 안 됨</li>
        <li>쿼리 성능 최적화 제안은 없음</li>
        <li>매우 복잡한 쿼리는 포맷팅이 완벽하지 않을 수 있음</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>SQL 쿼리 붙여넣기</li>
        <li>DB 방언 선택 (필요시)</li>
        <li>자동으로 포맷팅됨</li>
        <li>복사 버튼으로 가져가기</li>
      </ol>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/sql-formatter" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 SQL 포맷터 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">
        ORM 로그 디버깅할 때 옆에 띄워두면 편함.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #SQL포맷터 #쿼리정리 #ORM디버깅 #데이터베이스 #개발도구
      </p>
    </article>
  );
}
