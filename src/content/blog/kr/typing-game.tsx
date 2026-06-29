import Link from 'next/link';

export default function TypingGamePost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">재미/테스트 · 2026년 7월 26일 · 읽는 시간 5분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        타자 연습 앱 깔기 귀찮아서 만든 브라우저 타이핑 게임
      </h1>

      <p className="mb-4">
        <Link href="/tools/typing-game" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 타이핑 게임 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        분당 몇 타 나오는지 그냥 궁금했는데, 앱 설치까지 해야 하는 게 좀.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 필요한지</h2>

      <p className="mb-3">타이핑 속도나 정확도가 궁금해지는 순간은 생각보다 다양하다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>이직 준비 중 → 자기소개서에 "타자 속도 300타" 써도 되는지 궁금</li>
        <li>새 키보드 구매 후 → 이전이랑 속도 차이 나는지 확인하고 싶음</li>
        <li>친구랑 내기 → "나 타자 빠른데?" 하면 증명할 방법 필요</li>
        <li>업무 중 쉬는 시간 → 5분 짜리 뭔가 하고 싶은데 게임 깔기엔 부담</li>
        <li>자리 비울 때 화면 켜두기 → 잠깐 타이핑 연습하면서 시간 보내기</li>
        <li>타자 속도가 요즘 느려진 것 같을 때 → 객관적으로 측정해보고 싶음</li>
        <li>스터디 모임에서 아이스브레이킹 → 각자 속도 측정해서 순위 내기</li>
      </ul>

      <p className="mb-4">
        "타자 속도 재보고 싶다"는 생각이 들었을 때, 앱 검색 → 설치 → 회원가입까지 하는 건 너무 비효율적.
        그냥 브라우저에서 바로 되면 충분함.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>타자연습 앱 → 설치 필요, 오래된 UI, 광고 많음</li>
        <li>온라인 타자 연습 사이트 → 회원가입 유도하거나 광고 팝업 많음</li>
        <li>구글 "typing speed test" → 영어 기준이라 한글 타자 속도 측정에 맞지 않음</li>
        <li>스마트폰 키보드 속도 측정 → 키보드 종류가 달라서 비교 의미 없음</li>
        <li>워드 파일에 타이핑 → 속도 계산을 직접 해야 함, 오타 체크도 수동</li>
      </ul>

      <p className="mb-4">
        결국 "그냥 아무 사이트에서 해보자"고 들어가면 쓸데없이 무거운 UI에, 결과 보려면 로그인하라는 팝업 나오는 경우가 많음.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 직접 만들었음</h2>

      <p className="mb-3">설치 없이 브라우저에서 바로 타이핑 속도랑 정확도 측정할 수 있는 게임.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">기본 기능:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>타이핑 속도 측정 → 분당 타자수(CPM), WPM 실시간 표시</li>
        <li>정확도 측정 → 오타 비율 퍼센트로 표시</li>
        <li>시간 제한 모드 → 30초/60초/120초 중 선택</li>
        <li>단어 수 모드 → 정해진 단어 수 입력 후 소요 시간 측정</li>
        <li>오타 실시간 표시 → 틀린 글자 빨간색으로 바로 보임</li>
        <li>결과 요약 → 게임 후 평균 속도, 정확도, 총 타자 수 요약</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">게임 모드:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>스피드 모드 → 제한 시간 안에 최대한 많이 입력</li>
        <li>정확도 모드 → 오타 최소화 목표</li>
        <li>챌린지 모드 → 오타 나면 즉시 종료</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>페이지 들어가자마자 바로 시작 가능 → 로그인 없음, 팝업 없음</li>
        <li>결과가 바로 나옴 → CPM, WPM, 정확도 한눈에 확인</li>
        <li>여러 번 반복하기 쉬움 → 리셋 버튼 하나면 즉시 재시작</li>
        <li>모바일도 됨 → 폰 키보드 속도도 측정 가능</li>
        <li>광고 없음 → 집중해서 게임 가능</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>점수 저장 기능 없음 → 오늘 기록이랑 어제 기록 비교 불가</li>
        <li>사용자 지정 텍스트 입력 불가 → 내가 연습하고 싶은 텍스트로는 못 함</li>
        <li>멀티플레이 없음 → 친구랑 실시간 대결은 불가</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">활용 꿀팁</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">이력서에 타자 속도 적을 때</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>60초 모드로 3회 측정</li>
        <li>평균값 계산해서 적기</li>
        <li>정확도도 90% 이상 나왔을 때 기록 사용</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">친구랑 대결할 때</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>같은 시간 설정으로 번갈아가며 측정</li>
        <li>결과 스크린샷 찍어서 공유</li>
        <li>누가 더 빠른지 객관적으로 확인</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">키보드 비교할 때</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>새 키보드로 5회, 기존 키보드로 5회 측정</li>
        <li>평균 비교하면 체감 차이 수치로 확인 가능</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>시간 모드 선택 (30초 / 60초 / 120초)</li>
        <li>입력창 클릭해서 시작</li>
        <li>화면에 나오는 텍스트 따라 타이핑</li>
        <li>시간 종료 후 결과 확인</li>
      </ol>

      <p className="mb-4">60초 한 번이면 내 타자 속도 파악 완료.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/typing-game" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 타이핑 게임 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">
        설치 없이 바로 됨. 내 타자 속도가 실제로 얼마인지 한 번쯤 확인해보는 것도 재밌음.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #타이핑게임 #타자속도측정 #타자연습 #CPM #WPM #키보드속도
      </p>
    </article>
  );
}
