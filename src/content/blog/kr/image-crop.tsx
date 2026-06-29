import Link from 'next/link';

export default function ImageCropPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">이미지 · 2026년 7월 11일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        이미지 자르기, 비율 맞추기가 이렇게 귀찮을 줄은 몰랐다
      </h1>

      <p className="mb-4">
        <Link href="/tools/image-crop" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 이미지 자르기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        SNS에 올릴 사진을 정사각형으로 잘라야 하는데, 그냥 뚝딱 할 수 있는 도구가 없나.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">이미지 자르기가 필요한 순간</h2>

      <p className="mb-3">생각보다 이미지 자르기가 필요한 순간이 많다.</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>인스타그램 프로필 사진 → 1:1 정사각형으로 맞춰야 함</li>
        <li>트위터/X 헤더 이미지 → 3:1 비율 권장</li>
        <li>유튜브 썸네일 → 16:9 와이드 비율</li>
        <li>블로그 대표 이미지 → 플랫폼마다 권장 비율이 다름</li>
        <li>제품 사진 → 배경 잘라내고 주요 피사체만 남기기</li>
        <li>문서 스크린샷 → 불필요한 여백 제거</li>
      </ul>

      <p className="mb-4">포토샵이나 Lightroom 같은 전문 툴 쓰면 되긴 한데, 그냥 사진 하나 잘라려고 무거운 프로그램 켜는 게 귀찮다. 게다가 유료 구독이라 부담스럽기도 하고.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>포토샵 → 유료, 무거움, 단순 자르기 하나 하려고 켜기 싫음</li>
        <li>윈도우 그림판 → 자유 자르기는 되는데 비율 맞추기가 불편함</li>
        <li>macOS 미리보기 → 비율 고정 자르기는 가능하지만 직관적이지 않음</li>
        <li>온라인 사이트 → 파일을 서버에 올려야 함, 느림, 광고 가득</li>
        <li>구글 포토 → 기능은 있지만 계정 로그인 필요</li>
      </ul>

      <p className="mb-4">결국 매번 어디선가 찾아서 쓰는데, 빠르고 깔끔하게 되는 곳이 잘 없었다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만든 것</h2>

      <p className="mb-3">브라우저에서 바로 자르기 가능한 도구다. 파일 서버 업로드 없이 로컬에서 처리된다.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">주요 기능:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>자유 자르기 → 드래그로 원하는 영역 선택</li>
        <li>비율 고정 자르기 → 1:1, 4:3, 16:9, 3:2 등 SNS별 프리셋</li>
        <li>픽셀 단위 입력 → 정확한 사이즈로 자르기</li>
        <li>실시간 미리보기 → 자르기 전에 결과 확인 가능</li>
        <li>PNG/JPEG 선택 출력</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">SNS별 비율 프리셋:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>인스타그램 프로필 → 1:1</li>
        <li>인스타그램 피드 세로 → 4:5</li>
        <li>유튜브 썸네일 → 16:9</li>
        <li>트위터 헤더 → 3:1</li>
        <li>페이스북 커버 → 851:315</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>파일이 서버로 안 감 → 회사 내부 이미지도 편하게 처리 가능</li>
        <li>비율 프리셋이 있어서 SNS별로 맞추기 편함</li>
        <li>속도가 빠름 → 클라이언트 사이드 처리라 대기 없음</li>
        <li>드래그 인터페이스가 직관적</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>여러 장 배치 처리는 안 됨 → 한 번에 하나씩</li>
        <li>고급 편집 (레이어, 필터) 은 없음 → 단순 자르기 전용</li>
        <li>RAW 파일 형식은 미지원</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>이미지 드래그 앤 드롭 또는 클릭해서 업로드</li>
        <li>비율 프리셋 선택하거나 자유롭게 영역 드래그</li>
        <li>미리보기 확인</li>
        <li>다운로드</li>
      </ol>

      <p className="mb-4">30초면 된다. 설치도 로그인도 없다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/image-crop" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 이미지 자르기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">SNS 비율 맞추기, 이제 귀찮지 않다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #이미지자르기 #썸네일만들기 #SNS이미지 #이미지편집 #무료이미지편집
      </p>
    </article>
  );
}
