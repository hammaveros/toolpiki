import Link from 'next/link';

export default function TimingTestPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">재미/테스트 · 2026년 7월 20일 · 읽는 시간 5분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        박자 감각이 있다고 자신했는데 ms 단위로 틀리고 있었음 — 타이밍 테스트 만든 이야기
      </h1>

      <p className="mb-4">
        <Link href="/tools/timing-test" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 타이밍/리듬 테스트 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        드럼 좀 쳤다고, 박자 감각은 자신 있다고 했는데... 테스트해보니 평균 오차 143ms ㅋㅋ
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 필요한지</h2>

      <p className="mb-3">이런 사람들한테 딱 맞는 도구임:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>드럼, 기타, 피아노 등 악기 연주자 → BPM에 맞는 타이밍 훈련</li>
        <li>음악 프로듀서 → 루프 편집할 때 자신의 리듬 감각 파악</li>
        <li>DJ 지망생 → 비트매칭 감각 기르기</li>
        <li>댄서 → 음악에 맞춰 움직이는 감각 체크</li>
        <li>게이머 → 리듬 게임 전 워밍업, 반응속도와 타이밍 복합 훈련</li>
        <li>그냥 심심할 때 → "나 박자 감각 어느 정도야?" 궁금해서 해보는 용도</li>
        <li>친구랑 내기 → 누가 더 정확하게 맞추나 점수 비교</li>
      </ul>

      <p className="mb-4">
        별것 아닌 것 같지만, 직접 해보면 생각보다 어렵다. 눈 감고 하면 특히 더. 100ms는 0.1초인데, 사람이 느끼기엔 "찰나"처럼 느껴지지만 음악에서는 완전히 다른 느낌을 줌. 재즈 연주자들은 20ms 이내로 맞춘다는데 일반인은 50~200ms 정도 오차가 남.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>메트로놈 앱 → 소리는 나는데 내가 얼마나 맞추는지 측정이 안 됨</li>
        <li>리듬 게임 → Perfect/Good 판정은 있는데 정확히 몇 ms 오차인지 안 알려줌</li>
        <li>DAW 소프트웨어 → 전문적이지만 설치해야 하고, 타이밍 측정만 하기엔 너무 과함</li>
        <li>유튜브 BPM 맞추기 영상 → 영상 보면서 하는 건데 측정 기능 없음</li>
        <li>온라인 타이밍 테스트 → 영어만 있거나, 결과를 통계로 안 보여주거나, 디자인이 구림</li>
      </ul>

      <p className="mb-4">
        "내가 얼마나 정확한가"를 수치로 보고 싶은데, 그걸 보여주는 도구가 없었음. 그냥 감으로만 "오늘 박자 잘 맞았어" 하는 거랑, "평균 오차 38ms, 최대 오차 72ms" 보는 거랑은 완전히 다른 경험.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 직접 만들었음</h2>

      <p className="mb-3">BPM 설정하고 비트에 맞춰 클릭하면, ms 단위로 오차를 측정해서 통계로 보여줌.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">핵심 기능:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>BPM 설정 → 60~200 BPM 범위, 자신의 연습 곡 BPM에 맞춰 설정</li>
        <li>클릭 타이밍 측정 → 정확한 박자 대비 몇 ms 앞서거나 늦었는지 측정</li>
        <li>평균 오차 통계 → 여러 번 클릭한 결과의 평균, 최대, 최솟값</li>
        <li>조기/지연 분석 → 내가 주로 앞당기는 편인지 늦는 편인지 경향 파악</li>
        <li>시각적 피드백 → 박자에 얼마나 가까웠는지 바로 화면에 표시</li>
        <li>반복 측정 → 연속으로 여러 번 치면서 점점 개선되는지 확인 가능</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">오차 기준 안내:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>0~20ms → 프로급. 재즈 연주자, 전문 드러머 수준</li>
        <li>20~50ms → 훈련된 음악인. 충분히 훌륭한 편</li>
        <li>50~100ms → 일반인 평균. 대부분 여기에 속함</li>
        <li>100ms 이상 → 리듬 감각 훈련이 필요한 단계</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>수치로 보이니까 훨씬 명확함 → "잘하는 것 같은데" 가 아니라 실제 데이터</li>
        <li>연습할수록 오차가 줄어드는 게 보임 → 성취감 있음</li>
        <li>BPM 바꿔가면서 하면 어떤 템포에서 약한지 파악 가능</li>
        <li>설치 없이 브라우저에서 바로 → 연습 전 워밍업으로 딱 맞음</li>
        <li>조기/지연 경향 파악 → 나는 항상 살짝 앞당기는 편이라는 걸 처음 알았음</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>실제 악기 연주와는 다름 → 클릭으로 하는 테스트라 악기 특성 반영 안 됨</li>
        <li>오디오 지연(레이턴시) 변수 → 컴퓨터/스피커 환경에 따라 소리 타이밍이 약간 다를 수 있음</li>
        <li>결과 저장 없음 → 오늘 점수를 나중에 다시 보거나 비교 불가</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">타이밍 감각 키우는 꿀팁</h2>

      <p className="mb-3">그냥 반복만 하면 늘지 않는 경우도 있음. 이런 방식으로 연습하면 더 효과적:</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">초보자는 느린 BPM부터</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>60 BPM (1초에 1번)으로 시작 → 박자 사이 간격이 길어서 집중하기 쉬움</li>
        <li>평균 오차 50ms 이하 되면 80, 100, 120 BPM으로 올리기</li>
        <li>빠르게 시작했다가 오차 커지면 역효과</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">중간 레벨은 까다로운 BPM 공략</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>143 BPM처럼 딱 떨어지지 않는 BPM 연습 → 실전 감각 향상</li>
        <li>셋잇단음표 타이밍 연습용으로 활용 가능</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">눈 감고 해보기</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>화면 안 보고 소리만으로 박자 맞추면 난이도 올라감</li>
        <li>실제 공연이나 합주 환경에 더 가까워짐</li>
        <li>오차가 2배 이상 늘어나는 사람도 있음 ㅋㅋ</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>BPM 선택 (기본 120 BPM)</li>
        <li>시작 버튼 클릭 → 비트 소리 시작</li>
        <li>박자에 맞춰 클릭 또는 스페이스바</li>
        <li>10회 이상 클릭하면 통계 확인</li>
        <li>평균 오차, 조기/지연 경향 파악</li>
      </ol>

      <p className="mb-4">처음엔 오차 클 수 있음. 그게 정상이고 반복하면 줄어드는 게 보임.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/timing-test" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 타이밍/리듬 테스트 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">
        "나 박자 잘 맞아" 하는 사람들 중에 100ms 넘는 경우 많음 ㅋㅋ 직접 해보면 현실 파악 됨. 악기 연습 전 워밍업으로도, 심심풀이로도 딱 맞는 도구임.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #타이밍테스트 #리듬감 #BPM #박자연습 #음악감각 #드럼연습 #리듬게임
      </p>
    </article>
  );
}
