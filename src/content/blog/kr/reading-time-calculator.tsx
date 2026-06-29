import Link from 'next/link';

export default function ReadingTimeCalculatorPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">텍스트 · 2026년 7월 3일 · 읽는 시간 3분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        블로그 글 읽는 시간 표시, 독자 이탈률 줄이는 데 진짜 효과 있음
      </h1>

      <p className="mb-4">
        <Link href="/tools/reading-time-calculator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 읽기 시간 계산기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        블로그에 "읽는 시간 3분" 표시를 달고 싶은데, 직접 계산하기가 귀찮다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">읽기 시간 표시가 유용한 이유</h2>

      <p className="mb-3">독자 관점에서:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>긴 글인지 짧은 글인지 미리 알 수 있음 → 읽을지 말지 결정 가능</li>
        <li>시간이 촉박할 때 → 짧은 글만 골라서 읽기</li>
        <li>긴 글을 읽기 시작할 때 → 얼마나 걸릴지 알면 부담이 줄어듦</li>
      </ul>

      <p className="mb-3">블로그 운영자 관점에서:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>이탈률 감소 → 독자가 글을 시작하기 전에 시간을 예측할 수 있음</li>
        <li>신뢰감 → 블로그가 독자를 배려한다는 인상</li>
        <li>글 분량 가이드 → "이 주제는 5분짜리로 써야겠다" 목표 설정</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">읽기 속도 기준이 왜 복잡한가</h2>

      <p className="mb-3">사람마다, 언어마다 읽기 속도가 다르다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>성인 평균 읽기 속도</strong> → 분당 200~300 단어 (영어 기준)</li>
        <li><strong>한국어</strong> → 분당 500~700자 정도 (글자 기준)</li>
        <li><strong>기술 문서/코드</strong> → 일반 글보다 훨씬 느림</li>
        <li><strong>소설/에세이</strong> → 상대적으로 빠름</li>
        <li><strong>이미지 포함</strong> → 이미지당 10~12초 추가 계산</li>
      </ul>

      <p className="mb-4">미디엄(Medium) 등 블로그 플랫폼은 분당 265단어(영어) 기준을 많이 쓴다. 한국어는 200~250자/분을 주로 쓴다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">텍스트 붙여넣으면 읽기 시간 계산해준다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>읽기 시간 (분 단위)</li>
        <li>단어 수 / 글자 수</li>
        <li>읽기 속도 조절 → 빠름/보통/느림 선택</li>
        <li>언어 선택 → 한국어/영어 기준 전환</li>
        <li>코드 포함 여부 → 기술 글 계산 시 속도 조정</li>
      </ul>

      <p className="mb-3">결과 예시:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>"약 3분" → 블로그 헤더에 바로 쓸 수 있는 형식</li>
        <li>"2~4분" → 범위로 표시도 가능</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">콘텐츠 유형별 권장 읽기 시간</h2>

      <p className="mb-3">콘텐츠 종류마다 적절한 길이가 있다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>뉴스레터</strong> → 3~5분 (너무 길면 이탈)</li>
        <li><strong>블로그 포스트</strong> → 5~10분 (SEO 관점에서 긴 글이 유리)</li>
        <li><strong>기술 문서</strong> → 10~20분 (깊이 있는 내용)</li>
        <li><strong>SNS 포스트</strong> → 30초~1분</li>
        <li><strong>제품 소개 페이지</strong> → 1~3분</li>
        <li><strong>이메일</strong> → 1~2분 (짧을수록 좋음)</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>한국어/영어 기준 구분해서 계산 → 더 정확함</li>
        <li>읽기 속도 조절 가능 → 독자층에 맞게 설정</li>
        <li>글자수와 함께 표시 → 분량 가늠 쉬움</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>실제 독자의 속도는 개인차가 큼 → 어디까지나 평균 기준</li>
        <li>이미지/영상이 섞인 글은 수동 조정 필요</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>글 붙여넣기</li>
        <li>언어와 읽기 속도 설정</li>
        <li>읽기 시간 확인</li>
        <li>블로그에 복사해서 붙이기</li>
      </ol>

      <p className="mb-4">10초면 된다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/reading-time-calculator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 읽기 시간 계산기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">회원가입 없이 바로 쓸 수 있다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #읽기시간 #블로그읽기시간 #글자수계산 #블로그도구 #콘텐츠도구 #텍스트도구
      </p>
    </article>
  );
}
