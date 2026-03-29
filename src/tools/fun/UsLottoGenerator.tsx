'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { ResultShareButtonsEn } from '@/components/share/ResultShareButtonsEn';
import { cn } from '@/lib/utils/cn';
import { FaqSection } from '@/components/ui/FaqItem';
import { encodeShareData, decodeShareData } from '@/lib/utils/share-encoding';

type LottoType = 'powerball' | 'megamillions';

interface LottoConfig {
  name: string;
  mainCount: number;
  mainMax: number;
  specialName: string;
  specialMax: number;
  specialColor: string;
}

const LOTTO_CONFIGS: Record<LottoType, LottoConfig> = {
  powerball: {
    name: 'Powerball',
    mainCount: 5,
    mainMax: 69,
    specialName: 'Powerball',
    specialMax: 26,
    specialColor: 'bg-red-500 text-white',
  },
  megamillions: {
    name: 'Mega Millions',
    mainCount: 5,
    mainMax: 70,
    specialName: 'Mega Ball',
    specialMax: 25,
    specialColor: 'bg-yellow-400 text-yellow-900',
  },
};

interface LottoSet {
  id: number;
  type: LottoType;
  mainNumbers: number[];
  specialNumber: number;
}

const MAX_SETS = 10;
const MAX_HISTORY = 10;

function getSecureRandomNumbers(count: number, max: number): number[] {
  const available = Array.from({ length: max }, (_, i) => i + 1);
  const result: number[] = [];

  for (let i = 0; i < count && available.length > 0; i++) {
    let randomIndex: number;
    if (typeof window !== 'undefined' && window.crypto) {
      const array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      randomIndex = array[0] % available.length;
    } else {
      randomIndex = Math.floor(Math.random() * available.length);
    }
    result.push(available[randomIndex]);
    available.splice(randomIndex, 1);
  }

  return result;
}

function getSecureRandomNumber(max: number): number {
  if (typeof window !== 'undefined' && window.crypto) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return (array[0] % max) + 1;
  }
  return Math.floor(Math.random() * max) + 1;
}

function LottoBall({
  number,
  isSpecial = false,
  specialColor = ''
}: {
  number: number;
  isSpecial?: boolean;
  specialColor?: string;
}) {
  return (
    <div
      className={cn(
        'w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center',
        'font-bold text-base sm:text-lg transition-transform hover:scale-105',
        isSpecial
          ? specialColor
          : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white ring-1 ring-gray-200 dark:ring-gray-600'
      )}
    >
      {number}
    </div>
  );
}

export function UsLottoGenerator() {
  const [lottoType, setLottoType] = useState<LottoType>('powerball');
  const [setCount, setSetCount] = useState(1);
  const [sortNumbers, setSortNumbers] = useState(true);
  const [results, setResults] = useState<LottoSet[]>([]);
  const [history, setHistory] = useState<LottoSet[][]>([]);

  const config = LOTTO_CONFIGS[lottoType];

  const generateLotto = useCallback(() => {
    const newResults: LottoSet[] = [];

    for (let i = 0; i < setCount; i++) {
      let mainNumbers = getSecureRandomNumbers(config.mainCount, config.mainMax);
      if (sortNumbers) {
        mainNumbers = mainNumbers.sort((a, b) => a - b);
      }

      const specialNumber = getSecureRandomNumber(config.specialMax);

      newResults.push({
        id: Date.now() + i,
        type: lottoType,
        mainNumbers,
        specialNumber,
      });
    }

    setResults(newResults);
    setHistory(prev => [newResults, ...prev].slice(0, MAX_HISTORY));
  }, [setCount, sortNumbers, lottoType, config]);

  const formatForCopy = (sets: LottoSet[], multiline: boolean): string => {
    return sets.map(set => {
      const cfg = LOTTO_CONFIGS[set.type];
      const nums = set.mainNumbers.join(', ');
      return `${nums} + ${cfg.specialName}: ${set.specialNumber}`;
    }).join(multiline ? '\n' : ' | ');
  };

  const getShareUrl = () => {
    if (results.length === 0) return '';
    const data = {
      type: lottoType,
      sets: results.map(s => ({ main: s.mainNumbers, special: s.specialNumber })),
    };
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
        if (parsed.type && parsed.sets) {
          setLottoType(parsed.type);
          const restoredResults: LottoSet[] = parsed.sets.map((s: { main: number[]; special: number }, idx: number) => ({
            id: Date.now() + idx,
            type: parsed.type,
            mainNumbers: s.main,
            specialNumber: s.special,
          }));
          setResults(restoredResults);
          window.history.replaceState(null, '', window.location.pathname);
        }
      } catch {
        // ignore
      }
    }
  }, []);

  return (
    <div className="space-y-2">
      <Card variant="bordered" className="p-6">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-5">
          Select Lottery
        </h3>

        <div className="space-y-5">
          {/* Lottery Type */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setLottoType('powerball')}
              className={cn(
                'flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-colors min-h-[52px]',
                lottoType === 'powerball'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              )}
            >
              <div className="font-bold">Powerball</div>
              <div className="text-xs opacity-80">5/69 + 1/26</div>
            </button>
            <button
              type="button"
              onClick={() => setLottoType('megamillions')}
              className={cn(
                'flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-colors min-h-[52px]',
                lottoType === 'megamillions'
                  ? 'bg-yellow-500 text-yellow-900'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              )}
            >
              <div className="font-bold">Mega Millions</div>
              <div className="text-xs opacity-80">5/70 + 1/25</div>
            </button>
          </div>

          {/* Set Count */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Number of Sets
            </label>
            <div className="flex gap-2 flex-wrap">
              {[1, 3, 5, 10].map(count => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setSetCount(count)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors min-h-[44px]',
                    setCount === count
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  )}
                >
                  {count} {count === 1 ? 'set' : 'sets'}
                </button>
              ))}
            </div>
          </div>

          {/* Options */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={sortNumbers}
              onChange={(e) => setSortNumbers(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Sort numbers ascending</span>
          </label>
        </div>

        <Button
          onClick={generateLotto}
          size="lg"
          className="w-full mt-6"
        >
          Generate Numbers
        </Button>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <Card variant="bordered" className="p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              {config.name} Numbers
            </h3>
            <div className="flex gap-2">
              <CopyButton text={formatForCopy(results, false)} label="Copy" size="sm" />
            </div>
          </div>

          <div className="space-y-4">
            {results.map((set, index) => (
              <div
                key={set.id}
                className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                    #{index + 1}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {set.mainNumbers.map((num, i) => (
                    <LottoBall key={i} number={num} />
                  ))}
                  <span className="text-gray-400 dark:text-gray-500 font-medium mx-1">+</span>
                  <LottoBall
                    number={set.specialNumber}
                    isSpecial
                    specialColor={config.specialColor}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <ResultShareButtonsEn
              url={getShareUrl()}
              title={`${config.name} Numbers: ${results.length} ${results.length === 1 ? 'set' : 'sets'}`}
              description={`Generated with ToolPiki`}
            />
          </div>
        </Card>
      )}

      {/* History */}
      {history.length > 1 && (
        <Card variant="bordered" className="p-6">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-5">
            Previous Generations
          </h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {history.slice(1).map((sets, hIndex) => (
              <div
                key={hIndex}
                className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {LOTTO_CONFIGS[sets[0].type].name} - {sets.length} {sets.length === 1 ? 'set' : 'sets'}
                  </span>
                  <CopyButton text={formatForCopy(sets, true)} size="sm" />
                </div>
                <div className="space-y-1 font-mono text-gray-600 dark:text-gray-400">
                  {sets.map((set) => (
                    <div key={set.id}>
                      {set.mainNumbers.join(', ')} + {set.specialNumber}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Info */}
      <Card variant="bordered" className="p-6">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
          About US Lotteries
        </h3>
        <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">Powerball</h4>
            <p>Pick 5 numbers from 1-69 and 1 Powerball from 1-26. Drawings on Mon, Wed, Sat.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">Mega Millions</h4>
            <p>Pick 5 numbers from 1-70 and 1 Mega Ball from 1-25. Drawings on Tue, Fri.</p>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 pt-2 border-t border-gray-200 dark:border-gray-700">
            This tool generates random numbers only. All number combinations have equal probability.
            This is not a prediction tool and does not increase your chances of winning.
          </p>
        </div>
      </Card>
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🎰 What is US Lotto Generator?
        </h2>
        <p className="text-sm leading-relaxed">
          Generate random numbers for US lottery games including Powerball (5/69 + 1/26) and Mega Millions (5/70 + 1/25).
          Uses cryptographically secure random generation (crypto.getRandomValues) for truly unpredictable results.
          Create up to 10 sets at once and track your generation history.
          Remember, all number combinations have exactly the same odds of winning.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 US Lottery Comparison
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 pr-4 font-semibold text-gray-900 dark:text-white">Feature</th>
                <th className="text-left py-2 pr-4 font-semibold text-gray-900 dark:text-white">Powerball</th>
                <th className="text-left py-2 font-semibold text-gray-900 dark:text-white">Mega Millions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-400">
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4 font-medium">Main Numbers</td>
                <td className="py-2 pr-4">5 from 1-69</td>
                <td className="py-2">5 from 1-70</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4 font-medium">Special Ball</td>
                <td className="py-2 pr-4">1 from 1-26</td>
                <td className="py-2">1 from 1-25</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4 font-medium">Jackpot Odds</td>
                <td className="py-2 pr-4">1 in 292.2M</td>
                <td className="py-2">1 in 302.6M</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4 font-medium">Drawing Days</td>
                <td className="py-2 pr-4">Mon, Wed, Sat</td>
                <td className="py-2">Tue, Fri</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium">Ticket Price</td>
                <td className="py-2 pr-4">$2</td>
                <td className="py-2">$2</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Usage Tips
        </h2>
        <ul className="text-sm space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
          <li><strong>Sort ascending:</strong> Makes comparing with drawn numbers easier</li>
          <li><strong>Multiple sets:</strong> Generate up to 10 sets at once</li>
          <li><strong>Generation history:</strong> Last 10 generations automatically saved</li>
          <li><strong>Share results:</strong> Copy or share generated numbers with friends</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          { question: 'Are some numbers more likely to appear?', answer: 'No. Cryptographically secure random generation ensures all numbers have equal probability. Every combination has the same odds of winning.' },
          { question: 'Can I save my generated numbers?', answer: 'Yes, the last 10 generations are automatically saved in your browser. You can also copy or share any set using the provided buttons.' },
          { question: 'Does this increase my chances of winning?', answer: 'No method can mathematically improve lottery odds. This tool is for entertainment purposes only. Please play responsibly.' },
        ]}
      />
    </div>
  );
}
