import Link from 'next/link';

export default function TimerPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">재미/테스트 · 2026년 7월 19일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        폰 타이머 꺼내기 귀찮아서 브라우저 탭으로 쓸 수 있는 거 만들었음
      </h1>

      <p className="mb-4">
        <Link href="/tools/timer" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 카운트다운/스톱워치 타이머 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        컴퓨터 앞에서 집중 타이머 쓸 때마다 폰 꺼내는 게 왜 이렇게 번거롭냐.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">타이머 쓰는 상황이 생각보다 많음</h2>

      <p className="mb-3">일상에서 타이머 필요한 순간들:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>집중해서 작업할 때 → 25분 집중, 5분 휴식 포모도로 루틴</li>
        <li>요리할 때 → 라면 끓이는 3분, 달걀 삶는 8분</li>
        <li>운동 인터벌 → 1분 운동, 30초 휴식 반복</li>
        <li>발표/스피치 연습 → 시간 안에 끝나는지 체크</li>
        <li>회의 시간 관리 → 안건별 시간 배분 확인</li>
        <li>게임 판 시간 제한 → 보드게임, 퍼즐 타이머</li>
        <li>스톱워치 → 기록 측정, 무언가 얼마나 걸리는지 체크</li>
      </ul>

      <p className="mb-4">
        이 중에서 컴퓨터 앞에 앉아 있을 때 필요한 상황이 대부분이다.
        근데 폰 꺼내서 타이머 앱 열고, 시간 설정하고, 폰 내려놓고... 이 루틴이 은근히 집중 흐름을 끊는다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존에 쓰던 방법들 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>폰 기본 타이머 앱 → 컴퓨터 작업 중이면 폰 계속 확인해야 함, 화면 안 보임</li>
        <li>구글 "25분 타이머 설정" 검색 → 매번 검색해야 하는 번거로움, 탭 닫으면 사라짐</li>
        <li>macOS 알림 센터 타이머 → 기능이 제한적, 커스텀 설정 불편</li>
        <li>전용 포모도로 앱 → 설치해야 하고, 단순 타이머 하나 쓰려는데 기능이 너무 많음</li>
        <li>화이트노이즈 앱들에 딸려오는 타이머 → 앱 용도랑 달라서 어색함</li>
      </ul>

      <p className="mb-4">
        그냥 브라우저 탭 하나 열어두고 쓸 수 있는 타이머가 있으면 딱인데 싶었다.
        화면에 크게 남은 시간 보이고, 끝나면 소리 나고, 그게 전부인 거.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 직접 만들었음</h2>

      <p className="mb-3">카운트다운 타이머랑 스톱워치 두 가지 모드 다 있음:</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">카운트다운 타이머:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>시간 직접 입력 또는 프리셋 버튼 (1분, 3분, 5분, 10분, 25분, 45분)</li>
        <li>시작/일시정지/리셋</li>
        <li>종료 시 알림음 + 브라우저 알림 (탭 전환해도 알림 받음)</li>
        <li>남은 시간 탭 타이틀에 표시 → 다른 탭 작업 중에도 확인 가능</li>
        <li>반복 설정 → 포모도로처럼 자동으로 다시 시작</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">스톱워치:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>시작/정지/리셋</li>
        <li>랩 기록 → 구간별 시간 기록 저장</li>
        <li>랩 목록 한눈에 보기 → 최단/최장 랩 하이라이트</li>
        <li>결과 복사 → 기록 텍스트로 내보내기</li>
      </ul>

      <p className="mb-3">기타 기능:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>화면 어둡게 방지 → 타이머 켜두는 동안 화면 꺼짐 방지</li>
        <li>알림음 종류 선택 → 벨, 비프, 부드러운 소리 중 선택</li>
        <li>볼륨 조절</li>
        <li>다크모드 지원</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">포모도로 기법, 집중할 때 진짜 효과 있음?</h2>

      <p className="mb-3">
        써보면 알겠지만, 25분 집중 + 5분 휴식 루틴이 실제로 꽤 도움된다.
        특히 이런 상황에서:
      </p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>"이거 언제 끝나나" 싶은 큰 작업 → 25분씩 쪼개면 시작 장벽이 낮아짐</li>
        <li>집중 안 되는 날 → 타이머 켜두면 "일단 25분만" 마인드로 버팀</li>
        <li>번아웃 방지 → 강제로 쉬는 시간 생기니까 장시간 작업해도 덜 지침</li>
        <li>작업 시간 추적 → 이 작업이 몇 포모도로나 걸렸는지 파악 가능</li>
      </ul>

      <p className="mb-4">
        타이머 없이 "집중해야지" 마음만 먹는 것보다 훨씬 구체적인 방법이다.
        25분 카운트다운 켜두고 화면에 남은 시간 보이면 자연스럽게 딴짓 줄어드는 효과도 있음.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>탭 타이틀에 남은 시간 나오는 거 → 다른 탭 작업 중에도 확인되니까 진짜 편함</li>
        <li>브라우저 알림 → 탭 안 보고 있어도 종료 알림 받음</li>
        <li>프리셋 버튼 → 매번 시간 입력 안 해도 됨</li>
        <li>스톱워치 랩 기록 → 반복 작업 구간별 시간 비교할 때 유용</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>탭 닫으면 기록 사라짐 → 세션 저장 없음</li>
        <li>여러 타이머 동시에 돌리는 멀티타이머는 없음</li>
        <li>배경 음악 기능은 없음 → 타이머만 있음</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-2 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>카운트다운 또는 스톱워치 모드 선택</li>
        <li>카운트다운: 시간 직접 입력하거나 프리셋 버튼 클릭</li>
        <li>시작 버튼 눌러서 타이머 시작</li>
        <li>필요하면 일시정지 / 리셋 가능</li>
        <li>종료 시 알림음 + 화면 알림 표시</li>
      </ol>

      <p className="mb-4">3초면 시작할 수 있다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/timer" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 카운트다운/스톱워치 타이머 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">
        집중 작업할 때 탭 하나 열어두면 폰 꺼낼 일 없어진다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #타이머 #포모도로 #집중타이머 #스톱워치 #생산성 #카운트다운
      </p>
    </article>
  );
}
