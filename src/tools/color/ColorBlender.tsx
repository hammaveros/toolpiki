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
          <li><strong>Tailwind 스케일 재현</strong>: 시작색을 brand-500으로 잡고 9단계로 뽑으면 100~900까지의 톤이 자연스럽게 만들어져 디자인 토큰 정의가 한 번에 끝납니다.</li>
          <li><strong>호버/액티브 상태</strong>: 기본 버튼 색을 시작, 같은 색의 명도 -15%를 끝으로 두고 3단계만 뽑으면 정중앙 색이 hover, 끝이 active로 그대로 쓰입니다.</li>
          <li><strong>데이터 시각화</strong>: 라이트한 베이지 → 진한 인디고처럼 명도/채도 차이가 큰 두 색을 7단계로 잘라 heat map 범례를 만들면 시선이 자연스럽게 흘러갑니다.</li>
          <li><strong>다크모드 페어링</strong>: 라이트 모드의 brand 색을 시작점, 다크 배경에서 잘 보이는 같은 색조의 채도 낮은 버전을 끝점으로 두면 모드별 토큰 매핑이 쉬워집니다.</li>
          <li><strong>그라데이션 부드럽게</strong>: linear-gradient에 시작/끝만 넣으면 중간에 회색 띠가 보일 때가 있는데, 5단계 색을 stop으로 모두 넣어주면 띠가 사라집니다.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🧪 두 색을 고를 때 체크할 것
        </h2>
        <p className="text-sm leading-relaxed">
          블렌딩 결과의 품질은 출발/도착 색의 채도 차이와 색조 거리에 크게 좌우됩니다.
          색조가 180° 떨어진 보색(예: 파랑-주황)은 RGB 보간 시 중간이 탁한 회갈색으로 빠지기 쉬워 HSL을 권장하며,
          색조 차이가 60° 이하인 인접 색은 어떤 방식으로 보간해도 결과가 안정적입니다.
          또한 명도(L) 차이가 40 이상 벌어져야 단계가 시각적으로 구별되며,
          차이가 10 미만이면 사람 눈에는 같은 색으로 보일 수 있다는 점도 고려하세요.
        </p>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: 'RGB 블렌딩 시 중간 색상이 어두워지는 이유는?',
            answer: 'RGB 선형 보간은 두 색상의 각 채널을 평균내므로, 보색 관계의 색상(빨강-청록 등)을 혼합하면 회색에 가까워집니다. 이를 피하려면 HSL/LAB 보간 방식을 사용하거나, 중간에 보조 색상을 하나 더 끼워 stop을 늘리는 방법이 있습니다.',
          },
          {
            question: '몇 단계의 중간색이 적당한가요?',
            answer: '용도에 따라 다릅니다. 버튼 호버 효과는 2~3단계, 색상 팔레트는 5~9단계, 데이터 시각화 범례는 7~11단계가 일반적입니다. Tailwind 호환을 노린다면 11단계(50, 100~900, 950)가 표준입니다.',
          },
          {
            question: 'CSS 변수로 어떻게 활용하나요?',
            answer: ':root에 --blend-0, --blend-1 등으로 선언하고, var(--blend-3) 형태로 사용합니다. Tailwind에서는 extend colors로 등록하여 bg-blend-3 등으로 활용 가능합니다. CSS-in-JS라면 객체로 매핑해 theme.colors.brand[300] 같은 접근도 가능합니다.',
          },
          {
            question: '같은 두 색인데 결과가 매번 다른가요?',
            answer: '아닙니다. 블렌딩은 결정론적이라 입력과 단계가 같으면 항상 동일한 출력이 나옵니다. 결과가 다르게 보인다면 모니터 캘리브레이션이나 다크/라이트 모드 차이일 가능성이 큽니다.',
          },
        ]}
      />
    </div>
  );
}
