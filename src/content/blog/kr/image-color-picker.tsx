import Link from 'next/link';

export default function ImageColorPickerPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">이미지 · 2026년 7월 11일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        사진에서 색상 추출, 이제 포토샵 없이도 된다
      </h1>

      <p className="mb-4">
        <Link href="/tools/image-color-picker" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 이미지 색상 추출 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        레퍼런스 사이트에서 본 배경색이 마음에 드는데, 정확히 어떤 색인지 HEX 코드를 알고 싶다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">색상 추출이 필요한 상황</h2>

      <p className="mb-3">디자인 작업하다 보면 자주 생긴다.</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>로고/브랜드 이미지 → 정확한 브랜드 컬러 추출</li>
        <li>레퍼런스 사진 → 마음에 드는 색상 HEX 코드 확인</li>
        <li>제품 사진 → 배경색 또는 주요 컬러 추출</li>
        <li>UI 디자인 → 기존 화면에서 색상 일치시키기</li>
        <li>그림/일러스트 → 팔레트 구성 참고용</li>
        <li>인테리어/패션 → 어울리는 색 조합 찾기</li>
      </ul>

      <p className="mb-4">포토샵 스포이드 도구 쓰면 되긴 하는데, 그러려면 포토샵이 있어야 하고, 실행하는 데만 30초가 넘는다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>포토샵 → 유료, 무거움, 간단한 색 추출 하나에 과함</li>
        <li>Figma → 디자인 파일 열어야 쓸 수 있음, 이미지에서 바로 스포이드 불편</li>
        <li>브라우저 개발자 도구 → 웹 화면에서는 가능하지만 이미지 파일은 별도로 못 함</li>
        <li>온라인 색상 추출 사이트 → 서버에 파일 올려야 함, 느림</li>
        <li>윈도우 색 선택 도구 → HEX 코드로 바로 복사 안 됨</li>
      </ul>

      <p className="mb-4">그냥 이미지 올리고 클릭하면 HEX 코드 나오는 거 없나 해서 만들었다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">이런 기능으로 만들었다</h2>

      <p className="mb-3">Canvas API로 이미지를 렌더링하고 클릭한 픽셀의 색상값을 읽어온다. 파일이 서버로 안 간다.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">주요 기능:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>클릭 스포이드 → 이미지에서 원하는 픽셀 클릭하면 색상 추출</li>
        <li>HEX 코드 복사 → 클릭 한 번으로 클립보드에 복사</li>
        <li>RGB 값 확인 → R/G/B 각각의 값 표시</li>
        <li>HSL 값 확인 → 색조/채도/명도</li>
        <li>색상 히스토리 → 추출한 색상 목록 저장</li>
        <li>주요 색상 팔레트 → 이미지 전체에서 자주 등장하는 색상 자동 추출</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">활용 예시:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>브랜드 가이드라인 색상 코드 확인</li>
        <li>사진에서 팔레트 생성 → CSS에 바로 적용</li>
        <li>로고 색상 추출 → 시안 작업에 활용</li>
        <li>인테리어 사진 → 벽지/가구 색상 코드 추출</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>클릭 한 번으로 HEX 코드까지 → 복사도 바로 됨</li>
        <li>여러 색상 히스토리 유지 → 비교하면서 쓸 수 있음</li>
        <li>자동 팔레트 추출 → 이미지 전체 색감 파악 빠름</li>
        <li>파일 서버 업로드 없음 → 사내 자료, 개인 사진 모두 안심</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>그라디언트 영역은 정확한 색 하나 집기 어려움</li>
        <li>모바일에서 작은 영역 정밀 클릭은 불편할 수 있음</li>
        <li>CMYK 값은 지원 안 함 → 인쇄 작업엔 별도 변환 필요</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>이미지 업로드 (드래그 앤 드롭 가능)</li>
        <li>원하는 색상 영역 클릭</li>
        <li>HEX/RGB/HSL 코드 확인 및 복사</li>
      </ol>

      <p className="mb-4">스포이드 도구는 항상 필요한데, 포토샵 없어도 이제 된다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/image-color-picker" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 이미지 색상 추출 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">이미지에서 HEX 코드, 클릭 한 번으로.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #색상추출 #스포이드 #HEX코드 #이미지색상 #컬러피커 #디자인도구
      </p>
    </article>
  );
}
