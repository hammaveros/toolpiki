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

export function ColorConverter() {
  const [hex, setHex] = useState('#3B82F6');

  // HEX → RGB 변환
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

  // RGB → HEX 변환
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

  // RGB → HSL 변환
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
      {/* 색상 미리보기 */}
      <Card variant="bordered" className="p-6">
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          <div
            className="w-32 h-32 rounded-xl shadow-lg border-4 border-white dark:border-gray-700"
            style={{ backgroundColor: hex }}
          />
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              HEX 색상 코드
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

      {/* RGB 슬라이더 */}
      {colors && (
        <Card variant="bordered" className="p-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            RGB 조절
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

      {/* 변환 결과 */}
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
          🎨 색상 코드 변환기란?
        </h2>
        <p className="text-sm leading-relaxed">
          색상 코드 변환기는 HEX, RGB, HSL 등 다양한 색상 형식을 상호 변환하는 온라인 도구입니다.
          컬러 피커로 시각적으로 색상을 선택하거나, RGB 슬라이더로 세밀하게 조절할 수 있습니다.
          웹 개발, 그래픽 디자인, UI/UX 작업에서 다양한 형식의 색상 코드가 필요할 때 유용합니다.
          변환된 값은 클릭 한 번으로 복사하여 바로 사용할 수 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 색상 형식 비교
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
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">HEX</td><td className="font-mono">#3B82F6</td><td>웹에서 가장 흔함</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">RGB</td><td className="font-mono">rgb(59, 130, 246)</td><td>빨강/초록/파랑 조합</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">HSL</td><td className="font-mono">hsl(217, 91%, 60%)</td><td>색조/채도/밝기</td></tr>
              <tr><td className="py-2 px-2 font-medium">RGBA</td><td className="font-mono">rgba(59, 130, 246, 1)</td><td>투명도 포함</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 색상 형식 선택 가이드
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>HEX</strong>: CSS, HTML, 디자인 툴 export에서 가장 널리 쓰이며 6자리 한 줄로 끝나서 코드 리뷰가 깔끔합니다.</li>
          <li><strong>RGB</strong>: 캔버스 API, 이미지 처리 라이브러리에서 채널별 연산이 필요할 때 직관적이며, 슬라이더 UI와도 잘 맞습니다.</li>
          <li><strong>HSL</strong>: 색조는 그대로 두고 명도만 -10% 같이 상대 조정할 때 강력합니다. 같은 brand 색의 hover/active 파생 색 만들기에 최적입니다.</li>
          <li><strong>RGBA</strong>: 모달 백드롭 rgba(0,0,0,0.5), 카드 그림자 rgba(0,0,0,0.08)처럼 투명도 자체가 의미를 가지는 곳에 사용합니다.</li>
          <li><strong>HSLA</strong>: 다크 모드에서 같은 색조의 알파만 0.6 → 0.9로 강조할 때처럼, 톤은 유지하고 노출만 조절하는 시나리오에 적합합니다.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🔬 색공간의 작은 차이가 만드는 큰 결과
        </h2>
        <p className="text-sm leading-relaxed">
          같은 색이라도 색공간에 따라 값이 다르게 표현됩니다.
          예를 들어 Tailwind의 blue-500(#3B82F6)을 RGB로 보면 (59, 130, 246)이고 HSL로 보면 hsl(217, 91%, 60%)인데,
          여기서 명도(L)만 60 → 80으로 올리면 blue-300 비슷한 톤이 만들어지지만 RGB로 같은 작업을 하려면 세 채널을 각각 계산해야 합니다.
          반대로 RGB는 캔버스에 픽셀 단위로 색을 찍을 때 한 번에 처리하기 좋아 이미지 합성에 유리합니다.
          그래서 디자인 시스템은 HSL로 정의하되 런타임에서는 HEX/RGB로 저장하는 하이브리드 방식이 자주 쓰입니다.
        </p>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: 'HEX 코드에서 # 기호는 꼭 필요한가요?',
            answer: 'CSS에서는 # 기호가 필수입니다. JavaScript 변수, JSON 데이터, 일부 그래픽 소프트웨어에서는 # 없이 사용하기도 합니다. 이 도구는 둘 다 인식하므로 어떤 형태로 붙여넣어도 변환됩니다.',
          },
          {
            question: 'HSL이 RGB보다 좋은 점은 무엇인가요?',
            answer: 'HSL은 색조(H), 채도(S), 밝기(L)로 구성되어 직관적입니다. 같은 색조에서 밝거나 어두운 변형을 만들기 쉬워, 디자인 토큰을 단일 색조 + 명도 스케일로 정의할 때 매우 편리합니다.',
          },
          {
            question: '투명 색상은 어떻게 만드나요?',
            answer: 'RGBA 형식에서 마지막 값(알파)을 0~1 사이로 조절합니다. 0은 완전 투명, 1은 완전 불투명이며, 0.08~0.12는 카드 그림자, 0.4~0.6은 모달 배경에 자주 쓰입니다.',
          },
          {
            question: '8자리 HEX(#RRGGBBAA)도 변환되나요?',
            answer: '최신 브라우저는 #RRGGBBAA 형식을 지원하지만 이 도구는 6자리 HEX와 별도 알파값을 권장합니다. 호환성과 코드 가독성 측면에서 RGBA/HSLA가 더 안정적입니다.',
          },
        ]}
      />
    </div>
  );
}
