'use client';

import { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';
import { CopyButton } from '@/components/ui/CopyButton';

type Mode = 'add' | 'remove';

interface AddOptions {
  startNumber: number;
  separator: string;
  padding: boolean;
}

export function LineNumberEn() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<Mode>('add');
  const [addOptions, setAddOptions] = useState<AddOptions>({
    startNumber: 1,
    separator: '. ',
    padding: true,
  });
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (!input.trim()) {
        setOutput('');
        return;
      }

      const lines = input.split('\n');

      if (mode === 'add') {
        const maxLineNum = addOptions.startNumber + lines.length - 1;
        const maxWidth = String(maxLineNum).length;

        const result = lines.map((line, idx) => {
          const lineNum = addOptions.startNumber + idx;
          const numStr = addOptions.padding
            ? String(lineNum).padStart(maxWidth, ' ')
            : String(lineNum);
          return `${numStr}${addOptions.separator}${line}`;
        });

        setOutput(result.join('\n'));
      } else {
        // Remove line numbers
        const result = lines.map((line) => {
          // Various line number patterns
          // 1. "123. text" or "123: text" or "123) text" or "123 text"
          // 2. "  123. text" (with leading spaces)
          return line.replace(/^\s*\d+[\.\:\)\]\s]\s*/, '');
        });

        setOutput(result.join('\n'));
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input, mode, addOptions]);

  const separatorPresets = [
    { label: '. ', value: '. ' },
    { label: ': ', value: ': ' },
    { label: ') ', value: ') ' },
    { label: '] ', value: '] ' },
    { label: '| ', value: '| ' },
    { label: 'Tab', value: '\t' },
  ];

  return (
    <div className="space-y-4">
      <Card variant="bordered" className="p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex gap-2">
            <Button
              variant={mode === 'add' ? 'primary' : 'secondary'}
              onClick={() => setMode('add')}
            >
              Add Line Numbers
            </Button>
            <Button
              variant={mode === 'remove' ? 'primary' : 'secondary'}
              onClick={() => setMode('remove')}
            >
              Remove Line Numbers
            </Button>
          </div>

          {mode === 'add' && (
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">Start:</label>
                <input
                  type="number"
                  value={addOptions.startNumber}
                  onChange={(e) =>
                    setAddOptions({ ...addOptions, startNumber: parseInt(e.target.value) || 1 })
                  }
                  className="w-20 px-2 py-1 text-center border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                  min={0}
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">Separator:</label>
                <select
                  value={addOptions.separator}
                  onChange={(e) => setAddOptions({ ...addOptions, separator: e.target.value })}
                  className="px-2 py-1 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                >
                  {separatorPresets.map((preset) => (
                    <option key={preset.value} value={preset.value}>
                      {preset.label}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={addOptions.padding}
                  onChange={(e) => setAddOptions({ ...addOptions, padding: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm">Pad Numbers</span>
              </label>
            </div>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Textarea
          label="Input Text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === 'add'
              ? 'Enter text to add line numbers...'
              : 'Enter text to remove line numbers...'
          }
          rows={15}
          className="font-mono text-sm"
        />

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Result</label>
            <CopyButton text={output} />
          </div>
          <Textarea
            value={output}
            readOnly
            rows={15}
            className="font-mono text-sm bg-gray-50 dark:bg-gray-800/50"
            placeholder="Result will appear here..."
          />
        </div>
      </div>

      <Card variant="bordered" className="p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Statistics</h3>
        <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400">
          <span>Total Lines: {input ? input.split('\n').length : 0}</span>
          <span>Total Characters: {input.length}</span>
        </div>
      </Card>

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">📝 What Is the Line Number Tool?</h2>
        <p className="text-sm leading-relaxed">
          The Line Number tool is an online utility that automatically prepends sequential numbers to each line of your text.
          Whether you need to reference specific lines in a code snippet, annotate a document for peer review, or simply organize a list with numbered items, this tool handles it instantly.
          It also works in reverse, stripping existing line numbers from text so you can get clean, unnumbered content back.
          Everything runs directly in your browser with real-time results, no installation or sign-up required.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">💡 Use Cases</h2>
        <ul className="text-sm space-y-2 list-disc list-inside">
          <li><strong>Code Reviews & Sharing</strong> — Add line numbers to code before pasting it into emails, chat messages, or tickets so reviewers can point to exact lines.</li>
          <li><strong>Document Proofreading</strong> — Number the lines of drafts, essays, or contracts to give precise, line-level feedback during editing rounds.</li>
          <li><strong>Education & Tutorials</strong> — Numbered example code or reading passages help students quickly locate the section being discussed.</li>
          <li><strong>List Organization</strong> — Bulk-add sequential numbers to to-do items, inventory lists, or meeting agendas, or remove unwanted numbering in one click.</li>
          <li><strong>Legal & Regulatory Documents</strong> — Many legal filings require line-numbered pages; this tool lets you prepare text before final formatting.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">⚙️ Format Options</h2>
        <div className="text-sm space-y-3">
          <div>
            <strong className="text-gray-900 dark:text-white">Start Number</strong>
            <p className="mt-1 leading-relaxed">Set the first line number to any value you like. The default is 1, but you can start from 0 or any other number. This is especially handy when you are extracting a section from a larger document and want to preserve the original line references.</p>
          </div>
          <div>
            <strong className="text-gray-900 dark:text-white">Separator</strong>
            <p className="mt-1 leading-relaxed">Choose the character placed between the number and the text. Six presets are available: period (.), colon (:), parenthesis ()), bracket (]), pipe (|), and tab. Pick whichever style best fits your formatting needs.</p>
          </div>
          <div>
            <strong className="text-gray-900 dark:text-white">Number Padding</strong>
            <p className="mt-1 leading-relaxed">When enabled, shorter numbers are left-padded with spaces so all lines align neatly. For example, in a 100-line text, line 1 appears as &quot;  1&quot; to match the width of &quot;100&quot;. This keeps code and structured text looking clean and easy to read.</p>
          </div>
        </div>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          { question: 'What line number formats can the removal mode detect?', answer: 'It recognizes common patterns such as "1. text", "1: text", "1) text", and "1] text", including lines with leading whitespace. Most standard numbering styles are handled automatically.' },
          { question: 'Do blank lines receive a number?', answer: 'Yes. Every line, including empty ones, is counted and numbered. This preserves the original structure of the text and ensures accurate line references.' },
          { question: 'Is there a maximum number of lines I can process?', answer: 'There is no hard limit since the tool runs entirely in your browser. However, extremely large texts (tens of thousands of lines) may slow down processing. For typical use cases, performance is instant.' },
        ]}
      />
    </div>
  );
}
