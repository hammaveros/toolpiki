import Link from 'next/link';

export default function DuplicateLineRemoverPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">텍스트 · 2026년 7월 1일 · 읽는 시간 3분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        중복된 줄 제거, 엑셀 없이 텍스트 그대로 처리하고 싶었음
      </h1>

      <p className="mb-4">
        <Link href="/tools/duplicate-line-remover" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 중복 줄 제거기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        여러 출처에서 이메일 주소 목록 합쳤더니 중복이 수백 개다. 이걸 일일이 눈으로 찾을 수가 없다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">중복 제거가 필요한 상황</h2>

      <p className="mb-3">데이터 정리하다 보면 자주 생긴다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>여러 파일에서 합친 이메일/연락처 목록 → 중복 항목 제거</li>
        <li>여러 사람이 입력한 태그/키워드 → 겹치는 거 없애기</li>
        <li>로그 파일에서 IP 주소 추출 → 고유한 IP만 남기기</li>
        <li>설문조사 응답 텍스트 → 같은 답변 통합</li>
        <li>코드에서 import 목록 → 중복 import 정리</li>
        <li>URL 목록 → 같은 링크 제거</li>
      </ul>

      <p className="mb-4">규모가 크면 눈으로는 절대 못 찾는다. 데이터 정리할 때 거의 필수 과정이다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법들의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>엑셀 중복 제거 → 엑셀 파일로 변환해야 하고, 텍스트 그대로 못 씀</li>
        <li>sort | uniq (Linux 명령) → 터미널 필요, 정렬까지 되어버림</li>
        <li>Python 스크립트 → 매번 짜기 귀찮음</li>
        <li>텍스트 편집기 → 중복 제거 기능 없는 에디터가 대부분</li>
      </ul>

      <p className="mb-4">엑셀로 옮겼다가 다시 텍스트로 뽑는 과정이 너무 번거롭다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">텍스트 붙여넣으면 중복 줄 제거해준다. 옵션:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>대소문자 구분</strong> → "Apple"과 "apple"을 다른 것으로 볼지 같은 것으로 볼지</li>
        <li><strong>앞뒤 공백 무시</strong> → 공백만 다른 중복도 제거</li>
        <li><strong>빈 줄 제거</strong> → 중복 제거하면서 빈 줄도 함께 없애기</li>
        <li><strong>정렬</strong> → 중복 제거 후 가나다/ABC순 정렬 옵션</li>
      </ul>

      <p className="mb-3">결과 정보:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>원본 줄 수 vs 결과 줄 수</li>
        <li>제거된 중복 줄 수</li>
        <li>복사 버튼 → 결과 바로 클립보드로</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">대소문자 구분이 중요한 이유</h2>

      <p className="mb-3">상황마다 다르게 처리해야 할 때가 있다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>이메일 주소 → 대소문자 무시(user@email.com = USER@EMAIL.COM)</li>
        <li>프로그래밍 변수명 → 대소문자 구분(myVar ≠ myvar)</li>
        <li>태그/키워드 → 보통 무시하는 게 낫지만 케이스 바이 케이스</li>
        <li>URL → 도메인은 무시, 경로는 구분하는 게 일반적</li>
      </ul>

      <p className="mb-4">기본값은 대소문자 무시로 되어 있고, 필요하면 토글할 수 있다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>순서 유지 → 중복 제거 후에도 원래 순서 그대로 (sort 불필요)</li>
        <li>제거된 수 표시 → 얼마나 중복이 있었는지 바로 확인</li>
        <li>옵션 세밀하게 조정 가능 → 상황에 맞게 처리</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>유사 중복(오탈자 등)은 감지 못 함 → 완전히 일치하는 줄만 제거</li>
        <li>열(컬럼) 기준 중복 제거는 안 됨 → 줄 전체 기준</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>중복이 있는 텍스트 붙여넣기</li>
        <li>옵션 설정 (대소문자, 공백 등)</li>
        <li>결과 복사</li>
        <li>끝</li>
      </ol>

      <p className="mb-4">5초면 된다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/duplicate-line-remover" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 중복 줄 제거기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">회원가입 없이 바로 쓸 수 있다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #중복제거 #중복줄제거 #텍스트정리 #데이터정리 #텍스트도구 #무료도구
      </p>
    </article>
  );
}
