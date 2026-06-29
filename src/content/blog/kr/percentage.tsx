import Link from 'next/link';

export default function PercentagePost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">계산기 · 2026년 7월 22일 · 읽는 시간 3분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        퍼센트 계산, 세일 때마다 머릿속에서 안 나와서 만든 계산기
      </h1>

      <p className="mb-4">
        <Link href="/tools/percentage" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 퍼센트 계산기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        쇼핑몰 세일 30%인데 69,000원이면 얼마 할인받는 건지 계산이 바로 안 됨.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 필요한지</h2>

      <p className="mb-3">퍼센트 계산이 필요한 순간이 생각보다 많다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>쇼핑 할인 → 30% 세일이면 실제로 얼마 빠지는 건지</li>
        <li>세금 계산 → 부가세 10%, 세후 가격이 얼마인지</li>
        <li>성적/점수 → 100점 만점에 73점이면 몇 %인지</li>
        <li>수익률 계산 → 100만 원 투자해서 117만 원이 됐으면 수익률 몇 %</li>
        <li>인상률 계산 → 연봉 5400에서 5700으로 올랐으면 몇 % 인상인지</li>
        <li>식당 팁 → 팁 15% 주면 얼마인지 (해외 여행 시)</li>
        <li>할부 이율 → 원금 대비 이자가 몇 %인지</li>
        <li>영양 정보 → 하루 권장 칼로리 대비 이 음식이 몇 %인지</li>
      </ul>

      <p className="mb-4">수학적으로 어렵진 않은데, 막상 즉석에서 계산하려면 헷갈린다. 특히 "X는 Y의 몇 %?" 류는 어느 걸 분자에 넣어야 하는지 순간 모호해짐.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>스마트폰 계산기 → 수식 직접 입력해야 함 (73÷100×100 이런 식으로)</li>
        <li>구글 검색 → "퍼센트 계산" 치면 광고 붙은 사이트들 우르르 나옴</li>
        <li>엑셀 → 계산식 넣는 게 더 오래 걸림</li>
        <li>암산 → 30% 할인이면 그냥 0.7 곱하면 되는데, 더 복잡한 건 안 됨</li>
      </ul>

      <p className="mb-4">퍼센트 유형이 여러 개라는 게 문제다. "X의 Y%", "X는 Y의 몇 %", "X에서 Y%만큼 증가하면", "X에서 Y%만큼 할인하면" 전부 다른 계산이다. 계산기 앱으로는 이걸 한 번에 해결 못 함.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 직접 만들었음</h2>

      <p className="mb-3">퍼센트 계산 유형을 선택하면 된다.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">지원 계산 유형:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>X의 Y% → "50,000원의 30%는 얼마?" → 15,000원</li>
        <li>X는 Y의 몇 % → "73은 100의 몇 %?" → 73%</li>
        <li>할인 계산 → "69,000원에서 30% 할인하면?" → 48,300원 (20,700원 할인)</li>
        <li>인상/증가 계산 → "5,400만 원이 5,700만 원이 됐으면 몇 % 인상?" → 5.56%</li>
        <li>세금 포함/제외 → "부가세 포함 가격에서 세전 가격 뽑기"</li>
      </ul>

      <p className="mb-4">유형 선택하면 입력 폼이 바뀌면서 내가 넣어야 하는 값이 명확해진다. 어디에 뭘 넣는지 헷갈릴 일이 없다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">퍼센트 계산 자주 헷갈리는 것들</h2>

      <p className="mb-3">이건 많은 사람이 틀린다:</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">할인율 vs 실제 할인 금액</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>100,000원 상품 30% 할인 → 70,000원 (30,000원 할인)</li>
        <li>200,000원 상품 20% 할인 → 160,000원 (40,000원 할인)</li>
        <li>할인율이 낮아도 원가가 높으면 할인 금액이 더 클 수 있음</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">증가율과 감소율의 비대칭</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>100 → 50%↓ → 50, 다시 50%↑ 하면 → 75 (100 아님!)</li>
        <li>50% 내렸다가 50% 오른다고 원래대로 안 돌아옴</li>
        <li>30% 하락 복구하려면 42.9% 상승이 필요</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">부가세 계산</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>세전 가격 × 1.1 = 부가세 포함 가격</li>
        <li>부가세 포함 가격 ÷ 1.1 = 세전 가격 (× 0.9 아님!)</li>
        <li>11만 원짜리 세전 가격은 10만 원, 1만 원이 세금</li>
      </ul>

      <p className="mb-4">특히 부가세 역산이 ÷1.1인 걸 모르는 사람이 많다. 10% 빼는 게 아님.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>계산 유형이 나뉘어 있어서 어떤 공식인지 몰라도 됨</li>
        <li>할인 계산 시 할인 금액과 최종 금액 동시에 표시</li>
        <li>증감률 계산 시 방향(증가/감소)도 자동으로 표시</li>
        <li>광고 없고 로딩 빠름</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>복합 할인(추가 쿠폰 중복 적용 등) 계산은 단계별로 직접 해야 함</li>
        <li>퍼센트 히스토리 저장 기능 없음</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>계산 유형 선택 (할인, 증감, 비율 등)</li>
        <li>숫자 입력</li>
        <li>결과 바로 확인</li>
      </ol>

      <p className="mb-4">10초면 된다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/percentage" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 퍼센트 계산기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">다음 쇼핑 세일 때 써봐. 할인이 진짜 할인인지 바로 확인할 수 있음.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #퍼센트계산기 #할인율계산 #증감률계산 #부가세계산 #무료계산기
      </p>
    </article>
  );
}
