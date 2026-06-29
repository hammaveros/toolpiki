import Link from 'next/link';

export default function MarkdownPreviewPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">텍스트 · 2026년 6월 21일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        마크다운 미리보기, README 쓸 때마다 커밋하고 확인하는 거 너무 귀찮아서
      </h1>

      <p className="mb-4">
        <Link href="/tools/markdown-preview" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 마크다운 미리보기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        README.md 수정할 때마다 푸시하고 깃허브에서 확인하는 루프를 반복하고 있었다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">마크다운 미리보기가 필요한 상황</h2>

      <p className="mb-3">생각보다 많다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>깃허브 README 작성 → 커밋하기 전에 어떻게 보일지 확인하고 싶을 때</li>
        <li>노션 대신 마크다운으로 메모할 때 → 실제 렌더링 보면서 작성</li>
        <li>기술 블로그 글 작성 → 마크다운 지원 블로그(velog, tistory 등)에 올리기 전 확인</li>
        <li>개발 문서 작성 → Confluence나 Jira 문서를 마크다운으로 미리 잡을 때</li>
        <li>슬랙/디스코드 메시지 → 마크다운 일부 지원하는 채널에서 미리 확인</li>
        <li>이력서 마크다운으로 쓸 때 → PDF 변환 전 레이아웃 확인</li>
        <li>마크다운 처음 배울 때 → 문법 연습하면서 바로 결과 보기</li>
      </ul>

      <p className="mb-4">
        마크다운은 개발자뿐 아니라 요즘 글 쓰는 사람들이면 한 번쯤 접하게 된다.
        노션이 마크다운 문법을 일부 지원하고, 깃허브 이슈나 PR도 마크다운으로 작성한다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">마크다운이 뭔지 간단히</h2>

      <p className="mb-3">
        마크다운(Markdown)은 텍스트를 HTML로 변환하는 경량 마크업 언어다.
        # 기호로 제목, **텍스트**로 볼드, - 로 리스트 같은 식으로 서식을 지정한다.
        HTML보다 훨씬 간단해서 빠르게 구조화된 문서를 작성할 수 있다.
      </p>

      <p className="mb-3">자주 쓰는 문법들:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li># 제목 → H1~H6 제목 크기</li>
        <li>**텍스트** → 볼드(굵게)</li>
        <li>*텍스트* → 이탤릭(기울임)</li>
        <li>- 항목 → 순서 없는 리스트</li>
        <li>1. 항목 → 순서 있는 리스트</li>
        <li>[링크명](URL) → 하이퍼링크</li>
        <li>![대체텍스트](이미지URL) → 이미지</li>
        <li>```코드``` → 코드 블록</li>
        <li>&gt; 텍스트 → 인용문</li>
        <li>--- → 구분선</li>
      </ul>

      <p className="mb-4">
        문법 자체는 10분이면 기본은 배울 수 있다.
        근데 실제로 어떻게 렌더링되는지는 써봐야 안다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>VS Code 마크다운 미리보기 → 에디터 열려 있어야 하고, 깃허브 스타일이랑 100% 똑같지 않음</li>
        <li>깃허브에 직접 푸시 → 확인하려고 커밋하는 게 말이 안 됨</li>
        <li>깃허브 온라인 에디터 → 저장소 있어야 하고 번거로움</li>
        <li>노션에 붙여넣기 → 마크다운 부분 지원이라 완전하지 않음</li>
        <li>인텔리J/WebStorm 플러그인 → 설치 필요, 가벼운 작업에 IDE 열기 귀찮음</li>
      </ul>

      <p className="mb-3">
        README 하나 수정하면서 커밋 5개 쌓인 적도 있다. "제목 크기 조정", "줄바꿈 수정" 이런 식으로.
        그게 싫어서 그냥 브라우저에서 바로 확인할 수 있는 걸 찾게 됐다.
      </p>

      <p className="mb-4">
        온라인 마크다운 에디터가 없는 건 아닌데, 광고 많거나 무거운 에디터 기능까지 딸려오는 경우가 많다.
        그냥 왼쪽에 쓰고 오른쪽에서 확인하는 단순한 게 필요했다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">왼쪽에 마크다운 쓰면 오른쪽에서 바로 렌더링 결과 나온다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>실시간 미리보기 → 타이핑하면서 바로 확인</li>
        <li>깃허브 스타일 렌더링 → README 쓸 때 실제 결과와 거의 동일</li>
        <li>코드 블록 문법 하이라이팅 → 언어 지정하면 색상 표시</li>
        <li>테이블 렌더링 → 마크다운 표 제대로 보임</li>
        <li>전체화면 모드 → 미리보기만 크게 보기 가능</li>
        <li>복사 버튼 → 작성한 마크다운 바로 복사</li>
      </ul>

      <p className="mb-3">추가 기능들:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>다크모드 지원 → 배경색 따라 미리보기도 전환</li>
        <li>샘플 템플릿 → 자주 쓰는 README 구조 바로 불러오기</li>
        <li>글자수 카운트 → 마크다운 원문 기준</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>타이핑 즉시 미리보기 → 저장 버튼도 없음, 그냥 바로 보임</li>
        <li>깃허브랑 비슷한 스타일 → README 쓰는데 실제 결과랑 거의 일치</li>
        <li>코드 블록 하이라이팅 → 언어명 쓰면 색상 자동 적용</li>
        <li>브라우저에서 바로 → VS Code 안 열어도 됨</li>
        <li>로컬에서 처리 → 내용이 서버로 안 감</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>자동 저장 없음 → 창 닫으면 내용 사라짐</li>
        <li>깃허브 고유 기능 → 체크박스(- [ ]) 같은 일부 GFM 기능은 다를 수 있음</li>
        <li>이미지 첨부 → URL로만 가능, 드래그앤드롭 업로드는 안 됨</li>
      </ul>

      <p className="mb-4">
        자동 저장이 없어서 긴 문서 작성할 때는 중간중간 메모장에 백업해두는 게 좋다.
        그래도 README 확인용이나 문법 연습용으로는 충분하다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">마크다운 처음 배울 때 활용법</h2>

      <p className="mb-3">마크다운 처음 접하는 경우라면 이렇게 써보면 좋다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>왼쪽에 문법 입력 → 오른쪽에서 바로 확인 → 틀리면 수정</li>
        <li># 하나, ## 둘, ### 셋 → 제목 크기 차이 눈으로 확인</li>
        <li>**텍스트** vs *텍스트* → 볼드랑 이탤릭 차이 바로 비교</li>
        <li>코드 블록 언어명 바꿔보기 → python, javascript, bash 등 색상 바뀌는 거 확인</li>
        <li>테이블 문법 → | 기호로 만드는데 미리보기 보면서 이해하면 빠름</li>
      </ul>

      <p className="mb-4">
        마크다운 레퍼런스 보면서 바로바로 해보는 게 제일 빠른 학습법이다.
        이 도구가 그 용도로 딱 맞다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>왼쪽 에디터에 마크다운 작성 또는 붙여넣기</li>
        <li>오른쪽에서 실시간 미리보기 확인</li>
        <li>수정 반복하면서 원하는 결과 만들기</li>
        <li>완성되면 복사해서 깃허브, 블로그, 노션 등에 붙여넣기</li>
        <li>끝</li>
      </ol>

      <p className="mb-4">따로 배울 것도 없고, 계정도 필요 없다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/markdown-preview" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 마크다운 미리보기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">
        README 푸시 전에 한 번 확인해보면 커밋 몇 개는 줄일 수 있음.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #마크다운 #마크다운미리보기 #README #개발도구 #무료도구
      </p>
    </article>
  );
}
