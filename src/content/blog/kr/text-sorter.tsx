import Link from 'next/link';

export default function TextSorterPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">텍스트 · 2026년 7월 2일 · 읽는 시간 3분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        텍스트 줄 정렬, 엑셀 안 쓰고 바로 하고 싶었음
      </h1>

      <p className="mb-4">
        <Link href="/tools/text-sorter" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 텍스트 정렬기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        팀원들한테서 받은 항목 목록인데, 사람마다 순서가 달라서 합치면 뒤죽박죽이다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">텍스트 정렬이 필요한 상황</h2>

      <p className="mb-3">생각보다 다양한 곳에서 필요하다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>여러 사람이 작성한 목록 취합 → 가나다/ABC순으로 통일</li>
        <li>태그, 키워드 목록 → 알파벳순 정리</li>
        <li>파일명 목록 → 정렬해서 빠진 게 있는지 확인</li>
        <li>이름/이메일 목록 → 찾기 쉽게 순서 정렬</li>
        <li>코드에서 import 목록 → 가나다/알파벳순으로 정리</li>
        <li>설문 응답 → 빈도 파악 전 정렬로 유사 항목 모으기</li>
      </ul>

      <p className="mb-4">정렬만 하면 되는데 엑셀 여는 게 더 귀찮을 때가 있다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법들의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>엑셀 정렬 기능 → 파일 열고 붙여넣고 정렬하고 복사하고... 과정이 길다</li>
        <li>터미널 sort 명령 → 옵션 기억하기 귀찮고, 한글 정렬 결과가 이상할 수 있음</li>
        <li>구글 스프레드시트 → 비슷한 번거로움</li>
        <li>온라인 정렬 도구 → 광고 많고 옵션이 부족함</li>
      </ul>

      <p className="mb-4">텍스트 바로 정렬해주는 도구가 의외로 없었다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">텍스트 붙여넣으면 줄 단위로 정렬해준다. 옵션:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>오름차순</strong> → 가→하, A→Z, 0→9</li>
        <li><strong>내림차순</strong> → 하→가, Z→A, 9→0</li>
        <li><strong>역순</strong> → 현재 순서 뒤집기 (정렬 아닌 단순 역전)</li>
        <li><strong>무작위 섞기</strong> → 랜덤 순서로 섞기</li>
        <li><strong>대소문자 구분</strong> → 대문자를 소문자 앞에 둘지 여부</li>
        <li><strong>자연 정렬</strong> → item1, item2, item10이 올바른 순서로 정렬</li>
      </ul>

      <p className="mb-3">추가 옵션:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>앞뒤 공백 무시하고 정렬</li>
        <li>빈 줄 제거 후 정렬</li>
        <li>중복 제거 후 정렬</li>
        <li>결과 복사 버튼</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">자연 정렬이 중요한 이유</h2>

      <p className="mb-3">일반 정렬과 자연 정렬의 차이:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>일반 정렬:</strong> item1, item10, item2, item3... → 숫자를 문자 취급</li>
        <li><strong>자연 정렬:</strong> item1, item2, item3... item10 → 숫자를 숫자 취급</li>
      </ul>

      <p className="mb-4">파일명 목록이나 번호가 붙은 항목을 정렬할 때 자연 정렬 옵션이 유용하다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">한글 정렬 기준</h2>

      <p className="mb-3">한글은 유니코드 순서로 정렬된다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>가나다 순서 → ㄱ, ㄴ, ㄷ, ㄹ... 순으로 정렬</li>
        <li>한글이 영문보다 앞에 오거나 뒤에 올 수 있음 → 유니코드 기준</li>
        <li>받침이 없는 글자가 있는 글자보다 앞 → &quot;가&quot; &lt; &quot;각&quot;</li>
      </ul>

      <p className="mb-4">한글과 영문 섞인 목록은 정렬 결과가 예상과 다를 수 있으니 확인해봐야 함.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>붙여넣기 즉시 정렬 → 옵션 바꾸면 실시간 반영</li>
        <li>정렬 + 중복 제거 + 빈 줄 제거 한꺼번에 가능</li>
        <li>역순, 무작위 섞기 등 정렬 외 기능도 있음</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>줄 단위 정렬만 가능 → 열(컬럼) 기준 정렬은 안 됨</li>
        <li>복잡한 한글 정렬 규칙은 시스템 로케일에 따라 다를 수 있음</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>정렬할 텍스트 붙여넣기</li>
        <li>정렬 방식 선택</li>
        <li>결과 복사</li>
        <li>끝</li>
      </ol>

      <p className="mb-4">3초면 된다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/text-sorter" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 텍스트 정렬기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">회원가입 없이 바로 쓸 수 있다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #텍스트정렬 #가나다순정렬 #알파벳정렬 #텍스트도구 #목록정렬 #무료도구
      </p>
    </article>
  );
}
