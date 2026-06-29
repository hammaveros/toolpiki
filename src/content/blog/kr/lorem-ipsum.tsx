import Link from 'next/link';

export default function LoremIpsumPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">텍스트 · 2026년 7월 24일 · 읽는 시간 3분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        UI 목업에 Lorem Ipsum 텍스트 넣어야 할 때마다 어디선가 복붙하던 거 이제 그냥 직접 만들었음
      </h1>

      <p className="mb-4">
        <Link href="/tools/lorem-ipsum" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Lorem Ipsum 생성기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        Figma에서 텍스트 레이어 채울 때마다 구글에 &quot;lorem ipsum&quot; 검색하고 복붙하는 게 반복됐다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Lorem Ipsum이 뭔지</h2>

      <p className="mb-3">
        Lorem Ipsum은 디자인이나 개발에서 실제 콘텐츠가 준비되지 않았을 때 자리를 채우는 더미 텍스트다. 라틴어처럼 생겼지만 의미 없는 문자열이고, 오래전부터 인쇄 업계에서 레이아웃 확인용으로 써왔음.
      </p>

      <p className="mb-3">
        &quot;Lorem ipsum dolor sit amet...&quot; 로 시작하는 그 문구. 실제로 키케로의 &quot;De Finibus Bonorum et Malorum&quot;에서 변형된 텍스트라는 설이 있음.
      </p>

      <p className="mb-3">왜 실제 텍스트 말고 Lorem Ipsum을 쓰냐면:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>레이아웃에 집중 → 실제 의미 있는 텍스트가 있으면 내용에 신경 쓰게 됨</li>
        <li>글자 분포 → 영문 기준으로 알파벳 빈도가 자연스러운 텍스트처럼 분포됨</li>
        <li>저작권 문제 없음 → 임의 텍스트라 어디서든 자유롭게 사용 가능</li>
        <li>길이 조절 용이 → 단락/단어/문자 수로 원하는 만큼 뽑을 수 있음</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 필요한지</h2>

      <p className="mb-3">생각보다 많은 상황에서 더미 텍스트가 필요함:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>UI 디자인 → Figma, Sketch 등에서 텍스트 레이어 채울 때</li>
        <li>개발 목업 → 컴포넌트 테스트할 때 실제 데이터 없이 레이아웃 확인</li>
        <li>블로그/CMS 스타일링 → 글 스타일 적용할 때 테스트용 본문</li>
        <li>PDF 템플릿 → 레이아웃 잡을 때 실제 내용 없이 분량 채우기</li>
        <li>폰트 프리뷰 → 새 폰트 어떻게 보이는지 확인할 때</li>
        <li>반응형 테스트 → 긴 텍스트에서 줄바꿈이나 오버플로 테스트</li>
        <li>프레젠테이션 목업 → 슬라이드 디자인 잡을 때 내용 자리 채우기</li>
        <li>이메일 템플릿 → HTML 이메일 레이아웃 테스트</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>구글 검색 후 복붙 → 항상 같은 문구만 복붙하게 됨. 분량 조절 안 됨</li>
        <li>lipsum.com 같은 사이트 → 있긴 한데 영어 UI라 설정 헷갈리고, 광고 있고, 느림</li>
        <li>IDE 플러그인 → VSCode에 Lorem Ipsum 익스텐션 있긴 한데 Figma에선 못 씀</li>
        <li>에디터 자동완성 → 코드 에디터 안에서만 쓸 수 있고 단락 수 조절 불편</li>
        <li>직접 복붙한 거 재활용 → 매번 같은 텍스트라 여러 컴포넌트에 쓰면 구별이 안 됨</li>
      </ul>

      <p className="mb-4">
        단락 수, 단어 수, 문장 시작 여부 등 자유롭게 설정해서 바로 뽑아주는 페이지 하나면 됨.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">기능:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>단위 선택 → 단락 / 단어 / 문장 기준으로 생성</li>
        <li>개수 설정 → 원하는 분량 숫자로 입력</li>
        <li>&quot;Lorem ipsum&quot;으로 시작 여부 → 전통적인 시작 문구 포함/제외 선택</li>
        <li>HTML 태그 포함 옵션 → <code>&lt;p&gt;</code> 태그 감싸서 출력 (HTML 작업용)</li>
        <li>복사 버튼 → 원클릭 클립보드 복사</li>
        <li>재생성 → 같은 설정으로 다른 텍스트 생성</li>
      </ul>

      <p className="mb-3">추가:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>한국어 더미 텍스트</strong> → Lorem Ipsum 대신 한국어 무의미 텍스트 생성 옵션</li>
        <li><strong>문자 수 표시</strong> → 생성된 텍스트의 글자/단어/단락 수 카운트</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>단락/단어/문장 단위 선택이 편함 → 상황에 맞게 분량 조절 가능</li>
        <li>HTML 옵션 → <code>&lt;p&gt;</code> 태그 바로 붙여넣기 가능. 컴포넌트 테스트에 유용</li>
        <li>한국어 더미 텍스트 → 한글 폰트나 CJK 레이아웃 테스트에 써먹음</li>
        <li>문자 수 표시 → 몇 글자짜리 본문인지 확인하고 싶을 때</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>실제 의미 있는 문장이 필요하면 AI 사용 추천</li>
        <li>특정 길이 정확히 맞추는 건 단어 기준이라 오차 있음</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>단위 선택 (단락 / 단어 / 문장)</li>
        <li>개수 입력 (예: 단락 3개)</li>
        <li>옵션 설정 (Lorem ipsum 시작 여부, HTML 태그 포함 여부)</li>
        <li>생성 버튼 클릭</li>
        <li>복사 버튼으로 클립보드에 복사</li>
      </ol>

      <p className="mb-4">5초면 됨. 구글 검색 필요 없음.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">알아두면 유용한 팁</h2>

      <p className="mb-3">
        <strong>Figma에서 쓸 때</strong>: 단락 5개 생성 후 전체 복사 → Figma 텍스트 레이어에 붙여넣기. 텍스트 박스 자동 확장됨.
      </p>

      <p className="mb-3">
        <strong>React 컴포넌트 테스트</strong>: HTML 옵션 켜고 <code>&lt;p&gt;</code> 태그 포함된 채로 복사 → JSX에 붙여넣으면 단락 구분 자동 적용.
      </p>

      <p className="mb-3">
        <strong>폰트 테스트</strong>: 단어 수십 개짜리 텍스트 생성 → 다양한 폰트 적용해서 미리보기. 모든 알파벳 문자가 골고루 나와서 폰트 확인에 적합.
      </p>

      <p className="mb-4">
        <strong>한국어 레이아웃</strong>: 한국어 더미 텍스트 옵션 사용 → 영어 Lorem Ipsum은 한글 폰트 테스트에 안 맞으니까 한국어 더미로 확인.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/lorem-ipsum" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Lorem Ipsum 생성기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">구글 검색 없이, 매번 같은 문구 복붙 없이.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #LoremIpsum #더미텍스트 #목업 #UI디자인 #개발테스트 #플레이스홀더텍스트
      </p>
    </article>
  );
}
