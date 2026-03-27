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
          🗃️ What is SQL Formatter?
        </h2>
        <p className="text-sm leading-relaxed">
          SQL Formatter is a tool that formats complex SQL queries for better readability.
          It adds line breaks and indentation by keywords like SELECT, FROM, WHERE, and JOIN to clearly show query structure.
          Essential for code review, query optimization, documentation, and maintaining consistent style in team collaboration.
          Supports MySQL, PostgreSQL, Oracle, SQL Server, and standard SQL syntax.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🔧 Formatting Options
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">Uppercase Keywords</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Convert keywords like SELECT, WHERE to uppercase
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">Auto Line Breaks</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Automatically break lines before major keywords
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">Indentation</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Indent column lists, subqueries, etc.
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">Minify</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Remove all whitespace into a single line
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 SQL Style Guide
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li>Keywords uppercase, table/column names lowercase</li>
          <li>Use explicit JOINs (INNER JOIN, LEFT JOIN, etc.)</li>
          <li>Write each SELECT column on a new line</li>
          <li>Break lines by AND/OR in WHERE conditions</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Does it support DBMS-specific syntax?',
            answer: 'Formatting is based on standard SQL (ANSI SQL). DBMS-specific syntax like LIMIT (MySQL), TOP (SQL Server), ROWNUM (Oracle) are also supported.',
          },
          {
            question: 'Are complex subqueries formatted correctly?',
            answer: 'Yes, subqueries are hierarchically indented. However, very complex queries may require manual adjustment.',
          },
          {
            question: 'When should I use Minify?',
            answer: 'Use minify for logging, network transmission, or code obfuscation when query size matters more than readability.',
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

export function SqlFormatterEn() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [uppercase, setUppercase] = useState(true);

  const formatSql = (sql: string): string => {
    let formatted = sql.trim();

    // Normalize whitespace (multiple spaces -> one)
    formatted = formatted.replace(/\s+/g, ' ');

    // Process compound keywords first (ORDER BY, GROUP BY, etc.)
    const compoundKeywords = ['ORDER BY', 'GROUP BY', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN', 'FULL JOIN', 'CROSS JOIN', 'INSERT INTO', 'DELETE FROM', 'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE'];
    compoundKeywords.forEach((keyword) => {
      const regex = new RegExp(keyword.replace(' ', '\\s+'), 'gi');
      formatted = formatted.replace(regex, `__${keyword.replace(' ', '_')}__`);
    });

    // Single keyword case conversion
    SQL_KEYWORDS.forEach((keyword) => {
      if (!keyword.includes(' ')) {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        formatted = formatted.replace(regex, uppercase ? keyword : keyword.toLowerCase());
      }
    });

    // Restore compound keywords with case conversion
    compoundKeywords.forEach((keyword) => {
      const placeholder = `__${keyword.replace(' ', '_')}__`;
      const replacement = uppercase ? keyword : keyword.toLowerCase();
      formatted = formatted.replace(new RegExp(placeholder, 'g'), replacement);
    });

    // Keywords that need line breaks (process longer ones first)
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

    // Comma line break + indent (not inside parentheses)
    formatted = formatted.replace(/,(?![^(]*\))/g, ',\n    ');

    // Clean up multiple line breaks
    formatted = formatted.replace(/\n\s*\n/g, '\n');

    // Remove trailing whitespace
    formatted = formatted.replace(/[ \t]+$/gm, '');

    // Remove leading line breaks/whitespace
    formatted = formatted.replace(/^[\n\s]+/, '');

    // Remove unnecessary leading whitespace per line (except indentation)
    formatted = formatted
      .split('\n')
      .map((line) => {
        // Keep 4-space indented lines (after comma), trim others
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
      {/* Options and buttons */}
      <div className="flex gap-4 items-center flex-wrap">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={uppercase}
            onChange={(e) => setUppercase(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Uppercase Keywords
          </span>
        </label>
        <Button onClick={handleFormat}>Format</Button>
        <Button variant="secondary" onClick={handleMinify}>
          Minify
        </Button>
        <Button variant="secondary" onClick={() => { setInput(''); setOutput(''); }}>
          Clear
        </Button>
      </div>

      {/* Two column layout */}
      <TwoColumnLayout
        leftLabel="SQL Input"
        rightLabel="Result"
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
            placeholder="Formatted SQL will appear here."
            rows={16}
            className="font-mono text-sm h-[400px] bg-gray-50 dark:bg-gray-800/50"
          />
        }
      />

      <SeoContent />
    </div>
  );
}
