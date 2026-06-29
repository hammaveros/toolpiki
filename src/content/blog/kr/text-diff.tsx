import Link from 'next/link';

export default function TextDiffPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">텍스트 · 2026년 6월 15일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        텍스트 비교, 워드나 복붙으로 하다가 지쳤을 때
      </h1>

      <p className="mb-4">
        <Link href="/tools/text-diff" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 텍스트 비교기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        수정 전/후 문서 두 개를 받았는데, 뭐가 바뀐 건지 눈으로 다 찾아야 하는 상황.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 텍스트 비교가 필요하냐면</h2>

      <p className="mb-3">생각보다 자주 마주친다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>계약서 수정본을 받았는데 뭐가 달라졌는지 모를 때 → 조항 하나하나 읽어야 함</li>
        <li>팀원이 문서 고쳐서 줬는데 변경 이력 없을 때 → 원본이랑 비교해야 함</li>
        <li>코드 리뷰 없이 파일 두 개 넘겨받았을 때 → diff 없이 눈으로 찾아야 함</li>
        <li>블로그 글 초안 vs 최종본 → 빠진 내용 있는지 확인</li>
        <li>번역 검수할 때 → 원문이랑 번역본 대조</li>
        <li>설정 파일 두 버전 비교할 때 → 어디가 다른지 바로 알아야 함</li>
      </ul>

      <p className="mb-4">
        특히 문서가 길수록, 글씨가 비슷비슷할수록 눈으로 찾는 게 한계가 있다.
        한두 글자 차이, 공백 하나, 문장 순서 바뀐 것 같은 건 그냥 넘어가기 쉽다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <p className="mb-3">보통 이렇게들 한다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>워드 "변경 내용 추적" 기능 → 처음부터 켜놨어야 함, 나중에 켜면 소용없음</li>
        <li>두 창 띄워서 눈으로 비교 → 길면 집중력이 금방 흐트러짐</li>
        <li>Ctrl+F로 특정 문장 찾기 → 뭐가 바뀐지 알아야 찾지</li>
        <li>Git diff → 개발자 아니면 쓰기 어렵고, 텍스트 파일에만 됨</li>
        <li>구글 독스 버전 기록 → 처음부터 구글 독스에 있어야 함</li>
      </ul>

      <p className="mb-3">개발자 도구들은 너무 복잡하고, 워드 기능은 조건이 맞아야 쓸 수 있고.</p>

      <p className="mb-4">
        그냥 텍스트 두 덩어리 붙여넣으면 어디가 다른지 색으로 표시해주는 게 필요했는데
        찾아보면 광고투성이 사이트밖에 없거나, 이상하게 복잡한 UI만 있었다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">왼쪽에 원본, 오른쪽에 수정본 붙여넣으면 바로 비교된다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>추가된 텍스트 → 초록색으로 표시</li>
        <li>삭제된 텍스트 → 빨간색으로 표시</li>
        <li>변경된 부분 → 줄 단위로 하이라이트</li>
        <li>변경 없는 부분 → 그대로 표시 (맥락 파악용)</li>
        <li>통계 요약 → 추가/삭제/변경 줄 수 한눈에</li>
      </ul>

      <p className="mb-3">추가로 있는 것들:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>대소문자 무시 옵션 → 영어 문서 비교할 때 유용</li>
        <li>공백 무시 옵션 → 들여쓰기만 바뀐 경우 걸러낼 때</li>
        <li>줄 단위 / 글자 단위 비교 선택 → 세밀하게 보고 싶을 때</li>
        <li>복사 버튼 → 결과를 바로 클립보드로</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>붙여넣자마자 바로 비교됨 → 버튼 따로 안 눌러도 됨</li>
        <li>색으로 구분돼서 한눈에 들어옴 → 500줄 문서도 10초면 파악</li>
        <li>공백/대소문자 옵션이 생각보다 자주 쓰임 → 코드 비교할 때 특히</li>
        <li>설치 없이 브라우저에서 바로 가능 → 회사 컴퓨터에서도 그냥 씀</li>
        <li>입력한 텍스트가 서버로 안 감 → 기밀 문서도 부담 없이</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>이미지나 표가 있는 워드 파일 → 텍스트만 가능, 파일 직접 비교는 안 됨</li>
        <li>비교 결과 저장 → 화면 캡처나 복붙으로 해결해야 함</li>
        <li>수만 줄 파일 → 너무 크면 느려질 수 있음</li>
      </ul>

      <p className="mb-4">
        그래도 일상적인 문서 비교, 설정 파일 비교, 번역 검수 수준에서는 충분하다.
        특히 기밀 문서 다룰 때 외부 서버로 안 보내도 된다는 게 의외로 중요한 포인트.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">어떤 상황에 제일 유용한가</h2>

      <p className="mb-3">써보고 나서 이런 케이스에 자주 쓰게 됐다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>계약서 수정본 검토 → "뭐가 바뀐 거야?" 싶을 때</li>
        <li>이메일 초안 두 버전 비교 → 어느 게 더 나은지 보면서 선택</li>
        <li>코드 스니펫 비교 → git 쓰기 귀찮은 임시 코드 비교</li>
        <li>설정 파일(JSON, YAML 등) 비교 → 어떤 값이 다른지</li>
        <li>번역 원문 대조 → 빠진 문장 없는지 확인</li>
        <li>학생 보고서 표절 검사 → 두 파일 텍스트 복붙해서 비교</li>
      </ul>

      <p className="mb-4">
        텍스트 관련 작업을 하다 보면 비교가 필요한 순간이 생각보다 훨씬 많다.
        그때마다 워드 열거나 눈으로 찾는 것보다 훨씬 빠르다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>왼쪽 칸에 원본 텍스트 붙여넣기</li>
        <li>오른쪽 칸에 비교할 텍스트 붙여넣기</li>
        <li>자동으로 비교 결과 표시됨</li>
        <li>필요하면 옵션(공백 무시, 대소문자 무시) 조절</li>
        <li>끝</li>
      </ol>

      <p className="mb-4">회원가입, 로그인, 설치 같은 거 없다. 그냥 들어가서 붙여넣으면 된다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/text-diff" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 텍스트 비교기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">
        두 텍스트 붙여넣으면 바로 된다. 딱 그것만 함.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #텍스트비교 #diff #문서비교 #텍스트도구 #무료도구
      </p>
    </article>
  );
}
