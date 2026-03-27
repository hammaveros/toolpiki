'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { Input } from '@/components/ui/Input';
import { FaqSection } from '@/components/ui/FaqItem';

interface ColorStop {
  color: string;
  position: number;
}

type GradientType = 'linear' | 'radial' | 'conic';

export function GradientGeneratorEn() {
  const [gradientType, setGradientType] = useState<GradientType>('linear');
  const [angle, setAngle] = useState(90);
  const [colorStops, setColorStops] = useState<ColorStop[]>([
    { color: '#3b82f6', position: 0 },
    { color: '#8b5cf6', position: 100 },
  ]);

  const addColorStop = () => {
    const lastPos = colorStops[colorStops.length - 1]?.position || 0;
    const newPos = Math.min(lastPos + 20, 100);
    setColorStops([...colorStops, { color: '#10b981', position: newPos }]);
  };

  const removeColorStop = (index: number) => {
    if (colorStops.length <= 2) return;
    setColorStops(colorStops.filter((_, i) => i !== index));
  };

  const updateColorStop = (index: number, updates: Partial<ColorStop>) => {
    setColorStops(colorStops.map((stop, i) =>
      i === index ? { ...stop, ...updates } : stop
    ));
  };

  const generateCss = (): string => {
    const stops = [...colorStops]
      .sort((a, b) => a.position - b.position)
      .map((stop) => `${stop.color} ${stop.position}%`)
      .join(', ');

    switch (gradientType) {
      case 'linear':
        return `linear-gradient(${angle}deg, ${stops})`;
      case 'radial':
        return `radial-gradient(circle, ${stops})`;
      case 'conic':
        return `conic-gradient(from ${angle}deg, ${stops})`;
    }
  };

  const generateFullCss = (): string => {
    return `background: ${generateCss()};`;
  };

  const generateRandom = () => {
    const randomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    setColorStops([
      { color: randomColor(), position: 0 },
      { color: randomColor(), position: 100 },
    ]);
    setAngle(Math.floor(Math.random() * 360));
  };

  const presets = [
    { name: 'Sunrise', stops: [{ color: '#ff512f', position: 0 }, { color: '#f09819', position: 100 }] },
    { name: 'Ocean', stops: [{ color: '#2193b0', position: 0 }, { color: '#6dd5ed', position: 100 }] },
    { name: 'Purple', stops: [{ color: '#834d9b', position: 0 }, { color: '#d04ed6', position: 100 }] },
    { name: 'Forest', stops: [{ color: '#11998e', position: 0 }, { color: '#38ef7d', position: 100 }] },
    { name: 'Night Sky', stops: [{ color: '#0f0c29', position: 0 }, { color: '#302b63', position: 50 }, { color: '#24243e', position: 100 }] },
  ];

  return (
    <div className="space-y-2">
      {/* Preview */}
      <div
        className="h-32 rounded-lg shadow-inner"
        style={{ background: generateCss() }}
      />

      {/* Gradient type & Angle */}
      <Card variant="bordered" className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
              Type
            </label>
            <div className="flex gap-1 flex-wrap">
              {(['linear', 'radial', 'conic'] as GradientType[]).map((type) => (
                <Button
                  key={type}
                  variant={gradientType === type ? 'primary' : 'secondary'}
                  onClick={() => setGradientType(type)}
                >
                  {type === 'linear' ? 'Linear' : type === 'radial' ? 'Radial' : 'Conic'}
                </Button>
              ))}
            </div>
          </div>

          {(gradientType === 'linear' || gradientType === 'conic') && (
            <div className="flex items-center gap-2 flex-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                Angle
              </label>
              <div className="flex gap-1 flex-wrap">
                {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
                  <Button
                    key={a}
                    variant={angle === a ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setAngle(a)}
                  >
                    {a}°
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Color stops */}
      <Card variant="bordered" className="p-4">
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Colors ({colorStops.length})
          </label>
          <Button variant="secondary" size="sm" onClick={addColorStop}>
            + Add Color
          </Button>
        </div>

        <div className="space-y-3">
          {colorStops.map((stop, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="color"
                value={stop.color}
                onChange={(e) => updateColorStop(index, { color: e.target.value })}
                className="w-10 h-10 rounded cursor-pointer"
              />
              <Input
                value={stop.color}
                onChange={(e) => updateColorStop(index, { color: e.target.value })}
                className="w-24 font-mono text-sm"
              />
              <Input
                type="number"
                min="0"
                max="100"
                value={stop.position}
                onChange={(e) => updateColorStop(index, { position: Number(e.target.value) })}
                className="w-20 text-sm"
              />
              <span className="text-sm text-gray-500">%</span>
              {colorStops.length > 2 && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => removeColorStop(index)}
                >
                  ✕
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Presets */}
      <Card variant="bordered" className="p-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Presets
        </label>
        <div className="flex gap-2 flex-wrap">
          {presets.map((preset) => (
            <button
              key={preset.name}
              className="px-3 py-2 rounded text-sm text-white"
              style={{
                background: `linear-gradient(90deg, ${preset.stops.map(s => `${s.color} ${s.position}%`).join(', ')})`,
              }}
              onClick={() => setColorStops(preset.stops)}
            >
              {preset.name}
            </button>
          ))}
          <Button variant="secondary" size="sm" onClick={generateRandom}>
            Random
          </Button>
        </div>
      </Card>

      {/* CSS output */}
      <Card variant="bordered" className="p-4">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            CSS Code
          </label>
          <CopyButton text={generateFullCss()} />
        </div>
        <pre className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded font-mono overflow-x-auto">
          {generateFullCss()}
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
          🌈 What is Gradient Generator?
        </h2>
        <p className="text-sm leading-relaxed">
          Gradient Generator creates CSS gradients visually with an intuitive interface.
          Supports three types: linear, radial, and conic gradients.
          Freely adjust colors, angles, and positions to create stunning background effects.
          Copy the generated CSS code to apply directly to your website.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 Gradient Types
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Type</th>
                <th className="text-left py-2 px-2">Description</th>
                <th className="text-left py-2 px-2">Use Cases</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Linear</td><td>Straight line transition</td><td>Buttons, banner backgrounds</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Radial</td><td>Center to edges</td><td>Spotlight, highlight effects</td></tr>
              <tr><td className="py-2 px-2 font-medium">Conic</td><td>Rotational color sweep</td><td>Progress rings, color wheels</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Gradient Design Tips
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Adjacent colors</strong>: Colors close on the color wheel blend naturally</li>
          <li><strong>Brightness contrast</strong>: Light to dark creates depth perception</li>
          <li><strong>Multiple stops</strong>: 3+ colors create richer gradients</li>
          <li><strong>Position control</strong>: Adjust stop positions (%) to control transition speed</li>
          <li><strong>Angle variety</strong>: Diagonal angles (45°, 135°) add dynamic feel</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'How many colors can I add to a gradient?',
            answer: 'CSS gradients have no limit, but 2-4 colors usually look best. Too many can appear cluttered.',
          },
          {
            question: 'What if gradients do not show in older browsers?',
            answer: 'Add a fallback solid color first in your CSS. Example: background: #3b82f6; then the gradient on the next line.',
          },
          {
            question: 'How do I create transparent gradients?',
            answer: 'Use rgba() or transparent instead of solid colors. Example: transparent → #3b82f6 for a fade-in effect.',
          },
        ]}
      />
    </div>
  );
}
