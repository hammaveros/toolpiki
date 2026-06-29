import Link from 'next/link';

export default function CaseConverterPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">텍스트 · 2026년 7월 1일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        camelCase, snake_case, PascalCase 매번 손으로 바꾸고 있었음
      </h1>

      <p className="mb-4">
        <Link href="/tools/case-converter" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 대소문자 변환기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        API 명세서에서 변수명 20개 복붙하는데, 전부 snake_case를 camelCase로 바꿔야 한다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">케이스 변환이 필요한 순간</h2>

      <p className="mb-3">코드 작업하다 보면 생각보다 자주 마주친다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>백엔드(Python)에서 받은 JSON → 프론트엔드(JavaScript) 변수명으로 변환</li>
        <li>DB 컬럼명(snake_case) → API 필드명(camelCase) 맞추기</li>
        <li>디자이너가 준 컴포넌트명 → PascalCase로 정리</li>
        <li>환경변수 이름 → SCREAMING_SNAKE_CASE로 통일</li>
        <li>CSS 클래스명 → kebab-case로 변환</li>
        <li>문서 작업 중 제목들 → Title Case로 한번에 바꾸기</li>
      </ul>

      <p className="mb-4">변수명 하나하나 손으로 바꾸면 오타가 나고, 대문자 위치 헷갈린다. 20개 넘어가면 진짜 귀찮다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법들의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>IDE 리네이밍 기능 → 코드 파일 안에서만 동작, 문서 작업에는 못 씀</li>
        <li>정규식으로 직접 처리 → 매번 패턴 기억해서 짜야 함, 실수하면 전부 꼬임</li>
        <li>검색해서 나온 사이트 → 광고 범벅, 원하는 케이스가 없거나 한두 가지만 지원</li>
        <li>Excel/스프레드시트 함수 → UPPER, LOWER는 있는데 camelCase는 없음</li>
      </ul>

      <p className="mb-4">결국 직접 하나씩 수정하거나, 정규식 스크립트를 그때그때 짜는 게 현실이었다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">텍스트 넣으면 여러 케이스로 한꺼번에 변환해준다. 지원하는 형식:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>camelCase</strong> → 첫 단어 소문자, 이후 단어 첫 글자 대문자</li>
        <li><strong>PascalCase</strong> → 모든 단어 첫 글자 대문자</li>
        <li><strong>snake_case</strong> → 소문자 + 언더스코어 구분</li>
        <li><strong>SCREAMING_SNAKE_CASE</strong> → 대문자 + 언더스코어 구분</li>
        <li><strong>kebab-case</strong> → 소문자 + 하이픈 구분</li>
        <li><strong>Title Case</strong> → 각 단어 첫 글자 대문자</li>
        <li><strong>UPPERCASE</strong> → 전체 대문자</li>
        <li><strong>lowercase</strong> → 전체 소문자</li>
      </ul>

      <p className="mb-3">추가로 편한 점:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>각 결과 옆에 복사 버튼 → 클립보드에 바로 복사</li>
        <li>여러 줄 입력 지원 → 변수명 여러 개 한꺼번에 변환</li>
        <li>특수문자 자동 처리 → 구분자로 인식해서 단어 분리</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">케이스별 사용 맥락 정리</h2>

      <p className="mb-3">어디에 어떤 케이스 쓰는지 헷갈리면:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>camelCase</strong> → JavaScript/TypeScript 변수, 함수명</li>
        <li><strong>PascalCase</strong> → React 컴포넌트, 클래스명, 타입/인터페이스명</li>
        <li><strong>snake_case</strong> → Python 변수/함수, DB 컬럼명, Ruby</li>
        <li><strong>SCREAMING_SNAKE_CASE</strong> → 상수, 환경변수</li>
        <li><strong>kebab-case</strong> → CSS 클래스, URL slug, HTML 속성</li>
        <li><strong>Title Case</strong> → 문서 제목, 헤더, UI 레이블</li>
      </ul>

      <p className="mb-4">언어/프레임워크마다 컨벤션이 달라서 매번 확인하게 된다. 도구에서 전부 한 번에 보여주니까 고르기도 편하다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>모든 케이스를 한 화면에서 비교 가능 → 고르기 쉬움</li>
        <li>복붙 즉시 결과 나옴 → 버튼 따로 안 눌러도 됨</li>
        <li>여러 줄 한꺼번에 처리 → 변수명 목록 통째로 변환</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>한글 텍스트는 케이스 변환 의미가 없음 → 영문 전용</li>
        <li>복잡한 약어(HTML, URL 등) 처리는 케이스에 따라 다르게 나올 수 있음</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>변환할 텍스트나 변수명 입력</li>
        <li>원하는 케이스 결과 확인</li>
        <li>복사 버튼 클릭</li>
        <li>끝</li>
      </ol>

      <p className="mb-4">3초면 된다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/case-converter" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 대소문자 변환기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">회원가입 없이 바로 쓸 수 있다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #케이스변환 #camelCase #snake_case #PascalCase #kebabcase #대소문자변환 #텍스트도구
      </p>
    </article>
  );
}
