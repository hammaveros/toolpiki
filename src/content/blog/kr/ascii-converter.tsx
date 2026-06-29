import Link from 'next/link';

export default function AsciiConverterPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">인코딩 · 2026년 7월 3일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        ASCII 코드 변환, 외워서 하다가 틀리기 시작함
      </h1>

      <p className="mb-4">
        <Link href="/tools/ascii-converter" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 ASCII 변환기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        네트워크 프로그래밍 하다가 바이트 값이 어떤 문자인지 빠르게 확인이 필요한데, ASCII 표 외워서 하기엔 한계가 있다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">ASCII 변환이 필요한 상황</h2>

      <p className="mb-3">개발하다 보면 종종 필요하다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>네트워크 패킷 분석 → 바이트 값이 어떤 문자인지 확인</li>
        <li>레거시 시스템 연동 → ASCII 코드로 데이터 주고받기</li>
        <li>암호화/인코딩 로직 → 문자의 수치 확인</li>
        <li>C/C++ 문자 처리 → char 값 확인</li>
        <li>CTF 보안 문제 → ASCII 코드 해석</li>
        <li>통신 프로토콜 → 제어 문자(CR, LF 등) 확인</li>
      </ul>

      <p className="mb-4">A=65, a=97, 0=48 같은 기본값은 외우는데, 특수문자나 제어문자는 표 없이 기억하기 어렵다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">ASCII란</h2>

      <p className="mb-3">American Standard Code for Information Interchange의 약자다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>0~127 범위의 7비트 문자 집합</li>
        <li>영문 대소문자, 숫자, 기본 특수문자, 제어문자 포함</li>
        <li>현대 컴퓨터 문자 인코딩의 기반 (UTF-8도 ASCII 호환)</li>
        <li>1963년 제정, 아직도 네트워크/시스템 프로그래밍에서 중요</li>
      </ul>

      <p className="mb-3">주요 제어 문자 코드값:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>9</strong> → TAB (수평 탭)</li>
        <li><strong>10</strong> → LF (줄바꿈, Linux/macOS)</li>
        <li><strong>13</strong> → CR (캐리지 리턴, Windows CRLF의 앞부분)</li>
        <li><strong>27</strong> → ESC (이스케이프)</li>
        <li><strong>32</strong> → SPACE (공백)</li>
        <li><strong>127</strong> → DEL (삭제)</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">텍스트↔ASCII 코드 양방향 변환이 가능하다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>텍스트 → ASCII 코드</strong> → 각 문자의 10진수 코드값</li>
        <li><strong>텍스트 → 16진수</strong> → 16진수(hex) 코드값</li>
        <li><strong>텍스트 → 2진수</strong> → 비트 단위 표현</li>
        <li><strong>ASCII 코드 → 텍스트</strong> → 숫자 배열 입력 → 문자열로 변환</li>
      </ul>

      <p className="mb-3">표시 옵션:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>구분자 선택 → 공백, 쉼표, 줄바꿈 등</li>
        <li>진수 선택 → 10진수, 16진수, 8진수, 2진수</li>
        <li>제어 문자 표시 → 이름으로 표시 (LF, CR 등)</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">ASCII 범위별 의미</h2>

      <p className="mb-3">코드값 범위를 알면 빠르게 판단할 수 있다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>0~31</strong> → 제어 문자 (출력 안 됨, 특수 동작)</li>
        <li><strong>32</strong> → 공백</li>
        <li><strong>33~47</strong> → 특수문자 (!, ", #, $, %, &...)</li>
        <li><strong>48~57</strong> → 숫자 (0~9)</li>
        <li><strong>58~64</strong> → 특수문자 (:, ;, &lt;, =, &gt;, ?, @)</li>
        <li><strong>65~90</strong> → 대문자 (A~Z)</li>
        <li><strong>91~96</strong> → 특수문자 ([, \, ], ^, _, `)</li>
        <li><strong>97~122</strong> → 소문자 (a~z)</li>
        <li><strong>123~127</strong> → 특수문자 ({"{"}|{"}"}, ~, DEL)</li>
      </ul>

      <p className="mb-4">대문자와 소문자는 코드값이 32 차이난다. a-A=32, b-B=32... 이 규칙이 비트 토글(5번 비트)과 연결된다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>입력과 동시에 변환 → 빠름</li>
        <li>10진수, 16진수, 2진수 한 화면에서 비교</li>
        <li>제어 문자도 이름으로 표시 → 헷갈리지 않음</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>한글 등 비ASCII 문자는 ASCII 범위 초과 → 유니코드 변환 도구 따로 씀</li>
        <li>확장 ASCII (128~255) 처리는 인코딩에 따라 다름</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>텍스트 또는 ASCII 코드 입력</li>
        <li>변환 방향 선택</li>
        <li>결과 확인 및 복사</li>
        <li>끝</li>
      </ol>

      <p className="mb-4">3초면 된다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/ascii-converter" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 ASCII 변환기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">회원가입 없이 바로 쓸 수 있다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #ASCII변환 #ASCII코드 #텍스트ASCII #문자코드변환 #개발도구 #인코딩도구
      </p>
    </article>
  );
}
