import Link from 'next/link';

export default function SajuReadingPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">재미/테스트 · 2026년 8월 1일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        사주팔자, 진짜 믿든 안 믿든 한 번쯤은 봐보고 싶잖아
      </h1>

      <p className="mb-4">
        <Link href="/tools/saju-reading" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 사주팔자 보기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        "나 믿는 건 아닌데... 그래도 한 번쯤은 봐야 알잖아"라는 말을 해본 적 있다면.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사주에 관심 가지게 되는 순간들</h2>

      <p className="mb-3">딱히 믿지 않아도 사주가 궁금해지는 타이밍이 있다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>연초 새해 운세 → "올해 운이 어떤지 그냥 궁금해서"</li>
        <li>중요한 결정 앞에서 → 취업, 이직, 이사 등 인생 전환점</li>
        <li>친구가 "너 무슨 띠야? 오행이 뭐야?" 물어볼 때 → 아무것도 모름</li>
        <li>회사 사람이 사주 얘기할 때 → 모르면 대화 끊김</li>
        <li>썸 탈 때 "우리 궁합 어때?" → 모르면 낭패</li>
        <li>그냥 심심할 때 → "내 사주가 어떻다는 건지 알고 싶어서"</li>
      </ul>

      <p className="mb-4">믿음의 문제와 별개로, 자기 사주를 아는 것 자체가 한국 문화에서는 상식처럼 돼 있다. 혈액형 아는 것처럼.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존에 어떻게 봤냐면</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>철학관 방문 → 예약 필요, 5~10만원 → 가볍게 보기 어려움</li>
        <li>포털 사이트 무료 운세 → 생년월일만 넣으면 나오긴 하는데 광고 범벅</li>
        <li>앱 설치 → 설치하기 귀찮음, 알림 허용 요청 → 결국 지움</li>
        <li>유튜브 "띠별 운세" → 내 띠 편 찾는 데 오래 걸림</li>
        <li>네이버 사주 검색 → 여러 사이트 중 어디가 좋은지 모름</li>
      </ul>

      <p className="mb-4">가볍게 궁금한데, 접근하는 과정이 너무 무거웠다. 앱 설치하거나 광고 엄청난 사이트 들어가거나, 아니면 철학관에 직접 가거나.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">생년월일시 넣으면 사주팔자 분석 바로 나오는 도구다. 광고 없이, 앱 설치 없이.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">입력하는 것:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>생년월일 (양력/음력 선택 가능)</li>
        <li>태어난 시간 (모르면 미상 선택 가능)</li>
        <li>성별</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">나오는 것들:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>사주팔자 기둥 (년주·월주·일주·시주)</li>
        <li>일간(나를 나타내는 천간)과 오행 분석</li>
        <li>십신 구성 (비겁·식상·재성·관성·인성)</li>
        <li>용신과 기신 (나에게 좋은 기운, 나쁜 기운)</li>
        <li>성격 특성, 직업 적성, 재물운, 건강운 요약</li>
        <li>대운 흐름 (10년 단위 운의 흐름)</li>
      </ul>

      <p className="mb-4">재미로 보는 거니까 너무 심각하게 받아들일 필요는 없지만, 사주 이론 자체는 제대로 반영했다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사주를 왜 아직도 보는 건지</h2>

      <p className="mb-4">사주가 미신이라는 건 알면서도 보는 이유가 있다. 자기 자신에 대해 뭔가 정리된 언어로 설명을 듣고 싶은 거다. "너는 이런 성향이야, 이런 걸 잘해, 이런 부분을 조심해"라는 말을 누군가가 해줄 때 위안이 되는 것처럼.</p>

      <p className="mb-4">심리학적으로는 확증 편향이나 바넘 효과(모호하고 일반적인 내용을 자신에게 맞는다고 느끼는 것)로 설명하기도 하는데, 그게 어쨌든 "내 얘기인 것 같다"는 느낌이 드는 건 사실이다.</p>

      <p className="mb-4">거기다 사주는 단순 운세를 넘어서 음양오행이라는 꽤 체계적인 동양 철학 체계를 바탕으로 한다. 관심 있게 보다 보면 생각보다 구조가 있다는 걸 알게 된다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>생년월일 넣으면 바로 결과 → 30초면 나옴</li>
        <li>설명이 있어서 처음 보는 사람도 이해 가능 → 사주 용어 모르면 뭔 말인지 모르는데, 그 설명을 같이 해줌</li>
        <li>광고 없이 깔끔하게 볼 수 있음 → 이게 제일 좋았음</li>
        <li>공유 기능 → 친구한테 보내서 같이 보기 가능</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>철학관 방문이나 전문 사주 프로그램 수준의 깊이는 아님 → 가볍게 입문용</li>
        <li>태어난 시간 모르면 시주가 빠져서 정확도 낮아짐 → 부모님께 물어봐야 함</li>
        <li>결과를 너무 진지하게 받아들이면 안 됨 → 재미 + 참고 용도</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>생년월일 입력 (양력/음력 선택)</li>
        <li>태어난 시간 입력 (모르면 미상 선택)</li>
        <li>성별 선택</li>
        <li>분석 결과 확인</li>
      </ol>

      <p className="mb-4">1분이면 충분하다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/saju-reading" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 사주팔자 보기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">로그인 없이 바로 쓸 수 있다. 믿든 안 믿든 한 번쯤 봐보는 거 나쁘지 않다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #사주팔자 #사주보기 #무료사주 #운세 #오행 #동양철학 #무료도구
      </p>
    </article>
  );
}
