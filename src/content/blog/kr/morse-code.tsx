import Link from 'next/link';

export default function MorseCodePost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">계산기 · 2026년 6월 19일 · 읽는 시간 3분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        모스부호 변환기, 수업 과제에서 게임까지 의외로 쓸 일 있음
      </h1>

      <p className="mb-4">
        <Link href="/tools/morse-code" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 모스부호 변환기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        정보처리 수업에서 모스부호 과제 나왔는데 일일이 표 찾아가며 변환할 수가 없다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">모스부호가 필요한 상황들</h2>

      <p className="mb-3">생각보다 다양하다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>학교 수업 과제 → 정보통신, 역사, 물리 수업에서 모스부호 다루는 경우 종종 있음</li>
        <li>방탈출 카페 힌트 → 모스부호 암호 풀어야 하는 방 있음</li>
        <li>보드게임/파티게임 → 비밀 메시지 만들 때</li>
        <li>코딩 프로젝트 → 모스부호 관련 알고리즘 구현 전에 정답 확인용</li>
        <li>영화/드라마 장면 → SOS 신호나 모스부호 나오는 장면 해석</li>
        <li>덕질/팬 활동 → 굿즈에 모스부호로 팬 메시지 새기는 경우</li>
        <li>유튜브 썸네일/SNS 콘텐츠 → 암호처럼 보이는 디자인 요소로 활용</li>
      </ul>

      <p className="mb-4">
        딱히 모스부호를 전문적으로 배울 필요는 없는데, 필요한 순간이 갑자기 오는 그런 주제다.
        그때마다 표 찾아서 하나하나 대조하면 너무 시간이 걸린다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">모스부호가 뭔지 간단히</h2>

      <p className="mb-3">
        짧은 신호(점, ·)와 긴 신호(선, —)의 조합으로 알파벳과 숫자를 표현하는 방식이다.
        19세기 전신기에서 시작해서 지금도 선박, 항공, 아마추어 무선에서 쓰인다.
        SOS(···—·—·——···)가 제일 유명하다.
      </p>

      <p className="mb-3">기본 규칙:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>점(·) → 짧은 신호 1단위</li>
        <li>선(—) → 긴 신호 3단위</li>
        <li>같은 글자 내 신호 간격 → 1단위</li>
        <li>글자 사이 간격 → 3단위</li>
        <li>단어 사이 간격 → 7단위</li>
      </ul>

      <p className="mb-4">
        규칙은 이렇게 간단한데, 알파벳 26자 + 숫자 10자 조합을 외우는 건 다른 얘기다.
        A는 ·—, B는 —···, C는 —·—· 이런 식인데 다 외울 필요는 없다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>모스부호 표 검색 → 찾아서 하나하나 대조하는 게 10글자만 넘어도 고역</li>
        <li>위키피디아 → 표 있긴 한데 문장 단위 변환은 직접 해야 함</li>
        <li>앱 다운로드 → 한 번 쓰고 말 건데 앱 설치하기 귀찮음</li>
        <li>유튜브 학습 → 단순 변환하려고 영상 볼 필요는 없음</li>
      </ul>

      <p className="mb-4">
        결국 필요한 건 텍스트 넣으면 모스부호로, 모스부호 넣으면 텍스트로 바꿔주는 것뿐인데
        그게 그냥 되는 도구를 찾기가 의외로 쉽지 않았다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">텍스트 넣으면 모스부호, 모스부호 넣으면 텍스트:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>텍스트 → 모스부호 변환 → 결과 바로 표시</li>
        <li>모스부호 → 텍스트 변환 → 디코딩 결과 바로 표시</li>
        <li>대소문자 구분 없음 → 알아서 처리</li>
        <li>소리 재생 기능 → 실제 모스부호 신호음으로 들을 수 있음</li>
        <li>복사 버튼 → 변환 결과 클립보드로</li>
        <li>글자별 대응표 → 어떻게 변환됐는지 한눈에</li>
      </ul>

      <p className="mb-3">소리 재생이 생각보다 재미있다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>SOS 입력하면 실제 구조 신호 소리 들림</li>
        <li>본인 이름 넣어보면 나만의 모스부호 신호 만들어짐</li>
        <li>모스부호 학습할 때 귀로 익히는 용도로도 씀</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>입력하면 바로 변환됨 → 표 대조할 필요 없음</li>
        <li>소리 재생이 있어서 재미있음 → SOS 신호 직접 들어보니 신기함</li>
        <li>양방향 변환 → 인코딩도 디코딩도 한 페이지에서</li>
        <li>글자별 대응 표시 → 어떻게 변환됐는지 설명도 같이 나옴</li>
        <li>방탈출에서 써봤는데 2분 만에 풀었음</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>한글 지원 없음 → 모스부호 자체가 영문/숫자 기반</li>
        <li>특수문자 일부는 변환 안 됨 → 표준 모스부호 범위 내에서만</li>
        <li>속도 조절 → 소리 재생 속도를 바꿀 수 없음</li>
      </ul>

      <p className="mb-4">
        한글은 모스부호 자체가 없어서 어쩔 수 없다. 영어로 변환해서 쓰는 게 표준이다.
        그 외에는 일반 용도로는 충분하다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">재미로 해볼 것들</h2>

      <p className="mb-3">그냥 써보면 재미있는 것들:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>본인 이름 영어로 입력 → 나만의 모스부호 생김</li>
        <li>SOS 넣고 소리 재생 → 실제 구조 신호 들려봄</li>
        <li>좋아하는 사람 이름 모스부호로 → 문신 디자인이나 굿즈 아이디어</li>
        <li>·—·—·— 같은 거 역방향 변환 → 뭔 말인지 바로 확인</li>
        <li>친구한테 모스부호로 메시지 보내기 → 상대가 못 읽으면 더 재미있음</li>
      </ul>

      <p className="mb-4">
        학습용으로도 재미용으로도 쓸 수 있다.
        아마추어 무선 자격증(ham radio) 준비하는 경우에도 기초 연습용으로 괜찮다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>텍스트 입력 → 모스부호로 변환됨</li>
        <li>또는 모스부호 입력(·과 — 사용) → 텍스트로 변환됨</li>
        <li>소리 재생 버튼으로 신호음 들어보기</li>
        <li>결과 복사해서 쓰기</li>
        <li>끝</li>
      </ol>

      <p className="mb-4">딱히 배울 것도 없다. 그냥 넣으면 나온다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/morse-code" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 모스부호 변환기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">
        이름 넣고 소리 재생해보는 거 한 번쯤 해봐. 생각보다 재미있음.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #모스부호 #모스코드 #모스부호변환 #암호 #무료도구
      </p>
    </article>
  );
}
