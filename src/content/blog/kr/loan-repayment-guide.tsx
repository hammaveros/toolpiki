import Link from 'next/link';

export default function LoanRepaymentGuidePost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">가이드 · 2026년 8월 23일 · 읽는 시간 9분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        원리금균등 vs 원금균등 vs 만기일시 — 같은 대출인데 이자 총액이 다른 이유
      </h1>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        대출 계약할 때 반드시 고르게 되는 항목이 상환 방식이다. 같은 금액을 같은 금리로 빌려도
        상환 방식에 따라 <strong>내는 이자 총액이 달라진다.</strong> 그런데 &ldquo;이자가 적은 방식이
        무조건 유리하다&rdquo;고 결론 내리면 절반만 맞는 얘기다. 세 방식의 구조를 이해하면 왜 그런지,
        그리고 내 상황에는 뭐가 맞는지 스스로 판단할 수 있다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">대전제 — 이자는 &lsquo;남은 원금&rsquo;에 붙는다</h2>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        세 방식의 차이는 전부 이 한 문장에서 나온다. <strong>매달 내는 이자 = 그 시점에 남아 있는 원금 ×
        월 금리.</strong> 즉 원금을 빨리 줄일수록 이후에 붙는 이자가 줄어든다. 상환 방식이란 결국
        &ldquo;원금을 언제, 얼마나 빨리 갚아 나가느냐&rdquo;의 스케줄 차이다.
      </p>

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">세 가지 방식의 구조</h2>

      <div className="overflow-x-auto mb-4">
        <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <th className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700"></th>
              <th className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">원리금균등</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">원금균등</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">만기일시</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 dark:text-gray-300">
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="px-3 py-2 font-medium">매달 내는 돈</td>
              <td className="px-3 py-2">항상 동일</td>
              <td className="px-3 py-2">처음에 많고 점점 감소</td>
              <td className="px-3 py-2">이자만 (마지막 달에 원금 전액)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="px-3 py-2 font-medium">원금 줄어드는 속도</td>
              <td className="px-3 py-2">처음엔 느리고 뒤로 갈수록 빠름</td>
              <td className="px-3 py-2">일정 (매달 같은 원금 상환)</td>
              <td className="px-3 py-2">만기까지 그대로</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="px-3 py-2 font-medium">이자 총액</td>
              <td className="px-3 py-2">중간</td>
              <td className="px-3 py-2">가장 적음</td>
              <td className="px-3 py-2">가장 많음</td>
            </tr>
            <tr>
              <td className="px-3 py-2 font-medium">초기 부담</td>
              <td className="px-3 py-2">중간</td>
              <td className="px-3 py-2">가장 큼</td>
              <td className="px-3 py-2">가장 작음</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">왜 원금균등의 이자가 가장 적을까</h2>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        원금균등은 첫 달부터 원금을 정해진 몫만큼 꼬박꼬박 갚는다. 남은 원금이 가장 빠르게 줄어드니
        거기에 붙는 이자도 가장 빠르게 줄어든다. 대신 초반에는 &lsquo;원금 몫 + 아직 큰 원금에 대한
        이자&rsquo;를 같이 내야 해서 월 상환액이 가장 무겁고, 갈수록 가벼워진다.
      </p>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        원리금균등은 매달 내는 총액(원금+이자)을 만기까지 똑같게 맞춘 방식이다. 초반에는 이자 비중이
        크고 원금이 조금씩만 줄어들다가, 후반으로 갈수록 원금 비중이 커진다. 원금이 늦게 줄어드는 만큼
        이자 총액은 원금균등보다 많아진다 — 대신 매달 나가는 돈이 일정해서 <strong>가계 현금흐름
        계획이 쉽다.</strong> 실제로 주택담보대출에서 가장 널리 쓰이는 이유다.
      </p>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        만기일시는 원금을 한 푼도 안 갚고 만기에 몰아 갚으므로, 대출 기간 내내 최대 원금에 이자가
        붙는다. 이자 총액이 가장 많은 게 당연하다. 그런데도 쓰이는 이유는 목적이 다르기 때문이다 —
        전세보증금처럼 <strong>만기에 목돈이 확실히 돌아오는 상황</strong>, 또는 단기 운영자금처럼
        원금 회수 시점이 정해진 경우에 맞는 방식이다.
      </p>

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">감을 잡기 위한 예시</h2>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        1억 원을 연 4%로 10년(120개월) 빌린다고 하자. 대략적인 구조 비교는 이렇다 (실제 계약은 금리
        변동·중도상환·수수료에 따라 달라지므로 구조 비교용 어림값이다):
      </p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>원리금균등</strong> — 매달 약 101만 원씩 고정. 이자 총액 약 2,150만 원</li>
        <li><strong>원금균등</strong> — 첫 달 약 117만 원에서 매달 조금씩 줄어 마지막 달 약 84만 원. 이자 총액 약 2,020만 원</li>
        <li><strong>만기일시</strong> — 매달 이자만 약 33만 원, 만기에 1억 원. 이자 총액 4,000만 원</li>
      </ul>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        원금균등이 원리금균등보다 이자를 100만 원 이상 아끼지만, 그 대가로 초반 3년쯤은 매달 10만 원
        이상을 더 내야 한다. &ldquo;이자 총액&rdquo;만 보면 원금균등이 정답 같지만, 초반 현금흐름이
        빠듯한 가계라면 그 차액을 못 버티는 게 더 큰 리스크다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">선택 기준 정리</h2>

      <ul className="space-y-2 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>초반 여유가 있고 이자를 최소화하고 싶다</strong> → 원금균등</li>
        <li><strong>매달 고정 지출로 계획을 세우고 싶다 / 초반 부담을 낮추고 싶다</strong> → 원리금균등</li>
        <li><strong>만기에 원금이 확실히 회수된다 (전세금 등)</strong> → 만기일시</li>
        <li>어느 쪽이든 <strong>중도상환 여력</strong>이 생기면 남은 원금이 줄어 이후 이자가 줄어든다 — 중도상환수수료 조건과 비교해 판단</li>
      </ul>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        내 조건(금액·금리·기간)으로 세 방식의 월 상환액과 이자 총액을 직접 비교해 보려면{' '}
        <Link href="/tools/loan-calculator" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
          대출 이자 계산기
        </Link>
        에 숫자를 넣어 보면 된다. 표로만 보던 차이가 내 돈 단위로 보이면 판단이 훨씬 쉬워진다.
      </p>

      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        ※ 이 글은 상환 방식의 구조를 설명하는 일반 정보이며, 특정 금융상품의 권유가 아닙니다. 실제 대출
        조건은 금융기관·상품·시점에 따라 다르므로 계약 전 반드시 해당 기관의 상환 스케줄표를 확인하세요.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #원리금균등 #원금균등 #만기일시상환 #대출이자계산 #상환방식비교
      </p>
    </article>
  );
}
