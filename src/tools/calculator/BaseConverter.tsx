'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { Select } from '@/components/ui/Select';
import { FaqSection } from '@/components/ui/FaqItem';

type Base = '2' | '8' | '10' | '16';

export function BaseConverter() {
  const [input, setInput] = useState('');
  const [inputBase, setInputBase] = useState<Base>('10');

  const results = useMemo(() => {
    if (!input) return null;

    let decimal: number;

    // 입력값을 10진수로 변환
    try {
      decimal = parseInt(input, parseInt(inputBase));
      if (isNaN(decimal)) return null;
    } catch {
      return null;
    }

    return {
      binary: decimal.toString(2),
      octal: decimal.toString(8),
      decimal: decimal.toString(10),
      hexadecimal: decimal.toString(16).toUpperCase(),
    };
  }, [input, inputBase]);

  const baseOptions = [
    { value: '2', label: '2진수' },
    { value: '8', label: '8진수' },
    { value: '10', label: '10진수' },
    { value: '16', label: '16진수' },
  ];

  return (
    <div className="space-y-2">
      {/* 입력 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <Input
            label="변환할 숫자"
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            placeholder={
              inputBase === '16'
                ? '예: 1A2B'
                : inputBase === '2'
                ? '예: 1010'
                : '예: 255'
            }
          />
        </div>
        <Select
          label="입력 진수"
          value={inputBase}
          onChange={(e) => setInputBase(e.target.value as Base)}
          options={baseOptions}
        />
      </div>

      {/* 결과 */}
      {results && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ResultCard
            label="2진수 (Binary)"
            value={results.binary}
            prefix="0b"
          />
          <ResultCard
            label="8진수 (Octal)"
            value={results.octal}
            prefix="0o"
          />
          <ResultCard
            label="10진수 (Decimal)"
            value={results.decimal}
          />
          <ResultCard
            label="16진수 (Hexadecimal)"
            value={results.hexadecimal}
            prefix="0x"
          />
        </div>
      )}

      {/* 도움말 */}
      <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
        <p>• 2진수: 0과 1만 사용 (컴퓨터 기본 단위)</p>
        <p>• 8진수: 0-7 사용 (Unix 권한 등)</p>
        <p>• 10진수: 0-9 사용 (일반적인 숫자)</p>
        <p>• 16진수: 0-9, A-F 사용 (색상 코드, 메모리 주소 등)</p>
      </div>

      <SeoContent />
    </div>
  );
}

function ResultCard({
  label,
  value,
  prefix = '',
}: {
  label: string;
  value: string;
  prefix?: string;
}) {
  const displayValue = prefix + value;

  return (
    <Card variant="bordered" className="p-4">
      <div className="flex justify-between items-start mb-2">
        <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
        <CopyButton text={displayValue} size="sm" />
      </div>
      <code className="text-lg font-mono font-bold text-gray-900 dark:text-white break-all">
        <span className="text-gray-400">{prefix}</span>
        {value}
      </code>
    </Card>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🔢 진법 변환기란?
        </h2>
        <p className="text-sm leading-relaxed">
          진법 변환기는 2진수, 8진수, 10진수, 16진수를 상호 변환하는 프로그래밍 필수 도구입니다.
          컴퓨터는 모든 데이터를 0과 1(2진수)로 처리하지만, 사람이 읽기 편하도록 다양한 진법으로 표현합니다.
          입력과 동시에 모든 진법 결과를 실시간으로 확인할 수 있어 빠른 변환이 가능합니다.
          결과에 0b, 0o, 0x 접두사를 포함해 프로그래밍 언어에서 바로 사용할 수 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 진법별 특징 및 활용
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">진법</th>
                <th className="text-left py-2 px-2">사용 숫자</th>
                <th className="text-left py-2 px-2">접두사</th>
                <th className="text-left py-2 px-2">활용 예시</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">2진수</td><td>0, 1</td><td className="font-mono">0b</td><td>비트 연산, 플래그</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">8진수</td><td>0-7</td><td className="font-mono">0o</td><td>Unix 파일 권한 (755)</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">10진수</td><td>0-9</td><td>없음</td><td>일상적인 숫자</td></tr>
              <tr><td className="py-2 px-2 font-medium">16진수</td><td>0-9, A-F</td><td className="font-mono">0x</td><td>색상 코드, 메모리 주소</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 진법 변환 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>16진수 → 2진수</strong>: 각 자리를 4비트로 변환 (F → 1111)</li>
          <li><strong>8진수 → 2진수</strong>: 각 자리를 3비트로 변환 (7 → 111)</li>
          <li><strong>색상 코드</strong>: #FF5733은 R=255, G=87, B=51 (10진수)</li>
          <li><strong>권한 755</strong>: 111-101-101 (소유자 rwx, 그룹/기타 rx)</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '16진수에서 A-F는 무엇인가요?',
            answer: '16진수는 0-9 이후 10-15를 A-F로 표현합니다. A=10, B=11, C=12, D=13, E=14, F=15입니다.',
          },
          {
            question: '음수는 어떻게 변환하나요?',
            answer: '이 도구는 양수만 지원합니다. 컴퓨터에서 음수는 2의 보수로 표현하며, 비트 수에 따라 다르게 표현됩니다.',
          },
          {
            question: '0b, 0o, 0x 접두사는 왜 쓰나요?',
            answer: '프로그래밍 언어에서 진법을 구분하기 위해 사용합니다. 0b는 2진수, 0o는 8진수, 0x는 16진수를 나타냅니다.',
          },
        ]}
      />
    </div>
  );
}
