'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { Input } from '@/components/ui/Input';
import { FaqSection } from '@/components/ui/FaqItem';

export function ColorBlenderEn() {
  const [color1, setColor1] = useState('#3b82f6');
  const [color2, setColor2] = useState('#ef4444');
  const [steps, setSteps] = useState(5);

  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b]
      .map((x) => Math.round(x).toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();
  };

  const blendedColors = useMemo(() => {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    const colors: string[] = [];

    for (let i = 0; i <= steps + 1; i++) {
      const ratio = i / (steps + 1);
      const r = rgb1.r + (rgb2.r - rgb1.r) * ratio;
      const g = rgb1.g + (rgb2.g - rgb1.g) * ratio;
      const b = rgb1.b + (rgb2.b - rgb1.b) * ratio;
      colors.push(rgbToHex(r, g, b));
    }

    return colors;
  }, [color1, color2, steps]);

  const midpointColor = useMemo(() => {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    const r = (rgb1.r + rgb2.r) / 2;
    const g = (rgb1.g + rgb2.g) / 2;
    const b = (rgb1.b + rgb2.b) / 2;
    return rgbToHex(r, g, b);
  }, [color1, color2]);

  const swapColors = () => {
    const temp = color1;
    setColor1(color2);
    setColor2(temp);
  };

  return (
    <div className="space-y-2">
      {/* Color selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card variant="bordered" className="p-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Color 1
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={color1}
              onChange={(e) => setColor1(e.target.value.toUpperCase())}
              className="w-12 h-10 rounded cursor-pointer"
            />
            <Input
              value={color1}
              onChange={(e) => setColor1(e.target.value.toUpperCase())}
              className="font-mono"
            />
          </div>
        </Card>

        <Card variant="bordered" className="p-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Color 2
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={color2}
              onChange={(e) => setColor2(e.target.value.toUpperCase())}
              className="w-12 h-10 rounded cursor-pointer"
            />
            <Input
              value={color2}
              onChange={(e) => setColor2(e.target.value.toUpperCase())}
              className="font-mono"
            />
          </div>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="secondary" onClick={swapColors}>
          Swap Colors
        </Button>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">Steps:</label>
          <Input
            type="number"
            min={1}
            max={20}
            value={steps}
            onChange={(e) => setSteps(Math.max(1, Math.min(20, Number(e.target.value))))}
            className="w-20"
          />
        </div>
      </div>

      {/* Midpoint */}
      <Card variant="bordered" className="p-4 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Midpoint Color</p>
        <div className="flex justify-center items-center gap-4">
          <div
            className="w-24 h-24 rounded-lg shadow"
            style={{ backgroundColor: midpointColor }}
          />
          <div>
            <p className="font-mono text-xl font-medium">{midpointColor}</p>
            <CopyButton text={midpointColor} />
          </div>
        </div>
      </Card>

      {/* Blending result */}
      <Card variant="bordered" className="p-4">
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Blending Result ({blendedColors.length} colors)
          </label>
          <CopyButton
            text={blendedColors.join(', ')}
            label="Copy All"
          />
        </div>

        <div className="flex rounded overflow-hidden h-20 mb-4">
          {blendedColors.map((color, index) => (
            <div
              key={index}
              className="flex-1 group relative cursor-pointer"
              style={{ backgroundColor: color }}
              onClick={() => navigator.clipboard.writeText(color)}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 transition-opacity">
                <span className="text-white text-xs font-mono">{color}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {blendedColors.map((color, index) => (
            <div key={index} className="text-center">
              <div
                className="w-full h-10 rounded mb-1"
                style={{ backgroundColor: color }}
              />
              <p className="text-xs font-mono text-gray-500 truncate">{color}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* CSS variables */}
      <Card variant="bordered" className="p-4">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            CSS Variables
          </label>
          <CopyButton
            text={blendedColors.map((c, i) => `--blend-${i}: ${c};`).join('\n')}
          />
        </div>
        <pre className="text-xs bg-gray-50 dark:bg-gray-800 p-3 rounded font-mono overflow-x-auto">
          {blendedColors.map((c, i) => `--blend-${i}: ${c};`).join('\n')}
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
          🎨 What is Color Blender?
        </h2>
        <p className="text-sm leading-relaxed">
          Color Blender automatically generates intermediate colors between two selected colors.
          Choose a start and end color, specify the number of steps, and get a smooth color sequence.
          Perfect for gradient design, color palette creation, UI theme development, and data visualization.
          All generated colors are provided as HEX codes with CSS variable output ready for copy-paste.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 Blending Methods Comparison
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Method</th>
                <th className="text-left py-2 px-2">Description</th>
                <th className="text-left py-2 px-2">Characteristics</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">RGB Linear</td><td>Linear interpolation of R, G, B channels</td><td>Most basic, may darken in the middle</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">HSL</td><td>Interpolates hue, saturation, lightness</td><td>Natural color transitions</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">LAB</td><td>Interpolates in perceptual color space</td><td>Perceptually uniform changes</td></tr>
              <tr><td className="py-2 px-2 font-medium">HCL</td><td>Hue-chroma-luminance cylindrical</td><td>Maintains vibrancy, design-friendly</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Color Blending Tips
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Brand color expansion</strong>: Generate lighter/darker variations from your primary color</li>
          <li><strong>Data visualization</strong>: Create smooth color ranges for charts and graphs</li>
          <li><strong>Hover effects</strong>: Generate base/hover state colors for buttons</li>
          <li><strong>Theme scales</strong>: Build consistent scales from primary-100 to primary-900</li>
          <li><strong>Gradient backgrounds</strong>: Add intermediate colors to CSS gradients for smoother effects</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Why do blended colors look darker in the middle?',
            answer: 'RGB linear interpolation averages each channel, so complementary colors (like red-cyan) blend toward gray. To avoid this, use HSL or LAB interpolation methods instead.',
          },
          {
            question: 'How many steps should I use?',
            answer: 'It depends on your use case. Button hover effects need 2-3 steps, color palettes work well with 5-9 steps, and data visualization legends typically use 7-11 steps.',
          },
          {
            question: 'How do I use the CSS variables?',
            answer: 'Declare them in :root as --blend-0, --blend-1, etc., then use var(--blend-3) in your styles. In Tailwind, extend colors to register them and use classes like bg-blend-3.',
          },
        ]}
      />
    </div>
  );
}
