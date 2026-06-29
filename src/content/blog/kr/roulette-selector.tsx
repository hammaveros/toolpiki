import Link from 'next/link';

export default function RouletteSelectorPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">재미/테스트 · 2026년 7월 28일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        메뉴 못 고르는 사람들을 위해 만든 룰렛 선택기
      </h1>

      <p className="mb-4">
        <Link href="/tools/roulette-selector" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 룰렛 선택기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        "아무거나"라고 해놓고 제안하면 다 싫다는 사람들한테 룰렛 결과 보여주면 의외로 잘 납득함.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 필요한지</h2>

      <p className="mb-3">룰렛이 필요한 상황은 생각보다 많음:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>점심 메뉴 결정 → 후보 5개 넣고 돌리면 10분 논쟁 종료</li>
        <li>여행지 선택 → 가고 싶은 곳이 여러 개일 때 랜덤으로 결정</li>
        <li>공부 순서 → 오늘 복습할 과목 룰렛으로 정하기</li>
        <li>운동 메뉴 → 헬스장에서 뭐 할지 못 정하면 룰렛</li>
        <li>이벤트 추첨 → 당첨자 공개 방식으로 활용 가능</li>
        <li>게임 캐릭터 선택 → 무작위로 캐릭터 골라서 플레이</li>
        <li>영화 선택 → 넷플릭스 30분째 고르고 있는 상황 해결</li>
        <li>요리 메뉴 → 오늘 저녁 뭐 만들지, 재료 없는 것만 제외하고 룰렛</li>
      </ul>

      <p className="mb-4">
        결정 장애가 있는 건 아닌데, 선택지가 너무 비슷비슷할 때 룰렛에 맡기면 마음이 편해짐.
        룰렛 결과가 마음에 안 들면 그때 비로소 "사실 그거 먹기 싫었다"는 게 보임.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>무작위 선택기 → 룰렛 돌아가는 시각적 재미가 없음, 결과만 확 나옴</li>
        <li>실제 룰렛판 → 항목이 정해져 있어서 커스텀 불가</li>
        <li>앱 설치형 룰렛 → 기능 많고 무거움, 잠깐 쓰기에 오버</li>
        <li>구글 "random picker" → 영어 UI, 한글 입력 불편한 경우 많음</li>
        <li>직접 번갈아 추천 → 결국 아무도 납득 못 하는 경우 많음</li>
      </ul>

      <p className="mb-4">
        룰렛의 핵심은 "돌아가는 과정"에 있음. 그 과정이 있어야 결과를 납득하게 됨.
        결과만 확 나오면 "왜 저게 나왔지" 싶고 다시 돌리고 싶어짐.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 직접 만들었음</h2>

      <p className="mb-3">항목 입력하고 돌리면 룰렛이 실제로 돌아가면서 결과 나옴.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">기본 기능:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>항목 자유 입력 → 최대 20개까지, 줄바꿈으로 한 번에 붙여넣기 가능</li>
        <li>룰렛 돌리기 애니메이션 → 실제로 회전하면서 서서히 멈추는 연출</li>
        <li>결과 강조 표시 → 어디에서 멈췄는지 명확하게 표시</li>
        <li>재도전 버튼 → 결과 마음에 안 들면 바로 다시 돌리기</li>
        <li>결과 복사 → 단톡방 공유용 텍스트 복사</li>
        <li>항목 색상 자동 지정 → 각 항목별 다른 색상으로 구분</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">가중치 기능:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>항목별 가중치 설정 가능 → 특정 항목이 더 자주 나오게 설정</li>
        <li>예: 좋아하는 메뉴 가중치 높이면 더 자주 선택됨</li>
        <li>가중치 동일하면 완전 랜덤</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>돌아가는 애니메이션이 기대감 줌 → 단순히 결과 나오는 것보다 분위기 좋음</li>
        <li>결과에 대한 수용도가 높음 → "내가 선택한 게 아니라 룰렛이" 라는 심리</li>
        <li>그룹에서 쓰면 반응 좋음 → 다들 기대하면서 봄</li>
        <li>항목 붙여넣기 → 메뉴 목록 미리 만들어두고 복붙하면 편함</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>항목 저장 안 됨 → 자주 쓰는 메뉴 목록 매번 입력해야 함</li>
        <li>여러 번 결과 기록 없음 → 오늘 뭐 뽑혔는지 히스토리 없음</li>
        <li>사운드 효과 없음 → 룰렛 돌아가는 소리 있으면 더 재밌을 것 같음</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">활용 꿀팁</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">점심 논쟁 끝내기</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>각자 한 가지씩 후보 제안</li>
        <li>룰렛에 다 넣고 돌리기</li>
        <li>결과 납득 못 하면 "그럼 처음부터 싫었던 거 아니냐"고 반문 가능</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">공부 순서 정할 때</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>오늘 복습할 과목 4~5개 넣기</li>
        <li>룰렛 돌리면 오늘의 공부 시작 과목 결정</li>
        <li>선택 고민 없이 바로 시작할 수 있음</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">이벤트 추첨</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>참가자 이름 입력</li>
        <li>화면 공유하면서 돌리면 라이브 추첨 분위기 남</li>
        <li>결과 캡처해서 당첨 발표</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>선택지 입력 (한 줄에 하나씩)</li>
        <li>돌리기 버튼 클릭</li>
        <li>룰렛 멈출 때까지 기다리기</li>
        <li>결과 확인</li>
      </ol>

      <p className="mb-4">30초면 결정 완료. 더 이상 고민 안 해도 됨.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/roulette-selector" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 룰렛 선택기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">
        오늘 뭐 먹을지 못 정하면 그냥 룰렛에 맡겨봐.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #룰렛선택기 #결정장애 #메뉴선택 #무작위선택 #추첨 #점심메뉴
      </p>
    </article>
  );
}
