import Link from 'next/link';

export default function NumberGuessPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">재미/테스트 · 2026년 7월 27일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        점심 내기용으로 만든 숫자 맞추기 게임 (업다운)
      </h1>

      <p className="mb-4">
        <Link href="/tools/number-guess" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 숫자 맞추기 게임 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        누가 점심 살지 정할 때 앱 깔기도 뭐하고, 그냥 간단하게 숫자 맞추기 하면 되지 않나.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 필요한지</h2>

      <p className="mb-3">간단한 숫자 게임이 필요한 순간은 꽤 자주 온다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>점심 내기 → 1~100 숫자 맞추기, 틀린 사람이 밥 삼</li>
        <li>당번 정하기 → 가위바위보 질리면 숫자 맞추기로 대결</li>
        <li>아이와 함께 → 숫자 감각 키우는 간단한 게임, 어린이도 할 수 있음</li>
        <li>시간 때우기 → 짧은 대기 중에 혼자 할 수 있는 논리 게임</li>
        <li>친구들과 대결 → 번갈아가며 맞추기, 최소 시도 횟수 경쟁</li>
        <li>집중력 훈련 → 힌트를 바탕으로 범위 좁히는 논리적 사고 연습</li>
        <li>수업 시간 쉬는 시간 활용 → 선생님이 5분 게임으로 활용 가능</li>
      </ul>

      <p className="mb-4">
        업다운 게임은 진입 장벽이 거의 없음. 규칙 설명 30초면 누구든 바로 할 수 있고,
        짧으면 1분, 길면 5분 안에 끝남.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>사람이 직접 숫자 생각 → 힌트 줄 때 실수하거나 중간에 숫자 바꾸는 경우 생김</li>
        <li>카카오톡에서 하는 버전 → 텍스트로 주고받아야 해서 불편하고 느림</li>
        <li>앱 설치 → 1분짜리 게임 하려고 앱 깔기는 너무 무거움</li>
        <li>구글 "number guessing game" → 영어 인터페이스, 한글 없음</li>
        <li>엑셀로 직접 만들기 → RANDBETWEEN 넣고 조건부 서식까지 하면 10분 걸림</li>
      </ul>

      <p className="mb-4">
        생각해보면 사람이 숫자 생각하면 "진짜 그 숫자 맞냐"는 의심이 생길 수 있음.
        컴퓨터가 랜덤으로 정하면 그런 논란 없어짐.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 직접 만들었음</h2>

      <p className="mb-3">컴퓨터가 숫자 정하고, 업다운 힌트 주면서 맞추는 게임.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">기본 기능:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>숫자 범위 설정 → 1~10 / 1~100 / 1~1000 등 난이도 조절 가능</li>
        <li>업/다운/정답 힌트 → 입력한 숫자가 더 크면 "Down", 작으면 "Up"</li>
        <li>시도 횟수 카운트 → 몇 번 만에 맞췄는지 기록</li>
        <li>최소 시도 기록 → 이론상 최소 시도 수 표시 (이진 탐색 기준)</li>
        <li>결과 공유 → "나 7번 만에 맞췄다" 텍스트 복사</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">난이도:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>쉬움 → 1~10 범위, 아이와 함께 가능</li>
        <li>보통 → 1~100 범위, 이진 탐색 쓰면 최대 7번에 가능</li>
        <li>어려움 → 1~1000 범위, 전략적 접근 필요</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>설치 없이 링크 하나면 됨 → 점심 자리에서 바로 폰으로 꺼내면 됨</li>
        <li>공정성 확보 → 컴퓨터가 숫자 정한 거라 의심 없음</li>
        <li>시도 횟수가 바로 나옴 → 누가 더 논리적으로 접근했는지 보임</li>
        <li>반복 플레이 쉬움 → 리셋 한 번이면 새 게임 시작</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>멀티플레이 없음 → 번갈아가며 하는 방식, 동시 대결 불가</li>
        <li>리더보드 없음 → 오늘 최고 기록 저장 안 됨</li>
        <li>커스텀 힌트 없음 → 업다운 외 추가 힌트는 없음</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">활용 꿀팁</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">최소 시도 수 도전</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>1~100 범위에서 이진 탐색 쓰면 이론상 7번 안에 맞출 수 있음</li>
        <li>항상 중간값 (50 → 75 → 62...) 부터 입력하는 방식</li>
        <li>알고리즘 개념 배우는 아이한테 직접 보여주기 좋음</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">내기에 활용할 때</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>범위 미리 합의하고 시작</li>
        <li>번갈아가며 각자 한 게임씩</li>
        <li>시도 횟수 적은 사람이 이기는 방식</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">어린이와 함께</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>1~10 난이도로 시작</li>
        <li>업/다운 개념 알려주면서 같이 맞추기</li>
        <li>숫자 순서 감각 자연스럽게 익힘</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>범위 선택 (1~10 / 1~100 / 1~1000)</li>
        <li>게임 시작 버튼 클릭</li>
        <li>숫자 입력해서 업/다운 힌트 확인</li>
        <li>정답 맞추면 시도 횟수 확인</li>
      </ol>

      <p className="mb-4">한 판에 1~3분. 점심 내기 바로 가능.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/number-guess" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 숫자 맞추기 게임 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">
        로그인 없이 바로 됨. 다음 점심 내기 때 써보기.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #숫자맞추기 #업다운게임 #점심내기 #당번정하기 #간단게임 #숫자게임
      </p>
    </article>
  );
}
