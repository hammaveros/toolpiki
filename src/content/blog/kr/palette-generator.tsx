import Link from 'next/link';

export default function PaletteGeneratorPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">색상 · 2026-07-16 · 5분 읽기</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        색상 하나 골랐는데 어울리는 색 찾느라 1시간 날린 경험 있으면 이거 써봐
      </h1>

      <p className="mb-4">
        <Link href="/tools/palette-generator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 색상 팔레트 자동 생성 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        메인 컬러 하나 정했는데 버튼 색, 배경 색, 강조 색 뭘 써야 할지 감이 안 잡힘. 색채론 공부할 시간은 없고.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 필요한지</h2>

      <p className="mb-3">색상 팔레트가 막히는 상황들:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>새 프로젝트 시작 → 브랜드 컬러 정했는데 나머지 UI 색상이 안 잡힘</li>
        <li>개발자가 혼자 UI 만들 때 → 디자이너 없는데 색 조합이 고민됨</li>
        <li>사이드 프로젝트 → 브랜딩 할 시간/예산 없는데 그럭저럭 예쁘게 만들고 싶음</li>
        <li>피그마에서 컴포넌트 디자인 → primary 색상은 있는데 hover, focus, disabled 상태 색상이 애매함</li>
        <li>다크모드 색상 → 라이트 팔레트는 있는데 다크 버전 만들기 막막함</li>
        <li>발표 자료 / 인포그래픽 → 슬라이드 색상 통일감 있게 맞추고 싶을 때</li>
        <li>Tailwind 커스텀 색상 → primary-100 ~ primary-900 단계 색상 만들어야 할 때</li>
      </ul>

      <p className="mb-4">색채론 기초만 알면 스스로 할 수 있는데, 그 기초를 모르거나 매번 적용하기 귀찮을 때 도구가 필요함.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">배색 이론이 뭔지 간단히 설명</h2>

      <p className="mb-3">색상환(color wheel)에서 색들 사이의 관계로 팔레트를 만드는 방식임:</p>

      <ul className="space-y-2 mb-4 text-gray-700 dark:text-gray-300">
        <li>
          <strong>보색 (Complementary)</strong> — 색상환에서 정반대에 있는 색. 강한 대비. 예: 파랑 + 주황. 임팩트 있는 CTA 버튼에 씀.
        </li>
        <li>
          <strong>유사색 (Analogous)</strong> — 색상환에서 이웃한 색들. 자연스럽고 부드러운 느낌. 배경/섹션 구분에 씀.
        </li>
        <li>
          <strong>삼각형 배색 (Triadic)</strong> — 색상환에서 120도 간격 세 색. 다양하면서도 균형 있음. 다채로운 UI에 씀.
        </li>
        <li>
          <strong>분할 보색 (Split-complementary)</strong> — 보색 대신 보색 양옆 두 색. 보색보다 부드럽고 다루기 쉬움.
        </li>
        <li>
          <strong>사각형 배색 (Tetradic/Square)</strong> — 색상환에서 90도 간격 네 색. 풍부한 팔레트, 조율이 필요함.
        </li>
        <li>
          <strong>단색 배색 (Monochromatic)</strong> — 같은 색조에 채도/명도만 변화. 세련되고 통일감 있음. 미니멀 디자인에 좋음.
        </li>
      </ul>

      <p className="mb-4">이 법칙들 직접 계산하려면 HSL 색상값 알고, 각도 계산하고… 귀찮음. 그냥 도구에 넣으면 나오는 게 낫지.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Adobe Color (color.adobe.com) → 좋긴 한데 어도비 계정 필요, UI가 좀 무거움</li>
        <li>Coolors.co → 랜덤 생성은 좋은데 내 색상 기반으로 만들기가 직관적이지 않음</li>
        <li>Paletton → 기능은 많은데 처음엔 UI 파악이 힘듦</li>
        <li>직접 만들기 → HSL 공식 알아야 하고, 색상환 이해해야 하고, 결과물 확인도 눈으로 해야 함</li>
        <li>AI한테 물어보기 → GPT가 색상 조합 추천해주긴 하는데, 코드 형식으로 바로 안 나오고 시각적 확인이 안 됨</li>
      </ul>

      <p className="mb-4">한 번에 "입력 → 팔레트 시각화 → 코드 복사"까지 깔끔하게 되는 게 없었음.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">베이스 컬러 하나 넣으면 배색 이론 기반 팔레트를 즉시 생성해주는 도구:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>HEX/RGB 입력 또는 컬러 피커로 색상 선택</li>
        <li>배색 방식 선택: 보색 / 유사색 / 삼각형 / 분할보색 / 단색 / 사각형</li>
        <li>생성된 팔레트 컬러 스와치로 즉시 시각화</li>
        <li>각 색상 HEX, RGB, HSL 동시 표시</li>
        <li>팔레트 전체 복사 → 코드에 바로 사용 가능</li>
        <li>명도/채도 변형 팔레트 → Tailwind 100~900 단계 색상 자동 생성</li>
      </ul>

      <p className="mb-4">색채론 몰라도 됨. 배색 방식 골라보면서 "오 이거 괜찮다" 싶은 거 고르면 됨.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-3"><strong>좋은 점:</strong></p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>배색 이론 몰라도 됨 — 옵션 골라가면서 결과 보면 됨</li>
        <li>Tailwind 단계 색상 자동 생성이 진짜 유용함 — primary-100부터 primary-900까지 한 번에</li>
        <li>실시간 미리보기라 선택하면 바로 바뀜 — 여러 배색 빠르게 비교 가능</li>
        <li>HEX/RGB/HSL 동시 표시 — 원하는 형식 바로 복사 가능</li>
        <li>로그인 없음. 그냥 들어가서 바로 씀.</li>
      </ul>

      <p className="mb-3"><strong>한계:</strong></p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>팔레트 저장 기능은 없음 — 결과 복사해서 따로 저장해둬야 함</li>
        <li>접근성(Contrast Ratio) 검사는 별도로 해야 함 — 색상 조합이 WCAG 기준 통과하는지 확인 필요</li>
        <li>배색이 수학적으로 맞아도 실제로 예쁜지는 직접 눈으로 판단해야 함</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제 활용 예시</h2>

      <p className="mb-3">이런 식으로 써봤음:</p>

      <ul className="space-y-2 mb-4 text-gray-700 dark:text-gray-300">
        <li>
          <strong>사이드 프로젝트 브랜딩</strong> — 메인 컬러 #3B82F6(파랑) 넣고 삼각형 배색 선택 → 버튼은 보색, 배경은 유사색으로 구성 완료. 30분 걸리던 거 5분만에.
        </li>
        <li>
          <strong>Tailwind 커스텀 팔레트</strong> — 브랜드 컬러 넣고 단색(Monochromatic) 선택 → primary-100~900 자동 생성 → tailwind.config에 그대로 복사.
        </li>
        <li>
          <strong>발표 자료</strong> — 강조색 하나 정하고 유사색 팔레트 → 슬라이드 색상 체계 잡는 데 씀.
        </li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-2 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>메인 컬러 입력 — HEX 코드 직접 입력하거나 컬러 피커로 선택</li>
        <li>배색 방식 선택 — 보색, 유사색, 삼각형 등 옵션 중 하나 클릭</li>
        <li>팔레트 미리보기 확인 — 색상 스와치로 조합 시각적으로 체크</li>
        <li>맘에 드는 색상 HEX/RGB/HSL 복사</li>
        <li>전체 팔레트 복사가 필요하면 "전체 복사" 버튼 클릭</li>
        <li>Tailwind 단계 팔레트 필요하면 "단계 팔레트 생성" 옵션 선택</li>
      </ol>

      <p className="mb-4">배색 방식 여러 개 눌러보면서 "이거다" 싶은 거 고르면 됨. 어렵지 않음.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/palette-generator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 색상 팔레트 자동 생성 바로 가기
        </Link>
      </p>

      <p className="mb-4">메인 컬러 정했는데 나머지 색상 어떻게 구성할지 막막하면 써봐. 배색 이론 몰라도 됨 ㅋㅋ 그냥 클릭해보면 금방 감 잡힘.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #색상팔레트 #배색이론 #컬러팔레트 #디자인시스템 #Tailwind색상 #브랜드컬러 #보색 #유사색 #프론트엔드
      </p>
    </article>
  );
}
