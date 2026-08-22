import Link from 'next/link';

export default function JsonErrorGuidePost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">가이드 · 2026년 8월 21일 · 읽는 시간 9분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        JSON 파싱 에러 총정리 — Unexpected token은 대부분 이 6가지다
      </h1>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
          SyntaxError: Unexpected token &#125; in JSON at position 152
        </code>
        . 이 에러 메시지의 문제는 &ldquo;position 152&rdquo;가 어디인지 아무도 모른다는 것이다.
        수년간 설정 파일과 API 응답을 만지면서 겪은 JSON 파싱 에러는 사실 몇 가지 패턴의 반복이었다.
        이 글은 그 패턴 6가지와, 에러 위치를 빠르게 찾는 방법을 정리한 것이다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">먼저 알아둘 것 — JSON은 JavaScript가 아니다</h2>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        JSON 에러의 절반은 &ldquo;JS에서 되니까 JSON에서도 되겠지&rdquo;라는 가정에서 나온다.
        JSON은 JS 객체 리터럴에서 출발했지만 규격이 훨씬 엄격하다. JS에서 합법인 문법 상당수가
        JSON에서는 불법이다. 아래 6가지가 그 대표다.
      </p>

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">1. 트레일링 콤마 — 가장 흔한 범인</h2>

      <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-sm overflow-x-auto mb-4"><code>{`{
  "name": "kim",
  "age": 30,   ← 마지막 항목 뒤의 콤마가 에러
}`}</code></pre>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        JS·Python에서는 허용되는 마지막 콤마가 JSON에서는 문법 오류다. 항목을 복사·삭제하며 편집하다
        남는 경우가 대부분이라, 배열이나 객체의 <strong>닫는 괄호 바로 앞</strong>을 먼저 의심하면 빨리 찾는다.
        에러 메시지가 <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">Unexpected token &#125;</code>
        또는 <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">]</code>라면 십중팔구 이거다.
      </p>

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2. 작은따옴표와 따옴표 없는 키</h2>

      <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-sm overflow-x-auto mb-4"><code>{`{ 'name': 'kim' }   ← 작은따옴표 불가
{ name: "kim" }     ← 키에 따옴표 생략 불가`}</code></pre>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        JSON의 문자열과 키는 <strong>큰따옴표만</strong> 허용된다. JS 코드에서 객체를 복사해 올 때
        자주 생긴다. 파이썬 딕셔너리를 <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">str()</code>로
        찍어 JSON인 척 넘기는 API도 같은 문제를 만든다 (작은따옴표 + True/False/None).
      </p>

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3. 주석 — JSON에는 주석이 없다</h2>

      <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-sm overflow-x-auto mb-4"><code>{`{
  // 개발 환경 설정   ← 파싱 실패
  "debug": true
}`}</code></pre>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        규격상 JSON에 주석은 존재하지 않는다. VS Code의 settings.json이 주석을 허용하는 건 그 파일이
        JSON이 아니라 JSONC(JSON with Comments)라는 별도 포맷이기 때문이다. 이 관대함에 익숙해져
        일반 JSON 파일에 주석을 넣으면 파서가 바로 죽는다. 설정에 설명이 꼭 필요하면
        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded mx-1">&quot;_comment&quot;</code>
        같은 더미 키를 쓰는 게 우회책이다.
      </p>

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">4. NaN, Infinity, undefined</h2>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        JSON의 값은 문자열·숫자·불리언·null·객체·배열, 이 여섯 가지뿐이다.
        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded mx-1">NaN</code>
        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded mr-1">Infinity</code>
        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded mr-1">undefined</code>는
        전부 불법이다. 특히 서버가 계산 실패 값을 그대로 직렬화하면서
        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded mx-1">&quot;rate&quot;: NaN</code>
        같은 응답을 내보내는 경우가 있는데, 이건 만든 쪽 파서(Python 등)는 관대해서 통과하고
        받는 쪽(브라우저)에서만 터지기 때문에 원인 추적이 유난히 오래 걸린다.
      </p>

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">5. 보이지 않는 문자 — BOM과 스마트 따옴표</h2>

      <p className="mb-3 text-gray-700 dark:text-gray-300">
        눈으로는 완벽한데 파싱이 실패한다면 보이지 않는 문자를 의심할 차례다.
      </p>

      <ul className="space-y-2 mb-4 text-gray-700 dark:text-gray-300">
        <li>
          <strong>BOM (U+FEFF)</strong> — Windows 메모장 등에서 &ldquo;UTF-8(BOM)&rdquo;으로 저장하면
          파일 맨 앞에 보이지 않는 문자가 붙는다. <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">position 0</code>
          또는 <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">position 1</code>에서
          죽으면 이거다. 에디터에서 &ldquo;BOM 없는 UTF-8&rdquo;로 다시 저장하면 해결.
        </li>
        <li>
          <strong>스마트 따옴표 (&ldquo; &rdquo;)</strong> — 워드·한글·메신저를 거친 텍스트는 곧은
          따옴표(&quot;)가 둥근 따옴표로 자동 변환돼 있다. 모양이 비슷해서 눈으로는 못 잡는다.
        </li>
        <li>
          <strong>전각 공백·제로폭 공백</strong> — 웹페이지에서 복사한 JSON에 섞여 들어온다.
          일반 공백처럼 보이지만 다른 문자다.
        </li>
      </ul>

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">6. 이스케이프 안 된 특수문자</h2>

      <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-sm overflow-x-auto mb-4"><code>{`{ "path": "C:\\Users\\kim" }   ← 올바름 (역슬래시는 \\\\)
{ "memo": "그가 "좋다"고 했다" }  ← 문자열 안의 큰따옴표는 \\" 로`}</code></pre>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        문자열 안에 큰따옴표·역슬래시·줄바꿈이 들어가면 반드시 이스케이프해야 한다. Windows 경로,
        정규식 패턴, 사용자 입력 인용문을 값으로 넣을 때 자주 깨진다. 로그에 사용자 입력을 그대로 이어
        붙여 JSON을 &lsquo;문자열 조립&rsquo;으로 만들면 이 문제가 반드시 생기니, JSON은 손으로 조립하지
        말고 라이브러리 직렬화 함수로 만들어야 한다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">position 숫자로 위치를 빨리 찾는 법</h2>

      <ol className="space-y-2 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>에러의 position은 <strong>줄이 아니라 문자 순번</strong>이다 (줄바꿈 포함, 0부터 셈).</li>
        <li>한 줄짜리 JSON이라면 에디터에서 해당 열로 바로 이동하면 된다.</li>
        <li>여러 줄이라면 포맷터에 넣어 정렬부터 한다 — 대부분의 포맷터는 파싱 실패 시 <strong>줄 번호 기반</strong>으로 오류 위치를 다시 알려주기 때문에, 이 변환 자체가 디버깅이 된다.</li>
        <li>그래도 안 보이면 이 글의 5번(보이지 않는 문자)을 의심한다.</li>
      </ol>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        급할 때는{' '}
        <Link href="/tools/json-formatter" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
          JSON 포맷터
        </Link>
        에 붙여넣는 게 가장 빠르다. 유효하면 정렬돼 나오고, 깨져 있으면 어디가 깨졌는지 위치를 짚어 준다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #JSON #UnexpectedToken #파싱에러 #트레일링콤마 #BOM #디버깅
      </p>
    </article>
  );
}
