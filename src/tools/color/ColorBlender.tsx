'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { Input } from '@/components/ui/Input';
import { FaqSection } from '@/components/ui/FaqItem';

export function ColorBlender() {
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
      {/* 색상 선택 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card variant="bordered" className="p-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            색상 1
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
            색상 2
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
          ↔ 색상 교체
        </Button>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">단계:</label>
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

      {/* 중간색 */}
      <Card variant="bordered" className="p-4 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">중간색</p>
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

      {/* 블렌딩 결과 */}
      <Card variant="bordered" className="p-4">
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            블렌딩 결과 ({blendedColors.length}색)
          </label>
          <CopyButton
            text={blendedColors.join(', ')}
            label="모두 복사"
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

      {/* CSS 변수 */}
      <Card variant="bordered" className="p-4">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            CSS 변수
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
          🎨 색상 블렌더란?
        </h2>
        <p className="text-sm leading-relaxed">
          색상 블렌더는 두 색상 사이의 중간 색상을 자동으로 생성하는 도구입니다.
          시작 색상과 끝 색상을 선택하고 단계 수를 지정하면, 부드럽게 변화하는 색상 시퀀스를 얻을 수 있습니다.
          그라데이션 디자인, 색상 팔레트 제작, UI 테마 설계 등 다양한 용도로 활용됩니다.
          생성된 색상은 HEX 코드로 제공되며, CSS 변수로 바로 복사하여 사용할 수 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 블렌딩 방식 비교
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">방식</th>
                <th className="text-left py-2 px-2">설명</th>
                <th className="text-left py-2 px-2">특징</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">RGB 선형 보간</td><td>R, G, B 각 채널을 선형 보간</td><td>가장 기본적, 중간에 어두워질 수 있음</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">HSL 보간</td><td>색상, 채도, 명도를 개별 보간</td><td>자연스러운 색상 전환</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">LAB 보간</td><td>인간 시각 기반 색공간에서 보간</td><td>지각적으로 균일한 변화</td></tr>
              <tr><td className="py-2 px-2 font-medium">HCL 보간</td><td>색상-채도-명도 원통 좌표계</td><td>선명도 유지, 디자인에 적합</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 색상 블렌딩 활용 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>브랜드 컬러 확장</strong>: 주요 색상에서 밝은/어두운 변형 생성</li>
          <li><strong>데이터 시각화</strong>: 차트 색상 범위를 부드럽게 연결</li>
          <li><strong>호버 효과</strong>: 버튼의 기본/호버 상태 색상 생성</li>
          <li><strong>테마 색상</strong>: primary-100부터 primary-900까지 일관된 스케일</li>
          <li><strong>그라데이션 배경</strong>: CSS gradient에 중간 색상 추가로 부드러운 효과</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: 'RGB 블렌딩 시 중간 색상이 어두워지는 이유는?',
            answer: 'RGB 선형 보간은 두 색상의 각 채널을 평균내므로, 보색 관계의 색상(빨강-청록 등)을 혼합하면 회색에 가까워집니다. 이를 피하려면 HSL/LAB 보간 방식을 사용하세요.',
          },
          {
            question: '몇 단계의 중간색이 적당한가요?',
            answer: '용도에 따라 다릅니다. 버튼 호버 효과는 2~3단계, 색상 팔레트는 5~9단계, 데이터 시각화 범례는 7~11단계가 일반적입니다.',
          },
          {
            question: 'CSS 변수로 어떻게 활용하나요?',
            answer: ':root에 --blend-0, --blend-1 등으로 선언하고, var(--blend-3) 형태로 사용합니다. Tailwind에서는 extend colors로 등록하여 bg-blend-3 등으로 활용 가능합니다.',
          },
        ]}
      />
    </div>
  );
}
