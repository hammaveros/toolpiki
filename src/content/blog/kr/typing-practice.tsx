import Link from 'next/link';

export default function TypingPracticePost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">재미/테스트 · 2026년 7월 27일 · 읽는 시간 5분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        타자 연습이 필요한 것 같아서 만든 브라우저용 타이핑 연습 도구
      </h1>

      <p className="mb-4">
        <Link href="/tools/typing-practice" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 타이핑 연습 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        오타가 자꾸 나는 패턴이 있는데, 연습할 방법을 모르겠음.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 필요한지</h2>

      <p className="mb-3">타이핑 연습이 필요한 상황은 사실 꽤 다양하다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>입사 후 첫 달 → 타이핑 느린 게 업무 속도에 영향 줌, 빨리 늘리고 싶음</li>
        <li>부모님 컴퓨터 교육 중 → 타자 연습 사이트 찾아드리고 싶은데 광고 없는 거 찾기 어려움</li>
        <li>오랫동안 스마트폰만 쓰다가 → 키보드 감각이 줄어든 느낌</li>
        <li>자세 교정 후 → 손 위치 바뀌면서 다시 익숙해질 때까지 연습 필요</li>
        <li>코딩 배우면서 → 특수문자 타이핑이 느린 게 거슬림</li>
        <li>학생 때 → 리포트 작성이 느린 이유가 타자 때문인 것 같을 때</li>
        <li>번아웃 후 복직 → 손이 굳은 느낌, 다시 감각 회복 필요</li>
      </ul>

      <p className="mb-4">
        타자 연습은 "해야지" 하고 미루다가 결국 안 하게 되는 종류의 일.
        일단 사이트 들어가서 바로 시작할 수 있어야 진입 장벽이 낮아짐.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>한컴 타자연습 → 설치 필요, 윈도우 전용, 광고 팝업 많음</li>
        <li>타자왕 같은 플래시 게임 → 플래시 지원 종료로 대부분 사용 불가</li>
        <li>타이핑클럽 → 영어 기반, 한글 연습은 따로 없음</li>
        <li>무작정 워드 문서에 타이핑 → 뭘 입력할지 모르겠고, 오타 분석도 안 됨</li>
        <li>유튜브 타자 연습 영상 따라하기 → 영상 멈추고 따라치고 반복이 번거로움</li>
        <li>구글 타이핑 테스트 → 속도만 측정, 연습보다는 측정에 가까움</li>
      </ul>

      <p className="mb-4">
        제대로 된 타자 연습 환경 하나 만들기가 이렇게 복잡한가 싶었음.
        그냥 텍스트 보여주고 따라치는 게 전부인데.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 직접 만들었음</h2>

      <p className="mb-3">광고 없이 브라우저에서 바로 타이핑 연습할 수 있는 환경.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">기본 기능:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>연습 텍스트 자동 제공 → 문장, 단어, 자모음 분리 연습 등</li>
        <li>오타 실시간 표시 → 틀린 글자 즉시 빨간색으로 하이라이트</li>
        <li>완료 후 통계 → 속도, 정확도, 오타 빈도 분석</li>
        <li>다양한 난이도 → 쉬운 문장부터 어려운 단어까지 단계별 제공</li>
        <li>반복 연습 → 같은 텍스트 반복하거나 새 텍스트로 전환 가능</li>
        <li>자음/모음 단독 연습 → 특정 키 조합이 약한 경우 집중 연습</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">연습 유형:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>단어 연습 → 자주 쓰는 단어들 반복 타이핑</li>
        <li>문장 연습 → 실제 문장 단위로 타이핑, 문맥 있어서 지루함 덜함</li>
        <li>숫자/특수문자 연습 → 코딩이나 업무 문서에서 자주 쓰는 기호들</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>설치 없이 바로 접속 → 부모님한테 링크 하나 드리면 바로 연습 가능</li>
        <li>광고 없음 → 연습 중간에 팝업이나 배너 없어서 집중 됨</li>
        <li>오타 패턴 파악 → "ㅅ 계열 단어에서 유독 틀린다"는 걸 알 수 있음</li>
        <li>짧은 세션 가능 → 5분짜리 연습도 의미 있게 할 수 있음</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>커리큘럼 없음 → 단계별로 올라가는 체계적인 학습 플랜은 없음</li>
        <li>진도 저장 안 됨 → 어제 어디까지 했는지 기억 안 남</li>
        <li>내 텍스트 직접 입력 불가 → 원하는 문장 직접 연습은 못 함</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">활용 꿀팁</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">하루 5분 루틴으로</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>출근 후 컴퓨터 켜고 바로 타이핑 연습 5분</li>
        <li>업무 시작 전 손 풀기 효과</li>
        <li>2~3주 이어가면 확실히 달라짐</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">가족 타자 교육할 때</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>링크 하나 북마크 해드리면 끝</li>
        <li>광고 없으니까 덜 헷갈림</li>
        <li>어르신도 처음 화면에서 바로 시작 가능한 구조</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">오타 많이 나는 키 집중 연습</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>결과에서 오타 많이 나는 글자 파악</li>
        <li>같은 레벨 반복해서 해당 글자 포함 단어 집중 타이핑</li>
        <li>의식적으로 그 키 누를 때 잠깐 집중하는 연습</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>연습 유형 선택 (단어 / 문장 / 특수문자)</li>
        <li>난이도 선택</li>
        <li>입력창 클릭해서 연습 시작</li>
        <li>화면에 나오는 텍스트 따라 타이핑</li>
        <li>완료 후 통계 확인</li>
      </ol>

      <p className="mb-4">설치 없이 바로 시작. 5분이면 감 잡힘.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/typing-practice" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 타이핑 연습 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">
        타자 연습은 할 때마다 느는 거라서, 오늘 5분이 진짜 투자임.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #타이핑연습 #타자연습 #타자속도올리기 #타자교육 #타자연습사이트
      </p>
    </article>
  );
}
