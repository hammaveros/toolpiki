import Link from 'next/link';

export default function RegexGeneratorPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">텍스트 · 2026년 7월 25일 · 읽는 시간 4분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        정규식 짤 때마다 스택오버플로 뒤지다가 만든 정규식 생성 도우미
      </h1>

      <p className="mb-4">
        <Link href="/tools/regex-generator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 정규식 생성 도우미 바로 가기
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        이메일 유효성 검사 정규식 하나 찾으러 갔다가 30분 만에 스택오버플로 탭이 12개 열려 있던 적 있음.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">언제 필요한지</h2>

      <p className="mb-3">정규식이 필요한 상황은 생각보다 자주 온다:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>이메일 유효성 검사 → 입력값에 @가 있는지, 도메인 형식이 맞는지</li>
        <li>전화번호 패턴 → 010-XXXX-XXXX, 02-XXX-XXXX 등 다양한 형식 처리</li>
        <li>URL 추출 → 긴 텍스트에서 링크만 골라낼 때</li>
        <li>특수문자 제거 → 사용자 입력에서 허용된 문자만 남기기</li>
        <li>날짜 형식 파싱 → YYYY-MM-DD, DD/MM/YYYY 등 혼재된 형식 처리</li>
        <li>패스워드 정책 → 영문+숫자+특수문자 조합 필수 검증</li>
        <li>로그 파싱 → 서버 로그에서 특정 패턴 추출</li>
        <li>HTML 태그 제거 → 텍스트만 남기고 마크업 제거</li>
        <li>코드에서 패턴 치환 → VSCode 찾기/바꾸기에서 정규식 모드 활용</li>
      </ul>

      <p className="mb-4">정규식을 "알 것 같은데 막상 쓰려면 헷갈리는" 상태로 알고 있는 개발자가 진짜 많음. 기본 패턴은 알아도 플래그, 그룹, 룩어헤드 같은 거 조합하다 보면 항상 막히는 부분이 생김.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">기존 방법의 문제</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>스택오버플로 검색 → 내 상황에 딱 맞는 답변 찾기가 어렵고, 답변마다 패턴이 달라서 어떤 게 맞는지 모름</li>
        <li>ChatGPT한테 물어보기 → 정규식 설명은 해주는데 실제로 테스트해봐야 함, 틀리는 경우도 있음</li>
        <li>regex101.com → 좋긴 한데 영어라서 처음엔 UI 파악하는 데 시간 걸림</li>
        <li>직접 짜기 → 오랜만에 쓰면 `\d`, `\w`, `+`, `*`, `?` 차이 매번 헷갈림</li>
        <li>MDN 문서 → 레퍼런스 위주라 "이메일 검증 정규식 뭐야"에 바로 답 안 나옴</li>
        <li>복붙한 정규식이 뭘 하는지 모름 → 나중에 수정해야 할 때 손댈 수가 없음</li>
      </ul>

      <p className="mb-4">제일 큰 문제는 "복붙은 했는데 이게 왜 동작하는지 모른다"는 상황. 엣지케이스 생기면 손댈 수가 없어짐.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">그래서 직접 만들었음</h2>

      <p className="mb-3">만들고 싶은 패턴 설명하면 정규식 만들어주고, 바로 테스트까지 되게.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">생성 기능:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>자주 쓰는 패턴 템플릿 → 이메일, URL, 전화번호, 날짜, 비밀번호 등 버튼 클릭 한 번</li>
        <li>자연어로 설명 → "숫자만 허용" 입력하면 정규식 생성</li>
        <li>옵션 조합 → 대소문자 구분 여부, 전체 매칭 vs 부분 매칭 등 체크박스로 설정</li>
        <li>플래그 설정 → g, i, m, s 플래그 선택 가능</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">테스트 기능:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>실시간 매칭 확인 → 테스트 문자열 입력하면 매칭 결과 즉시 표시</li>
        <li>매칭 하이라이트 → 어느 부분이 걸렸는지 색상으로 표시</li>
        <li>그룹 캡처 결과 → 캡처 그룹별로 뭐가 잡혔는지 확인</li>
        <li>여러 케이스 테스트 → 유효/무효 입력 예시 여러 개 한 번에 확인</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">설명 기능:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>패턴 분해 설명 → 각 문자/기호가 뭘 의미하는지 한글로 설명</li>
        <li>언어별 코드 스니펫 → JavaScript, Python, Java 등에서 쓰는 코드 형태로 출력</li>
        <li>복사 → 한 번에 클립보드 복사</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">실제로 써보니</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">좋은 점:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>실시간 테스트 → 짜면서 바로 결과 확인 가능, 스택오버플로 탭 열 필요 없음</li>
        <li>패턴 설명 → 복붙해도 뭘 하는지 알 수 있음, 나중에 수정도 됨</li>
        <li>템플릿 → 자주 쓰는 패턴은 버튼 하나로 끝남</li>
        <li>한글 설명 → 영어 문서 읽다 막히는 거 없음</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">한계:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>복잡한 룩어헤드/룩비하인드 조합 → 고급 패턴은 직접 작성 필요</li>
        <li>언어별 차이 → 언어마다 지원 문법이 조금 다른데 다 커버하진 않음</li>
        <li>정규식 이력 저장 없음 → 작성한 패턴 저장해두는 기능 없음</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">정규식 기호 빠른 참고</h2>

      <p className="mb-3">매번 헷갈리는 것들 요약:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><code>.</code> → 임의의 문자 한 개 (줄바꿈 제외)</li>
        <li><code>*</code> → 앞 문자 0번 이상 반복</li>
        <li><code>+</code> → 앞 문자 1번 이상 반복</li>
        <li><code>?</code> → 앞 문자 0번 또는 1번 (선택적)</li>
        <li><code>\d</code> → 숫자 [0-9]</li>
        <li><code>\w</code> → 단어 문자 [a-zA-Z0-9_]</li>
        <li><code>\s</code> → 공백 문자 (스페이스, 탭, 줄바꿈)</li>
        <li><code>^</code> → 문자열 시작 (또는 문자 클래스 안에서 부정)</li>
        <li><code>$</code> → 문자열 끝</li>
        <li><code>()</code> → 캡처 그룹</li>
        <li><code>[]</code> → 문자 클래스 (그 안의 문자 중 하나)</li>
        <li><code>{`{n,m}`}</code> → n번 이상 m번 이하 반복</li>
      </ul>

      <p className="mb-4">이거 외워도 막상 조합하려면 헷갈림. 그래서 테스트 도구가 필요한 거임.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">자주 쓰는 패턴 모음</h2>

      <p className="mb-3">이런 패턴들은 외우기보다 그냥 복붙해서 씀:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><strong>이메일</strong>: <code>{`^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$`}</code></li>
        <li><strong>한국 휴대폰</strong>: <code>{`^01[016789]-?\\d{3,4}-?\\d{4}$`}</code></li>
        <li><strong>URL</strong>: <code>{`https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_+.~#?&\\/=]*)`}</code></li>
        <li><strong>날짜 (YYYY-MM-DD)</strong>: <code>{`^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$`}</code></li>
        <li><strong>숫자만</strong>: <code>{`^\\d+$`}</code></li>
        <li><strong>한글만</strong>: <code>{`^[가-힣]+$`}</code></li>
      </ul>

      <p className="mb-4">복붙했는데 왜 동작하는지 궁금하면 도구에 붙여넣고 설명 기능 써보면 됨.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사용법</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>템플릿 선택 or 자연어로 패턴 설명 입력</li>
        <li>생성된 정규식 확인</li>
        <li>테스트 입력창에 샘플 텍스트 입력</li>
        <li>매칭 결과 확인 (하이라이트로 표시)</li>
        <li>원하는 언어의 코드 스니펫으로 복사</li>
      </ol>

      <p className="mb-4">한 번 익히면 스택오버플로 탭 열 일이 반 이하로 줄어든다.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">써보기</h2>

      <p className="mb-4">
        <Link href="/tools/regex-generator" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 정규식 생성 도우미 바로 가기
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">다음에 이메일 유효성 정규식 찾으러 스택오버플로 가기 전에 한번 써봐. 템플릿에 다 있음.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #정규식생성기 #regex #정규표현식 #개발도구 #유효성검사 #패턴매칭 #자바스크립트정규식
      </p>
    </article>
  );
}
