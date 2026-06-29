import Link from 'next/link';

export default function Base64Post() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">인코딩 · 2026년 6월 20일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Base64 변환, 개발하다 보면 매일 쓰는데 좋은 도구가 없더라
      </h1>

      <p className="mb-4">
        <Link href="/tools/base64" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Base64 변환기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        JWT 토큰 payload가 뭔지 보려고 터미널 열고 echo ... | base64 -d 치는 게 너무 귀찮아졌다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Base64가 뭔지</h2>

      <p className="mb-3">바이너리 데이터를 텍스트로 표현하는 인코딩 방식이다. 이진 데이터를 ASCII 문자만으로 표현할 수 있어서 다양한 곳에서 쓰인다.</p>

      <p className="mb-3">개발 중에 만나는 상황:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>JWT 토큰 확인 → payload 부분이 Base64로 인코딩되어 있음</li>
        <li>API 인증 → Basic Auth 헤더가 &quot;username:password&quot;를 Base64로 인코딩한 것</li>
        <li>이미지 임베딩 → CSS나 HTML에 이미지를 Data URI로 넣을 때</li>
        <li>이메일 첨부 → MIME 인코딩</li>
        <li>환경변수 → 바이너리 설정값을 Base64로 저장</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 불편함</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>터미널 커맨드 → 매번 치기 귀찮고, OS마다 다름 (macOS vs Linux)</li>
        <li>온라인 사이트 → 광고투성이에 UI가 제각각</li>
        <li>브라우저 콘솔 → btoa()/atob() 직접 입력해야 함</li>
        <li>IDE 플러그인 → 설치해야 하는 게 귀찮음</li>
      </ul>

      <p className="mb-4">그냥 텍스트 붙여넣으면 바로 변환되는 페이지 하나면 충분한데.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">만들어 둔 것</h2>

      <p className="mb-3">기능:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>텍스트 → Base64 인코딩</li>
        <li>Base64 → 텍스트 디코딩</li>
        <li>URL-safe Base64 (+ → -, / → _ 변환)</li>
        <li>파일 → Base64 인코딩 (이미지, 바이너리 등)</li>
        <li>한글/유니코드 지원</li>
        <li>복사 버튼</li>
      </ul>

      <p className="mb-3">추가:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>JWT 디코딩 → header/payload 분리해서 보여줌</li>
        <li>Data URI 생성 → 이미지를 임베딩 가능한 형태로</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>실시간 변환 → 입력하면 바로 결과 나옴</li>
        <li>JWT 디코딩이 특히 편함 → 세 파트 자동 분리</li>
        <li>파일 Base64도 됨 → 이미지 Data URI 뽑을 때 유용</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>아주 큰 파일은 느릴 수 있음</li>
        <li>JWT 서명 검증은 안 함 (디코딩만)</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>텍스트 또는 Base64 문자열 붙여넣기</li>
        <li>인코딩/디코딩 자동 감지 또는 직접 선택</li>
        <li>결과 복사</li>
      </ol>

      <p className="mb-4">3초면 됨.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/base64" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Base64 변환기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">터미널 없이, 설치 없이.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #Base64 #인코딩 #디코딩 #개발자도구 #JWT
      </p>
    </article>
  );
}
