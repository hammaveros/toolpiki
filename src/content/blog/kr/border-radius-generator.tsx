import Link from 'next/link';

export default function BorderRadiusGeneratorPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">CSS 도구 · 2026-07-17 · 4분 읽기</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        border-radius 4개 모서리 따로 설정하면서 숫자 맞추는 거 너무 귀찮아서 만든 도구
      </h1>

      <p className="mb-4">
        <Link href="/tools/border-radius-generator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 CSS border-radius 시각적 생성기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        <code>border-radius: 20px 10px 30px 5px / 15px 5px 20px 10px;</code> — 이 코드가 어떤 모양인지 머릿속에 그려지는 사람? 솔직히 저장하고 새로고침 해봐야 앎.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 필요한지</h2>

      <p className="mb-3">border-radius 작업이 생각보다 자주 나옴:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>카드 컴포넌트 디자인 → 모서리 둥글기를 얼마나 줄지 눈으로 보면서 결정하고 싶음</li>
        <li>버튼 스타일링 → 알약형(pill) 버튼, 살짝 둥근 버튼, 완전 사각 버튼 빠르게 비교</li>
        <li>아바타/이미지 → 원형, 둥근 사각, 특정 모서리만 둥글게</li>
        <li>모달/팝업 → 상단 모서리만 둥글게 또는 특정 방향만</li>
        <li>말풍선 UI → 한쪽 모서리만 날카롭게 해서 말풍선 꼬리 느낌 내기</li>
        <li>CSS 아트/일러스트 → border-radius만으로 유기적인 blob 모양 만들기</li>
        <li>디자인 시스템 토큰 → 프로젝트 전반에 쓸 radius 값 체계 잡기</li>
      </ul>

      <p className="mb-4">4개 모서리를 독립적으로 조절하는 건 피그마에서도 쉬운데, 그 결과를 CSS 코드로 옮기는 과정이 매번 숫자 맞추기 게임이 됨.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">border-radius 문법이 왜 헷갈리냐면</h2>

      <p className="mb-3">기본은 알아도 심화로 가면 복잡해짐:</p>

      <ul className="space-y-2 mb-4 text-gray-700 dark:text-gray-300">
        <li>
          <strong>단축 표기 1개 값</strong> — <code>border-radius: 8px;</code> → 4모서리 동일. 이건 다들 앎.
        </li>
        <li>
          <strong>단축 표기 4개 값</strong> — <code>border-radius: TL TR BR BL;</code> (시계방향 순서). 순서 헷갈리면 항상 찾아봄.
        </li>
        <li>
          <strong>개별 속성</strong> — <code>border-top-left-radius</code>, <code>border-top-right-radius</code> 등 4개 따로. 특정 모서리만 바꿀 때.
        </li>
        <li>
          <strong>타원형 모서리</strong> — <code>border-radius: Xpx Xpx / Ypx Ypx;</code> — 슬래시(/) 앞이 수평, 뒤가 수직. 이건 진짜 헷갈림.
        </li>
        <li>
          <strong>퍼센트 값</strong> — <code>border-radius: 50%;</code>는 원형. 퍼센트는 요소 크기 기준이라 동적 크기 요소에서 유용.
        </li>
      </ul>

      <p className="mb-4">타원형 모서리 부분은 시각적으로 안 보이면 숫자만 가지고 뭐가 어떻게 될지 예측이 안 됨.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>코드 직접 수정 → 저장, 브라우저 새로고침, 확인, 다시 수정 반복</li>
        <li>브라우저 개발자 도구 → 실시간 편집은 되는데 4개 모서리 따로 보면서 조절하기 불편</li>
        <li>피그마에서 먼저 잡기 → 디자인은 쉬운데 CSS 값으로 옮길 때 수동으로 계산</li>
        <li>MDN 예제 참고 → 예제 코드 있는데 내 사이즈/색상에 맞춰 조절하는 게 번거로움</li>
      </ul>

      <p className="mb-4">"슬라이더 조절하면서 실시간으로 보고 코드 바로 복사" — 이게 안 되는 게 이상한 거임.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">슬라이더로 조절하면서 실시간 미리보기 + CSS 코드 즉시 복사:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>4개 모서리(TL, TR, BR, BL) 각각 독립 슬라이더</li>
        <li>전체 동시 조절 옵션 — "링크" 체크하면 4개 같이 움직임</li>
        <li>수평/수직 타원 반경 별도 조절 — <code>border-radius: X / Y</code> 타원형 모서리도 시각적으로</li>
        <li>미리보기 박스 실시간 업데이트 — 슬라이더 움직이면 바로 반영</li>
        <li>단축 표기 / 개별 표기 모두 코드 생성 — 필요한 형식으로 복사</li>
        <li>px / % / rem 단위 선택 가능</li>
        <li>자주 쓰는 프리셋 — 알약형, 원형, 카드형 등 바로 불러오기</li>
      </ul>

      <p className="mb-4">타원형 모서리까지 시각적으로 조절되는 게 진짜 핵심임. 그 슬래시(/) 문법 써본 사람은 알겠지만 눈으로 안 보면 답이 없음.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-3"><strong>좋은 점:</strong></p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>슬라이더 조절하면서 바로 확인 — 브라우저 새로고침 없이</li>
        <li>타원형 모서리도 시각적으로 가능 — 이게 없는 도구가 많아서 이 부분이 진짜 유용했음</li>
        <li>프리셋 덕분에 빠른 시작 — "카드형 정도로" 하면 그냥 카드형 프리셋 선택 후 미세 조정</li>
        <li>단축 표기 / 개별 표기 둘 다 제공 — 레거시 코드에서 개별 표기 쓰는 곳이 있어서 둘 다 필요함</li>
        <li>px/rem 전환 — 반응형 작업에서 rem 단위 필요할 때 바로 전환</li>
      </ul>

      <p className="mb-3"><strong>한계:</strong></p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>미리보기 박스 크기가 고정 — 실제 내 컴포넌트 비율로 보고 싶을 때는 직접 적용해봐야 함</li>
        <li>Tailwind 클래스 형식으로는 안 나옴 — Tailwind 쓰면 CSS 값 확인 후 대응 클래스 직접 찾아야 함</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">활용 팁</h2>

      <p className="mb-3">이런 식으로 쓰면 효율적임:</p>

      <ul className="space-y-2 mb-4 text-gray-700 dark:text-gray-300">
        <li>
          <strong>디자인 시스템 radius 토큰</strong> — sm(4px), md(8px), lg(16px), full(9999px) 같은 단계 잡을 때 각 값 미리보기 확인 후 결정
        </li>
        <li>
          <strong>blob 모양 만들기</strong> — 타원형 모서리 기능으로 4개 모서리를 비대칭으로 조절하면 유기적인 blob 모양 가능. CSS 아트에서 많이 씀.
        </li>
        <li>
          <strong>말풍선 꼬리</strong> — 특정 모서리 하나만 0으로 줄이면 말풍선처럼 보임. 4개 중 하나 0 설정.
        </li>
        <li>
          <strong>이미지 프레임</strong> — 사각 이미지를 원형으로 만들 때 50% 프리셋 바로 적용 후 코드 복사
        </li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-2 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>미리보기 박스 왼쪽의 슬라이더 4개 조절 — TL(왼위), TR(오위), BR(오아), BL(왼아)</li>
        <li>4개 동시 조절 원하면 "링크" 토글 켜기</li>
        <li>타원형 모서리 원하면 수평/수직 반경 별도 슬라이더 조절</li>
        <li>단위 선택 (px / % / rem)</li>
        <li>CSS 코드 확인 후 복사 버튼 클릭</li>
        <li>코드에 붙여넣기. 끝.</li>
      </ol>

      <p className="mb-4">프리셋 있으니까 먼저 프리셋 골라보고 미세 조정하는 게 제일 빠름.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/border-radius-generator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 CSS border-radius 시각적 생성기 바로 가기
        </Link>
      </p>

      <p className="mb-4">4개 모서리 따로 조절해야 하는 상황 생기면 써봐. 타원형 모서리 기능으로 blob 모양 만들어보는 것도 재밌음 ㅋㅋ</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #border-radius #CSS도구 #웹개발 #프론트엔드 #CSS생성기 #UI디자인 #카드UI #버튼스타일링
      </p>
    </article>
  );
}
