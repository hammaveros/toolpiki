import Link from 'next/link';

export default function MeetingCostCalculatorPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">계산기 · 2026년 7월 21일 · 읽는 시간 3분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        "이 회의 비용이 얼마야?" 궁금해서 만든 회의 비용 계산기
      </h1>

      <p className="mb-4">
        <Link href="/tools/meeting-cost-calculator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 회의 비용 계산기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        10명이 2시간 회의를 했는데 이게 돈으로 따지면 얼마짜리 시간인지 계산해보고 싶었음.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 필요한지</h2>

      <p className="mb-3">생각보다 쓸 일이 있다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>팀 회의 정당성 검토 → 이 회의가 진짜 필요한지 비용으로 따져보고 싶을 때</li>
        <li>회의 시간 단축 근거 → 기획서에 "회의 비용 절감" 수치 넣으려고</li>
        <li>외부 컨설팅 견적 비교 → 직접 회의하는 비용 vs 아웃소싱 비용</li>
        <li>프리랜서 미팅 청구 → 미팅 시간도 청구할 때 시간당 비용 계산</li>
        <li>팀 스터디/세미나 → 참가비 산정 기준이 필요할 때</li>
        <li>생산성 개선 제안 → 불필요한 회의 줄이면 연간 얼마 절감되는지</li>
      </ul>

      <p className="mb-4">특히 "이 회의 없애자" 주장할 때 감이 아니라 숫자로 설득하면 훨씬 효과적이다. "1주일에 2번, 1시간씩, 평균 연봉 6000만 원짜리 6명이 하면 연간 얼마야?" 이런 거.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>엑셀 직접 계산 → 연봉 ÷ 12 ÷ 근무일 ÷ 8시간 공식 기억 안 남</li>
        <li>구글 검색 → "회의 비용 계산기" 치면 별로 없거나 영어 사이트만 나옴</li>
        <li>계산기 앱 → 단계별로 따로따로 계산해야 해서 번거로움</li>
        <li>직접 암산 → 연봉 6000만 원 = 시급 얼마? 이게 바로 안 나옴</li>
      </ul>

      <p className="mb-4">연봉에서 시급 뽑는 것부터 막히는 사람이 많다. 월급 ÷ 209시간(주 40시간 기준 월평균)이 시급인데 이걸 바로 아는 사람이 없음.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 직접 만들었음</h2>

      <p className="mb-3">참석 인원, 회의 시간, 평균 시급(또는 연봉)만 입력하면 된다.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">계산 방식:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>시급 직접 입력 또는 연봉에서 자동 환산</li>
        <li>회의 비용 = 참석 인원 × 시간 × 시급</li>
        <li>연간 누적 비용 → 주 N회, 월 N회로 반복하면 연간 얼마인지</li>
        <li>비용 절감 시뮬레이션 → 회의 시간 30분 줄이면 얼마 아껴지는지</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">연봉 → 시급 자동 환산:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>연봉 6,000만 원 → 월급 500만 원 → 시급 약 23,923원</li>
        <li>연봉 5,000만 원 → 시급 약 19,936원</li>
        <li>연봉 4,000만 원 → 시급 약 15,949원</li>
      </ul>

      <p className="mb-4">연봉 입력하면 알아서 시급으로 변환해주니까 공식 몰라도 됨.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제 계산 예시</h2>

      <p className="mb-3">팀 주간 회의 기준:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>참석 인원: 8명</li>
        <li>회의 시간: 1시간</li>
        <li>평균 연봉: 6,000만 원 (시급 약 24,000원)</li>
        <li>회의 1회 비용: 8 × 1 × 24,000 = 192,000원</li>
        <li>주 1회 기준 연간: 192,000 × 52 = 약 998만 원</li>
      </ul>

      <p className="mb-3">8명이 1시간씩 1년 내내 매주 모이면 거의 1,000만 원어치 시간이다. 이게 의미 있는 회의인지 한번쯤 생각해볼 만한 숫자다.</p>

      <p className="mb-3">만약 이 회의를 30분으로 줄이면:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>연간 절감액 → 약 499만 원</li>
        <li>30분 단축 하나로 연간 500만 원 절약</li>
      </ul>

      <p className="mb-4">숫자로 보면 회의 효율화가 왜 중요한지 체감이 된다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>연봉 넣으면 시급 자동 환산 → 공식 몰라도 됨</li>
        <li>회의 1회 비용 + 연간 누적 비용 동시 확인</li>
        <li>인원, 시간, 시급 조절하면 바로 결과 업데이트</li>
        <li>복잡한 입력 없이 3가지만 넣으면 끝</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>참석자마다 연봉이 다른 경우는 평균으로만 계산됨</li>
        <li>회의 준비 시간, 이동 시간 같은 간접 비용은 미포함</li>
        <li>실제 생산성 손실(집중력 분산, 컨텍스트 스위칭) 수치화는 안 됨</li>
      </ul>

      <p className="mb-4">어디까지나 직접 비용만 계산하는 거라, 실제 회의 비용은 여기 나온 숫자보다 더 클 수 있다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">이런 상황에서 써봐</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>회의 줄이자고 설득할 때 → 숫자로 근거 만들기</li>
        <li>회의록 작성 문화 도입 제안 → "이 비용이면 아이디에이션 외주 맡겨도 되지 않냐"</li>
        <li>스탠드업 미팅 시간 단축 → 15분 vs 30분 차이 연간으로 계산</li>
        <li>프리랜서 미팅 청구 → 미팅 시간도 작업 시간으로 포함해서 견적 낼 때</li>
        <li>팀 OKR 자료 → 회의 효율화 목표에 숫자 근거 추가</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>참석 인원 수 입력</li>
        <li>회의 시간 입력 (분 또는 시간)</li>
        <li>평균 시급 또는 연봉 입력</li>
        <li>회의 비용 바로 확인</li>
        <li>반복 주기 설정하면 연간 비용도 나옴</li>
      </ol>

      <p className="mb-4">30초면 된다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/meeting-cost-calculator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 회의 비용 계산기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">다음 회의 전에 한번 계산해봐. 생각보다 큰 숫자가 나올 수도 있음.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #회의비용계산기 #회의시간비용 #시급계산기 #직장인생산성 #회의효율화
      </p>
    </article>
  );
}
