'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';

interface RadiusValues {
  topLeft: number;
  topRight: number;
  bottomRight: number;
  bottomLeft: number;
}

const presets = [
  { name: '없음', values: { topLeft: 0, topRight: 0, bottomRight: 0, bottomLeft: 0 } },
  { name: '작게', values: { topLeft: 4, topRight: 4, bottomRight: 4, bottomLeft: 4 } },
  { name: '중간', values: { topLeft: 12, topRight: 12, bottomRight: 12, bottomLeft: 12 } },
  { name: '크게', values: { topLeft: 24, topRight: 24, bottomRight: 24, bottomLeft: 24 } },
  { name: '완전', values: { topLeft: 50, topRight: 50, bottomRight: 50, bottomLeft: 50 } },
  { name: '알약', values: { topLeft: 100, topRight: 100, bottomRight: 100, bottomLeft: 100 } },
  { name: '드롭', values: { topLeft: 50, topRight: 50, bottomRight: 0, bottomLeft: 50 } },
  { name: '리프', values: { topLeft: 50, topRight: 0, bottomRight: 50, bottomLeft: 0 } },
];

export function BorderRadiusGenerator() {
  const [radius, setRadius] = useState<RadiusValues>({
    topLeft: 12, topRight: 12, bottomRight: 12, bottomLeft: 12
  });
  const [linked, setLinked] = useState(true);
  const [unit, setUnit] = useState<'px' | '%'>('px');
  const [boxWidth, setBoxWidth] = useState(200);
  const [boxHeight, setBoxHeight] = useState(150);
  const [bgColor, setBgColor] = useState('#3b82f6');

  const cssValue = useMemo(() => {
    const { topLeft, topRight, bottomRight, bottomLeft } = radius;
    const u = unit;

    if (topLeft === topRight && topRight === bottomRight && bottomRight === bottomLeft) {
      return `${topLeft}${u}`;
    }
    if (topLeft === bottomRight && topRight === bottomLeft) {
      return `${topLeft}${u} ${topRight}${u}`;
    }
    if (topRight === bottomLeft) {
      return `${topLeft}${u} ${topRight}${u} ${bottomRight}${u}`;
    }
    return `${topLeft}${u} ${topRight}${u} ${bottomRight}${u} ${bottomLeft}${u}`;
  }, [radius, unit]);

  const updateRadius = (key: keyof RadiusValues, value: number) => {
    if (linked) {
      setRadius({ topLeft: value, topRight: value, bottomRight: value, bottomLeft: value });
    } else {
      setRadius(prev => ({ ...prev, [key]: value }));
    }
  };

  const applyPreset = (preset: typeof presets[0]) => {
    setRadius(preset.values);
  };

  const copyCode = `border-radius: ${cssValue};`;

  return (
    <div className="space-y-6">
      {/* 프리셋 */}
      <Card variant="bordered" className="p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">프리셋</h3>
        <div className="flex flex-wrap gap-2">
          {presets.map(preset => (
            <Button
              key={preset.name}
              variant="secondary"
              size="sm"
              onClick={() => applyPreset(preset)}
            >
              {preset.name}
            </Button>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 미리보기 */}
        <Card variant="bordered" className="p-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">미리보기</h3>
          <div className="flex items-center justify-center min-h-[300px] bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div
              style={{
                width: boxWidth,
                height: boxHeight,
                backgroundColor: bgColor,
                borderRadius: `${radius.topLeft}${unit} ${radius.topRight}${unit} ${radius.bottomRight}${unit} ${radius.bottomLeft}${unit}`,
                transition: 'all 0.2s ease',
              }}
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400">너비</label>
              <input
                type="range"
                min={50}
                max={300}
                value={boxWidth}
                onChange={(e) => setBoxWidth(Number(e.target.value))}
                className="w-full mt-1"
              />
              <span className="text-xs text-gray-600 dark:text-gray-400">{boxWidth}px</span>
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400">높이</label>
              <input
                type="range"
                min={50}
                max={300}
                value={boxHeight}
                onChange={(e) => setBoxHeight(Number(e.target.value))}
                className="w-full mt-1"
              />
              <span className="text-xs text-gray-600 dark:text-gray-400">{boxHeight}px</span>
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400">배경색</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* 설정 */}
        <Card variant="bordered" className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">모서리 설정</h3>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={linked}
                  onChange={(e) => setLinked(e.target.checked)}
                  className="w-4 h-4"
                />
                연결
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as 'px' | '%')}
                className="px-2 py-1 text-sm border rounded dark:bg-gray-800 dark:border-gray-700"
              >
                <option value="px">px</option>
                <option value="%">%</option>
              </select>
            </div>
          </div>

          {/* 시각적 모서리 컨트롤 */}
          <div className="relative w-48 h-48 mx-auto mb-6">
            <div
              className="absolute inset-0 border-2 border-dashed border-gray-300 dark:border-gray-600"
              style={{
                borderRadius: `${radius.topLeft}${unit} ${radius.topRight}${unit} ${radius.bottomRight}${unit} ${radius.bottomLeft}${unit}`,
              }}
            />
            {/* 좌상단 */}
            <div className="absolute -top-1 -left-1 flex flex-col items-start">
              <input
                type="number"
                min={0}
                max={unit === '%' ? 50 : 150}
                value={radius.topLeft}
                onChange={(e) => updateRadius('topLeft', Number(e.target.value))}
                className="w-14 text-xs text-center px-1 py-0.5 border rounded dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            {/* 우상단 */}
            <div className="absolute -top-1 -right-1 flex flex-col items-end">
              <input
                type="number"
                min={0}
                max={unit === '%' ? 50 : 150}
                value={radius.topRight}
                onChange={(e) => updateRadius('topRight', Number(e.target.value))}
                className="w-14 text-xs text-center px-1 py-0.5 border rounded dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            {/* 우하단 */}
            <div className="absolute -bottom-1 -right-1 flex flex-col items-end">
              <input
                type="number"
                min={0}
                max={unit === '%' ? 50 : 150}
                value={radius.bottomRight}
                onChange={(e) => updateRadius('bottomRight', Number(e.target.value))}
                className="w-14 text-xs text-center px-1 py-0.5 border rounded dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            {/* 좌하단 */}
            <div className="absolute -bottom-1 -left-1 flex flex-col items-start">
              <input
                type="number"
                min={0}
                max={unit === '%' ? 50 : 150}
                value={radius.bottomLeft}
                onChange={(e) => updateRadius('bottomLeft', Number(e.target.value))}
                className="w-14 text-xs text-center px-1 py-0.5 border rounded dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
          </div>

          {/* 슬라이더 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400">좌상단</label>
              <input
                type="range"
                min={0}
                max={unit === '%' ? 50 : 150}
                value={radius.topLeft}
                onChange={(e) => updateRadius('topLeft', Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400">우상단</label>
              <input
                type="range"
                min={0}
                max={unit === '%' ? 50 : 150}
                value={radius.topRight}
                onChange={(e) => updateRadius('topRight', Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400">좌하단</label>
              <input
                type="range"
                min={0}
                max={unit === '%' ? 50 : 150}
                value={radius.bottomLeft}
                onChange={(e) => updateRadius('bottomLeft', Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400">우하단</label>
              <input
                type="range"
                min={0}
                max={unit === '%' ? 50 : 150}
                value={radius.bottomRight}
                onChange={(e) => updateRadius('bottomRight', Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </Card>
      </div>

      {/* CSS 코드 */}
      <Card variant="bordered" className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">CSS 코드</h3>
          <CopyButton text={copyCode} />
        </div>
        <pre className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-mono overflow-x-auto">
          {copyCode}
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
          📐 Border Radius 생성기란?
        </h2>
        <p className="text-sm leading-relaxed">
          Border Radius 생성기는 CSS border-radius 속성을 시각적으로 편집하는 도구입니다.
          네 모서리를 개별적으로 또는 연결하여 동시에 조절할 수 있으며, px와 % 단위를 지원합니다.
          알약, 드롭, 리프 등 프리셋으로 특수 모양을 빠르게 만들 수 있고, 실시간 미리보기로 결과를 즉시 확인합니다.
          버튼, 카드, 아바타, 뱃지 등 다양한 UI 요소의 모서리 스타일링에 활용할 수 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 border-radius 속성 이해
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">표기법</th>
                <th className="text-left py-2 px-2">적용 순서</th>
                <th className="text-left py-2 px-2">예시</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">1개 값</td><td>모든 모서리 동일</td><td>border-radius: 12px;</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">2개 값</td><td>좌상+우하 / 우상+좌하</td><td>border-radius: 12px 0;</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">3개 값</td><td>좌상 / 우상+좌하 / 우하</td><td>border-radius: 12px 8px 0;</td></tr>
              <tr><td className="py-2 px-2 font-medium">4개 값</td><td>좌상 / 우상 / 우하 / 좌하</td><td>border-radius: 12px 8px 4px 0;</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 모서리 디자인 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>완전한 원</strong>: 정사각형 요소에 50% 적용 (또는 너비의 절반 px)</li>
          <li><strong>알약 모양</strong>: 높이의 절반 이상 적용 (예: 9999px)</li>
          <li><strong>일관성</strong>: 디자인 시스템에서 4px 배수 사용 (4, 8, 12, 16...)</li>
          <li><strong>접근성</strong>: 클릭 영역이 너무 작아지지 않도록 주의</li>
          <li><strong>반응형</strong>: 모바일에서는 더 작은 radius 권장</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: 'px와 % 단위의 차이는?',
            answer: 'px는 절대값으로 요소 크기와 무관합니다. %는 요소 크기에 비례하여 계산됩니다. 50%를 적용하면 정사각형은 원이 되고, 직사각형은 타원이 됩니다.',
          },
          {
            question: '모서리가 겹치면 어떻게 되나요?',
            answer: '인접한 모서리의 radius 합이 해당 변의 길이를 초과하면 브라우저가 자동으로 비율을 조정합니다. 의도치 않은 결과가 나올 수 있으니 주의하세요.',
          },
          {
            question: '타원형 모서리는 어떻게 만드나요?',
            answer: 'border-radius에 슬래시(/)를 사용하면 수평/수직 radius를 다르게 지정할 수 있습니다. 예: border-radius: 50% / 25%; 는 타원형 모서리를 만듭니다.',
          },
        ]}
      />
    </div>
  );
}
