'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';

export function LineBreakRemoverEn() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const removeLineBreaks = () => {
    setOutput(input.replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim());
  };

  const removeAllWhitespace = () => {
    setOutput(input.replace(/\s+/g, ''));
  };

  const normalizeWhitespace = () => {
    setOutput(input.replace(/[ \t]+/g, ' ').replace(/\n\s*\n/g, '\n\n').trim());
  };

  const removeEmptyLines = () => {
    setOutput(
      input
        .split('\n')
        .filter((line) => line.trim())
        .join('\n')
    );
  };

  return (
    <div className="space-y-2">
      {/* Input */}
      <div>
        <Textarea
          label="Enter Text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to remove line breaks..."
          rows={6}
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button variant="primary" onClick={removeLineBreaks}>
          Line Breaks to Spaces
        </Button>
        <Button variant="secondary" onClick={removeAllWhitespace}>
          Remove All Whitespace
        </Button>
        <Button variant="secondary" onClick={normalizeWhitespace}>
          Normalize Whitespace
        </Button>
        <Button variant="secondary" onClick={removeEmptyLines}>
          Remove Empty Lines
        </Button>
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
          placeholder="Result will appear here."
          rows={6}
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
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">🔧 What Is a Line Break Remover?</h2>
        <p className="text-sm leading-relaxed">
          A line break remover is a tool that strips or converts newline characters from text, turning multi-line content into a clean single-line or properly formatted output.
          When you copy text from PDFs, emails, or web pages, unwanted line breaks can disrupt the flow of your content.
          These stray line breaks can cause formatting issues in documents, code editors, spreadsheets, and messaging apps.
          This tool offers four distinct modes — line breaks to spaces, remove all whitespace, normalize whitespace, and remove empty lines — so you can pick the right cleanup strategy for any situation.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">💡 Common Use Cases</h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Cleaning PDF-Copied Text</strong> — PDFs insert hard line breaks at the end of every visual line. Removing them restores the text into natural, flowing paragraphs.</li>
          <li><strong>Email Formatting</strong> — When pasting email content into documents or forms, stray line breaks can create messy layouts. This tool cleans them up instantly.</li>
          <li><strong>One-Lining Code Snippets</strong> — Merge multi-line SQL queries, JSON payloads, or CSV rows into a single line for use in command-line tools, API calls, or config files.</li>
          <li><strong>Social Media Posts</strong> — Convert drafts written in text editors into properly formatted posts by removing unnecessary line breaks while preserving intentional paragraph spacing.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">📋 Types of Line Break Characters</h2>
        <p className="text-sm leading-relaxed mb-2">
          Different operating systems use different characters to represent line breaks. This tool automatically detects and handles all formats.
        </p>
        <ul className="text-sm leading-relaxed space-y-1 list-disc list-inside">
          <li><code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">\n</code> (LF) — Used by Unix, Linux, and macOS</li>
          <li><code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">\r\n</code> (CRLF) — Used by Windows</li>
          <li><code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">\r</code> (CR) — Used by legacy Mac OS (pre-OS X)</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          { question: 'Will removing line breaks merge words together?', answer: 'Not if you use the "Line Breaks to Spaces" mode. It replaces each line break with a space so words stay separated naturally. If you want everything joined without spaces, use "Remove All Whitespace" instead.' },
          { question: 'Can I clean up text copied from a PDF?', answer: 'Absolutely. PDFs typically insert a hard line break at the end of every displayed line. Use "Line Breaks to Spaces" to convert them into a clean, continuous paragraph in one click.' },
          { question: 'What is the difference between "Normalize Whitespace" and "Line Breaks to Spaces"?', answer: '"Line Breaks to Spaces" converts all line breaks into spaces and collapses everything into a single line. "Normalize Whitespace" reduces consecutive spaces to one and trims excess blank lines, but preserves paragraph breaks (single blank lines) for readability.' },
        ]}
      />
    </div>
  );
}
