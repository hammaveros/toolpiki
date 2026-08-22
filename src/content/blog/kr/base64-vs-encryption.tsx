import Link from 'next/link';

export default function Base64VsEncryptionPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">가이드 · 2026년 8월 21일 · 읽는 시간 8분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Base64는 암호화가 아니다 — 인코딩·암호화·해싱, 뭐가 다른가
      </h1>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        코드 리뷰를 하다 보면 잊을 만하면 만나는 장면이 있다. 비밀번호를 Base64로 바꿔 저장해 놓고
        &ldquo;암호화했다&rdquo;고 적어 둔 주석. API 키를 Base64로 감싸 프론트엔드에 심어 두고
        &ldquo;숨겼다&rdquo;고 믿는 설정 파일. 결론부터: <strong>Base64는 보안 기능이 전혀 없다.</strong>
        누구나 1초 만에 원문으로 되돌릴 수 있다. 이 글은 인코딩·암호화·해싱이라는, 자주 섞여 쓰이지만
        완전히 다른 세 가지 개념을 실무 관점에서 구분한 것이다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Base64는 그냥 &lsquo;표기법 변환&rsquo;이다</h2>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        Base64의 목적은 은닉이 아니라 <strong>운반</strong>이다. 이미지 같은 바이너리 데이터를 텍스트만
        오갈 수 있는 통로(JSON, 이메일, URL)로 보내야 할 때, 데이터를 6비트씩 잘라 64개의 안전한
        문자(A-Z, a-z, 0-9, +, /)로 바꿔 적는 것뿐이다. 규칙이 공개돼 있고 키도 없으니, 디코딩 함수
        한 줄이면 원문이 그대로 나온다.
      </p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>변환 규칙이 공개되어 있다 → 비밀이 아니다</li>
        <li>키가 없다 → 되돌리는 데 아무 조건이 없다</li>
        <li>크기가 약 33% 커진다 → 압축도 아니다</li>
        <li>끝의 <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">=</code>는 길이를 맞추는 패딩일 뿐이다</li>
      </ul>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        즉 Base64로 바뀐 문자열은 &ldquo;영어를 모스부호로 적은 것&rdquo;과 같다. 모양이 낯설 뿐,
        읽는 법을 아는 사람(=모든 개발자와 모든 도구)에게는 평문이다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">세 가지 개념 비교</h2>

      <div className="overflow-x-auto mb-4">
        <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <th className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700"></th>
              <th className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">인코딩</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">암호화</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">해싱</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 dark:text-gray-300">
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="px-3 py-2 font-medium">목적</td>
              <td className="px-3 py-2">데이터 운반·호환</td>
              <td className="px-3 py-2">기밀성 (아는 사람만 읽기)</td>
              <td className="px-3 py-2">무결성·검증 (변조 확인)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="px-3 py-2 font-medium">되돌리기</td>
              <td className="px-3 py-2">누구나 가능</td>
              <td className="px-3 py-2">키가 있어야 가능</td>
              <td className="px-3 py-2">불가능 (단방향)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="px-3 py-2 font-medium">키</td>
              <td className="px-3 py-2">없음</td>
              <td className="px-3 py-2">있음</td>
              <td className="px-3 py-2">없음 (솔트는 있음)</td>
            </tr>
            <tr>
              <td className="px-3 py-2 font-medium">대표 사례</td>
              <td className="px-3 py-2">Base64, URL 인코딩</td>
              <td className="px-3 py-2">AES, RSA, TLS</td>
              <td className="px-3 py-2">SHA-256, bcrypt, Argon2</td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그런데 왜 자꾸 헷갈릴까 — JWT라는 오해 제조기</h2>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        가장 큰 혼란의 진원지는 JWT다. JWT 토큰을 열어 보면 알아볼 수 없는 문자열이라 암호화된 것처럼
        보이지만, 헤더와 페이로드는 <strong>그냥 Base64URL 인코딩</strong>이다. 토큰을 디코더에 넣으면
        사용자 ID, 이메일, 권한 정보가 평문으로 다 보인다. JWT의 세 번째 조각(서명)은 위·변조를
        <strong>탐지</strong>하는 장치일 뿐, 내용을 <strong>숨기는</strong> 장치가 아니다. 그래서
        JWT 페이로드에 전화번호·주민번호 같은 민감정보를 넣는 순간 그대로 유출이다. 실제로 토큰 하나를{' '}
        <Link href="/tools/jwt-decoder" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
          JWT 디코더
        </Link>
        에 넣어 보면 &ldquo;암호화&rdquo;라는 착각이 3초 만에 깨진다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실무에서 만나는 잘못된 사용 3가지</h2>

      <ol className="space-y-3 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>
          <strong>비밀번호를 Base64로 저장</strong> — DB가 털리면 전 계정이 즉시 평문 노출된다.
          비밀번호는 암호화도 아니고 <strong>해싱</strong>이 정답이다. 그것도 SHA-256 단독이 아니라
          bcrypt·Argon2처럼 일부러 느리게 설계된 해시 + 솔트를 써야 무차별 대입을 버틴다.
        </li>
        <li>
          <strong>API 키를 Base64로 &lsquo;숨겨서&rsquo; 프론트에 배포</strong> — 브라우저 개발자 도구를
          여는 순간 끝이다. 프론트엔드에 내려간 값은 어떤 변환을 거치든 공개된 값이다. 비밀 키는 서버에만
          두고, 프론트는 서버를 경유해 호출해야 한다.
        </li>
        <li>
          <strong>&ldquo;해시를 복호화했다&rdquo;는 표현</strong> — 해시는 원리상 되돌릴 수 없다.
          인터넷의 &ldquo;MD5 복호화&rdquo; 사이트들은 복호화가 아니라, 미리 계산해 둔 값 목록(레인보우
          테이블)에서 일치 항목을 찾아 주는 것이다. 단순한 비밀번호가 뚫리는 이유이자, 솔트가 필요한 이유다.
        </li>
      </ol>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그럼 Base64는 언제 쓰나</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>작은 이미지를 CSS/HTML에 직접 넣을 때 (data URI)</li>
        <li>JSON 페이로드에 바이너리(파일, 서명값)를 실어 보낼 때</li>
        <li>HTTP Basic 인증 헤더 형식 (단, 반드시 HTTPS 위에서 — Base64 자체는 보호가 아니므로)</li>
        <li>이메일 첨부(MIME) 등 텍스트 전용 프로토콜에 바이너리를 통과시킬 때</li>
      </ul>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        전부 &ldquo;안전하게 숨기기&rdquo;가 아니라 &ldquo;깨지지 않게 운반하기&rdquo;다. 이 한 문장만
        기억해도 Base64를 잘못 쓸 일은 없다. 변환 결과가 궁금하면{' '}
        <Link href="/tools/base64" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
          Base64 변환 도구
        </Link>
        에서 인코딩과 디코딩이 얼마나 자유롭게 오가는지 직접 확인해 보자 — 그게 곧 &ldquo;보안이 아니다&rdquo;의 증명이다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #Base64 #인코딩 #암호화 #해싱 #JWT #보안기초
      </p>
    </article>
  );
}
