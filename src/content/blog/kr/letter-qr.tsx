import Link from 'next/link';

export default function LetterQrPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">계산/생성 · 2026년 7월 12일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        편지 쓰고 QR코드까지, 한 번에 만들 수 있는 도구
      </h1>

      <p className="mb-4">
        <Link href="/tools/letter-qr" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 편지 + QR코드 만들기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        생일 선물에 손편지를 같이 넣고 싶은데, 거기다 QR코드도 붙여서 영상 링크로 연결하면 좋을 것 같다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">편지 + QR코드가 필요한 순간</h2>

      <p className="mb-3">디지털과 아날로그를 연결하고 싶을 때.</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>생일 카드 → 축하 메시지 + 유튜브 영상 링크 QR</li>
        <li>결혼 답례품 카드 → 감사 인사 + 웨딩 사진 갤러리 링크</li>
        <li>기념일 편지 → 손편지 느낌 + 추억 영상/플레이리스트 QR</li>
        <li>이벤트 초대장 → 장소/시간 안내 + 구글맵 QR</li>
        <li>명함/홍보물 → 소개 문구 + 포트폴리오 사이트 QR</li>
        <li>패키지 메시지 카드 → 제품 설명 + 사용 방법 영상 QR</li>
      </ul>

      <p className="mb-4">요즘엔 인쇄물에 QR코드 붙이는 게 자연스러워졌는데, 편지와 QR을 같이 만들어주는 도구가 따로 없었다. 편지 디자인 따로, QR 따로 만들어서 합치는 게 번거로웠다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>QR 생성 사이트 → QR만 만들어줌, 편지 레이아웃 없음</li>
        <li>카드 만들기 앱 → 예쁜 디자인은 있는데 QR 삽입이 안 되거나 유료</li>
        <li>파워포인트 → 만들 수 있긴 한데 QR 플러그인 따로 설치해야 함</li>
        <li>Canva → QR 기능이 유료 Pro 플랜</li>
        <li>직접 포토샵 → 만들 수 있지만 시간이 오래 걸림</li>
      </ul>

      <p className="mb-4">편지 텍스트 쓰고, QR 링크 입력하고, 출력 버튼 하나로 끝났으면 했다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">편지와 QR을 같이 만드는 방법</h2>

      <p className="mb-3">편지 내용 입력하면 QR코드와 함께 인쇄용 카드 레이아웃으로 만들어준다.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">주요 기능:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>편지 내용 입력 → 제목, 본문, 서명 구분</li>
        <li>QR코드 URL 입력 → URL, 유튜브, 인스타그램 링크 모두 가능</li>
        <li>레이아웃 선택 → 편지 + QR 위치 조합</li>
        <li>배경 디자인 → 심플, 꽃, 기하학 등 테마</li>
        <li>폰트 선택 → 손글씨체, 명조, 고딕 등</li>
        <li>인쇄 최적화 → A4, 카드 사이즈 출력</li>
        <li>이미지로 저장 → PNG/PDF 다운로드</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>편지 + QR을 한 화면에서 바로 → 왔다갔다 안 해도 됨</li>
        <li>인쇄용 최적화 레이아웃 → 직접 편집 없이 바로 출력 가능</li>
        <li>디자인 테마 있어서 예쁨 → 별도 디자인 없어도 됨</li>
        <li>완전 무료</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>고급 커스터마이징 (이미지 삽입 등) 은 제한적</li>
        <li>템플릿 종류가 많진 않음 → 더 다양한 디자인 원하면 Canva가 낫긴 함</li>
        <li>손글씨 느낌 폰트는 웹폰트라 인쇄 시 약간 다를 수 있음</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>편지 내용 입력 (제목 / 본문 / 서명)</li>
        <li>QR코드로 연결할 URL 입력</li>
        <li>디자인 테마 선택</li>
        <li>미리보기 확인 후 다운로드 또는 인쇄</li>
      </ol>

      <p className="mb-4">5분이면 충분하다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/letter-qr" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 편지 + QR코드 만들기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">편지에 링크를 담는 가장 쉬운 방법.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #QR코드생성 #편지만들기 #카드만들기 #QR편지 #생일카드 #선물카드
      </p>
    </article>
  );
}
