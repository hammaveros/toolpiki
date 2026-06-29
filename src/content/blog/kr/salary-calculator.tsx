import Link from 'next/link';

export default function SalaryCalculatorPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">계산기 · 2026년 7월 20일 · 읽는 시간 6분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        연봉 4000만원인데 월급이 왜 이것밖에 안 들어오지 — 실수령액 계산기 만든 이유
      </h1>

      <p className="mb-4">
        <Link href="/tools/salary-calculator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 연봉/월급 실수령액 계산기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        "연봉 4000이면 월 333만원 아냐?" → 실수령 약 295만원. 세금이 생각보다 많이 뜯어감.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 필요한지</h2>

      <p className="mb-3">이 계산기가 필요한 상황들:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>이직 협상 중 → "얼마 제시하면 현재랑 비슷한 실수령?" 계산</li>
        <li>오퍼 비교 → 회사 A 연봉 4500 vs 회사 B 연봉 4200, 실수령 차이가 얼마인지</li>
        <li>월 생활비 계획 → 실수령 기준으로 저축, 생활비, 고정지출 배분</li>
        <li>프리랜서 전환 고려 → 직장 실수령 vs 프리랜서 수입 비교</li>
        <li>연봉 협상 마지노선 설정 → "이것보다 적으면 안 받겠다"의 기준 수치</li>
        <li>부부 합산 가계 계획 → 두 사람 실수령 합쳐서 생활비 계획</li>
        <li>신입/이직자 연봉 가이드 → "이 연봉이면 실제 얼마 받는 건지" 파악</li>
        <li>외국 연봉 비교 → 한국 실수령 기준으로 해외 오퍼랑 비교</li>
      </ul>

      <p className="mb-4">
        취업할 때 "연봉이 얼마입니다" 말하는데, 그게 세전 기준이라는 거 모르는 사람도 있음. 특히 처음 취업하는 신입들이 "연봉 2800이면 월 233만원인데 왜 더 적게 들어오지?" 하는 경우 꽤 있음. 4대보험이랑 소득세 다 빠지면 실제는 꽤 다름.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>직접 계산 → 4대보험 요율 외워야 하고, 소득세 과세표준 구간도 봐야 해서 복잡</li>
        <li>연봉 실수령 계산기 앱 → 앱 설치 필요, 2024년 요율 반영됐는지 확인 어려움</li>
        <li>포털 검색 계산기 → 있긴 한데 공제 항목 상세 내역이 안 나오는 경우 많음</li>
        <li>회사 급여명세서 → 이미 입사한 후에야 볼 수 있음, 협상 전엔 소용없음</li>
        <li>HR팀 문의 → 물어보기 뭔가 어색하고, 입사 결정 전엔 더더욱</li>
      </ul>

      <p className="mb-4">
        "국민연금 몇 %, 건강보험 몇 %, 장기요양 얼마, 고용보험 얼마, 소득세 과세구간 어디..." 이거 다 알고 직접 계산하는 사람은 HR 담당자나 회계사 말고는 거의 없음. 그냥 넣으면 나오는 게 필요했음.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 직접 만들었음</h2>

      <p className="mb-3">연봉 입력하면 4대보험, 소득세, 지방소득세 다 계산해서 실수령액 보여줌.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">공제 항목 상세:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>국민연금 → 월 소득의 4.5% (근로자 부담분)</li>
        <li>건강보험 → 월 소득의 3.545% (2024년 기준)</li>
        <li>장기요양보험 → 건강보험료의 12.95%</li>
        <li>고용보험 → 월 소득의 0.9%</li>
        <li>소득세 → 근로소득 간이세액표 기준 계산</li>
        <li>지방소득세 → 소득세의 10%</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">결과로 보여주는 것:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>월 실수령액 → 세금/보험 다 빠진 실제 받는 금액</li>
        <li>연간 실수령액 → 12개월 합산</li>
        <li>공제 항목별 금액 → 뭐가 얼마나 빠지는지 상세 내역</li>
        <li>총 공제 금액 → 한 달에 얼마가 빠지는지</li>
        <li>실수령 비율 → 세전 연봉 대비 실수령 비율 (%)  </li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">연봉대별 실수령액 가이드</h2>

      <p className="mb-3">대략적인 기준 (2024년 요율, 부양가족 없음 기준, 실제와 약간 차이 있을 수 있음):</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>연봉 2,400만원 → 월 실수령 약 183만원 (실수령률 약 91.7%)</li>
        <li>연봉 3,000만원 → 월 실수령 약 224만원 (실수령률 약 89.7%)</li>
        <li>연봉 3,600만원 → 월 실수령 약 263만원 (실수령률 약 87.7%)</li>
        <li>연봉 4,000만원 → 월 실수령 약 287만원 (실수령률 약 86.1%)</li>
        <li>연봉 4,800만원 → 월 실수령 약 337만원 (실수령률 약 84.2%)</li>
        <li>연봉 6,000만원 → 월 실수령 약 408만원 (실수령률 약 81.7%)</li>
        <li>연봉 8,000만원 → 월 실수령 약 524만원 (실수령률 약 78.6%)</li>
        <li>연봉 1억 → 월 실수령 약 636만원 (실수령률 약 76.3%)</li>
      </ul>

      <p className="mb-4">
        연봉이 높아질수록 실수령률이 낮아지는 것 보임. 누진세 구조라서 그럼. 연봉 2400과 1억을 비교하면 연봉은 4.2배 차이인데 실수령은 3.5배 차이임.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>공제 항목 상세 내역 → "소득세가 얼마인지" 정확히 파악 가능</li>
        <li>이직 오퍼 비교 → 두 연봉 다 계산해서 실수령 차이 바로 비교 가능</li>
        <li>연봉 협상 전략에 도움 → "이 연봉 받으려면 세전 얼마여야 하는지" 역산 가능</li>
        <li>연봉협상 시뮬레이션 → 100만원 더 받으면 실수령 얼마 늘어나는지 파악</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>부양가족 공제 미반영 → 부양가족 수에 따라 소득세 달라질 수 있음</li>
        <li>비과세 항목 미반영 → 식대, 교통비 등 비과세 처리되면 실제 더 높을 수 있음</li>
        <li>상여금 미반영 → 성과급, 상여금 포함 여부에 따라 달라짐</li>
        <li>회사 규모별 차이 → 일부 소규모 사업장은 요율 적용 방식 다를 수 있음</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">연봉 협상할 때 이렇게 써봐</h2>

      <p className="mb-3">실수령 계산기를 협상 도구로 활용하는 방법:</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">현재 실수령 파악</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>지금 받는 연봉 입력 → 월 실수령 확인</li>
        <li>이게 협상의 기준점 (배트나, BATNA)</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">목표 실수령 역산</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>내가 원하는 월 실수령 정하기 (예: 300만원)</li>
        <li>계산기로 그 금액이 되는 연봉 찾기 → 약 4,200만원 필요</li>
        <li>협상 테이블에서 "최소 4,200만원 이상"으로 요구</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">오퍼 비교</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>회사 A 오퍼랑 회사 B 오퍼 각각 계산</li>
        <li>실수령 차이 = 연봉 차이 - 세금 차이</li>
        <li>연봉 200만원 차이면 실수령은 약 140~150만원 차이</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">4대보험 이것만 알면 됨</h2>

      <p className="mb-3">복잡해 보이지만 간단하게 정리하면:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>4대보험 = 국민연금 + 건강보험 + 고용보험 + 산재보험</li>
        <li>산재보험은 회사가 전액 부담 → 내 월급에서 안 빠짐</li>
        <li>나머지 3개는 근로자/회사 각각 부담 → 내 급여명세서에 보이는 금액은 근로자 부담분</li>
        <li>장기요양보험은 건강보험에서 파생 → 별도 항목이지만 건강보험이랑 같이 부과</li>
        <li>소득세는 근로소득 간이세액표 기준 → 연말정산 후 환급/추납 결정</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>세전 연봉 입력 (만원 단위, 예: 4000)</li>
        <li>부양가족 수 입력 (기본값 0명)</li>
        <li>계산 버튼 클릭</li>
        <li>월 실수령액, 연간 실수령액 확인</li>
        <li>공제 항목별 금액 상세 확인</li>
      </ol>

      <p className="mb-4">이직 협상 전에 5분만 써봐. "연봉 얼마 줄 거야?" 물어보기 전에 내가 원하는 실수령이 얼마인지 먼저 계산해두는 게 맞는 순서임.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/salary-calculator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 연봉/월급 실수령액 계산기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">
        "연봉 올렸는데 왜 실수령이 별로 안 늘지?" 하는 의문, 공제 내역 보면 해소됨. 이직 협상하는 사람은 협상 전에 꼭 한 번 계산해보는 거 추천.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #실수령액계산기 #연봉계산기 #4대보험 #소득세 #이직협상 #월급계산 #세후연봉
      </p>
    </article>
  );
}
