import Link from 'next/link';

export default function ColorBlindSimulatorPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">색상 · 2026년 7월 13일 · 읽는 시간 5분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        색맹인 사람 눈에 내 디자인이 어떻게 보일까
      </h1>

      <p className="mb-4">
        <Link href="/tools/color-blind-simulator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 색맹 시뮬레이션 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        빨간색으로 에러, 초록색으로 성공 표시했는데, 적록색맹인 사람은 이게 구분이 안 된다고 한다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">색맹 시뮬레이션이 필요한 이유</h2>

      <p className="mb-3">전 세계 남성의 약 8%, 여성의 약 0.5%가 색각 이상을 가지고 있다. 한국에도 200만 명 이상이 색각 이상자다.</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>UI/UX 디자인 → 색만으로 정보 전달하면 색맹 사용자 배제</li>
        <li>데이터 시각화 → 차트 색상이 구분 안 되면 의미 없음</li>
        <li>웹 접근성 (WCAG) → 색상 단독 정보 전달 금지 조항</li>
        <li>마케팅 자료 → 색상 조합이 특정 사용자에게 의도와 다르게 보임</li>
        <li>게임 UI → 팀 색상, 아이템 색상 구분 문제</li>
        <li>지도/인포그래픽 → 빨강-초록 구분 못 하면 정보 전달 실패</li>
      </ul>

      <p className="mb-4">색맹 사용자를 배려하는 게 좋은 디자인인데, 실제로 어떻게 보이는지 체험해본 적 없으면 감이 잘 안 잡힌다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">색각 이상의 종류</h2>

      <p className="mb-3">색각 이상은 종류가 다양하다.</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>제1색맹 (적색맹, Protanopia)</strong> → 빨강이 어둡게 보임, 빨강과 초록이 비슷하게 보임</li>
        <li><strong>제2색맹 (녹색맹, Deuteranopia)</strong> → 초록 인식 못함, 빨강-초록 구분 어려움. 가장 흔함</li>
        <li><strong>제3색맹 (청황색맹, Tritanopia)</strong> → 파랑-노랑 구분 어려움. 비교적 드묾</li>
        <li><strong>전색맹 (Achromatopsia)</strong> → 색상 전혀 못 구분, 흑백으로만 보임. 매우 드묾</li>
        <li><strong>제1색약 (Protanomaly)</strong> → 적색맹보다 약한 증상</li>
        <li><strong>제2색약 (Deuteranomaly)</strong> → 녹색맹보다 약한 증상. 남성 5% 이상</li>
      </ul>

      <p className="mb-4">가장 흔한 건 적록색맹/색약 계열이다. 디자인할 때 빨강-초록만 신경 써도 많은 사용자를 배려할 수 있다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">특정 색상이 어떻게 보이는지 확인하기</h2>

      <p className="mb-3">HEX 코드를 입력하면 각 색각 이상별로 어떻게 보이는지 변환해서 보여준다.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">주요 기능:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>색상 입력 → HEX 또는 컬러 피커</li>
        <li>6가지 색각 이상 시뮬레이션 → 적색맹, 녹색맹, 청황색맹, 전색맹, 적색약, 녹색약</li>
        <li>원본 색상과 나란히 비교</li>
        <li>변환된 색상 HEX 코드 표시</li>
        <li>여러 색상 팔레트 동시 비교 → 차트 색상 조합 테스트</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">색맹 친화적 디자인 팁</h2>

      <p className="mb-3">색상만으로 정보를 전달하지 않는 게 핵심이다.</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>아이콘/텍스트 병행 → 빨간 에러 메시지에 ❌ 아이콘 추가</li>
        <li>패턴/모양 활용 → 차트에서 색상 + 점선/실선 구분</li>
        <li>색상 대비 높이기 → 밝기 차이를 크게</li>
        <li>색맹 친화적 팔레트 → 파란색/주황색 조합은 대부분 구분 가능</li>
        <li>Red-Green 대신 Blue-Orange → 데이터 시각화 권장 색상 조합</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>여러 종류 색각 이상 한번에 비교 → 내 색상이 어떻게 보이는지 감 잡힘</li>
        <li>색상 팔레트 통째로 입력 가능 → 차트 색상 셋 검증에 유용</li>
        <li>변환 HEX 코드 확인 → 대체 색상 찾을 때 참고</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>실제 색각 이상 경험과 완전히 동일하지 않을 수 있음 → 근사 시뮬레이션</li>
        <li>이미지 전체 시뮬레이션은 이미지 색맹 도구 따로 있음</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>색상 HEX 코드 입력</li>
        <li>각 색각 이상별 시뮬레이션 결과 확인</li>
        <li>필요하면 색상 조정해서 다시 확인</li>
      </ol>

      <p className="mb-4">디자인 검토 단계에서 꼭 한 번 확인해보자.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/color-blind-simulator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 색맹 시뮬레이션 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">모든 사람이 볼 수 있는 디자인.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #색맹시뮬레이션 #색각이상 #웹접근성 #WCAG #적록색맹 #UI디자인
      </p>
    </article>
  );
}
