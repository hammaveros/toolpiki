'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { Input } from '@/components/ui/Input';
import { FaqSection } from '@/components/ui/FaqItem';

interface Color {
  hex: string;
  rgb: { r: number; g: number; b: number };
}

type PaletteType = 'complementary' | 'analogous' | 'triadic' | 'tetradic' | 'monochromatic';

export function PaletteGeneratorEn() {
  const [baseColor, setBaseColor] = useState('#3b82f6');
  const [paletteType, setPaletteType] = useState<PaletteType>('complementary');
  const [palette, setPalette] = useState<Color[]>([]);

  const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  const hslToHex = (h: number, s: number, l: number): string => {
    h = ((h % 360) + 360) % 360;
    s = Math.max(0, Math.min(100, s)) / 100;
    l = Math.max(0, Math.min(100, l)) / 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;

    let r = 0, g = 0, b = 0;

    if (h < 60) { r = c; g = x; }
    else if (h < 120) { r = x; g = c; }
    else if (h < 180) { g = c; b = x; }
    else if (h < 240) { g = x; b = c; }
    else if (h < 300) { r = x; b = c; }
    else { r = c; b = x; }

    const toHex = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
  };

  const hexToRgb = (hex: string): { r: number; g: number; b: number } => ({
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  });

  const generatePalette = useCallback(() => {
    const hsl = hexToHsl(baseColor);
    const colors: Color[] = [];

    const addColor = (h: number, s: number, l: number) => {
      const hex = hslToHex(h, s, l);
      colors.push({ hex, rgb: hexToRgb(hex) });
    };

    switch (paletteType) {
      case 'complementary':
        addColor(hsl.h, hsl.s, hsl.l);
        addColor(hsl.h + 180, hsl.s, hsl.l);
        addColor(hsl.h, hsl.s, Math.max(hsl.l - 20, 10));
        addColor(hsl.h + 180, hsl.s, Math.min(hsl.l + 20, 90));
        addColor(hsl.h, hsl.s * 0.5, hsl.l);
        break;

      case 'analogous':
        addColor(hsl.h - 30, hsl.s, hsl.l);
        addColor(hsl.h - 15, hsl.s, hsl.l);
        addColor(hsl.h, hsl.s, hsl.l);
        addColor(hsl.h + 15, hsl.s, hsl.l);
        addColor(hsl.h + 30, hsl.s, hsl.l);
        break;

      case 'triadic':
        addColor(hsl.h, hsl.s, hsl.l);
        addColor(hsl.h + 120, hsl.s, hsl.l);
        addColor(hsl.h + 240, hsl.s, hsl.l);
        addColor(hsl.h, hsl.s, Math.max(hsl.l - 15, 10));
        addColor(hsl.h, hsl.s, Math.min(hsl.l + 15, 90));
        break;

      case 'tetradic':
        addColor(hsl.h, hsl.s, hsl.l);
        addColor(hsl.h + 90, hsl.s, hsl.l);
        addColor(hsl.h + 180, hsl.s, hsl.l);
        addColor(hsl.h + 270, hsl.s, hsl.l);
        break;

      case 'monochromatic':
        addColor(hsl.h, hsl.s, 90);
        addColor(hsl.h, hsl.s, 70);
        addColor(hsl.h, hsl.s, hsl.l);
        addColor(hsl.h, hsl.s, 30);
        addColor(hsl.h, hsl.s, 10);
        break;
    }

    setPalette(colors);
  }, [baseColor, paletteType]);

  const generateRandom = () => {
    const randomHex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    setBaseColor(randomHex.toUpperCase());
  };

  const exportCss = (): string => {
    return palette.map((color, i) => `--color-${i + 1}: ${color.hex};`).join('\n');
  };

  const paletteTypes: { value: PaletteType; label: string; desc: string }[] = [
    { value: 'complementary', label: 'Complement', desc: 'Opposite colors' },
    { value: 'analogous', label: 'Analogous', desc: 'Adjacent colors' },
    { value: 'triadic', label: 'Triadic', desc: '120° spacing' },
    { value: 'tetradic', label: 'Tetradic', desc: '90° spacing' },
    { value: 'monochromatic', label: 'Mono', desc: 'Same hue' },
  ];

  return (
    <div className="space-y-2">
      <Card variant="bordered" className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Base Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value.toUpperCase())}
                className="w-12 h-10 rounded cursor-pointer"
              />
              <Input
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value.toUpperCase())}
                className="font-mono flex-1"
              />
              <Button variant="secondary" onClick={generateRandom}>
                Random
              </Button>
              <Button onClick={generatePalette}>Generate</Button>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Palette Type
          </label>
          <div className="flex gap-1 flex-wrap">
            {paletteTypes.map(({ value, label, desc }) => (
              <Button
                key={value}
                variant={paletteType === value ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setPaletteType(value)}
                title={desc}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {palette.length > 0 && (
        <>
          <div className="flex rounded-lg overflow-hidden h-24">
            {palette.map((color, i) => (
              <div
                key={i}
                className="flex-1 group relative cursor-pointer"
                style={{ backgroundColor: color.hex }}
                onClick={() => navigator.clipboard.writeText(color.hex)}
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 transition-opacity">
                  <span className="text-white text-sm font-mono">{color.hex}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {palette.map((color, i) => (
              <Card key={i} variant="bordered" className="p-3">
                <div
                  className="w-full h-12 rounded mb-2"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-mono text-sm">{color.hex}</p>
                    <p className="text-xs text-gray-500">
                      rgb({color.rgb.r}, {color.rgb.g}, {color.rgb.b})
                    </p>
                  </div>
                  <CopyButton text={color.hex} size="sm" />
                </div>
              </Card>
            ))}
          </div>

          <Card variant="bordered" className="p-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                CSS Variables
              </label>
              <CopyButton text={exportCss()} />
            </div>
            <pre className="text-xs bg-gray-50 dark:bg-gray-800 p-3 rounded font-mono">
              {exportCss()}
            </pre>
          </Card>
        </>
      )}

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🎨 What is Palette Generator?
        </h2>
        <p className="text-sm leading-relaxed">
          Palette Generator automatically creates harmonious color palettes based on color theory from a single base color.
          It supports five color harmony types: complementary, analogous, triadic, tetradic, and monochromatic, each based on relationships on the color wheel.
          Generated palettes are provided as HEX/RGB codes with direct CSS variable export capability.
          Perfect for web design, brand color systems, UI themes, and illustration work.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 Color Harmony Theory
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Harmony Type</th>
                <th className="text-left py-2 px-2">Color Wheel</th>
                <th className="text-left py-2 px-2">Characteristics</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Complementary</td><td>180° opposite</td><td>High contrast, eye-catching</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Analogous</td><td>30° adjacent</td><td>Natural and harmonious</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Triadic</td><td>120° apart</td><td>Balanced diversity</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Tetradic</td><td>90° apart</td><td>Rich and bold</td></tr>
              <tr><td className="py-2 px-2 font-medium">Monochromatic</td><td>Same hue</td><td>Unified, sophisticated</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Palette Usage Tips
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>60-30-10 rule</strong>: Primary 60%, secondary 30%, accent 10%</li>
          <li><strong>Brand colors</strong>: Complementary or triadic for memorable combinations</li>
          <li><strong>UI design</strong>: Monochromatic for consistent themes</li>
          <li><strong>Check contrast</strong>: Verify text/background contrast for accessibility</li>
          <li><strong>Consider context</strong>: Adjust colors based on medium (web/print/video)</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Which palette type should I choose?',
            answer: 'It depends on your goal. For bold impressions use complementary, for soft natural feels use analogous, for balanced variety use triadic, and for sophisticated unity use monochromatic.',
          },
          {
            question: 'Why might generated colors differ slightly from the original?',
            answer: 'Rounding occurs when converting from HSL calculations to HEX values. Additionally, monitor color profiles can cause colors to appear differently.',
          },
          {
            question: 'How do I use the CSS variables?',
            answer: 'Declare variables in :root and use them as var(--color-1). In Tailwind, add them to extend colors and use classes like bg-color-1.',
          },
        ]}
      />
    </div>
  );
}
