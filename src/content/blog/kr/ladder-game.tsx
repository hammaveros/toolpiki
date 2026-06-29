import Link from 'next/link';

export default function LadderGamePost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">재미/테스트 · 2026년 7월 27일 · 읽는 시간 5분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        당번 정할 때마다 종이 꺼내는 게 귀찮아서 만든 온라인 사다리 타기
      </h1>

      <p className="mb-4">
        <Link href="/tools/ladder-game" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 사다리 타기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        종이에 사다리 그리면 누군가는 선 보면서 짐작한다는 의심이 생겨서.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 필요한지</h2>

      <p className="mb-3">사다리 타기가 필요한 상황, 생각보다 진짜 많음:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>팀 청소 당번 → 이번 주 화장실 당번 누구냐, 매번 싸움</li>
        <li>발표 순서 정하기 → 조별 발표 누가 먼저 할지, 아무도 먼저 하고 싶지 않음</li>
        <li>음식 주문 당번 → 배달 주문 취합하는 사람 정하기</li>
        <li>게임 선공 정하기 → 가위바위보 대신 사다리 타기</li>
        <li>방 배정 → 기숙사나 MT 방 추첨</li>
        <li>역할 분배 → 조별 과제 역할 나누기 (PPT 만들기, 발표, 자료 조사 등)</li>
        <li>심부름 정하기 → 오늘 커피 심부름 누가 갈지</li>
        <li>상품 추첨 → 이벤트 경품을 참가자 중 한 명한테 주기</li>
      </ul>

      <p className="mb-4">
        종이에 사다리 그릴 때 문제가 하나 있음. 그리는 사람이 선 위치를 보면서 짐작할 수 있다는 것.
        그리고 나중에 "내가 어떤 선 탔는지 봤잖아" 같은 논란도 생김.
        컴퓨터가 만들면 그런 논란 자체가 없어짐.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>종이에 직접 → 그리는 사람이 미리 볼 수 있음, 종이 없을 때 불가능</li>
        <li>앱 검색 → "사다리 타기" 치면 광고 가득한 앱 나옴, 설치해야 함</li>
        <li>카카오톡 사다리 게임 → 쓰기 불편하고 참가자 수 제한 있음</li>
        <li>랜덤 뽑기로 대체 → 사다리 특유의 "선 따라가는" 느낌이 없어서 아쉬움</li>
        <li>포털 "사다리 타기" → 있긴 한데 UI가 오래됐고 모바일에서 불편</li>
      </ul>

      <p className="mb-4">
        사다리 타기의 묘미는 결과를 모른 채 선을 따라가는 긴장감인데,
        기존 앱들은 그걸 살리면서 쓰기 편한 게 별로 없었음.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 직접 만들었음</h2>

      <p className="mb-3">이름 넣고, 결과 넣고, 버튼 누르면 사다리 완성. 선 따라가는 애니메이션도 있음.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">기본 기능:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>참가자 이름 입력 → 최대 10명까지</li>
        <li>결과 항목 입력 → 당번, 역할명, 상품명 등 자유롭게</li>
        <li>사다리 자동 생성 → 가로 연결선 무작위로 배치</li>
        <li>선 따라가기 애니메이션 → 각자 어느 결과로 가는지 시각적으로 확인</li>
        <li>전체 공개 → 한 번에 모든 결과 표시</li>
        <li>개별 공개 → 한 명씩 결과 확인 (긴장감 극대화)</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">결과 표시 방식:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>전체 동시 공개 → 시간 없을 때 한 번에</li>
        <li>한 명씩 공개 → 발표 분위기 만들고 싶을 때</li>
        <li>결과 복사 → "김철수 - 화장실 청소" 형식으로 텍스트 복사</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>선 따라가는 애니메이션이 실제 사다리 타는 느낌 살려줌 → 분위기 좋음</li>
        <li>공정성 논란 없음 → 컴퓨터가 생성한 거라 아무도 이의 못 제기</li>
        <li>모바일에서도 잘 됨 → 회의실에서 폰으로 바로 실행</li>
        <li>결과 텍스트 복사 → 단톡방에 바로 공유</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>인원 제한 있음 → 너무 많으면 사다리가 복잡해짐</li>
        <li>결과 저장 없음 → 페이지 닫으면 이전 결과 사라짐</li>
        <li>사다리 재사용 불가 → 같은 사다리로 다음에 또 쓰기 어려움</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">활용 꿀팁</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">당번 정할 때</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>이름 입력, 결과에 "청소" / "청소 면제" 입력</li>
        <li>한 명씩 공개해서 긴장감 올리기</li>
        <li>결과 캡처해서 증거 남기기</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">역할 분배할 때</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>이름에 팀원 이름, 결과에 역할 (발표/PPT/조사/정리) 입력</li>
        <li>한 번에 공개</li>
        <li>결과 복사해서 팀 단톡에 공유</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">MT 방 배정</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>이름 넣고 방 번호나 방 이름 넣기</li>
        <li>개별 공개로 분위기 살리기</li>
        <li>화면 공유하면서 하면 현장 반응 좋음</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>참가자 이름 입력 (한 줄에 하나씩)</li>
        <li>결과 항목 입력 (이름 수와 동일하게)</li>
        <li>사다리 생성 버튼 클릭</li>
        <li>전체 공개 또는 개별 공개 선택</li>
        <li>결과 확인 후 복사</li>
      </ol>

      <p className="mb-4">준비에서 결과까지 1분이면 충분.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/ladder-game" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 사다리 타기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">
        다음 당번 정할 때 종이 대신 이걸로 해봐. 논란 없이 깔끔하게 끝남.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #사다리타기 #당번정하기 #역할배정 #온라인사다리 #청소당번 #발표순서
      </p>
    </article>
  );
}
