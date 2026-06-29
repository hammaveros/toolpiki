import Link from 'next/link';

export default function UnixTimestampPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">계산기 · 2026년 6월 21일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        API 응답에서 1719849600 같은 숫자 나왔을 때 바로 해석하는 법
      </h1>

      <p className="mb-4">
        <Link href="/tools/unix-timestamp" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 유닉스 타임스탬프 변환기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        API 로그 보다가 "created_at": 1719849600 나왔는데 언제인지 바로 안 나옴.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">유닉스 타임스탬프가 뭔지</h2>

      <p className="mb-3">간단히 말하면 1970년 1월 1일 00:00:00 UTC 기준으로 지금까지 흐른 초(또는 밀리초)를 숫자로 표현한 것.</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>초 단위 타임스탬프 → 10자리 숫자 (예: 1719849600)</li>
        <li>밀리초 단위 타임스탬프 → 13자리 숫자 (예: 1719849600000)</li>
        <li>컴퓨터 내부적으로 날짜 저장할 때 제일 많이 쓰는 형식</li>
        <li>언어, 시간대 상관없이 동일한 기준점 → 글로벌 서비스에서 표준처럼 씀</li>
      </ul>

      <p className="mb-4">사람이 읽기에는 완전 불친절한 형식인데, 컴퓨터 입장에서는 계산하기 제일 편한 형식이라 어디서나 나온다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 마주치는지</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>API 응답 디버깅 → created_at, updated_at, expires_at 필드</li>
        <li>DB 저장값 확인 → MySQL, PostgreSQL 일부 컬럼이 timestamp로 저장</li>
        <li>JWT 토큰 디코딩 → exp, iat, nbf 필드가 타임스탬프</li>
        <li>로그 파일 분석 → 이벤트 발생 시간 확인</li>
        <li>GitHub API, Stripe API → 날짜 관련 필드 대부분 타임스탬프</li>
        <li>Redis TTL 계산 → 만료 시간 역산할 때</li>
        <li>쿠키 expires 값 확인 → 언제 만료되는지 알아야 할 때</li>
      </ul>

      <p className="mb-4">개발하다 보면 하루에 몇 번씩 마주치는 형식이다. 특히 외부 API 쓸 때 거의 무조건 나옴.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>코드로 직접 변환 → <code>new Date(1719849600 * 1000)</code> 브라우저 콘솔에 치기, 매번 켜야 함</li>
        <li>검색엔진 검색 → "unix timestamp 1719849600" 치면 결과 바로 안 나옴</li>
        <li>에포크 변환 사이트 → 광고 많거나, 시간대 설정이 불편함</li>
        <li>DB 쿼리로 확인 → <code>FROM_UNIXTIME()</code> 함수 치기, DB 접속 자체가 번거로움</li>
        <li>스마트폰 계산기 → 초 단위 계산은 가능한데 결과를 날짜로 못 보여줌</li>
      </ul>

      <p className="mb-4">브라우저 콘솔에 <code>new Date(timestamp * 1000)</code> 치는 게 제일 빠른 방법인데 매번 그걸 하고 있자니 귀찮아졌다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 직접 만들었음</h2>

      <p className="mb-3">숫자 넣으면 날짜로, 날짜 넣으면 숫자로 즉시 변환.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">주요 기능:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>타임스탬프 → 날짜 변환 → 초 단위(10자리), 밀리초 단위(13자리) 자동 감지</li>
        <li>날짜 → 타임스탬프 변환 → 날짜 선택하면 초/밀리초 둘 다 출력</li>
        <li>현재 시각 타임스탬프 → 지금 이 순간의 타임스탬프 실시간 표시</li>
        <li>시간대 선택 → UTC, KST(한국), 로컬 시간 선택 가능</li>
        <li>다양한 출력 형식 → ISO 8601, 한국 형식, Unix 날짜 등</li>
        <li>복사 버튼 → 변환 결과 클립보드 복사</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">자동 감지:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>10자리 → 초 단위로 처리</li>
        <li>13자리 → 밀리초 단위로 처리</li>
        <li>직접 초/밀리초 선택도 가능</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>10자리/13자리 자동 감지 → 초인지 밀리초인지 헷갈릴 때 그냥 넣어도 됨</li>
        <li>현재 타임스탬프 바로 보임 → "지금이 몇이야?" 확인할 때 편함</li>
        <li>KST 변환 → 한국 기준으로 확인할 때 UTC +9 계산 안 해도 됨</li>
        <li>ISO 형식 출력 → 그대로 코드에 복붙 가능</li>
        <li>양방향 변환 → 날짜 넣어서 타임스탬프 얻는 것도 자주 씀</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>1970년 이전 날짜 변환 안 됨 → 음수 타임스탬프 처리 미지원</li>
        <li>나노초 단위 없음 → 일부 언어(Go, Java Instant)의 나노초 정밀도는 미지원</li>
        <li>변환 기록 없음 → 이전에 뭘 변환했는지 남지 않음</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">알아두면 유용한 타임스탬프 기준값</h2>

      <p className="mb-3">이 정도는 외워두면 바로 검산 가능:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>0 → 1970-01-01 00:00:00 UTC (에포크 기준점)</li>
        <li>1000000000 → 2001-09-09 01:46:40 UTC (10억 기념)</li>
        <li>1700000000 → 2023-11-15 (대략)</li>
        <li>2000000000 → 2033-05-18 (대략)</li>
        <li>하루 = 86400초</li>
        <li>1주일 = 604800초</li>
        <li>1시간 = 3600초</li>
        <li>1분 = 60초</li>
      </ul>

      <p className="mb-4">10자리 숫자가 17억 정도면 2023~2024년 어딘가라는 감이 생긴다. 그 이상이면 미래, 그 이하면 과거.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">이런 상황에서 특히 편함</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>JWT 토큰 디버깅 → exp 필드 값 넣어서 만료일 확인</li>
        <li>API 응답 로그 분석 → created_at 필드 언제인지 바로 확인</li>
        <li>DB 데이터 확인 → timestamp 컬럼 값 직접 해석</li>
        <li>쿠키 만료 확인 → expires 값 해석</li>
        <li>이벤트 발생 시간 확인 → 로그에서 타임스탬프 찾아서 언제인지 파악</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>타임스탬프 숫자 입력 (또는 날짜 선택)</li>
        <li>결과 자동으로 나옴</li>
        <li>시간대 선택 (UTC / KST / 로컬)</li>
        <li>복사 버튼으로 결과 클립보드 복사</li>
      </ol>

      <p className="mb-4">3초면 끝난다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/unix-timestamp" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 유닉스 타임스탬프 변환기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">API 작업하다가 타임스탬프 나오면 탭 열어서 바로 확인하면 됨. 브라우저 콘솔 안 켜도 된다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #유닉스타임스탬프 #타임스탬프변환 #epoch변환 #개발도구 #API디버깅 #날짜변환
      </p>
    </article>
  );
}
