import Link from 'next/link';

export default function LoanCalculatorPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">계산기 · 2026년 7월 20일 · 읽는 시간 6분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        대출 받기 전에 이자 얼마인지 정확히 계산 안 하는 사람 생각보다 많음 — 대출 계산기 만든 이유
      </h1>

      <p className="mb-4">
        <Link href="/tools/loan-calculator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 대출 이자/원금 상환 계산기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        "금리 4%니까 별로 안 많겠지" → 1억에 30년 대출 시 총 이자: 약 7,200만원. 원금보다 많지는 않지만 꽤 됨.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 필요한지</h2>

      <p className="mb-3">대출 계산기, 이런 상황에서 필요함:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>주택담보대출 알아볼 때 → 월 상환액이 얼마인지 미리 파악</li>
        <li>전세자금대출 → 대출 가능 금액 내에서 어떤 조건이 유리한지</li>
        <li>신용대출 → 금리 다른 상품 비교, 실제 이자 차이 계산</li>
        <li>자동차 할부 → 할부 금리 계산, 일시불 vs 할부 손익 비교</li>
        <li>학자금 대출 → 졸업 후 상환 계획 세울 때</li>
        <li>사업자 대출 → 월 이자 부담이 수익에서 감당 가능한지 파악</li>
        <li>기존 대출 중도상환 고려 → 남은 이자 vs 중도상환수수료 비교</li>
        <li>대출 갈아타기(리파이낸싱) → 금리 낮아졌을 때 절감 효과 계산</li>
      </ul>

      <p className="mb-4">
        은행 상담 가기 전에 미리 계산해두면 얘기가 훨씬 수월해짐. "월 상환 얼마 나와요?" 물어보면 직원이 계산해주긴 하는데, 거기서 숫자를 보면 이미 심리적으로 수락 모드가 됨. 미리 알고 가는 거랑 그 자리에서 처음 듣는 거랑 완전히 다름.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>은행 홈페이지 대출 계산기 → 있긴 한데 해당 은행 상품 기준이라 조건 고정됨</li>
        <li>포털 검색 계산기 → 원리금균등인지 원금균등인지 방식 선택이 없거나 설명 부족</li>
        <li>엑셀 직접 계산 → PMT 함수 알아야 하고, 원금균등 스케줄 만들기 복잡</li>
        <li>직접 계산 → 복리 이자 공식 외우는 사람 별로 없음</li>
        <li>은행 상담사 → 상품 팔아야 하는 입장이라 객관적인 비교가 어려울 수 있음</li>
      </ul>

      <p className="mb-4">
        원리금균등이랑 원금균등 차이를 모르는 채로 대출 받는 사람도 많음. 그냥 "은행에서 알아서 해주는 거 아니야?" 하는 식. 근데 어떤 방식 선택하느냐에 따라 총 이자 차이가 수백만원 날 수 있음.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 직접 만들었음</h2>

      <p className="mb-3">대출금액, 금리, 기간 입력하면 상환 방식별로 월 상환액, 총 이자, 상환 스케줄 전부 보여줌.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">핵심 기능:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>원리금균등상환 계산 → 매달 같은 금액 납부, 총 이자 계산</li>
        <li>원금균등상환 계산 → 초기 납부액 많고 갈수록 줄어드는 방식</li>
        <li>두 방식 비교 → 총 이자 차이, 초기/후기 부담 차이 한눈에</li>
        <li>월별 상환 스케줄 → 1회차부터 마지막 회차까지 원금/이자 분배 확인</li>
        <li>조기상환 시뮬레이션 → 중간에 일부 상환하면 이자가 얼마나 줄어드는지</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">입력 항목:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>대출금액 → 단위: 만원 또는 원</li>
        <li>연 금리(%) → 소수점 입력 가능 (예: 4.5)</li>
        <li>대출 기간 → 개월 또는 연 단위</li>
        <li>상환 방식 → 원리금균등 / 원금균등 선택</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">원리금균등 vs 원금균등, 뭐가 다른가</h2>

      <p className="mb-3">대출 계산기 쓰기 전에 이 차이 알고 있으면 훨씬 유용하게 쓸 수 있음:</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">원리금균등상환</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>매달 동일한 금액 납부 → 가계 예산 짜기 쉬움</li>
        <li>초기에 이자 비중이 높고, 후반으로 갈수록 원금 비중 증가</li>
        <li>원금균등에 비해 총 이자 약간 더 많음 (기간이 길수록 차이 커짐)</li>
        <li>주택담보대출에서 가장 일반적으로 쓰는 방식</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">원금균등상환</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>매달 원금을 동일하게 나눠서 납부 → 초기 납부액이 많음</li>
        <li>원금이 빨리 줄어서 이자도 빨리 줄어듦</li>
        <li>총 이자 부담이 원리금균등보다 적음</li>
        <li>초기 수입이 많거나, 빠른 원금 감소가 중요할 때 유리</li>
      </ul>

      <p className="mb-3 font-medium text-gray-800 dark:text-gray-200">예시 (1억, 연 4%, 30년):</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>원리금균등 → 월 납부액 약 47만원 (일정), 총 이자 약 7,200만원</li>
        <li>원금균등 → 초기 월 납부액 약 61만원, 말기 약 28만원, 총 이자 약 6,000만원</li>
        <li>이자 차이 → 약 1,200만원. 상당한 금액임</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>두 방식 동시 비교 → 어떤 게 유리한지 바로 파악 가능</li>
        <li>월별 스케줄 → 몇 년차에 원금이 얼마나 남아있는지 확인 가능</li>
        <li>조기상환 효과 → "지금 500만원 갚으면 이자 얼마나 줄어?" 확인 가능</li>
        <li>은행 상담 전 준비 자료 → 미리 계산해두면 협상에 도움</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>변동금리 시뮬레이션 없음 → 금리가 오르거나 내릴 경우 반영 어려움</li>
        <li>중도상환수수료 계산 없음 → 실제 갈아타기 계산 시 별도 확인 필요</li>
        <li>실제 은행 상품 조건 반영 아님 → 취급 수수료 등 추가 비용 제외</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">대출 받기 전 체크리스트</h2>

      <p className="mb-3">계산기 쓰면서 같이 확인하면 좋은 것들:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>월 상환액이 월소득의 30% 이하인지 확인 → 일반적으로 권장되는 기준</li>
        <li>고정금리 vs 변동금리 → 금리 상승기에는 고정이 유리할 수 있음</li>
        <li>거치 기간 여부 → 거치 기간 있으면 처음엔 이자만 냄, 원금 안 줄음</li>
        <li>중도상환수수료 → 3년 내 상환 시 보통 0.5~2% 수수료 발생</li>
        <li>DSR(총부채원리금상환비율) → 연소득 대비 대출 가능 금액 상한 확인</li>
        <li>우대금리 조건 → 급여 이체, 카드 실적 등으로 금리 낮출 수 있는지</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>대출금액 입력 (예: 1억 → 10,000만원 또는 100,000,000원)</li>
        <li>연 금리 입력 (예: 4.5)</li>
        <li>대출 기간 입력 (예: 30년 또는 360개월)</li>
        <li>상환 방식 선택 (원리금균등 / 원금균등 / 비교)</li>
        <li>결과 확인: 월 상환액, 총 이자, 월별 스케줄</li>
      </ol>

      <p className="mb-4">은행 상담 전 5분만 써보면 훨씬 준비된 상태로 갈 수 있음.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/loan-calculator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 대출 이자/원금 상환 계산기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">
        대출은 한 번 받으면 수십 년 갚는 거임. 10분 투자해서 미리 계산해두는 게 훨씬 나음. 원리금균등이랑 원금균등 차이만 알아도 수백만원 아낄 수 있는 선택을 더 잘 할 수 있음.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #대출계산기 #이자계산 #원리금균등 #원금균등 #주택담보대출 #월상환액 #대출비교
      </p>
    </article>
  );
}
