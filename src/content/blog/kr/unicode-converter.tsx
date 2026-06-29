import Link from 'next/link';

export default function UnicodeConverterPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">인코딩 · 2026년 7월 4일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        유니코드 코드포인트, 한글이 어느 범위인지 막연하게만 알고 있었음
      </h1>

      <p className="mb-4">
        <Link href="/tools/unicode-converter" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 유니코드 변환기 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        정규식에서 한글 범위를 가-힣으로 쓰는데, 이게 실제로 어떤 문자인지 빠르게 확인하고 싶었다.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">유니코드 확인이 필요한 상황</h2>

      <p className="mb-3">개발하다 보면 종종 필요하다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>정규식 작성 → 한글/일본어/중국어 범위 확인</li>
        <li>문자 필터링 → 특수 유니코드 문자 감지</li>
        <li>데이터베이스 저장 → utf8mb4 필요 여부 판단 (이모지는 4바이트)</li>
        <li>폰트 지원 확인 → 해당 코드포인트가 폰트에 있는지</li>
        <li>국제화(i18n) 작업 → 언어별 유니코드 범위 파악</li>
        <li>문자 인코딩 디버깅 → 깨진 문자의 코드포인트 확인</li>
      </ul>

      <p className="mb-4">유니코드는 범위가 워낙 넓어서 특정 문자가 어디에 속하는지 찾기가 쉽지 않다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">유니코드란</h2>

      <p className="mb-3">전 세계 모든 문자를 하나의 체계로 표현하려는 표준이다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>현재 약 150,000개 이상의 문자 정의</li>
        <li>U+0000 ~ U+10FFFF 범위 (17개 평면)</li>
        <li>각 문자마다 고유한 코드포인트(번호) 부여</li>
        <li>UTF-8, UTF-16, UTF-32 등으로 실제 바이트 표현</li>
      </ul>

      <p className="mb-3">주요 범위:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>U+0000~U+007F</strong> → ASCII 기본 라틴 문자</li>
        <li><strong>U+AC00~U+D7A3</strong> → 한글 완성형 (가~힣, 11,172자)</li>
        <li><strong>U+1100~U+11FF</strong> → 한글 자모 (초성/중성/종성 개별)</li>
        <li><strong>U+4E00~U+9FFF</strong> → 한중일 통합 한자 기본</li>
        <li><strong>U+1F600~U+1F64F</strong> → 이모티콘 얼굴</li>
        <li><strong>U+1F300~U+1F5FF</strong> → 기호와 픽토그램</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 만들었음</h2>

      <p className="mb-3">문자 입력하면 유니코드 정보를 보여준다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>코드포인트 (U+XXXX 형식)</li>
        <li>문자 이름 (예: HANGUL SYLLABLE GA)</li>
        <li>카테고리 (문자, 숫자, 기호, 제어문자 등)</li>
        <li>UTF-8 바이트 표현</li>
        <li>HTML 엔티티</li>
        <li>JavaScript/Python 이스케이프</li>
      </ul>

      <p className="mb-3">반대 방향도 가능:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>코드포인트 입력 → 해당 문자 표시</li>
        <li>범위 입력 → 해당 범위 문자 목록</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">UTF-8 vs UTF-16 vs UTF-32</h2>

      <p className="mb-3">같은 유니코드를 다르게 저장하는 방식이다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>UTF-8</strong> → 가변 길이(1~4바이트), ASCII 호환, 웹에서 표준</li>
        <li><strong>UTF-16</strong> → 가변 길이(2~4바이트), BOM 필요, Java/Windows 내부</li>
        <li><strong>UTF-32</strong> → 고정 4바이트, 처리 단순하지만 용량 큼</li>
      </ul>

      <p className="mb-3">한글(가~힣)의 경우:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>UTF-8 → 3바이트</li>
        <li>UTF-16 → 2바이트</li>
        <li>UTF-32 → 4바이트</li>
      </ul>

      <p className="mb-4">DB에서 utf8을 쓰면 이모지(4바이트)가 저장 안 됨 → utf8mb4로 바꿔야 하는 이유가 여기서 나온다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>문자 이름 표시 → 어떤 문자인지 정확히 파악</li>
        <li>UTF-8 바이트 수 표시 → DB 컬럼 크기 계산 시 유용</li>
        <li>JS/Python 이스케이프 바로 복사 가능</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>문자 이름이 영어만 제공됨 (유니코드 표준이 영어)</li>
        <li>모든 코드포인트를 다 알지는 못함 → 희귀 문자는 이름이 낯설 수 있음</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>문자 입력 또는 코드포인트 입력</li>
        <li>유니코드 정보 확인</li>
        <li>필요한 형식 복사</li>
        <li>끝</li>
      </ol>

      <p className="mb-4">바로 나온다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/unicode-converter" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 유니코드 변환기 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">회원가입 없이 바로 쓸 수 있다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #유니코드변환 #유니코드코드포인트 #UTF8 #한글유니코드 #문자인코딩 #개발도구
      </p>
    </article>
  );
}
