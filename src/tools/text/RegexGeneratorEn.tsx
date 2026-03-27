'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';
import { CopyButton } from '@/components/ui/CopyButton';
import { Textarea } from '@/components/ui/Textarea';

const presetPatterns = [
  { name: 'Email', pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$', example: 'test@example.com' },
  { name: 'US Phone', pattern: '^\\+?1?[-.\\s]?\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}$', example: '(555) 123-4567' },
  { name: 'URL', pattern: '^https?:\\/\\/[\\w\\-]+(\\.[\\w\\-]+)+[/#?]?.*$', example: 'https://example.com' },
  { name: 'IPv4', pattern: '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$', example: '192.168.0.1' },
  { name: 'IPv6', pattern: '^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$', example: '2001:0db8:85a3:0000:0000:8a2e:0370:7334' },
  { name: 'SSN', pattern: '^\\d{3}-?\\d{2}-?\\d{4}$', example: '123-45-6789' },
  { name: 'Credit Card', pattern: '^\\d{4}-?\\d{4}-?\\d{4}-?\\d{4}$', example: '1234-5678-9012-3456' },
  { name: 'US ZIP Code', pattern: '^\\d{5}(-\\d{4})?$', example: '12345 or 12345-6789' },
  { name: 'Date (YYYY-MM-DD)', pattern: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$', example: '2024-01-15' },
  { name: 'Time (HH:MM)', pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$', example: '14:30' },
  { name: 'Letters Only', pattern: '^[a-zA-Z]+$', example: 'Hello' },
  { name: 'Numbers Only', pattern: '^\\d+$', example: '12345' },
  { name: 'Alphanumeric', pattern: '^[a-zA-Z0-9]+$', example: 'abc123' },
  { name: 'Password (8+ chars, letter+number+special)', pattern: '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$', example: 'Pass123!' },
  { name: 'UUID', pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$', example: '550e8400-e29b-41d4-a716-446655440000' },
  { name: 'Hex Color', pattern: '^#?([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$', example: '#FF5733' },
  { name: 'HTML Tag', pattern: '<([a-zA-Z][a-zA-Z0-9]*)\\b[^>]*>(.*?)<\\/\\1>', example: '<div>content</div>' },
  { name: 'Slug', pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$', example: 'my-page-slug' },
  { name: 'Username', pattern: '^[a-zA-Z0-9_]{3,16}$', example: 'user_name123' },
  { name: 'MAC Address', pattern: '^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$', example: '00:1B:44:11:3A:B7' },
];

export function RegexGeneratorEn() {
  const [selectedPattern, setSelectedPattern] = useState(presetPatterns[0]);
  const [testInput, setTestInput] = useState('');
  const [customPattern, setCustomPattern] = useState('');
  const [flags, setFlags] = useState({ g: true, i: false, m: false });

  const currentPattern = customPattern || selectedPattern.pattern;
  const flagString = Object.entries(flags).filter(([, v]) => v).map(([k]) => k).join('');

  const testResults = (() => {
    if (!testInput.trim()) return [];
    try {
      const regex = new RegExp(currentPattern, flagString);
      const lines = testInput.split('\n');
      return lines.map((line) => ({
        text: line,
        match: regex.test(line),
      }));
    } catch {
      return [];
    }
  })();

  const matchCount = testResults.filter((r) => r.match).length;

  return (
    <div className="space-y-4">
      <Card variant="bordered" className="p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Common Patterns
        </h3>
        <div className="flex flex-wrap gap-2">
          {presetPatterns.map((preset) => (
            <Button
              key={preset.name}
              variant={selectedPattern.name === preset.name && !customPattern ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => {
                setSelectedPattern(preset);
                setCustomPattern('');
              }}
            >
              {preset.name}
            </Button>
          ))}
        </div>
      </Card>

      <Card variant="bordered" className="p-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Regex Pattern
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customPattern || selectedPattern.pattern}
                onChange={(e) => setCustomPattern(e.target.value)}
                className="flex-1 px-3 py-2 font-mono text-sm border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                placeholder="Enter regex pattern..."
              />
              <CopyButton text={currentPattern} />
            </div>
            {!customPattern && (
              <p className="mt-1 text-xs text-gray-500">Example: {selectedPattern.example}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Flags
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={flags.g}
                  onChange={(e) => setFlags({ ...flags, g: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm">g (global)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={flags.i}
                  onChange={(e) => setFlags({ ...flags, i: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm">i (case insensitive)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={flags.m}
                  onChange={(e) => setFlags({ ...flags, m: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm">m (multiline)</span>
              </label>
            </div>
          </div>

          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg font-mono text-sm">
            <span className="text-gray-500">/</span>
            <span className="text-blue-600 dark:text-blue-400">{currentPattern}</span>
            <span className="text-gray-500">/</span>
            <span className="text-green-600 dark:text-green-400">{flagString}</span>
          </div>
        </div>
      </Card>

      <Textarea
        label="Test Input (line by line)"
        value={testInput}
        onChange={(e) => setTestInput(e.target.value)}
        placeholder="Enter strings to test..."
        rows={6}
      />

      {testResults.length > 0 && (
        <Card variant="bordered" className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Test Results
            </h3>
            <span className="text-sm text-gray-500">
              {matchCount}/{testResults.length} matched
            </span>
          </div>
          <div className="space-y-1 max-h-60 overflow-y-auto">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`px-3 py-2 rounded font-mono text-sm ${
                  result.match
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                }`}
              >
                <span className="mr-2">{result.match ? '✓' : '✗'}</span>
                {result.text || '(empty line)'}
              </div>
            ))}
          </div>
        </Card>
      )}

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">🔍 What Is a Regex Generator?</h2>
        <p className="text-sm leading-relaxed">
          A regular expression (regex) is a sequence of characters that defines a search pattern, widely used for string matching and data validation.
          Writing regex from scratch can be tricky because the syntax is not always intuitive, especially for complex patterns.
          This regex generator provides over 20 ready-to-use preset patterns for common use cases like email validation, phone numbers, URLs, IP addresses, and more.
          Simply pick a preset, tweak it if needed, and test it against your own input in real time — no guesswork required.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">📋 Common Regex Patterns</h2>
        <div className="space-y-3 text-sm leading-relaxed">
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Email Validation</h3>
            <p>
              <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{'{'}2,{'}'}$</code>
              {' '}— Matches standard email formats with alphanumeric characters, dots, hyphens, and common special characters before the @ symbol. One of the most frequently used patterns in web development for form validation and data cleaning.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Phone Number Validation</h3>
            <p>
              Supports US phone number formats including optional country code, parentheses around area code, and various separators (dashes, dots, spaces).
              Patterns like <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">(555) 123-4567</code> or <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">555-123-4567</code> are all matched.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">URL and IP Address</h3>
            <p>
              Validates HTTP/HTTPS URLs with subdomains, paths, and query strings. Also includes patterns for IPv4 addresses (0.0.0.0 to 255.255.255.255) and IPv6 addresses. Useful for web scraping, log analysis, and network configuration validation.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Password Strength</h3>
            <p>
              Validates passwords that contain at least one letter, one digit, and one special character, with a minimum length of 8 characters.
              Uses lookahead assertions (?=...) — a classic example of advanced regex techniques in practice.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">📖 Basic Regex Syntax</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 pr-4 font-semibold text-gray-800 dark:text-gray-200">Syntax</th>
                <th className="text-left py-2 pr-4 font-semibold text-gray-800 dark:text-gray-200">Description</th>
                <th className="text-left py-2 font-semibold text-gray-800 dark:text-gray-200">Example</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-400">
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4 font-mono">.</td>
                <td className="py-2 pr-4">Any single character</td>
                <td className="py-2 font-mono">a.c → abc, a1c</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4 font-mono">*</td>
                <td className="py-2 pr-4">Zero or more repetitions</td>
                <td className="py-2 font-mono">ab*c → ac, abc, abbc</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4 font-mono">+</td>
                <td className="py-2 pr-4">One or more repetitions</td>
                <td className="py-2 font-mono">ab+c → abc, abbc</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4 font-mono">?</td>
                <td className="py-2 pr-4">Zero or one occurrence</td>
                <td className="py-2 font-mono">colou?r → color, colour</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4 font-mono">\d</td>
                <td className="py-2 pr-4">Any digit (0-9)</td>
                <td className="py-2 font-mono">\d+ → 123, 456</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4 font-mono">\w</td>
                <td className="py-2 pr-4">Word character (letter, digit, underscore)</td>
                <td className="py-2 font-mono">\w+ → hello_123</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4 font-mono">[abc]</td>
                <td className="py-2 pr-4">Character class (a or b or c)</td>
                <td className="py-2 font-mono">[aeiou] → vowels</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono">^, $</td>
                <td className="py-2 pr-4">Start and end of string</td>
                <td className="py-2 font-mono">^abc$ → exactly abc</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">⚙️ Regex Flags Explained</h2>
        <ul className="text-sm leading-relaxed space-y-2">
          <li><strong className="text-gray-800 dark:text-gray-200">g (global)</strong> — Finds all matches in the input string instead of stopping after the first match.</li>
          <li><strong className="text-gray-800 dark:text-gray-200">i (case insensitive)</strong> — Matches letters regardless of case. For example, ABC and abc are treated identically.</li>
          <li><strong className="text-gray-800 dark:text-gray-200">m (multiline)</strong> — Makes ^ and $ match the start and end of each line, rather than the entire string.</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          { question: 'What is a regular expression?', answer: 'A regular expression (regex) is a pattern-matching syntax used to search, match, and manipulate strings. It is supported by virtually all programming languages and is widely used for data validation, text parsing, and search-and-replace operations.' },
          { question: 'Can I modify the preset patterns?', answer: 'Yes. After selecting a preset pattern, you can freely edit it in the pattern input field. Any changes are immediately reflected in the test results below.' },
          { question: 'How do I test my regex?', answer: 'Select or type a regex pattern, then enter the strings you want to validate in the test area (one per line). Matching lines appear in green with a checkmark, and non-matching lines appear in red with an X mark.' },
        ]}
      />
    </div>
  );
}
