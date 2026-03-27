'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';

interface RadiusValues {
  topLeft: number;
  topRight: number;
  bottomRight: number;
  bottomLeft: number;
}

const presets = [
  { name: 'None', values: { topLeft: 0, topRight: 0, bottomRight: 0, bottomLeft: 0 } },
  { name: 'Small', values: { topLeft: 4, topRight: 4, bottomRight: 4, bottomLeft: 4 } },
  { name: 'Medium', values: { topLeft: 12, topRight: 12, bottomRight: 12, bottomLeft: 12 } },
  { name: 'Large', values: { topLeft: 24, topRight: 24, bottomRight: 24, bottomLeft: 24 } },
  { name: 'Full', values: { topLeft: 50, topRight: 50, bottomRight: 50, bottomLeft: 50 } },
  { name: 'Pill', values: { topLeft: 100, topRight: 100, bottomRight: 100, bottomLeft: 100 } },
  { name: 'Drop', values: { topLeft: 50, topRight: 50, bottomRight: 0, bottomLeft: 50 } },
  { name: 'Leaf', values: { topLeft: 50, topRight: 0, bottomRight: 50, bottomLeft: 0 } },
];

export function BorderRadiusGeneratorEn() {
  const [radius, setRadius] = useState<RadiusValues>({
    topLeft: 12, topRight: 12, bottomRight: 12, bottomLeft: 12
  });
  const [linked, setLinked] = useState(true);
  const [unit, setUnit] = useState<'px' | '%'>('px');
  const [boxWidth, setBoxWidth] = useState(200);
  const [boxHeight, setBoxHeight] = useState(150);
  const [bgColor, setBgColor] = useState('#3b82f6');

  const cssValue = useMemo(() => {
    const { topLeft, topRight, bottomRight, bottomLeft } = radius;
    const u = unit;

    if (topLeft === topRight && topRight === bottomRight && bottomRight === bottomLeft) {
      return `${topLeft}${u}`;
    }
    if (topLeft === bottomRight && topRight === bottomLeft) {
      return `${topLeft}${u} ${topRight}${u}`;
    }
    if (topRight === bottomLeft) {
      return `${topLeft}${u} ${topRight}${u} ${bottomRight}${u}`;
    }
    return `${topLeft}${u} ${topRight}${u} ${bottomRight}${u} ${bottomLeft}${u}`;
  }, [radius, unit]);

  const updateRadius = (key: keyof RadiusValues, value: number) => {
    if (linked) {
      setRadius({ topLeft: value, topRight: value, bottomRight: value, bottomLeft: value });
    } else {
      setRadius(prev => ({ ...prev, [key]: value }));
    }
  };

  const applyPreset = (preset: typeof presets[0]) => {
    setRadius(preset.values);
  };

  const copyCode = `border-radius: ${cssValue};`;

  return (
    <div className="space-y-6">
      {/* Presets */}
      <Card variant="bordered" className="p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Presets</h3>
        <div className="flex flex-wrap gap-2">
          {presets.map(preset => (
            <Button
              key={preset.name}
              variant="secondary"
              size="sm"
              onClick={() => applyPreset(preset)}
            >
              {preset.name}
            </Button>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Preview */}
        <Card variant="bordered" className="p-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Preview</h3>
          <div className="flex items-center justify-center min-h-[300px] bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div
              style={{
                width: boxWidth,
                height: boxHeight,
                backgroundColor: bgColor,
                borderRadius: `${radius.topLeft}${unit} ${radius.topRight}${unit} ${radius.bottomRight}${unit} ${radius.bottomLeft}${unit}`,
                transition: 'all 0.2s ease',
              }}
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400">Width</label>
              <input
                type="range"
                min={50}
                max={300}
                value={boxWidth}
                onChange={(e) => setBoxWidth(Number(e.target.value))}
                className="w-full mt-1"
              />
              <span className="text-xs text-gray-600 dark:text-gray-400">{boxWidth}px</span>
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400">Height</label>
              <input
                type="range"
                min={50}
                max={300}
                value={boxHeight}
                onChange={(e) => setBoxHeight(Number(e.target.value))}
                className="w-full mt-1"
              />
              <span className="text-xs text-gray-600 dark:text-gray-400">{boxHeight}px</span>
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400">Color</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Settings */}
        <Card variant="bordered" className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Corner Settings</h3>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={linked}
                  onChange={(e) => setLinked(e.target.checked)}
                  className="w-4 h-4"
                />
                Link
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as 'px' | '%')}
                className="px-2 py-1 text-sm border rounded dark:bg-gray-800 dark:border-gray-700"
              >
                <option value="px">px</option>
                <option value="%">%</option>
              </select>
            </div>
          </div>

          {/* Visual corner controls */}
          <div className="relative w-48 h-48 mx-auto mb-6">
            <div
              className="absolute inset-0 border-2 border-dashed border-gray-300 dark:border-gray-600"
              style={{
                borderRadius: `${radius.topLeft}${unit} ${radius.topRight}${unit} ${radius.bottomRight}${unit} ${radius.bottomLeft}${unit}`,
              }}
            />
            {/* Top Left */}
            <div className="absolute -top-1 -left-1 flex flex-col items-start">
              <input
                type="number"
                min={0}
                max={unit === '%' ? 50 : 150}
                value={radius.topLeft}
                onChange={(e) => updateRadius('topLeft', Number(e.target.value))}
                className="w-14 text-xs text-center px-1 py-0.5 border rounded dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            {/* Top Right */}
            <div className="absolute -top-1 -right-1 flex flex-col items-end">
              <input
                type="number"
                min={0}
                max={unit === '%' ? 50 : 150}
                value={radius.topRight}
                onChange={(e) => updateRadius('topRight', Number(e.target.value))}
                className="w-14 text-xs text-center px-1 py-0.5 border rounded dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            {/* Bottom Right */}
            <div className="absolute -bottom-1 -right-1 flex flex-col items-end">
              <input
                type="number"
                min={0}
                max={unit === '%' ? 50 : 150}
                value={radius.bottomRight}
                onChange={(e) => updateRadius('bottomRight', Number(e.target.value))}
                className="w-14 text-xs text-center px-1 py-0.5 border rounded dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            {/* Bottom Left */}
            <div className="absolute -bottom-1 -left-1 flex flex-col items-start">
              <input
                type="number"
                min={0}
                max={unit === '%' ? 50 : 150}
                value={radius.bottomLeft}
                onChange={(e) => updateRadius('bottomLeft', Number(e.target.value))}
                className="w-14 text-xs text-center px-1 py-0.5 border rounded dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
          </div>

          {/* Sliders */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400">Top Left</label>
              <input
                type="range"
                min={0}
                max={unit === '%' ? 50 : 150}
                value={radius.topLeft}
                onChange={(e) => updateRadius('topLeft', Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400">Top Right</label>
              <input
                type="range"
                min={0}
                max={unit === '%' ? 50 : 150}
                value={radius.topRight}
                onChange={(e) => updateRadius('topRight', Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400">Bottom Left</label>
              <input
                type="range"
                min={0}
                max={unit === '%' ? 50 : 150}
                value={radius.bottomLeft}
                onChange={(e) => updateRadius('bottomLeft', Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400">Bottom Right</label>
              <input
                type="range"
                min={0}
                max={unit === '%' ? 50 : 150}
                value={radius.bottomRight}
                onChange={(e) => updateRadius('bottomRight', Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </Card>
      </div>

      {/* CSS Code */}
      <Card variant="bordered" className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">CSS Code</h3>
          <CopyButton text={copyCode} />
        </div>
        <pre className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-mono overflow-x-auto">
          {copyCode}
        </pre>
      </Card>

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📐 What is Border Radius Generator?
        </h2>
        <p className="text-sm leading-relaxed">
          Border Radius Generator is a visual tool for editing CSS border-radius properties with instant preview.
          Adjust all four corners individually or link them for uniform changes, supporting both px and % units.
          Quickly create special shapes with presets like Pill, Drop, and Leaf, and see results in real-time.
          Perfect for styling buttons, cards, avatars, badges, and other UI elements.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 Understanding border-radius
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Syntax</th>
                <th className="text-left py-2 px-2">Application Order</th>
                <th className="text-left py-2 px-2">Example</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">1 value</td><td>All corners equal</td><td>border-radius: 12px;</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">2 values</td><td>TL+BR / TR+BL</td><td>border-radius: 12px 0;</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">3 values</td><td>TL / TR+BL / BR</td><td>border-radius: 12px 8px 0;</td></tr>
              <tr><td className="py-2 px-2 font-medium">4 values</td><td>TL / TR / BR / BL</td><td>border-radius: 12px 8px 4px 0;</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Corner Design Tips
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Perfect circle</strong>: Apply 50% to a square element (or half the width in px)</li>
          <li><strong>Pill shape</strong>: Apply half the height or more (e.g., 9999px)</li>
          <li><strong>Consistency</strong>: Use multiples of 4px in design systems (4, 8, 12, 16...)</li>
          <li><strong>Accessibility</strong>: Ensure click areas are not too small</li>
          <li><strong>Responsive</strong>: Consider smaller radius values on mobile</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'What is the difference between px and % units?',
            answer: 'px is an absolute value independent of element size. % is calculated relative to the element dimensions. Applying 50% makes a square into a circle and a rectangle into an ellipse.',
          },
          {
            question: 'What happens when corners overlap?',
            answer: 'If the sum of adjacent corner radii exceeds the side length, browsers automatically scale them down proportionally. This can lead to unexpected results, so be careful.',
          },
          {
            question: 'How do I create elliptical corners?',
            answer: 'Use a slash (/) in border-radius to specify different horizontal/vertical radii. For example, border-radius: 50% / 25%; creates elliptical corners.',
          },
        ]}
      />
    </div>
  );
}
