import Link from 'next/link';

export default function UnixTimestamp2038Post() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">가이드 · 2026년 8월 23일 · 읽는 시간 8분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        유닉스 타임스탬프 — 10자리와 13자리를 헷갈리면 1970년으로 간다
      </h1>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        가입일이 전부 1970년 1월 1일로 표시되는 버그, 만료 시각이 5만 년 뒤로 잡히는 버그. 서로 완전히
        달라 보이는 이 두 사고의 원인은 하나다 — <strong>초와 밀리초를 헷갈렸다.</strong> 유닉스
        타임스탬프는 시스템 간 시간 교환의 사실상 표준이지만, 단위·시간대·범위라는 세 가지 함정이 있다.
        하나씩 정리한다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">타임스탬프란 — 1970년부터 센 숫자 하나</h2>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        유닉스 타임스탬프는 <strong>1970년 1월 1일 00:00:00 UTC</strong>(에포크)부터 흐른 시간을 하나의
        숫자로 적은 것이다. 날짜 포맷(2026-08-23? 08/23/2026?)이나 시간대 표기 없이 숫자 하나로 시점이
        확정되므로, 시스템끼리 시간을 주고받는 데 이보다 깔끔한 방법이 없다. 문제는 그 숫자의
        <strong> 단위가 통일되어 있지 않다</strong>는 것.
      </p>

      <div className="overflow-x-auto mb-4">
        <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <th className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">자릿수 (2026년 기준)</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">단위</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">주 사용처</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 dark:text-gray-300">
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="px-3 py-2 font-medium">10자리 (17억대)</td>
              <td className="px-3 py-2">초 (s)</td>
              <td className="px-3 py-2">유닉스 계열 OS, DB, JWT의 exp/iat, 대부분의 API</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="px-3 py-2 font-medium">13자리</td>
              <td className="px-3 py-2">밀리초 (ms)</td>
              <td className="px-3 py-2">JavaScript Date.now(), Java System.currentTimeMillis()</td>
            </tr>
            <tr>
              <td className="px-3 py-2 font-medium">16자리 / 19자리</td>
              <td className="px-3 py-2">마이크로초 / 나노초</td>
              <td className="px-3 py-2">일부 DB(PostgreSQL 내부), 로그 시스템, Go</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사고 유형 1 — 1970년 버그와 5만 년 버그</h2>

      <ul className="space-y-2 mb-4 text-gray-700 dark:text-gray-300">
        <li>
          <strong>밀리초 자리에 초를 넣으면</strong> — JS의 <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">new Date(1755900000)</code>은
          1970년 1월 21일이 된다. 서버가 초 단위로 준 값을 밀리초로 해석한 것. 가입일이 전부 1970년으로
          보이는 버그의 정체다. 올바르게는 <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">new Date(1755900000 * 1000)</code>.
        </li>
        <li>
          <strong>초 자리에 밀리초를 넣으면</strong> — 반대로 13자리 값을 초로 해석하면 5만 년 뒤의
          날짜가 나온다. 만료 시각이 &ldquo;영원히&rdquo;로 잡히는 캐시/토큰 버그가 이렇게 만들어진다.
        </li>
      </ul>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        방어법은 단순하다. <strong>경계에서 자릿수를 검증</strong>하는 것. 지금 시대의 초 단위 값은
        10자리, 밀리초는 13자리다. 받은 값이 12자리 이하인데 밀리초로 쓰고 있다면 (또는 그 반대라면)
        즉시 의심하자.
      </p>

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사고 유형 2 — &ldquo;타임스탬프에 시간대를 적용했어요&rdquo;</h2>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        타임스탬프는 <strong>이미 UTC 기준</strong>이다. 같은 순간이라면 서울에서 찍든 뉴욕에서 찍든
        같은 숫자가 나온다. 시간대는 이 숫자를 <strong>사람에게 보여줄 때만</strong> 개입한다.
        흔한 실수는 &ldquo;한국 시간으로 맞춘다&rdquo;며 타임스탬프에 9시간(32,400초)을 더해 저장하는
        것 — 이러면 그 값은 더 이상 표준 타임스탬프가 아니게 되고, 이 값을 받은 다른 시스템이 다시
        시간대 변환을 하는 순간 9시간이 두 번 적용된다. 원칙은 하나다:
        <strong> 저장·전송은 항상 UTC 타임스탬프 그대로, 변환은 표시 계층에서 딱 한 번.</strong>
      </p>

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2038년 문제 — 32비트의 시한폭탄</h2>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        타임스탬프를 부호 있는 32비트 정수로 저장하면 최댓값이 2,147,483,647 —
        <strong> 2038년 1월 19일 03:14:07 UTC</strong>다. 그 다음 초에 값이 음수로 뒤집혀
        1901년으로 돌아간다. 2000년의 Y2K와 같은 종류의 문제고, 실제로 만료일을 20년 뒤로 설정하는
        인증서·장기 예약 시스템에서는 이미 현실 버그로 나타난 바 있다. 최신 OS와 언어 런타임은 대부분
        64비트로 전환을 마쳤지만, 위험이 남은 곳은 따로 있다:
      </p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>오래된 임베디드 장비·IoT 기기 (펌웨어가 32비트 time_t)</li>
        <li>레거시 DB 스키마의 INT 컬럼에 저장된 타임스탬프 (MySQL의 TIMESTAMP 타입도 범위 제약이 있어 확인 필요)</li>
        <li>바이너리 프로토콜·파일 포맷에 32비트로 박아 둔 시간 필드</li>
      </ul>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        새로 설계하는 시스템이라면 답은 간단하다 — 시간 필드는 <strong>64비트(BIGINT)</strong>로.
        2038년은 생각보다 가깝고, 오늘 만든 시스템이 그때까지 살아 있을 확률은 생각보다 높다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">빠른 참조</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>10자리 = 초, 13자리 = 밀리초 — 경계에서 자릿수 검증</li>
        <li>저장·전송은 UTC 그대로, 시간대 변환은 표시할 때 한 번만</li>
        <li>JWT의 exp/iat는 <strong>초 단위</strong> — JS에서 Date.now()와 비교할 때 1000을 잊지 말 것</li>
        <li>새 스키마의 시간 컬럼은 64비트로</li>
      </ul>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        손에 든 타임스탬프가 어떤 시각인지 바로 확인하려면{' '}
        <Link href="/tools/unix-timestamp" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
          유닉스 타임스탬프 변환기
        </Link>
        에 붙여넣으면 된다 — 초/밀리초를 자동 판별해 사람이 읽는 날짜로 보여준다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #유닉스타임스탬프 #에포크 #2038년문제 #밀리초 #UTC #시간대버그
      </p>
    </article>
  );
}
