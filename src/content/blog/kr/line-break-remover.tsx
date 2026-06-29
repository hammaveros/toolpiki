import Link from 'next/link';

export default function LineBreakRemoverPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">텍스트 · 2026년 7월 1일 · 읽는 시간 3분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        PDF에서 복붙하면 줄바꿈이 다 섞이는 문제, 매번 수동으로 지웠음
      </h1>

      <p className="mb-4">
        <Link href="/tools/line-break-remover" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 줄바꿈 제거기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        보고서에서 내용 복사해서 슬랙에 붙여넣으니 줄바꿈이 단어 중간에 끼어 들어와 있다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">줄바꿈이 문제가 되는 상황</h2>

      <p className="mb-3">생각보다 자주 겪는다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>PDF 문서 텍스트 복사 → 줄 끝에 자동으로 줄바꿈이 붙음</li>
        <li>이메일 본문 복붙 → 레이아웃용 줄바꿈이 그대로 따라옴</li>
        <li>코드 주석 복사 → 줄 번호 구분자와 함께 줄바꿈이 섞임</li>
        <li>엑셀 셀 내용 복붙 → 셀 내 줄바꿈이 메시지에 들어옴</li>
        <li>웹페이지 텍스트 긁기 → HTML 줄바꿈이 함께 복사됨</li>
        <li>오래된 텍스트 파일 → 고정 폭 형식의 줄바꿈이 박혀 있음</li>
      </ul>

      <p className="mb-4">복붙 한 번 하면 텍스트가 조각조각 나뉘어 있어서, 문서 작성에 쓰려면 전부 이어줘야 한다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법들의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>텍스트 편집기 찾기/바꾸기 → \n을 인식 못하는 에디터가 많음</li>
        <li>Word에서 ^p 치환 → Word 파일 아니면 못 씀, 매번 붙여넣기-치환-복사 반복</li>
        <li>정규식 직접 작성 → 기억하기 귀찮고 실수하기 쉬움</li>
        <li>손으로 하나씩 지우기 → 긴 텍스트면 시간이 너무 걸림</li>
      </ul>

      <p className="mb-4">텍스트가 길수록, 줄바꿈이 많을수록 작업이 배로 귀찮아진다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">붙여넣으면 바로 줄바꿈 없앤 결과가 나온다. 옵션:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>줄바꿈 모두 제거</strong> → 전체를 한 줄로 이어줌</li>
        <li><strong>연속 줄바꿈만 제거</strong> → 빈 줄 없애고 단락은 유지</li>
        <li><strong>줄바꿈을 공백으로 변환</strong> → 단어 사이에 공백 넣어서 이어줌</li>
        <li><strong>줄바꿈을 쉼표로 변환</strong> → 목록 처리할 때 유용</li>
      </ul>

      <p className="mb-3">추가 기능:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>앞뒤 공백 자동 정리 → 줄 끝에 붙은 공백도 함께 제거</li>
        <li>결과 복사 버튼 → 바로 클립보드로</li>
        <li>원본/결과 글자수 비교 → 얼마나 정리됐는지 확인</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">줄바꿈 종류가 다양한 이유</h2>

      <p className="mb-3">운영체제마다 줄바꿈 방식이 달라서 텍스트가 섞일 때 문제가 생긴다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>LF (\n)</strong> → Linux, macOS, 대부분의 현대 시스템</li>
        <li><strong>CRLF (\r\n)</strong> → Windows 텍스트 파일 기본값</li>
        <li><strong>CR (\r)</strong> → 오래된 Mac OS 9 이하, 일부 레거시 시스템</li>
      </ul>

      <p className="mb-4">PDF, 이메일, 웹에서 복붙하면 이 세 가지가 섞여 들어오는 경우가 있다. 도구에서 전부 처리해준다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>옵션 선택 즉시 결과 나옴 → 버튼 따로 안 눌러도 됨</li>
        <li>여러 변환 방식 중 선택 가능 → 상황에 맞게 고를 수 있음</li>
        <li>원본 텍스트 그대로 유지 → 원본과 결과 비교하며 확인</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>의미 있는 줄바꿈(시, 코드 블록 등)도 제거됨 → 용도에 맞게 확인 후 사용</li>
        <li>히스토리 없음 → 창 닫으면 사라짐</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>줄바꿈이 섞인 텍스트 붙여넣기</li>
        <li>원하는 변환 방식 선택</li>
        <li>결과 복사</li>
        <li>끝</li>
      </ol>

      <p className="mb-4">5초면 된다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/line-break-remover" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 줄바꿈 제거기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">회원가입 없이 바로 쓸 수 있다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #줄바꿈제거 #텍스트정리 #복붙문제 #줄바꿈없애기 #텍스트도구 #무료도구
      </p>
    </article>
  );
}
