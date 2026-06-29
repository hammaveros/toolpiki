import Link from 'next/link';

export default function CharacterCounterPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">텍스트 · 2026년 6월 10일 · 읽는 시간 3분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        글자수 세기 사이트, 광고 없이 쓸 수 없는 건가
      </h1>

      <p className="mb-4">
        <Link href="/tools/character-counter" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 글자수 세기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        블로그 원고 마감 5분 전, 글자수가 2,000자를 넘으면 안 된다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 글자수를 세야 하냐면</h2>

      <p className="mb-3">생각보다 자주 필요하다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>블로그·뉴스레터 원고 → 분량 확인</li>
        <li>카카오톡·SMS 장문 → 90바이트 초과 여부</li>
        <li>공공기관 제출 서류 → "500자 이내" 조건</li>
        <li>SNS 캡션 → 플랫폼별 글자수 제한</li>
        <li>SEO 메타 디스크립션 → 160자 이하 권장</li>
      </ul>

      <p className="mb-4">한 번이 아니라 거의 매번 필요한 작업이다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 사이트들의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>광고가 화면 절반을 차지 → 스크롤 내려야 입력창이 보임</li>
        <li>팝업이 뜸 → 닫고 나서 다시 붙여넣기</li>
        <li>느린 로딩 → 급할 때 더 답답함</li>
        <li>모바일에서 레이아웃 깨짐 → 폰에서 쓰기 불편</li>
      </ul>

      <p className="mb-4">글자수 세는 게 작업의 본론인데, 사이트 탐색이 더 오래 걸리는 상황이 반복됐다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 직접 만들었음</h2>

      <p className="mb-3">입력하면 바로 나온다. 기능은 이것들:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>글자수 (공백 포함 / 공백 제외)</li>
        <li>단어수</li>
        <li>문장수</li>
        <li>문단수</li>
        <li>바이트수 (SMS 발송 기준 필요할 때)</li>
        <li>읽기 예상 시간</li>
      </ul>

      <p className="mb-3">추가로:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>한/영/숫자/특수문자 비율 분석</li>
        <li>글자수 목표 설정 → 달성률 표시</li>
        <li>복사 버튼 → 클립보드에 결과 바로 복사</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>붙여넣는 즉시 결과가 나옴 → 버튼 클릭 필요 없음</li>
        <li>공백 포함/제외 토글이 편함 → 기준 다른 플랫폼마다 바로 전환</li>
        <li>모바일에서도 멀쩡함 → 폰으로도 그냥 씀</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>맞춤법 검사는 없음 → 그건 다른 도구 써야 함</li>
        <li>히스토리 저장 없음 → 창 닫으면 사라짐</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>글을 입력하거나 붙여넣기</li>
        <li>결과 자동으로 나옴</li>
        <li>끝</li>
      </ol>

      <p className="mb-4">2초면 된다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/character-counter" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 글자수 세기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">회원가입 없이 바로 쓸 수 있다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #글자수세기 #글자수계산기 #텍스트도구 #무료도구
      </p>
    </article>
  );
}
