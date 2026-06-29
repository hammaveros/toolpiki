import Link from 'next/link';

export default function InterestCalculatorPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">계산기 · 2026년 7월 21일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        이자 계산, 엑셀 켜기 귀찮아서 만든 단리·복리 계산기
      </h1>

      <p className="mb-4">
        <Link href="/tools/interest-calculator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 이자 계산기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        적금 만기 때 얼마 받는지 계산하려고 은행 앱 켰는데 시뮬레이션 기능이 로그인 필요라고 뜸.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 필요한지</h2>

      <p className="mb-3">생각보다 이자 계산할 일이 꽤 많다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>적금 가입 전 → 만기 때 얼마 받는지 미리 계산</li>
        <li>예금 비교 → 은행별 금리 달라서 어디가 이득인지 따져봐야 함</li>
        <li>대출 이자 → 원금+이자 총 얼마 내는지 파악</li>
        <li>CMA 통장 → 복리 효과 얼마나 되는지 궁금할 때</li>
        <li>주택청약 → 이율이 낮은데 복리로 얼마나 차이 나는지</li>
        <li>친구한테 돈 빌려줄 때 → 이자 얼마 받을지 정하려고</li>
        <li>연봉 협상 전 → 저축 목표 맞추려면 이율 몇 % 상품 필요한지</li>
        <li>투자 수익률 비교 → 예금이 나은지 ETF가 나은지 기회비용 계산</li>
      </ul>

      <p className="mb-4">금리가 조금만 달라도 장기로 가면 차이가 꽤 크다. 복리는 특히. 근데 머릿속으로 계산이 안 됨.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>은행 앱 시뮬레이션 → 로그인 필요, UI 복잡, 해당 은행 상품만 계산됨</li>
        <li>엑셀 수식 → 매번 켜기 귀찮고 수식 틀리면 답도 틀림</li>
        <li>구글 검색 → "복리 계산기" 치면 광고 가득한 사이트들 나옴</li>
        <li>네이버 금융 → 있긴 한데 숨겨져 있고 복잡한 UI</li>
        <li>은행 홈페이지 → 로그인, 공인인증서 요구하는 곳도 있음</li>
        <li>계산 앱 → 수식 직접 입력해야 해서 공식 알아야 함</li>
      </ul>

      <p className="mb-4">단리와 복리 둘 다 빠르게 비교해보고 싶은데 그게 한 번에 되는 곳이 없었음. 결국 네이버 블로그에서 공식 찾아서 직접 계산하거나 엑셀 열었다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 직접 만들었음</h2>

      <p className="mb-3">원금, 이율, 기간 넣으면 단리/복리 결과가 한 번에 나온다.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">지원 계산 방식:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>단리 → 원금에 대해서만 이자 발생, 이자에는 이자 없음</li>
        <li>복리 → 이자가 원금에 합산되어 다음 기간 이자도 커짐</li>
        <li>복리 주기 선택 → 일/월/분기/반기/연 단위로 설정 가능</li>
        <li>예금/적금 구분 → 거치식(예금)과 적립식(적금) 모두 계산</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">결과로 보여주는 것:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>만기 수령액 (세전)</li>
        <li>총 이자 금액</li>
        <li>단리 vs 복리 비교 (차이 얼마나 나는지)</li>
        <li>기간별 잔액 변화 그래프</li>
      </ul>

      <p className="mb-4">예금이면 원금을 처음에 한 번 넣는 거고, 적금이면 매달 넣는 거라 계산 방식이 다른데 그것도 구분해서 계산해준다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">단리 vs 복리, 실제로 얼마나 차이 나나</h2>

      <p className="mb-3">1,000만 원, 연 5%, 10년으로 계산해보면:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>단리 → 원금 1,000만 + 이자 500만 = 1,500만 원</li>
        <li>복리(연) → 원금 1,000만 + 이자 628.9만 = 1,628.9만 원</li>
        <li>차이 → 128.9만 원</li>
      </ul>

      <p className="mb-3">10년이면 128만 원 차이가 난다. 20년이면 더 벌어짐:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>단리 20년 → 2,000만 원</li>
        <li>복리 20년 → 2,653만 원</li>
        <li>차이 → 653만 원</li>
      </ul>

      <p className="mb-4">금리가 높을수록, 기간이 길수록 복리 효과가 기하급수적으로 커진다. 적금보다 장기 투자 상품이 복리 효과를 훨씬 크게 누리는 이유가 이거다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">적금 계산, 예금이랑 다른 이유</h2>

      <p className="mb-3">적금은 매달 돈을 넣는 구조라서 단순 복리 계산이랑 다르다.</p>

      <p className="mb-3">예를 들어 월 50만 원씩 12개월, 연 4% 적금이면:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>1월에 넣은 50만 원 → 12개월 이자 받음</li>
        <li>2월에 넣은 50만 원 → 11개월 이자 받음</li>
        <li>3월에 넣은 50만 원 → 10개월 이자 받음</li>
        <li>...</li>
        <li>12월에 넣은 50만 원 → 1개월 이자만 받음</li>
      </ul>

      <p className="mb-4">각 달마다 이자 받는 기간이 달라서 전부 더해야 한다. 이걸 머릿속으로 계산하는 건 진짜 어렵다. 그래서 계산기가 필요한 거임.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>로그인, 회원가입 없이 바로 계산 가능</li>
        <li>단리/복리 동시에 비교 결과 나옴 → 차이가 얼마인지 한눈에</li>
        <li>예금/적금 모두 지원 → 따로 계산기 안 찾아도 됨</li>
        <li>복리 주기 세밀하게 설정 가능 → 월복리인지 연복리인지 다름</li>
        <li>기간별 잔액 변화 시각화 → 언제 얼마가 되는지 그래프로 확인</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>세금 공제 후 실수령액 계산은 없음 → 이자소득세(15.4%) 직접 계산해야</li>
        <li>우대금리, 단계별 금리 변경 적용 안 됨 → 고정 금리 기준으로만 계산</li>
        <li>물가 상승률 반영 안 됨 → 실질 수익률은 직접 빼야 함</li>
      </ul>

      <p className="mb-4">세금 공제까지 보려면 이자에서 15.4% 빼면 된다. 세후 이자 = 세전 이자 × (1 - 0.154).</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">이런 상황에서 써봐</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>은행 금리 비교 → A은행 3.8% vs B은행 4.1%, 실제 차이 얼마인지</li>
        <li>적금 만기 계획 → 내년 여름까지 모으면 얼마 되는지</li>
        <li>IRP·연금저축 → 연복리로 20~30년 굴리면 어떻게 되는지 미리 시뮬레이션</li>
        <li>대출이자 → 원금 대비 이자가 총 얼마인지 파악하고 싶을 때</li>
        <li>목돈 마련 계획 → 목표 금액 맞추려면 이율이 몇 %여야 하는지 역산</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>예금/적금 중 선택</li>
        <li>원금(또는 월 납입액) 입력</li>
        <li>연 이율 입력 (예: 3.5)</li>
        <li>기간 입력 (개월 또는 년)</li>
        <li>단리/복리 선택 → 복리면 주기도 설정</li>
        <li>결과 바로 확인</li>
      </ol>

      <p className="mb-4">입력하는 즉시 결과가 나온다. 계산 버튼 따로 없음.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/interest-calculator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 이자 계산기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">가입하려는 적금 상품이 있으면 지금 바로 계산해봐. 만기 때 얼마 받는지 미리 알아두면 금융 결정이 훨씬 명확해진다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #이자계산기 #단리복리계산 #적금이자계산 #예금이자계산 #복리계산기
      </p>
    </article>
  );
}
