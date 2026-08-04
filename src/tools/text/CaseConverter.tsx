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
          <strong className="text-gray-900 dark:text-white">대소문자 변환기는 텍스트를 다양한 케이스 형식으로 변환하는 도구</strong>입니다.
          <strong>UPPERCASE</strong>, <strong>lowercase</strong>, Title Case, <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">camelCase</code>, <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">PascalCase</code>, <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">snake_case</code>, <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">kebab-case</code>, <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">CONSTANT_CASE</code> 등
          프로그래밍과 문서 작성에 필요한 <strong>모든 케이스 변환을 한 번에</strong> 처리할 수 있습니다.
          변수명 작성, API 응답 키 변환, 제목 포맷팅 등에 활용됩니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 케이스 종류별 설명
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>camelCase:</strong> 첫 단어 소문자, 이후 단어 첫 글자 대문자. JavaScript/Java 변수명 (예: <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">userName</code>)</li>
          <li><strong>PascalCase:</strong> 모든 단어 첫 글자 대문자. 클래스명, 컴포넌트명 (예: <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">UserProfile</code>)</li>
          <li><strong>snake_case:</strong> 단어를 언더스코어로 연결. Python, Ruby 변수명 (예: <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">user_name</code>)</li>
          <li><strong>kebab-case:</strong> 단어를 하이픈으로 연결. URL, CSS 클래스 (예: <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">user-name</code>)</li>
          <li><strong>CONSTANT_CASE:</strong> 전부 대문자 + 언더스코어. 상수 정의 (예: <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">MAX_COUNT</code>)</li>
          <li><strong>Title Case:</strong> 각 단어의 첫 글자 대문자. 제목, 헤드라인에 사용</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🔁 같은 문구, 케이스별 변환 결과
        </h2>
        <p className="text-sm leading-relaxed mb-3">
          <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">user profile image</code> 한 문구를
          각 케이스로 바꾸면 이렇게 됩니다. 규칙을 말로 외우는 것보다 결과를 나란히 보는 편이 빠릅니다.
        </p>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">케이스</th>
                <th className="text-left py-2 px-2">결과</th>
                <th className="text-left py-2 px-2">주로 쓰이는 곳</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-1.5 px-2">camelCase</td><td className="font-mono">userProfileImage</td><td>JS·Java 변수, JSON 키</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-1.5 px-2">PascalCase</td><td className="font-mono">UserProfileImage</td><td>클래스, React 컴포넌트</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-1.5 px-2">snake_case</td><td className="font-mono">user_profile_image</td><td>Python 변수, DB 컬럼</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-1.5 px-2">kebab-case</td><td className="font-mono">user-profile-image</td><td>URL, CSS 클래스, 파일명</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-1.5 px-2">CONSTANT_CASE</td><td className="font-mono">USER_PROFILE_IMAGE</td><td>상수, 환경변수</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-1.5 px-2">Title Case</td><td className="font-mono">User Profile Image</td><td>제목, 버튼 라벨</td></tr>
              <tr><td className="py-1.5 px-2">UPPERCASE</td><td className="font-mono">USER PROFILE IMAGE</td><td>강조, 헤더</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🌐 언어·환경별 관례
        </h2>
        <p className="text-sm leading-relaxed mb-3">
          케이스는 취향이 아니라 생태계의 약속입니다. 관례를 어기면 코드 리뷰에서 지적받거나
          프레임워크가 값을 못 찾는 일이 생깁니다.
        </p>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>JavaScript / TypeScript</strong> — 변수·함수는 camelCase, 클래스·타입·컴포넌트는 PascalCase, 상수는 CONSTANT_CASE.</li>
          <li><strong>Python</strong> — 변수·함수는 snake_case, 클래스는 PascalCase. PEP 8에 명시된 규칙입니다.</li>
          <li><strong>데이터베이스</strong> — 테이블·컬럼은 snake_case가 일반적입니다. 대소문자 처리 방식이 DB마다 달라 소문자 통일이 안전합니다.</li>
          <li><strong>CSS / HTML</strong> — 클래스와 속성은 kebab-case. HTML 속성은 대소문자를 구분하지 않으므로 소문자 하이픈이 관례입니다.</li>
          <li><strong>URL</strong> — kebab-case가 표준입니다. 언더스코어는 밑줄과 겹쳐 보여 가독성이 떨어집니다.</li>
          <li><strong>환경변수</strong> — CONSTANT_CASE. 셸에서 소문자 변수와 충돌을 피하기 위한 관례입니다.</li>
        </ul>
        <p className="text-sm leading-relaxed mt-3">
          API를 만들 때는 <strong>서버(snake_case)와 프론트(camelCase)의 경계</strong>에서 변환이 필요한 경우가 많습니다.
          한쪽에서 일괄 변환하는 규칙을 정해두면 혼선을 줄일 수 있습니다.
        </p>
      </section>

      <div className="rounded-lg bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 p-4 text-sm">
        <p className="font-semibold text-indigo-900 dark:text-indigo-200 mb-1">💡 선택 팁</p>
        <p className="text-indigo-800 dark:text-indigo-300">
          변수에는 <strong>camelCase</strong>, 타입/클래스에는 <strong>PascalCase</strong>, 상수에는 <strong>CONSTANT_CASE</strong>를 쓰는 것이 가장 일반적인 관례입니다.
        </p>
      </div>

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
          {
            question: 'URL에는 kebab-case와 snake_case 중 뭐가 좋나요?',
            answer: 'kebab-case가 표준입니다. 언더스코어는 링크에 밑줄이 그어지면 잘 안 보이는 문제가 있어, 하이픈으로 단어를 구분하는 방식이 널리 쓰입니다.',
          },
          {
            question: '약어(ID, URL, API)는 어떻게 처리하나요?',
            answer: '팀 규칙에 따라 다릅니다. userId처럼 첫 글자만 대문자로 쓰는 방식이 가장 널리 쓰이고, userID처럼 약어를 전부 대문자로 두는 스타일도 있습니다. 한 프로젝트 안에서는 하나로 통일하는 것이 중요합니다.',
          },
          {
            question: '입력한 텍스트가 저장되나요?',
            answer: '아니요. 변환은 브라우저에서만 처리되며 입력 내용이 서버로 전송되거나 저장되지 않습니다.',
          },
        ]}
      />
    </div>
  );
}
