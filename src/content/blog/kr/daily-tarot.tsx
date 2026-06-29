import Link from 'next/link';

export default function DailyTarotPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">재미/테스트 · 2026년 7월 28일 · 읽는 시간 5분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        타로 카드가 뭔지 궁금해서 직접 만들어본 오늘의 타로
      </h1>

      <p className="mb-4">
        <Link href="/tools/daily-tarot" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 오늘의 타로 카드 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        타로 앱이 몇 개 있던데 회원가입 필요하고 유료 카드 유도가 심해서 그냥 만들었음.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 필요한지</h2>

      <p className="mb-3">타로 카드가 당기는 순간은 다양함:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>아침 기분 체크 → "오늘 어떤 날이 될까" 한 장 뽑아보기</li>
        <li>결정 앞에서 → 선택을 못 하겠을 때 카드 해석에서 힌트 얻기</li>
        <li>친구와 대화 소재 → "오늘 타로 뭐 뽑혔어?" 가벼운 화제</li>
        <li>스트레스 풀기 → 진지하게 믿는 게 아니라, 읽으면서 잠깐 생각 정리</li>
        <li>운세 궁금할 때 → 별자리 운세는 밋밋하고, 뭔가 다른 방식 원할 때</li>
        <li>일기 쓰기 전 → 오늘의 카드가 주는 키워드로 일기 시작</li>
        <li>새해나 새 달 시작 → 이번 달 방향성 잡는 용도</li>
      </ul>

      <p className="mb-4">
        믿고 안 믿고의 문제가 아님. 카드 하나 뽑고 그 해석을 읽으면서 "어, 맞는 것 같기도 하고"
        라는 느낌이 재밌음. 그게 타로의 묘미임.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>타로 앱 → 회원가입 필요, 기본 카드만 무료고 상세 해석은 유료 유도</li>
        <li>유튜브 타로 리딩 → 영상 길이 10~30분, 가볍게 보기 어려움</li>
        <li>타로 사이트 → 광고 많고 UI 오래됨, 모바일에서 불편</li>
        <li>실제 타로 카드 → 78장 덱 구매해야 하고, 의미 공부해야 함</li>
        <li>타로 보러 가기 → 한 번에 몇만 원, 매일 갈 수 없음</li>
      </ul>

      <p className="mb-4">
        "그냥 오늘 카드 하나 뽑고 짧은 설명 읽고 싶을 뿐인데" 라는 니즈에 딱 맞는 게 없었음.
        회원가입 없이 바로 카드 뽑을 수 있어야 함.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 직접 만들었음</h2>

      <p className="mb-3">로그인 없이 카드 뽑고, 카드 설명 바로 읽을 수 있는 오늘의 타로.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">기본 기능:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>카드 뽑기 → 78장 타로 덱에서 오늘의 카드 1장 랜덤 선택</li>
        <li>카드 플립 애니메이션 → 카드가 뒤집히면서 나오는 연출</li>
        <li>카드 이름과 의미 → 메이저/마이너 아르카나 설명 포함</li>
        <li>정방향/역방향 해석 → 카드가 뒤집혀 나왔을 때 다른 해석</li>
        <li>오늘의 키워드 → 카드에서 추출된 오늘의 핵심 단어</li>
        <li>메시지 복사 → 카드 이름 + 키워드 텍스트 복사</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">카드 정보:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>메이저 아르카나 22장 → 바보부터 세계까지 주요 카드</li>
        <li>마이너 아르카나 56장 → 완드, 컵, 소드, 펜타클 4개 수트</li>
        <li>한글 설명 → 번역체 아닌 자연스러운 한국어 해석</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>회원가입 없이 바로 → 들어가서 3초면 카드 뽑기 시작</li>
        <li>카드 설명이 한글로 잘 됨 → 영어 타로 사이트보다 훨씬 읽기 편함</li>
        <li>카드 플립 애니메이션이 재밌음 → 뒤집히는 순간 기대감 있음</li>
        <li>키워드가 간결 → 긴 설명 읽기 싫으면 키워드만 봐도 됨</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>3장 스프레드 없음 → 과거/현재/미래 형식의 복수 카드 리딩 불가</li>
        <li>카드 이미지 없음 → 실제 타로 카드 그림 없이 텍스트 위주</li>
        <li>날짜별 저장 없음 → 지난달 카드 다시 못 봄</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">활용 꿀팁</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">아침 루틴으로</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>하루에 카드 하나만 뽑는 규칙</li>
        <li>키워드를 오늘의 테마로 삼기</li>
        <li>저녁에 카드 키워드가 오늘 실제로 어떻게 나타났는지 회고</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">일기 시작할 때</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>카드 뽑고 키워드 일기 첫 줄에 써두기</li>
        <li>그 키워드로 오늘 하루 어떠했는지 작성</li>
        <li>글쓰기 시작점 찾기 어려울 때 유용</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">친구에게 타로 봐주기</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>친구한테 카드 뽑으라고 링크 보내기</li>
        <li>같이 결과 보면서 해석 이야기 나누기</li>
        <li>진지하게 안 해도 됨, 대화 소재로 충분</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>카드 뽑기 버튼 클릭</li>
        <li>카드 플립 애니메이션 확인</li>
        <li>카드 이름과 키워드 확인</li>
        <li>설명 읽고 오늘에 적용</li>
      </ol>

      <p className="mb-4">아침에 1분이면 오늘의 카드 받기 완료.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/daily-tarot" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 오늘의 타로 카드 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">
        믿고 안 믿고 떠나서, 오늘의 키워드 하나 가지고 시작하는 것도 나쁘지 않음.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #오늘의타로 #타로카드 #일일타로 #타로운세 #아침루틴 #타로점
      </p>
    </article>
  );
}
