import Link from 'next/link';

export default function UrlEncoderPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">인코딩 · 2026년 6월 17일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        URL 인코딩, 개발하다가 갑자기 막힐 때 쓰는 도구
      </h1>

      <p className="mb-4">
        <Link href="/tools/url-encoder" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 URL 인코더/디코더 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        API 파라미터에 한글 넣었더니 서버가 이상하게 받는데, %EC%B2%A0%EC%88%98 이게 뭔지.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">URL 인코딩이 왜 필요한가</h2>

      <p className="mb-3">
        URL은 원래 ASCII 문자만 쓸 수 있게 설계됐다.
        한글, 일본어, 중국어나 특수문자(공백, &, =, ? 같은 것들)는 그대로 넣으면 브라우저나 서버가 제대로 못 읽는다.
        그래서 이 문자들을 %XX 형태의 16진수로 바꾸는 게 URL 인코딩이다.
      </p>

      <p className="mb-3">이게 필요한 상황:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>검색 API에 한글 키워드 파라미터로 넘길 때 → 그대로 넣으면 깨짐</li>
        <li>URL 쿼리스트링에 특수문자 포함할 때 → &, =, + 같은 문자가 의미를 가짐</li>
        <li>웹 크롤링할 때 → 인코딩된 URL 받아서 원래 값이 뭔지 봐야 할 때</li>
        <li>OAuth 콜백 URL 설정할 때 → URL 안에 URL이 들어가야 하는 경우</li>
        <li>로그 분석할 때 → %EC%B2%A0%EC%88%98 같은 게 실제로 뭔지 확인</li>
        <li>이메일 링크에 파라미터 붙일 때 → 공백이나 한글 포함된 값 넣을 때</li>
        <li>GET 요청 디버깅할 때 → 서버가 받는 값이 뭔지 직접 확인</li>
      </ul>

      <p className="mb-4">
        개발자는 물론이고, 마케터가 UTM 파라미터 설정할 때나
        구글 애널리틱스 URL 파라미터 다룰 때도 나온다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>브라우저 개발자 도구 콘솔에서 직접 → encodeURIComponent() 타이핑해야 하고, 결과 복붙이 번거로움</li>
        <li>파이썬/노드 스크립트 작성 → 간단한 변환에 환경 세팅까지 해야 함</li>
        <li>온라인 도구 검색 → 광고 많거나, 사이트마다 인터페이스 달라서 매번 적응</li>
        <li>기억에 의존 → encodeURI vs encodeURIComponent 차이 매번 헷갈림</li>
      </ul>

      <p className="mb-3">
        encodeURI랑 encodeURIComponent가 다르다는 것도 처음엔 헷갈린다.
        encodeURI는 URL 전체 구조를 유지하고, encodeURIComponent는 모든 특수문자를 다 인코딩한다.
        파라미터 값에 넣을 거면 encodeURIComponent 써야 하는데 이걸 매번 기억하기 귀찮다.
      </p>

      <p className="mb-4">
        결국 필요할 때마다 콘솔 열거나 검색하게 되는데,
        그냥 붙여넣으면 바로 되는 도구가 있으면 훨씬 편하다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">텍스트 입력하면 인코딩/디코딩 결과 바로 나온다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>URL 인코딩 → 한글·특수문자 %XX 형태로 변환</li>
        <li>URL 디코딩 → %EC%B2%A0%EC%88%98 같은 걸 원래 텍스트로 복원</li>
        <li>encodeURI 방식 / encodeURIComponent 방식 선택 가능</li>
        <li>실시간 변환 → 입력하면서 바로 결과 확인</li>
        <li>복사 버튼 → 변환 결과 클립보드로 바로</li>
      </ul>

      <p className="mb-3">추가로:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>인코딩/디코딩 차이 설명 → 처음 보는 사람도 바로 이해</li>
        <li>예제 URL 제공 → 어떤 식으로 변환되는지 예시로 확인 가능</li>
        <li>에러 처리 → 잘못된 인코딩 값 넣으면 경고 표시</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>콘솔 안 열어도 됨 → 브라우저 탭 하나로 해결</li>
        <li>실시간 변환이라 빠름 → 한 글자 치면 바로 결과 나옴</li>
        <li>encodeURI / encodeURIComponent 옵션 분리 → 뭘 써야 하는지 헷갈릴 때 둘 다 비교 가능</li>
        <li>URL 디코딩도 됨 → 받은 인코딩 값 해독할 때 유용</li>
        <li>브라우저에서 실행 → 입력값 서버로 안 보냄, 민감한 토큰 값 다뤄도 안전</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>URL 전체 파싱 → 파라미터별로 쪼개서 보는 기능은 없음</li>
        <li>배치 변환 → 여러 줄 한꺼번에 변환은 안 됨</li>
      </ul>

      <p className="mb-4">
        그래도 단발성으로 값 하나 변환하거나 디코딩 확인하는 데는 충분하다.
        특히 API 디버깅 중간에 잠깐 확인할 때 제일 유용하다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">이런 상황에 구체적으로</h2>

      <p className="mb-3">실제로 이런 케이스에 자주 쓰게 됐다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>카카오 지도 API → 주소 파라미터에 한글 넣을 때 인코딩 값 확인</li>
        <li>네이버 검색 API → 쿼리스트링 한글 변환</li>
        <li>로그에서 URL 파라미터 해독 → 사용자가 실제로 어떤 값 보냈는지</li>
        <li>마케팅 UTM 파라미터 → 캠페인명에 한글/공백 들어갈 때</li>
        <li>이메일 링크 파라미터 → Gmail 링크에 파라미터 붙일 때</li>
      </ul>

      <p className="mb-4">
        개발 안 하더라도 URL 다루는 일이 있으면 한 번쯤은 쓸 일이 생긴다.
        특히 %로 시작하는 이상한 문자 만났을 때 "이게 뭐지?" 싶으면 그냥 붙여넣어 보면 된다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>변환할 텍스트나 URL 파라미터 값 입력</li>
        <li>인코딩 또는 디코딩 선택</li>
        <li>결과 자동으로 나옴</li>
        <li>복사 버튼으로 클립보드에 복사</li>
        <li>끝</li>
      </ol>

      <p className="mb-4">30초면 된다. 콘솔 열 필요 없다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/url-encoder" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 URL 인코더/디코더 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">
        %로 시작하는 문자 만나면 그냥 붙여넣어 봐.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #URL인코딩 #URL디코딩 #퍼센트인코딩 #인코딩도구 #개발도구
      </p>
    </article>
  );
}
