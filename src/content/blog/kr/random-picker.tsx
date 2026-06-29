import Link from 'next/link';

export default function RandomPickerPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">계산기 · 2026년 6월 17일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        팀 추첨을 엑셀로 하다가 결국 포기하고 만든 무작위 선택기
      </h1>

      <p className="mb-4">
        <Link href="/tools/random-picker" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 무작위 선택기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        오늘 점심 뭐 먹을지 또 10분째 회의 중. 누군가가 그냥 결정해줬으면.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 필요한지</h2>

      <p className="mb-3">막상 생각해보면 이런 상황이 정말 많다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>팀 점심 메뉴 결정 → 의견이 5개라 결론이 안 남</li>
        <li>당번 정하기 → 청소 당번, 발표 순서, 발표자 지목</li>
        <li>팀 나누기 → 운동회, 스터디, 프로젝트 팀</li>
        <li>이벤트 경품 추첨 → 댓글 닉네임 중에서 공정하게 뽑기</li>
        <li>순서 정하기 → 게임 선공, 회의 발언 순서</li>
        <li>메뉴 고르기 → 배달 앱 열었는데 선택 장애 올 때</li>
        <li>여행지 후보 중 하나 → 못 정하겠으면 그냥 랜덤</li>
        <li>공부 주제 고르기 → 복습할 챕터 랜덤 선택</li>
      </ul>

      <p className="mb-4">"뭘 먹을지 몰라서 못 먹는다"는 결정 장애는 생각보다 자주, 그리고 진지하게 발목을 잡는다. 사소해 보이지만 정작 그 자리에 있으면 진짜 결론이 안 남.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>주사위 굴리기 → 선택지가 6개 이상이면 답 없음</li>
        <li>가위바위보 → 사람 수 많아지면 진행이 복잡해짐</li>
        <li>엑셀 RAND 함수 → 매번 파일 열고 붙여넣기 해야 함, 번거로움</li>
        <li>랜덤 뽑기 앱 설치 → 광고 많고, 항목 입력하는 UI가 불편한 경우 많음</li>
        <li>구글 "random number generator" → 범위 지정은 되는데 목록에서 하나 고르는 건 안 됨</li>
        <li>메모장에 번호 붙이고 랜덤 숫자 → 사람 수 많으면 대응표 만들어야 함</li>
      </ul>

      <p className="mb-4">결국 "그냥 아무나 손 들어봐" 로 끝나는 경우가 많음. 공정성 논란도 생기고.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 직접 만들었음</h2>

      <p className="mb-3">항목 넣고 버튼 하나 누르면 끝.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">기본 기능:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>항목 여러 개 입력 → 무작위로 하나 선택</li>
        <li>중복 없는 여러 개 뽑기 → 팀 나누기, 순서 정할 때 활용</li>
        <li>가중치 설정 → 특정 항목이 더 많이 뽑히게 설정 가능</li>
        <li>룰렛 애니메이션 → 결과 나오는 과정이 보임, 분위기 있음</li>
        <li>결과 복사 → 카카오톡이나 슬랙에 바로 공유</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">항목 입력 방식:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>줄바꿈으로 구분 → 붙여넣기 한 번으로 여러 항목 한번에 입력</li>
        <li>항목별 추가·삭제 가능 → 뽑기 전에 수정 OK</li>
        <li>이전 항목 유지 → 페이지 새로고침 해도 입력한 항목 남아 있음</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>항목 붙여넣기로 한 번에 처리 → 이름 10명이든 30명이든 그냥 복붙</li>
        <li>룰렛 돌아가는 거 보여주면 분위기가 살음 → 팀 행사에서 쓸 만함</li>
        <li>중복 제거 뽑기 → 이미 뽑힌 사람 자동 제외돼서 순서 정하기 딱 맞음</li>
        <li>모바일에서도 잘 됨 → 회의실에서 폰으로 바로 실행</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>항목 저장 기능 없음 → 매번 새로 입력해야 함 (로컬 유지는 됨)</li>
        <li>결과 기록 없음 → 뽑기 결과 히스토리 확인 불가</li>
        <li>이미지 업로드 뽑기는 없음 → 텍스트 항목만 지원</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">활용 꿀팁</h2>

      <p className="mb-3">이런 식으로 쓰면 더 편함:</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">팀 추첨할 때</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>이름 목록을 줄바꿈으로 붙여넣기</li>
        <li>"여러 개 뽑기" 설정해서 팀 1 인원 수만큼 뽑기</li>
        <li>남은 사람이 팀 2</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">발표 순서 정할 때</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>이름 넣고 중복 없이 전체 뽑기 선택</li>
        <li>결과가 1번~n번 순서로 나옴</li>
        <li>복사해서 슬랙이나 단톡방에 공유</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">점심 메뉴 고를 때</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>먹고 싶은 후보 5~6개 입력</li>
        <li>룰렛 돌리면 결론 남</li>
        <li>"뭐 먹을까" 논쟁 끝</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>항목 입력 (한 줄에 하나씩, 또는 붙여넣기)</li>
        <li>몇 개 뽑을지 설정</li>
        <li>뽑기 버튼 클릭</li>
        <li>결과 확인</li>
      </ol>

      <p className="mb-4">10초면 끝난다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/random-picker" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 무작위 선택기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">설치 없이 바로 쓸 수 있다. 다음 팀 추첨 전에 북마크 해두면 편함.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #무작위선택기 #랜덤뽑기 #팀추첨 #메뉴결정 #당번정하기 #결정장애해결
      </p>
    </article>
  );
}
