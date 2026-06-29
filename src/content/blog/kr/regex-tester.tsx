import Link from 'next/link';

export default function RegexTesterPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">텍스트 · 2026년 6월 19일 · 읽는 시간 5분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        정규식 짜다가 IDE 켜고 끄는 게 귀찮아서 만든 테스터
      </h1>

      <p className="mb-4">
        <Link href="/tools/regex-tester" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 정규식 테스터 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        정규식 하나 검증하려고 프로젝트 실행해서 console.log 찍어보는 게 너무 번거로웠음.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 필요한지</h2>

      <p className="mb-3">개발하다 보면 이런 상황들이 생긴다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>이메일 유효성 검사 패턴 → 진짜 제대로 걸러내는지 확인</li>
        <li>전화번호 형식 통일 → 010-xxxx-xxxx, 01012345678 둘 다 잡아야 할 때</li>
        <li>URL 파싱 → 쿼리스트링만 뽑아내거나 도메인 추출</li>
        <li>로그 파싱 → 에러 로그에서 타임스탬프, 레벨, 메시지 분리</li>
        <li>날짜 형식 검증 → YYYY-MM-DD, DD/MM/YYYY 여러 형식 대응</li>
        <li>특수문자 필터링 → 사용자 입력에서 허용할 문자 범위 정의</li>
        <li>문자열 치환 → 특정 패턴 찾아서 다른 형태로 변환</li>
        <li>CSV 파싱 → 쉼표 구분인데 따옴표 안에 쉼표가 있는 경우</li>
      </ul>

      <p className="mb-4">정규식은 한 번 쓰고 마는 게 아니라 계속 수정하면서 완성하는 과정인데, 그 과정에서 매번 실행 환경이 필요한 게 불편했다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>IDE에서 console.log 찍기 → 매번 저장하고 실행해야 함, 흐름이 끊김</li>
        <li>브라우저 개발자 도구 콘솔 → 가능하긴 한데 매번 열어야 하고 깔끔하지 않음</li>
        <li>온라인 도구 찾아서 쓰기 → 광고 많거나, 느리거나, 원하는 기능이 없음</li>
        <li>스택오버플로우 복붙 → 패턴이 내 케이스에 정확히 맞는지 검증 안 됨</li>
        <li>regex101.com → 좋긴 한데 뭔가 복잡해 보여서 처음엔 당황함</li>
      </ul>

      <p className="mb-4">결국 원하는 건 간단하다. 패턴 넣고 테스트 문자열 넣으면 매칭 결과 바로 보이는 것. 그게 전부인데 주변에 딱 맞는 게 없었음.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 직접 만들었음</h2>

      <p className="mb-3">패턴이랑 텍스트 넣으면 실시간으로 매칭 결과가 나온다.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">주요 기능:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>실시간 매칭 하이라이트 → 타이핑할 때마다 매칭 위치가 색으로 표시됨</li>
        <li>플래그 설정 → g (전체), i (대소문자 무시), m (멀티라인), s (dotAll) 선택</li>
        <li>매칭 결과 상세 보기 → 몇 번째 매칭인지, 인덱스, 캡처 그룹 전부 표시</li>
        <li>그룹 캡처 확인 → 괄호로 묶은 그룹별 결과 따로 표시</li>
        <li>치환(Replace) 기능 → 패턴 매칭 후 어떻게 바뀌는지 미리 확인</li>
        <li>패턴 에러 표시 → 잘못된 정규식이면 에러 메시지 바로 표시</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">자주 쓰는 패턴 템플릿:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>이메일 패턴 → 클릭 한 번으로 삽입</li>
        <li>URL 패턴</li>
        <li>전화번호 패턴 (한국)</li>
        <li>날짜 형식 패턴</li>
        <li>숫자만, 영문만, 한글만 등 기본 패턴들</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>실시간 하이라이트가 핵심 → 패턴 수정하면서 즉시 결과 확인</li>
        <li>캡처 그룹 결과가 잘 보임 → 그룹 1, 그룹 2 별로 무엇이 잡혔는지 명확</li>
        <li>에러 메시지가 즉시 → 괄호 빠뜨리거나 하면 바로 알 수 있음</li>
        <li>플래그 토글이 직관적 → 체크박스로 켜고 끄면서 차이 비교</li>
        <li>치환 결과 미리보기 → replace 로직 짜기 전에 검증 가능</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>패턴 저장 기능 없음 → 자주 쓰는 패턴은 따로 메모해야 함</li>
        <li>언어별 정규식 차이 없음 → Python의 re, Java Pattern 등 언어별 차이는 직접 확인해야 함</li>
        <li>복잡한 lookahead/lookbehind 설명 없음 → 패턴 설명은 없고 결과만 나옴</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">정규식 자주 쓰는 패턴 정리</h2>

      <p className="mb-3">기억해두면 편한 기본 패턴들:</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">문자 클래스</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><code>\d</code> → 숫자 (0-9)</li>
        <li><code>\w</code> → 영문자+숫자+언더스코어</li>
        <li><code>\s</code> → 공백 문자 (스페이스, 탭, 줄바꿈)</li>
        <li><code>[가-힣]</code> → 한글 문자</li>
        <li><code>[a-zA-Z]</code> → 영문자</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">수량자</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><code>+</code> → 1개 이상</li>
        <li><code>*</code> → 0개 이상</li>
        <li><code>?</code> → 0개 또는 1개 (선택)</li>
        <li><code>&#123;3&#125;</code> → 정확히 3개</li>
        <li><code>&#123;2,4&#125;</code> → 2~4개</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">앵커</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><code>^</code> → 문자열 시작</li>
        <li><code>$</code> → 문자열 끝</li>
        <li><code>\b</code> → 단어 경계</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">자주 쓰는 완성 패턴</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>이메일: <code>[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]&#123;2,&#125;</code></li>
        <li>한국 전화: <code>01[016789]-?\d&#123;3,4&#125;-?\d&#123;4&#125;</code></li>
        <li>날짜 (YYYY-MM-DD): <code>\d&#123;4&#125;-\d&#123;2&#125;-\d&#123;2&#125;</code></li>
        <li>숫자만: <code>^\d+$</code></li>
        <li>영문+숫자만: <code>^[a-zA-Z0-9]+$</code></li>
      </ul>

      <p className="mb-4">이것들도 직접 붙여넣고 테스트해보면 이해가 빠르다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">이런 상황에서 특히 편함</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>코드 리뷰 중에 정규식 검증 → 리뷰어 입장에서 빠르게 테스트</li>
        <li>스택오버플로우 패턴 복사 후 → 내 데이터에 맞는지 확인</li>
        <li>API 응답에서 특정 값 추출 → 어떤 패턴으로 잡을지 시험해보기</li>
        <li>정규식 처음 배우는 중 → 직접 쳐보면서 동작 확인</li>
        <li>로그 파일 분석 → grep 패턴 짜기 전에 먼저 검증</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>정규식 패턴 입력 (슬래시 없이 패턴만)</li>
        <li>플래그 선택 (g, i, m 등)</li>
        <li>테스트할 텍스트 입력</li>
        <li>매칭 결과 실시간으로 확인</li>
        <li>치환 탭으로 이동하면 replace 결과도 확인 가능</li>
      </ol>

      <p className="mb-4">IDE 켤 필요 없다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/regex-tester" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 정규식 테스터 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">정규식 짜는 작업 있으면 탭 하나 열어두고 실시간으로 확인하면서 작업하면 훨씬 편하다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #정규식테스터 #정규표현식 #regex #개발도구 #실시간정규식검증
      </p>
    </article>
  );
}
