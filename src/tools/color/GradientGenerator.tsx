'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { Input } from '@/components/ui/Input';
import { FaqSection } from '@/components/ui/FaqItem';

interface ColorStop {
  color: string;
  position: number;
}

type GradientType = 'linear' | 'radial' | 'conic';

export function GradientGenerator() {
  const [gradientType, setGradientType] = useState<GradientType>('linear');
  const [angle, setAngle] = useState(90);
  const [colorStops, setColorStops] = useState<ColorStop[]>([
    { color: '#3b82f6', position: 0 },
    { color: '#8b5cf6', position: 100 },
  ]);

  const addColorStop = () => {
    const lastPos = colorStops[colorStops.length - 1]?.position || 0;
    const newPos = Math.min(lastPos + 20, 100);
    setColorStops([...colorStops, { color: '#10b981', position: newPos }]);
  };

  const removeColorStop = (index: number) => {
    if (colorStops.length <= 2) return;
    setColorStops(colorStops.filter((_, i) => i !== index));
  };

  const updateColorStop = (index: number, updates: Partial<ColorStop>) => {
    setColorStops(colorStops.map((stop, i) =>
      i === index ? { ...stop, ...updates } : stop
    ));
  };

  const generateCss = (): string => {
    const stops = [...colorStops]
      .sort((a, b) => a.position - b.position)
      .map((stop) => `${stop.color} ${stop.position}%`)
      .join(', ');

    switch (gradientType) {
      case 'linear':
        return `linear-gradient(${angle}deg, ${stops})`;
      case 'radial':
        return `radial-gradient(circle, ${stops})`;
      case 'conic':
        return `conic-gradient(from ${angle}deg, ${stops})`;
    }
  };

  const generateFullCss = (): string => {
    return `background: ${generateCss()};`;
  };

  const generateRandom = () => {
    const randomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    setColorStops([
      { color: randomColor(), position: 0 },
      { color: randomColor(), position: 100 },
    ]);
    setAngle(Math.floor(Math.random() * 360));
  };

  const presets = [
    { name: '일출', stops: [{ color: '#ff512f', position: 0 }, { color: '#f09819', position: 100 }] },
    { name: '바다', stops: [{ color: '#2193b0', position: 0 }, { color: '#6dd5ed', position: 100 }] },
    { name: '보라', stops: [{ color: '#834d9b', position: 0 }, { color: '#d04ed6', position: 100 }] },
    { name: '숲', stops: [{ color: '#11998e', position: 0 }, { color: '#38ef7d', position: 100 }] },
    { name: '밤하늘', stops: [{ color: '#0f0c29', position: 0 }, { color: '#302b63', position: 50 }, { color: '#24243e', position: 100 }] },
  ];

  return (
    <div className="space-y-2">
      {/* 미리보기 */}
      <div
        className="h-32 rounded-lg shadow-inner"
        style={{ background: generateCss() }}
      />

      {/* 그라데이션 유형 & 각도 */}
      <Card variant="bordered" className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
              유형
            </label>
            <div className="flex gap-1 flex-wrap">
              {(['linear', 'radial', 'conic'] as GradientType[]).map((type) => (
                <Button
                  key={type}
                  variant={gradientType === type ? 'primary' : 'secondary'}
                  onClick={() => setGradientType(type)}
                >
                  {type === 'linear' ? '선형' : type === 'radial' ? '원형' : '원뿔형'}
                </Button>
              ))}
            </div>
          </div>

          {(gradientType === 'linear' || gradientType === 'conic') && (
            <div className="flex items-center gap-2 flex-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                각도
              </label>
              <div className="flex gap-1 flex-wrap">
                {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
                  <Button
                    key={a}
                    variant={angle === a ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setAngle(a)}
                  >
                    {a}°
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* 색상 스톱 */}
      <Card variant="bordered" className="p-4">
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            색상 ({colorStops.length}개)
          </label>
          <Button variant="secondary" size="sm" onClick={addColorStop}>
            + 색상 추가
          </Button>
        </div>

        <div className="space-y-3">
          {colorStops.map((stop, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="color"
                value={stop.color}
                onChange={(e) => updateColorStop(index, { color: e.target.value })}
                className="w-10 h-10 rounded cursor-pointer"
              />
              <Input
                value={stop.color}
                onChange={(e) => updateColorStop(index, { color: e.target.value })}
                className="w-24 font-mono text-sm"
              />
              <Input
                type="number"
                min="0"
                max="100"
                value={stop.position}
                onChange={(e) => updateColorStop(index, { position: Number(e.target.value) })}
                className="w-20 text-sm"
              />
              <span className="text-sm text-gray-500">%</span>
              {colorStops.length > 2 && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => removeColorStop(index)}
                >
                  ✕
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* 프리셋 */}
      <Card variant="bordered" className="p-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          프리셋
        </label>
        <div className="flex gap-2 flex-wrap">
          {presets.map((preset) => (
            <button
              key={preset.name}
              className="px-3 py-2 rounded text-sm text-white"
              style={{
                background: `linear-gradient(90deg, ${preset.stops.map(s => `${s.color} ${s.position}%`).join(', ')})`,
              }}
              onClick={() => setColorStops(preset.stops)}
            >
              {preset.name}
            </button>
          ))}
          <Button variant="secondary" size="sm" onClick={generateRandom}>
            랜덤
          </Button>
        </div>
      </Card>

      {/* CSS 출력 */}
      <Card variant="bordered" className="p-4">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            CSS 코드
          </label>
          <CopyButton text={generateFullCss()} />
        </div>
        <pre className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded font-mono overflow-x-auto">
          {generateFullCss()}
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
          🌈 그라데이션 생성기란?
        </h2>
        <p className="text-sm leading-relaxed">
          그라데이션 생성기는 CSS 그라데이션을 시각적으로 만들 수 있는 온라인 도구입니다.
          선형(linear), 원형(radial), 원뿔형(conic) 세 가지 타입을 지원하며,
          색상, 각도, 위치를 자유롭게 조절하여 원하는 배경 효과를 만들 수 있습니다.
          생성된 CSS 코드를 복사하여 웹사이트에 바로 적용할 수 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 그라데이션 유형
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">유형</th>
                <th className="text-left py-2 px-2">설명</th>
                <th className="text-left py-2 px-2">활용 예</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">선형 (Linear)</td><td>직선 방향 전환</td><td>버튼, 배너 배경</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">원형 (Radial)</td><td>중심에서 바깥으로</td><td>스포트라이트, 하이라이트</td></tr>
              <tr><td className="py-2 px-2 font-medium">원뿔형 (Conic)</td><td>회전하며 색 전환</td><td>프로그레스 링, 색상환</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 그라데이션 디자인 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>인접 색상</strong>: 색상환에서 가까운 색상끼리 자연스러운 전환</li>
          <li><strong>명도 대비</strong>: 밝은 색 → 어두운 색으로 깊이감 표현</li>
          <li><strong>중간 색상</strong>: 3개 이상 색상으로 풍부한 그라데이션</li>
          <li><strong>위치 조절</strong>: 색상 위치(%)를 조절하여 전환 속도 제어</li>
          <li><strong>각도 활용</strong>: 45°, 135° 등 대각선 그라데이션으로 역동적 효과</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '그라데이션에 색상은 몇 개까지 추가할 수 있나요?',
            answer: 'CSS 그라데이션에는 제한이 없지만, 보통 2~4개가 자연스럽습니다. 너무 많으면 복잡해 보일 수 있습니다.',
          },
          {
            question: '그라데이션 배경이 구형 브라우저에서 안 보이면?',
            answer: 'CSS에 fallback 배경색을 먼저 선언하세요. 예: background: #3b82f6; 다음 줄에 그라데이션 선언.',
          },
          {
            question: '투명 그라데이션은 어떻게 만드나요?',
            answer: '색상 코드 대신 rgba() 또는 transparent를 사용하세요. 예: transparent → #3b82f6로 페이드인 효과.',
          },
        ]}
      />
    </div>
  );
}
