import Link from 'next/link';

export default function LottoGeneratorPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">재미/테스트 · 2026년 7월 28일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        매주 번호 고르는 게 귀찮아서 만든 로또 번호 생성기
      </h1>

      <p className="mb-4">
        <Link href="/tools/lotto-generator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 로또 번호 생성기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        매번 "오늘은 이 번호로" 하고 고르는 게 의미 없다는 걸 알면서도 매주 고민하고 있었음.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 필요한지</h2>

      <p className="mb-3">로또 번호 생성기가 필요한 상황:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>매주 로또 살 때 → "이번 주 번호 뭐로 하지" 고민이 매주 반복됨</li>
        <li>번호 기억이 귀찮을 때 → 자동 번호 맡기기 전에 직접 뽑아보고 싶을 때</li>
        <li>여러 게임 구매할 때 → 5게임, 10게임 번호 일일이 고르기 피곤함</li>
        <li>친구들과 같이 살 때 → 각자 번호 제안하다가 못 정하면 랜덤</li>
        <li>번호 통계 활용 → 자주 나온 번호, 안 나온 번호 조합 생성</li>
        <li>운세 믿는 날 → 생년월일 기반 번호 같은 변형 방식 원할 때</li>
      </ul>

      <p className="mb-4">
        로또는 완전 랜덤이라 번호 선택이 당첨 확률에 영향 없음. 그래서 그냥 빠르게 랜덤으로 뽑는 게 제일 합리적임.
        매주 번호 고민에 10분 쓰는 시간 아끼는 게 진짜 목적.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>로또 앱 자동 번호 → 어떤 알고리즘인지 모르겠음, 신뢰 애매</li>
        <li>직접 선택 → 같은 번호 반복하거나, 특정 숫자 편애하는 패턴 생김</li>
        <li>구글 "로또 번호 생성기" → 있긴 한데 광고 많고 UI 불편</li>
        <li>엑셀 RANDBETWEEN → 중복 없는 6개 생성 공식이 생각보다 복잡함</li>
        <li>연필로 눈 감고 찍기 → 그것도 하나의 방법이긴 한데, 디지털 시대에 맞지 않음</li>
      </ul>

      <p className="mb-4">
        그냥 버튼 하나로 1~45에서 중복 없는 6개 나오면 됨. 그게 전부인데 간단하게 되는 게 없었음.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 직접 만들었음</h2>

      <p className="mb-3">버튼 누르면 1~45 숫자 6개 나옴. 게임 수만큼 한 번에 생성 가능.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">기본 기능:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>번호 생성 → 1~45에서 중복 없는 6개 랜덤 선택</li>
        <li>게임 수 설정 → 한 번에 1~10게임 생성 가능</li>
        <li>번호 정렬 → 오름차순으로 자동 정렬, 실제 로또 번호처럼 표시</li>
        <li>번호 복사 → 텍스트로 복사해서 메모 앱이나 단톡에 공유</li>
        <li>재생성 → 마음에 안 들면 버튼 다시 누르면 됨</li>
        <li>번호 색상 구분 → 실제 로또 공처럼 구간별 다른 색상</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">추가 기능:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>최근 당첨 번호 참고 → 최근 회차 번호 보면서 번호 감 잡기</li>
        <li>번호 제외 설정 → 특정 번호 제외하고 생성 가능</li>
        <li>번호 고정 → 특정 번호 반드시 포함하고 나머지 랜덤으로 채우기</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>10초면 5게임 번호 생성 완료 → 편의점 가기 전에 폰으로 뽑아두면 됨</li>
        <li>번호 색상이 실제 로또 공처럼 나와서 보기 좋음</li>
        <li>여러 게임 한 번에 생성 → 5게임 사려면 5번 뽑기 귀찮은데 한 번에 됨</li>
        <li>광고 없음 → 빠르게 쓰고 나올 수 있음</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>당첨 확률 높이는 방법은 없음 → 완전 랜덤이라 전략적 선택 의미 없음</li>
        <li>번호 저장 없음 → 이번 주 산 번호 기록 안 남</li>
        <li>당첨 확인 기능 없음 → 직접 공식 사이트에서 확인해야 함</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">로또 확률 이야기</h2>

      <p className="mb-3">알면서도 사게 되는 로또에 대해:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>1등 확률 → 약 814만 분의 1</li>
        <li>번호 선택 방식 → 확률에 영향 없음, 어차피 완전 랜덤</li>
        <li>자동 vs 수동 → 당첨 확률 동일, 번호 고르는 수고만 다름</li>
        <li>연속 숫자 → 1,2,3,4,5,6 조합도 당첨 확률 완전히 동일</li>
      </ul>

      <p className="mb-4">
        결국 로또는 "당첨 기대감 1주일 유지비" 정도라는 걸 알면서 사는 거임.
        그 1주일 설레는 느낌이 가치 있으면 사는 거고, 그걸 위한 번호 고르기에 시간 낭비는 줄이는 게 맞음.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>게임 수 선택 (기본 1게임)</li>
        <li>번호 생성 버튼 클릭</li>
        <li>생성된 번호 확인</li>
        <li>마음에 안 들면 재생성, 맞으면 복사 후 구매</li>
      </ol>

      <p className="mb-4">10초면 로또 번호 선택 완료.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/lotto-generator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 로또 번호 생성기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">
        이번 주 로또 사기 전에 번호 뽑아두면 편의점에서 시간 안 잡아먹힘.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #로또번호생성기 #로또번호 #로또자동 #로또수동 #로또번호추천 #랜덤번호
      </p>
    </article>
  );
}
