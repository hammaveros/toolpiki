import Link from 'next/link';

export default function ContrastCheckerPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">색상 · 2026년 7월 14일 · 읽는 시간 5분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        글자색과 배경색, WCAG 기준으로 읽기 좋은지 확인하는 방법
      </h1>

      <p className="mb-4">
        <Link href="/tools/contrast-checker" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 색상 대비 체크 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        회색 배경에 진회색 텍스트를 쓰는데, 디자인적으로는 예쁜데 눈이 피로하다는 피드백이 있다. WCAG 기준에 맞는지 확인하고 싶다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">색상 대비가 왜 중요한가</h2>

      <p className="mb-3">색상 대비(contrast ratio)는 텍스트 가독성과 직결된다. 그리고 웹 접근성 법적 요구사항이기도 하다.</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>저시력자 → 대비가 낮으면 텍스트를 읽을 수 없음</li>
        <li>밝은 환경 → 야외, 직사광선 아래에서는 대비가 낮은 화면이 더 안 보임</li>
        <li>노안 → 나이 들수록 대비 민감도 떨어짐</li>
        <li>색각 이상자 → 색상 차이로만 구분하면 못 읽을 수 있음</li>
        <li>모바일 화면 → 화면 밝기 낮추면 낮은 대비 텍스트 안 보임</li>
      </ul>

      <p className="mb-4">디자인 취향으로는 은은한 색상 조합이 예쁠 수 있지만, 실제 사용성에서는 문제가 된다. WCAG(웹 콘텐츠 접근성 지침)에는 최소 대비율 기준이 있다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">WCAG 색상 대비 기준</h2>

      <p className="mb-3">WCAG 2.1 기준으로 세 가지 레벨이 있다.</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>AA 기준 (권장)</strong>
          <ul className="mt-1 ml-4 space-y-1">
            <li>일반 텍스트 (18px 미만) → 최소 4.5:1</li>
            <li>큰 텍스트 (18px 이상, 또는 볼드 14px 이상) → 최소 3:1</li>
            <li>UI 컴포넌트 (버튼, 입력 필드 테두리) → 최소 3:1</li>
          </ul>
        </li>
        <li><strong>AAA 기준 (최고)</strong>
          <ul className="mt-1 ml-4 space-y-1">
            <li>일반 텍스트 → 최소 7:1</li>
            <li>큰 텍스트 → 최소 4.5:1</li>
          </ul>
        </li>
        <li><strong>A 기준 (최소)</strong> → WCAG에서 텍스트 대비 별도 A 레벨 없음, AA가 최소</li>
      </ul>

      <p className="mb-4">흰 배경(#FFFFFF)에 검정 텍스트(#000000)는 21:1 → 최고 대비. 흰 배경에 연회색(#AAAAAA) 텍스트는 약 2.3:1 → AA 미충족.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">대비율 계산 원리</h2>

      <p className="mb-3">WCAG 대비율은 두 색상의 상대 휘도(relative luminance) 비율로 계산된다.</p>

      <p className="mb-3 text-sm text-gray-600 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
        대비율 = (L1 + 0.05) / (L2 + 0.05)<br />
        L1: 더 밝은 색의 상대 휘도<br />
        L2: 더 어두운 색의 상대 휘도
      </p>

      <p className="mb-3">RGB 값을 선형 변환 후 가중 평균으로 휘도 계산. 눈의 색상별 민감도(빨강 21%, 초록 72%, 파랑 7%)를 반영한다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">도구에서 확인할 수 있는 것</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">주요 기능:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>전경색 + 배경색 입력 → HEX, RGB, 컬러피커 모두 가능</li>
        <li>대비율 실시간 계산 → 숫자로 표시</li>
        <li>WCAG AA/AAA 통과 여부 → 텍스트 크기별로 각각 표시</li>
        <li>실시간 미리보기 → 실제 텍스트가 어떻게 보이는지 즉시 확인</li>
        <li>색상 제안 → AA 기준 통과하도록 가장 가까운 색 추천</li>
        <li>다크모드 대비 → 다크 배경에서도 바로 테스트</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">미리보기 예시 텍스트 크기:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>본문 텍스트 (16px)</li>
        <li>작은 텍스트 (14px)</li>
        <li>큰 제목 (24px 이상)</li>
        <li>버튼 텍스트</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제 활용 사례</h2>

      <p className="mb-3">디자인 작업에서 이런 상황에 쓰게 된다.</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>브랜드 컬러로 버튼 만들기 → 브랜드 컬러 배경에 흰 텍스트가 AA 통과하는지</li>
        <li>그레이스케일 디자인 → 어느 회색 명도에서 대비 기준 충족하는지</li>
        <li>다크모드 색상 설계 → 라이트/다크 모두 AA 통과하는 색상 쌍 찾기</li>
        <li>링크 색상 → 파란색이 배경에 따라 충분히 대비되는지</li>
        <li>플레이스홀더 텍스트 → 회색 플레이스홀더가 너무 연한 건 아닌지</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>입력하는 즉시 대비율과 합격 여부 실시간 표시</li>
        <li>AA 기준 미통과 시 수정 방향 제안</li>
        <li>실제 텍스트 미리보기 → 숫자만 보는 것보다 직관적</li>
        <li>텍스트 크기별 기준이 달라서 두 가지 경우 모두 체크됨</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>반투명 색상 대비는 계산이 복잡해서 정확하지 않을 수 있음</li>
        <li>실제 렌더링 폰트 앤티앨리어싱에 따라 체감 가독성은 다를 수 있음</li>
        <li>WCAG 기준 통과가 곧 완벽한 가독성을 보장하진 않음</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>전경색 (텍스트 색) 입력</li>
        <li>배경색 입력</li>
        <li>대비율 확인 + AA/AAA 통과 여부 확인</li>
        <li>미통과 시 색상 조정 후 재확인</li>
      </ol>

      <p className="mb-4">디자인 시스템 만들 때 색상 조합 검증에 필수다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/contrast-checker" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 색상 대비 체크 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">예쁜 색상 조합이 읽기 좋은 색상 조합인지 확인하자.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #WCAG #색상대비 #웹접근성 #대비율체크 #가독성 #UI디자인 #접근성검사
      </p>
    </article>
  );
}
