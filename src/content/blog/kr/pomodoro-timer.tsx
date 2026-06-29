import Link from 'next/link';

export default function PomodoroTimerPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">계산기 · 2026년 6월 23일 · 읽는 시간 5분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        포모도로 앱 3개 써보고 결국 직접 만든 타이머
      </h1>

      <p className="mb-4">
        <Link href="/tools/pomodoro-timer" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 포모도로 타이머 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        집중 안 된다고 포모도로 앱 깔았는데 앱 설정하다가 30분 날림.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">포모도로 기법이 뭔지</h2>

      <p className="mb-3">1980년대 이탈리아 개발자 프란체스코 시릴로가 만든 시간 관리 방법. 토마토 모양 주방 타이머로 시간을 쟀다고 해서 포모도로(이탈리아어로 토마토)라는 이름이 붙었다.</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>25분 집중 → 뇌가 집중할 수 있는 적정 단위 시간</li>
        <li>5분 휴식 → 짧게 쉬면서 회복</li>
        <li>4세트 반복 → 한 사이클</li>
        <li>긴 휴식 (15~30분) → 4세트 후에는 길게 쉬기</li>
      </ul>

      <p className="mb-3">이 방법이 왜 효과 있는지:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>끝이 보이면 집중하기 쉬움 → "25분만 하면 쉴 수 있어"</li>
        <li>작업을 잘게 쪼갬 → 시작 자체가 덜 부담스러움</li>
        <li>강제 휴식 → 쉬지 않고 달리다 번아웃 나는 거 방지</li>
        <li>타이머 소리 → 주변 소음 차단, 집중 모드 전환 신호</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 필요한지</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>재택근무 중 → 집에서 일하면 경계가 없어서 집중/휴식 구분이 안 됨</li>
        <li>공부할 때 → 시험 준비, 자격증 공부 등 긴 시간 앉아야 할 때</li>
        <li>창작 작업 → 글쓰기, 코딩, 디자인처럼 흐름이 중요한 작업</li>
        <li>반복 단순 업무 → 이메일 처리, 데이터 입력 등 지루한 작업</li>
        <li>ADHD 성향 있을 때 → 타이머가 강제로 구조를 만들어줌</li>
        <li>마감 압박 있을 때 → 남은 시간을 포모도로 단위로 역산해서 계획</li>
      </ul>

      <p className="mb-4">특히 "시작이 제일 어려운 사람"한테 효과적이다. 25분만 집중하면 된다는 게 심리적 장벽을 낮춰줌.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 앱들의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>광고 → 집중하려다 광고 배너 보임, 본말전도</li>
        <li>설정 복잡 → 프리미엄, 무료 요금제 구분, 알림 권한, 계정 생성 등</li>
        <li>앱 설치 자체 → 폰에 또 하나 더 깔기 싫음</li>
        <li>PC에서 쓰기 불편 → 모바일 앱이라 PC 작업 중에 폰 들여다봐야 함</li>
        <li>소리가 이상하거나 없음 → 타이머 끝나도 알림이 눈에 안 띔</li>
        <li>UI가 산만함 → 통계, 프로젝트 관리, 팀 기능 등 필요 없는 것들 가득</li>
        <li>브라우저에서 그냥 쓰고 싶은데 앱 설치 강요</li>
      </ul>

      <p className="mb-4">결국 원하는 건 단순하다. 타이머 켜고, 25분 집중하고, 소리 나면 쉬는 것. 그게 전부인데 왜 이렇게 복잡해.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 직접 만들었음</h2>

      <p className="mb-3">버튼 하나로 시작. 광고 없음.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">기본 기능:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>25분 집중 타이머 → 시작 버튼 하나로 바로 작동</li>
        <li>5분 단기 휴식 → 자동 전환 또는 수동 전환</li>
        <li>15분 장기 휴식 → 4세트 후 자동 전환</li>
        <li>완료 알림 소리 → 타이머 끝나면 소리로 알림</li>
        <li>세션 카운트 → 오늘 몇 포모도로 완료했는지 표시</li>
        <li>브라우저 탭 타이틀 → 다른 탭 봐도 남은 시간 확인 가능</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">커스텀 설정:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>집중 시간 조절 → 25분이 기본이지만 20분, 30분으로 바꿀 수 있음</li>
        <li>휴식 시간 조절 → 짧은 휴식, 긴 휴식 시간 각각 설정</li>
        <li>자동 시작 설정 → 휴식 끝나면 바로 다음 세션 시작</li>
        <li>알림음 선택 → 종류 여러 개 중에서 선택</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>열자마자 바로 시작 가능 → 로그인, 설정 단계 없음</li>
        <li>탭 타이틀에 시간 표시 → 다른 탭 열어도 남은 시간 보임</li>
        <li>알림 소리가 명확함 → 집중하다 깜빡해도 소리로 알 수 있음</li>
        <li>광고 없음 → 집중 도와주는 도구가 집중을 방해하면 안 되니까</li>
        <li>화면이 단순함 → 타이머 하나만 보임, 다른 거 신경 쓸 필요 없음</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>작업 기록 없음 → "오늘 어떤 작업 했는지" 태그 기능은 없음</li>
        <li>통계 없음 → 주간/월간 포모도로 몇 개 했는지 집계 안 됨</li>
        <li>팀 기능 없음 → 함께 집중하는 기능은 지원 안 함</li>
        <li>브라우저 탭 닫으면 리셋 → 세션 카운트가 초기화됨</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">포모도로 더 잘 쓰는 방법</h2>

      <p className="mb-3">써보면서 효과 있었던 것들:</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">시작 전에</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>이번 포모도로에 할 것 딱 하나 정하기 → 모호한 "공부하기" 말고 "3장 읽기"처럼</li>
        <li>폰 뒤집어 놓기 → 알림 차단</li>
        <li>물 한 잔 옆에 두기 → 집중 중에 갈증 때문에 일어나지 않도록</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">집중 중에</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>딴 생각 나면 메모만 해두고 계속 → "나중에 할 것" 리스트 옆에 두기</li>
        <li>타이머 보지 않기 → 소리 날 때까지 화면 다른 데 두기</li>
        <li>25분 중 뭔가 방해 받았으면 그 세션은 취소로 → 완전한 25분만 카운트</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">휴식 중에</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>일어서서 움직이기 → 앉아서 유튜브 보면 휴식 아님</li>
        <li>눈 쉬게 하기 → 20-20-20 (20초 동안 20피트=6m 밖 바라보기)</li>
        <li>물 마시기 → 진짜 쉬는 거</li>
        <li>다음 세션 뭐 할지 머릿속으로 정리하기</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">4세트 후 긴 휴식</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>15~30분 여유롭게 → 커피 마시기, 산책, 스트레칭</li>
        <li>다음 사이클 계획 간단히 세우기</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">이런 사람한테 추천</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>재택근무 중 → 집에서 일하면서 시간 관리가 안 되는 사람</li>
        <li>공부 시작이 어려운 사람 → "25분만"이라는 심리적 허들 낮추기</li>
        <li>SNS나 유튜브 자꾸 보게 되는 사람 → 타이머 켜면 그 시간만큼은 버티게 됨</li>
        <li>번아웃 걱정되는 사람 → 강제 휴식으로 지속 가능한 루틴 만들기</li>
        <li>마감 있는 작업 하는 사람 → 남은 시간 포모도로로 역산해서 계획</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>페이지 열기</li>
        <li>시작 버튼 클릭</li>
        <li>25분 집중</li>
        <li>소리 나면 쉬기 (5분)</li>
        <li>반복</li>
      </ol>

      <p className="mb-4">설정 건드릴 필요 없이 기본값으로 바로 쓸 수 있다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/pomodoro-timer" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 포모도로 타이머 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">설치 없이 브라우저에서 바로 쓸 수 있다. 광고 없고 회원가입 없음. 지금 해야 할 거 있으면 바로 시작해봐.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #포모도로타이머 #집중력향상 #시간관리 #공부타이머 #재택근무 #생산성도구
      </p>
    </article>
  );
}
