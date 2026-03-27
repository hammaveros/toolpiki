'use client';

import { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';

type EscapeType = 'json' | 'javascript' | 'html' | 'url' | 'regex' | 'sql';

const escapeTypes: { value: EscapeType; label: string }[] = [
  { value: 'json', label: 'JSON' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'html', label: 'HTML' },
  { value: 'url', label: 'URL' },
  { value: 'regex', label: 'Regex' },
  { value: 'sql', label: 'SQL' },
];

export function StringEscape() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [escapeType, setEscapeType] = useState<EscapeType>('json');
  const [mode, setMode] = useState<'escape' | 'unescape'>('escape');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const escapeString = (text: string, type: EscapeType): string => {
    switch (type) {
      case 'json':
        return text
          .replace(/\\/g, '\\\\')
          .replace(/"/g, '\\"')
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '\\r')
          .replace(/\t/g, '\\t');
      case 'javascript':
        return text
          .replace(/\\/g, '\\\\')
          .replace(/'/g, "\\'")
          .replace(/"/g, '\\"')
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '\\r')
          .replace(/\t/g, '\\t')
          .replace(/\0/g, '\\0');
      case 'html':
        return text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
      case 'url':
        return encodeURIComponent(text);
      case 'regex':
        return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      case 'sql':
        return text.replace(/'/g, "''");
      default:
        return text;
    }
  };

  const unescapeString = (text: string, type: EscapeType): string => {
    switch (type) {
      case 'json':
      case 'javascript':
        return text
          .replace(/\\n/g, '\n')
          .replace(/\\r/g, '\r')
          .replace(/\\t/g, '\t')
          .replace(/\\"/g, '"')
          .replace(/\\'/g, "'")
          .replace(/\\0/g, '\0')
          .replace(/\\\\/g, '\\');
      case 'html':
        const textarea = document.createElement('textarea');
        textarea.innerHTML = text;
        return textarea.value;
      case 'url':
        try {
          return decodeURIComponent(text);
        } catch {
          return text;
        }
      case 'regex':
        return text.replace(/\\([.*+?^${}()|[\]\\])/g, '$1');
      case 'sql':
        return text.replace(/''/g, "'");
      default:
        return text;
    }
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (!input.trim()) {
        setOutput('');
        return;
      }
      if (mode === 'escape') {
        setOutput(escapeString(input, escapeType));
      } else {
        setOutput(unescapeString(input, escapeType));
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input, escapeType, mode]);

  const handleSwap = () => {
    setInput(output);
    setOutput('');
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={mode === 'escape' ? 'primary' : 'secondary'}
          onClick={() => setMode('escape')}
        >
          이스케이프
        </Button>
        <Button
          variant={mode === 'unescape' ? 'primary' : 'secondary'}
          onClick={() => setMode('unescape')}
        >
          언이스케이프
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {escapeTypes.map((type) => (
          <Button
            key={type.value}
            variant={escapeType === type.value ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setEscapeType(type.value)}
          >
            {type.label}
          </Button>
        ))}
      </div>

      <Textarea
        label={mode === 'escape' ? '원본 문자열' : '이스케이프된 문자열'}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="변환할 문자열을 입력하세요..."
        rows={6}
        className="font-mono"
      />

      <div className="flex gap-2">
        <Button variant="secondary" onClick={handleSwap} disabled={!output}>
          ↕ 결과를 입력으로
        </Button>
        <Button variant="secondary" onClick={() => { setInput(''); setOutput(''); }}>
          초기화
        </Button>
      </div>

      {output && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              결과
            </label>
            <CopyButton text={output} />
          </div>
          <Textarea
            value={output}
            readOnly
            rows={6}
            className="font-mono bg-gray-50 dark:bg-gray-800/50"
          />
        </div>
      )}

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">🔤 문자열 이스케이프란?</h2>
        <p className="text-sm leading-relaxed">
          문자열 이스케이프는 프로그래밍 언어나 데이터 형식에서 특별한 의미를 가진 문자를
          안전하게 표현하기 위해 변환하는 과정입니다. 예를 들어 JSON 문자열에서 큰따옴표(")는
          문자열 경계로 해석되므로 \"로 이스케이프해야 합니다.
          이 도구는 JSON, JavaScript, HTML, URL, Regex, SQL 등 6가지 형식의 이스케이프/언이스케이프를 지원합니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">📋 형식별 이스케이프 규칙</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h3 className="font-semibold mb-1">JSON / JavaScript</h3>
            <p>\\, ", ', 줄바꿈(\\n), 탭(\\t) 등을 백슬래시로 이스케이프합니다.</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h3 className="font-semibold mb-1">HTML</h3>
            <p>&lt;, &gt;, &amp;, ", ' 등을 HTML 엔티티(&amp;lt; 등)로 변환합니다.</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h3 className="font-semibold mb-1">Regex</h3>
            <p>정규식에서 특별한 의미를 가진 . * + ? ^ $ 등을 \\로 이스케이프합니다.</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h3 className="font-semibold mb-1">SQL</h3>
            <p>작은따옴표(')를 두 번('')으로 이스케이프하여 SQL 인젝션을 방지합니다.</p>
          </div>
        </div>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          { question: '이스케이프를 하지 않으면 어떤 문제가 생기나요?', answer: '구문 오류, 데이터 손실, 보안 취약점(XSS, SQL 인젝션)이 발생할 수 있습니다. 사용자 입력은 항상 적절한 이스케이프 처리를 해야 합니다.' },
          { question: 'JSON과 JavaScript 이스케이프의 차이는?', answer: 'JSON은 큰따옴표(")만 문자열 구분자로 사용하고, JavaScript는 큰따옴표와 작은따옴표(\') 모두 사용합니다. JavaScript는 \\0(null)도 추가로 이스케이프합니다.' },
          { question: '실시간 자동 변환은 어떻게 동작하나요?', answer: '입력을 300ms 디바운스하여 타이핑이 멈추면 자동으로 변환합니다. 모드(이스케이프/언이스케이프)와 형식을 변경해도 즉시 반영됩니다.' },
        ]}
      />
    </div>
  );
}
