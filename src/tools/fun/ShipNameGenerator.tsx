'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';

function generateShipNames(name1: string, name2: string): string[] {
  const n1 = name1.trim();
  const n2 = name2.trim();

  if (!n1 || !n2) return [];

  const results: string[] = [];

  // Strategy 1: First half of name1 + last half of name2
  const mid1 = Math.ceil(n1.length / 2);
  const mid2 = Math.floor(n2.length / 2);
  results.push(n1.slice(0, mid1) + n2.slice(mid2));

  // Strategy 2: First half of name2 + last half of name1
  results.push(n2.slice(0, Math.ceil(n2.length / 2)) + n1.slice(Math.floor(n1.length / 2)));

  // Strategy 3: First 3 chars of name1 + last 3-4 chars of name2
  if (n1.length >= 3 && n2.length >= 3) {
    results.push(n1.slice(0, 3) + n2.slice(-Math.min(4, n2.length)));
  }

  // Strategy 4: First 2 chars of each
  if (n1.length >= 2 && n2.length >= 2) {
    results.push(n1.slice(0, 2) + n2.slice(0, 2));
  }

  // Strategy 5: Alternating letters
  let alt = '';
  const maxLen = Math.max(n1.length, n2.length);
  for (let i = 0; i < Math.min(maxLen, 5); i++) {
    if (i < n1.length) alt += n1[i];
    if (i < n2.length) alt += n2[i];
  }
  if (alt.length >= 4) {
    results.push(alt.slice(0, 6));
  }

  // Capitalize first letter of each result
  const capitalized = results.map(r => r.charAt(0).toUpperCase() + r.slice(1).toLowerCase());

  // Remove duplicates
  return [...new Set(capitalized)].slice(0, 5);
}

export function ShipNameGenerator() {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [shipNames, setShipNames] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!name1.trim() || !name2.trim()) return;

    setIsGenerating(true);

    setTimeout(() => {
      const names = generateShipNames(name1, name2);
      setShipNames(names);
      setIsGenerating(false);
    }, 800);
  };

  const handleReset = () => {
    setName1('');
    setName2('');
    setShipNames([]);
  };

  return (
    <div className="space-y-2">
      <Card variant="bordered" className="p-6">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-5">
          Enter Two Names
        </h3>

        <div className="space-y-4">
          <Input
            label="First Name"
            value={name1}
            onChange={(e) => setName1(e.target.value)}
            placeholder="e.g., Brad"
          />

          <div className="flex justify-center">
            <span className="text-2xl">💑</span>
          </div>

          <Input
            label="Second Name"
            value={name2}
            onChange={(e) => setName2(e.target.value)}
            placeholder="e.g., Angelina"
          />
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            onClick={handleGenerate}
            disabled={!name1.trim() || !name2.trim() || isGenerating}
            className="flex-1"
          >
            {isGenerating ? 'Generating...' : 'Generate Ship Names ⛵'}
          </Button>
          {shipNames.length > 0 && (
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
          )}
        </div>
      </Card>

      {isGenerating && (
        <Card variant="bordered" className="p-8">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="text-4xl animate-bounce">⛵</div>
            <p className="text-gray-600 dark:text-gray-400">
              Creating ship names...
            </p>
          </div>
        </Card>
      )}

      {shipNames.length > 0 && !isGenerating && (
        <Card variant="bordered" className="p-6">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
            Your Ship Names
          </h3>

          <div className="space-y-3">
            {shipNames.map((name, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '⭐'}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white text-lg">
                    {name}
                  </span>
                </div>
                <CopyButton text={name} />
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">{name1}</span> + <span className="font-medium">{name2}</span>
            </p>
          </div>
        </Card>
      )}

      <div className="text-center text-sm text-gray-500 dark:text-gray-400 space-y-1">
        <p>💡 Famous examples: Brad + Angelina = Brangelina, Ben + Jennifer = Bennifer</p>
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
          💑 What is Ship Name Generator?
        </h2>
        <p className="text-sm leading-relaxed">
          Create couple names (portmanteaus) by combining two names into one unique blended name.
          Like &quot;Brangelina&quot; (Brad + Angelina) or &quot;Bennifer&quot; (Ben + Jennifer).
          Uses multiple algorithms to generate up to 5 different combinations.
          Perfect for fan fiction, fandom culture, couples, or just for fun with friends!
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          ⭐ Famous Ship Names
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 pr-4 font-semibold text-gray-900 dark:text-white">Ship Name</th>
                <th className="text-left py-2 pr-4 font-semibold text-gray-900 dark:text-white">Names Combined</th>
                <th className="text-left py-2 font-semibold text-gray-900 dark:text-white">Origin</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-400">
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4">Brangelina</td>
                <td className="py-2 pr-4">Brad + Angelina</td>
                <td className="py-2">Hollywood couple</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4">Bennifer</td>
                <td className="py-2 pr-4">Ben + Jennifer</td>
                <td className="py-2">Celebrity couple</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4">TomKat</td>
                <td className="py-2 pr-4">Tom + Katie</td>
                <td className="py-2">Celebrity couple</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Kimye</td>
                <td className="py-2 pr-4">Kim + Kanye</td>
                <td className="py-2">Celebrity couple</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Creative Uses
        </h2>
        <ul className="text-sm space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
          <li><strong>Fan fiction:</strong> Create names for your favorite fictional couples</li>
          <li><strong>Social media:</strong> Create a couple account name</li>
          <li><strong>Wedding hashtags:</strong> Get inspiration for unique wedding hashtags</li>
          <li><strong>Friend groups:</strong> Create fun names for best friend duos</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          { question: 'How are ship names generated?', answer: 'The generator uses multiple strategies: combining halves of names, alternating letters, and blending beginning and ending portions to create unique combinations.' },
          { question: 'Why do I get different results?', answer: 'The order of names matters! Try swapping the order to get different combinations and find your perfect ship name.' },
          { question: 'Can I use any names?', answer: 'Yes! Works with any names, nicknames, or even words. Longer names tend to produce more interesting combinations.' },
        ]}
      />
    </div>
  );
}
