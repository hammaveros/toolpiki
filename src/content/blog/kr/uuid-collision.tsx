import Link from 'next/link';

export default function UuidCollisionPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">가이드 · 2026년 8월 23일 · 읽는 시간 8분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        UUID는 정말 안 겹칠까 — 충돌 확률, 그리고 v4 대신 v7을 쓰는 이유
      </h1>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        &ldquo;서로 조율하지 않은 두 서버가 동시에 ID를 만들어도 절대 겹치지 않는다&rdquo; — UUID의
        약속이다. 그런데 정말일까? 수학적으로 겹칠 수는 있다. 다만 그 확률이 어느 정도인지 감을 잡고 나면
        걱정할 대상이 아니라는 걸 알게 된다. 그리고 요즘은 &ldquo;겹치느냐&rdquo;보다 <strong>&ldquo;DB
        인덱스를 망치느냐&rdquo;</strong>가 더 중요한 논점이 됐다. v4와 v7 이야기다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">UUID의 구조 — 36자의 정체</h2>

      <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-sm overflow-x-auto mb-4"><code>{`550e8400-e29b-41d4-a716-446655440000
              ↑ 이 자리가 버전 (4 = v4)`}</code></pre>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        UUID는 128비트 숫자를 16진수 32자 + 하이픈 4개로 표기한 것이다. 128비트 중 6비트는 버전과
        변형 표시에 쓰이고, <strong>v4(무작위 방식)는 나머지 122비트가 전부 난수</strong>다.
        2의 122제곱은 약 5.3 × 10³⁶ — 조(10¹²)를 세 번 곱한 규모다.
      </p>

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">충돌 확률, 실감나게 계산해 보면</h2>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        &ldquo;하나라도 겹칠 확률&rdquo;은 생일 역설(birthday paradox)로 계산한다. 경우의 수가 N일 때
        대략 √N개쯤 뽑으면 충돌 확률이 유의미해지는데, v4 UUID의 √N은 약 2.3 × 10¹⁸(230경)이다.
        구체적인 수치로 보면:
      </p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>초당 10억 개씩 <strong>85년</strong>을 생성해야 충돌 확률이 50%에 도달한다</li>
        <li>103조 개를 만들었을 때 충돌 확률이 10억분의 1 수준이다</li>
        <li>일반적인 서비스가 평생 만들 ID(수십억~수조 개)에서 충돌 확률은 사실상 0으로 취급해도 된다</li>
      </ul>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        그럼에도 실무에서 &ldquo;UUID가 겹쳤다&rdquo;는 사고는 종종 보고되는데, 원인은 수학이 아니라
        구현이다 — <strong>시드가 고정된 가짜 난수</strong>(같은 컨테이너 이미지에서 복제된 시드),
        Math.random 같은 비암호학적 난수 사용, 가상머신 스냅샷 복원 후 난수 상태 중복 같은 경우다.
        표준 라이브러리의 암호학적 난수(crypto 기반) 구현을 쓰는 한 걱정할 일이 없다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">진짜 문제는 충돌이 아니라 인덱스다</h2>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        v4를 DB의 기본 키로 쓰면 값이 완전히 무작위라 <strong>삽입 위치도 무작위</strong>가 된다.
        B-트리 인덱스는 정렬을 유지해야 하므로, 새 행이 인덱스 곳곳에 흩어져 들어가며 페이지 분할이
        끊임없이 일어난다. 테이블이 커질수록 삽입 성능이 떨어지고 캐시 효율도 나빠진다. 순차 증가하는
        정수 키와 비교하면 이 차이가 뚜렷하다.
      </p>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        이 문제를 해결한 것이 <strong>UUID v7</strong>(RFC 9562, 2024년 표준화)이다. 앞 48비트에
        밀리초 타임스탬프를 넣고 나머지를 난수로 채운다. 그 결과:
      </p>

      <div className="overflow-x-auto mb-4">
        <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <th className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700"></th>
              <th className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">v4 (무작위)</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">v7 (시간 정렬)</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 dark:text-gray-300">
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="px-3 py-2 font-medium">생성 순서 = 정렬 순서</td>
              <td className="px-3 py-2">아니오</td>
              <td className="px-3 py-2">예 (밀리초 단위)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="px-3 py-2 font-medium">B-트리 삽입 위치</td>
              <td className="px-3 py-2">무작위 (페이지 분할 잦음)</td>
              <td className="px-3 py-2">항상 끝쪽 (순차 삽입에 가까움)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="px-3 py-2 font-medium">ID에서 생성 시각 추정</td>
              <td className="px-3 py-2">불가</td>
              <td className="px-3 py-2">가능 (장점이자 유출 포인트)</td>
            </tr>
            <tr>
              <td className="px-3 py-2 font-medium">난수 비트</td>
              <td className="px-3 py-2">122비트</td>
              <td className="px-3 py-2">74비트</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 뭘 쓰면 되나</h2>

      <ul className="space-y-2 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>DB 기본 키·이벤트 ID</strong> — v7. 인덱스 지역성과 시간 정렬이 그대로 이득이 된다.</li>
        <li><strong>외부에 노출되는 토큰·비밀값</strong> — v4. v7은 생성 시각이 드러나므로, 추측 불가능성이 중요한 값에는 난수가 더 많은 v4가 낫다.</li>
        <li><strong>URL에 쓰기엔 둘 다 길다</strong> — 36자가 부담이면 UUID를 base62 등으로 재인코딩하거나 NanoID 같은 대안도 있다. 다만 &ldquo;짧게&rdquo;는 곧 &ldquo;경우의 수 감소&rdquo;라는 트레이드오프임을 기억할 것.</li>
        <li><strong>주문번호처럼 사람이 읽는 값</strong> — UUID를 그대로 노출하지 말고 별도의 표시용 번호를 두는 게 관례다. 전화로 &ldquo;550e8400-e29b...&rdquo;를 불러줄 수는 없다.</li>
      </ul>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        버전별 UUID가 실제로 어떤 모양인지는{' '}
        <Link href="/tools/uuid-generator" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
          UUID 생성기
        </Link>
        에서 v4·v7을 나란히 만들어 비교해 보면 바로 감이 온다 — v7은 연달아 만들면 앞부분이 거의 같다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #UUID #UUIDv7 #충돌확률 #생일역설 #기본키설계 #RFC9562
      </p>
    </article>
  );
}
