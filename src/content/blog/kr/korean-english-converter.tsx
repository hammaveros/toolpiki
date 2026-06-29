import Link from 'next/link';

export default function KoreanEnglishConverterPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">텍스트 · 2026년 7월 29일 · 읽는 시간 5분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        한영키 안 누르고 입력한 것들 변환하다가 지쳐서 만든 한영 자판 변환기
      </h1>

      <p className="mb-4">
        <Link href="/tools/korean-english-converter" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 한영 자판 변환기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        "dkssudgktpdy"라고 쳐놓고 "안녕하세요" 였다는 거 알고 처음부터 다시 쓰는 상황, 진짜 짜증남.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 필요한지</h2>

      <p className="mb-3">한영 자판 실수는 정말 자주 일어남:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>슬랙/메신저에서 → 영어 입력 상태로 한글 쳤을 때 "dkssud" 나오는 상황</li>
        <li>터미널 명령어 → 한글 상태로 "ls" 쳤을 때 "ㅣㄴ" 나오는 상황</li>
        <li>IDE 검색창 → 함수명 검색하려다 한글 나오는 경우</li>
        <li>구글 검색 → "ㅒㅁㅁㅐ" 같은 알 수 없는 글자로 검색</li>
        <li>파일명 입력 → 프로젝트 폴더명 한글로 잘못 입력</li>
        <li>로그인창 비밀번호 → 한영 전환 안 하고 비밀번호 쳐서 로그인 실패</li>
        <li>엑셀 셀 → 영어 단어 넣으려다 한글 채움</li>
        <li>긴 문장 작성 중 → 한참 쓰다가 중간부터 반대 언어로 쓰여진 걸 발견</li>
      </ul>

      <p className="mb-4">
        한영키 상태 확인 안 하고 타이핑하는 습관이 있는 사람은 하루에 몇 번씩 이 상황을 겪음.
        처음부터 다시 쓰는 대신 변환할 수 있으면 몇 초가 절약됨.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>처음부터 다시 입력 → 가장 흔한 방법인데, 긴 문장이면 너무 비효율</li>
        <li>클립보드 기록 활용 → 한글 자판에서 입력한 로마자 기록을 찾아서 변환, 복잡함</li>
        <li>한컴 입력기 변환 단축키 → 있긴 한데 모르는 사람 많고, 모든 환경에서 작동 안 함</li>
        <li>구글에서 검색 → "qkdrhkd를 한글로" 같은 검색, 결과가 바로 안 나옴</li>
        <li>한영 변환 앱 → 앱 설치가 필요하거나 온라인 도구가 마땅치 않음</li>
      </ul>

      <p className="mb-4">
        잘못 입력된 텍스트를 붙여넣고 변환 버튼 하나로 끝나는 게 있었으면 했음.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 직접 만들었음</h2>

      <p className="mb-3">잘못 입력된 텍스트 붙여넣고 버튼 누르면 올바른 텍스트로 변환.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">기본 기능:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>영자판 → 한글 변환 → "dkssud" 입력하면 "안녕"으로 변환</li>
        <li>한자판 → 영어 변환 → 한글 상태로 친 "ㅣㄴ"을 "ls"로 변환</li>
        <li>방향 자동 감지 → 입력 내용 보고 어느 방향 변환인지 자동 판단</li>
        <li>실시간 변환 → 입력하면서 바로 결과 나옴</li>
        <li>결과 복사 → 변환된 텍스트 원클릭 복사</li>
        <li>긴 텍스트 처리 → 문단 단위 텍스트도 처리 가능</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">변환 규칙:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>표준 쿼티 키보드 기준 → 한영 자판 대응표 기준으로 변환</li>
        <li>대소문자 유지 → 원본 대소문자 패턴 유지하면서 변환</li>
        <li>특수문자 처리 → 변환 대상 아닌 문자는 그대로 유지</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>붙여넣기 → 변환 → 복사가 5초 안에 끝남 → 다시 입력 대신 이걸 씀</li>
        <li>긴 문장도 처리됨 → 한 단락씩 붙여넣어도 잘 됨</li>
        <li>실시간 변환 → 결과 바로 확인 가능, 예상대로 나오는지 즉시 체크</li>
        <li>광고 없음 → 빠르게 쓰고 나올 수 있음</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>복잡한 특수문자 → 쿼티 기준이 아닌 특수 입력은 변환 오류 가능</li>
        <li>전각 문자 → 일본어나 중국어 입력 상태에서 입력된 것은 처리 안 됨</li>
        <li>발음 변환은 다름 → "한글을 로마자로" (로마나이제이션)와는 다른 기능</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">활용 꿀팁</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">터미널에서 실수했을 때</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>한글로 나온 명령어 텍스트 복사</li>
        <li>변환기에 붙여넣기</li>
        <li>영어 변환 결과 복사해서 터미널에 재입력</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">메신저 긴 메시지 실수</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>잘못 입력된 텍스트 전체 선택</li>
        <li>변환기에 붙여넣고 변환</li>
        <li>결과 복사해서 메신저 입력창에 붙여넣고 전송</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">자동화 활용</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>북마크 해두고 실수할 때마다 바로 열기</li>
        <li>모바일에도 접속 가능 → 폰에서 실수해도 처리 가능</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>잘못 입력된 텍스트 붙여넣기</li>
        <li>변환 방향 확인 (자동 감지 또는 수동 선택)</li>
        <li>변환 버튼 클릭 (또는 실시간으로 확인)</li>
        <li>결과 복사</li>
      </ol>

      <p className="mb-4">5초면 다시 입력 없이 변환 완료.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/korean-english-converter" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 한영 자판 변환기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">
        다음에 한영키 실수하면 처음부터 다시 입력하지 말고 이걸 써봐.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #한영변환 #자판변환 #한영자판 #한글영어변환 #타이핑실수 #키보드변환
      </p>
    </article>
  );
}
