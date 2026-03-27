'use client';

import { useState, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import { FaqSection } from '@/components/ui/FaqItem';

type Mode = 'number' | 'list';

interface PickResult {
  values: (number | string)[];
  timestamp: Date;
}

function getSecureRandom(): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] / (0xffffffff + 1);
}

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(getSecureRandom() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function RandomPickerEn() {
  const [mode, setMode] = useState<Mode>('number');

  // Number mode
  const [minNum, setMinNum] = useState('1');
  const [maxNum, setMaxNum] = useState('100');
  const [pickCount, setPickCount] = useState('6');
  const [allowDuplicates, setAllowDuplicates] = useState(false);

  // List mode
  const [listInput, setListInput] = useState('');
  const [listPickCount, setListPickCount] = useState('1');

  // Results
  const [results, setResults] = useState<PickResult[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const pickNumbers = useCallback(() => {
    const min = parseInt(minNum) || 1;
    const max = parseInt(maxNum) || 100;
    const count = parseInt(pickCount) || 1;

    if (min > max) return;

    const range = max - min + 1;
    if (!allowDuplicates && count > range) return;

    setIsAnimating(true);

    setTimeout(() => {
      let picked: number[] = [];

      if (allowDuplicates) {
        for (let i = 0; i < count; i++) {
          picked.push(Math.floor(getSecureRandom() * range) + min);
        }
      } else {
        const pool = Array.from({ length: range }, (_, i) => i + min);
        const shuffled = shuffleArray(pool);
        picked = shuffled.slice(0, count).sort((a, b) => a - b);
      }

      setResults(prev => [{
        values: picked,
        timestamp: new Date()
      }, ...prev.slice(0, 9)]);

      setIsAnimating(false);
    }, 500);
  }, [minNum, maxNum, pickCount, allowDuplicates]);

  const pickFromList = useCallback(() => {
    const items = listInput
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (items.length === 0) return;

    const count = Math.min(parseInt(listPickCount) || 1, items.length);

    setIsAnimating(true);

    setTimeout(() => {
      const shuffled = shuffleArray(items);
      const picked = shuffled.slice(0, count);

      setResults(prev => [{
        values: picked,
        timestamp: new Date()
      }, ...prev.slice(0, 9)]);

      setIsAnimating(false);
    }, 500);
  }, [listInput, listPickCount]);

  const clearResults = () => setResults([]);

  return (
    <div className="space-y-2">
      {/* Mode selection */}
      <div className="flex gap-2">
        {(['number', 'list'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setResults([]); }}
            className={cn(
              'flex-1 py-2 px-4 rounded-lg font-medium transition-colors text-sm',
              mode === m
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            )}
          >
            {m === 'number' && 'Number Draw'}
            {m === 'list' && 'List Draw'}
          </button>
        ))}
      </div>

      {/* Number draw */}
      {mode === 'number' && (
        <Card variant="bordered" className="p-5">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Minimum
                </label>
                <Input
                  type="number"
                  value={minNum}
                  onChange={(e) => setMinNum(e.target.value)}
                  placeholder="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Maximum
                </label>
                <Input
                  type="number"
                  value={maxNum}
                  onChange={(e) => setMaxNum(e.target.value)}
                  placeholder="100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Count to Pick
              </label>
              <Input
                type="number"
                value={pickCount}
                onChange={(e) => setPickCount(e.target.value)}
                min="1"
                max="100"
                placeholder="6"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={allowDuplicates}
                onChange={(e) => setAllowDuplicates(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Allow duplicates
              </span>
            </label>

            <Button
              onClick={pickNumbers}
              className="w-full"
              disabled={isAnimating}
            >
              {isAnimating ? 'Drawing...' : 'Draw Numbers'}
            </Button>

            {/* Quick presets */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { setMinNum('1'); setMaxNum('100'); setPickCount('6'); setAllowDuplicates(false); }}
                className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                1-100 (6 picks)
              </button>
              <button
                onClick={() => { setMinNum('1'); setMaxNum('10'); setPickCount('1'); setAllowDuplicates(false); }}
                className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                1-10
              </button>
              <button
                onClick={() => { setMinNum('1'); setMaxNum('50'); setPickCount('5'); setAllowDuplicates(false); }}
                className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                1-50 (5 picks)
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* List draw */}
      {mode === 'list' && (
        <Card variant="bordered" className="p-5">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Items (one per line)
              </label>
              <textarea
                value={listInput}
                onChange={(e) => setListInput(e.target.value)}
                placeholder={"John\nJane\nBob\nAlice"}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Count to Pick
              </label>
              <Input
                type="number"
                value={listPickCount}
                onChange={(e) => setListPickCount(e.target.value)}
                min="1"
                placeholder="1"
              />
            </div>

            <Button
              onClick={pickFromList}
              className="w-full"
              disabled={isAnimating || listInput.trim().length === 0}
            >
              {isAnimating ? 'Drawing...' : 'Draw Items'}
            </Button>
          </div>
        </Card>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Results
            </h3>
            <button
              onClick={clearResults}
              className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Clear History
            </button>
          </div>

          {results.map((result, idx) => (
            <Card
              key={idx}
              variant="bordered"
              className={cn(
                'p-4',
                idx === 0 && 'ring-2 ring-blue-500'
              )}
            >
              <div className="flex flex-wrap gap-2 justify-center mb-2">
                {result.values.map((value, i) => (
                  <div
                    key={i}
                    className={cn(
                      'min-w-[48px] h-12 flex items-center justify-center rounded-full font-bold text-lg',
                      typeof value === 'number'
                        ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                        : 'bg-gradient-to-br from-green-500 to-teal-600 text-white px-4'
                    )}
                  >
                    {value}
                  </div>
                ))}
              </div>
              <div className="text-xs text-center text-gray-400">
                {result.timestamp.toLocaleTimeString()}
              </div>
            </Card>
          ))}
        </div>
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
          🎲 What is Random Picker?
        </h2>
        <p className="text-sm leading-relaxed">
          Random Picker generates random numbers within a specified range or selects items from a custom list.
          Perfect for lottery number generation, raffle draws, winner selection, and determining order.
          Uses cryptographically secure random number generation (crypto.getRandomValues) for truly unpredictable results.
          Keeps a history of up to 10 previous draws for reference.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 Draw Mode Comparison
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Mode</th>
                <th className="text-left py-2 px-2">Input</th>
                <th className="text-left py-2 px-2">Use Case</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Number Draw</td><td>Min~Max range, count</td><td>Lottery numbers, random games</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">List Draw</td><td>Items (one per line)</td><td>Winner selection, order picking</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Allow Duplicates</td><td>Number mode option</td><td>Dice simulation</td></tr>
              <tr><td className="py-2 px-2 font-medium">No Duplicates</td><td>Number mode default</td><td>Lottery, unique winners</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Usage Tips
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Quick presets</strong>: Use preset buttons for common ranges like 1-100 or 1-10</li>
          <li><strong>Team order</strong>: Enter team member names and pick presentation order</li>
          <li><strong>Prize draws</strong>: Input participant list and select number of winners</li>
          <li><strong>Task assignment</strong>: Enter task list and randomly distribute</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Are the results truly random?',
            answer: 'Yes, we use the crypto.getRandomValues() API which provides cryptographically secure random numbers. This is far more unpredictable and fair than Math.random().',
          },
          {
            question: 'Can the same number appear multiple times?',
            answer: 'In number mode, check "Allow duplicates" to enable repeated numbers. By default, all picked numbers are unique.',
          },
          {
            question: 'Where is the draw history stored?',
            answer: 'Draw history is stored only in browser memory. It clears when you refresh the page and is never sent to any server.',
          },
        ]}
      />
    </div>
  );
}
