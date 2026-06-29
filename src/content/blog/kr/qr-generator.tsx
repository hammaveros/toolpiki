import Link from 'next/link';

export default function QrGeneratorPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">계산/생성 · 2026년 6월 18일 · 읽는 시간 3분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        QR 코드 만드는 데 왜 회원가입이 필요한 거야
      </h1>

      <p className="mb-4">
        <Link href="/tools/qr-generator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 QR 코드 생성기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        발표 자료에 QR 코드 하나 넣으면 되는데, 검색하면 나오는 사이트마다 이메일 인증부터 요구한다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">QR 코드가 필요한 상황</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>발표 자료 → 참고 링크를 QR로 삽입</li>
        <li>명함/포스터 → URL 대신 QR로 깔끔하게</li>
        <li>매장 → 메뉴판, 결제 링크</li>
        <li>이벤트 → 설문 링크 배포</li>
        <li>개발 테스트 → 모바일 환경에서 URL 열기</li>
      </ul>

      <p className="mb-4">별거 아닌 것 같은데 의외로 자주 필요하다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 사이트들 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>회원가입 강요 → QR 하나에 이메일 인증까지?</li>
        <li>유료 플랜 유도 → "고해상도는 프리미엄" 등</li>
        <li>광고 가득 → 다운로드 버튼 찾기가 더 힘듦</li>
        <li>QR 만료 → 서비스 종료되면 기존 QR이 먹통 됨</li>
      </ul>

      <p className="mb-4">URL 하나 QR로 바꾸는 게 이렇게까지 복잡할 일이 아니다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">기능:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>URL, 텍스트, 전화번호, 이메일, WiFi 정보 → QR 생성</li>
        <li>색상 커스터마이징 (전경색/배경색)</li>
        <li>크기 조절</li>
        <li>PNG/SVG 다운로드</li>
        <li>로고 삽입 (중앙에 브랜드 이미지 넣기)</li>
      </ul>

      <p className="mb-3">중요한 것:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>QR 코드가 서버에 저장되지 않음 → 만료 없음</li>
        <li>생성된 QR은 영구적 → 사이트가 없어져도 QR은 작동함</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>입력하면 실시간으로 미리보기 생성됨</li>
        <li>SVG 다운로드 가능 → 인쇄물에서 깨짐 없음</li>
        <li>색상 바꿔도 스캔 잘 됨 (오류 보정 레벨 자동)</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>동적 QR (클릭 수 추적) 기능은 없음</li>
        <li>QR 히스토리 저장 없음</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>URL 또는 텍스트 입력</li>
        <li>색상/크기 원하면 조정</li>
        <li>다운로드</li>
      </ol>

      <p className="mb-4">10초면 된다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/qr-generator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 QR 코드 생성기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">가입 없이, 만료 없이.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #QR코드생성 #QR코드만들기 #무료QR #온라인도구
      </p>
    </article>
  );
}
