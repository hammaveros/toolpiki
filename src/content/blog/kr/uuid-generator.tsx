import Link from 'next/link';

export default function UuidGeneratorPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">계산기 · 2026년 7월 23일 · 읽는 시간 3분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        개발 중에 UUID 필요할 때마다 터미널 치거나 코드 실행하는 게 너무 번거로워서
      </h1>

      <p className="mb-4">
        <Link href="/tools/uuid-generator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 UUID 생성기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        DB 테스트 데이터 만들 때마다 node -e "require('crypto').randomUUID()" 치는 나 자신이 좀 불쌍했다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">UUID가 뭔지</h2>

      <p className="mb-3">
        UUID(Universally Unique Identifier)는 전 세계에서 유일한 ID를 만들기 위한 표준 형식이다. <code>550e8400-e29b-41d4-a716-446655440000</code> 이런 식으로 32개 16진수 문자에 하이픈이 들어간 형태.
      </p>

      <p className="mb-3">
        버전이 여러 개인데 현재 가장 많이 쓰는 건 UUID v4다. 완전 랜덤으로 생성되고, 충돌 확률이 천문학적으로 낮아서 사실상 고유 ID로 쓸 수 있음.
      </p>

      <p className="mb-3">개발 중에 UUID가 필요한 상황:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>DB 테스트 데이터 → primary key로 UUID 쓰는 경우 수동으로 만들어야 할 때</li>
        <li>API 요청 ID → 요청 추적용 correlation ID 생성</li>
        <li>임시 파일명 → 충돌 없는 고유 파일명 필요할 때</li>
        <li>세션 토큰 → 간단한 세션 ID 생성</li>
        <li>목 데이터 → 테스트용 더미 데이터에 UUID 필드 채울 때</li>
        <li>Postman/Insomnia 테스트 → 요청 body에 UUID 넣어야 할 때</li>
        <li>환경 설정 → 앱 인스턴스 ID, 설치 ID 등</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">UUID 버전별 차이</h2>

      <p className="mb-3">UUID에는 버전이 있는데, 쓸 때 헷갈릴 수 있어서 간단히 정리:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>v1</strong> → 타임스탬프 + MAC 주소 기반. 시간 순서가 보장되지만 MAC 주소 노출 이슈</li>
        <li><strong>v3</strong> → 네임스페이스 + MD5 해시. 같은 입력이면 같은 UUID 나옴</li>
        <li><strong>v4</strong> → 완전 랜덤. 가장 많이 씀. 이게 일반적으로 &quot;UUID&quot; 하면 떠올리는 것</li>
        <li><strong>v5</strong> → v3과 같은 방식인데 SHA-1 사용</li>
        <li><strong>v7</strong> → 최근 표준. 타임스탬프 기반이라 정렬 가능. DB 인덱스 성능 좋음</li>
      </ul>

      <p className="mb-4">
        일반적인 용도면 v4, DB primary key로 인덱스 성능까지 고려하면 v7 쓰면 됨.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>터미널 커맨드 → <code>uuidgen</code> (macOS), <code>cat /proc/sys/kernel/random/uuid</code> (Linux). 매번 검색</li>
        <li>Node.js → <code>node -e "console.log(require('crypto').randomUUID())"</code> 타이핑이 길어</li>
        <li>Python → <code>python3 -c "import uuid; print(uuid.uuid4())"</code> 역시 길고 귀찮</li>
        <li>온라인 사이트 → UUID 생성 사이트들이 대부분 광고 가득하고 여러 개 한 번에 뽑기 불편</li>
        <li>IDE 플러그인 → 설치 과정이 번거롭고 가볍게 쓰기 어려움</li>
      </ul>

      <p className="mb-4">
        여러 개 한 번에 뽑거나, 형식 바꿔서 쓰거나, 클립보드에 바로 복사하는 게 안 되는 경우가 많음.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">기능:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>UUID v4 즉시 생성 → 버튼 클릭 또는 페이지 로드 시 자동 생성</li>
        <li>여러 개 한 번에 → 1~100개까지 한 번에 생성 가능</li>
        <li>형식 선택 → 하이픈 포함 / 제거 / 대문자 / 소문자</li>
        <li>복사 버튼 → 개별 복사 또는 전체 한 번에 복사</li>
        <li>재생성 → 버튼 클릭으로 새로운 UUID 세트 생성</li>
      </ul>

      <p className="mb-3">추가:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>UUID 유효성 검사 → 입력한 문자열이 유효한 UUID인지 확인</li>
        <li>버전 판별 → UUID 버전 자동 감지</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>여러 개 한 번에 생성이 가장 편함 → 테스트 데이터 10개 만들 때 한 번에</li>
        <li>하이픈 제거 옵션 → DB 컬럼이 VARCHAR(32)일 때 바로 사용 가능</li>
        <li>전체 복사 → 텍스트 에디터에 붙여넣고 바로 사용</li>
        <li>유효성 검사 → 받아온 UUID 형식이 맞는지 확인할 때도 유용</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>v1, v3, v5, v7은 현재 미지원 (v4만)</li>
        <li>네임스페이스 UUID (v3/v5) 생성 안 됨</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">UUID 생성:</p>
      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>페이지 열면 UUID 자동 생성</li>
        <li>개수 입력 (기본 1개, 최대 100개)</li>
        <li>형식 선택 (하이픈 포함/제거, 대소문자)</li>
        <li>복사 버튼으로 클립보드에 복사</li>
      </ol>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">UUID 검증:</p>
      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>검증 탭으로 전환</li>
        <li>확인할 UUID 붙여넣기</li>
        <li>유효 여부 및 버전 즉시 표시</li>
      </ol>

      <p className="mb-4">5초면 됨.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/uuid-generator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 UUID 생성기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">터미널 없이, 코드 실행 없이, 바로 복사.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #UUID #고유ID #개발자도구 #테스트데이터 #UUIDV4 #랜덤ID
      </p>
    </article>
  );
}
