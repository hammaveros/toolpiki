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
          <strong className="text-gray-900 dark:text-white">이스케이프는 특수 의미를 가진 문자를 &quot;진짜 그 문자&quot;라고 표시해 두는 작업입니다.</strong>{' '}
          데이터를 한 컨텍스트에서 다른 컨텍스트로 옮길 때 파서의 오해를 막아 줍니다.
          예를 들어 JSON 문자열 안의 &quot;는 문자열 끝으로 해석되므로 <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">\&quot;</code>로 바꿔야 하고, SQL 안의 작은따옴표는 두 번 겹쳐 <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">&apos;&apos;</code>로 만들어야 <strong>인젝션이 차단</strong>됩니다.
          이 도구는 <strong>JSON, JavaScript, HTML, URL, Regex, SQL 여섯 가지 컨텍스트</strong>를 한 곳에서 처리하며 <strong>300ms 디바운스</strong>로 자동 변환됩니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">📋 형식별 이스케이프 규칙</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h3 className="font-semibold mb-1">JSON / JavaScript</h3>
            <p><strong>\\, &quot;, &apos;, 줄바꿈(\\n), 탭(\\t)</strong> 등을 백슬래시로 이스케이프합니다.</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h3 className="font-semibold mb-1">HTML</h3>
            <p><strong>&lt;, &gt;, &amp;, &quot;, &apos;</strong> 등을 HTML 엔티티(&amp;lt; 등)로 변환합니다.</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h3 className="font-semibold mb-1">Regex</h3>
            <p>정규식 메타 문자 <strong>. * + ? ^ $</strong> 등을 \\로 이스케이프합니다.</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h3 className="font-semibold mb-1">SQL</h3>
            <p><strong>작은따옴표(&apos;)를 두 번(&apos;&apos;)</strong>으로 이스케이프하여 <strong>SQL 인젝션을 방지</strong>합니다.</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">🧪 자주 쓰는 미니 시나리오</h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc pl-5">
          <li><strong>로그에서 가져온 JSON을 코드에 박을 때</strong>: 따옴표와 줄바꿈이 섞여 있으면 IDE가 빨갛게 표시합니다. <strong>JSON 모드</strong>로 한 번 이스케이프하면 그대로 변수 값으로 사용할 수 있습니다.</li>
          <li><strong>운영자 입력으로 SQL을 만들 때</strong>: 정석은 파라미터 바인딩이지만, 점검 스크립트에서 즉석으로 쿼리를 짤 때 <strong>SQL 모드</strong>로 작은따옴표를 두 번화하면 안전합니다.</li>
          <li><strong>특정 단어를 정규식으로 찾을 때</strong>: 파일 경로 <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">C:\\Users\\name</code>을 그대로 패턴에 넣으면 \\U가 메타로 해석됩니다. <strong>Regex 모드</strong>로 변환해서 안전한 패턴을 얻습니다.</li>
          <li><strong>마크다운 본문에 코드 예시를 넣을 때</strong>: <strong>HTML 모드</strong>로 변환해 두면 백틱이 부족한 렌더러에서도 태그가 깨지지 않습니다.</li>
        </ul>
      </section>

      <div className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 p-4 text-sm">
        <p className="font-semibold text-red-900 dark:text-red-200 mb-1">🔒 보안 주의</p>
        <p className="text-red-800 dark:text-red-300">이스케이프를 건너뛰면 <strong>XSS, SQL 인젝션</strong>으로 이어집니다. 2008년 이후 <strong>OWASP Top 10에 인젝션 계열이 꾸준히</strong> 등장하는 이유입니다. SQL은 가능하면 <strong>파라미터 바인딩</strong>을 우선 사용하세요.</p>
      </div>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          { question: '이스케이프를 하지 않으면 어떤 문제가 생기나요?', answer: '단순 구문 오류부터 데이터 손실, XSS, SQL 인젝션 같은 보안 사고까지 이어집니다. 2008년 이후 OWASP Top 10에 인젝션 계열이 꾸준히 등장하는 이유이기도 합니다. 사용자 입력은 출력 컨텍스트별로 매번 이스케이프해야 합니다.' },
          { question: 'JSON과 JavaScript 이스케이프의 차이는?', answer: 'JSON 표준(RFC 8259)은 문자열 구분자로 큰따옴표만 인정하기 때문에 작은따옴표는 그대로 둬도 됩니다. 반면 JavaScript는 두 따옴표를 모두 쓸 수 있고 \\0(널 문자), \\v(수직 탭) 같은 추가 이스케이프 시퀀스가 있습니다. 이 도구의 JavaScript 모드는 \\0까지 함께 처리합니다.' },
          { question: '실시간 자동 변환은 어떻게 동작하나요?', answer: '입력이 멈춘 후 300ms 뒤에 변환을 실행합니다. 디바운스 덕분에 빠르게 타이핑해도 매번 변환이 일어나지 않아 부드럽고, 모드나 형식 버튼을 누르면 즉시 다시 계산됩니다.' },
        ]}
      />
    </div>
  );
}
