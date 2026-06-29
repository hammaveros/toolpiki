import Link from 'next/link';

export default function FortuneCookiePost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">재미/테스트 · 2026년 7월 28일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        하루 시작할 때 뭔가 한마디 필요해서 만든 포춘쿠키
      </h1>

      <p className="mb-4">
        <Link href="/tools/fortune-cookie" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 포춘쿠키 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        아침에 뭔가 좋은 말 한마디 읽으면 하루가 달라지는 느낌이 있음.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 필요한지</h2>

      <p className="mb-3">포춘쿠키나 랜덤 명언이 생각나는 순간들:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>출근 전 아침 루틴 → 커피 한 잔 마시면서 오늘의 명언 한 줄</li>
        <li>기분이 가라앉을 때 → 뭔가 위로나 자극이 되는 말 필요</li>
        <li>결정을 앞두고 → "오늘 운세는 어때?"라는 심리적 확인</li>
        <li>친구에게 보내기 → "오늘의 포춘 뭐 나왔어?" 대화 소재</li>
        <li>SNS 업로드 → 오늘 받은 메시지 공유, 가벼운 콘텐츠</li>
        <li>글 시작할 때 → 블로그나 일기 시작 전 영감 받기</li>
        <li>무기력한 오후 → 잠깐 환기용, 뭔가 읽으면 기분 전환됨</li>
      </ul>

      <p className="mb-4">
        진지하게 운명을 점치는 게 아님. 그냥 하루에 좋은 말 한마디 받아보는 거,
        그 작은 것이 의외로 기분에 영향을 줌.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>명언 앱 → 알림 설정해야 하고, 앱 하나 더 까는 게 싫음</li>
        <li>명언 검색 → 매번 검색하면 광고 먼저 나오고, 영어 명언 위주</li>
        <li>트위터/인스타 계정 팔로우 → 타임라인에 다른 내용도 뜨면서 흐름 깨짐</li>
        <li>달력 명언 → 날짜 지정이라 다양성 없고, 결국 안 보게 됨</li>
        <li>실제 포춘쿠키 → 쿠키 사러 나가야 함, 매일 먹기엔 과함</li>
      </ul>

      <p className="mb-4">
        그냥 버튼 하나 누르면 오늘의 메시지 하나 나오는 게 전부인데, 그게 딱 맞게 구현된 게 없었음.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 직접 만들었음</h2>

      <p className="mb-3">쿠키 열면 메시지 나오는 그 느낌. 버튼 하나면 됨.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">기본 기능:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>포춘쿠키 열기 애니메이션 → 쿠키가 열리면서 메시지 나오는 연출</li>
        <li>랜덤 메시지 → 명언, 격언, 따뜻한 문장 등 다양하게</li>
        <li>한글 문장 → 영어 번역 명언 아닌, 자연스러운 한국어 문장</li>
        <li>메시지 복사 → 카카오톡, SNS에 바로 공유</li>
        <li>새 메시지 뽑기 → 마음에 안 들면 다시</li>
        <li>카테고리 → 동기부여 / 일상 / 유머 등 취향에 맞게</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">메시지 유형:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>동기부여 → 오늘 하루 힘내자는 류의 메시지</li>
        <li>인생 격언 → 짧고 울림 있는 문장</li>
        <li>유머 → 너무 진지하지 않고 웃음 나오는 문장</li>
        <li>소소한 위로 → 지쳤을 때 위로가 되는 말</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>쿠키 여는 애니메이션이 소소하게 재밌음 → 아무것도 아닌데 기분 좋음</li>
        <li>한글 문장이라 와닿음 → 번역 티 안 나는 자연스러운 문장</li>
        <li>30초면 됨 → 아침 루틴에 부담 없이 추가 가능</li>
        <li>공유하기 편함 → 좋은 문장 나오면 바로 카톡 공유</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>메시지 자체 입력 불가 → 내가 원하는 문장 추가 못 함</li>
        <li>즐겨찾기 없음 → 마음에 드는 문장 저장 불가</li>
        <li>하루 1개 제한 없음 → 계속 뽑으면 새것 나오긴 하는데 "오늘의" 느낌 희석</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">활용 꿀팁</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">아침 루틴으로</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>북마크 해두고 아침에 커피 마시면서 바로 열기</li>
        <li>단 하나만 뽑는다는 규칙 정하면 "오늘의 메시지" 느낌 남</li>
        <li>마음에 들면 메모 앱에 저장해두기</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">친구에게 공유</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>"오늘 포춘쿠키 이거 뽑았어" 하면서 카톡 전송</li>
        <li>서로 오늘 뭐 뽑혔는지 공유하면 가벼운 대화 소재 됨</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">무기력할 때</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>힘든 날 동기부여 카테고리로 설정</li>
        <li>마음에 드는 문장 나올 때까지 몇 번 더 뽑기</li>
        <li>억지로라도 좋은 말 읽으면 기분 조금 나아짐</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>카테고리 선택 (선택 안 해도 됨)</li>
        <li>쿠키 클릭</li>
        <li>열리면서 나오는 메시지 읽기</li>
        <li>좋으면 복사, 아니면 다시 뽑기</li>
      </ol>

      <p className="mb-4">5초면 오늘의 메시지 받기 완료.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/fortune-cookie" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 포춘쿠키 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">
        아침마다 북마크 열어서 쿠키 하나 여는 루틴, 생각보다 오래 유지됨.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #포춘쿠키 #랜덤명언 #오늘의명언 #동기부여 #아침루틴 #하루한마디
      </p>
    </article>
  );
}
