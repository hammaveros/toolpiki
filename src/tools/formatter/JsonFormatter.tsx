'use client';

import { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { Select } from '@/components/ui/Select';
import { TwoColumnLayout } from '@/components/ui/TwoColumnLayout';
import { FaqSection } from '@/components/ui/FaqItem';

function JsonTreeNode({
  data,
  keyName,
  defaultExpanded = true,
  depth = 0,
}: {
  data: unknown;
  keyName?: string;
  defaultExpanded?: boolean;
  depth?: number;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  if (data === null) {
    return (
      <div style={{ paddingLeft: depth * 16 }} className="font-mono text-sm py-0.5">
        {keyName !== undefined && (
          <span className="text-purple-600 dark:text-purple-400">&quot;{keyName}&quot;: </span>
        )}
        <span className="text-gray-500">null</span>
      </div>
    );
  }

  if (typeof data === 'boolean') {
    return (
      <div style={{ paddingLeft: depth * 16 }} className="font-mono text-sm py-0.5">
        {keyName !== undefined && (
          <span className="text-purple-600 dark:text-purple-400">&quot;{keyName}&quot;: </span>
        )}
        <span className="text-orange-600 dark:text-orange-400">{data.toString()}</span>
      </div>
    );
  }

  if (typeof data === 'number') {
    return (
      <div style={{ paddingLeft: depth * 16 }} className="font-mono text-sm py-0.5">
        {keyName !== undefined && (
          <span className="text-purple-600 dark:text-purple-400">&quot;{keyName}&quot;: </span>
        )}
        <span className="text-blue-600 dark:text-blue-400">{data}</span>
      </div>
    );
  }

  if (typeof data === 'string') {
    return (
      <div style={{ paddingLeft: depth * 16 }} className="font-mono text-sm py-0.5">
        {keyName !== undefined && (
          <span className="text-purple-600 dark:text-purple-400">&quot;{keyName}&quot;: </span>
        )}
        <span className="text-green-600 dark:text-green-400">&quot;{data}&quot;</span>
      </div>
    );
  }

  if (Array.isArray(data)) {
    const count = data.length;
    return (
      <div style={{ paddingLeft: depth * 16 }} className="font-mono text-sm">
        <button
          onClick={() => setExpanded(!expanded)}
          className="py-0.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded px-1 -ml-1"
        >
          <span className="text-gray-400 mr-1">{expanded ? '\u25BC' : '\u25B6'}</span>
          {keyName !== undefined && (
            <span className="text-purple-600 dark:text-purple-400">&quot;{keyName}&quot;: </span>
          )}
          <span className="text-gray-500">
            [{!expanded && <span> ...{count}items </span>}]
          </span>
        </button>
        {expanded && (
          <>
            {data.map((item, i) => (
              <JsonTreeNode key={i} data={item} depth={depth + 1} defaultExpanded={true} />
            ))}
          </>
        )}
      </div>
    );
  }

  if (typeof data === 'object') {
    const entries = Object.entries(data as Record<string, unknown>);
    const count = entries.length;
    return (
      <div style={{ paddingLeft: depth * 16 }} className="font-mono text-sm">
        <button
          onClick={() => setExpanded(!expanded)}
          className="py-0.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded px-1 -ml-1"
        >
          <span className="text-gray-400 mr-1">{expanded ? '\u25BC' : '\u25B6'}</span>
          {keyName !== undefined && (
            <span className="text-purple-600 dark:text-purple-400">&quot;{keyName}&quot;: </span>
          )}
          <span className="text-gray-500">
            {'{'}
            {!expanded && <span> ...{count}keys </span>}
            {!expanded && '}'}
          </span>
        </button>
        {expanded && (
          <>
            {entries.map(([key, value]) => (
              <JsonTreeNode key={key} data={value} keyName={key} depth={depth + 1} defaultExpanded={true} />
            ))}
            <div style={{ paddingLeft: (depth + 1) * 16 - 16 }} className="text-gray-500 py-0.5 pl-1">{'}'}</div>
          </>
        )}
      </div>
    );
  }

  return null;
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          JSON 포맷터란?
        </h2>
        <p className="text-sm leading-relaxed">
          JSON(JavaScript Object Notation) 데이터 교환 형식을 보기 좋게 정리하는 도구입니다.
          압축된 JSON을 들여쓰기와 줄바꿈으로 정렬(Prettify)하거나,
          불필요한 공백을 제거하여 압축(Minify)합니다. API 응답 분석,
          설정 파일 편집, 데이터베이스 레코드 확인, 디버깅에 필수적인 도구입니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          주요 기능
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">정렬 (Prettify)</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              압축된 JSON을 2/4 스페이스 또는 탭 들여쓰기로 정렬
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">압축 (Minify)</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              공백과 줄바꿈을 제거하여 파일 크기 최소화
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">유효성 검사</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              JSON 문법 오류를 위치와 원인과 함께 감지
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">실시간 변환</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              입력과 동시에 자동 포맷팅 (300ms 디바운스)
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          JSON 문법 규칙
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li>키는 반드시 큰따옴표로 감싸야 합니다 (작은따옴표 불가)</li>
          <li>문자열 값은 큰따옴표 사용, 숫자/불리언/null은 따옴표 없이</li>
          <li>마지막 항목 뒤에 쉼표(trailing comma) 불가</li>
          <li>주석 사용 불가 (JSON5, JSONC는 지원)</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          ⚖️ JSON vs XML vs YAML 비교
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">항목</th>
                <th className="text-left py-2 px-2">JSON</th>
                <th className="text-left py-2 px-2">XML</th>
                <th className="text-left py-2 px-2">YAML</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">가독성</td><td>보통</td><td>낮음 (태그 많음)</td><td>높음 (들여쓰기 기반)</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">파일 크기</td><td>작음</td><td>큼 (태그 오버헤드)</td><td>가장 작음</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">주석 지원</td><td>불가</td><td>가능</td><td>가능</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">배열 표현</td><td>네이티브 지원</td><td>반복 태그</td><td>- 기호</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">주 사용처</td><td>API, 웹 통신</td><td>문서, SOAP, 설정</td><td>설정 파일 (K8s, CI/CD)</td></tr>
              <tr><td className="py-2 px-2 font-medium">파싱 속도</td><td>빠름</td><td>느림</td><td>보통</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🚨 자주 발생하는 JSON 오류 TOP 5
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Trailing Comma</strong>: 마지막 항목 뒤에 쉼표 (<code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded">{`{"a":1,}`}</code>) — JSON은 trailing comma를 허용하지 않음</li>
          <li><strong>작은따옴표 사용</strong>: 키/값에 작은따옴표 (<code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded">{`{'name':'홍길동'}`}</code>) — 반드시 큰따옴표만 사용</li>
          <li><strong>undefined / NaN / Infinity</strong>: JavaScript에는 있지만 JSON에는 없는 값 — <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded">null</code>로 대체</li>
          <li><strong>주석 포함</strong>: <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded">{`// 주석`}</code>이나 <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded">{`/* */`}</code> — 표준 JSON은 주석 불가 (JSONC 사용 필요)</li>
          <li><strong>따옴표 없는 키</strong>: <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded">{`{name: "값"}`}</code> — JavaScript 객체 문법이지 JSON이 아님</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: 'JSON과 JavaScript 객체의 차이는?',
            answer: 'JSON은 데이터 교환 형식으로 키에 반드시 큰따옴표를 사용해야 하며, 함수/undefined/주석을 지원하지 않습니다. JavaScript 객체는 더 유연하지만 JSON으로 직렬화할 때는 규칙을 따라야 합니다.',
          },
          {
            question: '들여쓰기는 몇 칸이 좋나요?',
            answer: '공식 표준은 없습니다. 2칸이 가장 일반적이고, 4칸도 많이 사용됩니다. 프로젝트의 코딩 컨벤션을 따르세요.',
          },
          {
            question: 'JSON에 주석을 넣을 수 있나요?',
            answer: '표준 JSON은 주석을 지원하지 않습니다. 설정 파일에는 JSONC(JSON with Comments)나 JSON5 형식을 사용하거나, "_comment" 키를 활용하는 방법이 있습니다.',
          },
        ]}
      />
    </div>
  );
}

export function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState('2');
  const [parsedJson, setParsedJson] = useState<unknown>(null);
  const [viewMode, setViewMode] = useState<'tree' | 'text'>('text');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const getIndentValue = (ind: string): string | number => {
    if (ind === 'tab') return '\t';
    return parseInt(ind);
  };

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!input.trim()) {
      setOutput('');
      setError('');
      setParsedJson(null);
      return;
    }

    debounceRef.current = setTimeout(() => {
      try {
        const parsed = JSON.parse(input);
        setOutput(JSON.stringify(parsed, null, getIndentValue(indent)));
        setParsedJson(parsed);
        setError('');
      } catch (e) {
        const hint = getJsonErrorHint((e as Error).message);
        setError(`JSON 파싱 오류: ${hint}`);
        setOutput('');
        setParsedJson(null);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [input, indent]);

  const getJsonErrorHint = (errorMessage: string): string => {
    const msg = errorMessage.toLowerCase();
    if (msg.includes('unexpected token')) {
      if (msg.includes("'")) return "작은따옴표(') 대신 큰따옴표(\")를 사용하세요.";
      return '예상하지 못한 문자가 있습니다. 쉼표(,)나 따옴표를 확인하세요.';
    }
    if (msg.includes('unexpected end')) return 'JSON이 완성되지 않았습니다. 중괄호나 대괄호가 닫혔는지 확인하세요.';
    if (msg.includes('position')) {
      const match = errorMessage.match(/position (\d+)/i);
      if (match) return `${match[1]}번째 문자 근처에서 오류 발생. 해당 위치의 쉼표, 따옴표를 확인하세요.`;
    }
    return '키는 반드시 큰따옴표로 감싸야 합니다. trailing comma도 허용되지 않습니다.';
  };

  const handleFormat = () => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, getIndentValue(indent)));
      setParsedJson(parsed);
    } catch (e) {
      const hint = getJsonErrorHint((e as Error).message);
      setError(`JSON 파싱 오류: ${hint}`);
      setOutput('');
      setParsedJson(null);
    }
  };

  const handleBeautify = () => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      const beautified = JSON.stringify(parsed, null, getIndentValue(indent));
      setInput(beautified);
      setOutput(beautified);
      setParsedJson(parsed);
    } catch (e) {
      const hint = getJsonErrorHint((e as Error).message);
      setError(`JSON 파싱 오류: ${hint}`);
    }
  };

  const handleMinify = () => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setInput(minified);
      setParsedJson(parsed);
    } catch (e) {
      const hint = getJsonErrorHint((e as Error).message);
      setError(`JSON 파싱 오류: ${hint}`);
      setOutput('');
      setParsedJson(null);
    }
  };

  const handleValidate = () => {
    setError('');
    try {
      JSON.parse(input);
      setError('');
      setOutput('✓ 유효한 JSON입니다.');
    } catch (e) {
      const hint = getJsonErrorHint((e as Error).message);
      setError(`유효하지 않은 JSON: ${hint}`);
      setOutput('');
    }
  };

  const handleSample = () => {
    const sample = {
      name: 'ToolPiki',
      version: '1.0.0',
      features: ['JSON 포맷터', '코드 변환', '해시 생성'],
      config: {
        theme: 'dark',
        language: 'ko',
      },
      active: true,
    };
    setInput(JSON.stringify(sample));
  };

  return (
    <div className="space-y-2">
      {/* 옵션 및 버튼 */}
      <div className="flex flex-wrap gap-3 items-end">
        <div className="w-32">
          <Select
            label="들여쓰기"
            value={indent}
            onChange={(e) => setIndent(e.target.value)}
            options={[
              { value: '2', label: '2 스페이스' },
              { value: '4', label: '4 스페이스' },
              { value: 'tab', label: '탭' },
            ]}
          />
        </div>
        <Button variant="primary" onClick={handleBeautify}>
          정리
        </Button>
        <Button variant="secondary" onClick={handleFormat}>
          포맷팅
        </Button>
        <Button variant="secondary" onClick={handleMinify}>
          압축
        </Button>
        <Button variant="secondary" onClick={handleValidate}>
          유효성 검사
        </Button>
      </div>

      {/* 2단 레이아웃 */}
      <TwoColumnLayout
        leftLabel="JSON 입력"
        leftHeader={
          <Button variant="secondary" size="sm" onClick={handleSample}>
            예시 JSON
          </Button>
        }
        rightLabel="결과"
        rightHeader={
          <div className="flex items-center gap-2">
            {parsedJson !== null && (
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setViewMode('text')}
                  className={`px-2 py-0.5 text-xs rounded transition-colors ${
                    viewMode === 'text'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  정리
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('tree')}
                  className={`px-2 py-0.5 text-xs rounded transition-colors ${
                    viewMode === 'tree'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  Tree
                </button>
              </div>
            )}
            {output && !output.startsWith('✓') && <CopyButton text={output} />}
          </div>
        }
        left={
          <Textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError('');
            }}
            placeholder='{"key": "value"}'
            rows={16}
            className="font-mono text-sm h-[600px]"
            error={error}
          />
        }
        right={
          parsedJson !== null && viewMode === 'tree' ? (
            <div className="w-full h-[600px] overflow-auto rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 p-4">
              <JsonTreeNode data={parsedJson} defaultExpanded={true} />
            </div>
          ) : (
            <Textarea
              value={output}
              readOnly
              placeholder="포맷팅된 JSON이 여기에 표시됩니다."
              rows={32}
              className={`font-mono text-sm h-[600px] ${
                output.startsWith('✓')
                  ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
                  : 'bg-gray-50 dark:bg-gray-800/50'
              }`}
            />
          )
        }
      />

      <SeoContent />
    </div>
  );
}
