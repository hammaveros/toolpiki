'use client';

import { useState, useMemo } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';

type SortType = 'asc' | 'desc' | 'length-asc' | 'length-desc' | 'random' | 'reverse';

export function TextSorterEn() {
  const [input, setInput] = useState('');
  const [sortType, setSortType] = useState<SortType>('asc');
  const [caseSensitive, setCaseSensitive] = useState(false);

  const output = useMemo(() => {
    if (!input) return '';

    let lines = input.split('\n');

    switch (sortType) {
      case 'asc':
        lines.sort((a, b) => {
          const compareA = caseSensitive ? a : a.toLowerCase();
          const compareB = caseSensitive ? b : b.toLowerCase();
          return compareA.localeCompare(compareB, 'en');
        });
        break;
      case 'desc':
        lines.sort((a, b) => {
          const compareA = caseSensitive ? a : a.toLowerCase();
          const compareB = caseSensitive ? b : b.toLowerCase();
          return compareB.localeCompare(compareA, 'en');
        });
        break;
      case 'length-asc':
        lines.sort((a, b) => a.length - b.length);
        break;
      case 'length-desc':
        lines.sort((a, b) => b.length - a.length);
        break;
      case 'random':
        lines = lines.sort(() => Math.random() - 0.5);
        break;
      case 'reverse':
        lines = lines.reverse();
        break;
    }

    return lines.join('\n');
  }, [input, sortType, caseSensitive]);

  const sortOptions: { value: SortType; label: string }[] = [
    { value: 'asc', label: 'Ascending (A→Z)' },
    { value: 'desc', label: 'Descending (Z→A)' },
    { value: 'length-asc', label: 'By Length (Short→Long)' },
    { value: 'length-desc', label: 'By Length (Long→Short)' },
    { value: 'random', label: 'Random' },
    { value: 'reverse', label: 'Reverse' },
  ];

  return (
    <div className="space-y-2">
      {/* Input */}
      <div>
        <Textarea
          label="Enter Text (sorted by line)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to sort, one item per line..."
          rows={8}
        />
      </div>

      {/* Sort options */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {sortOptions.map((option) => (
            <Button
              key={option.value}
              variant={sortType === option.value ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSortType(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>

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
      </div>

      {/* Output */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Result
          </label>
          {output && <CopyButton text={output} />}
        </div>
        <Textarea
          value={output}
          readOnly
          placeholder="Sorted text will appear here."
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
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">📋 What is a Text Sorter?</h2>
        <p className="text-sm leading-relaxed">
          A text sorter is a tool that rearranges multiple lines of text based on a specific sorting criterion. Whether you need to alphabetize a list of names, organize keywords, sort data entries by length, or shuffle items randomly, this tool handles it instantly. Instead of manually cutting, pasting, and reordering lines one by one, you can sort hundreds of lines in a single click with accurate and consistent results every time.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">🔄 Available Sort Types</h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Ascending (A to Z)</strong> — Sorts lines in alphabetical order. Perfect for organizing name lists, glossaries, bibliographies, and reference materials.</li>
          <li><strong>Descending (Z to A)</strong> — Sorts lines in reverse alphabetical order. Useful for reverse indexes or when you need the opposite of standard alphabetical sorting.</li>
          <li><strong>By Length (Short to Long / Long to Short)</strong> — Sorts lines based on character count. Great for data analysis, identifying outliers, or reviewing UI string lengths.</li>
          <li><strong>Random Shuffle</strong> — Randomizes the order of all lines. Ideal for creating random sequences, shuffling quiz questions, assigning presentation order, or drawing names for a giveaway.</li>
          <li><strong>Reverse</strong> — Flips the current order of lines without any alphabetical sorting. Handy when you want to read a list from bottom to top.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">💡 Common Use Cases</h2>
        <ul className="text-sm leading-relaxed space-y-1 list-disc list-inside">
          <li>Alphabetize student rosters, attendee lists, or membership directories</li>
          <li>Quickly sort data copied from spreadsheets or CSV files</li>
          <li>Organize blog tags, SEO keywords, or metadata lists</li>
          <li>Sort import statements, variable names, or config entries in code</li>
          <li>Randomly shuffle items for team assignments or giveaway draws</li>
          <li>Use case-sensitive mode for precise sorting control</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          { question: 'How does the tool handle mixed-case text?', answer: 'By default, sorting is case-insensitive, meaning "Apple" and "apple" are treated equally. You can enable the Case Sensitive option to distinguish between uppercase and lowercase letters, where uppercase letters will be sorted before lowercase ones.' },
          { question: 'Are blank lines included in the sort?', answer: 'Yes, blank lines are treated as valid lines and included in the sorting process. Since blank lines have zero length, they will appear at the top when sorting by length in ascending order.' },
          { question: 'Is there a limit to how many lines I can sort?', answer: 'There is no hard limit since all processing happens in your browser. However, extremely large texts with tens of thousands of lines may take a moment to process. For typical use cases, sorting is nearly instantaneous.' },
        ]}
      />
    </div>
  );
}
