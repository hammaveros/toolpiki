import Link from 'next/link';

export default function Base64ImagePost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">인코딩 · 2026년 7월 6일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        이미지 파일 없이 img 태그에 넣고 싶어서 만든 것
      </h1>

      <p className="mb-4">
        <Link href="/tools/base64-image" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 이미지 Base64 변환기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        HTML 파일 하나만 보내면 되는데, 이미지 파일도 같이 첨부해야 해서 번거로웠다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">이미지 Base64 변환이 필요한 상황</h2>

      <p className="mb-3">생각보다 자주 마주치는 상황들:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>HTML 이메일 템플릿 → 외부 이미지 URL 못 쓰는 경우</li>
        <li>단일 HTML 파일 배포 → 이미지 파일 별도 첨부 없이 올인원으로</li>
        <li>CSS background-image → URL 대신 data URI 사용</li>
        <li>React/Vue 프로젝트 → 작은 아이콘을 인라인으로 박아놓기</li>
        <li>오프라인 환경 → 인터넷 없이도 이미지 렌더링</li>
        <li>보안 정책 → 외부 리소스 로드 막혀 있을 때</li>
      </ul>

      <p className="mb-4">
        특히 HTML 이메일은 외부 이미지 차단되는 경우가 많아서, 로고 같은 건 Base64로 직접 박아야 할 때가 있다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Python 스크립트 → base64 모듈 직접 써야 함, 터미널 열기 귀찮음</li>
        <li>Node.js → fs.readFileSync + toString(&apos;base64&apos;) 코드 짜야 함</li>
        <li>온라인 사이트들 → 광고 넘치고, 이미지 서버에 올라가는 건지 불안함</li>
        <li>개발자 도구 콘솔 → FileReader API 코드 매번 입력</li>
      </ul>

      <p className="mb-4">
        이미지 하나 변환하려고 파이썬 켜는 건 너무 오버다. 그냥 드래그 앤 드롭으로 바로 됐으면 했다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">주요 기능:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>이미지 파일 드래그 앤 드롭 또는 클릭 업로드</li>
        <li>Base64 문자열 즉시 생성</li>
        <li>data URI 형식으로 출력 (img src에 바로 붙여넣기 가능)</li>
        <li>CSS background-image 형식으로도 출력</li>
        <li>변환된 이미지 미리보기 확인</li>
        <li>결과 복사 버튼 (클립보드 복사)</li>
      </ul>

      <p className="mb-3">추가로 알아두면 좋은 것:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>지원 포맷: PNG, JPEG, GIF, WebP, SVG, ICO 등 브라우저가 지원하는 이미지</li>
        <li>변환은 브라우저에서 처리 → 서버에 이미지 안 올라감</li>
        <li>파일 크기 제한 없음 (다만 큰 이미지는 문자열이 엄청 길어짐)</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Base64 img src 사용 예시</h2>

      <p className="mb-3">변환 후 이런 식으로 바로 쓸 수 있다:</p>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 overflow-x-auto">
        <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-all">
{`<!-- img 태그에 직접 -->
<img src="data:image/png;base64,iVBORw0KGg..." alt="logo" />

/* CSS background-image */
.logo {
  background-image: url('data:image/png;base64,iVBORw0KGg...');
}`}
        </pre>
      </div>

      <p className="mb-4">
        data URI 형식은 <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">data:[미디어타입];base64,[인코딩된 데이터]</code> 구조다.
        브라우저가 이 형식을 직접 파싱해서 이미지로 렌더링해준다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>브라우저에서만 처리되니까 이미지 유출 걱정 없음</li>
        <li>img src용, CSS background용 두 가지 형식 동시 출력</li>
        <li>미리보기로 변환 결과 확인 가능</li>
        <li>복사 버튼 하나로 끝</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>큰 이미지(1MB 이상)는 Base64 문자열이 엄청 길어짐 → 페이지 크기 증가</li>
        <li>Base64는 원본보다 약 33% 크기 증가 → 작은 아이콘이나 로고에 적합</li>
        <li>반대로(Base64 → 이미지 파일 저장)는 별도 도구 필요</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 쓰면 좋고 언제 쓰면 안 좋은지</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">쓰면 좋을 때:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>작은 아이콘, 로고 → 파일 하나로 묶기 좋음</li>
        <li>HTML 이메일 템플릿 → 외부 이미지 블록 우회</li>
        <li>오프라인 HTML → 외부 파일 의존성 없애기</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">피해야 할 때:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>큰 사진, 배경 이미지 → 용량이 크게 늘어남</li>
        <li>캐싱이 중요한 경우 → Base64는 브라우저 캐시 못 함</li>
        <li>같은 이미지를 여러 곳에서 재사용 → 중복 데이터로 용량 낭비</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>이미지 파일 드래그 앤 드롭 또는 클릭해서 선택</li>
        <li>자동으로 Base64 변환 시작</li>
        <li>img src용 / CSS background용 결과 확인</li>
        <li>복사 버튼으로 클립보드에 복사</li>
        <li>원하는 곳에 붙여넣기</li>
      </ol>

      <p className="mb-4">5초면 됨. 파이썬이나 Node.js 켤 필요 없다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/base64-image" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 이미지 Base64 변환기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">
        HTML 이메일이나 단일 파일 배포할 때 써보면 편함.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #Base64이미지 #이미지인코딩 #dataURI #HTML이메일 #인라인이미지
      </p>
    </article>
  );
}
