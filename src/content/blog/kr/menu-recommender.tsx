import Link from 'next/link';

export default function MenuRecommenderPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">재미/테스트 · 2026년 7월 30일 · 읽는 시간 5분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        매일 점심 메뉴 때문에 10분 날리다가 만든 오늘 뭐 먹을까 추천기
      </h1>

      <p className="mb-4">
        <Link href="/tools/menu-recommender" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 오늘 뭐 먹을까 메뉴 추천기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        "아무거나"라는 말이 가장 어렵다는 걸 알면서도 계속 그 말을 하게 됨.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 필요한지</h2>

      <p className="mb-3">메뉴 결정이 안 되는 상황은 매일 옴:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>직장 점심 → "오늘 뭐 먹을까" 매일 나오는 대화, 10분 지나도 결론 없음</li>
        <li>혼밥할 때 → 배달 앱 켜놓고 30분째 스크롤 중</li>
        <li>가족 저녁 → "뭐 먹고 싶어?"라는 질문에 "아무거나" 반복</li>
        <li>친구들 모임 → 인원 많을수록 의견 모으기 더 어려움</li>
        <li>외식 장소 못 정할 때 → 식당 분류가 너무 많아서 오히려 못 고름</li>
        <li>다이어트 중 → 먹을 수 있는 것들 중에서 골라야 할 때</li>
        <li>비슷한 것만 반복 → 항상 같은 메뉴만 돌아가서 변화가 필요할 때</li>
        <li>요리 메뉴 → 집에서 뭐 해먹을지 못 정하겠을 때</li>
      </ul>

      <p className="mb-4">
        "오늘 뭐 먹지"는 생각보다 에너지 많이 쓰는 결정임.
        선택지가 너무 많으면 오히려 아무것도 못 고르는 선택 마비 현상.
        그냥 결정해주는 게 있으면 훨씬 편함.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>배달 앱 → 너무 많은 선택지, 사진 보다가 배 안 고파짐</li>
        <li>룰렛 앱 → 미리 메뉴 넣어놔야 하는데 그게 귀찮음</li>
        <li>투표 → 단체로 카톡 투표 만들면 시간 걸리고 결국 의견 갈림</li>
        <li>직접 제안 → "한식 어때?" 하면 "아 오늘은 좀" 이라는 반응</li>
        <li>구글 "점심 추천" → 너무 일반적인 결과, 내 상황 반영 안 됨</li>
        <li>네이버 지도 → 근처 식당 보여주긴 하는데 여전히 고르는 건 내 몫</li>
      </ul>

      <p className="mb-4">
        이미 먹은 것, 싫어하는 것, 지금 기분을 고려해서 추천해주는 게 있었으면 했음.
        조건 설정해서 그냥 "이거 먹어" 해주는 도구.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 직접 만들었음</h2>

      <p className="mb-3">조건 설정하면 그에 맞는 메뉴 추천. 조건 없어도 됨.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">기본 기능:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>랜덤 메뉴 추천 → 조건 없이 바로 추천 받기</li>
        <li>카테고리 선택 → 한식/중식/일식/양식/분식/기타 중 선택</li>
        <li>분위기 선택 → 간단히 / 든든하게 / 가볍게 / 특별하게</li>
        <li>가격대 설정 → 1만원 이하 / 1~2만원 / 상관없음</li>
        <li>최근 먹은 거 제외 → 최근 입력한 메뉴는 추천에서 빼기</li>
        <li>재추천 → 마음에 안 들면 다시 추천받기</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">추천 방식:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>단일 메뉴 → 딱 하나 결정해서 보여줌</li>
        <li>3가지 후보 → 최종 결정은 직접, 범위만 좁혀줌</li>
        <li>오늘의 추천 → 시간대별 추천 (아침/점심/저녁/야식)</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>결정 위임이 되는 느낌 → "내가 고른 게 아니라 추천받은 거"라는 심리적 편함</li>
        <li>뭔가 나오면 먹고 싶은지 판단이 빠름 → "떡볶이?" 하면 먹고 싶은지 아닌지 즉시 알아짐</li>
        <li>반복 메뉴 탈출 → 항상 같은 거 먹던 패턴에서 벗어날 기회</li>
        <li>단체로 쓰면 편함 → 각자 원하는 조건 넣고 겹치는 거 찾기</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>실제 주변 식당 연동 없음 → 메뉴만 추천, 근처에 있는지는 따로 확인해야</li>
        <li>세세한 취향 반영 한계 → 고수 싫어함, 느끼한 거 싫어함 같은 조건 세세하게 설정 불가</li>
        <li>식재료 기반 추천 없음 → 냉장고에 있는 재료로 추천은 아님</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">활용 꿀팁</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">빠른 결정 루틴</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>아무 조건 없이 추천받기</li>
        <li>결과 보고 먹고 싶으면 그걸로, 아니면 한 번 더</li>
        <li>2번 안에 결정 안 되면 첫 번째 추천으로 결정</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">팀 점심 정할 때</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>3가지 후보 옵션으로 추천받기</li>
        <li>3개 중 투표하면 이미 범위가 좁아져서 빠르게 결론남</li>
        <li>"이것만 안 되면 아무거나" 방식으로 빠르게 합의</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">혼밥 배달 시</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>가격대랑 카테고리 설정해서 추천받기</li>
        <li>배달 앱에서 추천 메뉴 검색해서 바로 주문</li>
        <li>배달 앱 스크롤 30분 하는 시간 줄이기</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>원하는 조건 선택 (안 해도 됨)</li>
        <li>추천 받기 버튼 클릭</li>
        <li>결과 보고 마음에 들면 결정</li>
        <li>안 들면 재추천 받기</li>
      </ol>

      <p className="mb-4">10초면 오늘 점심 결정 끝. 이제 메뉴 논쟁 그만.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/menu-recommender" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 오늘 뭐 먹을까 메뉴 추천기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">
        점심시간 10분 전에 북마크 열어서 바로 결정. 밥 먹는 시간 더 확보.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #오늘뭐먹을까 #메뉴추천 #점심메뉴 #메뉴결정 #결정장애 #랜덤메뉴
      </p>
    </article>
  );
}
