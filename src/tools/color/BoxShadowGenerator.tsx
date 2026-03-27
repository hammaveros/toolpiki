'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';

interface Shadow {
  id: number;
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
}

const presets = [
  { name: '기본', shadows: [{ offsetX: 4, offsetY: 4, blur: 10, spread: 0, color: '#000000', opacity: 20, inset: false }] },
  { name: '소프트', shadows: [{ offsetX: 0, offsetY: 10, blur: 40, spread: 0, color: '#000000', opacity: 10, inset: false }] },
  { name: '하드', shadows: [{ offsetX: 8, offsetY: 8, blur: 0, spread: 0, color: '#000000', opacity: 30, inset: false }] },
  { name: '네온', shadows: [{ offsetX: 0, offsetY: 0, blur: 20, spread: 5, color: '#00ff88', opacity: 80, inset: false }] },
  { name: '인셋', shadows: [{ offsetX: 4, offsetY: 4, blur: 10, spread: 0, color: '#000000', opacity: 30, inset: true }] },
  { name: '레이어드', shadows: [
    { offsetX: 0, offsetY: 4, blur: 6, spread: -1, color: '#000000', opacity: 10, inset: false },
    { offsetX: 0, offsetY: 10, blur: 15, spread: -3, color: '#000000', opacity: 10, inset: false },
    { offsetX: 0, offsetY: 20, blur: 25, spread: -5, color: '#000000', opacity: 10, inset: false },
  ]},
];

let shadowIdCounter = 1;

export function BoxShadowGenerator() {
  const [shadows, setShadows] = useState<Shadow[]>([
    { id: shadowIdCounter++, offsetX: 4, offsetY: 4, blur: 10, spread: 0, color: '#000000', opacity: 20, inset: false }
  ]);
  const [bgColor, setBgColor] = useState('#f3f4f6');
  const [boxColor, setBoxColor] = useState('#ffffff');
  const [boxSize, setBoxSize] = useState(150);
  const [borderRadius, setBorderRadius] = useState(12);

  const cssValue = useMemo(() => {
    return shadows.map(s => {
      const r = parseInt(s.color.slice(1, 3), 16);
      const g = parseInt(s.color.slice(3, 5), 16);
      const b = parseInt(s.color.slice(5, 7), 16);
      const a = s.opacity / 100;
      return `${s.inset ? 'inset ' : ''}${s.offsetX}px ${s.offsetY}px ${s.blur}px ${s.spread}px rgba(${r}, ${g}, ${b}, ${a})`;
    }).join(', ');
  }, [shadows]);

  const updateShadow = (id: number, key: keyof Shadow, value: number | string | boolean) => {
    setShadows(prev => prev.map(s => s.id === id ? { ...s, [key]: value } : s));
  };

  const addShadow = () => {
    setShadows(prev => [...prev, {
      id: shadowIdCounter++,
      offsetX: 0, offsetY: 4, blur: 10, spread: 0, color: '#000000', opacity: 20, inset: false
    }]);
  };

  const removeShadow = (id: number) => {
    if (shadows.length > 1) {
      setShadows(prev => prev.filter(s => s.id !== id));
    }
  };

  const applyPreset = (preset: typeof presets[0]) => {
    setShadows(preset.shadows.map(s => ({ ...s, id: shadowIdCounter++ })));
  };

  const copyCode = `box-shadow: ${cssValue};`;

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
          <div
            className="flex items-center justify-center min-h-[300px] rounded-lg transition-colors"
            style={{ backgroundColor: bgColor }}
          >
            <div
              style={{
                width: boxSize,
                height: boxSize,
                backgroundColor: boxColor,
                borderRadius: borderRadius,
                boxShadow: cssValue,
                transition: 'all 0.2s ease',
              }}
            />
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400">배경색</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="flex-1 text-xs px-2 py-1 border rounded dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400">박스색</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={boxColor}
                  onChange={(e) => setBoxColor(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={boxColor}
                  onChange={(e) => setBoxColor(e.target.value)}
                  className="flex-1 text-xs px-2 py-1 border rounded dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400">크기</label>
              <input
                type="range"
                min={50}
                max={250}
                value={boxSize}
                onChange={(e) => setBoxSize(Number(e.target.value))}
                className="w-full mt-2"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400">모서리</label>
              <input
                type="range"
                min={0}
                max={75}
                value={borderRadius}
                onChange={(e) => setBorderRadius(Number(e.target.value))}
                className="w-full mt-2"
              />
            </div>
          </div>
        </Card>

        {/* 그림자 설정 */}
        <div className="space-y-4">
          {shadows.map((shadow, idx) => (
            <Card key={shadow.id} variant="bordered" className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  그림자 {idx + 1}
                </h3>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1 text-xs">
                    <input
                      type="checkbox"
                      checked={shadow.inset}
                      onChange={(e) => updateShadow(shadow.id, 'inset', e.target.checked)}
                      className="w-4 h-4"
                    />
                    Inset
                  </label>
                  {shadows.length > 1 && (
                    <button
                      onClick={() => removeShadow(shadow.id)}
                      className="text-red-500 hover:text-red-600 text-sm"
                    >
                      삭제
                    </button>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">X 오프셋</label>
                  <input
                    type="range"
                    min={-50}
                    max={50}
                    value={shadow.offsetX}
                    onChange={(e) => updateShadow(shadow.id, 'offsetX', Number(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">{shadow.offsetX}px</span>
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">Y 오프셋</label>
                  <input
                    type="range"
                    min={-50}
                    max={50}
                    value={shadow.offsetY}
                    onChange={(e) => updateShadow(shadow.id, 'offsetY', Number(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">{shadow.offsetY}px</span>
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">흐림</label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={shadow.blur}
                    onChange={(e) => updateShadow(shadow.id, 'blur', Number(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">{shadow.blur}px</span>
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">확산</label>
                  <input
                    type="range"
                    min={-20}
                    max={50}
                    value={shadow.spread}
                    onChange={(e) => updateShadow(shadow.id, 'spread', Number(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">{shadow.spread}px</span>
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">투명도</label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={shadow.opacity}
                    onChange={(e) => updateShadow(shadow.id, 'opacity', Number(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">{shadow.opacity}%</span>
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">색상</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="color"
                      value={shadow.color}
                      onChange={(e) => updateShadow(shadow.id, 'color', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={shadow.color}
                      onChange={(e) => updateShadow(shadow.id, 'color', e.target.value)}
                      className="flex-1 text-xs px-2 py-1 border rounded dark:bg-gray-800 dark:border-gray-700"
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
          <Button variant="secondary" onClick={addShadow} className="w-full">
            + 그림자 추가
          </Button>
        </div>
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
          🎨 Box Shadow 생성기란?
        </h2>
        <p className="text-sm leading-relaxed">
          Box Shadow 생성기는 CSS box-shadow 속성을 시각적으로 편집하고 실시간 미리보기를 제공하는 도구입니다.
          X/Y 오프셋, 흐림, 확산, 색상, 투명도를 슬라이더로 조절하며 여러 그림자를 레이어링할 수 있습니다.
          소프트 그림자, 하드 그림자, 네온 효과, 인셋 등 다양한 프리셋으로 빠르게 시작하고 커스터마이즈할 수 있습니다.
          생성된 CSS 코드는 복사 버튼으로 바로 가져갈 수 있어 개발 워크플로우에 즉시 적용 가능합니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 그림자 속성 가이드
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">속성</th>
                <th className="text-left py-2 px-2">설명</th>
                <th className="text-left py-2 px-2">권장 값</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">X 오프셋</td><td>수평 방향 이동</td><td>-20px ~ 20px (일반적)</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Y 오프셋</td><td>수직 방향 이동</td><td>4px ~ 16px (자연스러운 그림자)</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">흐림 (Blur)</td><td>그림자 퍼짐 정도</td><td>10px ~ 40px (소프트), 0 (하드)</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">확산 (Spread)</td><td>그림자 크기 증감</td><td>음수: 축소, 양수: 확장</td></tr>
              <tr><td className="py-2 px-2 font-medium">Inset</td><td>내부 그림자</td><td>버튼 눌림 효과, 입력 필드</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 그림자 디자인 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>레이어드 그림자</strong>: 여러 그림자를 쌓아 자연스러운 깊이감 표현</li>
          <li><strong>컬러 그림자</strong>: 검정 대신 요소 색상의 어두운 버전 사용</li>
          <li><strong>소프트 UI</strong>: 밝은 그림자 + 어두운 그림자 조합 (neumorphism)</li>
          <li><strong>호버 효과</strong>: Y 오프셋과 블러를 늘려 떠오르는 느낌</li>
          <li><strong>성능</strong>: 모바일에서 blur가 큰 그림자는 렌더링 비용이 높음</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '여러 그림자를 사용하는 이유는?',
            answer: '단일 그림자는 평면적으로 보입니다. 여러 그림자를 레이어링하면 가까운 그림자(작고 진함)와 먼 그림자(크고 흐림)가 결합되어 자연스러운 깊이감을 만듭니다.',
          },
          {
            question: 'spread 값이 음수면 어떻게 되나요?',
            answer: '그림자가 요소보다 작아집니다. 이를 활용해 요소 바로 아래에만 그림자를 표시하거나, 특정 방향으로만 그림자가 나타나도록 할 수 있습니다.',
          },
          {
            question: 'inset 그림자는 언제 사용하나요?',
            answer: '버튼의 눌린 상태, 입력 필드의 안쪽 테두리 효과, 카드의 오목한 영역 등을 표현할 때 사용합니다. 요소가 눌려 들어간 듯한 느낌을 줍니다.',
          },
        ]}
      />
    </div>
  );
}
