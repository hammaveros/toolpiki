'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FaqSection } from '@/components/ui/FaqItem';

interface Item {
  id: string;
  text: string;
  weight: number;
  isPro: boolean;
}

interface Option {
  name: string;
  items: Item[];
}

export function ProsConsComparatorEn() {
  const [optionA, setOptionA] = useState<Option>({ name: 'Option A', items: [] });
  const [optionB, setOptionB] = useState<Option>({ name: 'Option B', items: [] });
  const [newItemA, setNewItemA] = useState({ text: '', isPro: true });
  const [newItemB, setNewItemB] = useState({ text: '', isPro: true });

  const generateId = () => Math.random().toString(36).slice(2, 9);

  const addItem = (option: 'A' | 'B') => {
    const newItem = option === 'A' ? newItemA : newItemB;
    if (!newItem.text.trim()) return;

    const item: Item = {
      id: generateId(),
      text: newItem.text.trim(),
      weight: 1,
      isPro: newItem.isPro,
    };

    if (option === 'A') {
      setOptionA((prev) => ({ ...prev, items: [...prev.items, item] }));
      setNewItemA({ text: '', isPro: true });
    } else {
      setOptionB((prev) => ({ ...prev, items: [...prev.items, item] }));
      setNewItemB({ text: '', isPro: true });
    }
  };

  const removeItem = (option: 'A' | 'B', id: string) => {
    if (option === 'A') {
      setOptionA((prev) => ({ ...prev, items: prev.items.filter((i) => i.id !== id) }));
    } else {
      setOptionB((prev) => ({ ...prev, items: prev.items.filter((i) => i.id !== id) }));
    }
  };

  const updateWeight = (option: 'A' | 'B', id: string, weight: number) => {
    const updateFn = (items: Item[]) =>
      items.map((i) => (i.id === id ? { ...i, weight: Math.max(1, Math.min(3, weight)) } : i));

    if (option === 'A') {
      setOptionA((prev) => ({ ...prev, items: updateFn(prev.items) }));
    } else {
      setOptionB((prev) => ({ ...prev, items: updateFn(prev.items) }));
    }
  };

  const calcScore = (items: Item[]) => {
    const pros = items.filter((i) => i.isPro).reduce((sum, i) => sum + i.weight, 0);
    const cons = items.filter((i) => !i.isPro).reduce((sum, i) => sum + i.weight, 0);
    return pros - cons;
  };

  const result = useMemo(() => {
    const scoreA = calcScore(optionA.items);
    const scoreB = calcScore(optionB.items);

    if (optionA.items.length === 0 && optionB.items.length === 0) return null;

    let winner: 'A' | 'B' | 'tie';
    let message: string;

    if (scoreA > scoreB) {
      winner = 'A';
      message = `${optionA.name} wins by ${scoreA - scoreB} points`;
    } else if (scoreB > scoreA) {
      winner = 'B';
      message = `${optionB.name} wins by ${scoreB - scoreA} points`;
    } else {
      winner = 'tie';
      message = 'Both options are tied';
    }

    return { scoreA, scoreB, winner, message };
  }, [optionA, optionB]);

  const handleReset = () => {
    setOptionA({ name: 'Option A', items: [] });
    setOptionB({ name: 'Option B', items: [] });
    setNewItemA({ text: '', isPro: true });
    setNewItemB({ text: '', isPro: true });
  };

  const renderOption = (option: Option, key: 'A' | 'B', newItem: typeof newItemA, setNewItem: typeof setNewItemA) => {
    const pros = option.items.filter((i) => i.isPro);
    const cons = option.items.filter((i) => !i.isPro);

    return (
      <Card variant="bordered" className="p-4">
        <Input
          value={option.name}
          onChange={(e) =>
            key === 'A'
              ? setOptionA((prev) => ({ ...prev, name: e.target.value }))
              : setOptionB((prev) => ({ ...prev, name: e.target.value }))
          }
          className="font-medium text-center mb-4"
          placeholder="Option name"
        />

        {/* Pros */}
        <div className="mb-4">
          <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">
            Pros ({pros.length})
          </p>
          <div className="space-y-2">
            {pros.map((item) => (
              <div key={item.id} className="flex items-center gap-2 text-sm">
                <span className="flex-1 truncate">{item.text}</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3].map((w) => (
                    <button
                      key={w}
                      onClick={() => updateWeight(key, item.id, w)}
                      className={`w-6 h-6 rounded text-xs ${
                        item.weight >= w
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => removeItem(key, item.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Cons */}
        <div className="mb-4">
          <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">
            Cons ({cons.length})
          </p>
          <div className="space-y-2">
            {cons.map((item) => (
              <div key={item.id} className="flex items-center gap-2 text-sm">
                <span className="flex-1 truncate">{item.text}</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3].map((w) => (
                    <button
                      key={w}
                      onClick={() => updateWeight(key, item.id, w)}
                      className={`w-6 h-6 rounded text-xs ${
                        item.weight >= w
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => removeItem(key, item.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Add Input */}
        <div className="flex gap-2">
          <div className="flex gap-1">
            <button
              onClick={() => setNewItem((prev) => ({ ...prev, isPro: true }))}
              className={`px-2 py-1 text-xs rounded ${
                newItem.isPro
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              Pro
            </button>
            <button
              onClick={() => setNewItem((prev) => ({ ...prev, isPro: false }))}
              className={`px-2 py-1 text-xs rounded ${
                !newItem.isPro
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              Con
            </button>
          </div>
          <input
            type="text"
            value={newItem.text}
            onChange={(e) => setNewItem((prev) => ({ ...prev, text: e.target.value }))}
            onKeyDown={(e) => e.key === 'Enter' && addItem(key)}
            placeholder="Type and press Enter"
            className="flex-1 px-3 py-1 text-sm border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-2">
      {/* Two Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderOption(optionA, 'A', newItemA, setNewItemA)}
        {renderOption(optionB, 'B', newItemB, setNewItemB)}
      </div>

      {/* Result */}
      {result && (
        <Card variant="bordered" className="p-6">
          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{optionA.name}</p>
              <p className={`text-3xl font-bold ${
                result.winner === 'A' ? 'text-green-600 dark:text-green-400' : ''
              }`}>
                {result.scoreA} pts
              </p>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-2xl text-gray-400">VS</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{optionB.name}</p>
              <p className={`text-3xl font-bold ${
                result.winner === 'B' ? 'text-green-600 dark:text-green-400' : ''
              }`}>
                {result.scoreB} pts
              </p>
            </div>
          </div>
          <p className="text-center text-gray-600 dark:text-gray-400">
            {result.message}
          </p>
        </Card>
      )}

      {/* Buttons */}
      <div className="flex justify-end">
        <Button variant="secondary" size="sm" onClick={handleReset}>
          Reset
        </Button>
      </div>

      {/* Info */}
      <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
        <p>• Weight 1-3: assign importance to each item</p>
        <p>• Score = Sum of pros - Sum of cons</p>
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
          ⚖️ What is Pros and Cons Comparator?
        </h2>
        <p className="text-sm leading-relaxed">
          Pros and Cons Comparator is a decision-making tool for systematically comparing advantages and disadvantages of two options.
          Assign weights (1-3) to each item to reflect importance and derive objective score-based results.
          Helpful for job changes, relocations, purchases, investments, and other difficult choices requiring logic over emotion.
          All data is processed locally in your browser and never saved to any server.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 Decision-Making Examples
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Situation</th>
                <th className="text-left py-2 px-2">Options</th>
                <th className="text-left py-2 px-2">Key Factors</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Career Change</td><td>Stay vs New Job</td><td>Salary, work-life balance, growth</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Housing</td><td>Buy vs Rent</td><td>Upfront cost, flexibility, stability</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Purchase</td><td>Product A vs B</td><td>Price, features, brand</td></tr>
              <tr><td className="py-2 px-2 font-medium">Investment</td><td>Stocks vs Real Estate</td><td>Returns, risk, liquidity</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Tips for Effective Comparison
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Be specific</strong>: Instead of "good", write "30 min shorter commute"</li>
          <li><strong>Use weights wisely</strong>: Give 3 to critical factors, 1 to minor ones</li>
          <li><strong>Include hidden factors</strong>: Opportunity cost, long-term impact, etc.</li>
          <li><strong>Stay objective</strong>: Evaluate as if advising a friend</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'What if the scores are tied?',
            answer: 'When scores are equal, revisit the 1-2 most important items. Consider increasing weight on decisive factors or choosing the lower-risk option.',
          },
          {
            question: 'How should I assign weights?',
            answer: 'Give higher weights to items you would regret most if ignored. Health-related, long-term impact, or irreversible decisions typically deserve a weight of 3.',
          },
          {
            question: 'Can I save my comparison?',
            answer: 'Currently, data persists only during your browser session. For important decisions, take a screenshot or note. We do not save anything to servers for privacy.',
          },
        ]}
      />
    </div>
  );
}
