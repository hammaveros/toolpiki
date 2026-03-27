'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { FaqSection } from '@/components/ui/FaqItem';

export function ContrastCheckerEn() {
  const [foreground, setForeground] = useState('#000000');
  const [background, setBackground] = useState('#ffffff');

  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const getLuminance = (r: number, g: number, b: number): number => {
    const [rs, gs, bs] = [r, g, b].map((c) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const contrastRatio = useMemo(() => {
    const fg = hexToRgb(foreground);
    const bg = hexToRgb(background);

    if (!fg || !bg) return 0;

    const l1 = getLuminance(fg.r, fg.g, fg.b);
    const l2 = getLuminance(bg.r, bg.g, bg.b);

    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
  }, [foreground, background]);

  const wcagResults = useMemo(() => {
    return {
      aaLarge: contrastRatio >= 3,
      aaSmall: contrastRatio >= 4.5,
      aaaLarge: contrastRatio >= 4.5,
      aaaSmall: contrastRatio >= 7,
    };
  }, [contrastRatio]);

  const swapColors = () => {
    const temp = foreground;
    setForeground(background);
    setBackground(temp);
  };

  const presets = [
    { name: 'Default', fg: '#000000', bg: '#ffffff' },
    { name: 'Dark Mode', fg: '#e5e7eb', bg: '#1f2937' },
    { name: 'Link', fg: '#2563eb', bg: '#ffffff' },
    { name: 'Warning', fg: '#ffffff', bg: '#dc2626' },
    { name: 'Success', fg: '#ffffff', bg: '#16a34a' },
    { name: 'Low Contrast', fg: '#9ca3af', bg: '#f3f4f6' },
  ];

  const getGradeColor = (ratio: number): string => {
    if (ratio >= 7) return 'text-green-600 dark:text-green-400';
    if (ratio >= 4.5) return 'text-blue-600 dark:text-blue-400';
    if (ratio >= 3) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getGrade = (ratio: number): string => {
    if (ratio >= 7) return 'AAA';
    if (ratio >= 4.5) return 'AA';
    if (ratio >= 3) return 'AA Large';
    return 'Fail';
  };

  return (
    <div className="space-y-2">
      {/* Preview */}
      <Card variant="bordered" className="p-6 text-center" style={{ backgroundColor: background }}>
        <p style={{ color: foreground }} className="text-4xl font-bold mb-2">
          ABC 123 XYZ
        </p>
        <p style={{ color: foreground }} className="text-lg mb-2">
          Regular text example.
        </p>
        <p style={{ color: foreground }} className="text-sm">
          Small text example. The quick brown fox jumps over the lazy dog.
        </p>
      </Card>

      {/* Contrast Ratio Display */}
      <Card variant="bordered" className="p-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Contrast Ratio</p>
        <p className={`text-5xl font-bold ${getGradeColor(contrastRatio)}`}>
          {contrastRatio.toFixed(2)}:1
        </p>
        <p className={`text-xl font-medium mt-2 ${getGradeColor(contrastRatio)}`}>
          {getGrade(contrastRatio)}
        </p>
      </Card>

      {/* Presets */}
      <div className="flex gap-1 flex-wrap">
        {presets.map((preset) => (
          <Button
            key={preset.name}
            variant="secondary"
            size="sm"
            onClick={() => {
              setForeground(preset.fg);
              setBackground(preset.bg);
            }}
          >
            {preset.name}
          </Button>
        ))}
      </div>

      {/* Color Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 items-end">
        <Card variant="bordered" className="p-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Foreground (Text)
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={foreground}
              onChange={(e) => setForeground(e.target.value)}
              className="w-12 h-10 rounded cursor-pointer"
            />
            <Input
              value={foreground}
              onChange={(e) => setForeground(e.target.value)}
              className="font-mono"
            />
          </div>
        </Card>

        <Button variant="secondary" onClick={swapColors} className="hidden sm:flex h-10 mb-4">
          ↔
        </Button>

        <Card variant="bordered" className="p-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Background
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              className="w-12 h-10 rounded cursor-pointer"
            />
            <Input
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              className="font-mono"
            />
          </div>
        </Card>
      </div>

      <Button variant="secondary" onClick={swapColors} className="sm:hidden w-full">
        ↔ Swap Colors
      </Button>

      {/* WCAG Results */}
      <Card variant="bordered" className="p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          WCAG 2.1 Accessibility Guidelines
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className={`p-3 rounded ${wcagResults.aaSmall ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
            <p className="text-sm font-medium">AA Normal Text</p>
            <p className="text-xs text-gray-500">Requires 4.5:1</p>
            <p className={`font-bold ${wcagResults.aaSmall ? 'text-green-600' : 'text-red-600'}`}>
              {wcagResults.aaSmall ? 'Pass' : 'Fail'}
            </p>
          </div>
          <div className={`p-3 rounded ${wcagResults.aaLarge ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
            <p className="text-sm font-medium">AA Large Text</p>
            <p className="text-xs text-gray-500">Requires 3:1</p>
            <p className={`font-bold ${wcagResults.aaLarge ? 'text-green-600' : 'text-red-600'}`}>
              {wcagResults.aaLarge ? 'Pass' : 'Fail'}
            </p>
          </div>
          <div className={`p-3 rounded ${wcagResults.aaaSmall ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
            <p className="text-sm font-medium">AAA Normal Text</p>
            <p className="text-xs text-gray-500">Requires 7:1</p>
            <p className={`font-bold ${wcagResults.aaaSmall ? 'text-green-600' : 'text-red-600'}`}>
              {wcagResults.aaaSmall ? 'Pass' : 'Fail'}
            </p>
          </div>
          <div className={`p-3 rounded ${wcagResults.aaaLarge ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
            <p className="text-sm font-medium">AAA Large Text</p>
            <p className="text-xs text-gray-500">Requires 4.5:1</p>
            <p className={`font-bold ${wcagResults.aaaLarge ? 'text-green-600' : 'text-red-600'}`}>
              {wcagResults.aaaLarge ? 'Pass' : 'Fail'}
            </p>
          </div>
        </div>
      </Card>

      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs text-gray-600 dark:text-gray-400">
        <p><strong>Large text:</strong> 18pt (24px) or larger, or 14pt (18.67px) bold or larger</p>
        <p><strong>Normal text:</strong> All other text</p>
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
          ♿ What is Contrast Checker?
        </h2>
        <p className="text-sm leading-relaxed">
          Contrast Checker measures the luminance contrast ratio between text and background colors for web accessibility testing.
          It verifies compliance with WCAG (Web Content Accessibility Guidelines) 2.1 standards in real-time, showing AA and AAA level pass/fail status.
          Ensuring content is readable for users with visual impairments is both a best practice and often a legal requirement.
          Testing contrast ratios during the design phase helps prevent accessibility issues before deployment.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 WCAG Contrast Ratio Requirements
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Level</th>
                <th className="text-left py-2 px-2">Normal Text</th>
                <th className="text-left py-2 px-2">Large Text</th>
                <th className="text-left py-2 px-2">Application</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium text-yellow-600">AA</td><td>4.5:1 minimum</td><td>3:1 minimum</td><td>Minimum standard (legal requirement)</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium text-green-600">AAA</td><td>7:1 minimum</td><td>4.5:1 minimum</td><td>Enhanced accessibility</td></tr>
              <tr><td className="py-2 px-2 font-medium text-gray-500">Note</td><td colSpan={3}>Large text = 18pt (24px)+ or 14pt (18.67px) Bold+</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Accessible Design Tips
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Body text</strong>: Meet AA (4.5:1) minimum, aim for AAA (7:1) when possible</li>
          <li><strong>Placeholders</strong>: Keep hint text at 3:1 or higher</li>
          <li><strong>Error messages</strong>: Use red color + icons to avoid relying on color alone</li>
          <li><strong>Link text</strong>: Add underline or bold to distinguish from surrounding text</li>
          <li><strong>Dark mode</strong>: Apply the same contrast standards as light mode</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'What is the difference between AA and AAA levels?',
            answer: 'AA is the minimum accessibility standard often required by law. AAA requires higher contrast ratios and provides a better experience for users with low vision. Most websites aim for AA, with AAA recommended for critical content.',
          },
          {
            question: 'Why is the requirement lower for large text?',
            answer: 'Large text has thicker strokes and covers more area, making it easier for users with low vision to perceive. This allows a lower contrast ratio while maintaining the same level of readability.',
          },
          {
            question: 'Does passing contrast checks guarantee accessibility?',
            answer: 'No, contrast ratio is just one aspect of accessibility. You should also consider keyboard navigation, screen reader compatibility, focus indicators, meaningful alt text, and many other factors.',
          },
        ]}
      />
    </div>
  );
}
