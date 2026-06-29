import Link from 'next/link';

export default function ShellGamePost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">재미/테스트 · 2026년 7월 27일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        집중력 테스트 용도로 만든 쉘 게임 (컵 찾기)
      </h1>

      <p className="mb-4">
        <Link href="/tools/shell-game" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 쉘 게임 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        눈이 빠른지 느린지 궁금했는데, 측정할 방법이 마땅히 없었음.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 필요한지</h2>

      <p className="mb-3">쉘 게임이 필요한 순간은 이럴 때다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>집중력 자가 테스트 → 오늘 피곤한지, 머리가 잘 돌아가는지 체크</li>
        <li>눈 훈련 → 빠르게 움직이는 물체 추적하는 시지각 연습</li>
        <li>아이들과 놀이 → 어린이도 즉시 이해하는 간단한 규칙</li>
        <li>오피스 게임 → 쉬는 시간에 동료와 함께 누가 더 잘 맞추는지</li>
        <li>두뇌 워밍업 → 집중 업무 전 뇌를 깨우는 짧은 훈련</li>
        <li>스트레스 해소 → 짧고 직관적인 게임, 생각 비우기 좋음</li>
        <li>속임수 내성 훈련 → 인지 왜곡 저항력 테스트용</li>
      </ul>

      <p className="mb-4">
        길거리에서 보던 그 컵 돌리는 게임, 실제 사기꾼한테 당하기 전에 연습이라도 해보자는 거임 ㅋㅋ.
        농담이고, 집중력 게임으로는 진짜 즉각적인 피드백이 있어서 재밌음.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>실제 컵 게임 → 컵 3개 준비하고 직접 섞어야 하는데 혼자는 불가능</li>
        <li>유튜브 쉘 게임 영상 → 영상 멈추고 결과 확인하는 방식이라 상호작용 없음</li>
        <li>전용 앱 → 설치 필요, 단순 게임 하나에 앱 깔기 불필요</li>
        <li>집중력 측정 앱 → 여러 기능 섞여있어서 쉘 게임만 하기 어색함</li>
      </ul>

      <p className="mb-4">
        실제로 브라우저에서 쉘 게임 검색해봤는데 광고 많고 UI 불편한 것들이 많았음.
        그냥 깔끔하게 만들면 되겠다 싶었음.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 직접 만들었음</h2>

      <p className="mb-3">컵 3개 섞는 것 눈으로 따라가서 공 있는 컵 맞추는 게임.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">기본 기능:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>컵 섞기 애니메이션 → 실제 컵이 왔다갔다 하는 움직임 표현</li>
        <li>난이도 조절 → 섞는 속도, 횟수 조절 가능</li>
        <li>정답/오답 피드백 → 어떤 컵에 공이 있었는지 바로 공개</li>
        <li>연속 점수 → 몇 번 연속으로 맞췄는지 카운트</li>
        <li>성공률 통계 → 플레이 전체 정답률 표시</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">난이도:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>쉬움 → 느린 속도, 3번 섞기</li>
        <li>보통 → 중간 속도, 5번 섞기</li>
        <li>어려움 → 빠른 속도, 8번 이상 섞기</li>
        <li>전문가 → 매우 빠른 속도, 10번 이상, 컵 4개</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>시각적 피드백이 즉각적 → 결과 바로 확인, 다음 판 빠르게 시작</li>
        <li>집중력 측정으로 실제 의미 있음 → 피곤한 날 정답률이 확실히 떨어짐</li>
        <li>쉬운 규칙 → 설명 없이도 바로 이해</li>
        <li>단시간 플레이 가능 → 1분도 안 걸리는 게임 사이클</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>기록 저장 없음 → 어제보다 오늘 나아졌는지 비교 불가</li>
        <li>2인 대결 모드 없음 → 번갈아가며 해야 함</li>
        <li>컵 개수 고정 → 3개 기준</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">활용 꿀팁</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">집중력 루틴으로</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>아침에 일어나서 5판 플레이</li>
        <li>오늘 컨디션 측정 지표로 활용</li>
        <li>정답률 낮으면 더 쉬고 시작하는 신호로 삼기</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">아이들과 함께</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>쉬움 난이도로 시작</li>
        <li>아이가 "저기!" 하고 손가락 가리키게 하면서 참여감 올리기</li>
        <li>집중력 기르기 좋은 짧은 훈련</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">동료와 대결</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>같은 난이도로 각자 10판씩</li>
        <li>정답률 비교해서 집중력 왕 가리기</li>
        <li>쉬는 시간 5분 짜리 이벤트로 딱 맞음</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>난이도 선택</li>
        <li>공 위치 확인 후 컵 섞기 시작</li>
        <li>공이 어디 있는지 눈으로 추적</li>
        <li>공 있다고 생각하는 컵 클릭</li>
        <li>결과 확인</li>
      </ol>

      <p className="mb-4">한 판에 30초면 충분. 집중력 바로 테스트 가능.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/shell-game" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 쉘 게임 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">
        오늘 컨디션이 좋은지 나쁜지 30초 만에 파악 가능.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #쉘게임 #컵게임 #집중력테스트 #눈훈련 #두뇌훈련 #간단게임
      </p>
    </article>
  );
}
