'use client';

import { useState, useMemo, useCallback } from 'react';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface HSL {
  h: number;
  s: number;
  l: number;
}

export function ColorConverterEn() {
  const [hex, setHex] = useState('#3B82F6');

  const hexToRgb = useCallback((hex: string): RGB | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }, []);

  const rgbToHex = useCallback((r: number, g: number, b: number): string => {
    return (
      '#' +
      [r, g, b]
        .map((x) => {
          const hex = Math.max(0, Math.min(255, x)).toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        })
        .join('')
        .toUpperCase()
    );
  }, []);

  const rgbToHsl = useCallback((r: number, g: number, b: number): HSL => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  }, []);

  const colors = useMemo(() => {
    const rgb = hexToRgb(hex);
    if (!rgb) return null;

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

    return {
      hex: hex.toUpperCase(),
      rgb,
      hsl,
      rgbString: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      hslString: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      rgbaString: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`,
    };
  }, [hex, hexToRgb, rgbToHsl]);

  const handleRgbChange = (key: 'r' | 'g' | 'b', value: number) => {
    if (!colors) return;
    const newRgb = { ...colors.rgb, [key]: value };
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  };

  return (
    <div className="space-y-2">
      {/* Color preview */}
      <Card variant="bordered" className="p-6">
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          <div
            className="w-32 h-32 rounded-xl shadow-lg border-4 border-white dark:border-gray-700"
            style={{ backgroundColor: hex }}
          />
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              HEX Color Code
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                className="w-12 h-12 rounded cursor-pointer"
              />
              <Input
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                placeholder="#000000"
                className="font-mono"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* RGB sliders */}
      {colors && (
        <Card variant="bordered" className="p-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            RGB Adjustment
          </p>
          <div className="space-y-4">
            {(['r', 'g', 'b'] as const).map((channel) => (
              <div key={channel} className="flex items-center gap-4">
                <span className="w-8 text-sm font-medium text-gray-500 uppercase">
                  {channel}
                </span>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={colors.rgb[channel]}
                  onChange={(e) => handleRgbChange(channel, Number(e.target.value))}
                  className="flex-1"
                  style={{
                    accentColor:
                      channel === 'r' ? 'red' : channel === 'g' ? 'green' : 'blue',
                  }}
                />
                <span className="w-10 text-sm text-gray-600 dark:text-gray-400 text-right">
                  {colors.rgb[channel]}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Conversion results */}
      {colors && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ColorValueCard label="HEX" value={colors.hex} />
          <ColorValueCard label="RGB" value={colors.rgbString} />
          <ColorValueCard label="HSL" value={colors.hslString} />
          <ColorValueCard label="RGBA" value={colors.rgbaString} />
        </div>
      )}

      <SeoContent />
    </div>
  );
}

function ColorValueCard({ label, value }: { label: string; value: string }) {
  return (
    <Card variant="bordered" className="p-3">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
          <p className="font-mono text-sm text-gray-900 dark:text-white">{value}</p>
        </div>
        <CopyButton text={value} size="sm" />
      </div>
    </Card>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🎨 What is Color Code Converter?
        </h2>
        <p className="text-sm leading-relaxed">
          Color Code Converter transforms colors between HEX, RGB, HSL, and other formats instantly.
          Pick colors visually with the color picker or fine-tune with RGB sliders.
          Essential for web development, graphic design, and UI/UX work where different color formats are needed.
          Copy converted values with a single click for immediate use in your projects.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 Color Format Comparison
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Format</th>
                <th className="text-left py-2 px-2">Example</th>
                <th className="text-left py-2 px-2">Features</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">HEX</td><td className="font-mono">#3B82F6</td><td>Most common on web</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">RGB</td><td className="font-mono">rgb(59, 130, 246)</td><td>Red/Green/Blue mix</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">HSL</td><td className="font-mono">hsl(217, 91%, 60%)</td><td>Hue/Saturation/Lightness</td></tr>
              <tr><td className="py-2 px-2 font-medium">RGBA</td><td className="font-mono">rgba(59, 130, 246, 1)</td><td>Includes transparency</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 When to Use Each Format
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>HEX</strong>: Most widely used in CSS/HTML, compact notation</li>
          <li><strong>RGB</strong>: Intuitive for programmatic color manipulation</li>
          <li><strong>HSL</strong>: Easy to create color variations by adjusting lightness</li>
          <li><strong>RGBA</strong>: Use for overlays, shadows needing transparency</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Is the # symbol required in HEX codes?',
            answer: 'In CSS, the # symbol is required. Some graphic software uses HEX without #. This tool accepts both formats.',
          },
          {
            question: 'What makes HSL better than RGB?',
            answer: 'HSL uses Hue, Saturation, and Lightness, making it intuitive. Easy to create lighter/darker variations of the same hue.',
          },
          {
            question: 'How do I create transparent colors?',
            answer: 'Use RGBA format and adjust the last value (alpha) between 0-1. 0 is fully transparent, 1 is fully opaque.',
          },
        ]}
      />
    </div>
  );
}
