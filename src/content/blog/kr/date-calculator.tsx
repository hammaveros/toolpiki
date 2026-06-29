import Link from 'next/link';

export default function DateCalculatorPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">계산기 · 2026-06-25 · 4분 읽기</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        "다음 주 금요일이 몇 일이지?" 매번 달력 넘기는 거 귀찮아서 날짜 계산기 만들었음
      </h1>

      <p className="mb-4">
        <Link href="/tools/date-calculator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 날짜 계산기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        계약서 써야 하는데 "30일 후"가 언제인지 머릿속으로 계산하다가 틀리면 큰일 남. 그냥 정확하게 바로 나오면 좋겠는데.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 필요한지</h2>

      <p className="mb-3">날짜 계산이 필요한 상황들, 생각보다 많음:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>계약/납기 기한 → "계약일로부터 90일 이내" 언제까지인지 계산</li>
        <li>D-day 계산 → 시험, 여행, 결혼식, 프로젝트 마감까지 몇 일 남았는지</li>
        <li>근무일수 계산 → 휴일 제외하고 실제 근무한 날수 파악</li>
        <li>나이 계산 → 정확한 만 나이, 몇 년 몇 개월 몇 일인지</li>
        <li>프리랜서 청구서 → 작업 기간 일수 계산해서 청구 금액 산정</li>
        <li>임신/출산 예정일 → 마지막 생리일 기준 40주 계산</li>
        <li>보험/대출 만기 → 가입일로부터 정확한 만기일</li>
        <li>주식/채권 만기 → 투자 기간 계산</li>
        <li>휴가 계획 → 연차 며칠 쓰면 며칠 연속 쉬는지</li>
      </ul>

      <p className="mb-4">달력 보면서 손가락으로 세는 거, 한두 번은 괜찮은데 자주 하다 보면 귀찮고 틀릴 수도 있음.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">달력 세는 게 왜 틀리는가</h2>

      <p className="mb-3">직접 세면 의외로 실수가 많음:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>월마다 일수가 다름 → 30일, 31일, 28일, 29일 (윤년)</li>
        <li>시작일 포함 여부 → "오늘부터 30일"이 오늘 포함인지 내일부터인지 헷갈림</li>
        <li>월말 넘어갈 때 → 1월 31일부터 30일 후면? 달력 직접 안 보면 헷갈림</li>
        <li>영업일 계산 → 주말, 공휴일 빼야 하는데 수동으로 하면 오래 걸림</li>
        <li>두 날짜 사이 기간 → 정확한 일수, 주수, 개월수 계산이 생각보다 복잡</li>
      </ul>

      <p className="mb-4">특히 법적 기한이나 계약 관련 날짜 계산은 하루라도 틀리면 문제가 생길 수 있음.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>구글 캘린더 → 날짜 수 세는 기능 없음. 일일이 클릭해서 세야 함</li>
        <li>엑셀/구글 스프레드시트 → DATEDIF 함수 알아야 함. 매번 파일 열기 귀찮음</li>
        <li>스마트폰 기본 달력 → 두 날짜 사이 기간 계산 기능 없는 경우 많음</li>
        <li>날짜 계산 앱 → 설치해야 하고, 광고 많음</li>
        <li>구글 검색 "오늘부터 90일 후" → 가능하긴 한데 영업일 제외나 세밀한 계산은 안 됨</li>
        <li>손으로 직접 계산 → 실수 가능성 있음</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">날짜 계산에 필요한 기능들 한 곳에:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>두 날짜 사이 기간 → 일, 주, 개월, 년으로 표시</li>
        <li>날짜에서 N일 더하기/빼기 → 오늘부터 90일 후, 30일 전 등</li>
        <li>D-day 계산 → 특정 날짜까지 몇 일 남았는지</li>
        <li>영업일 계산 → 주말 제외한 근무일 기준 계산</li>
        <li>요일 확인 → 특정 날짜가 무슨 요일인지</li>
        <li>시작일 포함/제외 선택 가능 → 헷갈리는 "오늘 포함" 여부 설정</li>
        <li>윤년 자동 처리 → 2월 날짜 계산 실수 없음</li>
      </ul>

      <p className="mb-3">가장 자주 쓰는 기능은 "오늘부터 N일 후가 언제인지"랑 "두 날짜 사이가 며칠인지"임.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">날짜 계산이 헷갈리는 이유</h2>

      <p className="mb-3">법적/공식 계산에서 자주 나오는 혼란:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>익일 vs 당일 기산</strong> → "계약일로부터 30일"이 계약 당일 포함이냐 다음 날부터냐. 법적으로는 다음 날부터가 일반적</li>
        <li><strong>영업일 vs 역일</strong> → "영업일 기준 3일"과 "3일 이내"는 다름</li>
        <li><strong>만 기준 vs 세는 기준</strong> → 만 나이 계산도 생일 기준 따지면 복잡함</li>
        <li><strong>윤년 처리</strong> → 4년마다 2월 29일 있는 게 계산에 영향</li>
        <li><strong>시간대 차이</strong> → 국제 계약이면 어느 기준으로 날짜 세는지도 중요</li>
      </ul>

      <p className="mb-4">이런 세부 사항들 때문에 간단해 보이는 날짜 계산이 의외로 복잡해지는 경우가 있음.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">D-day 계산 활용법</h2>

      <p className="mb-3">여러 용도로 쓸 수 있음:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>시험 D-day → 수능, 공무원 시험, 자격증 시험 날짜 입력하면 남은 날수 바로 확인</li>
        <li>여행 D-day → 출발 날짜까지 몇 일인지, 비자 신청 기한도 함께 계산</li>
        <li>기념일 → 결혼기념일, 100일, 1000일 등 계산</li>
        <li>마감일 → 프로젝트, 리포트, 원서 제출 마감까지</li>
        <li>목표 설정 → "30일 챌린지" 끝나는 날 계산</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>날짜 선택하면 바로 계산 → 추가 입력 없음</li>
        <li>일/주/개월/년 동시에 표시 → 원하는 단위로 바로 확인</li>
        <li>시작일 포함 옵션 → 헷갈리는 부분 직접 설정 가능</li>
        <li>영업일 계산 → 수동으로 하면 오래 걸리는 작업 바로 해결</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>공휴일 제외 계산 → 나라별 공휴일 데이터 필요. 한국 공휴일 기준으로만 처리</li>
        <li>시간 단위 계산 → 시간, 분까지 정밀 계산은 별도 필요</li>
        <li>반복 일정 계산 → 매달 같은 날짜 반복되는 계산은 직접 해야 함</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>계산 방식 선택 (기간 계산 / 날짜 더하기 빼기 / D-day)</li>
        <li>날짜 입력</li>
        <li>결과 바로 확인</li>
      </ol>

      <p className="mb-4">10초면 됨.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/date-calculator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 날짜 계산기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">달력 넘기면서 손가락으로 세는 거 이제 안 해도 됨.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #날짜계산기 #D-day계산 #기간계산 #영업일계산 #날짜더하기 #날짜빼기 #만나이
      </p>
    </article>
  );
}
