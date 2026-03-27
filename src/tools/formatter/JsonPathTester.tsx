'use client';

import { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';

const exampleJson = `{
  "store": {
    "name": "My Store",
    "books": [
      { "title": "책 제목 1", "author": "저자 1", "price": 8.95 },
      { "title": "책 제목 2", "author": "저자 2", "price": 12.99 },
      { "title": "책 제목 3", "author": "저자 1", "price": 8.99 }
    ],
    "bicycle": {
      "color": "red",
      "price": 399
    }
  }
}`;

const presetPaths = [
  { path: '$.store.name', desc: '스토어 이름' },
  { path: '$.store.books', desc: '모든 책' },
  { path: '$.store.books[0]', desc: '첫 번째 책' },
  { path: '$.store.books[*].title', desc: '모든 책 제목' },
  { path: '$.store.books[*].price', desc: '모든 책 가격' },
  { path: '$.store.bicycle.color', desc: '자전거 색상' },
];

export function JsonPathTester() {
  const [jsonInput, setJsonInput] = useState(exampleJson);
  const [pathInput, setPathInput] = useState('$.store.books[*].title');
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState('');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // 간단한 JSONPath 구현
  const evaluateJsonPath = (obj: unknown, path: string): unknown => {
    if (!path.startsWith('$')) throw new Error('경로는 $로 시작해야 합니다');

    const tokens = path.slice(1).split(/\.|\[/).filter(Boolean);
    let current: unknown = obj;

    for (let i = 0; i < tokens.length; i++) {
      let token = tokens[i].replace(/\]$/, '');

      if (current === null || current === undefined) {
        return undefined;
      }

      // 배열 인덱스
      if (/^\d+$/.test(token)) {
        if (!Array.isArray(current)) throw new Error(`${token}는 배열이 아닙니다`);
        current = current[parseInt(token)];
      }
      // 와일드카드
      else if (token === '*') {
        if (!Array.isArray(current)) throw new Error('* 는 배열에서만 사용 가능합니다');
        // 남은 경로 처리
        const remainingPath = '$.' + tokens.slice(i + 1).join('.');
        if (tokens.length > i + 1) {
          return current.map(item => evaluateJsonPath(item, remainingPath));
        }
        return current;
      }
      // 일반 키
      else {
        if (typeof current !== 'object' || current === null) {
          throw new Error(`${token}에 접근할 수 없습니다`);
        }
        current = (current as Record<string, unknown>)[token];
      }
    }

    return current;
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (!jsonInput.trim() || !pathInput.trim()) {
        setResult('');
        setError('');
        return;
      }

      try {
        const json = JSON.parse(jsonInput);
        const pathResult = evaluateJsonPath(json, pathInput);
        setResult(JSON.stringify(pathResult, null, 2));
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : '오류 발생');
        setResult('');
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [jsonInput, pathInput]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <Textarea
            label="JSON 데이터"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="JSON 데이터를 입력하세요..."
            rows={15}
            className="font-mono text-sm"
          />
          <Button
            variant="secondary"
            size="sm"
            className="mt-2"
            onClick={() => setJsonInput(exampleJson)}
          >
            예제 데이터
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              JSONPath 경로
            </label>
            <input
              type="text"
              value={pathInput}
              onChange={(e) => setPathInput(e.target.value)}
              className="w-full px-3 py-2 font-mono border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              placeholder="$.store.books[*].title"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {presetPaths.map((preset) => (
              <Button
                key={preset.path}
                variant={pathInput === preset.path ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setPathInput(preset.path)}
                title={preset.desc}
              >
                {preset.path}
              </Button>
            ))}
          </div>

          {error ? (
            <Card variant="bordered" className="p-4 bg-red-50 dark:bg-red-900/20">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </Card>
          ) : result ? (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  결과
                </label>
                <CopyButton text={result} />
              </div>
              <Textarea
                value={result}
                readOnly
                rows={10}
                className="font-mono text-sm bg-gray-50 dark:bg-gray-800/50"
              />
            </div>
          ) : null}
        </div>
      </div>

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🔍 JSONPath 테스터란?
        </h2>
        <p className="text-sm leading-relaxed">
          JSONPath는 JSON 데이터에서 특정 값을 추출하기 위한 경로 표현식 언어입니다.
          XPath가 XML 문서에서 노드를 선택하는 것처럼, JSONPath는 JSON 데이터 구조를 탐색합니다.
          API 응답 분석, 데이터 추출 자동화, 설정 파일 검증 등에 널리 활용되며,
          이 도구를 통해 경로 표현식을 작성하고 즉시 결과를 확인할 수 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 JSONPath 문법
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">표현식</th>
                <th className="text-left py-2 px-2">설명</th>
                <th className="text-left py-2 px-2">예시</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">$</td><td>루트 객체</td><td className="font-mono text-xs">$</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">.key</td><td>속성 접근</td><td className="font-mono text-xs">$.store.name</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">[n]</td><td>배열 인덱스</td><td className="font-mono text-xs">$.books[0]</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">[*]</td><td>모든 요소</td><td className="font-mono text-xs">$.books[*].title</td></tr>
              <tr><td className="py-2 px-2 font-mono">..</td><td>재귀 탐색</td><td className="font-mono text-xs">$..price</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 활용 사례
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li>REST API 응답에서 필요한 데이터만 추출</li>
          <li>복잡한 JSON 설정 파일에서 특정 값 조회</li>
          <li>테스트 자동화에서 응답 검증</li>
          <li>jq, Python jsonpath-ng 등 라이브러리 표현식 검증</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: 'JSONPath와 JSON Pointer의 차이점은 무엇인가요?',
            answer: 'JSONPath는 와일드카드와 필터 기능을 지원하는 쿼리 언어인 반면, JSON Pointer(RFC 6901)는 단순 경로 지정만 가능합니다. JSONPath가 더 유연하지만, JSON Pointer는 표준화되어 있습니다.',
          },
          {
            question: '모든 JSONPath 문법이 지원되나요?',
            answer: '이 도구는 기본 문법(속성 접근, 배열 인덱스, 와일드카드)을 지원합니다. 필터 표현식(?())이나 슬라이스([start:end])는 부분적으로 지원됩니다.',
          },
          {
            question: 'JSONPath 결과가 여러 개일 때 어떻게 되나요?',
            answer: '와일드카드(*)를 사용하면 여러 값이 배열로 반환됩니다. 예를 들어 $.books[*].title은 모든 책의 제목을 배열로 반환합니다.',
          },
        ]}
      />
    </div>
  );
}
