'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { TwoColumnLayout } from '@/components/ui/TwoColumnLayout';
import { FaqSection } from '@/components/ui/FaqItem';

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🗃️ SQL 포맷터란?
        </h2>
        <p className="text-sm leading-relaxed">
          <strong className="text-gray-900 dark:text-white">복잡한 SQL 쿼리를 키워드 기준으로 자동 정렬합니다.</strong>{' '}
          <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">SELECT</code>, <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">FROM</code>, <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">WHERE</code>, <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">JOIN</code> 등 주요 키워드별로 줄바꿈과 들여쓰기를 적용해 구조를 명확히 보여줍니다.
          <strong>코드 리뷰</strong>, 쿼리 최적화, 문서화, <strong>팀 협업 시 일관된 스타일</strong> 유지에 필수.
          <strong>MySQL/PostgreSQL/Oracle/SQL Server</strong> 등 표준 SQL을 지원합니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🔧 포맷팅 옵션
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">키워드 대문자</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              SELECT, WHERE 등 키워드를 대문자로 변환
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">자동 줄바꿈</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              주요 키워드 앞에서 자동으로 줄바꿈
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">들여쓰기</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              컬럼 목록, 서브쿼리 등에 들여쓰기 적용
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">압축 (Minify)</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              모든 공백 제거하여 한 줄로 변환
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📄 포맷팅 전후 비교
        </h2>
        <p className="text-sm leading-relaxed mb-3">
          ORM이 생성했거나 로그에서 긁어온 쿼리는 대부분 한 줄로 붙어 있습니다.
          아래는 주문 테이블에서 최근 30일 결제 완료 건을 집계하는 실제 형태의 쿼리를 정렬한 예시입니다.
        </p>
        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">입력 (한 줄)</p>
            <pre className="p-3 rounded bg-gray-900 text-gray-100 text-xs font-mono overflow-x-auto">
{`select o.id, u.name, sum(oi.price*oi.qty) total from orders o inner join users u on u.id=o.user_id left join order_items oi on oi.order_id=o.id where o.status='PAID' and o.created_at >= now() - interval 30 day group by o.id, u.name having total > 10000 order by total desc limit 50`}
            </pre>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">출력 (정렬본)</p>
            <pre className="p-3 rounded bg-gray-900 text-gray-100 text-xs font-mono overflow-x-auto">
{`SELECT
    o.id,
    u.name,
    SUM(oi.price * oi.qty) total
FROM orders o
INNER JOIN users u
    ON u.id = o.user_id
LEFT JOIN order_items oi
    ON oi.order_id = o.id
WHERE o.status = 'PAID'
    AND o.created_at >= NOW() - INTERVAL 30 DAY
GROUP BY o.id, u.name
HAVING total > 10000
ORDER BY total DESC
LIMIT 50`}
            </pre>
          </div>
        </div>
        <p className="text-sm leading-relaxed mt-3">
          정렬본에서는 <strong>JOIN이 몇 개인지</strong>, <strong>어떤 조건이 WHERE에 걸려 있는지</strong>가 한눈에 들어옵니다.
          쿼리 튜닝은 실행 계획을 보기 전에 구조부터 파악하는 일이라, 이 단계에서 이미 절반이 끝납니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🗄️ DBMS별 문법 차이
        </h2>
        <p className="text-sm leading-relaxed mb-3">
          같은 동작이라도 DBMS마다 키워드가 다릅니다. 정렬된 쿼리를 다른 DB로 옮길 때 자주 걸리는 부분만 모았습니다.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left font-semibold">동작</th>
                <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left font-semibold">MySQL</th>
                <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left font-semibold">PostgreSQL</th>
                <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left font-semibold">Oracle</th>
                <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left font-semibold">SQL Server</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">행 수 제한</td>
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 font-mono">LIMIT 10</td>
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 font-mono">LIMIT 10</td>
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 font-mono">FETCH FIRST 10 ROWS ONLY</td>
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 font-mono">TOP 10</td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">문자열 연결</td>
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 font-mono">CONCAT(a, b)</td>
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 font-mono">a || b</td>
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 font-mono">a || b</td>
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 font-mono">a + b</td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">현재 시각</td>
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 font-mono">NOW()</td>
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 font-mono">NOW()</td>
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 font-mono">SYSDATE</td>
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 font-mono">GETDATE()</td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">NULL 대체</td>
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 font-mono">IFNULL(a, b)</td>
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 font-mono">COALESCE(a, b)</td>
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 font-mono">NVL(a, b)</td>
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 font-mono">ISNULL(a, b)</td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">식별자 인용</td>
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 font-mono">`col`</td>
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 font-mono">&quot;col&quot;</td>
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 font-mono">&quot;col&quot;</td>
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 font-mono">[col]</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 SQL 스타일 가이드
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>키워드는 대문자</strong>, 테이블/컬럼명은 <strong>소문자</strong> 권장</li>
          <li><strong>JOIN은 명시적</strong>으로 (<code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">INNER JOIN</code>, <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">LEFT JOIN</code> 등)</li>
          <li><code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">SELECT</code> 절의 <strong>각 컬럼은 새 줄</strong>에 작성</li>
          <li><code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">WHERE</code> 조건은 <strong>AND/OR별로 줄바꿈</strong></li>
          <li><strong>테이블 별칭은 의미 있게</strong> — <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">a</code>, <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">b</code> 보다 <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">o</code>(orders), <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">u</code>(users)</li>
          <li><strong>콤마는 줄 끝</strong>에 붙이는 방식이 일반적이지만, 팀 컨벤션이 우선입니다</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          ⚠️ 정렬하면 바로 보이는 실수들
        </h2>
        <p className="text-sm leading-relaxed mb-3">
          쿼리가 한 줄로 뭉쳐 있으면 놓치기 쉬운데, 줄바꿈만 넣어도 눈에 띄는 문제들입니다.
        </p>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>LEFT JOIN인데 WHERE에 조건을 건 경우</strong> — 결과적으로 INNER JOIN이 되어 행이 사라집니다. 조건은 <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">ON</code> 절로 옮겨야 합니다.</li>
          <li><strong>AND/OR 괄호 누락</strong> — <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">AND</code>가 <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">OR</code>보다 우선순위가 높아 의도와 다른 조건이 됩니다.</li>
          <li><strong>GROUP BY 누락 컬럼</strong> — SELECT에는 있는데 GROUP BY에 빠진 컬럼. MySQL은 넘어가지만 PostgreSQL은 에러입니다.</li>
          <li><strong>중복 JOIN</strong> — 같은 테이블을 두 번 조인해 행이 배수로 부풀어 있는 경우.</li>
          <li><strong>인덱스를 못 타는 WHERE</strong> — 컬럼에 함수를 씌운 조건(<code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">DATE(created_at) = ...</code>)은 인덱스를 무시합니다.</li>
        </ul>
      </section>

      <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 p-4 text-sm">
        <p className="font-semibold text-blue-900 dark:text-blue-200 mb-1">💡 실무 팁</p>
        <p className="text-blue-800 dark:text-blue-300">
          <strong>슬랙·티켓에 쿼리 공유</strong>할 땐 정렬본을, <strong>코드/로그에 임베드</strong>할 땐 압축본을 사용하세요.
          상황에 맞는 포맷이 리뷰 시간을 절반으로 줄입니다.
        </p>
      </div>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: 'DBMS별로 문법 차이가 있는데 호환되나요?',
            answer: '표준 SQL(ANSI SQL) 기준으로 포맷팅합니다. LIMIT(MySQL), TOP(SQL Server), ROWNUM(Oracle) 등 DBMS 고유 문법도 대부분 지원합니다.',
          },
          {
            question: '복잡한 서브쿼리도 포맷팅되나요?',
            answer: '네, 서브쿼리도 계층적으로 들여쓰기됩니다. 다만 매우 복잡한 쿼리는 수동 조정이 필요할 수 있습니다.',
          },
          {
            question: '압축(Minify)은 언제 사용하나요?',
            answer: '로그 기록, 네트워크 전송, 코드 난독화 등 쿼리 크기를 줄여야 할 때 사용합니다. 가독성보다 효율이 중요한 경우입니다.',
          },
          {
            question: '입력한 쿼리가 서버로 전송되나요?',
            answer: '아니요. 포맷팅은 브라우저 안에서만 처리되며 쿼리 내용이 서버로 전송되거나 저장되지 않습니다. 운영 DB 쿼리도 그대로 붙여넣어 사용할 수 있습니다.',
          },
          {
            question: '주석이 포함된 쿼리도 유지되나요?',
            answer: '한 줄 주석(--)과 블록 주석(/* */) 모두 그대로 보존됩니다. 다만 주석 위치에 따라 줄바꿈 결과가 달라질 수 있으니 결과를 확인해 주세요.',
          },
          {
            question: '포맷팅한 쿼리를 그대로 실행해도 되나요?',
            answer: '줄바꿈과 들여쓰기, 키워드 대소문자만 바뀌므로 실행 결과는 동일합니다. 다만 대소문자를 구분하는 설정(예: 일부 환경의 테이블명)에서는 키워드 대문자 옵션 적용 후 한 번 확인하는 것을 권장합니다.',
          },
        ]}
      />
    </div>
  );
}

const SQL_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'LIKE', 'BETWEEN',
  'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'FULL', 'CROSS', 'ON',
  'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET',
  'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE',
  'CREATE', 'ALTER', 'DROP', 'TABLE', 'INDEX', 'VIEW',
  'AS', 'DISTINCT', 'ALL', 'UNION', 'INTERSECT', 'EXCEPT',
  'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'NULL', 'IS',
  'ASC', 'DESC', 'NULLS', 'FIRST', 'LAST',
  'COUNT', 'SUM', 'AVG', 'MIN', 'MAX',
];

export function SqlFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [uppercase, setUppercase] = useState(true);

  const formatSql = (sql: string): string => {
    let formatted = sql.trim();

    // 공백 정규화 (여러 공백 -> 하나)
    formatted = formatted.replace(/\s+/g, ' ');

    // 복합 키워드를 먼저 처리 (ORDER BY, GROUP BY 등)
    const compoundKeywords = ['ORDER BY', 'GROUP BY', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN', 'FULL JOIN', 'CROSS JOIN', 'INSERT INTO', 'DELETE FROM', 'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE'];
    compoundKeywords.forEach((keyword) => {
      const regex = new RegExp(keyword.replace(' ', '\\s+'), 'gi');
      formatted = formatted.replace(regex, `__${keyword.replace(' ', '_')}__`);
    });

    // 단일 키워드 대소문자 변환
    SQL_KEYWORDS.forEach((keyword) => {
      if (!keyword.includes(' ')) {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        formatted = formatted.replace(regex, uppercase ? keyword : keyword.toLowerCase());
      }
    });

    // 복합 키워드 복원 및 대소문자 변환
    compoundKeywords.forEach((keyword) => {
      const placeholder = `__${keyword.replace(' ', '_')}__`;
      const replacement = uppercase ? keyword : keyword.toLowerCase();
      formatted = formatted.replace(new RegExp(placeholder, 'g'), replacement);
    });

    // 줄바꿈이 필요한 키워드 (긴 것부터 처리)
    const newlineKeywords = [
      'ORDER BY', 'GROUP BY', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN',
      'OUTER JOIN', 'FULL JOIN', 'CROSS JOIN', 'INSERT INTO', 'DELETE FROM',
      'CREATE TABLE', 'ALTER TABLE', 'SELECT', 'FROM', 'WHERE', 'AND', 'OR',
      'HAVING', 'LIMIT', 'OFFSET', 'JOIN', 'UNION', 'VALUES', 'UPDATE', 'SET',
    ];

    newlineKeywords.forEach((keyword) => {
      const kw = uppercase ? keyword : keyword.toLowerCase();
      const regex = new RegExp(`\\s*\\b(${kw})\\b\\s*`, 'g');
      formatted = formatted.replace(regex, `\n${kw} `);
    });

    // 쉼표 후 줄바꿈 + 들여쓰기 (괄호 안이 아닌 곳만)
    formatted = formatted.replace(/,(?![^(]*\))/g, ',\n    ');

    // 여러 줄바꿈 정리
    formatted = formatted.replace(/\n\s*\n/g, '\n');

    // 줄 끝 공백 제거
    formatted = formatted.replace(/[ \t]+$/gm, '');

    // 맨 앞 줄바꿈/공백 제거
    formatted = formatted.replace(/^[\n\s]+/, '');

    // 각 줄 앞 불필요한 공백 제거 (들여쓰기 제외)
    formatted = formatted
      .split('\n')
      .map((line) => {
        // 들여쓰기 라인 (쉼표 뒤)은 4칸 유지, 나머지는 trim
        if (line.startsWith('    ')) return line;
        return line.trimStart();
      })
      .join('\n');

    return formatted;
  };

  const minifySql = (sql: string): string => {
    return sql
      .replace(/\s+/g, ' ')
      .replace(/\s*,\s*/g, ',')
      .replace(/\s*\(\s*/g, '(')
      .replace(/\s*\)\s*/g, ')')
      .trim();
  };

  const handleFormat = () => {
    setOutput(formatSql(input));
  };

  const handleMinify = () => {
    setOutput(minifySql(input));
  };

  return (
    <div className="space-y-2">
      {/* 옵션 및 버튼 */}
      <div className="flex gap-4 items-center flex-wrap">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={uppercase}
            onChange={(e) => setUppercase(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            키워드 대문자
          </span>
        </label>
        <Button onClick={handleFormat}>포맷팅</Button>
        <Button variant="secondary" onClick={handleMinify}>
          압축 (Minify)
        </Button>
        <Button variant="secondary" onClick={() => { setInput(''); setOutput(''); }}>
          초기화
        </Button>
      </div>

      {/* 2단 레이아웃 */}
      <TwoColumnLayout
        leftLabel="SQL 입력"
        rightLabel="결과"
        rightHeader={output ? <CopyButton text={output} /> : undefined}
        left={
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="SELECT id, name, email FROM users WHERE status = 'active' AND created_at > '2024-01-01' ORDER BY created_at DESC LIMIT 10"
            rows={16}
            className="font-mono text-sm h-[400px]"
          />
        }
        right={
          <Textarea
            value={output}
            readOnly
            placeholder="포맷팅된 SQL이 여기에 표시됩니다."
            rows={16}
            className="font-mono text-sm h-[400px] bg-gray-50 dark:bg-gray-800/50"
          />
        }
      />

      <SeoContent />
    </div>
  );
}
