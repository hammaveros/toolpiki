import Link from 'next/link';

export default function LineNumberPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">텍스트 · 2026년 7월 1일 · 읽는 시간 3분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        텍스트에 줄 번호 붙이기, 이걸 위해 에디터 켜고 싶지 않았음
      </h1>

      <p className="mb-4">
        <Link href="/tools/line-number" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 줄 번호 추가기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        코드 리뷰 피드백 공유할 때 "17번째 줄 확인해줘"라고 하려는데, 줄 번호가 없는 텍스트 파일이라 직접 세고 있었다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">줄 번호가 필요한 상황</h2>

      <p className="mb-3">생각해보면 꽤 다양하다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>코드 리뷰 코멘트 → "12번 줄에서 변수명 바꿔야 해"</li>
        <li>문서 검토 의견 → "34번째 줄 내용 이해가 안 됨"</li>
        <li>로그 파일 분석 → 특정 줄 위치 공유</li>
        <li>번역 작업 → 원본과 번역 줄 번호 맞추기</li>
        <li>법률/계약 문서 → 조항 번호 대신 줄 번호 참조</li>
        <li>테스트 케이스 목록 → 몇 번째 케이스인지 명확히 표시</li>
      </ul>

      <p className="mb-4">줄 번호 없으면 "어디에 있는 내용인지" 설명하기가 애매하다. 메일로 공유할 때 특히.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법들의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>VS Code나 에디터 → 줄 번호 보이긴 하는데 복사할 수가 없음, 화면 캡처해야 함</li>
        <li>cat -n 명령어 → 터미널 써야 함, 비개발자한테는 장벽</li>
        <li>Word에서 줄 번호 설정 → 기능은 있는데 옵션 찾기가 복잡함</li>
        <li>스프레드시트 → 셀마다 번호 매기는 거라 원본 형태 유지가 안 됨</li>
      </ul>

      <p className="mb-4">그냥 텍스트에 번호 붙여서 복사하고 싶은 건데, 방법이 다 번거롭다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">텍스트 붙여넣으면 각 줄 앞에 번호 붙여준다. 옵션:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>시작 번호 설정</strong> → 1부터가 아니라 원하는 숫자부터 시작 가능</li>
        <li><strong>구분자 선택</strong> → 마침표(1.), 콜론(1:), 괄호(1)) 등</li>
        <li><strong>번호 자릿수 맞추기</strong> → 01, 02... 형식으로 줄 정렬</li>
        <li><strong>빈 줄 번호 제외</strong> → 내용 있는 줄에만 번호 붙이기</li>
      </ul>

      <p className="mb-3">결과:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>번호 붙은 텍스트 바로 복사 가능</li>
        <li>총 줄 수 표시</li>
        <li>원본 텍스트와 비교 가능</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">줄 번호 형식 예시</h2>

      <p className="mb-3">상황에 따라 다른 형식이 어울린다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>1. 텍스트</strong> → 문서, 보고서에 일반적</li>
        <li><strong>1: 텍스트</strong> → 코드 스타일에 익숙한 사람</li>
        <li><strong>1) 텍스트</strong> → 목록 형태로 보일 때</li>
        <li><strong>01 텍스트</strong> → 자릿수 맞추는 게 중요할 때</li>
        <li><strong>[1] 텍스트</strong> → 참고 문헌 스타일</li>
      </ul>

      <p className="mb-4">구분자 선택 옵션이 있으니 상황에 맞게 고르면 된다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>붙여넣으면 바로 결과 → 빠름</li>
        <li>구분자 옵션이 다양 → 용도에 맞게 선택 가능</li>
        <li>시작 번호 설정 가능 → 부분 발췌 텍스트에도 원래 줄 번호 유지</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>번호 제거(역방향) 기능은 없음</li>
        <li>특정 범위만 번호 붙이는 건 안 됨</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>줄 번호 붙일 텍스트 붙여넣기</li>
        <li>구분자, 시작 번호 등 옵션 설정</li>
        <li>결과 복사</li>
        <li>끝</li>
      </ol>

      <p className="mb-4">3초면 된다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/line-number" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 줄 번호 추가기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">회원가입 없이 바로 쓸 수 있다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #줄번호 #줄번호추가 #텍스트도구 #코드리뷰 #문서작업 #무료도구
      </p>
    </article>
  );
}
