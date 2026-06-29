import Link from 'next/link';

export default function BaseConverterPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">인코딩 · 2026년 7월 3일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        진법 변환, 계산기로 하다가 자꾸 실수해서 따로 만들었음
      </h1>

      <p className="mb-4">
        <Link href="/tools/base-converter" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 진법 변환기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        16진수 FF가 10진수로 몇인지, 2진수로는 어떻게 되는지 실시간으로 확인하면서 작업하고 싶었다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">진법 변환이 필요한 상황</h2>

      <p className="mb-3">주로 개발할 때 자주 마주친다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>색상 코드 → #FF5733 같은 16진수 → RGB 10진수로</li>
        <li>IP 주소 계산 → 서브넷 마스크 비트 계산</li>
        <li>권한 설정 → chmod 755 → 2진수 비트 플래그 확인</li>
        <li>메모리 주소 → 0x 시작하는 16진수 → 10진수 주소로</li>
        <li>레지스터 값 분석 → 비트 단위 플래그 확인</li>
        <li>프로토콜 분석 → 헤더 값 변환</li>
      </ul>

      <p className="mb-4">윈도우 계산기 프로그래머 모드로도 되긴 하는데, 4가지 진수를 한눈에 비교하기가 불편하다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">진법이 왜 여러 개 쓰이나</h2>

      <p className="mb-3">각 진법마다 용도가 다르다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>2진수(Binary)</strong> → 컴퓨터 내부 동작, 비트 플래그, 비트 연산</li>
        <li><strong>8진수(Octal)</strong> → Unix 파일 권한 (755, 644 등), 일부 레거시 시스템</li>
        <li><strong>10진수(Decimal)</strong> → 사람이 읽는 일반 숫자</li>
        <li><strong>16진수(Hexadecimal)</strong> → 색상 코드, 메모리 주소, 바이트 표현</li>
      </ul>

      <p className="mb-3">왜 16진수가 많이 쓰이냐면:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>1바이트(8비트) = 16진수 2자리로 정확히 표현 가능</li>
        <li>2진수보다 훨씬 짧아서 읽기 편함</li>
        <li>FF = 11111111(2진수) = 255(10진수) → 딱 맞아떨어짐</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">숫자 하나 입력하면 모든 진수를 동시에 보여준다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>2진수, 8진수, 10진수, 16진수 동시 표시</li>
        <li>어떤 진수로 입력해도 나머지로 자동 변환</li>
        <li>각 결과 옆 복사 버튼</li>
        <li>16진수 입력 시 0x 접두사 자동 처리</li>
        <li>음수 처리 (2의 보수)</li>
        <li>큰 수도 지원</li>
      </ul>

      <p className="mb-3">추가 기능:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>2진수 비트 표시 → 8비트/16비트/32비트 단위로 그룹화</li>
        <li>색상 미리보기 → 16진수 색상 코드 입력 시 색상 표시</li>
        <li>ASCII 문자 표시 → 해당 숫자의 ASCII 문자 확인</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">비트 연산 활용</h2>

      <p className="mb-3">2진수 보면서 비트 연산 결과 확인할 때 유용하다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>AND (&)</strong> → 두 수의 공통 비트만 1</li>
        <li><strong>OR (|)</strong> → 둘 중 하나라도 1이면 1</li>
        <li><strong>XOR (^)</strong> → 두 비트가 다를 때 1</li>
        <li><strong>NOT (~)</strong> → 모든 비트 반전</li>
        <li><strong>시프트 ({"<<"}, {">>"})</strong> → 비트 이동 = 2의 거듭제곱 곱/나눔</li>
      </ul>

      <p className="mb-4">chmod 755를 예로 들면:<br />755 = 7|5|5 = 111|101|101 (2진수) = 소유자 읽기/쓰기/실행, 그룹/기타 읽기/실행</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>4가지 진수 동시 표시 → 비교하기 편함</li>
        <li>어느 진수로 입력해도 동작 → 16진수 바로 입력 가능</li>
        <li>비트 단위 시각화 → 8비트씩 묶어서 표시</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>부동소수점(float) 변환은 없음 → 정수만 지원</li>
        <li>임의 진수(예: 3진수, 7진수)는 지원 안 함</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>숫자 입력 (10진수/16진수/2진수 아무거나)</li>
        <li>나머지 진수로 자동 변환 확인</li>
        <li>필요한 진수 복사</li>
        <li>끝</li>
      </ol>

      <p className="mb-4">즉시 변환된다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/base-converter" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 진법 변환기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">회원가입 없이 바로 쓸 수 있다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #진법변환 #2진수변환 #16진수변환 #8진수변환 #진수변환기 #개발도구 #인코딩도구
      </p>
    </article>
  );
}
