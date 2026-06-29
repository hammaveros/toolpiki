import Link from 'next/link';

export default function NicknameGeneratorPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">재미/테스트 · 2026년 7월 29일 · 읽는 시간 5분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        게임 닉네임 15분째 못 정하고 있다가 만든 한글 닉네임 생성기
      </h1>

      <p className="mb-4">
        <Link href="/tools/nickname-generator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 한글 닉네임 생성기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        생각해둔 닉네임이 이미 다 사용 중이라고 뜸. 새 걸 만들려니 머리가 안 돌아감.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 필요한지</h2>

      <p className="mb-3">닉네임이 필요한 순간은 생각보다 많음:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>새 게임 시작 → 캐릭터 이름 만들어야 하는데 아무것도 안 떠오름</li>
        <li>게임 닉네임 변경 → 쓰던 닉 바꾸고 싶은데 뭐가 좋을지 모르겠음</li>
        <li>새 플랫폼 가입 → SNS, 커뮤니티, 게임 계정마다 다른 닉 쓰고 싶은데 고갈</li>
        <li>팀 네이밍 → 스터디, 프로젝트 팀 이름 정하기</li>
        <li>익명 게시판 닉 → 깔끔하면서 기억에 남는 닉네임 필요</li>
        <li>방송 닉네임 → 유튜브, 트위치 채널명 아이디어</li>
        <li>RP 게임 캐릭터명 → 세계관에 맞는 느낌의 이름</li>
        <li>자녀 게임 계정 → 아이 닉네임 같이 만들기</li>
      </ul>

      <p className="mb-4">
        닉네임은 한 번 정하면 오래 쓰게 되는데, 막상 만들려면 아무것도 안 떠오르는 게 문제임.
        아이디어 하나라도 제안받으면 거기서 변형이 가능한데 그 첫 아이디어가 없는 거임.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>영어 닉네임 생성기 → 한글 닉 원하는데 영어만 나옴</li>
        <li>이름 넣고 조합 → 이름 기반이라 본명이 노출될 수 있음</li>
        <li>뭔가 떠오를 때까지 생각 → 10분, 20분 지나도 안 떠오르는 경우 많음</li>
        <li>친구한테 추천 받기 → 친구가 추천한 거 쓰기 뭔가 내 거 아닌 느낌</li>
        <li>단어 랜덤 조합 → "파란하늘123" 같은 진부한 조합만 나옴</li>
      </ul>

      <p className="mb-4">
        한글 특성에 맞는, 실제로 쓸 수 있는 닉네임을 제안해주는 도구가 생각보다 없었음.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 직접 만들었음</h2>

      <p className="mb-3">버튼 누르면 분위기별 한글 닉네임 여러 개 추천해줌.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">기본 기능:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>닉네임 생성 → 한 번에 10개 이상 제안</li>
        <li>분위기별 선택 → 귀여운, 강렬한, 신비로운, 웃긴, 멋있는 등</li>
        <li>길이 설정 → 2글자 ~ 5글자 원하는 길이로</li>
        <li>한글/한자 혼합 → 순 한글 또는 한자 포함 선택</li>
        <li>중복 확인 힌트 → 이미 많이 쓰이는 닉인지 간단히 알려줌</li>
        <li>마음에 드는 것 저장 → 여러 번 생성하면서 좋은 것만 모아보기</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">분위기 카테고리:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>귀여운 → 동글동글하고 발음이 부드러운 닉네임</li>
        <li>강렬한 → 있어보이고 임팩트 있는 닉네임</li>
        <li>신비로운 → 묘한 느낌, 판타지 세계관 어울리는 닉</li>
        <li>유머 → 웃긴 조합, 드립성 닉네임</li>
        <li>자연 → 계절, 날씨, 자연 단어 조합</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>한 번 생성에 여러 개 나옴 → 하나는 맞을 게 있음</li>
        <li>분위기 선택이 유용 → 원하는 느낌 방향 잡고 거기서 결정하면 빠름</li>
        <li>영어 닉 말고 한글 닉 원할 때 딱 맞음 → 한국어 감성의 닉네임 원하는 사람에게</li>
        <li>짧은 시간에 아이디어 얻음 → 막혀있던 상황 뚫리는 느낌</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>실시간 중복 확인 불가 → 특정 플랫폼에서 이미 사용 중인지 확인 안 됨</li>
        <li>완전히 맘에 드는 게 안 나올 수 있음 → 그때는 제안된 것 조합하거나 변형</li>
        <li>이름 반영 불가 → 본인 이름 기반 닉네임 조합은 지원 안 됨</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">활용 꿀팁</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">닉네임 결정 빠르게 하기</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>원하는 분위기 선택해서 생성</li>
        <li>맘에 드는 거 3~5개 저장</li>
        <li>저장된 것 중에서 최종 결정</li>
        <li>완벽한 걸 찾으려다 시간 날리지 말고 "충분히 좋은 것"으로 결정</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">팀 이름 정하기</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>팀 분위기에 맞는 카테고리 선택</li>
        <li>생성된 결과 팀원들과 공유</li>
        <li>투표나 랜덤 선택으로 최종 결정</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">여러 계정 관리할 때</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>여러 번 생성해서 각 플랫폼용 닉네임 모음 만들기</li>
        <li>일관성 있게 변형하거나 완전히 다른 닉으로 구분</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>원하는 분위기 선택</li>
        <li>길이 선택 (2글자 ~ 5글자)</li>
        <li>생성 버튼 클릭</li>
        <li>마음에 드는 것 저장 또는 복사</li>
      </ol>

      <p className="mb-4">30초면 닉네임 아이디어 10개 이상 확보.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/nickname-generator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 한글 닉네임 생성기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">
        닉네임 때문에 게임 시작 못 하고 있다면 이걸로 빠르게 해결하면 됨.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #닉네임생성기 #한글닉네임 #게임닉네임 #닉네임추천 #랜덤닉네임 #아이디만들기
      </p>
    </article>
  );
}
