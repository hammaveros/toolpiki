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
          <strong className="text-gray-900 dark:text-white">그라데이션 생성기는 CSS 그라데이션을 시각적으로 만드는 온라인 도구입니다.</strong>{' '}
          <strong>선형</strong>(linear), <strong>원형</strong>(radial), <strong>원뿔형</strong>(conic) 세 가지 타입을 지원하며,
          색상, 각도, 위치를 자유롭게 조절하여 원하는 배경 효과를 만들 수 있습니다.
          생성된 CSS 코드를 복사하여 웹사이트에 <strong>바로 적용</strong>할 수 있습니다.
        </p>

        <div className="mt-4 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900 p-4 text-sm">
          <p className="font-semibold text-purple-900 dark:text-purple-200 mb-1">🎨 디자인 팁</p>
          <p className="text-purple-800 dark:text-purple-300">
            <code className="px-1 py-0.5 rounded bg-white/60 dark:bg-gray-800 text-xs font-mono">135°</code>는 좌상단→우하단의 가장 자연스러운 대각선이라 <strong>SaaS 히어로 배경</strong>에서 가장 흔히 쓰입니다.
          </p>
        </div>
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
          <li><strong>인접 색상</strong>: 색상환에서 60° 이내로 떨어진 색끼리 섞으면 중간에 탁한 회색대가 생기지 않고 매끄럽게 전환됩니다. (예: 파랑→보라)</li>
          <li><strong>명도 대비</strong>: 시작 색의 L값이 70%, 끝 색이 30% 정도로 차이가 나면 입체감이 살아납니다. 같은 명도 두 색은 평면적으로 보입니다.</li>
          <li><strong>중간 색상</strong>: 두 색만 쓸 때 회색이 보인다면 두 색의 색조 평균에 해당하는 색을 50% 지점에 stop으로 끼워주세요(예: 빨강 0% → 주황 50% → 노랑 100%).</li>
          <li><strong>위치 조절</strong>: stop 위치를 0%, 30%, 100%처럼 비대칭으로 두면 한쪽이 강조되는 비대칭 그라데이션이 만들어져 시선이 한쪽으로 흐릅니다.</li>
          <li><strong>각도 활용</strong>: 135°는 좌상단→우하단으로 흐르는 가장 자연스러운 대각선이며, Stripe·Linear 같은 SaaS 히어로 배경에서 자주 보입니다.</li>
          <li><strong>Hard stop</strong>: 같은 위치에 두 색을 연속으로 넣으면(예: red 50%, blue 50%) 그라데이션 대신 단색 분할 배경이 되어 인포그래픽에 활용됩니다.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🎯 유형별 추천 사용처
        </h2>
        <p className="text-sm leading-relaxed">
          <strong>선형 그라데이션</strong>은 헤더 배너, 카드 배경, 버튼 등 정적인 영역에 가장 흔히 쓰이며,
          <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">135°</code> 각도와 두 색 조합만으로도 충분히 모던한 인상을 줍니다.
          <strong>원형(radial)</strong>은 중심에서 퍼지는 빛 효과나 카드의 spot highlight, 다크 테마의 vignette 처리에 유용하고,
          <strong>conic</strong>은 도넛 차트 배경, 로딩 스피너, 컬러 휠 같은 회전 모티프에서 빛납니다.
          모바일에서는 그라데이션 영역이 크면 <strong>GPU 합성 비용</strong>이 들 수 있으니 헤더 전체 대신 카드 단위로 분할해 적용하는 것이 성능에 유리합니다.
        </p>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '그라데이션에 색상은 몇 개까지 추가할 수 있나요?',
            answer: 'CSS 그라데이션 자체에는 제한이 없지만 보통 2~4개가 자연스럽습니다. 5개 이상이면 무지개처럼 시각적으로 산만해지고, 의미 있는 강조가 어려워집니다. 5색 이상이 필요하면 여러 그라데이션을 background에 콤마로 겹치는 방식을 권장합니다.',
          },
          {
            question: '그라데이션 배경이 구형 브라우저에서 안 보이면?',
            answer: 'CSS에 fallback 배경색을 먼저 선언하세요. 예: background: #3b82f6; 다음 줄에 background: linear-gradient(...). IE11 이하는 conic-gradient를 지원하지 않으므로 SVG로 대체하는 것이 안전합니다.',
          },
          {
            question: '투명 그라데이션은 어떻게 만드나요?',
            answer: '색상 코드 대신 rgba() 또는 transparent를 사용하세요. 예: transparent → #3b82f6로 페이드인 효과를 만들 수 있습니다. 단, transparent는 rgba(0,0,0,0)으로 해석되므로 끝 색의 색조가 검정 쪽으로 살짝 빠질 수 있어 rgba(59,130,246,0)처럼 같은 색의 알파 0을 쓰는 편이 깔끔합니다.',
          },
          {
            question: '그라데이션을 텍스트에 적용할 수 있나요?',
            answer: '가능합니다. background로 그라데이션을 깐 뒤 background-clip: text와 color: transparent를 함께 적용하면 글자 안에 그라데이션이 채워집니다. 단, 작은 폰트에서는 색 전환이 잘 보이지 않으므로 굵고 큰 헤딩에 사용하는 것이 효과적입니다.',
          },
        ]}
      />
    </div>
  );
}
