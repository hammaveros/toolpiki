import Link from 'next/link';

export default function ColorBlenderPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">색상 · 2026년 7월 13일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        두 색을 섞으면 어떤 색이 될까? 색상 혼합 미리 보기
      </h1>

      <p className="mb-4">
        <Link href="/tools/color-blender" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 색상 혼합 도구 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        브랜드 컬러 두 개 사이 그라디언트를 만들고 싶은데, 중간 색이 정확히 어떤 값인지 알고 싶다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">색상 혼합이 필요한 상황</h2>

      <p className="mb-3">디자인이나 개발하다 보면 생각보다 자주 필요하다.</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>그라디언트 중간 색상값 → CSS gradient에 정확한 HEX 코드 필요</li>
        <li>색상 팔레트 생성 → 두 색 사이 단계별 색상 만들기</li>
        <li>호버 효과 색상 → 기본 색에서 약간 밝게/어둡게 혼합</li>
        <li>배경 투명도 → 흰 배경에 반투명 색상이 실제로 어떻게 보이는지</li>
        <li>디자인 일관성 → 같은 계열 색상끼리 얼마나 비슷한지 확인</li>
        <li>물감/페인트 색 혼합 미리보기 → 실제로 섞기 전에 결과 예측</li>
      </ul>

      <p className="mb-4">그라디언트 만들 때 시작 색과 끝 색은 정해졌는데, 중간 지점들의 HEX 코드를 수작업으로 계산하는 건 귀찮다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Figma 그라디언트 → 색상 스텝별 HEX 값 추출이 불편함</li>
        <li>수동 계산 → RGB 각 채널 평균 내는 거 귀찮음</li>
        <li>포토샵 그라디언트 → 있긴 한데 단순 색상 혼합 미리보기에 과함</li>
        <li>CSS 직접 작성 → 중간 색이 어떻게 보일지 코드 짜기 전까지 모름</li>
      </ul>

      <p className="mb-4">두 HEX 코드 입력하면 중간 색들 다 보여주고 코드도 주면 되잖아.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">두 색 사이 모든 단계 보기</h2>

      <p className="mb-3">두 색을 입력하면 혼합 비율에 따른 중간 색상들을 시각적으로 보여준다.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">주요 기능:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>두 색 입력 → HEX, RGB, HSL 모두 가능</li>
        <li>혼합 단계 설정 → 3단계, 5단계, 10단계 등</li>
        <li>혼합 모드 → RGB 선형 보간, HSL 보간 선택</li>
        <li>각 단계별 HEX 코드 표시 + 복사 버튼</li>
        <li>CSS 그라디언트 코드 자동 생성</li>
        <li>색상 팔레트 이미지로 내보내기</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">혼합 비율 슬라이더:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>0% → 색상 A 100%</li>
        <li>50% → 두 색 정확히 중간</li>
        <li>100% → 색상 B 100%</li>
        <li>슬라이더 드래그 → 실시간으로 혼합 결과 변경</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">RGB vs HSL 혼합 차이</h2>

      <p className="mb-3">같은 두 색을 혼합해도 방법에 따라 결과가 다르다.</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>RGB 보간 → 직관적, 컴퓨터 계산 기준, 탁한 중간 색이 나올 수 있음</li>
        <li>HSL 보간 → 색조(Hue) 기반, 자연스러운 색 변화, 선명한 중간 색</li>
        <li>물감 혼합 → 실제 물감은 감산 혼합(CMYK 기반)으로 다름</li>
      </ul>

      <p className="mb-4">파란색과 노란색을 RGB로 섞으면 회색빛 중간색이 나오고, HSL로 섞으면 초록색 계열이 나온다. 어떤 게 맞는지는 용도에 따라 다르다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>CSS 그라디언트 코드 자동 생성 → 붙여넣기만 하면 됨</li>
        <li>단계별 HEX 코드 한꺼번에 복사 가능</li>
        <li>RGB/HSL 비교 → 두 방식 결과 나란히 보기</li>
        <li>슬라이더 실시간 반응</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>실제 물감 혼합 결과와 다를 수 있음 → 빛의 혼합과 물감의 혼합은 다른 원리</li>
        <li>세 색 이상 혼합은 지원 안 됨 → 두 색씩 여러 번 해야 함</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>색상 A, 색상 B 입력 (HEX 코드 또는 컬러 피커)</li>
        <li>혼합 단계 수 선택</li>
        <li>혼합 모드 선택 (RGB / HSL)</li>
        <li>결과 색상 HEX 코드 복사 또는 CSS 코드 복사</li>
      </ol>

      <p className="mb-4">그라디언트 팔레트 만들기 5분이면 된다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/color-blender" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 색상 혼합 도구 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">두 색 사이 모든 색, 코드로 바로.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #색상혼합 #색상블렌딩 #그라디언트 #컬러팔레트 #CSS색상 #디자인도구
      </p>
    </article>
  );
}
