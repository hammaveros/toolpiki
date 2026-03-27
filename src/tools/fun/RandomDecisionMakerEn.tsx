'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';
import { ResultShareButtonsEn } from '@/components/share/ResultShareButtonsEn';
import { siteConfig } from '@/data/site';
import { FaqSection } from '@/components/ui/FaqItem';

type DecisionType = 'yesno' | 'custom' | 'number' | 'coin';

export function RandomDecisionMakerEn() {
  const [type, setType] = useState<DecisionType>('yesno');
  const [customOptions, setCustomOptions] = useState('');
  const [numberMin, setNumberMin] = useState(1);
  const [numberMax, setNumberMax] = useState(100);
  const [result, setResult] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const makeDecision = () => {
    setIsAnimating(true);
    setResult(null);

    let count = 0;
    const maxCount = 10;
    const interval = setInterval(() => {
      count++;

      const tempResult = getRandomResult();
      setResult(tempResult);

      if (count >= maxCount) {
        clearInterval(interval);
        const finalResult = getRandomResult();
        setResult(finalResult);
        setHistory((prev) => [finalResult, ...prev].slice(0, 10));
        setIsAnimating(false);
      }
    }, 100);
  };

  const getRandomResult = (): string => {
    switch (type) {
      case 'yesno':
        return Math.random() < 0.5 ? '✅ YES' : '❌ NO';

      case 'coin':
        return Math.random() < 0.5 ? '🪙 Heads' : '🪙 Tails';

      case 'number':
        const num = Math.floor(Math.random() * (numberMax - numberMin + 1)) + numberMin;
        return `🔢 ${num}`;

      case 'custom':
        const options = customOptions
          .split('\n')
          .map((o) => o.trim())
          .filter((o) => o);
        if (options.length === 0) return 'Enter options';
        return `🎯 ${options[Math.floor(Math.random() * options.length)]}`;

      default:
        return '';
    }
  };

  const types: { key: DecisionType; label: string; icon: string }[] = [
    { key: 'yesno', label: 'Yes/No', icon: '✅❌' },
    { key: 'coin', label: 'Coin Flip', icon: '🪙' },
    { key: 'number', label: 'Number', icon: '🔢' },
    { key: 'custom', label: 'Custom', icon: '✏️' },
  ];

  const getShareUrl = () => {
    if (!result) return '';
    const data = { type, result };
    const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
    return `${siteConfig.url}/en/tools/random-decision#share=${encoded}`;
  };

  // Restore shared data from URL hash
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (hash.startsWith('#share=')) {
      try {
        const decoded = decodeURIComponent(atob(hash.slice(7)));
        const parsed = JSON.parse(decoded);
        if (parsed.type && parsed.result) {
          setType(parsed.type);
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
      {/* Type Selection */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {types.map((t) => (
          <button
            key={t.key}
            onClick={() => setType(t.key)}
            className={`p-3 rounded-lg text-center transition-all ${
              type === t.key
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <span className="text-xl block mb-1">{t.icon}</span>
            <span className="text-sm">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Options */}
      {type === 'number' && (
        <Card variant="bordered" className="p-4">
          <p className="text-sm font-medium mb-3">Number Range</p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={numberMin}
              onChange={(e) => setNumberMin(parseInt(e.target.value) || 0)}
              className="w-24 px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            />
            <span className="text-gray-500">to</span>
            <input
              type="number"
              value={numberMax}
              onChange={(e) => setNumberMax(parseInt(e.target.value) || 0)}
              className="w-24 px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
        </Card>
      )}

      {type === 'custom' && (
        <Textarea
          label="Enter options (one per line)"
          value={customOptions}
          onChange={(e) => setCustomOptions(e.target.value)}
          placeholder="Option 1&#10;Option 2&#10;Option 3"
          rows={5}
        />
      )}

      {/* Result Area */}
      <Card variant="bordered" className="p-4 md:p-6 text-center">
        <div className={`text-4xl font-bold mb-4 min-h-[60px] ${isAnimating ? 'animate-pulse' : ''}`}>
          {result || '?'}
        </div>
        <Button
          onClick={makeDecision}
          disabled={isAnimating || (type === 'custom' && !customOptions.trim())}
          size="lg"
          className="px-8"
        >
          {isAnimating ? 'Deciding...' : 'Decide!'}
        </Button>
        {result && !isAnimating && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <ResultShareButtonsEn
              url={getShareUrl()}
              title={`Random Decision: ${result}`}
              description="JSSpace Random Decision Maker"
            />
          </div>
        )}
      </Card>

      {/* History */}
      {history.length > 0 && (
        <Card variant="bordered" className="p-4">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-medium">Recent History</p>
            <Button variant="ghost" size="sm" onClick={() => setHistory([])}>
              Clear
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {history.map((h, idx) => (
              <span
                key={idx}
                className={`px-3 py-1 rounded-full text-sm ${
                  idx === 0
                    ? 'bg-blue-100 dark:bg-blue-900/30 font-medium'
                    : 'bg-gray-100 dark:bg-gray-800'
                }`}
              >
                {h}
              </span>
            ))}
          </div>
        </Card>
      )}

      <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
        <p>• Quick decisions when you are undecided</p>
        <p>• No obligation to follow the result</p>
      </div>
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          What is Random Decision Maker?
        </h2>
        <p className="text-sm leading-relaxed">
          Random Decision Maker is a utility that lets fate decide when you are stuck between options.
          It supports four modes: Yes/No decisions, coin flip, random number within a range, and custom choices you enter yourself.
          Perfect for breaking decision paralysis, settling debates, or just having fun with randomness.
          Results are animated for added excitement.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          Decision Modes
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-3 font-semibold">Mode</th>
                <th className="text-left py-2 px-3 font-semibold">Description</th>
                <th className="text-left py-2 px-3 font-semibold">Example Use</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-400">
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">Yes/No</td>
                <td className="py-2 px-3">Binary decision, 50/50 odds</td>
                <td className="py-2 px-3">Should I exercise? Call them?</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">Coin Flip</td>
                <td className="py-2 px-3">Heads or Tails</td>
                <td className="py-2 px-3">Who goes first? Team A vs B</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">Number</td>
                <td className="py-2 px-3">Random number in range</td>
                <td className="py-2 px-3">Pick 1-100 for lottery</td>
              </tr>
              <tr>
                <td className="py-2 px-3">Custom</td>
                <td className="py-2 px-3">Your own choices</td>
                <td className="py-2 px-3">Lunch menu, movie selection</td>
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
          <li>Use Custom mode with line-separated options for multiple choices</li>
          <li>Recent results are shown in history (up to 10)</li>
          <li>Share your decision result with friends</li>
          <li>Remember: you are not obligated to follow the result!</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Is the result truly random?',
            answer: 'We use JavaScript Math.random() which generates pseudo-random numbers. It is sufficiently random for casual use, but not suitable for cryptographic purposes.',
          },
          {
            question: 'Can I adjust the probability?',
            answer: 'In the Korean version, Yes/No mode allows adjusting the Yes probability. The English version uses a fair 50/50 split for all binary decisions.',
          },
          {
            question: 'Is my history saved?',
            answer: 'The last 10 results are displayed on screen but reset when you refresh the page. Use the share feature to save a specific result.',
          },
        ]}
      />
    </div>
  );
}
