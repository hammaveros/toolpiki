'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';
import { CopyButton } from '@/components/ui/CopyButton';
import { ResultShareButtonsEn } from '@/components/share/ResultShareButtonsEn';
import { FaqSection } from '@/components/ui/FaqItem';
import { encodeShareData, decodeShareData } from '@/lib/utils/share-encoding';

// Fisher-Yates shuffle (random)
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Seeded shuffle for reproducible results
function shuffleWithSeed(arr: string[], seed: number): string[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    seed = (seed * 16807 + 0) % 2147483647;
    const j = Math.floor((seed / 2147483647) * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const STORAGE_KEY = 'toolpiki-order-picker-en-items';

export function OrderPickerEn() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<string[] | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const [currentSeed, setCurrentSeed] = useState<number | null>(null);
  const [isFromShare, setIsFromShare] = useState(false);

  // Restore from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setInput(saved);
  }, []);

  // Save to localStorage on input change
  const handleInputChange = (value: string) => {
    setInput(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, value);
    }
  };

  const items = input
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s);

  const pickOrder = useCallback(() => {
    if (items.length < 2) return;

    setIsShuffling(true);
    setResult(null);
    setIsFromShare(false);

    const seed = Math.floor(Math.random() * 2147483646) + 1;

    // Shuffle animation (12 iterations)
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setResult(shuffle(items));

      if (count >= 12) {
        clearInterval(interval);
        const finalResult = shuffleWithSeed(items, seed);
        setResult(finalResult);
        setCurrentSeed(seed);
        setIsShuffling(false);
      }
    }, 100);
  }, [items]);

  const resultText = result
    ? result.map((item, idx) => `${idx + 1}. ${item}`).join('\n')
    : '';

  const getShareUrl = () => {
    if (!result || !currentSeed) return '';
    const data = { s: currentSeed, n: items };
    const encoded = encodeShareData(data);
    return `${window.location.origin}${window.location.pathname}#share=${encoded}`;
  };

  // Restore shared data from URL hash (seed-based reproduction)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (hash.startsWith('#share=')) {
      try {
        const parsed = decodeShareData(hash.slice(7));
        // New format: seed + names
        if (parsed.s && parsed.n && Array.isArray(parsed.n)) {
          const names = parsed.n as string[];
          const seed = parsed.s as number;
          setInput(names.join(', '));
          setResult(shuffleWithSeed(names, seed));
          setCurrentSeed(seed);
          setIsFromShare(true);
          window.history.replaceState(null, '', window.location.pathname);
        }
        // Legacy format compatibility
        else if (parsed.order && Array.isArray(parsed.order)) {
          setInput(parsed.order.join(', '));
          setResult(parsed.order);
          setIsFromShare(true);
          window.history.replaceState(null, '', window.location.pathname);
        }
      } catch {
        // ignore
      }
    }
  }, []);

  return (
    <div className="space-y-2">
      <Textarea
        label="Enter items (comma separated)"
        value={input}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder="Alice, Bob, Charlie, Diana"
        rows={3}
      />

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {items.length} items {items.length < 2 && items.length > 0 && '(minimum 2 required)'}
        </span>
        <Button
          onClick={pickOrder}
          disabled={items.length < 2 || isShuffling}
        >
          {isShuffling ? 'Shuffling...' : 'Pick Order'}
        </Button>
      </div>

      {result && (
        <Card variant="bordered" className="p-4">
          {isFromShare && (
            <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-700 dark:text-blue-300">
              🔗 Shared order result (items: {items.join(', ')})
            </div>
          )}
          <div>
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm font-medium">Result</p>
              <CopyButton text={resultText} />
            </div>
            <div className="space-y-2">
              {result.map((item, idx) => (
                <div
                  key={`${item}-${idx}`}
                  className={`flex items-center gap-3 p-2 rounded-lg ${
                    idx === 0
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 font-medium'
                      : 'bg-gray-50 dark:bg-gray-800'
                  }`}
                >
                  <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm ${
                    idx === 0
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}>
                    {idx + 1}
                  </span>
                  <span>{item}</span>
                  {idx === 0 && <span className="text-yellow-500 ml-auto">First</span>}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-wrap items-center gap-2">
            <ResultShareButtonsEn
              url={getShareUrl()}
              title={`Order Picker: #1 ${result[0]}`}
              description={`${result.length} items shuffled - ToolPiki`}
            />
          </div>
        </Card>
      )}

      <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
        <p>• Uses Fisher-Yates algorithm for fair shuffling</p>
        <p>• Great for meeting order, presentations, etc.</p>
      </div>

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          What is Order Picker?
        </h2>
        <p className="text-sm leading-relaxed">
          Order Picker is a tool that randomly shuffles items or names to determine a fair sequence.
          It uses the Fisher-Yates shuffle algorithm, mathematically proven to give every possible permutation an equal probability.
          Perfect for presentation order, game turns, meeting speaking order, audition sequences, and any situation where order might affect outcomes.
          Results can be shared via link for remote collaboration.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          Use Cases
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-3 font-semibold">Situation</th>
                <th className="text-left py-2 px-3 font-semibold">Examples</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-400">
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">Presentations</td>
                <td className="py-2 px-3">School/work presentations, seminar order</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">Game Turns</td>
                <td className="py-2 px-3">Board games, card games starting order</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">Judging/Evaluation</td>
                <td className="py-2 px-3">Auditions, competitions, interview order</td>
              </tr>
              <tr>
                <td className="py-2 px-3">Meetings</td>
                <td className="py-2 px-3">Speaking turns, idea sharing sequence</td>
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
          <li>Use commas to separate items for easy entry</li>
          <li>Minimum of 2 items required</li>
          <li>Click "Shuffle Again" to generate a new random order</li>
          <li>Use share feature to send results to team members</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Is the order truly fair and random?',
            answer: 'The Fisher-Yates algorithm is mathematically proven to give every possible permutation an equal probability. Whether first or last, each position has the same chance of being assigned.',
          },
          {
            question: 'How many items can I shuffle?',
            answer: 'There is no limit to the number of items you can add. However, for better display and usability, we recommend keeping the list at a reasonable size.',
          },
          {
            question: 'Can I save the results?',
            answer: 'Yes! Use the share button to generate a URL containing your results. Save or share this link to view the same results again anytime.',
          },
        ]}
      />
    </div>
  );
}
