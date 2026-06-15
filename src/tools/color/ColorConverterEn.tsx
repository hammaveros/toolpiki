'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';
import {
  parseColor,
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  rgbToHsv,
  rgbToCmyk,
  bestTextColor,
  wcag,
  harmony,
  lightnessScale,
  nearestNamedColor,
} from '@/lib/color';

export function ColorConverterEn() {
  const [hex, setHex] = useState('#3B82F6');
  const [text, setText] = useState('#3B82F6');

  // Shared link (?c=ff5733 / ?hex=...) opens that color
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get('c') || params.get('hex') || params.get('color');
    if (raw) {
      const rgb = parseColor(raw);
      if (rgb) {
        const h = rgbToHex(rgb.r, rgb.g, rgb.b);
        setHex(h);
        setText(h);
      }
    }
  }, []);

  const setColor = useCallback((newHex: string) => {
    setHex(newHex);
    setText(newHex);
  }, []);

  const handleText = (v: string) => {
    setText(v);
    const rgb = parseColor(v);
    if (rgb) setHex(rgbToHex(rgb.r, rgb.g, rgb.b));
  };

  const invalid = text.trim() !== '' && parseColor(text) === null;

  const data = useMemo(() => {
    const rgb = hexToRgb(hex);
    if (!rgb) return null;
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
    const textColor = bestTextColor(rgb);
    return {
      rgb,
      hsl,
      hsv,
      cmyk,
      textColor,
      whiteWcag: wcag({ r: 255, g: 255, b: 255 }, rgb),
      blackWcag: wcag({ r: 0, g: 0, b: 0 }, rgb),
      harmony: harmony(rgb),
      scale: lightnessScale(rgb, 10),
      nearest: nearestNamedColor(rgb),
      hexStr: hex.toUpperCase(),
      rgbStr: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      rgbaStr: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`,
      hslStr: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      hsvStr: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`,
      cmykStr: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`,
    };
  }, [hex]);

  const handleRgbChange = (key: 'r' | 'g' | 'b', value: number) => {
    if (!data) return;
    const newRgb = { ...data.rgb, [key]: value };
    setColor(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  };

  return (
    <div className="space-y-2">
      {/* Preview + input */}
      <Card variant="bordered" className="p-6">
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          <div
            className="w-32 h-32 rounded-xl shadow-lg border-4 border-white dark:border-gray-700 flex items-center justify-center text-sm font-mono font-semibold flex-shrink-0"
            style={{ backgroundColor: hex, color: data?.textColor }}
          >
            {data?.hexStr}
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enter a color (HEX · RGB · HSL · name)
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={hex}
                onChange={(e) => setColor(e.target.value)}
                className="w-12 h-12 rounded cursor-pointer flex-shrink-0"
                aria-label="Color picker"
              />
              <Input
                value={text}
                onChange={(e) => handleText(e.target.value)}
                placeholder="#3B82F6, rgb(59,130,246), hsl(217,91%,60%), tomato"
                className={`font-mono ${invalid ? 'border-red-400 focus:ring-red-400' : ''}`}
              />
            </div>
            {invalid ? (
              <p className="mt-1 text-xs text-red-500">Could not parse that color. Try #3B82F6 · rgb(59,130,246) · hsl(217,91%,60%)</p>
            ) : (
              data && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Closest color name: <span className="font-medium text-gray-700 dark:text-gray-300">{data.nearest.name}</span>{' '}
                  ({data.nearest.hex})
                </p>
              )
            )}
          </div>
        </div>
      </Card>

      {/* RGB sliders */}
      {data && (
        <Card variant="bordered" className="p-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">RGB Adjustment</p>
          <div className="space-y-4">
            {(['r', 'g', 'b'] as const).map((channel) => (
              <div key={channel} className="flex items-center gap-4">
                <span className="w-8 text-sm font-medium text-gray-500 uppercase">{channel}</span>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={data.rgb[channel]}
                  onChange={(e) => handleRgbChange(channel, Number(e.target.value))}
                  className="flex-1"
                  style={{ accentColor: channel === 'r' ? 'red' : channel === 'g' ? 'green' : 'blue' }}
                />
                <span className="w-10 text-sm text-gray-600 dark:text-gray-400 text-right">{data.rgb[channel]}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Conversions */}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ColorValueCard label="HEX" value={data.hexStr} />
          <ColorValueCard label="RGB" value={data.rgbStr} />
          <ColorValueCard label="HSL" value={data.hslStr} />
          <ColorValueCard label="HSV" value={data.hsvStr} />
          <ColorValueCard label="CMYK" value={data.cmykStr} />
          <ColorValueCard label="RGBA" value={data.rgbaStr} />
        </div>
      )}

      {/* Contrast + WCAG */}
      {data && (
        <Card variant="bordered" className="p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Contrast · WCAG ratio</p>
            <Link href="/en/tools/contrast-checker-en" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
              Check two colors →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ContrastRow bg={hex} fg="#FFFFFF" label="White text" w={data.whiteWcag} />
            <ContrastRow bg={hex} fg="#000000" label="Black text" w={data.blackWcag} />
          </div>
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            {data.textColor === '#FFFFFF' ? 'White' : 'Black'} text is easier to read on this background.
          </p>
        </Card>
      )}

      {/* Harmony */}
      {data && (
        <Card variant="bordered" className="p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Color harmony</p>
            <Link href="/en/tools/palette-generator-en" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
              Build a palette →
            </Link>
          </div>
          <div className="space-y-3">
            <SwatchRow label="Complement" hexes={[data.harmony.complementary]} onPick={setColor} />
            <SwatchRow label="Analogous" hexes={data.harmony.analogous} onPick={setColor} />
            <SwatchRow label="Triadic" hexes={data.harmony.triadic} onPick={setColor} />
          </div>
        </Card>
      )}

      {/* Lightness scale */}
      {data && (
        <Card variant="bordered" className="p-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Lightness scale (light → dark)</p>
          <div className="flex rounded-lg overflow-hidden">
            {data.scale.map((s) => (
              <button
                key={s.l}
                onClick={() => setColor(s.hex)}
                className="flex-1 h-12"
                style={{ backgroundColor: s.hex }}
                title={`${s.hex} (L ${s.l}%)`}
                aria-label={`Select ${s.hex}`}
              />
            ))}
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Click any swatch to use that value.</p>
        </Card>
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

function ContrastRow({ bg, fg, label, w }: { bg: string; fg: string; label: string; w: { ratio: number; aaNormal: boolean; aaLarge: boolean; aaaNormal: boolean } }) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="h-12 flex items-center justify-center text-sm font-medium" style={{ backgroundColor: bg, color: fg }}>
        {label} sample
      </div>
      <div className="p-2 flex items-center justify-between text-xs">
        <span className="font-mono text-gray-700 dark:text-gray-300">{w.ratio}:1</span>
        <span className="flex gap-1">
          <Badge ok={w.aaLarge}>AA Large</Badge>
          <Badge ok={w.aaNormal}>AA</Badge>
          <Badge ok={w.aaaNormal}>AAA</Badge>
        </span>
      </div>
    </div>
  );
}

function Badge({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <span
      className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
        ok
          ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
          : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
      }`}
    >
      {ok ? '✓' : '✕'} {children}
    </span>
  );
}

function SwatchRow({ label, hexes, onPick }: { label: string; hexes: string[]; onPick: (hex: string) => void }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">{label}</span>
      <div className="flex gap-2 flex-wrap">
        {hexes.map((h) => (
          <button
            key={h}
            onClick={() => onPick(h)}
            className="flex items-center gap-1.5 rounded-md border border-gray-200 dark:border-gray-700 pr-2 hover:shadow-sm transition"
            title={`Select ${h}`}
          >
            <span className="w-7 h-7 rounded-l-md" style={{ backgroundColor: h }} />
            <span className="font-mono text-xs text-gray-700 dark:text-gray-300">{h}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">🎨 All-in-one Color Tool</h2>
        <p className="text-sm leading-relaxed">
          Convert between <strong>HEX, RGB, HSL, HSV, and CMYK</strong>, and instantly see the color&apos;s{' '}
          <strong>contrast (WCAG ratio)</strong>, <strong>complementary / analogous / triadic</strong> harmony,
          a <strong>lightness scale</strong>, and the closest <strong>CSS named color</strong>. Paste any format —{' '}
          <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">rgb(59,130,246)</code>,
          <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono ml-1">hsl(217,91%,60%)</code>, or a name like
          <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono ml-1">tomato</code>.
        </p>
        <div className="mt-4 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900 p-4 text-sm">
          <p className="font-semibold text-purple-900 dark:text-purple-200 mb-1">🔗 Share tip</p>
          <p className="text-purple-800 dark:text-purple-300">
            Append <code className="px-1 py-0.5 rounded bg-white/60 dark:bg-gray-800 text-xs font-mono">?c=ff5733</code> to the URL to open the page on that exact color.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">📋 Color Format Comparison</h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Format</th>
                <th className="text-left py-2 px-2">Example</th>
                <th className="text-left py-2 px-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">HEX</td><td className="font-mono">#3B82F6</td><td>Most common on the web</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">RGB</td><td className="font-mono">rgb(59, 130, 246)</td><td>Red/Green/Blue mix</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">HSL</td><td className="font-mono">hsl(217, 91%, 60%)</td><td>Hue/Saturation/Lightness</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">HSV</td><td className="font-mono">hsv(217, 76%, 96%)</td><td>Used in design tools</td></tr>
              <tr><td className="py-2 px-2 font-medium">CMYK</td><td className="font-mono">cmyk(76%, 47%, 0%, 4%)</td><td>Print ink model</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">🔬 Why contrast matters</h2>
        <p className="text-sm leading-relaxed">
          Low <strong>contrast ratio</strong> between text and background hurts readability for everyone, not just
          low-vision users. The <strong>WCAG</strong> guidelines recommend <strong>4.5:1 (AA)</strong> for body text,
          <strong> 3:1</strong> for large text, and <strong>7:1 (AAA)</strong> for the strictest level. This tool puts your
          color in the background and computes the ratio for white and black text so you can see which passes.
        </p>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          { question: 'Can I paste rgb() or hsl() values directly?', answer: 'Yes. Besides HEX, you can paste rgb(59,130,246), hsl(217,91%,60%), or a CSS name like tomato, and it is parsed automatically into every format.' },
          { question: 'How is the recommended text color chosen?', answer: 'Your color is treated as the background, and the WCAG contrast ratio is computed for both white and black text. The higher one is recommended, and AA (4.5:1) / AAA (7:1) pass states are shown.' },
          { question: 'CMYK looks different in print.', answer: 'CMYK is an ink-based model and does not map perfectly to screen (RGB). Actual print depends on paper and color profile, so treat the converted value as a reference.' },
          { question: 'Can I share a link to a specific color?', answer: 'Append ?c=ff5733 to the URL and the page opens with that color selected — handy for sharing in blogs or chat.' },
        ]}
      />
    </div>
  );
}
