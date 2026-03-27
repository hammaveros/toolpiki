'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';

type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';
type JustifyContent = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
type AlignItems = 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';
type AlignContent = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'stretch';

interface FlexItem {
  id: number;
  flexGrow: number;
  flexShrink: number;
  flexBasis: string;
  alignSelf: 'auto' | AlignItems;
  order: number;
}

let itemIdCounter = 1;

const createItem = (): FlexItem => ({
  id: itemIdCounter++,
  flexGrow: 0,
  flexShrink: 1,
  flexBasis: 'auto',
  alignSelf: 'auto',
  order: 0,
});

export function FlexboxPlayground() {
  const [direction, setDirection] = useState<FlexDirection>('row');
  const [justifyContent, setJustifyContent] = useState<JustifyContent>('flex-start');
  const [alignItems, setAlignItems] = useState<AlignItems>('stretch');
  const [flexWrap, setFlexWrap] = useState<FlexWrap>('nowrap');
  const [alignContent, setAlignContent] = useState<AlignContent>('stretch');
  const [gap, setGap] = useState(8);
  const [items, setItems] = useState<FlexItem[]>([createItem(), createItem(), createItem()]);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const containerCss = useMemo(() => {
    let css = `display: flex;\nflex-direction: ${direction};\njustify-content: ${justifyContent};\nalign-items: ${alignItems};\nflex-wrap: ${flexWrap};`;
    if (flexWrap !== 'nowrap') {
      css += `\nalign-content: ${alignContent};`;
    }
    if (gap > 0) {
      css += `\ngap: ${gap}px;`;
    }
    return css;
  }, [direction, justifyContent, alignItems, flexWrap, alignContent, gap]);

  const addItem = () => {
    setItems(prev => [...prev, createItem()]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(prev => prev.filter(item => item.id !== id));
      if (selectedItem === id) setSelectedItem(null);
    }
  };

  const updateItem = (id: number, key: keyof FlexItem, value: number | string) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, [key]: value } : item
    ));
  };

  const selected = items.find(i => i.id === selectedItem);

  return (
    <div className="space-y-6">
      {/* Container 설정 */}
      <Card variant="bordered" className="p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">컨테이너 설정</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">flex-direction</label>
            <select
              value={direction}
              onChange={(e) => setDirection(e.target.value as FlexDirection)}
              className="w-full px-2 py-1.5 text-sm border rounded dark:bg-gray-800 dark:border-gray-700"
            >
              <option value="row">row</option>
              <option value="row-reverse">row-reverse</option>
              <option value="column">column</option>
              <option value="column-reverse">column-reverse</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">justify-content</label>
            <select
              value={justifyContent}
              onChange={(e) => setJustifyContent(e.target.value as JustifyContent)}
              className="w-full px-2 py-1.5 text-sm border rounded dark:bg-gray-800 dark:border-gray-700"
            >
              <option value="flex-start">flex-start</option>
              <option value="flex-end">flex-end</option>
              <option value="center">center</option>
              <option value="space-between">space-between</option>
              <option value="space-around">space-around</option>
              <option value="space-evenly">space-evenly</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">align-items</label>
            <select
              value={alignItems}
              onChange={(e) => setAlignItems(e.target.value as AlignItems)}
              className="w-full px-2 py-1.5 text-sm border rounded dark:bg-gray-800 dark:border-gray-700"
            >
              <option value="flex-start">flex-start</option>
              <option value="flex-end">flex-end</option>
              <option value="center">center</option>
              <option value="stretch">stretch</option>
              <option value="baseline">baseline</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">flex-wrap</label>
            <select
              value={flexWrap}
              onChange={(e) => setFlexWrap(e.target.value as FlexWrap)}
              className="w-full px-2 py-1.5 text-sm border rounded dark:bg-gray-800 dark:border-gray-700"
            >
              <option value="nowrap">nowrap</option>
              <option value="wrap">wrap</option>
              <option value="wrap-reverse">wrap-reverse</option>
            </select>
          </div>
          {flexWrap !== 'nowrap' && (
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">align-content</label>
              <select
                value={alignContent}
                onChange={(e) => setAlignContent(e.target.value as AlignContent)}
                className="w-full px-2 py-1.5 text-sm border rounded dark:bg-gray-800 dark:border-gray-700"
              >
                <option value="flex-start">flex-start</option>
                <option value="flex-end">flex-end</option>
                <option value="center">center</option>
                <option value="space-between">space-between</option>
                <option value="space-around">space-around</option>
                <option value="stretch">stretch</option>
              </select>
            </div>
          )}
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">gap: {gap}px</label>
            <input
              type="range"
              min={0}
              max={32}
              value={gap}
              onChange={(e) => setGap(Number(e.target.value))}
              className="w-full mt-1"
            />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 미리보기 */}
        <Card variant="bordered" className="p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">미리보기</h3>
            <Button variant="secondary" size="sm" onClick={addItem}>
              + 아이템 추가
            </Button>
          </div>
          <div
            className="min-h-[300px] bg-gray-100 dark:bg-gray-800 rounded-lg p-4 border-2 border-dashed border-gray-300 dark:border-gray-600"
            style={{
              display: 'flex',
              flexDirection: direction,
              justifyContent: justifyContent,
              alignItems: alignItems,
              flexWrap: flexWrap,
              alignContent: alignContent,
              gap: gap,
            }}
          >
            {items.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item.id)}
                className={`flex items-center justify-center text-white font-bold text-sm cursor-pointer transition-all ${
                  selectedItem === item.id
                    ? 'ring-2 ring-blue-500 ring-offset-2'
                    : ''
                }`}
                style={{
                  minWidth: 60,
                  minHeight: 60,
                  padding: '12px 16px',
                  backgroundColor: `hsl(${(idx * 50) % 360}, 70%, 50%)`,
                  borderRadius: 8,
                  flexGrow: item.flexGrow,
                  flexShrink: item.flexShrink,
                  flexBasis: item.flexBasis,
                  alignSelf: item.alignSelf,
                  order: item.order,
                }}
              >
                {idx + 1}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            아이템을 클릭하여 개별 속성을 수정하세요
          </p>
        </Card>

        {/* 아이템 설정 */}
        <Card variant="bordered" className="p-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            {selected ? `아이템 ${items.findIndex(i => i.id === selected.id) + 1} 설정` : '아이템 선택'}
          </h3>
          {selected ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">flex-grow: {selected.flexGrow}</label>
                <input
                  type="range"
                  min={0}
                  max={5}
                  value={selected.flexGrow}
                  onChange={(e) => updateItem(selected.id, 'flexGrow', Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">flex-shrink: {selected.flexShrink}</label>
                <input
                  type="range"
                  min={0}
                  max={5}
                  value={selected.flexShrink}
                  onChange={(e) => updateItem(selected.id, 'flexShrink', Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">flex-basis</label>
                <input
                  type="text"
                  value={selected.flexBasis}
                  onChange={(e) => updateItem(selected.id, 'flexBasis', e.target.value)}
                  placeholder="auto, 100px, 50%..."
                  className="w-full px-2 py-1.5 text-sm border rounded dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">align-self</label>
                <select
                  value={selected.alignSelf}
                  onChange={(e) => updateItem(selected.id, 'alignSelf', e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border rounded dark:bg-gray-800 dark:border-gray-700"
                >
                  <option value="auto">auto</option>
                  <option value="flex-start">flex-start</option>
                  <option value="flex-end">flex-end</option>
                  <option value="center">center</option>
                  <option value="stretch">stretch</option>
                  <option value="baseline">baseline</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">order: {selected.order}</label>
                <input
                  type="range"
                  min={-3}
                  max={3}
                  value={selected.order}
                  onChange={(e) => updateItem(selected.id, 'order', Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => removeItem(selected.id)}
                className="w-full text-red-500"
                disabled={items.length <= 1}
              >
                아이템 삭제
              </Button>
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              미리보기에서 아이템을 클릭하면 개별 속성을 수정할 수 있습니다.
            </p>
          )}
        </Card>
      </div>

      {/* CSS 코드 */}
      <Card variant="bordered" className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">CSS 코드</h3>
          <CopyButton text={containerCss} />
        </div>
        <pre className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-mono overflow-x-auto whitespace-pre-wrap">
          {containerCss}
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
          📦 Flexbox Playground란?
        </h2>
        <p className="text-sm leading-relaxed">
          Flexbox Playground는 CSS Flexbox 레이아웃을 시각적으로 학습하고 실험할 수 있는 인터랙티브 도구입니다.
          컨테이너의 flex-direction, justify-content, align-items 등 주요 속성과
          개별 아이템의 flex-grow, flex-shrink, order 등을 실시간으로 조절하면서
          각 속성이 레이아웃에 미치는 영향을 즉시 확인할 수 있습니다.
          설정한 속성은 CSS 코드로 자동 생성되어 바로 복사해서 사용할 수 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 주요 Flexbox 속성
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">속성</th>
                <th className="text-left py-2 px-2">적용 대상</th>
                <th className="text-left py-2 px-2">설명</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">flex-direction</td><td>컨테이너</td><td>주축 방향 (row, column)</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">justify-content</td><td>컨테이너</td><td>주축 정렬 (start, center, space-between)</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">align-items</td><td>컨테이너</td><td>교차축 정렬 (start, center, stretch)</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">flex-wrap</td><td>컨테이너</td><td>줄바꿈 여부 (nowrap, wrap)</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">flex-grow</td><td>아이템</td><td>남은 공간 배분 비율</td></tr>
              <tr><td className="py-2 px-2 font-mono">order</td><td>아이템</td><td>배치 순서 변경</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Flexbox 활용 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>중앙 정렬</strong>: justify-content: center + align-items: center로 완벽한 중앙 배치</li>
          <li><strong>균등 배분</strong>: space-between으로 첫/끝 요소를 양 끝에, 나머지를 균등 배치</li>
          <li><strong>반응형 그리드</strong>: flex-wrap: wrap + flex-basis로 자동 줄바꿈 그리드 구현</li>
          <li><strong>순서 변경</strong>: order 속성으로 HTML 순서와 다른 시각적 순서 적용</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: 'Flexbox와 Grid의 차이점은 무엇인가요?',
            answer: 'Flexbox는 1차원(행 또는 열) 레이아웃에 적합하고, Grid는 2차원(행과 열 동시) 레이아웃에 적합합니다. 네비게이션 바는 Flexbox, 전체 페이지 레이아웃은 Grid가 더 적합한 경우가 많습니다.',
          },
          {
            question: 'flex-grow와 flex-shrink의 차이는 무엇인가요?',
            answer: 'flex-grow는 여유 공간이 있을 때 아이템이 늘어나는 비율, flex-shrink는 공간이 부족할 때 아이템이 줄어드는 비율을 결정합니다.',
          },
          {
            question: 'align-content는 언제 사용하나요?',
            answer: 'flex-wrap: wrap 상태에서 여러 줄이 생겼을 때, 줄 간의 간격과 정렬을 조절합니다. 한 줄일 때는 효과가 없습니다.',
          },
        ]}
      />
    </div>
  );
}
