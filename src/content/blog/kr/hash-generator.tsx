import Link from 'next/link';

export default function HashGeneratorPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">인코딩 · 2026년 7월 23일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        파일 무결성 확인할 때 MD5/SHA-256 해시 생성, 매번 터미널 켜는 게 귀찮아서
      </h1>

      <p className="mb-4">
        <Link href="/tools/hash-generator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 해시 생성기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        다운로드한 파일 무결성 확인하려고 shasum 커맨드 찾아보는 것도 이제 지쳤다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">해시가 뭔지</h2>

      <p className="mb-3">
        해시(Hash)는 임의 길이의 데이터를 고정 길이의 문자열로 변환하는 함수 결과물이다. 같은 입력이면 항상 같은 출력이 나오고, 입력이 조금만 달라져도 완전히 다른 결과가 나온다.
      </p>

      <p className="mb-3">
        단방향 변환이라서 해시값만 보고 원본을 복원하는 건 불가능하다. 그래서 검증 용도로 많이 쓰인다.
      </p>

      <p className="mb-3">개발하다 보면 이런 상황에서 자주 마주침:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>파일 무결성 확인 → 공식 사이트에서 제공하는 SHA-256 해시와 다운로드 파일 비교</li>
        <li>비밀번호 저장 → DB에 평문 말고 해시로 저장</li>
        <li>캐시 키 생성 → 요청 내용 해시로 캐시 키 만들기</li>
        <li>데이터 일치 여부 확인 → 두 파일이 완전히 같은지 빠르게 체크</li>
        <li>Git 커밋 ID → Git이 내부적으로 SHA-1 사용</li>
        <li>체크섬 생성 → 전송 중 데이터 손상 여부 검증</li>
        <li>API 서명 → HMAC 방식의 요청 서명</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">MD5 vs SHA-1 vs SHA-256, 뭐가 다른지</h2>

      <p className="mb-3">
        세 알고리즘 다 해시를 만드는 건 같은데 특성이 다름:
      </p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>MD5 (128비트)</strong> → 가장 빠름. 보안 취약점 알려져 있어서 암호화 목적으론 비추. 파일 중복 확인 같은 비보안 용도엔 여전히 씀</li>
        <li><strong>SHA-1 (160비트)</strong> → MD5보다 강하지만 충돌 취약점 발견됨. Git에서 쓰이긴 하는데 보안 목적으론 지양</li>
        <li><strong>SHA-256 (256비트)</strong> → 현재 가장 많이 쓰이는 표준. 비트코인 채굴에도 쓰임. 일반적인 용도엔 이거 쓰면 됨</li>
        <li><strong>SHA-512 (512비트)</strong> → SHA-256보다 더 강함. 고보안 환경에서 사용</li>
      </ul>

      <p className="mb-4">
        파일 무결성 확인이나 체크섬 용도면 SHA-256이 무난하고, 레거시 시스템 호환이 필요하면 MD5나 SHA-1 씀.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>터미널 커맨드 → macOS는 <code>shasum -a 256</code>, Linux는 <code>sha256sum</code>, Windows는 또 다름. 매번 검색</li>
        <li>온라인 사이트 → 파일 해시 생성 사이트에 파일 올리는 게 찝찝함. 민감한 파일이면 더더욱</li>
        <li>언어별 라이브러리 → 파이썬이면 hashlib, Node면 crypto. 간단한 확인에 코드 짜기 과함</li>
        <li>IDE 플러그인 → 설치 귀찮고 가볍게 쓰기 어려움</li>
      </ul>

      <p className="mb-4">
        그냥 텍스트 붙여넣거나 파일 드래그하면 해시 바로 뽑아주는 도구 하나면 충분한데.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">기능:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>텍스트 입력 → MD5 / SHA-1 / SHA-256 / SHA-512 동시 생성</li>
        <li>파일 드래그 앤 드롭 → 파일 해시 즉시 계산 (서버 전송 없음, 브라우저에서 직접 처리)</li>
        <li>해시 비교 → 두 해시값 입력하면 일치 여부 확인</li>
        <li>대소문자 토글 → 소문자/대문자 변환</li>
        <li>복사 버튼 → 원클릭 클립보드 복사</li>
        <li>실시간 변환 → 타이핑하면 즉시 반영</li>
      </ul>

      <p className="mb-3">특히 파일 해시는 브라우저 Web Crypto API로 처리하기 때문에 파일이 서버에 올라가지 않음. 민감한 파일도 안심하고 사용 가능.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>4가지 알고리즘 한 번에 → 어떤 걸 써야 할지 모를 때 전부 보고 골라도 됨</li>
        <li>파일 해시가 특히 편함 → 공식 사이트 체크섬이랑 비교할 때 바로 확인</li>
        <li>브라우저에서만 처리 → 파일 업로드 걱정 없음</li>
        <li>해시 비교 기능 → 일치 여부 눈으로 직접 보지 않아도 됨</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>아주 큰 파일 (수 GB)은 브라우저 메모리 제한으로 느릴 수 있음</li>
        <li>HMAC 같은 키 기반 해시는 지원 안 함</li>
        <li>해시 크래킹(역방향 조회) 기능은 당연히 없음</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">텍스트 해시 생성:</p>
      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>텍스트 입력창에 문자열 붙여넣기</li>
        <li>MD5, SHA-1, SHA-256, SHA-512 결과 즉시 표시</li>
        <li>필요한 알고리즘 결과 복사</li>
      </ol>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">파일 해시 확인:</p>
      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>파일을 드래그 앤 드롭 또는 클릭해서 선택</li>
        <li>자동으로 해시값 계산</li>
        <li>공식 체크섬과 비교하거나 복사해서 사용</li>
      </ol>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">해시 비교:</p>
      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>비교할 두 해시값 각각 입력</li>
        <li>일치/불일치 즉시 표시</li>
      </ol>

      <p className="mb-4">각각 10초면 됨.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">자주 쓰는 시나리오</h2>

      <p className="mb-3">
        <strong>시나리오 1: 소프트웨어 다운로드 후 무결성 확인</strong>
      </p>
      <p className="mb-3">
        Ubuntu 같은 Linux 배포판이나 개발 도구 공식 사이트에 보면 SHA-256 체크섬을 같이 제공함. 다운로드 후 파일을 도구에 드래그하면 공식 체크섬이랑 바로 비교 가능.
      </p>

      <p className="mb-3">
        <strong>시나리오 2: API 요청 서명 확인</strong>
      </p>
      <p className="mb-3">
        Webhook 수신할 때 서명 검증하는 코드 짜다가 실제 해시값이 어떻게 생겼는지 직접 보고 싶을 때. 텍스트 입력하면 바로 나와서 디버깅에 편함.
      </p>

      <p className="mb-3">
        <strong>시나리오 3: 중복 파일 확인</strong>
      </p>
      <p className="mb-3">
        이름은 다른데 내용은 같은 파일인지 궁금할 때. 두 파일 각각 해시 뽑아서 비교하면 됨.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/hash-generator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 해시 생성기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">터미널 없이, shasum 커맨드 없이, 파일 업로드 걱정 없이.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #해시생성 #MD5 #SHA256 #파일무결성 #체크섬 #개발자도구 #인코딩
      </p>
    </article>
  );
}
