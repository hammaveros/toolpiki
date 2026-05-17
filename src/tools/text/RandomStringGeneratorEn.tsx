'use client';

import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';

const CHAR_SETS = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

export function RandomStringGeneratorEn() {
  const [length, setLength] = useState(16);
  const [count, setCount] = useState(1);
  const [options, setOptions] = useState({
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: false,
  });
  const [results, setResults] = useState<string[]>([]);

  const generateString = useCallback(
    (len: number): string => {
      let chars = '';
      if (options.lowercase) chars += CHAR_SETS.lowercase;
      if (options.uppercase) chars += CHAR_SETS.uppercase;
      if (options.numbers) chars += CHAR_SETS.numbers;
      if (options.symbols) chars += CHAR_SETS.symbols;

      if (!chars) return '';

      let result = '';
      const array = new Uint32Array(len);
      crypto.getRandomValues(array);
      for (let i = 0; i < len; i++) {
        result += chars[array[i] % chars.length];
      }
      return result;
    },
    [options]
  );

  const handleGenerate = () => {
    const newResults: string[] = [];
    for (let i = 0; i < count; i++) {
      newResults.push(generateString(length));
    }
    setResults(newResults);
  };

  const toggleOption = (key: keyof typeof options) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-2">
      {/* Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="String Length"
          type="number"
          min={1}
          max={256}
          value={length}
          onChange={(e) => setLength(Math.min(256, Math.max(1, Number(e.target.value))))}
        />
        <Input
          label="Number of Strings"
          type="number"
          min={1}
          max={100}
          value={count}
          onChange={(e) => setCount(Math.min(100, Math.max(1, Number(e.target.value))))}
        />
      </div>

      {/* Character type options */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Include Characters
        </p>
        <div className="flex flex-wrap gap-3">
          {[
            { key: 'lowercase' as const, label: 'Lowercase (a-z)' },
            { key: 'uppercase' as const, label: 'Uppercase (A-Z)' },
            { key: 'numbers' as const, label: 'Numbers (0-9)' },
            { key: 'symbols' as const, label: 'Symbols' },
          ].map((item) => (
            <label key={item.key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options[item.key]}
                onChange={() => toggleOption(item.key)}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Generate button */}
      <Button variant="primary" onClick={handleGenerate} className="w-full sm:w-auto">
        Generate
      </Button>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Generated Strings
          </p>
          {results.map((result, index) => (
            <Card key={index} variant="bordered" className="p-3">
              <div className="flex items-center justify-between gap-3">
                <code className="text-sm break-all font-mono text-gray-900 dark:text-white flex-1">
                  {result}
                </code>
                <CopyButton text={result} size="sm" />
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
    <section className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">What is a Random String Generator?</h2>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            <strong className="text-gray-900 dark:text-white">A random string generator creates unpredictable sequences of characters by combining lowercase letters, uppercase letters, numbers, and special symbols.</strong>{' '}
            This tool uses the browser&apos;s <strong>Web Crypto API</strong> (<code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">crypto.getRandomValues</code>) to produce <strong>cryptographically secure random numbers (CSPRNG)</strong>.
            Unlike <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">Math.random()</code>, CSPRNG draws from the OS entropy sources, making the output virtually impossible to predict.
            You can generate strings from <strong>1 to 256 characters</strong>, and create <strong>up to 100 strings at once</strong> for batch operations.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Common Use Cases</h2>
          <ul className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 space-y-2 list-disc list-inside">
            <li><strong>Temporary Passwords</strong> — Initial passwords or reset tokens. Use <strong>12+ characters</strong> mixing upper/lower/digits/symbols.</li>
            <li><strong>API Keys and Tokens</strong> — Session tokens, CSRF tokens, server-to-server keys. <strong>32+ alphanumeric chars</strong> is standard.</li>
            <li><strong>Test Data</strong> — Populate dev/staging environments with realistic dummy strings in bulk.</li>
            <li><strong>Unique Identifiers</strong> — Short readable codes like invitation codes, coupon codes, or order numbers.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Security Tips</h2>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            This tool leverages <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">crypto.getRandomValues</code>, a <strong>cryptographically secure</strong> generator provided by the browser.
            With PRNG (like <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">Math.random()</code>), knowing the seed state lets an attacker predict outputs.
            CSPRNG relies on OS-level entropy that makes prediction practically infeasible. However, transmission and storage are still your responsibility:
            always <strong>hash passwords with bcrypt or Argon2</strong>, manage API keys via environment variables, and never share sensitive strings in plaintext.
          </p>
        </div>

        <div className="rounded-lg bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 p-4 text-sm">
          <p className="font-semibold text-indigo-900 dark:text-indigo-200 mb-1">🔒 Privacy</p>
          <p className="text-indigo-800 dark:text-indigo-300">
            All generation happens <strong>entirely inside your browser</strong>. No data is sent to any server, and the tool works offline.
          </p>
        </div>

        <FaqSection
          title="Frequently Asked Questions"
          faqs={[
            { question: 'Are the generated strings truly secure?', answer: 'Yes. This tool uses the Web Crypto API (crypto.getRandomValues), which provides cryptographically secure random numbers. The output is suitable for passwords, tokens, and other security-sensitive purposes.' },
            { question: 'What is the recommended password length?', answer: 'A minimum of 12 characters combining uppercase, lowercase, numbers, and symbols is recommended. For high-security applications, use 16 characters or more.' },
            { question: 'Are the generated strings sent to any server?', answer: 'No. All generation happens entirely within your browser. No data is transmitted to any server, and the tool works even without an internet connection.' },
            { question: 'How is this different from Math.random()?', answer: 'Math.random() uses a predictable pseudo-random number generator (PRNG) that can be reverse-engineered. This tool uses a cryptographically secure random number generator (CSPRNG) backed by the operating system entropy pool, making the output far more secure and unpredictable.' },
          ]}
        />

        <div className="flex gap-4 text-sm">
          <a href="/en" className="text-blue-600 hover:underline">← Home</a>
          <a href="/en/tools/uuid-generator-en" className="text-blue-600 hover:underline">UUID Generator →</a>
        </div>
      </div>
    </section>
  );
}
