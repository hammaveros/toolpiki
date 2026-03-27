'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { Select } from '@/components/ui/Select';
import { FaqSection } from '@/components/ui/FaqItem';

type Base = '2' | '8' | '10' | '16';

export function BaseConverterEn() {
  const [input, setInput] = useState('');
  const [inputBase, setInputBase] = useState<Base>('10');

  const results = useMemo(() => {
    if (!input) return null;

    let decimal: number;

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
    { value: '2', label: 'Binary' },
    { value: '8', label: 'Octal' },
    { value: '10', label: 'Decimal' },
    { value: '16', label: 'Hexadecimal' },
  ];

  return (
    <div className="space-y-2">
      {/* Input */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <Input
            label="Number to Convert"
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            placeholder={
              inputBase === '16'
                ? 'e.g., 1A2B'
                : inputBase === '2'
                ? 'e.g., 1010'
                : 'e.g., 255'
            }
          />
        </div>
        <Select
          label="Input Base"
          value={inputBase}
          onChange={(e) => setInputBase(e.target.value as Base)}
          options={baseOptions}
        />
      </div>

      {/* Results */}
      {results && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ResultCard
            label="Binary (Base 2)"
            value={results.binary}
            prefix="0b"
          />
          <ResultCard
            label="Octal (Base 8)"
            value={results.octal}
            prefix="0o"
          />
          <ResultCard
            label="Decimal (Base 10)"
            value={results.decimal}
          />
          <ResultCard
            label="Hexadecimal (Base 16)"
            value={results.hexadecimal}
            prefix="0x"
          />
        </div>
      )}

      {/* Help */}
      <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
        <p>• Binary: Uses 0 and 1 only (computer basic unit)</p>
        <p>• Octal: Uses 0-7 (Unix permissions, etc.)</p>
        <p>• Decimal: Uses 0-9 (standard numbers)</p>
        <p>• Hexadecimal: Uses 0-9, A-F (color codes, memory addresses, etc.)</p>
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
          🔢 What is Base Converter?
        </h2>
        <p className="text-sm leading-relaxed">
          Base Converter is an essential programming tool that converts between binary, octal, decimal, and hexadecimal number systems.
          Computers process all data as 0s and 1s (binary), but we use different bases for human readability.
          See conversion results in real-time as you type, enabling quick and accurate conversions.
          Results include 0b, 0o, 0x prefixes ready for direct use in programming languages.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 Base System Overview
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Base</th>
                <th className="text-left py-2 px-2">Digits</th>
                <th className="text-left py-2 px-2">Prefix</th>
                <th className="text-left py-2 px-2">Common Uses</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Binary</td><td>0, 1</td><td className="font-mono">0b</td><td>Bit operations, flags</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Octal</td><td>0-7</td><td className="font-mono">0o</td><td>Unix file permissions</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Decimal</td><td>0-9</td><td>none</td><td>Everyday numbers</td></tr>
              <tr><td className="py-2 px-2 font-medium">Hexadecimal</td><td>0-9, A-F</td><td className="font-mono">0x</td><td>Color codes, memory</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Conversion Tips
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Hex to Binary</strong>: Each digit becomes 4 bits (F → 1111)</li>
          <li><strong>Octal to Binary</strong>: Each digit becomes 3 bits (7 → 111)</li>
          <li><strong>Color codes</strong>: #FF5733 means R=255, G=87, B=51 (decimal)</li>
          <li><strong>Permission 755</strong>: 111-101-101 (owner rwx, group/others rx)</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'What do A-F mean in hexadecimal?',
            answer: 'Hexadecimal uses A-F for values 10-15 after 0-9. A=10, B=11, C=12, D=13, E=14, F=15.',
          },
          {
            question: 'How are negative numbers converted?',
            answer: 'This tool supports positive integers only. Computers represent negatives using two\'s complement, which varies by bit width.',
          },
          {
            question: 'Why use 0b, 0o, 0x prefixes?',
            answer: 'These prefixes identify the base in programming languages. 0b means binary, 0o means octal, 0x means hexadecimal.',
          },
        ]}
      />
    </div>
  );
}
