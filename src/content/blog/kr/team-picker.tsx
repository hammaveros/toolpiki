import Link from 'next/link';

export default function TeamPickerPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">재미/테스트 · 2026년 7월 26일 · 읽는 시간 5분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        체육대회 팀 나누기를 엑셀로 하다가 항의 받고 만든 팀 배정기
      </h1>

      <p className="mb-4">
        <Link href="/tools/team-picker" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 팀 무작위 배정 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        30명을 3팀으로 나눠야 하는데, 공정하게 하는 방법이 뭔지 모르겠음.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 필요한지</h2>

      <p className="mb-3">사람을 여러 팀으로 나눠야 하는 상황은 생각보다 자주 온다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>회사 체육대회 → 부서 섞어서 3~4팀 구성, 누가 어디 들어가는지 싸움남</li>
        <li>MT 조 편성 → 레크리에이션 팀 짜기, 친한 사람들끼리 몰리면 곤란</li>
        <li>스터디 그룹 → 8명을 2팀으로 나눠서 각자 주제 발표</li>
        <li>수업 시간 팀 프로젝트 → 교수님이 "알아서 나눠봐" 하는 순간 5분이 지나가도 결론 없음</li>
        <li>팀 대항전 게임 → 배틀 상황에서 인원 균등하게 나누기</li>
        <li>워크숍 조 편성 → 부서나 직급 고려 없이 무작위로</li>
        <li>온라인 회의 → 소회의실 조 나누기, 수동으로 하면 시간 잡아먹음</li>
      </ul>

      <p className="mb-4">
        "공정하게 나누자"는 말은 쉬운데, 막상 앞에서 하려면 어디서부터 시작해야 할지 막막하다.
        번호표 뽑기도 준비물 필요하고, 가위바위보도 5명 넘어가면 복잡하고.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>가위바위보 → 인원 많으면 진행이 너무 길어짐, 중간에 헷갈림</li>
        <li>번호표 뽑기 → 종이 준비, 접기, 통 필요 → 즉흥 상황에선 불가능</li>
        <li>엑셀 RAND() → 공식 짜고 정렬하는 과정 번거롭고 다른 사람 보는 앞에서 하기 어색함</li>
        <li>그냥 교사·사회자가 나누기 → "왜 저 사람이랑 같은 팀이냐"며 민원 들어옴</li>
        <li>순서대로 나누기 → "내가 1번이라서 저 팀 된 거 아니냐"는 불만</li>
        <li>랜덤 앱 사용 → 항목 입력 UI가 불편하거나, 팀 배정 기능이 따로 없음</li>
      </ul>

      <p className="mb-4">
        가장 큰 문제는 결과를 의심받는 것. 직접 나눴을 때 "혹시 일부러 저렇게 나눈 거 아니야?" 소리 들을 수 있음.
        무작위 프로그램이 한 거면 그런 말 나올 여지가 없어짐.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 직접 만들었음</h2>

      <p className="mb-3">이름 붙여넣고 팀 수 입력하면 자동으로 배정해주는 도구.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">기본 기능:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>참가자 이름 목록 입력 → 팀 수 설정하면 자동 배정</li>
        <li>균등 배정 → 인원이 딱 나뉘지 않아도 최대한 균등하게 분배</li>
        <li>팀별 결과 표시 → A팀, B팀, C팀 이름 목록 바로 확인</li>
        <li>결과 복사 → 텍스트로 복사해서 단톡방에 바로 공유</li>
        <li>재배정 버튼 → 결과 마음에 안 들면 다시 돌리기</li>
        <li>팀 이름 커스텀 → A/B/C 대신 "빨강팀/파랑팀"으로 바꾸기</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">입력 방식:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>줄바꿈으로 구분 → 카카오톡 멤버 목록이나 엑셀에서 복붙 가능</li>
        <li>공백·빈 줄 자동 처리 → 복붙하면 이상한 공백 들어오는 거 자동 정리</li>
        <li>이름 중복 제거 → 실수로 같은 이름 두 번 넣어도 한 번만 처리</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>30명 이름 복붙하고 "3팀" 선택하면 5초 안에 끝 → 회의실에서 바로 가능</li>
        <li>결과 복사해서 단톡방에 공유하면 "공정하게 됐다"는 거 모두가 확인 가능</li>
        <li>재배정 눌러도 알고리즘이 하는 거라 "편파 아니냐"는 말 안 나옴</li>
        <li>모바일에서도 됨 → 대면 행사 중에 폰으로 바로 실행</li>
        <li>팀 수 자유롭게 설정 가능 → 2팀~10팀까지 원하는 대로</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>특정 조건 반영 불가 → "이 두 명은 같은 팀 X" 같은 제약 조건 없음</li>
        <li>저장 기능 없음 → 창 닫으면 이름 목록 사라짐 (미리 복사 해둬야 함)</li>
        <li>성별·실력 균형 배려 없음 → 완전 무작위라 스킬 차이나 성비는 알아서 조정 필요</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">활용 꿀팁</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">체육대회·MT 팀 편성할 때</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>참가자 명단 엑셀에서 이름 열만 복사</li>
        <li>붙여넣기 → 팀 수 입력 → 배정</li>
        <li>결과 복사해서 공지 채널에 올리면 끝</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">스터디 그룹 짤 때</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>인원 넣고 2팀 배정</li>
        <li>팀별로 발표 주제 나눠줌</li>
        <li>회차마다 재배정해서 계속 새로운 조합</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">게임 팀 나눌 때</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>닉네임 목록 넣고 배정</li>
        <li>"진 팀이 진짜 랜덤으로 나온 거다"는 공정성 확보</li>
        <li>불만 없이 마무리 가능</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>참가자 이름 입력 (한 줄에 하나씩, 복붙 가능)</li>
        <li>팀 수 설정</li>
        <li>팀 배정 버튼 클릭</li>
        <li>결과 확인 후 복사해서 공유</li>
      </ol>

      <p className="mb-4">준비물 없이 10초면 공정한 팀 편성 완료.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/team-picker" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 팀 무작위 배정 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">
        다음 행사 전에 북마크 해두면 팀 편성 논란에서 해방될 수 있음.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #팀배정 #팀나누기 #무작위팀 #체육대회팀편성 #공정한팀나누기 #조편성
      </p>
    </article>
  );
}
