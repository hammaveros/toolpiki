import Link from 'next/link';

export default function ColorPerceptionTestPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">색상 · 2026년 7월 14일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        나는 색상을 얼마나 잘 구분할까? 색감 테스트로 확인해봤다
      </h1>

      <p className="mb-4">
        <Link href="/tools/color-perception-test" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 색상 인식력 테스트 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        디자이너가 "이 두 색이 달라 보이지 않냐"고 하는데, 솔직히 똑같아 보였다. 내 색감이 문제인 건지 궁금했다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">색상 인식력 테스트를 해보게 된 계기</h2>

      <p className="mb-3">색감이라는 게 타고난 부분도 있고 훈련되는 부분도 있다. 디자이너는 비슷한 색상도 미세한 차이를 잘 잡아내는데, 일반인은 그게 쉽지 않다.</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>비슷한 파란색 두 개 → 어느 게 더 파랗지?</li>
        <li>채도가 조금 다른 빨간색 → 구분이 되는가?</li>
        <li>따뜻한 흰색 vs 차가운 흰색 → 차이를 느끼는가?</li>
        <li>비슷한 회색 계열 → 밝기 차이 구분 가능한가?</li>
      </ul>

      <p className="mb-4">막연하게 "나는 색감이 없다"고 느끼는 사람이 많은데, 실제로 어느 정도인지 수치로 확인해보고 싶었다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">색상 인식력 테스트의 종류</h2>

      <p className="mb-3">색각 이상 검사와 다르다. 이건 색을 구분하는 능력이 얼마나 세밀한지를 보는 테스트다.</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>색조 구분 (Hue discrimination)</strong> → 비슷한 색조에서 다른 것 찾기</li>
        <li><strong>채도 구분 (Saturation)</strong> → 같은 색조에서 채도 차이 구분</li>
        <li><strong>명도 구분 (Lightness)</strong> → 밝기 차이 인식</li>
        <li><strong>Farnsworth-Munsell 100 Hue Test</strong> → 색상 순서 정렬 (고전적 색각 검사)</li>
        <li><strong>Ishihara 색맹 검사</strong> → 원 안의 숫자 찾기 (색각 이상 여부 확인)</li>
      </ul>

      <p className="mb-4">이 도구는 색각 이상 진단이 아니라 색상 구분 능력 훈련 및 측정에 가깝다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">어떤 방식으로 테스트하나</h2>

      <p className="mb-3">여러 가지 방식으로 색감을 테스트한다.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">테스트 모드:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>다른 색 찾기 → 4개 중 나머지와 다른 색 하나 클릭</li>
        <li>색상 순서 맞추기 → 색조 그라디언트 순서로 배열</li>
        <li>같은 색 찾기 → 여러 개 중 보기와 동일한 색 선택</li>
        <li>색상 이름 맞추기 → 보여지는 색이 무슨 색인지</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">난이도 진행:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>초급 → 확실히 다른 색 구분 (파란색 vs 빨간색)</li>
        <li>중급 → 비슷한 계열 내에서 구분 (하늘색 vs 파란색)</li>
        <li>고급 → 매우 미세한 차이 구분 (HEX 두 자리만 다른 색상들)</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">색감 점수 기준</h2>

      <p className="mb-3">테스트 결과를 점수로 환산한다.</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>90점 이상 → 매우 예민한 색감. 디자이너/예술가 수준</li>
        <li>70~89점 → 평균 이상. 훈련으로 더 올릴 수 있음</li>
        <li>50~69점 → 보통. 일상에서 색상 구분에 불편함 없음</li>
        <li>50점 미만 → 색각 이상 가능성 있음. 전문 검사 권장</li>
      </ul>

      <p className="mb-4">점수 자체보다 어떤 색상 계열에서 약한지 파악하는 게 더 유용하다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>난이도가 점진적으로 올라가서 재미있음</li>
        <li>어느 색상 계열이 약한지 세부 분석</li>
        <li>반복해서 연습하면 실제로 색감이 좋아짐</li>
        <li>색각 이상 의심 시 전문 검사 권장 → 과도한 진단 자제</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>모니터 캘리브레이션에 따라 결과가 달라질 수 있음</li>
        <li>의학적 색각 검사 대체 불가 → 진단 목적으로는 안과 상담 필요</li>
        <li>주변 조명에 영향을 많이 받음</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>테스트 시작 클릭</li>
        <li>나머지와 다른 색상 선택 (또는 지시에 따라)</li>
        <li>난이도별 결과 확인</li>
        <li>약한 색상 계열 파악 후 반복 연습</li>
      </ol>

      <p className="mb-4">5분이면 전체 테스트 완료.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/color-perception-test" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 색상 인식력 테스트 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">내 색감이 어느 정도인지, 지금 바로 확인.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #색감테스트 #색상인식 #색각검사 #색맹테스트 #색상구분 #디자인감각
      </p>
    </article>
  );
}
