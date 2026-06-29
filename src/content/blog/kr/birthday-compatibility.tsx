import Link from 'next/link';

export default function BirthdayCompatibilityPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">재미/테스트 · 2026년 7월 30일 · 읽는 시간 5분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        혈액형 궁합 궁금해서 찾다가 광고 범벅 사이트에 질려 만든 생일/혈액형 궁합 테스트
      </h1>

      <p className="mb-4">
        <Link href="/tools/birthday-compatibility" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 생일/혈액형 궁합 테스트 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        "A형이랑 B형은 안 맞는다던데"라는 말 계속 들었는데 실제로 어떻게 나오나 궁금했음.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 필요한지</h2>

      <p className="mb-3">생일/혈액형 궁합이 궁금해지는 순간들:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>새 연인 생겼을 때 → "우리 혈액형 궁합은?" 이라는 생각 한 번쯤 해봄</li>
        <li>처음 만난 사람과 → 혈액형 물어보고 머릿속으로 바로 궁합 생각하는 버릇</li>
        <li>친구들과 술자리 → "A형이랑 B형이 진짜 안 맞냐"는 대화 소재</li>
        <li>소개팅 후 → 상대방 생년월일 기반 궁합 재미로 확인</li>
        <li>별자리 궁합 + 혈액형 궁합 함께 보기 → 결과 일치하는지 비교</li>
        <li>팀 분위기 파악 → 팀원들 혈액형 넣어서 어떤 조합인지 보기</li>
        <li>결혼 앞두고 → 진지하게 믿는 건 아닌데 그래도 보고 싶음</li>
      </ul>

      <p className="mb-4">
        혈액형 궁합은 과학적 근거가 없다는 걸 대부분 알지만, 그럼에도 보게 되는 건 인간 심리임.
        "재밌으면 됐지"라는 마음으로 가볍게 확인하는 거.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>혈액형 궁합 사이트 → 광고 3~4개씩 뜨고, 팝업도 나오고 피곤함</li>
        <li>앱 설치 → 혈액형 궁합 하나 보려고 앱 까는 건 과함</li>
        <li>머릿속 암기 → A형+O형=좋음 같은 조합 외우려다 헷갈림</li>
        <li>블로그 포스팅 참고 → 정보가 사람마다 달라서 기준이 없음</li>
        <li>생일 기반 궁합 → 별자리/사주 등 여러 방식 섞여서 뭐가 맞는지 모름</li>
      </ul>

      <p className="mb-4">
        혈액형 두 개 입력하면 결과 바로 나오고, 광고 없이 깔끔하게 보여주는 게 없었음.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 직접 만들었음</h2>

      <p className="mb-3">혈액형 선택하거나 생일 넣으면 궁합 결과 바로 나오는 도구.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">기본 기능:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>혈액형 궁합 → A/B/O/AB 네 가지 조합 16가지 전부 대응</li>
        <li>생일 궁합 → 생년월일 입력하면 별자리 기반 궁합도 함께 계산</li>
        <li>궁합 퍼센트 → 수치로 표현, 코멘트도 함께</li>
        <li>강점/약점 → 이 조합의 장단점 설명</li>
        <li>주의할 점 → 이 궁합에서 마찰이 생기기 쉬운 부분</li>
        <li>결과 공유 → 텍스트 복사, 카카오톡 공유</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">궁합 종류:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>혈액형 궁합 → 연애/우정/업무 각각 다른 결과</li>
        <li>생일 궁합 → 별자리 기반, 생년월일 입력</li>
        <li>혈액형+생일 종합 → 두 가지 합산 종합 점수</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>광고 없음 → 방해 없이 결과에 집중</li>
        <li>혈액형별 설명이 재밌음 → 그냥 퍼센트만 나오는 게 아니라 스토리 있음</li>
        <li>연애/우정/업무 분리 → "연애는 안 맞는데 친구로는 좋음" 같은 세분화</li>
        <li>생일까지 같이 볼 수 있음 → 두 가지 방식 한 곳에서 확인</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>과학적 근거 없음 → 재미용 콘텐츠임을 명확히 인식</li>
        <li>결과가 고정 → 혈액형 조합별로 정해진 결과라 매번 같음</li>
        <li>개인 차이 반영 안 됨 → 같은 혈액형이라도 사람마다 다름</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">활용 꿀팁</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">연인과 함께</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>같이 화면 보면서 결과 읽기</li>
        <li>"강점" 부분을 실제 우리한테 맞는지 이야기 나누기</li>
        <li>진지하게 믿는 게 아니라 대화 소재로 활용</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">새로 만난 사람</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>"혈액형이 어떻게 되세요?" 물어보고 링크 보내기</li>
        <li>결과 공유하면서 대화 자연스럽게 이어가기</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">친구들과 모일 때</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>다들 각자 혈액형 넣어서 결과 비교</li>
        <li>"우리 팀은 이런 조합이네" 하면서 분위기 메이커</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>내 혈액형 선택</li>
        <li>상대방 혈액형 선택</li>
        <li>궁합 보기 버튼 클릭</li>
        <li>결과 및 코멘트 확인</li>
      </ol>

      <p className="mb-4">10초면 결과 확인. 재밌게 보고 가볍게 웃으면 됨.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/birthday-compatibility" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 생일/혈액형 궁합 테스트 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">
        과학은 아닌데, 읽으면 은근 맞는 것 같기도 하고. 그게 재미임.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #혈액형궁합 #생일궁합 #궁합테스트 #A형B형궁합 #별자리궁합 #커플궁합
      </p>
    </article>
  );
}
