import Link from 'next/link';

export default function HtmlEntityPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">인코딩 · 2026년 7월 4일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        HTML 엔티티 &amp;amp; &amp;lt;, 일일이 외우다가 포기함
      </h1>

      <p className="mb-4">
        <Link href="/tools/html-entity" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 HTML 엔티티 인코딩/디코딩 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        사용자 입력 텍스트를 HTML에 삽입해야 하는데, XSS 방지를 위해 엔티티 인코딩이 필요하다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">HTML 엔티티가 필요한 상황</h2>

      <p className="mb-3">웹 개발하다 보면 여러 곳에서 만난다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>사용자 입력 → HTML 출력 → XSS 방지 필수</li>
        <li>HTML 안에서 &lt;, &gt;, & 문자를 텍스트로 표시</li>
        <li>이메일 HTML 템플릿 → 엔티티 안 쓰면 깨질 수 있음</li>
        <li>XML/RSS 피드 → 특수문자 반드시 이스케이프</li>
        <li>마크다운에서 HTML 직접 삽입할 때</li>
        <li>서버사이드 렌더링 → 동적 HTML 생성 시</li>
      </ul>

      <p className="mb-4">특히 XSS(Cross-Site Scripting) 방지가 핵심이다. &lt;script&gt; 같은 태그를 그대로 HTML에 넣으면 악용될 수 있다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">필수 HTML 엔티티 5가지</h2>

      <p className="mb-3">이 5개는 반드시 알아야 한다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>&amp;amp;</strong> → & (앰퍼샌드)</li>
        <li><strong>&amp;lt;</strong> → &lt; (보다 작음, 태그 열기)</li>
        <li><strong>&amp;gt;</strong> → &gt; (보다 큼, 태그 닫기)</li>
        <li><strong>&amp;quot;</strong> → " (큰따옴표, 속성값에서 사용)</li>
        <li><strong>&amp;apos;</strong> → ' (작은따옴표, HTML5에서 표준)</li>
      </ul>

      <p className="mb-3">특히 & 부터 이스케이프해야 한다. &amp;lt; 에서 & 를 &amp; 로 먼저 바꾸지 않으면 이중 이스케이프 문제가 생긴다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그 외 자주 쓰는 엔티티</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>&amp;nbsp;</strong> → 줄바꿈 안 하는 공백 (non-breaking space)</li>
        <li><strong>&amp;copy;</strong> → © (저작권 기호)</li>
        <li><strong>&amp;reg;</strong> → ® (등록 상표)</li>
        <li><strong>&amp;trade;</strong> → ™ (상표)</li>
        <li><strong>&amp;mdash;</strong> → — (em dash, 긴 줄표)</li>
        <li><strong>&amp;ndash;</strong> → – (en dash, 짧은 줄표)</li>
        <li><strong>&amp;hellip;</strong> → … (말줄임표)</li>
        <li><strong>&amp;#160;</strong> → 숫자 코드로도 표현 가능</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">텍스트 붙여넣으면 HTML 엔티티로 변환해준다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>인코딩</strong> → 텍스트 → HTML 엔티티 (XSS 방지용)</li>
        <li><strong>디코딩</strong> → HTML 엔티티 → 원본 텍스트</li>
        <li><strong>필수만 인코딩</strong> → &lt;, &gt;, &amp;, &quot;, &#x27; 만</li>
        <li><strong>전체 인코딩</strong> → ASCII 범위 외 모든 문자를 엔티티로</li>
      </ul>

      <p className="mb-3">확인 기능:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>변환된 엔티티 목록 표시</li>
        <li>결과 미리보기 → HTML로 렌더링하면 어떻게 보이는지</li>
        <li>복사 버튼</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">XSS 공격이 뭔데</h2>

      <p className="mb-3">간단히 설명하면:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>악의적인 사용자가 입력창에 &lt;script&gt;악성코드&lt;/script&gt; 입력</li>
        <li>서버가 이걸 그대로 HTML에 넣어서 다른 사용자에게 보냄</li>
        <li>다른 사용자 브라우저에서 악성 스크립트가 실행됨</li>
        <li>쿠키/세션 탈취, 개인정보 유출 가능</li>
      </ul>

      <p className="mb-3">방지 방법:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>사용자 입력을 HTML에 넣을 때 반드시 엔티티 인코딩</li>
        <li>&lt;script&gt; → &amp;lt;script&amp;gt; 로 변환 → 브라우저가 태그로 해석 안 함</li>
        <li>프론트엔드: innerHTML 대신 textContent 사용</li>
        <li>CSP(Content Security Policy) 헤더 설정</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>인코딩/디코딩 양방향 지원</li>
        <li>필수 5개만 또는 전체 인코딩 선택 가능</li>
        <li>렌더링 미리보기 → 결과 확인 쉬움</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>실제 보안 라이브러리(DOMPurify 등) 대체는 안 됨 → 개발 시 참고용</li>
        <li>복잡한 중첩 HTML 구조는 수동 확인 필요</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>텍스트 또는 HTML 엔티티 붙여넣기</li>
        <li>인코딩/디코딩 선택</li>
        <li>결과 복사</li>
        <li>끝</li>
      </ol>

      <p className="mb-4">3초면 된다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/html-entity" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 HTML 엔티티 인코딩/디코딩 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">회원가입 없이 바로 쓸 수 있다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #HTML엔티티 #HTML인코딩 #XSS방지 #HTML특수문자 #웹개발도구 #인코딩도구
      </p>
    </article>
  );
}
