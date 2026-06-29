import Link from 'next/link';

export default function OrderPickerPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">재미/테스트 · 2026년 7월 25일 · 읽는 시간 3분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        발표 순서를 종이 제비뽑기로 정하던 팀에서 쓰기 시작한 순서 무작위 뽑기
      </h1>

      <p className="mb-4">
        <Link href="/tools/order-picker" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 순서 무작위 뽑기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        "이번 발표 순서는... 음..." 하고 리더가 임의로 지목하면 항상 같은 사람이 첫 번째 걸리는 느낌이 있음. 공정하게 하고 싶으면 랜덤이 답.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 필요한지</h2>

      <p className="mb-3">순서를 정해야 하는 상황은 생각보다 많다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>팀 발표 순서 → 누가 먼저 발표할지 공정하게 정하기</li>
        <li>스프린트 데모 발표자 → 매번 같은 사람 먼저 하기 싫을 때</li>
        <li>코드 리뷰 순서 → 팀원들 리뷰 순서 돌아가면서 정하기</li>
        <li>스터디 발표 순서 → 각 챕터 담당자 배정</li>
        <li>업무 배분 → 처리할 티켓 순서 랜덤 배정</li>
        <li>게임 선공 정하기 → 보드게임, 카드게임 시작 순서</li>
        <li>동아리 활동 → 운영진 발언 순서, 당번 배정</li>
        <li>회식 자리 배치 → 테이블 자리 순서 정하기</li>
        <li>번호표 없이 줄 세우기 → 선착순이 애매할 때 공정한 순서</li>
      </ul>

      <p className="mb-4">"순서를 정해야 하는데 아무도 선뜻 나서지 않는" 그 어색한 침묵을 없애줌. 이걸 도구 하나로 해결할 수 있음.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>리더가 임의 지목 → 공정하지 않다고 느끼는 사람 생김, 매번 비슷한 순서</li>
        <li>가위바위보 → 사람 많으면 진행이 복잡해지고 시간 오래 걸림, 토너먼트 방식이면 더 복잡</li>
        <li>종이 제비뽑기 → 번호 적고 접고 나눠주는 데 시간 걸림, 온라인 미팅에서는 불가</li>
        <li>알파벳/가나다 순 → 항상 비슷한 사람이 앞에 오게 됨, 고정되는 느낌</li>
        <li>엑셀 RAND 함수 → 매번 파일 열어야 하고, 모바일에서 쓰기 어려움</li>
        <li>직접 숫자 쓰고 뽑기 → 오프라인에선 되지만 원격 협업에선 답 없음</li>
      </ul>

      <p className="mb-4">특히 원격 근무가 많아진 요즘 종이 제비뽑기나 가위바위보는 더 이상 현실적인 방법이 아님. 화상 미팅 도중에 순서 정하려면 모두가 볼 수 있는 디지털 도구가 필요함.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 직접 만들었음</h2>

      <p className="mb-3">이름 목록 넣고 버튼 누르면 랜덤으로 섞인 순서 나옴.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">기본 기능:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>항목 입력 → 이름이나 팀명 등 줄바꿈으로 여러 개 붙여넣기 가능</li>
        <li>무작위 섞기 → 버튼 한 번으로 전체 순서 랜덤 재배열</li>
        <li>결과 표시 → 1번부터 N번까지 번호 붙여서 출력</li>
        <li>다시 섞기 → 마음에 안 들면 다시 돌리기</li>
        <li>결과 복사 → 슬랙, 단톡방에 바로 공유 가능한 텍스트 복사</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">추가 기능:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>항목 편집 → 실수로 입력한 거 바로 수정 가능</li>
        <li>제외 설정 → 특정 항목 빼고 섞기</li>
        <li>애니메이션 → 섞이는 과정 보여줘서 현장 분위기 업</li>
        <li>이전 결과 유지 → 새로고침해도 마지막 설정 남아있음</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>공정성 이슈 없음 → 결과가 완전 랜덤이라 "왜 나만 맨날 첫 번째야" 소리 안 나옴</li>
        <li>화상 미팅 중에 바로 사용 가능 → 화면 공유하면서 실시간으로 진행</li>
        <li>복붙으로 빠른 입력 → 이름 목록을 구글 스프레드시트나 슬랙에서 복붙 한 번</li>
        <li>결과 공유 쉬움 → 복사해서 채팅창에 붙여넣기, 1~N 순서로 깔끔하게 나옴</li>
        <li>모바일에서도 잘 됨 → 회의 중에 폰으로 해도 됨</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>팀 목록 저장 없음 → 매번 같은 팀원 이름 다시 입력해야 함</li>
        <li>가중치 없음 → 특정 사람이 더 자주 나오게 하는 기능 없음</li>
        <li>그룹 분류 없음 → 결과를 팀별로 나누는 기능은 없음 (이건 무작위 선택기 활용 추천)</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">활용 꿀팁</h2>

      <p className="mb-3">이런 식으로 쓰면 더 효율적:</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">팀 발표 순서 정할 때</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>회의 시작 전에 미리 준비해두기</li>
        <li>화면 공유하고 팀원들 다 보는 앞에서 섞기 → 공정성 어필</li>
        <li>결과 슬랙에 공유 → "오늘 발표 순서입니다" 한마디로 정리</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">스터디 발표자 배정할 때</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>챕터 목록이랑 사람 목록 각각 랜덤 섞기</li>
        <li>순서 매칭해서 "챕터1 → 발표자1" 형태로 배정</li>
        <li>이미 한 번 발표한 사람은 제외 기능으로 빼기</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">코드 리뷰 순서 정할 때</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>PR 목록 입력하고 섞기</li>
        <li>우선순위 없이 공정하게 리뷰 순서 정함</li>
        <li>팀원 이름 넣고 섞어서 리뷰어 배정에도 활용</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>이름/항목 입력 (한 줄에 하나씩, 붙여넣기도 OK)</li>
        <li>순서 섞기 버튼 클릭</li>
        <li>결과 확인</li>
        <li>마음에 안 들면 다시 섞기</li>
        <li>결과 복사해서 공유</li>
      </ol>

      <p className="mb-4">10초면 끝남. 가위바위보보다 빠르고 공정함.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/order-picker" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 순서 무작위 뽑기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">다음 팀 미팅에서 발표 순서 정해야 할 때 북마크 해두고 꺼내면 됨. 설치 없이 바로 됨.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #순서뽑기 #랜덤순서 #발표순서정하기 #팀순서 #제비뽑기대체 #공정한순서결정
      </p>
    </article>
  );
}
