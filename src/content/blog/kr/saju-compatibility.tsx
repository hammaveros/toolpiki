import Link from 'next/link';

export default function SajuCompatibilityPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">재미/테스트 · 2026년 8월 1일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        사주 궁합, 연애할 때 한 번쯤은 봐보게 되더라
      </h1>

      <p className="mb-4">
        <Link href="/tools/saju-compatibility" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 사주 궁합 보기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        "우리 궁합 어때?" → 모름 → 찝찝함 → 결국 찾아보게 됨.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">궁합 얘기가 나오는 순간들</h2>

      <p className="mb-3">연애 초반에 유독 자주 나오는 주제다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>처음 만나서 생년월일 얘기 나올 때 → "우리 궁합 좋을 것 같지 않아?"</li>
        <li>사귀기 전 썸 단계 → "혹시 우리 궁합이 안 좋으면 어쩌지" 같은 생각</li>
        <li>부모님이 물어볼 때 → "상대방 생년월일이 어떻게 돼?"</li>
        <li>주변 친구들이 궁합 봐줬다고 할 때 → "나도 봐야 하나"</li>
        <li>오래된 커플인데 싸움이 잦을 때 → "우리 사주가 안 맞는 건 아닐까"</li>
      </ul>

      <p className="mb-4">믿지 않아도 괜히 신경 쓰이는 게 궁합이다. 좋다고 하면 기분 좋고, 나쁘다고 하면 묘하게 신경 쓰인다. 이게 사람 심리인 것 같다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">전통적인 방법의 한계</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>철학관 → 두 사람이 같이 가야 함 / 비용 10~20만원 / 예약 필요</li>
        <li>포털 사이트 무료 궁합 → 둘의 띠만 보는 수준 → 너무 단순</li>
        <li>유튜브 "띠 궁합" → 12띠 조합만 나옴 → 실제 사주 궁합이 아님</li>
        <li>앱 → 설치 귀찮음, 가입 필요, 알림 폭탄</li>
      </ul>

      <p className="mb-4">제대로 된 사주 궁합은 단순히 띠가 아니라 두 사람의 사주팔자 전체를 비교해야 한다. 그런데 그걸 제대로 봐주는 곳은 철학관 수준이고, 무료 사이트들은 너무 단순화되어 있다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">두 사람의 생년월일시를 넣으면 사주팔자 기반 궁합을 분석해주는 도구다.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">입력하는 것:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>두 사람 각각의 생년월일 (양력/음력 선택)</li>
        <li>태어난 시간 (모르면 미상 선택)</li>
        <li>성별</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">나오는 것들:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>두 사람의 일간 조합 분석 (천간 상호작용)</li>
        <li>오행 균형 비교 → 서로 부족한 부분을 채워주는지 여부</li>
        <li>합충 분석 → 서로 끌리는 기운이 있는지, 충돌하는 기운이 있는지</li>
        <li>궁합 총점 (100점 기준)</li>
        <li>애정운, 성격 궁합, 생활 습관 궁합 세부 분석</li>
        <li>함께하면 좋은 점, 주의해야 할 점 요약</li>
      </ul>

      <p className="mb-4">단순 "좋다/나쁘다"가 아니라 구체적으로 어떤 부분이 잘 맞고 어떤 부분이 다른지 보여준다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">궁합을 보는 게 연애에 도움이 되나</h2>

      <p className="mb-4">사주 궁합이 연애를 결정해야 한다고 생각하지 않는다. 궁합 점수 낮다고 헤어지는 건 말이 안 되고, 높다고 무조건 잘 된다는 것도 아니다.</p>

      <p className="mb-4">그런데 궁합 분석이 의외로 유용할 때가 있다. "왜 자꾸 이 부분에서 마찰이 생기지?"라는 걸 생각할 때 사주적 관점이 하나의 렌즈가 될 수 있다. "아, 이 사람은 이런 성향이라서 내 방식이랑 충돌할 수 있구나"라는 이해의 계기가 되는 거다.</p>

      <p className="mb-4">궁합은 서로를 이해하는 도구로 쓸 때 가장 유용하다. 상대방을 판단하거나 관계를 포기하는 근거로 쓰면 의미가 없다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>띠 궁합 수준이 아니라 실제 사주팔자 기반 분석 → 훨씬 구체적</li>
        <li>좋은 점 나쁜 점 둘 다 나옴 → 한쪽으로 치우치지 않음</li>
        <li>상대방 생년월일만 알면 가능 → 상대방한테 직접 물어볼 필요 없음</li>
        <li>링크 공유 가능 → 상대방이랑 같이 볼 수 있음</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>전문 사주 명리가 수준의 심층 분석은 아님 → 입문/재미용</li>
        <li>결과를 너무 진지하게 받아들이면 오히려 해로움 → 참고 정도로</li>
        <li>시간 모르면 정확도 떨어짐 → 가능하면 시간 입력 추천</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>두 사람 각각의 생년월일 입력</li>
        <li>태어난 시간 입력 (선택사항)</li>
        <li>궁합 분석 결과 확인</li>
        <li>원하면 결과 링크 공유</li>
      </ol>

      <p className="mb-4">1분이면 끝난다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/saju-compatibility" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 사주 궁합 보기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">로그인 없이 바로 쓸 수 있다. 결과가 좋게 나오든 나쁘게 나오든 참고용으로만 쓰자.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #사주궁합 #궁합보기 #무료궁합 #연애운 #사주팔자 #커플궁합 #무료도구
      </p>
    </article>
  );
}
