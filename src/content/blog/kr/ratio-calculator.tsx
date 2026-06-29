import Link from 'next/link';

export default function RatioCalculatorPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">계산기 · 2026년 7월 22일 · 읽는 시간 3분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        비율 계산, 레시피 바꾸다가 헷갈려서 만든 비례식 계산기
      </h1>

      <p className="mb-4">
        <Link href="/tools/ratio-calculator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 비율/비례 계산기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        레시피가 4인분인데 2.5인분 만들려고 재료 양 바꾸다가 머리가 터질 뻔 했음.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 필요한지</h2>

      <p className="mb-3">비례 계산이 필요한 순간들:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>요리 레시피 조정 → 4인분 레시피를 3인분으로 줄이기</li>
        <li>인쇄/이미지 크기 조정 → 비율 유지하면서 가로 1200px로 바꾸면 세로는?</li>
        <li>지도/도면 축척 계산 → 1:50,000 지도에서 5cm는 실제 몇 km?</li>
        <li>재료 배합 → 시멘트:모래 = 1:3 비율, 시멘트 20kg이면 모래 몇 kg?</li>
        <li>지분 계산 → 투자자 A:B:C = 3:2:1, 총 1200만 원이면 각자 얼마씩?</li>
        <li>비율 분배 → 수익 60:40으로 나눌 때 금액 얼마씩?</li>
        <li>환율 계산 → 1달러 = 1380원일 때 500달러는 얼마?</li>
        <li>속도/시간 → 시속 80km로 3시간 가면 몇 km? (비례 응용)</li>
      </ul>

      <p className="mb-4">비례식 자체는 A:B = C:D, 모르는 값 구하기인데 실생활에서 이게 생각보다 자주 나온다. 매번 공식 쓰기 귀찮음.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>암산 → 4인분에서 2.5인분으로 줄이면 각 재료를 × 0.625 해야 하는데 이게 바로 안 나옴</li>
        <li>계산기 앱 → 나눗셈, 곱셈 따로 하다 보면 중간에 헷갈림</li>
        <li>엑셀 → 수식 넣는 시간이 더 오래 걸림</li>
        <li>검색 → "비례 계산기" 쳐봐야 뭐가 딱 맞는 게 없음</li>
      </ul>

      <p className="mb-4">특히 레시피에서 소수 배율이 나오면 곤란하다. 3인분→5인분은 × 5/3 = × 1.667 이런 거. 계산기 치면서도 실수가 나옴.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 직접 만들었음</h2>

      <p className="mb-3">A:B = C:? 형태로 모르는 값 하나 구하면 된다.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">지원 계산 유형:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>비례식 풀기 → A:B = C:D에서 D 구하기 (4가지 위치 중 선택)</li>
        <li>비율 단순화 → 8:12 → 2:3으로 기약 분수처럼 정리</li>
        <li>비율 분배 → 전체 금액을 A:B:C 비율로 나누기</li>
        <li>비율 비교 → 두 비율이 같은지 다른지 확인</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">레시피 조정 예시:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>원본 레시피: 4인분 (간장 3T, 설탕 1T, 물 2컵)</li>
        <li>목표: 3인분</li>
        <li>비례식: 4:3 = 3T:?</li>
        <li>결과: 간장 2.25T, 설탕 0.75T, 물 1.5컵</li>
      </ul>

      <p className="mb-4">재료 하나씩 비례식 풀지 않아도 배율(3÷4 = 0.75) 한 번 계산하면 전부 적용할 수 있다. 계산기가 그 배율까지 보여줌.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">비율이랑 비례 개념, 헷갈리면 여기서 정리</h2>

      <p className="mb-3">용어가 비슷해서 섞이는 경우가 많다:</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">비율 (Ratio)</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>두 값의 상대적 크기 관계</li>
        <li>예: 남:여 = 3:2 → 남자가 여자보다 1.5배 많음</li>
        <li>A:B에서 A와 B는 같은 단위여야 함</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">비례 (Proportion)</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>두 비율이 같다는 등식</li>
        <li>예: 2:3 = 4:6 (비율이 같으면 비례)</li>
        <li>A:B = C:D이면 AD = BC (외항의 곱 = 내항의 곱)</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">축척</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>지도의 1:50,000은 지도 1cm = 실제 50,000cm = 500m</li>
        <li>도면에서 1:100이면 도면 1mm = 실제 100mm = 10cm</li>
      </ul>

      <p className="mb-4">계산기가 이 공식들 다 처리해주니까 개념 몰라도 숫자만 넣으면 됨.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>비례식에서 어느 값을 구할지 선택 가능 → A, B, C, D 중 모르는 거 고르면 됨</li>
        <li>비율 단순화 결과도 같이 나옴 → 8:12 입력하면 2:3이라고 알려줌</li>
        <li>분배 계산 → 1200만 원을 3:2:1로 나누면 각각 600/400/200 바로 나옴</li>
        <li>소수점 결과도 분수로 표시 → 0.666...이면 2/3이라고 표시</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>3개 이상 변수가 있는 복합 비례식은 단계별로 나눠서 계산해야 함</li>
        <li>비율 히스토리 저장 없음</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">이런 상황에서 써봐</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>요리 레시피 배율 조정 → 인분 수 바꿀 때 재료 비례 계산</li>
        <li>이미지 리사이징 → 가로/세로 비율 유지하면서 크기 바꾸기</li>
        <li>지도/도면 축척 → 지도 위 거리를 실제 거리로 환산</li>
        <li>수익 배분 계획 → 지분 비율대로 금액 나누기</li>
        <li>재료 배합 → 페인트 혼합, 콘크리트 배합 등 비율 맞추기</li>
        <li>가격 비례 → A제품 100g에 3,200원, 같은 비율로 250g이면?</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>계산 유형 선택 (비례식/비율 단순화/분배)</li>
        <li>알고 있는 값 입력</li>
        <li>모르는 값 위치 선택</li>
        <li>결과 바로 확인</li>
      </ol>

      <p className="mb-4">레시피 조정할 때 진짜 편하다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/ratio-calculator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 비율/비례 계산기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">레시피 스케일 조정이나 지분 배분할 때 북마크해두면 계속 쓸 수 있다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #비율계산기 #비례식계산 #레시피배율조정 #비율분배 #무료계산기
      </p>
    </article>
  );
}
