import Link from 'next/link';

export default function ChatPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">재미/테스트 · 2026년 8월 3일 · 읽는 시간 3분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        재택하다 심심할 때, 아무나랑 잠깐 수다 떨 데가 없더라
      </h1>

      <p className="mb-4">
        <Link href="/chat" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 랜선 탕비실 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        하루 종일 집에서 혼자 일하다 보면, 회사 탕비실에서 잠깐 떠들던 그 5분이 은근히 그립다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 이런 게 필요하냐면</h2>

      <p className="mb-3">생각보다 자주 있다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>재택근무 중 점심 → 혼밥하다 사람 소리 그리울 때</li>
        <li>야근하다 집중 끊길 때 → 잠깐 딴 얘기하고 리셋하고 싶을 때</li>
        <li>주말에 혼자 있을 때 → 딱히 목적 없이 그냥 떠들고 싶을 때</li>
        <li>새벽에 잠 안 올 때 → 아무나랑 시답잖은 얘기하고 싶을 때</li>
      </ul>

      <p className="mb-4">거창한 대화 말고, 그냥 가벼운 잡담이 필요한 순간이다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 채팅들의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>회원가입부터 요구 → 잠깐 떠들고 싶을 뿐인데 이메일 인증까지</li>
        <li>프로필 사진, 자기소개 → 부담스러움</li>
        <li>오픈채팅은 광고·홍보봇 천지 → 대화가 안 됨</li>
        <li>기록이 계속 남음 → 편하게 말 못 함</li>
      </ul>

      <p className="mb-4">그냥 익명으로 들어가서 잠깐 떠들다 나오고 싶은데, 그게 왜 이렇게 번거로운지.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">들어가면 랜덤 닉네임이 배정된다. 그게 전부다.</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>회원가입 없음 → 접속하면 바로 대화</li>
        <li>익명 랜덤 닉네임 → 프로필 만들 필요 없음</li>
        <li>실시간 채팅 → 지금 접속한 사람들과 바로 수다</li>
        <li>가벼운 분위기 → 탕비실처럼 잠깐 쉬었다 가는 공간</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>진입 장벽이 없음 → 심심할 때 그냥 켜서 잠깐 봄</li>
        <li>익명이라 부담 없음 → 아무 말이나 편하게</li>
        <li>기록에 얽매이지 않음 → 나가면 끝</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>시간대에 따라 사람이 없을 수 있음 → 붐빌 때 들어가야 재밌음</li>
        <li>깊은 대화용은 아님 → 어디까지나 가벼운 잡담용</li>
      </ul>

      <p className="mb-4">익명 공간이니까 서로 예의는 지키면서 쓰면 딱 좋다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>접속하기</li>
        <li>랜덤 닉네임 배정됨</li>
        <li>바로 대화 시작</li>
      </ol>

      <p className="mb-4">1초면 된다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/chat" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 랜선 탕비실 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">회원가입 없이 익명으로 바로 들어갈 수 있다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #랜선탕비실 #익명채팅 #실시간채팅 #재택근무 #무료도구
      </p>
    </article>
  );
}
