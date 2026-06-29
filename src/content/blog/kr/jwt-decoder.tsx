import Link from 'next/link';

export default function JwtDecoderPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">개발도구 · 2026년 7월 9일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        JWT 토큰 내용 바로 보고 싶어서 만든 디코더
      </h1>

      <p className="mb-4">
        <Link href="/tools/jwt-decoder" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 JWT 디코더 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        로그인 후 토큰에 뭐가 들어있는지, 만료 시간이 언제인지 바로 확인하고 싶었다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">JWT 디코딩이 필요한 상황</h2>

      <p className="mb-3">개발하다 보면 자주 나옴:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>인증 버그 디버깅 → 토큰에 어떤 클레임이 들어있는지 확인</li>
        <li>만료 시간 확인 → exp 클레임 값이 언제인지</li>
        <li>권한 확인 → roles, permissions 클레임 내용</li>
        <li>사용자 정보 확인 → sub, email, userId 등</li>
        <li>토큰 발급 시간 확인 → iat 클레임</li>
        <li>Frontend 개발 → API 응답 토큰 구조 파악</li>
      </ul>

      <p className="mb-4">
        특히 &quot;왜 401이 나오지?&quot; 할 때, 토큰에 실제로 뭐가 들어있는지 확인하면
        문제를 바로 파악할 수 있는 경우가 많다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">JWT 구조</h2>

      <p className="mb-3">JWT는 점(.)으로 구분된 3개 파트:</p>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 overflow-x-auto">
        <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-all">
{`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IuyVmOquuuyCrCIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNTE2MjQyNjIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

↑ 헤더.페이로드.서명`}
        </pre>
      </div>

      <p className="mb-3">각 파트 설명:</p>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 overflow-x-auto">
        <pre className="text-sm text-gray-700 dark:text-gray-300">
{`// 헤더 (알고리즘 정보)
{
  "alg": "HS256",
  "typ": "JWT"
}

// 페이로드 (실제 데이터)
{
  "sub": "1234567890",
  "name": "홍길동",
  "iat": 1516239022,    // 발급 시간
  "exp": 1516242622     // 만료 시간
}

// 서명 (검증용, 비밀키 없으면 위변조 감지 불가)`}
        </pre>
      </div>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">중요한 것: JWT는 암호화가 아님</h2>

      <p className="mb-4">
        JWT 페이로드는 Base64로 인코딩된 것이지 암호화된 게 아니다.
        누구나 디코딩해서 내용을 볼 수 있다.
        서명(Signature)은 위변조 방지용이지 기밀성을 보장하는 게 아니다.
      </p>

      <p className="mb-4">
        그래서 비밀번호, 카드 번호 같은 민감한 정보를 JWT 페이로드에 넣으면 안 된다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>jwt.io → 외국 사이트, 느리고 광고 있음, 토큰 입력 불안감</li>
        <li>JavaScript 콘솔 → atob() 함수로 수동 디코딩, 번거로움</li>
        <li>Postman → API 호출 후 토큰 복붙, 흐름이 끊김</li>
      </ul>

      <p className="mb-4">
        그냥 토큰 붙여넣으면 페이로드 내용과 만료 시간이 한국어로 나왔으면 했다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">주요 기능:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>JWT 토큰 붙여넣기 → 헤더/페이로드 자동 디코딩</li>
        <li>exp (만료 시간) 사람이 읽을 수 있는 날짜로 변환</li>
        <li>iat (발급 시간) 변환</li>
        <li>토큰 만료 여부 실시간 표시</li>
        <li>각 클레임 설명 (표준 클레임 목록)</li>
        <li>서명 알고리즘 표시</li>
      </ul>

      <p className="mb-3">추가 기능:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>JWT 구조 시각화 (헤더.페이로드.서명 색상 구분)</li>
        <li>페이로드 JSON 복사</li>
        <li>만료까지 남은 시간 표시</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">표준 JWT 클레임 목록</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">sub</code> (Subject) → 사용자 식별자</li>
        <li><code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">iss</code> (Issuer) → 토큰 발급자</li>
        <li><code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">aud</code> (Audience) → 토큰 대상</li>
        <li><code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">exp</code> (Expiration) → 만료 시간 (Unix 타임스탬프)</li>
        <li><code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">iat</code> (Issued At) → 발급 시간</li>
        <li><code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">nbf</code> (Not Before) → 유효 시작 시간</li>
        <li><code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">jti</code> (JWT ID) → 토큰 고유 ID</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>만료 시간 Unix 타임스탬프 → 읽기 좋은 날짜 형식으로 변환</li>
        <li>만료 여부 한눈에 확인</li>
        <li>클레임 설명 → 표준 클레임 의미 바로 확인</li>
        <li>브라우저에서만 처리 → 토큰 외부 전송 없음</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>서명 검증은 안 됨 (비밀키 없이는 불가)</li>
        <li>JWE (암호화된 JWT) 디코딩 불가</li>
        <li>실제 인증 서버와 통신하는 건 아님</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>JWT 토큰 붙여넣기 (Bearer 포함해도 됨)</li>
        <li>헤더, 페이로드, 만료 시간 확인</li>
        <li>필요한 클레임 값 복사</li>
      </ol>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/jwt-decoder" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 JWT 디코더 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">
        API 인증 디버깅할 때 토큰 내용 바로 확인하는 용도로 쓰면 편함.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #JWT #JWT디코더 #토큰디버깅 #인증 #개발도구
      </p>
    </article>
  );
}
