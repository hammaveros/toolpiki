'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';

type CssUnit = 'px' | 'rem' | 'em' | 'pt' | 'vw' | 'vh';

interface ConversionResult {
  unit: CssUnit;
  value: string;
  css: string;
}

export function CssUnitConverterEn() {
  const [value, setValue] = useState('16');
  const [fromUnit, setFromUnit] = useState<CssUnit>('px');
  const [baseFontSize, setBaseFontSize] = useState('16');
  const [viewportWidth, setViewportWidth] = useState('1920');
  const [viewportHeight, setViewportHeight] = useState('1080');

  const results = useMemo(() => {
    const inputValue = parseFloat(value);
    const base = parseFloat(baseFontSize);
    const vw = parseFloat(viewportWidth);
    const vh = parseFloat(viewportHeight);

    if (isNaN(inputValue) || isNaN(base) || base === 0) return [];

    // Convert to px first
    let pxValue: number;
    switch (fromUnit) {
      case 'px':
        pxValue = inputValue;
        break;
      case 'rem':
      case 'em':
        pxValue = inputValue * base;
        break;
      case 'pt':
        pxValue = inputValue * (96 / 72);
        break;
      case 'vw':
        pxValue = (inputValue / 100) * vw;
        break;
      case 'vh':
        pxValue = (inputValue / 100) * vh;
        break;
      default:
        pxValue = inputValue;
    }

    // Convert from px to each unit
    const conversions: ConversionResult[] = [
      {
        unit: 'px',
        value: pxValue.toFixed(2),
        css: `${pxValue.toFixed(2)}px`,
      },
      {
        unit: 'rem',
        value: (pxValue / base).toFixed(4),
        css: `${(pxValue / base).toFixed(4)}rem`,
      },
      {
        unit: 'em',
        value: (pxValue / base).toFixed(4),
        css: `${(pxValue / base).toFixed(4)}em`,
      },
      {
        unit: 'pt',
        value: (pxValue * (72 / 96)).toFixed(2),
        css: `${(pxValue * (72 / 96)).toFixed(2)}pt`,
      },
      {
        unit: 'vw',
        value: ((pxValue / vw) * 100).toFixed(4),
        css: `${((pxValue / vw) * 100).toFixed(4)}vw`,
      },
      {
        unit: 'vh',
        value: ((pxValue / vh) * 100).toFixed(4),
        css: `${((pxValue / vh) * 100).toFixed(4)}vh`,
      },
    ];

    return conversions;
  }, [value, fromUnit, baseFontSize, viewportWidth, viewportHeight]);

  const units: CssUnit[] = ['px', 'rem', 'em', 'pt', 'vw', 'vh'];

  const presets = [
    { label: '8px', value: '8', unit: 'px' as CssUnit },
    { label: '12px', value: '12', unit: 'px' as CssUnit },
    { label: '14px', value: '14', unit: 'px' as CssUnit },
    { label: '16px', value: '16', unit: 'px' as CssUnit },
    { label: '20px', value: '20', unit: 'px' as CssUnit },
    { label: '24px', value: '24', unit: 'px' as CssUnit },
    { label: '32px', value: '32', unit: 'px' as CssUnit },
    { label: '1rem', value: '1', unit: 'rem' as CssUnit },
    { label: '1.5rem', value: '1.5', unit: 'rem' as CssUnit },
    { label: '2rem', value: '2', unit: 'rem' as CssUnit },
  ];

  return (
    <div className="space-y-2">
      {/* Input */}
      <div className="flex gap-2">
        <Input
          label="Value"
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="16"
          className="flex-1"
        />
        <div className="w-24">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Unit
          </label>
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value as CssUnit)}
            className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          >
            {units.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <Button
            key={preset.label}
            variant="secondary"
            size="sm"
            onClick={() => {
              setValue(preset.value);
              setFromUnit(preset.unit);
            }}
          >
            {preset.label}
          </Button>
        ))}
      </div>

      {/* Base Values */}
      <Card variant="bordered" className="p-4">
        <p className="text-sm font-medium mb-3">Base Values</p>
        <div className="grid grid-cols-3 gap-3">
          <Input
            label="Root font-size (px)"
            type="number"
            value={baseFontSize}
            onChange={(e) => setBaseFontSize(e.target.value)}
            placeholder="16"
          />
          <Input
            label="Viewport width (px)"
            type="number"
            value={viewportWidth}
            onChange={(e) => setViewportWidth(e.target.value)}
            placeholder="1920"
          />
          <Input
            label="Viewport height (px)"
            type="number"
            value={viewportHeight}
            onChange={(e) => setViewportHeight(e.target.value)}
            placeholder="1080"
          />
        </div>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {results.map((result) => (
            <Card
              key={result.unit}
              variant="bordered"
              className={`p-4 ${result.unit === fromUnit ? 'ring-2 ring-blue-500' : ''}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {result.unit}
                </span>
                <CopyButton text={result.css} size="sm" />
              </div>
              <p className="text-lg font-mono font-medium truncate">
                {result.value}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-mono truncate">
                {result.css}
              </p>
            </Card>
          ))}
        </div>
      )}

      {/* Reference */}
      <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
        <p>• rem/em: Based on root font-size (default 16px)</p>
        <p>• vw/vh: 1% of viewport width/height</p>
        <p>• pt: Print points (1pt = 1/72 inch)</p>
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
          📏 What is CSS Unit Converter?
        </h2>
        <p className="text-sm leading-relaxed">
          CSS Unit Converter transforms between px, rem, em, pt, vw, and vh units used in web development.
          It calculates accurate conversions based on root font-size (default 16px) and viewport dimensions.
          Essential for responsive web design, accessible font sizing, and mobile/desktop layout work.
          Copy converted CSS values with one click to paste directly into your code.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 CSS Unit Comparison
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Unit</th>
                <th className="text-left py-2 px-2">Reference</th>
                <th className="text-left py-2 px-2">Characteristics</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">px</td><td>Fixed pixel</td><td>Absolute unit, responds only to browser zoom</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">rem</td><td>Root font-size</td><td>Based on html element, consistent scaling</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">em</td><td>Parent font-size</td><td>Compounds when nested, relative scaling</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">vw</td><td>Viewport width</td><td>Responsive to screen width</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">vh</td><td>Viewport height</td><td>Responsive to screen height</td></tr>
              <tr><td className="py-2 px-2 font-medium">pt</td><td>1/72 inch</td><td>For print media, not recommended for web</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 CSS Unit Best Practices
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Font sizes</strong>: Use rem for accessibility (respects user settings)</li>
          <li><strong>Layouts</strong>: vw/vh for responsive design; use dvh for mobile address bar issues</li>
          <li><strong>Spacing</strong>: rem or px for consistency in margins and padding</li>
          <li><strong>Media queries</strong>: em recommended (better response to browser zoom)</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'What is the difference between rem and em?',
            answer: 'rem is based on the root (html) element font-size, while em is based on the parent element font-size. rem maintains consistent sizing, while em compounds when nested, making calculations harder to predict.',
          },
          {
            question: 'What is the mobile vh issue?',
            answer: 'On mobile browsers, the vh value changes when the address bar appears or disappears, causing layout jumps. Use CSS dvh (dynamic viewport height) or svh (small viewport height) to solve this issue.',
          },
          {
            question: 'Why is 16px the default?',
            answer: 'Most browsers set their default font-size to 16px. Therefore 1rem = 16px. Some developers use the 62.5% trick (setting html font-size to 62.5%) to make 1rem = 10px for easier calculations.',
          },
        ]}
      />
    </div>
  );
}
