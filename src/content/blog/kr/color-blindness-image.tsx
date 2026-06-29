import Link from 'next/link';

export default function ColorBlindnessImagePost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">색상 · 2026년 7월 13일 · 읽는 시간 5분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        내가 만든 이미지, 색맹인 사람에게 어떻게 보일까
      </h1>

      <p className="mb-4">
        <Link href="/tools/color-blindness-image" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 이미지 색맹 시뮬레이션 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        웹사이트 배너 이미지를 디자인했는데, 색각 이상이 있는 사람 눈에도 정보가 잘 전달되는지 확인하고 싶다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">이미지 색맹 시뮬레이션이 필요한 이유</h2>

      <p className="mb-3">색상 단위 확인과 이미지 전체 확인은 다르다. 단색 하나가 아니라 복잡한 이미지 전체가 어떻게 보이는지 체험해야 실제로 감이 온다.</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>디자인 시안 검토 → 배너, 일러스트, UI 스크린샷 전체</li>
        <li>데이터 시각화 → 차트/그래프 이미지가 색각 이상자에게 읽히는지</li>
        <li>지도 이미지 → 색상으로 지역 구분할 때 구분 가능한지</li>
        <li>게임 아트 → 캐릭터, 아이템 색상 구분성</li>
        <li>인쇄 디자인 → 브로셔, 포스터 최종 확인</li>
        <li>SNS 콘텐츠 → 모든 팔로워에게 잘 보이는지</li>
      </ul>

      <p className="mb-4">색상 하나하나 확인하는 건 번거롭다. 그냥 이미지 하나 올리면 색각 이상별로 필터 적용된 버전을 보여줬으면 했다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>색맹 시뮬레이터 앱 → 설치 필요, 무거움</li>
        <li>포토샵 Color Blind 플러그인 → 유료 또는 설정 복잡</li>
        <li>Chrome 개발자 도구 렌더링 시뮬레이션 → 웹 화면만 가능, 이미지 파일 직접 확인 불가</li>
        <li>온라인 도구 → 파일 서버 업로드 필요</li>
        <li>iOS 접근성 설정 → 기기 설정 바꿔야 하고 번거로움</li>
      </ul>

      <p className="mb-4">그냥 이미지 드래그해서 올리면 6가지 색각 이상 버전으로 바꿔서 나란히 보여주면 되잖아.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">이미지 전체를 시뮬레이션</h2>

      <p className="mb-3">Canvas API로 이미지 픽셀 단위로 색상 변환 행렬을 적용한다. 파일이 서버로 안 간다.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">시뮬레이션 종류:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>정상 시각 (원본)</li>
        <li>적색맹 (Protanopia) → 빨강 인식 없음</li>
        <li>녹색맹 (Deuteranopia) → 초록 인식 없음, 가장 흔함</li>
        <li>청황색맹 (Tritanopia) → 파랑/노랑 구분 어려움</li>
        <li>전색맹 (Achromatopsia) → 흑백으로만 보임</li>
        <li>적색약 (Protanomaly) → 약한 적색맹</li>
        <li>녹색약 (Deuteranomaly) → 약한 녹색맹, 남성에게 가장 흔함</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">보기 방식:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>그리드 뷰 → 원본 + 6가지 시뮬레이션 한 화면에 나란히</li>
        <li>슬라이더 비교 → 원본과 시뮬레이션 경계선 슬라이더로 비교</li>
        <li>각 시뮬레이션 이미지 다운로드 → 보고서에 첨부 가능</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">색맹 친화적 이미지 만드는 법</h2>

      <p className="mb-3">시뮬레이션해보고 문제가 있으면 이렇게 수정하면 된다.</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>빨강-초록 조합 → 파랑-주황 또는 파랑-노랑으로 대체</li>
        <li>텍스트와 배경 대비 → 색상 구분 외에 밝기 차이도 활용</li>
        <li>패턴/아이콘 추가 → 색상 외 시각적 단서 제공</li>
        <li>굵은 테두리 → 색상 구분이 어려워도 경계선으로 인식 가능</li>
        <li>라벨 직접 표시 → 차트에 색상 범례 외에 직접 값/이름 표시</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>이미지 전체 한눈에 비교 → 색상 하나하나 확인보다 훨씬 직관적</li>
        <li>7가지 시뮬레이션 동시 표시 → 어느 종류 색각 이상이 문제인지 파악</li>
        <li>슬라이더 비교 → 같은 위치에서 원본 vs 시뮬레이션 직접 비교</li>
        <li>파일 서버 업로드 없음 → 내부 디자인 파일도 안심</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>매우 큰 이미지는 처리 시간이 걸릴 수 있음</li>
        <li>시뮬레이션은 근사치 → 실제 색각 이상과 100% 동일하지 않음</li>
        <li>GIF 애니메이션은 첫 프레임만 처리</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>이미지 드래그 앤 드롭 또는 클릭해서 업로드</li>
        <li>7가지 시뮬레이션 결과 확인</li>
        <li>필요하면 개별 이미지 다운로드</li>
      </ol>

      <p className="mb-4">디자인 접근성 검토 체크리스트에 꼭 추가해두자.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/color-blindness-image" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 이미지 색맹 시뮬레이션 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">내 이미지가 모든 사람에게 잘 보이는지 확인.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #색맹시뮬레이션 #이미지접근성 #색각이상 #웹접근성 #디자인검토 #WCAG
      </p>
    </article>
  );
}
