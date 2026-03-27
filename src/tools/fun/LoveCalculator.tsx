'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ResultShareButtonsEn } from '@/components/share/ResultShareButtonsEn';
import { siteConfig } from '@/data/site';
import { FaqSection } from '@/components/ui/FaqItem';

interface LoveResult {
  name1: string;
  name2: string;
  percentage: number;
  verdict: string;
  message: string;
}

// Simple hash function for consistent results
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function calculateLove(name1: string, name2: string): LoveResult {
  const combined = (name1 + name2).toLowerCase().trim();
  const hash = hashCode(combined);

  // Generate percentage between 25-99 based on hash
  const percentage = 25 + (hash % 75);

  let verdict: string;
  let message: string;

  if (percentage >= 90) {
    verdict = '💕 Soulmates';
    message = 'You two are destined to be together! The stars align perfectly for this match.';
  } else if (percentage >= 80) {
    verdict = '❤️ Great Match';
    message = 'This is a wonderful connection! You complement each other beautifully.';
  } else if (percentage >= 70) {
    verdict = '💛 Good Potential';
    message = 'There\'s definitely chemistry here. With some effort, this could blossom.';
  } else if (percentage >= 60) {
    verdict = '💙 Worth Exploring';
    message = 'An interesting match! Give it time and see where things go.';
  } else if (percentage >= 50) {
    verdict = '🤔 Mixed Signals';
    message = 'It could go either way. Communication will be key.';
  } else {
    verdict = '💫 Opposites?';
    message = 'Very different energies! But hey, opposites attract sometimes.';
  }

  return { name1, name2, percentage, verdict, message };
}

export function LoveCalculator() {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [result, setResult] = useState<LoveResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = () => {
    if (!name1.trim() || !name2.trim()) return;

    setIsCalculating(true);
    setResult(null);

    // Animation delay
    setTimeout(() => {
      const loveResult = calculateLove(name1, name2);
      setResult(loveResult);
      setIsCalculating(false);
    }, 1500);
  };

  const handleReset = () => {
    setName1('');
    setName2('');
    setResult(null);
  };

  const getShareUrl = () => {
    if (!result) return '';
    const data = { n1: name1, n2: name2 };
    const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
    return `${siteConfig.url}/en/tools/love-calculator#share=${encoded}`;
  };

  // Load from URL hash
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (hash.startsWith('#share=')) {
      try {
        const decoded = decodeURIComponent(atob(hash.slice(7)));
        const parsed = JSON.parse(decoded);
        if (parsed.n1 && parsed.n2) {
          setName1(parsed.n1);
          setName2(parsed.n2);
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
          Enter Your Names
        </h3>

        <div className="space-y-4">
          <Input
            label="Your Name"
            value={name1}
            onChange={(e) => setName1(e.target.value)}
            placeholder="Enter first name"
          />

          <div className="flex justify-center">
            <span className="text-2xl">💕</span>
          </div>

          <Input
            label="Their Name"
            value={name2}
            onChange={(e) => setName2(e.target.value)}
            placeholder="Enter second name"
          />
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            onClick={handleCalculate}
            disabled={!name1.trim() || !name2.trim() || isCalculating}
            className="flex-1"
          >
            {isCalculating ? 'Calculating...' : 'Calculate Love ❤️'}
          </Button>
          {result && (
            <Button variant="outline" onClick={handleReset}>
              Try Again
            </Button>
          )}
        </div>
      </Card>

      {isCalculating && (
        <Card variant="bordered" className="p-8">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="text-4xl animate-pulse">❤️</div>
            <p className="text-gray-600 dark:text-gray-400">
              Calculating your love compatibility...
            </p>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full bg-pink-500 animate-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>
        </Card>
      )}

      {result && !isCalculating && (
        <Card variant="bordered" className="p-6">
          <div className="text-center mb-6">
            <div className="text-6xl font-bold bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent mb-2">
              {result.percentage}%
            </div>
            <div className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {result.verdict}
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {result.message}
            </p>
          </div>

          {/* Love bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-6">
            <div
              className="h-4 rounded-full bg-gradient-to-r from-pink-400 to-red-500 transition-all duration-1000"
              style={{ width: `${result.percentage}%` }}
            />
          </div>

          {/* Names display */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="px-4 py-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
              <span className="font-medium text-pink-700 dark:text-pink-300">
                {result.name1}
              </span>
            </div>
            <span className="text-2xl">❤️</span>
            <div className="px-4 py-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <span className="font-medium text-red-700 dark:text-red-300">
                {result.name2}
              </span>
            </div>
          </div>

          <ResultShareButtonsEn
            url={getShareUrl()}
            title={`${result.name1} ❤️ ${result.name2}: ${result.percentage}% Love Match!`}
            description={result.verdict}
            visible={true}
          />
        </Card>
      )}

      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        ⚠️ This is for entertainment only! Real relationships take more than a calculator.
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
          💕 What is Love Calculator?
        </h2>
        <p className="text-sm leading-relaxed">
          A fun tool that generates a love compatibility percentage between two people based on their names.
          Using a simple hash algorithm, the same name combinations always produce consistent results for easy sharing.
          Perfect for entertainment with friends, parties, or satisfying curiosity about a crush!
          Remember, real relationships are built on much more than name compatibility.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💗 Compatibility Ratings
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 pr-4 font-semibold text-gray-900 dark:text-white">Score</th>
                <th className="text-left py-2 pr-4 font-semibold text-gray-900 dark:text-white">Verdict</th>
                <th className="text-left py-2 font-semibold text-gray-900 dark:text-white">Meaning</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-400">
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4">90-99%</td>
                <td className="py-2 pr-4">💕 Soulmates</td>
                <td className="py-2">Destined to be together!</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4">80-89%</td>
                <td className="py-2 pr-4">❤️ Great Match</td>
                <td className="py-2">Wonderful connection</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4">70-79%</td>
                <td className="py-2 pr-4">💛 Good Potential</td>
                <td className="py-2">Chemistry is there</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4">60-69%</td>
                <td className="py-2 pr-4">💙 Worth Exploring</td>
                <td className="py-2">Give it time</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">25-59%</td>
                <td className="py-2 pr-4">💫 Opposites?</td>
                <td className="py-2">Different energies</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Fun Ways to Use
        </h2>
        <ul className="text-sm space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
          <li><strong>Party game:</strong> Calculate compatibility between friends</li>
          <li><strong>Ice breaker:</strong> Start fun conversations with new people</li>
          <li><strong>Social media:</strong> Share your results with friends</li>
          <li><strong>Celebrity crush:</strong> Test your compatibility with your favorite stars</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          { question: 'How is the love percentage calculated?', answer: 'The percentage is generated using a hash function based on the combined names. Same names always give the same result for consistency.' },
          { question: 'Is this scientifically accurate?', answer: 'No, this is purely for entertainment! Real compatibility depends on many factors beyond names.' },
          { question: 'Why do I get different results with different name orders?', answer: 'The algorithm treats "John + Jane" differently from "Jane + John" to add variety. Try both orders for fun!' },
        ]}
      />
    </div>
  );
}
