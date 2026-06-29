import Link from 'next/link';

export default function NameCompatibilityPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">재미/테스트 · 2026년 7월 29일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        썸 탈 때 이름 궁합 보다가 결국 직접 만든 이름 궁합 테스트
      </h1>

      <p className="mb-4">
        <Link href="/tools/name-compatibility" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 이름 궁합 테스트 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        궁합 사이트에서 이름 입력했더니 결제 페이지 뜸. 그냥 재미로 보려 했는데.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 필요한지</h2>

      <p className="mb-3">이름 궁합이 궁금해지는 순간은 다양함:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>썸 타는 사람 생겼을 때 → "혹시 우리 이름 궁합은?" 라는 생각</li>
        <li>사귀기 전 설레는 시기 → 진지한 결과보다 "재밌으면 충분해" 라는 마음</li>
        <li>친구들과 놀 때 → 아무 이름이나 넣어보면서 웃음 포인트 찾기</li>
        <li>소개팅 전날 → 이름 미리 넣어보면서 긴장 풀기</li>
        <li>연인 기념일 → 처음 이름 넣어봤던 기억 떠올리기</li>
        <li>팀 조합 → 프로젝트 팀원들 이름 넣어보면서 분위기 풀기</li>
        <li>유명인 이름으로 장난 → 배우 커플 이름 넣어보기</li>
      </ul>

      <p className="mb-4">
        이름 궁합은 과학적 근거 없음. 그걸 알면서도 결과가 궁금한 건 인지상정이고,
        그 과정에서 재밌게 웃고 대화 소재가 되면 충분한 거임.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>궁합 사이트 → 기본 결과는 주고 상세는 결제 유도, 광고 폭탄</li>
        <li>점술 앱 → 회원가입 필요, 이름 외 생년월일까지 요구</li>
        <li>네이버 이름 궁합 검색 → 괜찮은 게 있긴 한데 UI가 오래되거나 광고 많음</li>
        <li>손으로 획수 계산 → 규칙 모르면 직접 못 함</li>
        <li>친구한테 부탁 → 내 설레는 마음 들킬 수 있음</li>
      </ul>

      <p className="mb-4">
        이름 두 개 넣고 결과 확인하는 게 전부인데, 광고 없이 가볍게 쓸 수 있는 게 없었음.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 직접 만들었음</h2>

      <p className="mb-3">이름 두 개 입력하면 궁합 퍼센트랑 코멘트 나오는 도구.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">기본 기능:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>이름 두 개 입력 → 한글 이름 기준으로 궁합 계산</li>
        <li>궁합 퍼센트 → 0~100% 결과 표시</li>
        <li>짧은 코멘트 → 퍼센트에 따른 재밌는 설명 문장</li>
        <li>애니메이션 → 결과 발표 전 살짝 기대감 주는 연출</li>
        <li>결과 공유 → 스크린샷 찍거나 텍스트 복사해서 카톡 공유</li>
        <li>다시 테스트 → 다른 이름 조합 바로 시도 가능</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">계산 방식:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>이름 획수 기반 → 한자 획수 계산 방식 적용</li>
        <li>발음 상성 → 이름의 발음적 조화 반영</li>
        <li>완전 재미용 → 믿기보다 즐기기 위한 도구</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>로그인 없이 바로 → 몰래 해봐도 됨, 개인정보 입력 없음</li>
        <li>결과가 재밌게 나옴 → 퍼센트만 나오는 게 아니라 코멘트가 유머 있음</li>
        <li>친구들과 같이 하면 분위기 살아남 → 아무 이름이나 넣어보면서 웃음 나옴</li>
        <li>광고 없음 → 방해 없이 결과에 집중할 수 있음</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>과학적 근거 없음 → 재미용임을 항상 인식해야 함</li>
        <li>동명이인 구분 불가 → 같은 이름이면 같은 결과</li>
        <li>영어 이름 지원 안 됨 → 한글 이름 기준</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">활용 꿀팁</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">대화 소재로 활용</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>링크 공유하면서 "우리 결과 맞혀봐" 식으로 시작</li>
        <li>결과 스크린샷 카톡으로 보내면 대화 자연스럽게 이어짐</li>
        <li>썸 타는 사람에게 "이름 궁합 보자" 하면서 자연스럽게 이름 물어보는 계기</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">모임에서 아이스브레이킹</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>새로 만난 사람들끼리 이름 넣어보기</li>
        <li>결과가 높게 나오면 "우리 천생연분!" 식으로 분위기 가볍게 만들기</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">유명인 이름으로 장난</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>최근 뜬 커플 이름 넣어보기</li>
        <li>역대 인기 커플 이름 조합 넣어보기</li>
        <li>결과 공유하면서 웃음 포인트</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>첫 번째 이름 입력</li>
        <li>두 번째 이름 입력</li>
        <li>궁합 테스트 버튼 클릭</li>
        <li>결과 확인 후 공유</li>
      </ol>

      <p className="mb-4">10초면 결과 나옴. 진지하게 받아들이지 말고 재밌게 즐기기.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/name-compatibility" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 이름 궁합 테스트 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">
        결제 없이, 로그인 없이 바로 확인 가능. 재밌게 즐겨봐.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #이름궁합 #궁합테스트 #이름궁합보기 #커플궁합 #이름테스트 #재미궁합
      </p>
    </article>
  );
}
