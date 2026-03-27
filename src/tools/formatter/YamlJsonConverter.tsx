'use client';

import { useState, useEffect, useRef } from 'react';
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
          🔄 YAML ↔ JSON 변환기란?
        </h2>
        <p className="text-sm leading-relaxed">
          YAML(YAML Ain't Markup Language)과 JSON(JavaScript Object Notation)은 모두 데이터 직렬화 포맷이지만
          문법이 다릅니다. YAML은 들여쓰기 기반으로 사람이 읽기 쉽고, JSON은 중괄호와 따옴표를 사용해 기계 처리에 적합합니다.
          이 도구는 두 형식을 양방향으로 변환하여 Docker Compose, Kubernetes, GitHub Actions 등
          다양한 설정 파일 작업과 API 응답 분석에 활용할 수 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 YAML vs JSON 비교
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">항목</th>
                <th className="text-left py-2 px-2">YAML</th>
                <th className="text-left py-2 px-2">JSON</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2">문법</td><td>들여쓰기 기반</td><td>중괄호, 대괄호</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2">주석</td><td># 지원</td><td>미지원</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2">따옴표</td><td>선택적</td><td>필수</td></tr>
              <tr><td className="py-2 px-2">주요 용도</td><td>설정 파일</td><td>API 통신</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 활용 사례
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li>Docker Compose YAML을 JSON으로 변환하여 프로그램에서 파싱</li>
          <li>Kubernetes 매니페스트를 JSON으로 변환하여 API 전송</li>
          <li>JSON API 응답을 YAML로 변환하여 가독성 있게 확인</li>
          <li>GitHub Actions 워크플로우 디버깅</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '복잡한 YAML도 변환되나요?',
            answer: '이 도구는 기본적인 YAML 구문(키-값, 배열, 중첩 객체)을 지원합니다. 앵커(&), 별칭(*), 멀티라인 문자열(|, >) 등 고급 기능은 부분적으로만 지원됩니다.',
          },
          {
            question: 'YAML의 주석은 어떻게 되나요?',
            answer: 'JSON은 주석을 지원하지 않으므로, YAML의 # 주석은 변환 시 제거됩니다. 중요한 주석은 별도로 저장하세요.',
          },
          {
            question: '타입 변환은 어떻게 되나요?',
            answer: 'true/false는 불린, 숫자 형태는 Number, null/~는 null로 자동 인식됩니다. 문자열로 유지하려면 따옴표로 감싸세요.',
          },
        ]}
      />
    </div>
  );
}

export function YamlJsonConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'yaml-to-json' | 'json-to-yaml'>('yaml-to-json');
  const [error, setError] = useState('');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const parseYaml = (yaml: string): unknown => {
    const lines = yaml.split('\n');
    const result: Record<string, unknown> = {};
    const stack: { indent: number; obj: Record<string, unknown>; key?: string }[] = [{ indent: -1, obj: result }];

    for (const line of lines) {
      if (!line.trim() || line.trim().startsWith('#')) continue;

      const indent = line.search(/\S/);
      const content = line.trim();

      while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
        stack.pop();
      }

      const parent = stack[stack.length - 1].obj;

      if (content.startsWith('- ')) {
        const value = content.slice(2).trim();
        const parentKey = stack[stack.length - 1].key;

        if (parentKey) {
          if (!Array.isArray(parent[parentKey])) {
            parent[parentKey] = [];
          }
          const arr = parent[parentKey] as unknown[];

          if (value.includes(':')) {
            const [k, v] = value.split(':').map(s => s.trim());
            const newObj: Record<string, unknown> = { [k]: parseValue(v) };
            arr.push(newObj);
            stack.push({ indent, obj: newObj, key: k });
          } else {
            arr.push(parseValue(value));
          }
        }
        continue;
      }

      if (content.includes(':')) {
        const colonIdx = content.indexOf(':');
        const key = content.slice(0, colonIdx).trim();
        const value = content.slice(colonIdx + 1).trim();

        if (value === '' || value === '|' || value === '>') {
          parent[key] = {};
          stack.push({ indent, obj: parent[key] as Record<string, unknown>, key });
        } else {
          parent[key] = parseValue(value);
          stack.push({ indent, obj: parent, key });
        }
      }
    }

    return result;
  };

  const parseValue = (value: string): unknown => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (value === 'null' || value === '~') return null;
    if (!isNaN(Number(value)) && value !== '') return Number(value);
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      return value.slice(1, -1);
    }
    return value;
  };

  const jsonToYaml = (obj: unknown, indent: number = 0): string => {
    const spaces = '  '.repeat(indent);
    let result = '';

    if (Array.isArray(obj)) {
      obj.forEach((item) => {
        if (typeof item === 'object' && item !== null) {
          result += `${spaces}- `;
          const entries = Object.entries(item);
          entries.forEach(([k, v], idx) => {
            if (idx === 0) {
              if (typeof v === 'object' && v !== null) {
                result += `${k}:\n${jsonToYaml(v, indent + 2)}`;
              } else {
                result += `${k}: ${formatYamlValue(v)}\n`;
              }
            } else {
              if (typeof v === 'object' && v !== null) {
                result += `${spaces}  ${k}:\n${jsonToYaml(v, indent + 2)}`;
              } else {
                result += `${spaces}  ${k}: ${formatYamlValue(v)}\n`;
              }
            }
          });
        } else {
          result += `${spaces}- ${formatYamlValue(item)}\n`;
        }
      });
    } else if (typeof obj === 'object' && obj !== null) {
      Object.entries(obj).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          result += `${spaces}${key}:\n${jsonToYaml(value, indent + 1)}`;
        } else {
          result += `${spaces}${key}: ${formatYamlValue(value)}\n`;
        }
      });
    }

    return result;
  };

  const formatYamlValue = (value: unknown): string => {
    if (value === null) return 'null';
    if (typeof value === 'string') {
      if (value.includes(':') || value.includes('#') || value.includes('\n')) {
        return `"${value}"`;
      }
      return value;
    }
    return String(value);
  };

  // 자동 변환 (입력 변경 시 300ms 후 실행)
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }

    debounceRef.current = setTimeout(() => {
      try {
        if (mode === 'yaml-to-json') {
          const parsed = parseYaml(input);
          setOutput(JSON.stringify(parsed, null, 2));
          setError('');
        } else {
          const parsed = JSON.parse(input);
          setOutput(jsonToYaml(parsed));
          setError('');
        }
      } catch {
        // 입력 중에는 에러 표시하지 않음
        setOutput('');
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [input, mode]);

  const handleConvert = () => {
    setError('');
    try {
      if (mode === 'yaml-to-json') {
        const parsed = parseYaml(input);
        setOutput(JSON.stringify(parsed, null, 2));
      } else {
        const parsed = JSON.parse(input);
        setOutput(jsonToYaml(parsed));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '변환 중 오류가 발생했습니다.');
      setOutput('');
    }
  };

  const handleSwap = () => {
    setMode(mode === 'yaml-to-json' ? 'json-to-yaml' : 'yaml-to-json');
    setInput(output);
    setOutput('');
    setError('');
  };

  return (
    <div className="space-y-2">
      {/* 모드 선택 탭 */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit">
        <button
          onClick={() => setMode('yaml-to-json')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === 'yaml-to-json' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          YAML → JSON
        </button>
        <button
          onClick={() => setMode('json-to-yaml')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === 'json-to-yaml' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          JSON → YAML
        </button>
      </div>
      {/* 액션 버튼 */}
      <div className="flex gap-2 flex-wrap">
        <Button onClick={handleConvert}>변환</Button>
        <Button variant="secondary" onClick={handleSwap}>↔ 모드 전환</Button>
        <Button variant="secondary" onClick={() => { setInput(''); setOutput(''); setError(''); }}>초기화</Button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* 2단 레이아웃 */}
      <TwoColumnLayout
        leftLabel={mode === 'yaml-to-json' ? 'YAML' : 'JSON'}
        rightLabel={mode === 'yaml-to-json' ? 'JSON' : 'YAML'}
        rightHeader={output ? <CopyButton text={output} /> : undefined}
        left={
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === 'yaml-to-json'
                ? 'name: John Doe\nage: 30\nhobbies:\n  - reading\n  - coding'
                : '{\n  "name": "John Doe",\n  "age": 30,\n  "hobbies": ["reading", "coding"]\n}'
            }
            rows={16}
            className="font-mono text-sm h-[400px]"
          />
        }
        right={
          <Textarea
            value={output}
            readOnly
            placeholder="변환 결과가 여기에 표시됩니다."
            rows={16}
            className="font-mono text-sm h-[400px] bg-gray-50 dark:bg-gray-800/50"
          />
        }
      />

      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs text-gray-600 dark:text-gray-400">
        <p>⚠️ 이 도구는 기본적인 YAML 구문만 지원합니다. 복잡한 YAML은 정확하게 변환되지 않을 수 있습니다.</p>
      </div>

      <SeoContent />
    </div>
  );
}
