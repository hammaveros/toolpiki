'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';
import { ResultShareButtonsEn } from '@/components/share/ResultShareButtonsEn';
import { FaqSection } from '@/components/ui/FaqItem';
import { encodeShareData, decodeShareData } from '@/lib/utils/share-encoding';

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
    const encoded = encodeShareData(data);
    return `${window.location.origin}${window.location.pathname}#share=${encoded}`;
  };

  // Restore shared data from URL hash
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (hash.startsWith('#share=')) {
      try {
        const parsed = decodeShareData(hash.slice(7));
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
              description="ToolPiki Random Decision Maker"
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
      <SeoContent />
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
          <strong className="text-gray-900 dark:text-white">Random Decision Maker lets fate decide when you are stuck between options.</strong>{' '}
          Supports four modes — <strong>Yes/No</strong>, <strong>coin flip</strong>, <strong>random number range</strong>, and <strong>custom choices</strong>.
          Perfect for breaking decision paralysis, settling debates, or having fun with randomness.
          Results are animated for added excitement.
        </p>

        <div className="mt-4 rounded-lg bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900 p-4 text-sm">
          <p className="font-semibold text-violet-900 dark:text-violet-200 mb-1">🧠 Decision Fatigue</p>
          <p className="text-violet-800 dark:text-violet-300">
            Adults make <strong>~35,000 decisions per day</strong>. Outsourcing trivial picks to randomness frees mental bandwidth for what matters.
          </p>
        </div>
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
          Why Coin Flipping Works: A Quick Look at Decision Science
        </h2>
        <p className="text-sm leading-relaxed mb-3">
          Behavioral economists call the modern struggle with everyday choices "decision fatigue."
          A widely cited Cornell study estimated that the average adult makes around 35,000 decisions per day, and an even more famous Columbia "jam study" showed that shoppers facing 24 flavors of jam were 10 times less likely to buy than those choosing from only 6.
          Outsourcing trivial picks to randomness frees up mental bandwidth for decisions that actually matter — your career path, a relationship, a major purchase.
          Economist Steven Levitt even ran a real experiment where over 20,000 people flipped digital coins to make big life decisions; six months later, those who acted on "heads" reported being happier on average than those who did not.
        </p>
        <ul className="text-sm space-y-1 list-disc list-inside text-gray-600 dark:text-gray-400">
          <li><strong>Lunch decision</strong>: Narrow to 4-5 options and roll once — saves about 2 minutes per meal</li>
          <li><strong>Workout or rest?</strong>: A simple Yes/No flip removes the procrastination spiral</li>
          <li><strong>Which task first?</strong>: Add 3-5 tasks in Custom mode and let randomness pick the starting point</li>
          <li><strong>Which movie to watch</strong>: Type the shortlist and stop the endless scroll on streaming services</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          Tips for Better Random Picks
        </h2>
        <ul className="text-sm space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
          <li><strong>The "gut check" trick</strong>: If the result disappoints you, that disappointment reveals what you actually wanted. Use the flip as a mirror.</li>
          <li><strong>Custom mode formatting</strong>: One option per line, 3-7 options is the sweet spot for clarity and decision speed.</li>
          <li><strong>Number range tips</strong>: For raffles, start at 1 and use the actual ticket count as the max. For dice rolls, 1-6 or 1-20 (D&amp;D style) are common.</li>
          <li><strong>Coin statistics</strong>: After 30+ flips the heads/tails distribution converges close to 50:50 — a clean demonstration of the law of large numbers.</li>
          <li><strong>Stay reasonable</strong>: Avoid using random picks for ethical, legal, or major financial decisions. This is a tool for low-stakes everyday choices.</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Is the result truly random?',
            answer: 'We use JavaScript Math.random() which generates pseudo-random numbers (PRNG). It is sufficiently random for casual decisions, games, and demos, but not suitable for cryptographic, security, or gambling-grade randomness — those use cases require crypto.getRandomValues() or hardware RNGs.',
          },
          {
            question: 'Why does my result feel "stuck" on one side?',
            answer: 'Streaks of 4-5 identical results are statistically normal in true randomness. A genuinely random coin will produce a run of 5+ heads roughly once every 32 flips. Humans tend to misjudge randomness — we expect alternation, but real random data clusters.',
          },
          {
            question: 'Can I weight the choices unevenly?',
            answer: 'Not directly in this tool — Custom mode treats every option equally. If you need weighted picks (e.g., 70% A, 30% B), use the Roulette Selector tool which supports weights from 1 to 1000.',
          },
          {
            question: 'Is my history saved across sessions?',
            answer: 'No — the last 10 results live only in browser memory and clear on refresh. If you need to keep a specific outcome, hit the Share button to encode it into a permanent URL you can bookmark.',
          },
        ]}
      />
    </div>
  );
}
