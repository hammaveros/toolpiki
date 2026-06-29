import Link from 'next/link';

export default function WordFrequencyPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">텍스트 · 2026년 7월 2일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        글에서 어떤 단어를 제일 많이 썼는지 알고 싶을 때
      </h1>

      <p className="mb-4">
        <Link href="/tools/word-frequency" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 단어 빈도 분석기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        보고서 초안 검토하다가 "결과"라는 단어를 너무 많이 반복한 것 같아서 세보고 싶었다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">단어 빈도 분석이 유용한 경우</h2>

      <p className="mb-3">생각해보면 여러 상황에서 쓸 수 있다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>글쓰기 → 특정 단어 반복 과다 확인, 어휘 다양성 점검</li>
        <li>SEO 작업 → 본문에서 키워드가 얼마나 나오는지 확인</li>
        <li>논문/보고서 → 핵심 단어 빈도 통계 자료로 활용</li>
        <li>설문 응답 분석 → 어떤 단어가 가장 많이 언급됐는지</li>
        <li>코드 주석/문서 → 반복되는 패턴이나 용어 파악</li>
        <li>고객 리뷰 분석 → 어떤 표현이 자주 나오는지</li>
      </ul>

      <p className="mb-4">글을 쓰다 보면 본인이 특정 단어에 의존하는 습관이 있는데, 이걸 직접 확인하기가 쉽지 않다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법들의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Ctrl+F 찾기 → 단어 하나씩 검색해야 함, 전체 파악 불가</li>
        <li>Word 단어 수 통계 → 전체 수만 나오고 개별 단어 빈도는 없음</li>
        <li>Python 스크립트 → 코드 짜야 하고 매번 환경 설정</li>
        <li>전문 텍스트 분석 도구 → 설치 필요, 간단한 확인엔 과함</li>
      </ul>

      <p className="mb-4">간단하게 빈도 확인하는 도구가 없어서 결국 손으로 훑어보거나 그냥 넘어갔다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">텍스트 붙여넣으면 단어 빈도 내림차순으로 보여준다. 기능:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>단어별 출현 빈도 → 많이 나온 순으로 정렬</li>
        <li>전체 단어 수 / 고유 단어 수</li>
        <li>상위 N개만 표시 옵션</li>
        <li>단어 클릭 → 해당 단어가 몇 번째 위치에 있는지 하이라이트</li>
      </ul>

      <p className="mb-3">옵션:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>대소문자 구분</strong> → Word와 word를 같은 단어로 볼지</li>
        <li><strong>조사/접속사 제외</strong> → 한국어 조사(은/는/이/가 등) 빈도에서 빼기</li>
        <li><strong>최소 글자수 설정</strong> → 1~2자 단어 제외</li>
        <li><strong>결과 내보내기</strong> → CSV로 저장</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">SEO 키워드 밀도 확인</h2>

      <p className="mb-3">SEO 작업할 때도 유용하다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>타겟 키워드가 본문에 충분히 나오는지 확인</li>
        <li>키워드 과밀(keyword stuffing) 여부 체크</li>
        <li>LSI 키워드(연관 키워드) 자연스럽게 포함됐는지</li>
      </ul>

      <p className="mb-3">일반적으로 권장되는 키워드 밀도:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>1~2%</strong> → 자연스러운 범위</li>
        <li><strong>3% 이상</strong> → 키워드 과밀로 스팸 의심받을 수 있음</li>
        <li><strong>0.5% 이하</strong> → 키워드 부족, 검색 순위에 불리</li>
      </ul>

      <p className="mb-4">단어 빈도와 전체 단어 수 확인하면 대략적인 밀도를 계산할 수 있다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>붙여넣기 즉시 결과 → 빠름</li>
        <li>시각적으로 빈도 막대 표시 → 한눈에 파악 가능</li>
        <li>특정 단어 검색해서 빈도 확인 가능</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>형태소 분석 없음 → "먹다"와 "먹었다"는 별개로 카운트</li>
        <li>영문 어간 처리 없음 → run/running/ran 별개 카운트</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>분석할 텍스트 붙여넣기</li>
        <li>옵션 설정</li>
        <li>빈도 결과 확인</li>
        <li>끝</li>
      </ol>

      <p className="mb-4">5초면 된다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/word-frequency" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 단어 빈도 분석기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">회원가입 없이 바로 쓸 수 있다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #단어빈도 #단어분석 #텍스트분석 #SEO키워드 #글쓰기도구 #텍스트도구
      </p>
    </article>
  );
}
