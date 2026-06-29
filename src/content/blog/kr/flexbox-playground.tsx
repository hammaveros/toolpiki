import Link from 'next/link';

export default function FlexboxPlaygroundPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">포맷터 · 2026년 7월 18일 · 읽는 시간 5분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Flexbox 맨날 헷갈려서 직접 눌러보는 도구 만들었음
      </h1>

      <p className="mb-4">
        <Link href="/tools/flexbox-playground" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Flexbox 레이아웃 실험 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        justify-content: space-between이야, space-around야... 맨날 헷갈려서 결국 브라우저 열어서 직접 쳐보는 상황.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Flexbox, 외워도 맨날 헷갈리는 이유</h2>

      <p className="mb-3">
        솔직히 Flexbox 쓸 때마다 조금씩 헷갈린다. MDN 열어보는 것도 한두 번이지, 매번 속성 이름이랑 값이 정확히 뭐였는지 찾아보게 된다.
        특히 이런 것들:
      </p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><code>justify-content</code> vs <code>align-items</code> → 뭐가 가로 기준이고 세로 기준인지 헷갈림</li>
        <li><code>space-between</code> vs <code>space-around</code> vs <code>space-evenly</code> → 세 개 차이를 눈으로 보기 전까지는 감이 안 옴</li>
        <li><code>flex-wrap: wrap</code> → 실제로 넘칠 때 어떻게 되는지 직접 보기 전까진 상상이 잘 안 됨</li>
        <li><code>align-content</code> → 존재 자체를 자주 까먹음</li>
        <li><code>flex-grow / flex-shrink / flex-basis</code> → 이 세 개 조합은 진짜 글로 읽어선 이해가 안 됨</li>
      </ul>

      <p className="mb-4">
        공부할 때 이론으로 한 번 읽고 넘어가면 쓸 때 기억이 안 나는 게 당연하다. 이건 눈으로 봐야 하는 영역이다.
        그래서 코드 에디터 열고 직접 치면서 확인하는 루틴이 생기는데, 이게 또 귀찮거든ㅋㅋ
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법으로 배우면 생기는 불편함</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>MDN 문서 → 정적인 이미지 예제라 직접 값 바꿔볼 수가 없음</li>
        <li>CodePen에서 만들어서 테스트 → 처음부터 HTML/CSS 작성해야 해서 번거로움</li>
        <li>VSCode + 브라우저 → 파일 만들고, 서버 켜고, 코드 치고, 새로고침... 너무 단계가 많음</li>
        <li>유튜브 강의 → 보는 건 이해되는데 내가 직접 조작하는 게 아니라 기억이 안 남음</li>
        <li>치트시트 이미지 → 눈으로는 보이는데 실제로 어떻게 렌더링되는지 감이 다름</li>
      </ul>

      <p className="mb-4">
        결국 원하는 건 간단하다. 속성 값 바꾸면 즉시 레이아웃이 어떻게 변하는지 보고 싶은 것.
        근데 그게 딱 되는 도구가 잘 없더라. 있어도 영어고 광고 투성이거나, UI가 복잡해서 처음 접근하기 어렵거나.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 직접 만들었음</h2>

      <p className="mb-3">
        버튼 클릭 한 번으로 속성 값 바꾸면 레이아웃이 실시간으로 바뀐다. 코드 안 쳐도 된다.
        다룰 수 있는 속성들:
      </p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>flex-direction</strong> → row / row-reverse / column / column-reverse</li>
        <li><strong>justify-content</strong> → flex-start / center / flex-end / space-between / space-around / space-evenly</li>
        <li><strong>align-items</strong> → stretch / flex-start / center / flex-end / baseline</li>
        <li><strong>flex-wrap</strong> → nowrap / wrap / wrap-reverse</li>
        <li><strong>align-content</strong> → flex-start / center / flex-end / space-between / space-around / stretch</li>
        <li><strong>gap</strong> → 아이템 간격 슬라이더로 조절</li>
      </ul>

      <p className="mb-3">각 아이템별로도 조절 가능:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>flex-grow</strong> → 남은 공간 차지 비율</li>
        <li><strong>flex-shrink</strong> → 공간 부족할 때 줄어드는 비율</li>
        <li><strong>flex-basis</strong> → 기본 크기 설정</li>
        <li><strong>align-self</strong> → 개별 아이템 세로 정렬 오버라이드</li>
        <li><strong>order</strong> → 아이템 순서 변경</li>
      </ul>

      <p className="mb-3">추가 기능:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>아이템 추가/제거 버튼 → 아이템 수가 달라질 때 레이아웃 변화 확인</li>
        <li>아이템 크기 랜덤 → 불규칙한 크기일 때 어떻게 배치되는지 확인</li>
        <li>생성된 CSS 코드 자동 표시 → 확인 후 바로 복사 가능</li>
        <li>컨테이너 크기 조절 → 좁아지면 wrap이 어떻게 동작하는지 확인</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">도움됐던 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>space-between / space-around / space-evenly 차이를 드디어 눈으로 확실히 구분함 → 버튼 탁탁 눌러보니까 바로 이해됨</li>
        <li>align-items랑 align-content 차이도 wrap 켜놓고 비교하니까 명확해짐</li>
        <li>flex-grow 0/1/2 설정하면 비율이 어떻게 나뉘는지 직접 보니까 이제 자신 있게 씀</li>
        <li>CSS 코드 복사 기능 → 실험한 값 그대로 프로젝트에 붙여넣기 가능</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Grid 레이아웃은 별도 도구가 필요함 → Flexbox 전용임</li>
        <li>애니메이션 전환 효과가 없어서 변화를 놓칠 때가 가끔 있음</li>
        <li>실제 프로젝트 복잡한 케이스를 완전히 재현하긴 어려움</li>
      </ul>

      <p className="mb-4">
        그래도 Flexbox 빠르게 체크하거나 처음 배울 때 쓰기엔 딱 좋다.
        MDN 이론 읽기 전에 이걸 먼저 5분만 눌러봐도 개념이 훨씬 빨리 잡힌다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">이럴 때 특히 유용함</h2>

      <p className="mb-3">이런 상황에서 열어두면 바로 해결된다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>레이아웃 짜다가 아이템이 예상이랑 다르게 배치될 때 → 어떤 속성이 문제인지 빠르게 테스트</li>
        <li>신입 개발자한테 Flexbox 설명할 때 → 코드 치는 것보다 이걸 켜놓고 눌러가며 설명하면 훨씬 빠름</li>
        <li>CSS 배우는 중인데 시각적으로 이해하고 싶을 때 → 처음 접근하기 좋음</li>
        <li>오랜만에 Flexbox 쓰는데 속성이 가물가물할 때 → 기억 리프레시용</li>
        <li>코드 리뷰 전 정확한 속성값 확인할 때 → 틀린 값 쓰는 실수 방지</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-2 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>페이지 열면 기본 Flexbox 컨테이너와 아이템 3~5개가 나옴</li>
        <li>왼쪽 패널에서 컨테이너 속성 버튼 눌러서 값 변경</li>
        <li>오른쪽 미리보기에서 실시간으로 레이아웃 변화 확인</li>
        <li>아이템 선택해서 개별 속성(flex-grow, order 등) 조절 가능</li>
        <li>아이템 추가/제거 버튼으로 개수 바꿔가며 테스트</li>
        <li>마음에 드는 설정 나오면 "CSS 복사" 버튼으로 코드 가져가기</li>
      </ol>

      <p className="mb-4">브라우저만 있으면 된다. 설치 없음, 회원가입 없음.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/flexbox-playground" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Flexbox 레이아웃 실험 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">
        Flexbox 다시 볼 일 있으면 MDN 대신 이거 먼저 열어봐. 5분이면 개념 다 잡힌다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #Flexbox #CSS레이아웃 #CSS학습 #웹개발 #프론트엔드 #CSS도구
      </p>
    </article>
  );
}
