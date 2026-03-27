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
            A random string generator creates unpredictable sequences of characters by combining lowercase letters, uppercase letters, numbers, and special symbols.
            This tool uses the browser&apos;s Web Crypto API (<code>crypto.getRandomValues</code>) to produce cryptographically secure random numbers (CSPRNG).
            Unlike <code>Math.random()</code>, which relies on a predictable pseudo-random algorithm, CSPRNG draws from the operating system&apos;s entropy sources, making the output virtually impossible to predict.
            You can generate strings from 1 to 256 characters long, and create up to 100 strings at once for batch operations.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Common Use Cases</h2>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            <strong>Temporary Passwords</strong> — Quickly create initial passwords for user registration or password reset flows.
            A combination of uppercase, lowercase, numbers, and symbols with at least 12 characters is recommended for strong security.
            <br /><br />
            <strong>API Keys and Tokens</strong> — Generate API keys, session tokens, CSRF tokens, and other secrets used for server-to-server communication.
            For these use cases, alphanumeric strings of 32 characters or more are standard practice.
            <br /><br />
            <strong>Test Data</strong> — Fill development and staging environments with dummy data quickly.
            Generating multiple random strings at once saves significant time when populating databases or testing input validation.
            <br /><br />
            <strong>Unique Identifiers</strong> — Create short, human-readable unique codes such as invitation codes, coupon codes, or order reference numbers that are distinct from standard UUIDs.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Security Tips</h2>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            This tool leverages <code>crypto.getRandomValues</code>, which is a cryptographically secure pseudo-random number generator (CSPRNG) provided by the browser.
            This is fundamentally different from <code>Math.random()</code>, a basic pseudo-random number generator (PRNG).
            With PRNG, knowing the internal seed state allows an attacker to predict future outputs, whereas CSPRNG relies on OS-level entropy sources that make prediction practically infeasible.
            However, securely transmitting and storing the generated strings remains your responsibility.
            Always hash passwords with algorithms like bcrypt or Argon2 before storing them, manage API keys through environment variables, and never share sensitive strings in plaintext.
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
