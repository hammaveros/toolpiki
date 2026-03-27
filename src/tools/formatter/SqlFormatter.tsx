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
          SQL 포맷터는 복잡한 SQL 쿼리를 읽기 쉽게 정렬하는 도구입니다.
          SELECT, FROM, WHERE, JOIN 등 키워드별로 줄바꿈과 들여쓰기를 적용하여 쿼리 구조를 명확하게 보여줍니다.
          코드 리뷰, 쿼리 최적화, 문서화, 팀 협업 시 일관된 스타일 유지에 필수적입니다.
          MySQL, PostgreSQL, Oracle, SQL Server 등 표준 SQL 문법을 지원합니다.
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
          💡 SQL 스타일 가이드
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li>키워드는 대문자, 테이블/컬럼명은 소문자 권장</li>
          <li>JOIN은 명시적으로 (INNER JOIN, LEFT JOIN 등)</li>
          <li>SELECT 절의 각 컬럼은 새 줄에 작성</li>
          <li>WHERE 조건은 AND/OR별로 줄바꿈</li>
        </ul>
      </section>

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
