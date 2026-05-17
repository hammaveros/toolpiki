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

export function PaletteGenerator() {
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
    { value: 'complementary', label: '보색', desc: '반대 색상' },
    { value: 'analogous', label: '유사색', desc: '인접 색상' },
    { value: 'triadic', label: '삼원색', desc: '120° 간격' },
    { value: 'tetradic', label: '사각 조화', desc: '90° 간격' },
    { value: 'monochromatic', label: '단색 조화', desc: '같은 색조' },
  ];

  return (
    <div className="space-y-2">
      <Card variant="bordered" className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              기본 색상
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
                랜덤
              </Button>
              <Button onClick={generatePalette}>생성</Button>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            팔레트 유형
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
                CSS 변수
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
          🎨 색상 팔레트 생성기란?
        </h2>
        <p className="text-sm leading-relaxed">
          <strong className="text-gray-900 dark:text-white">색상 팔레트 생성기는 <strong>색상 이론</strong>에 따른 조화로운 팔레트를 자동 생성하는 도구입니다.</strong>{' '}
          <strong>보색</strong>, <strong>유사색</strong>, <strong>삼원색</strong>, 사각 조화, 단색 조화 등 5가지 배색 방식을 지원하며, 각 방식은 색상환에서의 관계에 기반합니다.
          생성된 팔레트는 <strong>HEX/RGB</strong> 코드로 제공되며, CSS 변수로 바로 내보내기가 가능합니다.
          웹 디자인, 브랜드 컬러 시스템, UI 테마, 일러스트 작업 등에 유용하게 활용됩니다.
        </p>

        <div className="mt-4 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900 p-4 text-sm">
          <p className="font-semibold text-purple-900 dark:text-purple-200 mb-1">🎨 디자인 팁</p>
          <p className="text-purple-800 dark:text-purple-300">
            <strong>60-30-10 규칙</strong>: 주색 60%(배경), 보조색 30%(섹션), 강조색 10%(CTA)로 배분하면 시선 흐름이 자연스러워집니다.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 색상 조화 이론
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">조화 유형</th>
                <th className="text-left py-2 px-2">색상환 관계</th>
                <th className="text-left py-2 px-2">특징</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">보색</td><td>180° 반대</td><td>강렬한 대비, 시선 집중</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">유사색</td><td>30° 인접</td><td>자연스럽고 조화로움</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">삼원색</td><td>120° 간격</td><td>균형 잡힌 다양성</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">사각 조화</td><td>90° 간격</td><td>풍부하고 대담함</td></tr>
              <tr><td className="py-2 px-2 font-medium">단색 조화</td><td>동일 색조</td><td>통일감, 세련됨</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 팔레트 활용 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>60-30-10 규칙</strong>: 주색 60%(배경/큰 영역), 보조색 30%(섹션/카드), 강조색 10%(CTA 버튼·아이콘)으로 배분하면 시선 흐름이 자연스러워집니다.</li>
          <li><strong>브랜드 컬러</strong>: 보색이나 삼원색은 강한 대비로 인지도가 높아 로고와 키 비주얼에 어울리며, 짧은 시간 노출되는 광고 배너에 효과적입니다.</li>
          <li><strong>UI 디자인</strong>: 정보 위계가 중요한 대시보드는 단색 조화로 톤을 통일하고, 한 곳에만 보색을 강조로 쓰는 방식이 가독성에 좋습니다.</li>
          <li><strong>대비 확인</strong>: 생성된 팔레트의 각 색을 흰 배경과 짝지어 4.5:1 이상인지 점검하세요. 채도 100% 노랑/시안은 흰 배경 위 텍스트로 부적합한 경우가 많습니다.</li>
          <li><strong>컨텍스트 고려</strong>: 웹 sRGB에서 선명한 색이 인쇄 CMYK에선 칙칙해지고, OLED 화면에선 검정이 더 깊게 보입니다. 출력 매체별 테스트가 필요합니다.</li>
          <li><strong>중성색 보강</strong>: 5색 팔레트만으로 UI를 다 채우긴 어렵습니다. 회색 3~5단계(예: #F5F5F5, #E5E5E5, #9CA3AF, #4B5563, #1F2937)를 별도로 마련하세요.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🧭 시작 색을 정할 때 참고할 것
        </h2>
        <p className="text-sm leading-relaxed">
          어떤 색을 <strong>기준 색</strong>으로 잡느냐에 따라 팔레트 전체 인상이 달라집니다.
          <strong>채도(S)가 80% 이상</strong>인 비비드 색은 게임·F&B 브랜드처럼 활기 있는 분위기를,
          <strong>채도 30~50%</strong> 사이의 차분한 색은 금융·헬스케어·B2B SaaS의 신뢰감을 자아냅니다.
          <strong>명도(L)</strong>는 50% 부근일 때 보색·유사색 변형이 가장 균형 있게 분포하며,
          80% 이상의 파스텔이나 20% 이하의 다크 톤은 단색 조화 시에만 안정적입니다.
          색조(H)는 <strong>217°(파랑)</strong>이 가장 보편적인 SaaS 컬러이고, <strong>12°(빨강)</strong>는 식음료, <strong>142°(녹색)</strong>는 헬스/지속가능성 도메인에 흔히 보입니다.
        </p>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '어떤 팔레트 유형을 선택해야 하나요?',
            answer: '목적에 따라 다릅니다. 강렬한 인상을 원하면 보색, 부드럽고 자연스러운 느낌은 유사색, 균형 있는 다양성은 삼원색, 세련된 통일감은 단색 조화가 적합합니다. 처음이라면 유사색이 실패 확률이 가장 낮습니다.',
          },
          {
            question: '왜 생성된 색상이 원래 색상과 약간 다를 수 있나요?',
            answer: 'HSL 색공간에서 각도 회전 후 다시 HEX로 변환하는 과정에서 정수 반올림이 발생할 수 있습니다. 또한 모니터 색상 프로필이 sRGB가 아닌 경우(P3, Adobe RGB 등) 동일한 코드라도 다르게 보일 수 있습니다.',
          },
          {
            question: 'CSS 변수는 어떻게 사용하나요?',
            answer: ':root에 --color-1 ~ --color-5 형태로 변수를 선언하고 var(--color-1) 형태로 사용합니다. Tailwind에서는 tailwind.config의 extend.colors에 추가하여 bg-brand-1, text-brand-2 등으로 활용할 수 있습니다.',
          },
          {
            question: '5색만으로 다크모드까지 커버되나요?',
            answer: '어렵습니다. 보통은 라이트용 5색 + 다크용 5색을 짝지어 정의합니다. 라이트의 주색이 채도 70% 명도 50%였다면, 다크에서는 채도 50% 명도 65% 정도로 낮춰야 OLED 화면에서 눈이 부시지 않습니다.',
          },
        ]}
      />
    </div>
  );
}
