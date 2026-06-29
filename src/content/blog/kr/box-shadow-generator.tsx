import Link from 'next/link';

export default function BoxShadowGeneratorPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">CSS 도구 · 2026-07-18 · 5분 읽기</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        box-shadow 값 조합하다 결국 눈으로 보면서 맞추게 되는데, 그거 도구로 만들었음
      </h1>

      <p className="mb-4">
        <Link href="/tools/box-shadow-generator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 CSS box-shadow 시각적 생성기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        <code>box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);</code> — 이게 Tailwind <code>shadow-md</code>인데, 외우는 사람 없잖아. 그냥 눈으로 조절하면 되는데.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 필요한지</h2>

      <p className="mb-3">box-shadow 때문에 막히는 순간들:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>카드 컴포넌트 → 그림자 얼마나 줄지, 얼마나 부드럽게 할지 매번 감으로 짜고 있음</li>
        <li>버튼 hover 효과 → 호버 시 그림자 강도 올리는 트랜지션 효과 만들 때</li>
        <li>모달/드롭다운 → 배경에서 떠있는 느낌 주는 그림자 조절</li>
        <li>디자인 시스템 → sm / md / lg / xl 그림자 단계 체계 잡을 때</li>
        <li>그림자 색상 — 검정 외에 색상 그림자 쓸 때 값 맞추기 어려움</li>
        <li>inset 그림자 → 눌린 느낌, 안쪽 그림자 효과 만들 때</li>
        <li>여러 레이어 그림자 → 실제감 있는 그림자는 보통 2~3개 레이어 조합임</li>
      </ul>

      <p className="mb-4">box-shadow는 파라미터가 5개나 됨 (offset-x, offset-y, blur-radius, spread-radius, color). 이걸 숫자로 맞추면서 저장/새로고침 반복하는 건 진짜 비효율임.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">box-shadow 파라미터 정리</h2>

      <p className="mb-3">모르는 사람 있을까봐 짧게:</p>

      <ul className="space-y-2 mb-4 text-gray-700 dark:text-gray-300">
        <li>
          <strong>offset-x</strong> — 그림자 가로 이동. 양수는 오른쪽, 음수는 왼쪽. <code>0</code>이면 중앙.
        </li>
        <li>
          <strong>offset-y</strong> — 그림자 세로 이동. 양수는 아래, 음수는 위. 자연광 방향으로 양수 많이 씀.
        </li>
        <li>
          <strong>blur-radius</strong> — 블러 강도. 클수록 흐릿하고 부드러운 그림자. <code>0</code>이면 날카로운 그림자.
        </li>
        <li>
          <strong>spread-radius</strong> — 그림자 확장/축소. 양수는 확장(더 넓게), 음수는 축소. 기본값은 <code>0</code>.
        </li>
        <li>
          <strong>color</strong> — 그림자 색상. <code>rgba()</code>로 불투명도 조절 가능. 검정이 기본이지만 색상 그림자도 가능.
        </li>
        <li>
          <strong>inset</strong> — 키워드 추가하면 바깥이 아닌 안쪽 그림자. 눌린 효과에 씀.
        </li>
      </ul>

      <p className="mb-3"><strong>여러 그림자 레이어</strong> — 쉼표(,)로 여러 개 조합 가능. 실제감 있는 그림자는 보통 레이어 2개 이상:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>첫 번째 레이어: 강한 그림자 (짧은 offset, 작은 blur)</li>
        <li>두 번째 레이어: 부드러운 그림자 (큰 offset, 큰 blur, 낮은 opacity)</li>
      </ul>

      <p className="mb-4">이 조합을 눈으로 안 보고 숫자만 가지고 맞추는 건 진짜 어려움.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>코드 에디터에서 값 수정 → 저장 → 브라우저 새로고침 → 확인 → 반복. 한 번에 안 잡히면 10번도 함.</li>
        <li>브라우저 개발자 도구 → 실시간 편집은 되는데 5개 파라미터 + 여러 레이어 조합이 불편</li>
        <li>Tailwind 그림자 클래스 그냥 씀 → <code>shadow</code>, <code>shadow-md</code>, <code>shadow-lg</code> 중 고르는데, 딱 원하는 게 없을 때 막힘</li>
        <li>디자이너한테 받은 그림자 스펙 → 피그마에서 그림자 값 뽑아서 CSS로 변환하는 과정 번거로움</li>
        <li>구글 "css box shadow examples" → 예쁜 예제 모음은 있는데 내 색상/크기에 맞게 조절이 안 됨</li>
      </ul>

      <p className="mb-4">실시간으로 보면서 조절하고 코드 바로 복사하는 게 필요한데, 이게 제대로 된 게 없었음.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">슬라이더로 실시간 조절 + CSS 코드 즉시 복사 + 여러 레이어 지원:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>offset-x, offset-y, blur, spread 슬라이더 — 조절하면 미리보기 즉시 반영</li>
        <li>그림자 색상 컬러 피커 — rgba 불투명도 별도 슬라이더</li>
        <li>inset 토글 — 체크 하나로 바깥/안쪽 그림자 전환</li>
        <li>레이어 추가 — 여러 그림자 레이어 쌓기 가능</li>
        <li>각 레이어 별도 설정 — 레이어마다 독립 파라미터</li>
        <li>CSS 코드 자동 생성 — 레이어 여러 개여도 하나의 <code>box-shadow</code> 값으로 합쳐서</li>
        <li>자주 쓰는 프리셋 — 카드 그림자, 버튼 그림자, 깊은 그림자, 색상 그림자 등</li>
      </ul>

      <p className="mb-4">특히 레이어 여러 개 조합이 시각적으로 되는 게 핵심임. 피그마에서 그림자 2개 레이어 쌓는 거랑 같은 방식으로 작업 가능.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-3"><strong>좋은 점:</strong></p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>슬라이더 조절이 직관적 — offset-y 올리면 그림자가 아래로 내려가는 게 바로 보임</li>
        <li>레이어 2개 조합이 시각적으로 됨 — 실제감 있는 그림자 만들 때 진짜 유용</li>
        <li>색상 그림자 만들기 쉬움 — 컬러 피커로 색상 바꾸면서 농도 조절</li>
        <li>프리셋으로 시작점 잡기 좋음 — Tailwind shadow-md 급 그림자 프리셋 불러와서 미세 조정</li>
        <li>inset 그림자도 됨 — 눌린 버튼 효과, 텍스트 인풋 inner shadow 등</li>
      </ul>

      <p className="mb-3"><strong>한계:</strong></p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>미리보기 요소가 고정 크기 정사각형 — 실제 내 컴포넌트에 적용했을 때 느낌이 다를 수 있음</li>
        <li>Tailwind 클래스 자동 매핑 안 됨 — CSS 코드는 나오는데 <code>shadow-lg</code>가 이거랑 같다는 건 직접 확인해야</li>
        <li>drop-shadow 필터 버전(<code>filter: drop-shadow()</code>)은 별도임 — SVG나 PNG에 적용할 때는 다른 속성</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그림자 예쁘게 만드는 팁</h2>

      <p className="mb-3">경험상 이렇게 하면 대체로 좋게 나옴:</p>

      <ul className="space-y-2 mb-4 text-gray-700 dark:text-gray-300">
        <li>
          <strong>opacity 낮게</strong> — 그림자 색 rgba의 alpha 값을 0.1~0.2로 낮게. 진한 그림자는 촌스럽게 보임.
        </li>
        <li>
          <strong>레이어 2개 조합</strong> — 가까운 그림자 (blur 작게, opacity 낮게) + 먼 그림자 (blur 크게, opacity 더 낮게). 이게 자연스러운 느낌.
        </li>
        <li>
          <strong>offset-y 양수</strong> — 자연광은 위에서 내리쬐니까 그림자는 아래로. offset-y 양수값이 자연스러움.
        </li>
        <li>
          <strong>색상 그림자</strong> — 파란 카드면 파란 그림자, 빨간 버튼이면 빨간 그림자. 채도 있는 그림자가 요즘 트렌드.
        </li>
        <li>
          <strong>hover 시 그림자 강화</strong> — 평상시 shadow-md + hover 시 shadow-lg 패턴. 카드 호버 효과에 자주 씀.
        </li>
        <li>
          <strong>spread 음수</strong> — blur랑 spread를 같이 쓸 때 spread 음수로 주면 더 자연스럽게 줄어드는 느낌.
        </li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">피그마에서 CSS로 옮기는 법</h2>

      <p className="mb-3">피그마 그림자 설정과 CSS 파라미터 대응:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>피그마 X → CSS offset-x (같은 값)</li>
        <li>피그마 Y → CSS offset-y (같은 값)</li>
        <li>피그마 Blur → CSS blur-radius (같은 값)</li>
        <li>피그마 Spread → CSS spread-radius (같은 값)</li>
        <li>피그마 색상 + Opacity → CSS rgba(R, G, B, opacity/100)</li>
        <li>피그마 Inner Shadow → CSS inset 추가</li>
      </ul>

      <p className="mb-4">1:1 대응이라 피그마 값 그대로 도구에 넣으면 됨. 도구에서 미리보기 확인 후 CSS 코드 복사.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-2 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>먼저 프리셋 골라보기 — "카드 그림자" 등 기본 프리셋으로 시작점 잡기</li>
        <li>offset-x, offset-y 슬라이더 조절 — 그림자 방향 잡기</li>
        <li>blur 슬라이더 조절 — 흐릿한 정도 조절</li>
        <li>spread 슬라이더 조절 — 그림자 크기 조절</li>
        <li>컬러 피커로 색상 변경, alpha 슬라이더로 농도 조절</li>
        <li>레이어 추가가 필요하면 <strong>+ 레이어</strong> 버튼 클릭</li>
        <li>CSS 코드 복사 버튼 클릭 → 붙여넣기. 끝.</li>
      </ol>

      <p className="mb-4">처음엔 프리셋 눌러보는 것만으로도 box-shadow 감 잡히는 거 느낄 수 있음 ㅋㅋ</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/box-shadow-generator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 CSS box-shadow 시각적 생성기 바로 가기
        </Link>
      </p>

      <p className="mb-4">카드나 버튼 그림자 조절할 때 저장/새로고침 반복하는 거 이제 안 해도 됨. 슬라이더 움직이면 바로 보이니까. 색상 그림자 만들어보는 것도 재밌음 ㅋㅋ</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #box-shadow #CSS도구 #그림자효과 #웹개발 #프론트엔드 #CSS생성기 #UI디자인 #카드디자인 #버튼효과
      </p>
    </article>
  );
}
