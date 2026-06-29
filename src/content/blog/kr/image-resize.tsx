import Link from 'next/link';

export default function ImageResizePost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">이미지 · 2026년 7월 11일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        이미지 크기 조절, 매번 포토샵 켜기가 귀찮아서 만들었다
      </h1>

      <p className="mb-4">
        <Link href="/tools/image-resize" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 이미지 크기 조절 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        이메일에 첨부할 이미지가 너무 커서 800px로 줄여야 하는데, 포토샵 켜기는 너무 무겁다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">이미지 크기 조절이 필요한 순간</h2>

      <p className="mb-3">별거 아닌 것 같아도 자주 필요하다.</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>이메일 첨부 → 파일 크기 제한 걸릴 때</li>
        <li>웹사이트 이미지 → 너무 크면 로딩 느려짐</li>
        <li>블로그 썸네일 → 플랫폼 권장 사이즈에 맞추기</li>
        <li>개발 중 샘플 이미지 → 빠른 테스트용으로 줄이기</li>
        <li>스마트폰으로 찍은 사진 → 보통 4000px 이상, 공유할 때 너무 큼</li>
        <li>문서 첨부용 → 일정 해상도 이하로 맞춰야 하는 경우</li>
      </ul>

      <p className="mb-4">스마트폰으로 찍은 사진은 기본적으로 12MP, 48MP 이상인 것도 많다. 그걸 그냥 이메일에 붙이면 첨부 파일만 10MB가 넘는다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>포토샵 → 유료에 무거움, 간단한 리사이즈에 과함</li>
        <li>그림판 (윈도우) → 픽셀 입력은 되지만 비율 유지가 번거롭고 화질이 떨어짐</li>
        <li>미리보기 (macOS) → 기능 숨어 있어서 찾기 귀찮음</li>
        <li>온라인 사이트 → 서버에 파일 올려야 하고, 광고 많고, 느림</li>
        <li>명령줄 ImageMagick → 개발자 아니면 모름</li>
      </ul>

      <p className="mb-4">그냥 픽셀 입력하면 리사이즈 되는 게 있으면 좋겠다고 생각했다. 비율 유지도 자동으로 되고.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">브라우저에서 바로 처리</h2>

      <p className="mb-3">Canvas API 써서 브라우저 안에서만 리사이즈 처리한다. 파일이 외부로 안 나간다.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">주요 기능:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>픽셀 직접 입력 → 가로/세로 원하는 사이즈로</li>
        <li>비율 잠금 → 한쪽 수정하면 반대쪽 자동 계산</li>
        <li>퍼센트 입력 → 원본 대비 50%, 25% 등</li>
        <li>출력 형식 선택 → JPEG, PNG, WebP</li>
        <li>JPEG 품질 조정 → 파일 크기 더 줄이기</li>
        <li>원본 vs 결과 사이즈 비교 표시</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">자주 쓰는 사이즈 프리셋:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>HD → 1280×720</li>
        <li>Full HD → 1920×1080</li>
        <li>4K → 3840×2160</li>
        <li>인스타그램 정사각형 → 1080×1080</li>
        <li>트위터 이미지 → 1200×675</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>비율 잠금 기능이 편함 → 가로만 입력하면 세로 자동 계산</li>
        <li>파일이 서버로 안 감 → 민감한 사진도 안심</li>
        <li>WebP 출력 지원 → JPEG 대비 파일 크기 30% 이상 줄어드는 경우도 있음</li>
        <li>처리 속도 빠름 → 로컬 처리라 기다림 없음</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>한 번에 하나씩만 처리 가능 (배치 미지원)</li>
        <li>원본보다 크게 확대하면 화질 저하는 피할 수 없음</li>
        <li>HEIC 파일은 직접 지원 안 됨 → 먼저 JPEG 변환 필요</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>이미지 드래그 앤 드롭 또는 클릭해서 업로드</li>
        <li>원하는 가로/세로 픽셀 또는 % 입력</li>
        <li>비율 잠금 여부 선택</li>
        <li>출력 형식 선택 후 다운로드</li>
      </ol>

      <p className="mb-4">1분도 안 걸린다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/image-resize" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 이미지 크기 조절 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">설치 없이, 서버 없이, 바로 된다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #이미지리사이즈 #이미지크기조절 #사진크기줄이기 #무료이미지편집 #웹이미지최적화
      </p>
    </article>
  );
}
