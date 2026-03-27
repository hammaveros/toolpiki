'use client';

import { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';

type CaseType =
  | 'upper'
  | 'lower'
  | 'title'
  | 'sentence'
  | 'toggle'
  | 'camel'
  | 'pascal'
  | 'snake'
  | 'kebab';

const caseOptions: { value: CaseType; label: string }[] = [
  { value: 'upper', label: '대문자' },
  { value: 'lower', label: '소문자' },
  { value: 'title', label: '타이틀 케이스' },
  { value: 'sentence', label: '문장 케이스' },
  { value: 'toggle', label: '토글 케이스' },
  { value: 'camel', label: 'camelCase' },
  { value: 'pascal', label: 'PascalCase' },
  { value: 'snake', label: 'snake_case' },
  { value: 'kebab', label: 'kebab-case' },
];

export function CaseConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [selectedCase, setSelectedCase] = useState<CaseType>('upper');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const doConvert = (text: string, type: CaseType): string => {
    switch (type) {
      case 'upper':
        return text.toUpperCase();
      case 'lower':
        return text.toLowerCase();
      case 'title':
        return text.replace(
          /\w\S*/g,
          (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
        );
      case 'sentence':
        return text
          .toLowerCase()
          .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
      case 'toggle':
        return text
          .split('')
          .map((c) =>
            c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()
          )
          .join('');
      case 'camel':
        return text
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase());
      case 'pascal':
        return text
          .toLowerCase()
          .replace(/(^|[^a-zA-Z0-9]+)(.)/g, (_, __, c) => c.toUpperCase());
      case 'snake':
        return text
          .replace(/\s+/g, '_')
          .replace(/([a-z])([A-Z])/g, '$1_$2')
          .toLowerCase();
      case 'kebab':
        return text
          .replace(/\s+/g, '-')
          .replace(/([a-z])([A-Z])/g, '$1-$2')
          .toLowerCase();
      default:
        return text;
    }
  };

  // 자동 변환
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!input.trim()) {
      setOutput('');
      return;
    }

    debounceRef.current = setTimeout(() => {
      setOutput(doConvert(input, selectedCase));
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [input, selectedCase]);

  const convertCase = (type: CaseType) => {
    setSelectedCase(type);
    if (input.trim()) {
      setOutput(doConvert(input, type));
    }
  };

  return (
    <div className="space-y-2">
      {/* 입력 */}
      <div>
        <Textarea
          label="텍스트 입력"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="변환할 텍스트를 입력하세요..."
          rows={5}
        />
      </div>

      {/* 변환 버튼들 */}
      <div className="flex flex-wrap gap-2">
        {caseOptions.map((option) => (
          <Button
            key={option.value}
            variant={selectedCase === option.value ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => convertCase(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>

      {/* 출력 */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            결과
          </label>
          {output && <CopyButton text={output} />}
        </div>
        <Textarea
          value={output}
          readOnly
          placeholder="변환된 텍스트가 여기에 표시됩니다."
          rows={5}
          className="bg-gray-50 dark:bg-gray-800/50"
        />
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
          🔤 대소문자 변환기란?
        </h2>
        <p className="text-sm leading-relaxed">
          대소문자 변환기는 텍스트를 다양한 케이스 형식으로 변환하는 도구입니다.
          UPPERCASE, lowercase, Title Case, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE 등
          프로그래밍과 문서 작성에 필요한 모든 케이스 변환을 한 번에 처리할 수 있습니다.
          변수명 작성, API 응답 키 변환, 제목 포맷팅 등에 활용됩니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 케이스 종류별 설명
        </h2>
        <div className="text-sm leading-relaxed space-y-2">
          <p><strong>camelCase:</strong> 첫 단어 소문자, 이후 단어 첫 글자 대문자. JavaScript/Java 변수명에 사용 (예: userName)</p>
          <p><strong>PascalCase:</strong> 모든 단어 첫 글자 대문자. 클래스명, 컴포넌트명에 사용 (예: UserProfile)</p>
          <p><strong>snake_case:</strong> 단어를 언더스코어로 연결. Python, Ruby 변수명에 사용 (예: user_name)</p>
          <p><strong>kebab-case:</strong> 단어를 하이픈으로 연결. URL, CSS 클래스에 사용 (예: user-name)</p>
          <p><strong>CONSTANT_CASE:</strong> 전부 대문자 + 언더스코어. 상수 정의에 사용 (예: MAX_COUNT)</p>
          <p><strong>Title Case:</strong> 각 단어의 첫 글자 대문자. 제목, 헤드라인에 사용</p>
        </div>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '프로그래밍에서 어떤 케이스를 사용해야 하나요?',
            answer: '언어마다 관례가 다릅니다. JavaScript/Java는 camelCase(변수)와 PascalCase(클래스), Python은 snake_case, CSS는 kebab-case를 주로 사용합니다.',
          },
          {
            question: '한글도 변환되나요?',
            answer: '대소문자 변환은 알파벳에만 적용됩니다. 한글은 변경 없이 유지되며, 영문만 선택적으로 변환됩니다.',
          },
          {
            question: 'camelCase와 PascalCase의 차이는?',
            answer: 'camelCase는 첫 단어가 소문자(userName)이고, PascalCase는 첫 단어도 대문자(UserName)입니다. 변수에는 camelCase, 클래스/타입에는 PascalCase를 사용합니다.',
          },
        ]}
      />
    </div>
  );
}
