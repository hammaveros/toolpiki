import Link from 'next/link';

export default function GradientGeneratorPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">색상 · 2026-07-17 · 5분 읽기</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        CSS 그라디언트 코드 외워서 치는 사람 없잖아요. 그냥 클릭으로 만들면 되는데
      </h1>

      <p className="mb-4">
        <Link href="/tools/gradient-generator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 CSS 그라디언트 생성기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        <code>background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);</code> — 이거 머릿속에서 나오는 사람이 몇이나 될까. 각도랑 색상 조합을 눈으로 보면서 잡아야지.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 필요한지</h2>

      <p className="mb-3">그라디언트가 필요한 순간들:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>히어로 섹션 배경 → 단색보다 그라디언트가 훨씬 세련돼 보임</li>
        <li>버튼 디자인 → 그라디언트 버튼은 flat 버튼보다 입체감 있음</li>
        <li>카드 배경 → 배경에 살짝 그라디언트 주면 깊이감이 생김</li>
        <li>텍스트 그라디언트 → <code>background-clip: text</code>로 텍스트에 그라디언트 적용</li>
        <li>오버레이 효과 → 이미지 위에 그라디언트 오버레이로 가독성 높이기</li>
        <li>로딩 스켈레톤 → shimmer 효과에 그라디언트 애니메이션 사용</li>
        <li>구분선/경계 효과 → 섹션 간 부드러운 전환에 radial gradient 사용</li>
      </ul>

      <p className="mb-4">근데 문제는 CSS gradient 코드가 직관적이지 않다는 거임. 각도 숫자로 방향 상상하기 힘들고, 색상 위치(color stop)도 퍼센트로 조절하면서 결과 예측이 안 됨.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">CSS gradient 문법이 왜 헷갈리냐면</h2>

      <p className="mb-3">간단히 보면:</p>

      <ul className="space-y-2 mb-4 text-gray-700 dark:text-gray-300">
        <li>
          <strong>linear-gradient</strong> — 직선 방향 그라디언트. 각도(0deg ~ 360deg) 또는 방향(to right, to bottom 등) 지정. 가장 많이 씀.
        </li>
        <li>
          <strong>radial-gradient</strong> — 중심에서 바깥으로 퍼지는 원형 그라디언트. 중심 위치 조절 가능.
        </li>
        <li>
          <strong>conic-gradient</strong> — 부채꼴 형태로 색상 회전. 파이 차트 느낌.
        </li>
        <li>
          <strong>color stop</strong> — 그라디언트에서 각 색상의 위치. <code>0%</code>는 시작, <code>100%</code>는 끝. 중간에 색상 추가 가능.
        </li>
      </ul>

      <p className="mb-3">문법 자체는 이해하면 되는데, 실제로 원하는 그라디언트 만들려면 각도랑 색상 위치를 숫자로 조정하면서 실시간으로 결과 확인이 돼야 함. 코드 에디터에서는 저장하고 브라우저 새로고침해야 보이거든.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>코드 직접 짜기 → 각도랑 색상 위치 수정할 때마다 저장 → 새로고침 반복</li>
        <li>브라우저 개발자 도구 → 실시간 편집은 되는데 여러 색상 추가/이동이 불편</li>
        <li>CSS Gradient 관련 사이트들 → 광고 많고 UI가 무거운 경우 많음</li>
        <li>피그마에서 만들기 → 그라디언트 만들기는 쉬운데 CSS 코드로 Export가 번거로움</li>
        <li>랜덤 그라디언트 사이트들 (uiGradients 등) → 미리 만들어진 것 중 고르는 거라 커스터마이즈가 안 됨</li>
      </ul>

      <p className="mb-4">시각적으로 조정하면서 코드가 바로 나오는 게 필요한데, 그게 제대로 된 게 없었음.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">시각적으로 조절하면 CSS 코드가 즉시 나오는 그라디언트 생성기:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>그라디언트 방향 — 슬라이더로 각도 조절, 미리보기 실시간 업데이트</li>
        <li>색상 추가/삭제 — 색상 포인트 자유롭게 추가, 드래그로 위치 이동</li>
        <li>linear / radial / conic 전환 — 탭 클릭으로 즉시 전환</li>
        <li>CSS 코드 자동 생성 — 조정하는 즉시 <code>background:</code> 코드 업데이트</li>
        <li>미리 정의된 그라디언트 모음 — 인기 그라디언트 바로 불러오기</li>
        <li>복사 버튼 — 클릭 한 번으로 CSS 코드 클립보드 복사</li>
      </ul>

      <p className="mb-4">코드 외울 필요 없음. 눈으로 보면서 슬라이더 조절하고 코드 복사하면 됨.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-3"><strong>좋은 점:</strong></p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>각도 슬라이더 조절하면서 결과 바로 확인 — 코드 짜면서 상상하던 거랑 다를 때 스트레스가 없어짐</li>
        <li>색상 포인트 여러 개 추가 가능 — 2색 이상 복잡한 그라디언트도 쉽게</li>
        <li>linear/radial 전환이 탭 클릭 하나 — 같은 색상 조합으로 두 타입 비교 가능</li>
        <li>미리 만들어진 그라디언트 — 감 잡기 힘들 때 시작점으로 씀</li>
        <li>코드가 표준 CSS라 그냥 복사해서 붙여넣으면 바로 동작</li>
      </ul>

      <p className="mb-3"><strong>한계:</strong></p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>그라디언트 저장 기능 없음 — 마음에 드는 거 코드 복사해서 따로 보관해야 함</li>
        <li>그라디언트 애니메이션 (CSS animation) 코드는 안 만들어줌</li>
        <li>mesh gradient는 지원 안 됨 — 요즘 유행하는 블롭형 그라디언트는 CSS로 구현이 복잡해서</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실용적인 팁</h2>

      <p className="mb-3">그라디언트 예쁘게 만드는 팁들:</p>

      <ul className="space-y-2 mb-4 text-gray-700 dark:text-gray-300">
        <li>
          <strong>색상 2개로 시작</strong> — 3색 이상 쓰면 탁해지기 쉬움. 2색 조합 먼저 잡고 필요하면 추가.
        </li>
        <li>
          <strong>유사색 조합</strong> — 보색보다 유사색 그라디언트가 더 자연스럽고 무난함. 파랑 → 보라, 분홍 → 오렌지 등.
        </li>
        <li>
          <strong>각도 135도</strong> — 대각선 방향 그라디언트가 제일 많이 쓰임. 일반적으로 세련돼 보임.
        </li>
        <li>
          <strong>채도 낮은 색상</strong> — 너무 쨍한 색보다 살짝 탁한 색 조합이 고급스러워 보임.
        </li>
        <li>
          <strong>텍스트 그라디언트</strong> — <code>-webkit-background-clip: text; -webkit-text-fill-color: transparent;</code> 조합으로 텍스트에 적용.
        </li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-2 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>그라디언트 타입 선택 — linear, radial, conic 중 하나</li>
        <li>시작 색상과 끝 색상 컬러 피커로 선택</li>
        <li>색상 추가 필요하면 <strong>+</strong> 버튼 클릭, 위치 드래그로 이동</li>
        <li>방향/각도 슬라이더 조절하면서 미리보기 확인</li>
        <li>원하는 그라디언트 나오면 CSS 코드 복사 버튼 클릭</li>
        <li>CSS 파일에 붙여넣기. 끝.</li>
      </ol>

      <p className="mb-4">브라우저 새로고침 안 해도 됨. 조절하면 바로 보임 ㅋㅋ</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/gradient-generator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 CSS 그라디언트 생성기 바로 가기
        </Link>
      </p>

      <p className="mb-4">히어로 섹션 배경이나 버튼에 그라디언트 넣고 싶은데 코드가 안 외워지는 거 당연한 거임. 그냥 도구 쓰면 됨. 각도 슬라이더 움직이는 재미도 있음 ㅋㅋ</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #CSS그라디언트 #linear-gradient #radial-gradient #그라디언트생성기 #CSS배경 #프론트엔드 #웹디자인 #CSS도구
      </p>
    </article>
  );
}
