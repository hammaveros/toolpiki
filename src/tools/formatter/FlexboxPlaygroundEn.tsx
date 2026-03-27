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

export function FlexboxPlaygroundEn() {
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
      {/* Container Settings */}
      <Card variant="bordered" className="p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Container Settings</h3>
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
        {/* Preview */}
        <Card variant="bordered" className="p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Preview</h3>
            <Button variant="secondary" size="sm" onClick={addItem}>
              + Add Item
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
            Click on an item to edit its properties
          </p>
        </Card>

        {/* Item Settings */}
        <Card variant="bordered" className="p-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            {selected ? `Item ${items.findIndex(i => i.id === selected.id) + 1} Settings` : 'Select an Item'}
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
                Remove Item
              </Button>
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Click on an item in the preview to edit its individual properties.
            </p>
          )}
        </Card>
      </div>

      {/* CSS Code */}
      <Card variant="bordered" className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">CSS Code</h3>
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
          📦 What is Flexbox Playground?
        </h2>
        <p className="text-sm leading-relaxed">
          Flexbox Playground is an interactive tool for visually learning and experimenting with CSS Flexbox layouts.
          Adjust container properties like flex-direction, justify-content, and align-items,
          as well as individual item properties like flex-grow, flex-shrink, and order in real-time
          to see how each property affects the layout instantly.
          The configured properties are auto-generated as CSS code ready to copy and use.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 Key Flexbox Properties
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Property</th>
                <th className="text-left py-2 px-2">Applies To</th>
                <th className="text-left py-2 px-2">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">flex-direction</td><td>Container</td><td>Main axis direction (row, column)</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">justify-content</td><td>Container</td><td>Main axis alignment (start, center, space-between)</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">align-items</td><td>Container</td><td>Cross axis alignment (start, center, stretch)</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">flex-wrap</td><td>Container</td><td>Line wrapping (nowrap, wrap)</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">flex-grow</td><td>Item</td><td>Ratio for distributing extra space</td></tr>
              <tr><td className="py-2 px-2 font-mono">order</td><td>Item</td><td>Change visual order</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Flexbox Tips
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Perfect Centering</strong>: Use justify-content: center + align-items: center</li>
          <li><strong>Even Distribution</strong>: Use space-between to push first/last items to edges</li>
          <li><strong>Responsive Grid</strong>: Combine flex-wrap: wrap with flex-basis for auto-wrapping</li>
          <li><strong>Reorder Items</strong>: Use order property to change visual order without changing HTML</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'What is the difference between Flexbox and Grid?',
            answer: 'Flexbox is best for 1-dimensional layouts (row OR column), while Grid is best for 2-dimensional layouts (rows AND columns). Navigation bars suit Flexbox, while full page layouts often suit Grid better.',
          },
          {
            question: 'What is the difference between flex-grow and flex-shrink?',
            answer: 'flex-grow determines how much an item grows when there is extra space, while flex-shrink determines how much it shrinks when space is insufficient.',
          },
          {
            question: 'When should I use align-content?',
            answer: 'align-content controls spacing between multiple lines when flex-wrap: wrap is set and items wrap to new lines. It has no effect on single-line flex containers.',
          },
        ]}
      />
    </div>
  );
}
