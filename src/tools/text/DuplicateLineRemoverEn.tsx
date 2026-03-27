'use client';

import { useState, useMemo } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';

export function DuplicateLineRemoverEn() {
  const [input, setInput] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [trimLines, setTrimLines] = useState(true);

  const result = useMemo(() => {
    if (!input) return { output: '', originalCount: 0, uniqueCount: 0, removedCount: 0 };

    let lines = input.split('\n');
    const originalCount = lines.length;

    if (trimLines) {
      lines = lines.map((line) => line.trim());
    }

    const seen = new Set<string>();
    const uniqueLines: string[] = [];

    for (const line of lines) {
      const key = caseSensitive ? line : line.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        uniqueLines.push(line);
      }
    }

    return {
      output: uniqueLines.join('\n'),
      originalCount,
      uniqueCount: uniqueLines.length,
      removedCount: originalCount - uniqueLines.length,
    };
  }, [input, caseSensitive, trimLines]);

  return (
    <div className="space-y-2">
      {/* Input */}
      <div>
        <Textarea
          label="Enter Text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text with duplicate lines to remove..."
          rows={8}
        />
      </div>

      {/* Options */}
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Case Sensitive
          </span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={trimLines}
            onChange={(e) => setTrimLines(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Trim Whitespace
          </span>
        </label>
      </div>

      {/* Stats */}
      {input && (
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span>Original: {result.originalCount} lines</span>
          <span>Result: {result.uniqueCount} lines</span>
          <span className="text-red-500">Removed: {result.removedCount} lines</span>
        </div>
      )}

      {/* Output */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Result
          </label>
          {result.output && <CopyButton text={result.output} />}
        </div>
        <Textarea
          value={result.output}
          readOnly
          placeholder="Deduplicated text will appear here."
          rows={8}
          className="bg-gray-50 dark:bg-gray-800/50"
        />
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
          What is Duplicate Line Remover?
        </h2>
        <p className="text-sm leading-relaxed">
          The Duplicate Line Remover is a utility that scans your text line by line and automatically removes any repeated lines,
          keeping only the first occurrence. Instead of manually comparing and deleting duplicates, simply paste your text and get
          a clean, deduplicated result instantly. It is widely used for cleaning up server logs, refining datasets, removing
          duplicate email addresses, tidying up code, and many other text processing tasks.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          Common Use Cases
        </h2>
        <div className="text-sm leading-relaxed space-y-2">
          <p><strong>Server Log Cleanup:</strong> When the same error messages or request logs repeat, removing duplicates helps you quickly identify the core issues without scrolling through redundant entries.</p>
          <p><strong>Email and Contact Lists:</strong> After merging contacts from multiple sources, use this tool to eliminate duplicate email addresses or phone numbers in one step.</p>
          <p><strong>Data Refinement:</strong> When working with CSV or plain text data that contains repeated rows, extract only unique values to create a clean dataset ready for analysis.</p>
          <p><strong>Code Cleanup:</strong> Quickly find and remove accidentally duplicated import statements, configuration values, or list items in your source code.</p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          Options Explained
        </h2>
        <div className="text-sm leading-relaxed space-y-2">
          <p><strong>Case Sensitive:</strong> When enabled, &quot;Hello&quot; and &quot;hello&quot; are treated as different lines. When disabled, lines are compared in a case-insensitive manner, so variations in capitalization are considered duplicates.</p>
          <p><strong>Trim Whitespace:</strong> When enabled, leading and trailing whitespace (spaces, tabs) are stripped from each line before comparison. This means lines that differ only in indentation will be treated as duplicates.</p>
        </div>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Are blank lines also removed as duplicates?',
            answer: 'Yes, if there are multiple blank lines, only the first one is kept and the rest are removed. If you need to preserve all blank lines, you should process only the non-empty lines separately.',
          },
          {
            question: 'Is the original order of lines preserved?',
            answer: 'Yes, the original order is maintained after deduplication. The tool keeps the first occurrence of each line and removes any subsequent duplicates while preserving the sequence.',
          },
          {
            question: 'Are lines with only whitespace differences treated as duplicates?',
            answer: 'If the "Trim Whitespace" option is enabled, leading and trailing spaces and tabs are removed before comparison, so lines that differ only in indentation are treated as duplicates. If disabled, whitespace differences are preserved.',
          },
        ]}
      />
    </div>
  );
}
