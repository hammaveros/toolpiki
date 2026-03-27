'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FaqSection } from '@/components/ui/FaqItem';

type CalcMode = 'percent-of' | 'what-percent' | 'increase' | 'decrease';

export function PercentageCalculatorEn() {
  const [mode, setMode] = useState<CalcMode>('percent-of');
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');

  const result = useMemo(() => {
    const v1 = parseFloat(value1);
    const v2 = parseFloat(value2);

    if (isNaN(v1) || isNaN(v2)) return null;

    switch (mode) {
      case 'percent-of':
        return {
          value: (v1 / 100) * v2,
          formula: `${v1}% × ${v2} = ${((v1 / 100) * v2).toFixed(2)}`,
        };
      case 'what-percent':
        return {
          value: (v1 / v2) * 100,
          formula: `${v1} ÷ ${v2} × 100 = ${((v1 / v2) * 100).toFixed(2)}%`,
        };
      case 'increase':
        return {
          value: v1 * (1 + v2 / 100),
          formula: `${v1} × (1 + ${v2}%) = ${(v1 * (1 + v2 / 100)).toFixed(2)}`,
        };
      case 'decrease':
        return {
          value: v1 * (1 - v2 / 100),
          formula: `${v1} × (1 - ${v2}%) = ${(v1 * (1 - v2 / 100)).toFixed(2)}`,
        };
      default:
        return null;
    }
  }, [mode, value1, value2]);

  const modeOptions: { value: CalcMode; label: string; desc: string }[] = [
    { value: 'percent-of', label: 'A% of B', desc: 'A% × B' },
    { value: 'what-percent', label: 'A is what % of B?', desc: 'A ÷ B × 100' },
    { value: 'increase', label: 'A + B% increase', desc: 'A × (1 + B%)' },
    { value: 'decrease', label: 'A - B% decrease', desc: 'A × (1 - B%)' },
  ];

  const getLabels = () => {
    switch (mode) {
      case 'percent-of':
        return { label1: 'Percentage (%)', label2: 'Base Value' };
      case 'what-percent':
        return { label1: 'Part Value', label2: 'Whole Value' };
      case 'increase':
        return { label1: 'Original Value', label2: 'Increase Rate (%)' };
      case 'decrease':
        return { label1: 'Original Value', label2: 'Decrease Rate (%)' };
    }
  };

  const labels = getLabels();

  return (
    <div className="space-y-2">
      {/* Mode selection */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {modeOptions.map((option) => (
          <Button
            key={option.value}
            variant={mode === option.value ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setMode(option.value)}
            className="flex flex-col h-auto py-2"
          >
            <span>{option.label}</span>
            <span className="text-xs opacity-70">{option.desc}</span>
          </Button>
        ))}
      </div>

      {/* Input */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={labels.label1}
          type="number"
          value={value1}
          onChange={(e) => setValue1(e.target.value)}
          placeholder="Enter a number"
        />
        <Input
          label={labels.label2}
          type="number"
          value={value2}
          onChange={(e) => setValue2(e.target.value)}
          placeholder="Enter a number"
        />
      </div>

      {/* Result */}
      {result && (
        <Card variant="bordered" className="p-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Result</p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {result.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            {mode === 'what-percent' && '%'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-mono">
            {result.formula}
          </p>
        </Card>
      )}

      {/* Examples */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        <p className="font-medium mb-2">Examples:</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>20% discount on $500 → Mode: "A% of B"</li>
          <li>$30 is what % of $100? → Mode: "A is what % of B?"</li>
          <li>$50,000 salary with 10% raise → Mode: "A + B% increase"</li>
        </ul>
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
          🔢 What is Percentage Calculator?
        </h2>
        <p className="text-sm leading-relaxed">
          Percentage Calculator solves various percentage problems with four easy modes.
          Calculate discounts, find ratios, apply increases or decreases—all common percentage operations you need daily.
          The formula is displayed alongside results so you can understand how the calculation works.
          Perfect for shopping discounts, tax calculations, growth analysis, and grade conversions.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 Percentage Calculation Types
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Mode</th>
                <th className="text-left py-2 px-2">Formula</th>
                <th className="text-left py-2 px-2">Example Use</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">A% of B</td><td className="font-mono">A/100 × B</td><td>20% discount on $500</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">A is what % of B?</td><td className="font-mono">A/B × 100</td><td>30 is what % of 100?</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">A + B% increase</td><td className="font-mono">A × (1 + B/100)</td><td>$50k salary + 10% raise</td></tr>
              <tr><td className="py-2 px-2 font-medium">A - B% decrease</td><td className="font-mono">A × (1 - B/100)</td><td>Stock $100 down 15%</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Percentage Calculation Tips
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Discounted price</strong>: Original × (1 - discount rate) = final price</li>
          <li><strong>Tax included</strong>: Price × 1.0825 for 8.25% sales tax</li>
          <li><strong>Sequential changes</strong>: 10% up then 10% down ≠ original (actually 99%)</li>
          <li><strong>Reverse calculation</strong>: If 30% is $150, total is $150 ÷ 0.3 = $500</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'How do I find the original price from a discounted price?',
            answer: 'Divide the discounted price by (1 - discount rate). Example: If $80 is the price after 20% off, original is $80 ÷ 0.8 = $100.',
          },
          {
            question: 'Is two 50% discounts the same as free?',
            answer: 'No. The second 50% applies to the already-discounted price. Two 50% discounts result in 25% of the original price (75% total discount).',
          },
          {
            question: 'Why does 20% up then 20% down not equal the original?',
            answer: 'The decrease applies to the larger increased amount. Starting at 100: +20% = 120, then -20% of 120 = 96. You lose 4%.',
          },
        ]}
      />
    </div>
  );
}
