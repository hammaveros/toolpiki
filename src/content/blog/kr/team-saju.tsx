import Link from 'next/link';

export default function TeamSajuPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">재미/테스트 · 2026년 8월 1일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        팀 회식 때 단체 사주, 한 명씩 번갈아가며 보던 거 한 번에 해결
      </h1>

      <p className="mb-4">
        <Link href="/tools/team-saju" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 팀 단체 사주 보기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        팀 회식에서 "우리 다 같이 사주 봐보자" 나왔는데, 5명이 각자 다른 사이트에서 보느라 20분 걸림.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">팀에서 사주 얘기가 나오는 상황</h2>

      <p className="mb-3">생각보다 자주 있는 상황이다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>팀 MT나 회식 → "우리 팀원들 사주 다 같이 봐보자" → 한 명씩 보느라 시간 오래 걸림</li>
        <li>새 팀원 입사했을 때 → "어떤 사람인지 사주로 보자" → 아이스브레이킹 용도</li>
        <li>프로젝트 시작 전 → "이 멤버들 조합이 괜찮은지" → 팀 에너지 파악</li>
        <li>친구들 모임 → "우리끼리 단체 사주 봐볼까" → 각자 보고 비교하기 귀찮음</li>
        <li>동아리 OT → "멤버들 사주 파악" → 재미있는 아이스브레이킹</li>
      </ul>

      <p className="mb-4">여러 명이 같이 보고 싶은데, 기존 도구들은 전부 개인 단위다. 한 명 보고 → 뒤로 가고 → 다른 사람 입력하고 → 반복. 이게 귀찮다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방식의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>개인 사주 도구로 한 명씩 → 5명이면 5번 반복, 결과 비교 불가</li>
        <li>철학관 방문 → 여러 명이 같이 가는 것 자체가 힘듦, 비용도 큼</li>
        <li>사주 앱 여러 개 → 각자 다른 앱 쓰면 결과 형식이 달라서 비교 어려움</li>
        <li>스크린샷 공유 → 화면 공유하면서 보는 것도 번거로움</li>
      </ul>

      <p className="mb-4">단체로 같이 보고, 한 화면에서 비교할 수 있는 도구가 없었다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">팀원 여러 명의 생년월일을 한 번에 입력하면 단체 사주 분석이 나오는 도구다.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">기본 기능:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>멤버 최대 10명까지 동시 입력 가능</li>
        <li>각자 이름, 생년월일, 성별 입력</li>
        <li>개인별 사주 분석 + 팀 전체 분석 동시에</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">단체 분석에서 나오는 것들:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>팀 오행 분포 → 목화토금수 어느 기운이 강하고 부족한지</li>
        <li>팀 에너지 특성 → 전체적으로 어떤 성향의 팀인지</li>
        <li>멤버별 역할 성향 → 리더형, 실행형, 아이디어형, 조율형 등</li>
        <li>팀 내 보완 관계 → 누가 누구의 부족한 부분을 채워주는지</li>
        <li>팀워크 주의사항 → 잘 충돌할 수 있는 조합 미리 파악</li>
        <li>팀에게 좋은 방향 → 이 팀이 잘 맞는 업무 스타일</li>
      </ul>

      <p className="mb-4">개인 사주도 각자 볼 수 있고, 팀 전체 분석도 같이 볼 수 있다. 한 페이지에서 다 된다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">팀 아이스브레이킹으로 사주가 의외로 좋은 이유</h2>

      <p className="mb-4">MBTI가 팀 아이스브레이킹에 많이 쓰이는 것처럼, 사주도 비슷한 역할을 할 수 있다. "나는 이런 성향이야"를 직접 말하는 것보다, 사주나 MBTI 같은 것을 통해 간접적으로 자신을 소개하는 게 더 편한 사람들이 많다.</p>

      <p className="mb-4">특히 사주는 단순히 "내 성격이 어때"를 넘어서 "나는 어떤 환경에서 잘 맞는지, 어떤 상황에서 에너지를 많이 쓰는지"까지 얘기할 수 있어서 팀 맥락에서 이야기거리가 풍부하다.</p>

      <p className="mb-4">물론 믿지 않아도 된다. 그냥 대화의 소재로 쓰는 거다. "어, 나 이거 진짜 맞는 것 같은데" 혹은 "이건 아닌데 ㅋㅋ"라는 반응이 나오는 것만으로도 대화가 시작된다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">어떤 자리에서 쓰면 좋냐면</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>팀 MT 버스 안 → "우리 팀 사주 어떤지 봐볼까요?" → 심심풀이로 딱</li>
        <li>신규 팀 킥오프 미팅 → MBTI 공유 순서처럼 → 자연스러운 소개</li>
        <li>스터디 모임 → "우리 조합이 공부하기 좋은 조합인지" → 웃으면서 시작</li>
        <li>동아리 첫 모임 → 이름과 생년월일로 → 기억도 잘 됨</li>
        <li>친구들 모임 → 오랜 친구들도 서로 사주 모르는 경우 많음 → 새로운 화제</li>
      </ul>

      <p className="mb-4">링크 하나 공유하면 다 같이 볼 수 있어서 편하다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>한 화면에서 팀 전체 사주 비교 가능 → 이게 핵심</li>
        <li>팀 에너지 분석이 재밌음 → "우리 팀 불기운이 엄청 강하네" 같은 얘기 나옴</li>
        <li>멤버 추가/삭제 쉬움 → 빠진 사람 나중에 추가해도 됨</li>
        <li>결과 공유 링크 → 카카오톡으로 팀원들한테 보내기 쉬움</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>생년월일 모르는 팀원은 빠질 수밖에 없음 → 미리 수집 필요</li>
        <li>전문 사주 수준 분석은 아님 → 재미/아이스브레이킹 용도</li>
        <li>너무 진지하게 받아들이면 오히려 역효과 → 가볍게</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>팀원 이름과 생년월일 입력 (최대 10명)</li>
        <li>분석 결과 확인 (개인별 + 팀 전체)</li>
        <li>링크 공유해서 팀원들이랑 같이 보기</li>
      </ol>

      <p className="mb-4">팀원 5명 기준 2~3분이면 입력 끝난다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/team-saju" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 팀 단체 사주 보기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">로그인 없이 바로 쓸 수 있다. 다음 팀 모임 때 써보자.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #단체사주 #팀사주 #팀아이스브레이킹 #사주팔자 #팀MT #팀빌딩 #무료도구
      </p>
    </article>
  );
}
