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
          <strong className="text-gray-900 dark:text-white">진법 변환기는 2진수, 8진수, 10진수, 16진수를 상호 변환하는 프로그래밍 필수 도구입니다.</strong>{' '}
          컴퓨터는 모든 데이터를 <strong>0과 1(2진수)</strong>로 처리하지만, 사람이 읽기 편하도록 다양한 진법으로 표현합니다.
          <strong>실시간 변환</strong>으로 입력과 동시에 모든 진법 결과를 확인할 수 있습니다.
          결과에 <strong>0b, 0o, 0x 접두사</strong>를 포함해 프로그래밍 언어에서 바로 사용할 수 있습니다.
        </p>

        <div className="mt-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 p-4 text-sm">
          <p className="font-semibold text-blue-900 dark:text-blue-200 mb-1">💡 핵심 포인트</p>
          <p className="text-blue-800 dark:text-blue-300">2진수 4자리 = 16진수 1자리. <strong>비트마스킹·메모리 디버깅</strong>에서 16진수가 짧고 직관적입니다.</p>
        </div>
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
          📖 0~16 변환 대조표
        </h2>
        <p className="text-sm leading-relaxed mb-3">
          자주 쓰는 구간은 외워두면 계산기 없이도 감이 옵니다. 특히 <strong>16진수 한 자리 = 2진수 네 자리</strong> 대응은
          비트마스크나 색상 코드를 읽을 때 그대로 써먹게 됩니다.
        </p>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">10진수</th>
                <th className="text-left py-2 px-2">2진수</th>
                <th className="text-left py-2 px-2">8진수</th>
                <th className="text-left py-2 px-2">16진수</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              <tr className="border-b dark:border-gray-800"><td className="py-1.5 px-2">0</td><td>0000</td><td>0</td><td>0</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-1.5 px-2">1</td><td>0001</td><td>1</td><td>1</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-1.5 px-2">2</td><td>0010</td><td>2</td><td>2</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-1.5 px-2">4</td><td>0100</td><td>4</td><td>4</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-1.5 px-2">7</td><td>0111</td><td>7</td><td>7</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-1.5 px-2">8</td><td>1000</td><td>10</td><td>8</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-1.5 px-2">10</td><td>1010</td><td>12</td><td>A</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-1.5 px-2">15</td><td>1111</td><td>17</td><td>F</td></tr>
              <tr><td className="py-1.5 px-2">16</td><td>10000</td><td>20</td><td>10</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🛠️ 실무에서 진법을 만나는 순간
        </h2>
        <p className="text-sm leading-relaxed mb-3">
          진법 변환은 학교 문제가 아니라 개발하다 보면 계속 마주치는 실무 지식입니다. 대표적인 세 가지입니다.
        </p>
        <ul className="text-sm leading-relaxed space-y-3 list-disc list-inside">
          <li>
            <strong>파일 권한 755</strong> — 8진수입니다. 각 자리를 3비트로 펼치면{' '}
            <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">111 101 101</code>,
            즉 소유자 rwx / 그룹 r-x / 기타 r-x가 됩니다. 644는{' '}
            <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">110 100 100</code>으로 rw- r-- r--입니다.
          </li>
          <li>
            <strong>색상 코드 #FF5733</strong> — 16진수 두 자리씩 끊어 RGB를 나타냅니다.{' '}
            <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">FF</code>=255,{' '}
            <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">57</code>=87,{' '}
            <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">33</code>=51.
            각 채널이 0~255라서 두 자리 16진수와 정확히 맞아떨어집니다.
          </li>
          <li>
            <strong>비트 플래그</strong> — 권한이나 옵션을 1, 2, 4, 8처럼 2의 거듭제곱으로 정의하면
            여러 값을 하나의 정수에 담을 수 있습니다. 읽기(1)+쓰기(2)=3, 여기에 실행(4)을 더하면 7이 되는 식입니다.
          </li>
        </ul>
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
          {
            question: '왜 하필 16진수를 많이 쓰나요?',
            answer: '16진수 한 자리가 2진수 네 자리와 정확히 대응하기 때문입니다. 8비트(1바이트)를 16진수 두 자리로 깔끔하게 표현할 수 있어 메모리 주소나 색상 코드 표기에 적합합니다.',
          },
          {
            question: '리눅스 권한 755는 무슨 뜻인가요?',
            answer: '8진수입니다. 각 자리를 3비트로 펼치면 111 101 101이 되어 소유자는 읽기·쓰기·실행, 그룹과 기타 사용자는 읽기·실행 권한을 갖는다는 의미입니다.',
          },
          {
            question: '아주 큰 수도 정확하게 변환되나요?',
            answer: '일반적인 범위의 정수는 정확히 변환됩니다. 다만 자바스크립트가 안전하게 다루는 정수 범위를 넘어서는 아주 큰 값은 오차가 생길 수 있으니 결과를 확인해 주세요.',
          },
        ]}
      />
    </div>
  );
}
