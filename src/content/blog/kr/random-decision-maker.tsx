import Link from 'next/link';

export default function RandomDecisionMakerPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">재미/테스트 · 2026년 7월 24일 · 읽는 시간 3분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        뭐 먹을지 못 고르는 사람들 모여라 — 선택지 넣으면 랜덤으로 골라주는 도구 만들었음
      </h1>

      <p className="mb-4">
        <Link href="/tools/random-decision-maker" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 무작위 결정 도우미 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        팀 점심 메뉴 정하는 데 15분 쓰다가 그냥 이거 만들었다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 필요한지</h2>

      <p className="mb-3">결정 장애가 없어도 이런 상황은 다 생김:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>점심 메뉴 → 치킨/피자/파스타/한식 중 하나, 근데 아무도 못 고름</li>
        <li>오늘 뭐 볼지 → 넷플릭스 고르다 시간 다 감</li>
        <li>팀 발표 순서 → 공정하게 랜덤으로 정하고 싶을 때</li>
        <li>당번 정하기 → 청소, 커피 사기, 회의록 작성 순번</li>
        <li>여행지 선정 → 후보 여러 개인데 다들 양보만 함</li>
        <li>게임 캐릭터 선택 → 어떤 캐릭터 해볼지 모를 때</li>
        <li>주말 활동 → 영화/전시/산책 중 뭐 할지</li>
        <li>플레이리스트 곡 선택 → 뭐 들을지 고르기 귀찮을 때</li>
      </ul>

      <p className="mb-4">
        혼자 결정할 때도 유용하지만 여럿이서 고를 때 특히 빛남. &quot;내가 고른 게 아니라 랜덤이 골랐다&quot;는 핑계로 불만 없이 수락하게 됨.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">결정 장애가 생기는 이유</h2>

      <p className="mb-3">
        심리학적으로 선택지가 많아질수록 결정하기 어려워지는 현상을 &quot;선택의 역설&quot;이라고 한다. 선택지가 2~3개면 쉽게 고르는데, 4개 이상이 되면 뭘 선택해도 나머지를 포기하는 손실감이 커짐.
      </p>

      <p className="mb-3">
        또 선택 후 후회가 두려워서 결정 자체를 미루는 경우도 있음. 이럴 때 랜덤이 오히려 심리적 부담을 줄여줌. 내가 고른 게 아니니까.
      </p>

      <p className="mb-4">
        그리고 그룹에서는 &quot;내가 정하면 내 책임&quot;이 되니까 아무도 먼저 말 안 하는 사회적 현상도 있음. 랜덤 도구 하나로 그 교착 상태를 깔끔하게 해소 가능.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>가위바위보 → 2명이면 모르겠는데 3명 이상이면 복잡해짐</li>
        <li>주사위 → 선택지가 7개 이상이면 사용 불가</li>
        <li>동전 던지기 → 2지 선다만 가능</li>
        <li>번호 뽑기 → 종이 준비하고 접어야 함. 번거로움</li>
        <li>랜덤 숫자 생성기 → 선택지마다 번호 매기고 계산해야 함. 불편</li>
        <li>룰렛 앱 → 찾아서 다운받고 입력하는 게 귀찮음. 광고 많음</li>
      </ul>

      <p className="mb-4">
        선택지 목록 입력하면 바로 골라주는 심플한 게 필요했음.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">기능:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>선택지 입력 → 한 줄에 하나씩 입력 또는 쉼표로 구분</li>
        <li>랜덤 선택 → 버튼 클릭으로 즉시 결과</li>
        <li>애니메이션 → 결과 발표 전 짧은 랜덤 효과</li>
        <li>여러 번 반복 → 다시 뽑기 버튼으로 계속 사용 가능</li>
        <li>선택 이력 → 방금 어떤 순서로 나왔는지 기록</li>
        <li>가중치 설정 → 특정 선택지가 더 자주 뽑히게 확률 조정</li>
        <li>선택지 저장 → 자주 쓰는 선택지 목록 로컬 저장</li>
      </ul>

      <p className="mb-3">추가 모드:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>순서 섞기 모드</strong> → 선택지 전체를 랜덤 순서로 재배열 (발표 순서, 팀 순번 정할 때)</li>
        <li><strong>N개 뽑기 모드</strong> → 선택지에서 중복 없이 여러 개 뽑기</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>팀 점심 메뉴 정할 때 진짜로 씀 → 다들 결과 순순히 수락함</li>
        <li>순서 섞기가 편함 → 발표 순서 랜덤으로 정할 때 엑셀 안 써도 됨</li>
        <li>선택지 저장 → 자주 쓰는 메뉴 목록 저장해두고 재사용</li>
        <li>애니메이션이 있어서 결과 발표 분위기가 생김</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>물리적인 긴장감은 실제 뽑기를 못 따라감</li>
        <li>결과에 불만이면 &quot;다시 뽑기&quot; 계속 누르는 사람은 어쩔 수 없음</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>선택지 입력 (한 줄에 하나 또는 쉼표로 구분)</li>
        <li>결정하기 버튼 클릭</li>
        <li>결과 확인</li>
        <li>마음에 안 들면 다시 클릭 (양심껏)</li>
      </ol>

      <p className="mb-4">3초면 됨. 15분 토론보다 훨씬 빠름.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">이런 선택지 저장해두면 편함</h2>

      <p className="mb-3">자주 쓰는 선택지 예시:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>점심 메뉴</strong> → 치킨, 피자, 파스타, 한식, 중식, 일식, 분식</li>
        <li><strong>오늘 운동</strong> → 달리기, 헬스, 수영, 자전거, 홈트, 쉬기</li>
        <li><strong>주말 계획</strong> → 영화, 전시회, 등산, 맛집 탐방, 집콕, 쇼핑</li>
        <li><strong>커피 선택</strong> → 아메리카노, 라떼, 카푸치노, 콜드브루, 오늘은 안 마심</li>
      </ul>

      <p className="mb-4">저장해두면 다음에 열었을 때 바로 사용 가능.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/random-decision-maker" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 무작위 결정 도우미 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">오늘 점심, 이거로 정하자.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #결정장애 #랜덤선택 #점심메뉴 #결정도우미 #무작위뽑기 #선택고민
      </p>
    </article>
  );
}
