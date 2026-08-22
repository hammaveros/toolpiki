import Link from 'next/link';

export default function PercentVsPercentPointPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">가이드 · 2026년 8월 23일 · 읽는 시간 7분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        30% 할인 후 30% 인상하면 원래 가격일까 — 퍼센트가 헷갈리는 진짜 이유
      </h1>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        10,000원짜리 상품을 30% 할인하면 7,000원. 그 7,000원을 다시 30% 인상하면? 10,000원이 아니라
        <strong> 9,100원</strong>이다. 뉴스에서는 &ldquo;금리가 2%에서 3%로 1%포인트 올랐다&rdquo;고 하는데
        왜 &ldquo;1% 올랐다&rdquo;고 하지 않을까. 퍼센트 계산이 헷갈리는 건 수학을 못해서가 아니라,
        <strong>기준값이 어디냐</strong>를 매번 명시하지 않기 때문이다. 헷갈리는 지점만 골라 정리했다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">함정 1 — 할인과 인상은 대칭이 아니다</h2>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        같은 30%라도 <strong>기준값이 다르다.</strong> 할인의 30%는 10,000원의 30%(3,000원)이고,
        이후 인상의 30%는 7,000원의 30%(2,100원)이다. 내려갈 때의 기준이 더 크니, 같은 비율로는
        절대 원래 값으로 돌아오지 못한다. 이 비대칭 때문에 투자에서 −50%가 나면 +50%가 아니라
        <strong>+100%</strong>가 나야 본전이다. 하락 폭이 클수록 복구에 필요한 상승률은 훨씬 가파르게
        커진다 (−10%→+11%, −30%→+43%, −50%→+100%).
      </p>

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">함정 2 — %와 %p(퍼센트포인트)</h2>

      <p className="mb-3 text-gray-700 dark:text-gray-300">
        금리가 2%에서 3%가 됐다. 두 가지 표현이 모두 맞다:
      </p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>1%p(포인트) 상승</strong> — 두 퍼센트 값의 단순 차이 (3 − 2 = 1)</li>
        <li><strong>50% 상승</strong> — 변화량을 기준값으로 나눈 비율 (1 ÷ 2 = 0.5)</li>
      </ul>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        문제는 이 둘을 섞어 쓸 때다. &ldquo;금리 50% 인상&rdquo;이라는 헤드라인과 &ldquo;금리 1%p
        인상&rdquo;이라는 헤드라인은 같은 사건인데 체감이 완전히 다르다. 반대로 이자율·수수료율·지지율처럼
        <strong>이미 퍼센트인 값의 변화</strong>를 말할 때 %로 쓰면 중의적이 된다. 이럴 땐 %p가 정확한 단위다.
      </p>

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">함정 3 — &ldquo;OO의 몇 %인가&rdquo;와 &ldquo;몇 % 변했나&rdquo;는 다른 질문</h2>

      <div className="overflow-x-auto mb-4">
        <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <th className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">질문</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">공식</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">예시 (40 → 50)</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 dark:text-gray-300">
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="px-3 py-2">50은 40의 몇 %?</td>
              <td className="px-3 py-2">비교값 ÷ 기준값 × 100</td>
              <td className="px-3 py-2">125%</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="px-3 py-2">40에서 50으로 몇 % 증가?</td>
              <td className="px-3 py-2">(변화량 ÷ 기준값) × 100</td>
              <td className="px-3 py-2">25% 증가</td>
            </tr>
            <tr>
              <td className="px-3 py-2">50에서 40으로 몇 % 감소?</td>
              <td className="px-3 py-2">(변화량 ÷ 기준값) × 100</td>
              <td className="px-3 py-2">20% 감소</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        마지막 두 줄을 보자. 40→50은 25% 증가인데 50→40은 20% 감소다. 왕복인데 비율이 다르다 —
        역시 <strong>기준값이 바뀌었기 때문</strong>이다. 증감률의 기준은 언제나 &lsquo;변하기 전 값&rsquo;이다.
      </p>

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">함정 4 — 퍼센트의 역산</h2>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        &ldquo;부가세 10%가 포함된 가격이 33,000원이면 원가는?&rdquo; 33,000 × 0.9 = 29,700원이라고
        답하면 틀린다. 10%의 기준은 원가이므로, 원가 × 1.1 = 33,000 → 원가는 33,000 ÷ 1.1 =
        <strong> 30,000원</strong>이다. &lsquo;포함 가격에서 원가 역산&rsquo;은 빼기가 아니라
        나누기라는 것만 기억하면 된다. 할인가에서 정가를 역산할 때도 마찬가지다
        (30% 할인가 ÷ 0.7 = 정가).
      </p>

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">함정 5 — 평균의 퍼센트는 평균이 아니다</h2>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        1차 시험 응시자 100명 중 60% 합격, 2차 시험 응시자 10명 중 100% 합격. 전체 합격률은
        (60+100)/2 = 80%가 아니다. 합격자 70명 ÷ 응시자 110명 = <strong>약 64%</strong>다.
        모수가 다른 퍼센트들은 단순 평균할 수 없고, 반드시 원래 개수로 되돌아가 다시 계산해야 한다.
        부서별 달성률, 채널별 전환율을 합칠 때 자주 틀리는 지점이다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">정리 — 헷갈리면 이 두 가지만 자문하자</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li><strong>&ldquo;이 퍼센트의 기준(분모)이 뭐지?&rdquo;</strong> — 변하기 전 값인가, 후 값인가, 전체인가</li>
        <li><strong>&ldquo;비율의 변화인가, 값의 변화인가?&rdquo;</strong> — 비율끼리의 차이면 %p</li>
      </ol>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        실제 숫자로 바로 확인하고 싶을 때는{' '}
        <Link href="/tools/percentage" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
          퍼센트 계산기
        </Link>
        에서 &lsquo;A는 B의 몇 %&rsquo;, &lsquo;몇 % 증감&rsquo;, &lsquo;퍼센트 역산&rsquo;을 각각 계산해 볼 수 있다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #퍼센트계산 #퍼센트포인트 #증가율 #할인율계산 #부가세역산
      </p>
    </article>
  );
}
