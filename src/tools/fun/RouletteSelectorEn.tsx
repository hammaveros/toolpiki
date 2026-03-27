'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ResultShareButtonsEn } from '@/components/share/ResultShareButtonsEn';
import { siteConfig } from '@/data/site';
import { FaqSection } from '@/components/ui/FaqItem';

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
  '#BB8FCE', '#85C1E9', '#F8B500', '#00CED1'
];

interface RouletteItem {
  name: string;
  weight: number;
}

export function RouletteSelectorEn() {
  const [items, setItems] = useState<RouletteItem[]>([
    { name: 'Option 1', weight: 1 },
    { name: 'Option 2', weight: 1 },
    { name: 'Option 3', weight: 1 },
  ]);
  const [newItem, setNewItem] = useState('');
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Calculate total weight
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);

  const addItem = () => {
    if (!newItem.trim() || items.length >= 12) return;
    setItems([...items, { name: newItem.trim(), weight: 1 }]);
    setNewItem('');
  };

  const removeItem = (index: number) => {
    if (items.length <= 2) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: 'name' | 'weight', value: string | number) => {
    const newItems = [...items];
    if (field === 'name') {
      newItems[index].name = value as string;
    } else {
      newItems[index].weight = Math.max(1, Math.min(1000, Number(value) || 1));
    }
    setItems(newItems);
  };

  // Draw roulette
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = center - 10;

    ctx.clearRect(0, 0, size, size);

    let currentAngle = (rotation * Math.PI) / 180;

    items.forEach((item, i) => {
      // Calculate angle based on weight
      const sliceAngle = (item.weight / totalWeight) * 2 * Math.PI;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;

      // Pie slice
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text (hide if slice too small)
      if (sliceAngle > 0.3) {
        ctx.save();
        ctx.translate(center, center);
        ctx.rotate(startAngle + sliceAngle / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#000';
        ctx.font = 'bold 14px sans-serif';
        const text = item.name.length > 8 ? item.name.slice(0, 8) + '...' : item.name;
        ctx.fillText(text, radius - 20, 5);
        ctx.restore();
      }

      currentAngle = endAngle;
    });

    // Center circle
    ctx.beginPath();
    ctx.arc(center, center, 20, 0, 2 * Math.PI);
    ctx.fillStyle = '#333';
    ctx.fill();
  }, [items, rotation, totalWeight]);

  const spin = () => {
    if (isSpinning || items.length < 2) return;

    setIsSpinning(true);
    setResult(null);

    const spins = 5 + Math.random() * 5;
    const extraDegrees = Math.random() * 360;
    const totalRotation = spins * 360 + extraDegrees;

    const startRotation = rotation;
    const duration = 4000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const eased = 1 - Math.pow(1 - progress, 3);
      const currentRotation = startRotation + totalRotation * eased;

      setRotation(currentRotation);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);

        // Arrow is on right (0 degrees, 3 o'clock position)
        const finalRotation = currentRotation % 360;
        const adjustedRotation = (360 - finalRotation) % 360;
        const targetAngle = adjustedRotation / 360; // Convert to 0~1 ratio

        // Calculate which item based on weights
        let accumulatedWeight = 0;
        let selectedIndex = 0;
        for (let i = 0; i < items.length; i++) {
          accumulatedWeight += items[i].weight / totalWeight;
          if (targetAngle < accumulatedWeight) {
            selectedIndex = i;
            break;
          }
        }

        setResult(items[selectedIndex].name);
      }
    };

    requestAnimationFrame(animate);
  };

  const getShareUrl = () => {
    if (!result) return '';
    const data = { items, result };
    const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
    return `${siteConfig.url}/en/tools/roulette-selector-en#share=${encoded}`;
  };

  // Restore shared data from URL hash
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (hash.startsWith('#share=')) {
      try {
        const decoded = decodeURIComponent(atob(hash.slice(7)));
        const parsed = JSON.parse(decoded);
        if (parsed.items && parsed.result) {
          // Backward compatibility (string[] → RouletteItem[])
          const loadedItems = parsed.items.map((item: string | RouletteItem) =>
            typeof item === 'string' ? { name: item, weight: 1 } : item
          );
          setItems(loadedItems);
          setResult(parsed.result);
          window.history.replaceState(null, '', window.location.pathname);
        }
      } catch {
        // ignore
      }
    }
  }, []);

  return (
    <div className="space-y-2">
      {/* Roulette */}
      <div className="relative flex justify-center">
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          className="rounded-full shadow-lg"
        />
        {/* Arrow */}
        <div className="absolute right-[calc(50%-160px)] top-1/2 -translate-y-1/2">
          <div className="w-0 h-0 border-t-[15px] border-t-transparent border-r-[25px] border-r-red-500 border-b-[15px] border-b-transparent" />
        </div>
      </div>

      {/* Result + Button */}
      <Card variant="bordered" className="p-4 md:p-6 text-center">
        <div className={`text-3xl font-bold mb-4 min-h-[50px] flex items-center justify-center ${isSpinning ? 'animate-pulse' : ''}`}>
          {result ? (
            <span className="text-blue-600 dark:text-blue-400">🎉 {result}</span>
          ) : (
            <span className="text-gray-400">?</span>
          )}
        </div>
        {result && !isSpinning && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Selected from {items.length} items
            </p>
          </div>
        )}
        <Button
          onClick={spin}
          disabled={isSpinning || items.length < 2}
          size="lg"
          className="px-8"
        >
          {isSpinning ? 'Spinning...' : '🎰 Spin!'}
        </Button>
        {result && !isSpinning && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <ResultShareButtonsEn
              url={getShareUrl()}
              title={`Roulette Result: ${result}`}
              description={`Selected from ${items.length} items - ToolPiki`}
            />
          </div>
        )}
      </Card>

      {/* Item management */}
      <Card variant="bordered" className="p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium">Items ({items.length}/12)</p>
          <p className="text-xs text-gray-500">Weight: 1~1000 (higher = more likely)</p>
        </div>

        <div className="space-y-2 mb-3">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[idx % COLORS.length] }}
              />
              <Input
                value={item.name}
                onChange={(e) => updateItem(idx, 'name', e.target.value)}
                className="flex-1"
              />
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={1}
                  max={1000}
                  value={item.weight}
                  onChange={(e) => updateItem(idx, 'weight', e.target.value)}
                  className="w-16 h-9 text-center text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                />
                <span className="text-xs text-gray-400 w-12">
                  ({Math.round((item.weight / totalWeight) * 100)}%)
                </span>
              </div>
              {items.length > 2 && (
                <button
                  onClick={() => removeItem(idx)}
                  className="text-gray-400 hover:text-red-500 px-2"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Add new item"
            onKeyDown={(e) => e.key === 'Enter' && addItem()}
            className="flex-1"
          />
          <Button onClick={addItem} disabled={items.length >= 12} size="sm">
            Add
          </Button>
        </div>
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
          🎰 What is Roulette Selector?
        </h2>
        <p className="text-sm leading-relaxed">
          Roulette Selector is a visually engaging tool that randomly picks one option from your list of choices.
          Add up to 12 items and watch the colorful wheel spin with smooth animation until it lands on a winner.
          You can set weights (1~1000) for each item to precisely control the winning probability.
          Perfect for lunch decisions, duty assignments, prize draws, presentation order, and more.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          Weight Examples
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-3 font-semibold">Situation</th>
                <th className="text-left py-2 px-3 font-semibold">Setup Example</th>
                <th className="text-left py-2 px-3 font-semibold">Effect</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-400">
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">Prize Draw</td>
                <td className="py-2 px-3">1st(1), 2nd(3), 3rd(6)</td>
                <td className="py-2 px-3">Lower prizes more frequent</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">Preferences</td>
                <td className="py-2 px-3">Favorite(5), Dislike(1)</td>
                <td className="py-2 px-3">Favorites win more often</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">Soft Penalties</td>
                <td className="py-2 px-3">Skip(8), Light(5), Hard(1)</td>
                <td className="py-2 px-3">Hard penalties rarely occur</td>
              </tr>
              <tr>
                <td className="py-2 px-3">Fair Draw</td>
                <td className="py-2 px-3">All items weight 1</td>
                <td className="py-2 px-3">Equal probability (default)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          Tips
        </h2>
        <ul className="text-sm space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
          <li>Higher weight means larger pie slice and higher winning probability</li>
          <li>The (%) next to weight shows actual winning probability</li>
          <li>For equal chances, set all items to the same weight</li>
          <li>Minimum 2, maximum 12 items can be added</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'How does the weight system work?',
            answer: 'Weight determines the relative probability of each item winning. For example, if A has weight 2 and B has weight 1, A wins about 67% of the time and B wins about 33%.',
          },
          {
            question: 'How do I make it equal probability?',
            answer: 'Set all items to the same weight (e.g., all 1). With N items, each will have exactly 1/N probability.',
          },
          {
            question: 'Why is the weight range 1~1000?',
            answer: 'The wide range allows for precise probability control. For example, to express 0.1% probability, you can set a 1:999 ratio.',
          },
        ]}
      />
    </div>
  );
}
