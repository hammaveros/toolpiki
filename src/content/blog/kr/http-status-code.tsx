import Link from 'next/link';

export default function HttpStatusCodePost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">레퍼런스 · 2026년 7월 9일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        HTTP 상태코드 매번 검색하기 귀찮아서 만든 레퍼런스
      </h1>

      <p className="mb-4">
        <Link href="/tools/http-status-code" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 HTTP 상태코드 레퍼런스 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        422가 Unprocessable Entity인지 415가 Unsupported Media Type인지 매번 헷갈린다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">HTTP 상태코드 레퍼런스가 필요한 상황</h2>

      <p className="mb-3">개발하면서 자주:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>API 설계 → 어떤 상황에 어떤 코드를 반환할지</li>
        <li>에러 디버깅 → 받은 코드가 무슨 의미인지</li>
        <li>Postman 테스트 → 응답 코드 의미 확인</li>
        <li>코드 리뷰 → 적절한 상태코드를 반환하고 있는지</li>
        <li>API 문서 작성 → 응답 코드 목록 작성</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">상태코드 분류</h2>

      <p className="mb-3">5가지 그룹으로 나뉜다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>1xx (정보)</strong> → 요청 처리 중 (잘 안 씀)</li>
        <li><strong>2xx (성공)</strong> → 요청 성공</li>
        <li><strong>3xx (리다이렉션)</strong> → 다른 곳으로 이동</li>
        <li><strong>4xx (클라이언트 에러)</strong> → 요청이 잘못됨</li>
        <li><strong>5xx (서버 에러)</strong> → 서버 문제</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">자주 쓰는 2xx 코드</h2>

      <ul className="space-y-2 mb-4 text-gray-700 dark:text-gray-300">
        <li>
          <strong>200 OK</strong> → 성공. GET 요청 응답, 수정된 리소스 반환 시
        </li>
        <li>
          <strong>201 Created</strong> → 리소스 생성 성공. POST로 새 데이터 만들었을 때
        </li>
        <li>
          <strong>204 No Content</strong> → 성공하지만 응답 본문 없음. DELETE 후, 업데이트 후 본문 필요 없을 때
        </li>
        <li>
          <strong>206 Partial Content</strong> → 부분 응답. 파일 다운로드 재개, 페이지네이션
        </li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">자주 쓰는 3xx 코드</h2>

      <ul className="space-y-2 mb-4 text-gray-700 dark:text-gray-300">
        <li>
          <strong>301 Moved Permanently</strong> → 영구 이동. URL 변경 시 SEO 유지용
        </li>
        <li>
          <strong>302 Found</strong> → 임시 이동. 로그인 후 리다이렉트
        </li>
        <li>
          <strong>304 Not Modified</strong> → 캐시 사용. If-Modified-Since 헤더 활용
        </li>
        <li>
          <strong>307/308</strong> → 301/302와 비슷하지만 메서드 변경 없음
        </li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">자주 쓰는 4xx 코드</h2>

      <ul className="space-y-2 mb-4 text-gray-700 dark:text-gray-300">
        <li>
          <strong>400 Bad Request</strong> → 잘못된 요청 (파라미터 오류, 유효성 검사 실패)
        </li>
        <li>
          <strong>401 Unauthorized</strong> → 인증 필요 (토큰 없음, 만료)
        </li>
        <li>
          <strong>403 Forbidden</strong> → 권한 없음 (인증은 됐지만 권한 부족)
        </li>
        <li>
          <strong>404 Not Found</strong> → 리소스 없음
        </li>
        <li>
          <strong>405 Method Not Allowed</strong> → 허용되지 않은 HTTP 메서드
        </li>
        <li>
          <strong>409 Conflict</strong> → 충돌 (이미 존재하는 데이터, 동시성 충돌)
        </li>
        <li>
          <strong>410 Gone</strong> → 영구 삭제됨 (404와 달리 의도적 삭제)
        </li>
        <li>
          <strong>422 Unprocessable Entity</strong> → 문법은 맞지만 의미적 오류 (유효성 검사 실패)
        </li>
        <li>
          <strong>429 Too Many Requests</strong> → Rate limit 초과
        </li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">자주 쓰는 5xx 코드</h2>

      <ul className="space-y-2 mb-4 text-gray-700 dark:text-gray-300">
        <li>
          <strong>500 Internal Server Error</strong> → 서버 내부 오류 (예외 처리 안 됨)
        </li>
        <li>
          <strong>502 Bad Gateway</strong> → 게이트웨이/프록시 서버가 잘못된 응답 받음
        </li>
        <li>
          <strong>503 Service Unavailable</strong> → 서비스 일시 불가 (배포 중, 과부하)
        </li>
        <li>
          <strong>504 Gateway Timeout</strong> → 업스트림 서버 응답 시간 초과
        </li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">헷갈리는 것들</h2>

      <p className="mb-3"><strong>401 vs 403:</strong></p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>401 → "누구세요?" (인증 안 됨)</li>
        <li>403 → "알지만 안 돼요" (인증 됐지만 권한 없음)</li>
      </ul>

      <p className="mb-3"><strong>400 vs 422:</strong></p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>400 → 요청 자체가 잘못됨 (JSON 파싱 오류, 필수 파라미터 없음)</li>
        <li>422 → 요청 형식은 맞지만 내용이 처리 불가 (이메일 형식 오류, 숫자 범위 초과)</li>
      </ul>

      <p className="mb-3"><strong>302 vs 307:</strong></p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>302 → 임시 이동, POST 요청이 GET으로 바뀔 수 있음</li>
        <li>307 → 임시 이동, 원래 메서드 유지 (POST는 POST로 리다이렉트)</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">주요 기능:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>전체 HTTP 상태코드 목록 (1xx~5xx)</li>
        <li>코드 번호로 빠른 검색</li>
        <li>키워드로 검색 (예: "unauthorized", "not found")</li>
        <li>각 코드별 상세 설명 및 사용 예시</li>
        <li>언제 써야 하는지 가이드</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>상태코드 번호 또는 키워드 검색</li>
        <li>상세 설명과 사용 예시 확인</li>
        <li>API 설계에 적용</li>
      </ol>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/http-status-code" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 HTTP 상태코드 레퍼런스 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">
        API 개발할 때 옆에 띄워두면 편하다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #HTTP상태코드 #HTTP #API개발 #RESTful #백엔드개발
      </p>
    </article>
  );
}
