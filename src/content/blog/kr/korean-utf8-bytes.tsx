import Link from 'next/link';

export default function KoreanUtf8BytesPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">가이드 · 2026년 8월 20일 · 읽는 시간 9분</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        한글은 왜 3바이트일까 — UTF-8, EUC-KR, 그리고 DB 컬럼이 터지는 이유
      </h1>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        &ldquo;VARCHAR(100)인데 왜 한글 33자밖에 안 들어가요?&rdquo; &ldquo;문자 90바이트 제한인데 한글은
        45자라면서요?&rdquo; 개발하다 보면, 아니 개발자가 아니어도 문자 발송이나 폼 입력에서 한 번쯤 마주치는
        질문이다. 답은 전부 <strong>문자 인코딩</strong>에 있다. 이 글은 한글 한 글자가 어디서는 2바이트,
        어디서는 3바이트가 되는 이유를 원리부터 실무 사고 사례까지 풀어본 것이다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">글자와 바이트는 다른 세계다</h2>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        컴퓨터는 글자를 저장하지 못한다. 숫자만 저장한다. 그래서 모든 글자에는 번호가 붙어 있다 —
        이 번호 체계가 <strong>유니코드(Unicode)</strong>다. 예를 들어 &lsquo;가&rsquo;는 U+AC00,
        &lsquo;힣&rsquo;은 U+D7A3이다. 현대 한글 완성형 11,172자가 이 사이에 나란히 배정되어 있다.
      </p>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        그런데 이 번호를 실제 바이트로 어떻게 저장할지는 별개의 문제고, 그 방법이 바로 인코딩이다.
        같은 &lsquo;가&rsquo;(U+AC00)라도 인코딩에 따라 바이트 수가 달라진다.
      </p>

      <div className="overflow-x-auto mb-4">
        <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <th className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">인코딩</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">한글 1자</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">영문 1자</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">주 사용처</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 dark:text-gray-300">
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="px-3 py-2 font-medium">UTF-8</td>
              <td className="px-3 py-2">3바이트</td>
              <td className="px-3 py-2">1바이트</td>
              <td className="px-3 py-2">웹, 현대 시스템 표준</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="px-3 py-2 font-medium">EUC-KR</td>
              <td className="px-3 py-2">2바이트</td>
              <td className="px-3 py-2">1바이트</td>
              <td className="px-3 py-2">레거시 국내 시스템, SMS</td>
            </tr>
            <tr>
              <td className="px-3 py-2 font-medium">UTF-16</td>
              <td className="px-3 py-2">2바이트</td>
              <td className="px-3 py-2">2바이트</td>
              <td className="px-3 py-2">Java/JS 내부 문자열, Windows</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        UTF-8이 한글에 3바이트를 쓰는 이유는 설계 방식 때문이다. UTF-8은 자주 쓰이는 ASCII(영문·숫자·기호)를
        1바이트로 유지하는 대신, 번호가 큰 글자일수록 바이트를 늘리는 가변 길이 방식이다. U+0800~U+FFFF
        구간의 글자는 3바이트가 되는데, 한글 완성형(U+AC00~)이 정확히 이 구간에 있다. 참고로 이모지(😀,
        U+1F600 이후)는 이 구간도 넘어서 <strong>4바이트</strong>다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사고 사례 1 — VARCHAR(100)에 한글 33자</h2>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        DB마다 VARCHAR의 길이 단위가 다르다. 이걸 모르면 &ldquo;100자 들어간다&rdquo;고 믿었던 컬럼이
        한글 33자에서 터진다.
      </p>

      <ul className="space-y-2 mb-4 text-gray-700 dark:text-gray-300">
        <li>
          <strong>MySQL</strong> — VARCHAR(100)은 &ldquo;100글자&rdquo;다. 단, 인덱스 길이 제한이나
          이모지 저장을 생각하면 문자셋을 utf8이 아니라 <strong>utf8mb4</strong>로 잡아야 한다.
          MySQL의 utf8은 3바이트까지만 지원하는 반쪽짜리라 이모지(4바이트)를 넣으면 에러가 난다.
        </li>
        <li>
          <strong>Oracle</strong> — VARCHAR2(100)은 기본이 <strong>100바이트</strong>다.
          UTF-8 DB라면 한글 33자에서 ORA-12899가 발생한다. 글자 단위로 쓰려면 VARCHAR2(100 CHAR)처럼
          CHAR 시맨틱을 명시해야 한다.
        </li>
        <li>
          <strong>PostgreSQL</strong> — VARCHAR(100)은 100글자. 비교적 함정이 없다.
        </li>
      </ul>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        교훈: 컬럼 설계 때 &ldquo;최대 몇 글자&rdquo;가 아니라 <strong>&ldquo;어느 DB에서, 어떤 시맨틱으로,
        어떤 문자까지(이모지 포함?) 저장하나&rdquo;</strong>를 같이 물어야 한다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사고 사례 2 — SMS 90바이트의 비밀</h2>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        국내 SMS 단문 규격은 <strong>90바이트</strong>다. 통신사 문자 시스템이 EUC-KR 계열 인코딩을 쓰기
        때문에 한글 1자 = 2바이트로 계산되고, 그래서 &ldquo;한글 45자&rdquo;라는 익숙한 제한이 나온다.
        영문·숫자·공백은 1바이트라 영문로만 쓰면 90자까지 들어간다. 90바이트를 넘기는 순간 LMS(장문)로
        전환되고, 대량 발송이라면 건당 요금이 3배 안팎으로 뛴다. 발송 시스템을 만들 때 UTF-8 기준
        바이트(한글 3바이트)로 계산하면 <strong>실제보다 초과를 과하게 판정</strong>하는 반대 방향의 버그가
        생기니, SMS 분기는 반드시 EUC-KR 기준으로 세야 한다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">사고 사례 3 — &ldquo;length가 왜 2죠?&rdquo;</h2>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        JavaScript에서 <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">&apos;😀&apos;.length</code>는
        1이 아니라 <strong>2</strong>다. JS 문자열이 UTF-16 기반이라, 4바이트 문자(서로게이트 페어)를
        2개의 코드 유닛으로 세기 때문이다. 사용자에게 &ldquo;10자 이내&rdquo;라고 안내해 놓고 내부에서
        length로 검증하면, 이모지 5개를 넣은 사용자가 벌써 제한에 걸린다. 사람이 인지하는 글자 수를 세려면
        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded mx-1">Intl.Segmenter</code>나
        스프레드(<code className="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">[...str].length</code>)를
        써야 하고, 국기 이모지(🇰🇷)나 조합 이모지(👨‍👩‍👧)까지 고려하면 grapheme 단위 분할이 필요하다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">정리 — 상황별로 쓰는 단위가 다르다</h2>

      <div className="overflow-x-auto mb-4">
        <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <th className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">상황</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">세야 하는 단위</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 dark:text-gray-300">
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="px-3 py-2">자소서·게시글 분량 제한</td>
              <td className="px-3 py-2">글자 수 (공백 포함 여부 확인)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="px-3 py-2">SMS 단문/장문 분기</td>
              <td className="px-3 py-2">EUC-KR 바이트 (한글 2바이트, 90바이트 기준)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="px-3 py-2">DB 컬럼 길이 검증</td>
              <td className="px-3 py-2">DB 시맨틱 확인 후 UTF-8 바이트 또는 글자 수</td>
            </tr>
            <tr>
              <td className="px-3 py-2">API 페이로드·파일 크기</td>
              <td className="px-3 py-2">UTF-8 바이트 (한글 3바이트, 이모지 4바이트)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        글자 수와 UTF-8 바이트 수를 동시에 확인하고 싶을 때는{' '}
        <Link href="/tools/character-counter" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
          글자수 세기 도구
        </Link>
        에 텍스트를 붙여넣으면 두 수치를 나란히 볼 수 있다.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        #UTF8 #EUCKR #한글바이트 #인코딩 #VARCHAR #문자인코딩
      </p>
    </article>
  );
}
