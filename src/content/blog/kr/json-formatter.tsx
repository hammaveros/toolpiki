import Link from 'next/link';

export default function JsonFormatterPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">포맷터 · 2026년 6월 12일 · 읽는 시간 3분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        JSON 정리할 때마다 검색이 귀찮아서 만든 것
      </h1>

      <p className="mb-4">
        <Link href="/tools/json-formatter" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 JSON 포맷터 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        API 응답을 콘솔에 찍었더니 한 줄로 뭉쳐 있다. 구조를 파악하려면 정리가 필요하다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">JSON 포맷팅이 필요한 상황</h2>

      <p className="mb-3">개발하다 보면 생각보다 자주 나온다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>API 응답 디버깅 → 한 줄로 뭉쳐 있어서 읽기 힘듦</li>
        <li>설정 파일 수정 → 들여쓰기가 엉망으로 되어 있음</li>
        <li>로그 분석 → JSON 형태 로그를 보기 좋게 정리</li>
        <li>데이터 검증 → JSON 문법 오류 있는지 확인</li>
        <li>문서 작성 → 예제 코드에 넣을 JSON 정리</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>브라우저 개발자 도구 → 매번 열기 귀찮음</li>
        <li>온라인 사이트 → 광고, 팝업, 느린 로딩이 기본</li>
        <li>VS Code에서 직접 → 파일로 만들어야 해서 번거로움</li>
        <li>Python/Node 커맨드 → 터미널 열어야 함</li>
      </ul>

      <p className="mb-4">그냥 붙여넣으면 바로 예쁘게 나왔으면 했다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">기능은 이것들:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>자동 들여쓰기 포맷팅</li>
        <li>문법 오류 감지 및 위치 표시</li>
        <li>JSON 압축 (공백 제거)</li>
        <li>키 정렬 옵션</li>
        <li>결과 복사 버튼</li>
      </ul>

      <p className="mb-3">추가로:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>JSON → YAML 변환</li>
        <li>들여쓰기 간격 선택 (2칸/4칸/탭)</li>
        <li>문법 하이라이팅</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>붙여넣자마자 포맷팅 됨 → 버튼 누를 필요 없음</li>
        <li>오류 있으면 어느 줄인지 바로 표시</li>
        <li>JSON이 아닌 텍스트 붙여넣으면 바로 알려줌</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>아주 큰 JSON(수백 MB 이상)은 느릴 수 있음</li>
        <li>스키마 검증은 없음</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>JSON 붙여넣기</li>
        <li>자동으로 정리됨</li>
        <li>복사 버튼으로 가져가기</li>
      </ol>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/json-formatter" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 JSON 포맷터 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">설치 없이 브라우저에서 바로 됨.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #JSON포맷터 #JSON정리 #개발자도구 #무료도구
      </p>
    </article>
  );
}
