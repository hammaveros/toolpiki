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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        <div className="flex flex-col">
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

        <div className="flex flex-col space-y-4">
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
          🔍 JSON 깊은 곳의 값, 한 줄로 꺼내기
        </h2>
        <p className="text-sm leading-relaxed">
          JSONPath는 JSON 트리에서 원하는 값만 골라내는 미니 쿼리 언어입니다.
          XPath가 XML을 다루듯 <span className="font-mono">$.store.books[0].title</span> 같은 표현식 한 줄로 깊이 4~5단계 객체 안의 값을 끄집어낼 수 있습니다.
          이 도구는 왼쪽 입력란에 JSON을 넣고, 오른쪽에 경로 표현식을 적으면 300ms 디바운스로 즉시 결과를 보여줍니다.
          모든 처리는 브라우저 안에서 일어나기 때문에 사내 API 응답이나 토큰이 포함된 페이로드를 그대로 붙여 넣어도
          외부로 전송되지 않습니다. 작성해 둔 표현식은 jq, jsonpath-ng, Spring의 JsonPath 라이브러리에도 그대로 옮겨 쓸 수 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 JSONPath 문법 핵심
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
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">[n]</td><td>배열 인덱스 (0부터)</td><td className="font-mono text-xs">$.books[0]</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">[*]</td><td>배열의 모든 요소</td><td className="font-mono text-xs">$.books[*].title</td></tr>
              <tr><td className="py-2 px-2 font-mono">..</td><td>재귀 탐색 (모든 깊이)</td><td className="font-mono text-xs">$..price</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🛠️ 이런 상황에 가장 효과적이에요
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>3-depth 이상 API 응답 파싱</strong> — <span className="font-mono">$.data.items[*].user.email</span> 한 줄로 100개 항목의 이메일만 추출.</li>
          <li><strong>Postman 테스트 스크립트 작성 전 검증</strong> — JsonPath 표현식이 의도한 노드를 정확히 가리키는지 미리 확인.</li>
          <li><strong>k8s manifest 디버깅</strong> — kubectl get -o jsonpath= 옵션에 들어갈 경로를 여기서 먼저 검증.</li>
          <li><strong>Elasticsearch / OpenSearch 응답 분석</strong> — <span className="font-mono">$.hits.hits[*]._source</span>로 원본 문서만 추출.</li>
          <li><strong>jq 명령 만들기 전 프로토타이핑</strong> — 표현식이 검증되면 jq 문법으로 변환하기 쉬워집니다.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 실수 줄이는 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li>키 이름에 공백이나 하이픈이 있으면 <span className="font-mono">$[&apos;user-name&apos;]</span>처럼 대괄호 표기를 쓰세요. 점 표기는 식별자 규칙을 따릅니다.</li>
          <li>결과가 <span className="font-mono">undefined</span>로 나오면 경로 중간에 null이 있거나 키 오타일 가능성이 큽니다. 점 하나 줄여서 부모 노드부터 확인해 보세요.</li>
          <li>대규모 배열에서는 <span className="font-mono">[*]</span> 대신 <span className="font-mono">[0:10]</span> 같은 슬라이스로 먼저 표본을 확인하면 디버깅이 빠릅니다.</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: 'JSONPath와 JSON Pointer(RFC 6901), 어느 쪽을 써야 하나요?',
            answer: 'JSON Pointer는 한 노드를 정확히 가리키는 표준 경로(예: /store/books/0/title)로, 패치(RFC 6902)나 스키마 참조처럼 정밀함이 필요할 때 좋습니다. JSONPath는 와일드카드, 재귀, 필터까지 지원하는 쿼리 언어라 데이터 추출/탐색에 강합니다. 목적에 따라 다른 도구라고 생각하세요.',
          },
          {
            question: '필터 표현식 ?(@.price > 10) 같은 것도 지원하나요?',
            answer: '이 도구의 내장 엔진은 속성 접근, 배열 인덱스, 와일드카드 등 기본 문법에 초점이 맞춰져 있습니다. 필터 표현식이나 스크립트(?())이 필요하면 jq나 jsonpath-plus 같은 풀스펙 라이브러리를 함께 쓰는 편이 안전합니다.',
          },
          {
            question: '결과가 배열로 나오는 게 맞나요? 단일 값을 원할 땐 어떻게 하죠?',
            answer: '와일드카드(*)나 재귀(..)를 쓰면 매칭이 여러 개일 수 있으니 결과가 배열로 반환됩니다. 단일 값을 원하면 [0]을 추가해서 첫 번째 요소만 꺼내거나, 인덱스를 명시해 매칭을 1개로 좁히세요.',
          },
          {
            question: '깊이를 모르는 객체에서 특정 키만 모두 찾고 싶어요',
            answer: '재귀 탐색 ..을 쓰세요. 예를 들어 $..id라고 적으면 어떤 깊이에 있든 id라는 키를 가진 값을 모두 모아 배열로 반환합니다. 대용량 JSON에서는 성능 비용이 크니 필요한 범위로 한정하는 게 좋습니다.',
          },
        ]}
      />
    </div>
  );
}
