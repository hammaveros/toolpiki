import Link from 'next/link';

export default function ImageCompressPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">이미지 · 2026년 6월 15일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        이미지 압축, 파일을 서버에 올리지 않아도 되는 방법
      </h1>

      <p className="mb-4">
        <Link href="/tools/image-compress" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 이미지 압축 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        회사 내부 자료 스크린샷을 압축해야 하는데, 외부 사이트에 올리기가 좀 꺼려진다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">이미지 압축이 필요한 상황</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>블로그/웹사이트 이미지 → 페이지 로딩 속도 개선</li>
        <li>이메일 첨부 → 용량 제한 있을 때</li>
        <li>SNS 업로드 → 플랫폼이 자동 압축해서 화질 망가지기 전에 미리</li>
        <li>폼 제출 → 파일 크기 제한 있는 시스템</li>
        <li>개발용 에셋 → 앱/웹 번들 사이즈 줄이기</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 사이트 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>파일이 서버에 업로드됨 → 민감한 이미지는 꺼려짐</li>
        <li>무료는 제한 있음 → 파일 크기 제한, 일일 횟수 제한</li>
        <li>광고 덕지덕지 → 다운로드 버튼이 어딨는지 못 찾겠음</li>
        <li>회원가입 요구 → 이미지 하나 압축하려고 가입?</li>
      </ul>

      <p className="mb-4">특히 업무 자료나 개인 사진은 외부 서버에 올리기 찝찝한 경우가 있다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">브라우저에서만 처리하면 됨</h2>

      <p className="mb-3">Canvas API를 쓰면 파일을 서버에 올리지 않고 브라우저 안에서만 이미지를 처리할 수 있다. 페이지 닫으면 사라지고, 외부로 전송되는 것도 없다.</p>

      <p className="mb-3">기능:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>품질 슬라이더 → 원하는 만큼 압축 (1~100%)</li>
        <li>최대 너비/높이 설정 → 리사이즈 동시에</li>
        <li>JPEG·PNG·WebP 출력 형식 선택</li>
        <li>원본 vs 압축 용량 비교</li>
        <li>여러 장 동시 처리</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>파일이 서버로 안 감 → 민감한 자료도 안심하고 쓸 수 있음</li>
        <li>속도가 빠름 → 로컬에서 처리하니까</li>
        <li>여러 장 한 번에 됨 → 배치 작업 가능</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>RAW 파일 포맷은 지원 안 함</li>
        <li>아주 고해상도 이미지는 처리 시간이 조금 걸림</li>
        <li>PNG의 경우 JPEG보다 압축률이 낮음 (PNG 자체 특성)</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>이미지 드래그 앤 드롭 또는 클릭해서 선택</li>
        <li>품질 슬라이더 조정</li>
        <li>다운로드</li>
      </ol>

      <p className="mb-4">30초면 끝난다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/image-compress" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 이미지 압축 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">서버 업로드 없이, 무료로.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #이미지압축 #이미지용량줄이기 #무료이미지압축 #개인정보보호
      </p>
    </article>
  );
}
