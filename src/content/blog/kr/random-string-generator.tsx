import Link from 'next/link';

export default function RandomStringGeneratorPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">계산기 · 2026년 7월 23일 · 읽는 시간 3분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        테스트용 비밀번호, API 토큰, 시크릿 키 매번 손으로 만들다가 귀찮아서 만든 랜덤 문자열 생성기
      </h1>

      <p className="mb-4">
        <Link href="/tools/random-string-generator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 랜덤 문자열 생성기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        .env 파일 JWT_SECRET 값을 키보드 랜덤으로 두드려서 만들던 시절이 있었다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 필요한지</h2>

      <p className="mb-3">개발하다 보면 생각보다 자주 랜덤 문자열이 필요해짐:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>환경변수 시크릿 키 → JWT_SECRET, SESSION_SECRET, API_KEY 등</li>
        <li>테스트용 비밀번호 → 개발 DB 계정, 테스트 계정 비밀번호</li>
        <li>임시 토큰 → 이메일 인증 토큰, 비밀번호 재설정 토큰</li>
        <li>API 키 생성 → 외부 클라이언트에 발급할 API 키</li>
        <li>랜덤 파일명 → 충돌 없는 임시 파일명</li>
        <li>솔트(salt) 값 → 비밀번호 해싱 시 추가하는 랜덤값</li>
        <li>쿠폰 코드 → 이벤트용 랜덤 쿠폰 코드 생성</li>
        <li>초대 코드 → 팀/서비스 초대 링크 토큰</li>
      </ul>

      <p className="mb-4">
        UUID 쓰면 되는 경우도 있지만, 길이나 문자 종류를 조절해야 하는 경우엔 커스텀 랜덤 문자열이 필요함.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">좋은 랜덤 문자열의 조건</h2>

      <p className="mb-3">
        보안 목적으로 쓸 때는 그냥 랜덤이 아니라 암호학적으로 안전한 랜덤(CSPRNG)이어야 한다.
      </p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>예측 불가능</strong> → Math.random() 같은 의사난수 말고 crypto.getRandomValues() 사용</li>
        <li><strong>충분한 엔트로피</strong> → 짧으면 브루트포스에 취약. 비밀번호는 최소 12자 이상 권장</li>
        <li><strong>적절한 문자 집합</strong> → 숫자만 쓰면 10^n, 대소문자+숫자면 62^n 경우의 수</li>
        <li><strong>용도에 맞는 형식</strong> → URL에 들어가는 토큰은 특수문자 제외 추천</li>
      </ul>

      <p className="mb-4">
        32자 대소문자+숫자 랜덤 문자열이면 62^32 = 약 2^190 경우의 수라 사실상 뚫기 불가능.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>키보드 랜덤 두드리기 → 사람이 만든 랜덤은 패턴이 생김. 보안상 좋지 않음</li>
        <li>터미널 → <code>openssl rand -base64 32</code> 괜찮긴 한데 결과에 특수문자가 섞여서 URL 토큰엔 부적합</li>
        <li>온라인 비밀번호 생성기 → 있긴 한데 길이 제한 있거나 원하는 문자 집합 설정이 안 되는 경우 많음</li>
        <li>코드로 직접 → Python/Node 스니펫 찾아서 실행. 간단한 작업에 과함</li>
        <li>패스워드 매니저 → 비밀번호용은 있어도 API 키 형태 문자열 생성엔 불편</li>
      </ul>

      <p className="mb-4">
        길이, 문자 종류, 개수를 자유롭게 조합해서 바로 뽑아주는 게 필요했음.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">기능:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>길이 설정 → 1~256자 자유롭게</li>
        <li>문자 집합 선택 → 대문자 / 소문자 / 숫자 / 특수문자 개별 토글</li>
        <li>여러 개 생성 → 1~100개 한 번에</li>
        <li>프리셋 → 비밀번호, URL 토큰, 16진수 키 등 자주 쓰는 형식 미리 설정</li>
        <li>복사 버튼 → 개별/전체 복사</li>
        <li>암호학적 랜덤 → Web Crypto API 사용</li>
        <li>엔트로피 표시 → 현재 설정의 보안 강도 수치로 표시</li>
      </ul>

      <p className="mb-3">프리셋 종류:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>강한 비밀번호</strong> → 16자, 대소문자+숫자+특수문자</li>
        <li><strong>URL 토큰</strong> → 32자, 대소문자+숫자 (특수문자 제외)</li>
        <li><strong>숫자 코드</strong> → 6자, 숫자만 (SMS 인증 코드 형태)</li>
        <li><strong>HEX 키</strong> → 64자, 16진수 (0-9, a-f)</li>
        <li><strong>PIN 코드</strong> → 4자, 숫자만</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>프리셋이 진짜 편함 → URL 토큰 클릭 한 번으로 적절한 설정 자동 완성</li>
        <li>엔트로피 표시 → 이 길이면 얼마나 안전한지 수치로 보여줘서 판단하기 좋음</li>
        <li>여러 개 한 번에 → 테스트 계정 10개 비밀번호 한 번에 뽑기</li>
        <li>특수문자 포함/제외 토글 → 일부 시스템에서 특수문자 못 쓸 때 제외 가능</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>발음 가능한 문자열(memorable password) 생성은 안 됨</li>
        <li>단어 기반 패스프레이즈 생성은 미지원</li>
        <li>생성 이력 저장 안 됨 (닫으면 사라짐)</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>길이 설정 (기본 16자)</li>
        <li>문자 집합 선택 (대문자/소문자/숫자/특수문자)</li>
        <li>생성 개수 입력 (기본 1개)</li>
        <li>생성 버튼 클릭 또는 프리셋 선택</li>
        <li>결과 복사</li>
      </ol>

      <p className="mb-4">프리셋 쓰면 5초면 됨.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/random-string-generator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 랜덤 문자열 생성기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">키보드 두드리기 말고, 제대로 된 랜덤으로.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #랜덤문자열 #비밀번호생성 #API키 #토큰생성 #시크릿키 #개발자도구
      </p>
    </article>
  );
}
