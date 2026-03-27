'use client';

import { useState, useMemo } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';

interface MatchResult {
  match: string;
  index: number;
  groups: string[];
}

export function RegexTesterEn() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');
  const [replaceWith, setReplaceWith] = useState('');

  const flagOptions = [
    { flag: 'g', label: 'global', desc: 'Match all occurrences' },
    { flag: 'i', label: 'ignoreCase', desc: 'Case insensitive' },
    { flag: 'm', label: 'multiline', desc: 'Multiline mode' },
    { flag: 's', label: 'dotAll', desc: '. matches newlines' },
  ];

  const toggleFlag = (flag: string) => {
    if (flags.includes(flag)) {
      setFlags(flags.replace(flag, ''));
    } else {
      setFlags(flags + flag);
    }
  };

  const { error, matches, highlighted, replaced } = useMemo(() => {
    if (!pattern) {
      return { regex: null, error: null, matches: [], highlighted: testString, replaced: '' };
    }

    try {
      const re = new RegExp(pattern, flags);
      const matchResults: MatchResult[] = [];
      let match;

      if (flags.includes('g')) {
        while ((match = re.exec(testString)) !== null) {
          matchResults.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
          });
          if (match[0].length === 0) re.lastIndex++;
        }
      } else {
        match = re.exec(testString);
        if (match) {
          matchResults.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
          });
        }
      }

      // Highlight matches
      let hl = testString;
      if (matchResults.length > 0) {
        const parts: { text: string; isMatch: boolean }[] = [];
        let lastIndex = 0;

        matchResults.forEach((m) => {
          if (m.index > lastIndex) {
            parts.push({ text: testString.slice(lastIndex, m.index), isMatch: false });
          }
          parts.push({ text: m.match, isMatch: true });
          lastIndex = m.index + m.match.length;
        });

        if (lastIndex < testString.length) {
          parts.push({ text: testString.slice(lastIndex), isMatch: false });
        }

        hl = parts
          .map((p) => (p.isMatch ? `<mark class="bg-yellow-300 dark:bg-yellow-700">${escapeHtml(p.text)}</mark>` : escapeHtml(p.text)))
          .join('');
      }

      // Replace result
      const rep = replaceWith ? testString.replace(re, replaceWith) : '';

      return { regex: re, error: null, matches: matchResults, highlighted: hl, replaced: rep };
    } catch (e) {
      return { regex: null, error: (e as Error).message, matches: [], highlighted: testString, replaced: '' };
    }
  }, [pattern, flags, testString, replaceWith]);

  const escapeHtml = (text: string): string => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  };

  const commonPatterns = [
    { label: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
    { label: 'URL', pattern: 'https?:\\/\\/[^\\s]+' },
    { label: 'Phone (US)', pattern: '\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}' },
    { label: 'Numbers Only', pattern: '\\d+' },
    { label: 'Letters Only', pattern: '[a-zA-Z]+' },
    { label: 'HTML Tags', pattern: '<[^>]+>' },
  ];

  return (
    <div className="space-y-4">
      <Card variant="bordered" className="p-4">
        <div className="flex gap-2 items-start flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Regex Pattern
            </label>
            <Input
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="[a-z]+"
              className="font-mono"
            />
          </div>
          <div className="flex gap-2 flex-wrap items-end">
            {flagOptions.map(({ flag, label, desc }) => (
              <Button
                key={flag}
                variant={flags.includes(flag) ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => toggleFlag(flag)}
                title={desc}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {error && (
          <p className="mt-2 text-red-500 text-sm">{error}</p>
        )}

        <div className="flex gap-2 flex-wrap mt-3">
          {commonPatterns.map(({ label, pattern: p }) => (
            <Button
              key={label}
              variant="secondary"
              size="sm"
              onClick={() => setPattern(p)}
            >
              {label}
            </Button>
          ))}
        </div>
      </Card>

      <Textarea
        label="Test String"
        value={testString}
        onChange={(e) => setTestString(e.target.value)}
        placeholder="Enter the string to test against the regex..."
        rows={5}
      />

      {testString && pattern && !error && (
        <>
          <Card variant="bordered" className="p-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Match Results ({matches.length})
              </label>
            </div>
            <div
              className="p-3 bg-gray-50 dark:bg-gray-800 rounded font-mono text-sm whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: highlighted }}
            />
          </Card>

          {matches.length > 0 && (
            <Card variant="bordered" className="p-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Matches
              </label>
              <div className="max-h-48 overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b dark:border-gray-700">
                      <th className="pb-2">#</th>
                      <th className="pb-2">Match</th>
                      <th className="pb-2">Index</th>
                      {matches[0]?.groups.length > 0 && <th className="pb-2">Groups</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {matches.map((m, i) => (
                      <tr key={i} className="border-b dark:border-gray-700">
                        <td className="py-2 text-gray-500">{i + 1}</td>
                        <td className="py-2 font-mono">{m.match}</td>
                        <td className="py-2 text-gray-500">{m.index}</td>
                        {m.groups.length > 0 && (
                          <td className="py-2 font-mono text-xs">
                            {m.groups.map((g, gi) => (
                              <span key={gi} className="mr-2 px-1 bg-gray-200 dark:bg-gray-700 rounded">
                                ${gi + 1}: {g}
                              </span>
                            ))}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          <Card variant="bordered" className="p-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Replace
            </label>
            <Input
              value={replaceWith}
              onChange={(e) => setReplaceWith(e.target.value)}
              placeholder="Replacement string ($1, $2 for capture groups)"
              className="font-mono mb-3"
            />
            {replaced && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-500">Replace Result</span>
                  <CopyButton text={replaced} size="sm" />
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded font-mono text-sm whitespace-pre-wrap">
                  {replaced}
                </div>
              </div>
            )}
          </Card>
        </>
      )}

      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs text-gray-600 dark:text-gray-400">
        <p className="font-medium mb-1">Common Patterns</p>
        <ul className="space-y-1">
          <li><code>\d</code> - digit, <code>\w</code> - word char, <code>\s</code> - whitespace</li>
          <li><code>+</code> - one or more, <code>*</code> - zero or more, <code>?</code> - zero or one</li>
          <li><code>^</code> - start, <code>$</code> - end</li>
          <li><code>()</code> - capture group, <code>(?:)</code> - non-capture group</li>
        </ul>
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
          🔍 What is Regex Tester?
        </h2>
        <p className="text-sm leading-relaxed">
          Regular Expressions (Regex) are powerful tools for finding and manipulating patterns in text.
          This tester validates regex patterns in real-time with highlighted match visualization.
          Test capture groups, flag settings, and string replacement all in one place.
          Includes presets for common patterns like email, URL, and phone numbers to get started quickly.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 Common Regex Patterns
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Purpose</th>
                <th className="text-left py-2 px-2">Pattern</th>
                <th className="text-left py-2 px-2">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Email</td><td className="font-mono text-xs">{'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}'}</td><td>Basic email format</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">URL</td><td className="font-mono text-xs">{'https?://[^\\s]+'}</td><td>http/https URLs</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Numbers</td><td className="font-mono">{'\\d+'}</td><td>One or more digits</td></tr>
              <tr><td className="py-2 px-2 font-medium">Trim spaces</td><td className="font-mono">{'^\\s+|\\s+$'}</td><td>Leading/trailing whitespace</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Regex Writing Tips
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>g flag</strong>: Global search, find all matches</li>
          <li><strong>i flag</strong>: Case-insensitive matching</li>
          <li><strong>Capture groups ()</strong>: Extract matched portions, reference with $1, $2</li>
          <li><strong>Non-greedy *?</strong>: Match as few characters as possible</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'How do I match special characters?',
            answer: 'Escape them with \\. Examples: \\. (period), \\? (question mark), \\[ (bracket). Backslash itself needs \\\\ (double).',
          },
          {
            question: 'Capture vs non-capture groups?',
            answer: 'Capture groups () store the match for backreference ($1, $2). Non-capture groups (?:) only group without storing.',
          },
          {
            question: 'Why is my pattern not working?',
            answer: 'Check your flags. Without g, only the first match is found. Also, JavaScript regex may differ slightly from other languages.',
          },
        ]}
      />
    </div>
  );
}
