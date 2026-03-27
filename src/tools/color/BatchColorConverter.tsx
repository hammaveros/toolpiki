'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import { FaqSection } from '@/components/ui/FaqItem';

type OutputFormat = 'hex' | 'rgb' | 'hsl' | 'all';

interface ColorResult {
  original: string;
  hex: string;
  rgb: string;
  hsl: string;
  valid: boolean;
}

// HEX to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    // 3자리 HEX
    const short = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(hex);
    if (short) {
      return {
        r: parseInt(short[1] + short[1], 16),
        g: parseInt(short[2] + short[2], 16),
        b: parseInt(short[3] + short[3], 16),
      };
    }
    return null;
  }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

// RGB to HSL
function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
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
}

// RGB to HEX
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
}

// Parse RGB string
function parseRgb(str: string): { r: number; g: number; b: number } | null {
  const match = str.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (match) {
    return {
      r: parseInt(match[1]),
      g: parseInt(match[2]),
      b: parseInt(match[3]),
    };
  }
  return null;
}

// Parse HSL string
function parseHsl(str: string): { h: number; s: number; l: number } | null {
  const match = str.match(/hsla?\s*\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?/i);
  if (match) {
    return {
      h: parseInt(match[1]),
      s: parseInt(match[2]),
      l: parseInt(match[3]),
    };
  }
  return null;
}

// HSL to RGB
function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

// Parse any color format
function parseColor(input: string): { r: number; g: number; b: number } | null {
  const trimmed = input.trim();

  // HEX
  if (trimmed.match(/^#?[a-f\d]{3}$/i) || trimmed.match(/^#?[a-f\d]{6}$/i)) {
    return hexToRgb(trimmed);
  }

  // RGB
  const rgb = parseRgb(trimmed);
  if (rgb) return rgb;

  // HSL
  const hsl = parseHsl(trimmed);
  if (hsl) return hslToRgb(hsl.h, hsl.s, hsl.l);

  return null;
}

export function BatchColorConverter() {
  const [input, setInput] = useState('');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('all');
  const [copied, setCopied] = useState(false);

  const results = useMemo<ColorResult[]>(() => {
    const lines = input.split('\n').filter(line => line.trim());
    return lines.map(line => {
      const rgb = parseColor(line);
      if (rgb) {
        const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        return {
          original: line.trim(),
          hex,
          rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
          hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
          valid: true,
        };
      }
      return {
        original: line.trim(),
        hex: '-',
        rgb: '-',
        hsl: '-',
        valid: false,
      };
    });
  }, [input]);

  const validResults = results.filter(r => r.valid);

  const getOutput = () => {
    return validResults.map(r => {
      switch (outputFormat) {
        case 'hex': return r.hex;
        case 'rgb': return r.rgb;
        case 'hsl': return r.hsl;
        case 'all': return `${r.hex} | ${r.rgb} | ${r.hsl}`;
      }
    }).join('\n');
  };

  const handleCopy = async () => {
    const output = getOutput();
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2">
      <Card variant="bordered" className="p-5">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              색상 코드 입력 (줄바꿈으로 구분)
            </label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={"#FF5733\nrgb(255, 87, 51)\nhsl(14, 100%, 60%)\n#3498db\nrgba(52, 152, 219, 1)"}
              rows={6}
              className="font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              출력 형식
            </label>
            <div className="flex flex-wrap gap-2">
              {([
                { value: 'all', label: '전체' },
                { value: 'hex', label: 'HEX' },
                { value: 'rgb', label: 'RGB' },
                { value: 'hsl', label: 'HSL' },
              ] as { value: OutputFormat; label: string }[]).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setOutputFormat(opt.value)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                    outputFormat === opt.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* 결과 */}
      {results.length > 0 && (
        <Card variant="bordered" className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              변환 결과 ({validResults.length}/{results.length})
            </h3>
            <Button
              onClick={handleCopy}
              variant="secondary"
              className="text-sm"
              disabled={validResults.length === 0}
            >
              {copied ? '복사됨!' : '결과 복사'}
            </Button>
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {results.map((result, idx) => (
              <div
                key={idx}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg',
                  result.valid
                    ? 'bg-gray-50 dark:bg-gray-800/50'
                    : 'bg-red-50 dark:bg-red-900/20'
                )}
              >
                {result.valid ? (
                  <>
                    <div
                      className="w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-700 flex-shrink-0"
                      style={{ backgroundColor: result.hex }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {result.original}
                      </div>
                      <div className="font-mono text-sm text-gray-900 dark:text-white space-y-0.5">
                        {(outputFormat === 'all' || outputFormat === 'hex') && (
                          <div>{result.hex}</div>
                        )}
                        {(outputFormat === 'all' || outputFormat === 'rgb') && (
                          <div>{result.rgb}</div>
                        )}
                        {(outputFormat === 'all' || outputFormat === 'hsl') && (
                          <div>{result.hsl}</div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-red-600 dark:text-red-400">
                    {result.original} - 인식할 수 없는 형식
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
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
          🔄 색상 일괄 변환기란?
        </h2>
        <p className="text-sm leading-relaxed">
          색상 일괄 변환기는 여러 색상 코드를 한 번에 HEX, RGB, HSL 등 원하는 형식으로 변환하는 도구입니다.
          HEX(#FF5733), RGB(rgb(255,87,51)), RGBA, HSL, HSLA 등 다양한 입력 형식을 자동으로 인식합니다.
          줄바꿈으로 구분하여 수십 개의 색상을 동시에 처리할 수 있어 대량 작업에 효율적입니다.
          디자인 시스템 구축, CSS 마이그레이션, 색상 문서화 작업에 유용합니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 지원하는 색상 형식
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">형식</th>
                <th className="text-left py-2 px-2">예시</th>
                <th className="text-left py-2 px-2">특징</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">HEX (6자리)</td><td className="font-mono">#FF5733</td><td>가장 일반적, 웹에서 널리 사용</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">HEX (3자리)</td><td className="font-mono">#F53</td><td>축약형, 6자리로 자동 확장</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">RGB</td><td className="font-mono">rgb(255, 87, 51)</td><td>0-255 정수값, 프로그래밍에 유용</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">RGBA</td><td className="font-mono">rgba(255, 87, 51, 0.5)</td><td>투명도 포함, 알파값은 무시됨</td></tr>
              <tr><td className="py-2 px-2 font-medium">HSL</td><td className="font-mono">hsl(14, 100%, 60%)</td><td>색조/채도/명도, 직관적 조정</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 활용 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>CSS 마이그레이션</strong>: 기존 HEX를 HSL로 일괄 변환하여 테마 시스템 구축</li>
          <li><strong>디자인 핸드오프</strong>: Figma/Sketch 색상을 개발자용 형식으로 변환</li>
          <li><strong>문서화</strong>: 브랜드 가이드라인에 모든 형식 포함</li>
          <li><strong>디버깅</strong>: 다양한 소스의 색상을 통일된 형식으로 비교</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: 'RGBA의 투명도는 어떻게 처리되나요?',
            answer: '현재 버전에서는 알파(투명도) 값이 무시되고 RGB 부분만 변환됩니다. 투명도가 필요한 경우 별도로 관리하세요.',
          },
          {
            question: '인식되지 않는 색상은 어떻게 표시되나요?',
            answer: '빨간색 배경으로 표시되며 "인식할 수 없는 형식"이라고 안내됩니다. 오타나 지원하지 않는 형식(CSS 색상명 등)인지 확인하세요.',
          },
          {
            question: '결과를 복사하면 어떤 형식으로 복사되나요?',
            answer: '선택한 출력 형식(HEX, RGB, HSL, 전체)에 따라 줄바꿈으로 구분된 텍스트로 복사됩니다. 스프레드시트나 코드에 바로 붙여넣기 가능합니다.',
          },
        ]}
      />
    </div>
  );
}
