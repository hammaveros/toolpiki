'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';

interface Shadow {
  id: number;
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
}

const presets = [
  { name: 'Basic', shadows: [{ offsetX: 4, offsetY: 4, blur: 10, spread: 0, color: '#000000', opacity: 20, inset: false }] },
  { name: 'Soft', shadows: [{ offsetX: 0, offsetY: 10, blur: 40, spread: 0, color: '#000000', opacity: 10, inset: false }] },
  { name: 'Hard', shadows: [{ offsetX: 8, offsetY: 8, blur: 0, spread: 0, color: '#000000', opacity: 30, inset: false }] },
  { name: 'Neon', shadows: [{ offsetX: 0, offsetY: 0, blur: 20, spread: 5, color: '#00ff88', opacity: 80, inset: false }] },
  { name: 'Inset', shadows: [{ offsetX: 4, offsetY: 4, blur: 10, spread: 0, color: '#000000', opacity: 30, inset: true }] },
  { name: 'Layered', shadows: [
    { offsetX: 0, offsetY: 4, blur: 6, spread: -1, color: '#000000', opacity: 10, inset: false },
    { offsetX: 0, offsetY: 10, blur: 15, spread: -3, color: '#000000', opacity: 10, inset: false },
    { offsetX: 0, offsetY: 20, blur: 25, spread: -5, color: '#000000', opacity: 10, inset: false },
  ]},
];

let shadowIdCounter = 1;

export function BoxShadowGeneratorEn() {
  const [shadows, setShadows] = useState<Shadow[]>([
    { id: shadowIdCounter++, offsetX: 4, offsetY: 4, blur: 10, spread: 0, color: '#000000', opacity: 20, inset: false }
  ]);
  const [bgColor, setBgColor] = useState('#f3f4f6');
  const [boxColor, setBoxColor] = useState('#ffffff');
  const [boxSize, setBoxSize] = useState(150);
  const [borderRadius, setBorderRadius] = useState(12);

  const cssValue = useMemo(() => {
    return shadows.map(s => {
      const r = parseInt(s.color.slice(1, 3), 16);
      const g = parseInt(s.color.slice(3, 5), 16);
      const b = parseInt(s.color.slice(5, 7), 16);
      const a = s.opacity / 100;
      return `${s.inset ? 'inset ' : ''}${s.offsetX}px ${s.offsetY}px ${s.blur}px ${s.spread}px rgba(${r}, ${g}, ${b}, ${a})`;
    }).join(', ');
  }, [shadows]);

  const updateShadow = (id: number, key: keyof Shadow, value: number | string | boolean) => {
    setShadows(prev => prev.map(s => s.id === id ? { ...s, [key]: value } : s));
  };

  const addShadow = () => {
    setShadows(prev => [...prev, {
      id: shadowIdCounter++,
      offsetX: 0, offsetY: 4, blur: 10, spread: 0, color: '#000000', opacity: 20, inset: false
    }]);
  };

  const removeShadow = (id: number) => {
    if (shadows.length > 1) {
      setShadows(prev => prev.filter(s => s.id !== id));
    }
  };

  const applyPreset = (preset: typeof presets[0]) => {
    setShadows(preset.shadows.map(s => ({ ...s, id: shadowIdCounter++ })));
  };

  const copyCode = `box-shadow: ${cssValue};`;

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
          <div
            className="flex items-center justify-center min-h-[300px] rounded-lg transition-colors"
            style={{ backgroundColor: bgColor }}
          >
            <div
              style={{
                width: boxSize,
                height: boxSize,
                backgroundColor: boxColor,
                borderRadius: borderRadius,
                boxShadow: cssValue,
                transition: 'all 0.2s ease',
              }}
            />
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400">Background</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="flex-1 text-xs px-2 py-1 border rounded dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400">Box Color</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={boxColor}
                  onChange={(e) => setBoxColor(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={boxColor}
                  onChange={(e) => setBoxColor(e.target.value)}
                  className="flex-1 text-xs px-2 py-1 border rounded dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400">Size</label>
              <input
                type="range"
                min={50}
                max={250}
                value={boxSize}
                onChange={(e) => setBoxSize(Number(e.target.value))}
                className="w-full mt-2"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400">Radius</label>
              <input
                type="range"
                min={0}
                max={75}
                value={borderRadius}
                onChange={(e) => setBorderRadius(Number(e.target.value))}
                className="w-full mt-2"
              />
            </div>
          </div>
        </Card>

        {/* Shadow Settings */}
        <div className="space-y-4">
          {shadows.map((shadow, idx) => (
            <Card key={shadow.id} variant="bordered" className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Shadow {idx + 1}
                </h3>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1 text-xs">
                    <input
                      type="checkbox"
                      checked={shadow.inset}
                      onChange={(e) => updateShadow(shadow.id, 'inset', e.target.checked)}
                      className="w-4 h-4"
                    />
                    Inset
                  </label>
                  {shadows.length > 1 && (
                    <button
                      onClick={() => removeShadow(shadow.id)}
                      className="text-red-500 hover:text-red-600 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">X Offset</label>
                  <input
                    type="range"
                    min={-50}
                    max={50}
                    value={shadow.offsetX}
                    onChange={(e) => updateShadow(shadow.id, 'offsetX', Number(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">{shadow.offsetX}px</span>
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">Y Offset</label>
                  <input
                    type="range"
                    min={-50}
                    max={50}
                    value={shadow.offsetY}
                    onChange={(e) => updateShadow(shadow.id, 'offsetY', Number(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">{shadow.offsetY}px</span>
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">Blur</label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={shadow.blur}
                    onChange={(e) => updateShadow(shadow.id, 'blur', Number(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">{shadow.blur}px</span>
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">Spread</label>
                  <input
                    type="range"
                    min={-20}
                    max={50}
                    value={shadow.spread}
                    onChange={(e) => updateShadow(shadow.id, 'spread', Number(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">{shadow.spread}px</span>
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">Opacity</label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={shadow.opacity}
                    onChange={(e) => updateShadow(shadow.id, 'opacity', Number(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">{shadow.opacity}%</span>
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">Color</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="color"
                      value={shadow.color}
                      onChange={(e) => updateShadow(shadow.id, 'color', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={shadow.color}
                      onChange={(e) => updateShadow(shadow.id, 'color', e.target.value)}
                      className="flex-1 text-xs px-2 py-1 border rounded dark:bg-gray-800 dark:border-gray-700"
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
          <Button variant="secondary" onClick={addShadow} className="w-full">
            + Add Shadow
          </Button>
        </div>
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
          🎨 What is Box Shadow Generator?
        </h2>
        <p className="text-sm leading-relaxed">
          Box Shadow Generator is a visual tool for editing CSS box-shadow properties with real-time preview.
          Adjust X/Y offset, blur, spread, color, and opacity using sliders, and layer multiple shadows together.
          Start quickly with presets like soft, hard, neon, and inset shadows, then customize to match your design.
          Generated CSS code can be instantly copied and applied to your development workflow.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 Shadow Property Guide
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Property</th>
                <th className="text-left py-2 px-2">Description</th>
                <th className="text-left py-2 px-2">Typical Values</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">X Offset</td><td>Horizontal displacement</td><td>-20px to 20px (common)</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Y Offset</td><td>Vertical displacement</td><td>4px to 16px (natural shadow)</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Blur</td><td>Shadow softness</td><td>10px-40px (soft), 0 (hard)</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Spread</td><td>Shadow size adjustment</td><td>Negative: shrink, Positive: expand</td></tr>
              <tr><td className="py-2 px-2 font-medium">Inset</td><td>Inner shadow</td><td>Pressed buttons, input fields</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Shadow Design Tips
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Layered shadows</strong>: Stack multiple shadows for natural depth perception</li>
          <li><strong>Colored shadows</strong>: Use darker versions of element color instead of black</li>
          <li><strong>Soft UI</strong>: Combine light + dark shadows for neumorphism effect</li>
          <li><strong>Hover effects</strong>: Increase Y offset and blur to create floating appearance</li>
          <li><strong>Performance</strong>: Large blur values can be expensive to render on mobile</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Why use multiple shadows?',
            answer: 'A single shadow looks flat. Layering multiple shadows combines a close shadow (small, dark) with a distant shadow (large, blurry) to create natural depth perception.',
          },
          {
            question: 'What happens with negative spread?',
            answer: 'The shadow becomes smaller than the element. Use this to show shadow only directly below an element or to make shadows appear only in specific directions.',
          },
          {
            question: 'When should I use inset shadows?',
            answer: 'Use inset shadows for pressed button states, inner borders on input fields, and recessed card areas. It gives the feeling that the element is pushed inward.',
          },
        ]}
      />
    </div>
  );
}
