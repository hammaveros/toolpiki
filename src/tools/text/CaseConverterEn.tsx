'use client';

import { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';

type CaseType =
  | 'upper'
  | 'lower'
  | 'title'
  | 'sentence'
  | 'toggle'
  | 'camel'
  | 'pascal'
  | 'snake'
  | 'kebab';

const caseOptions: { value: CaseType; label: string }[] = [
  { value: 'upper', label: 'UPPERCASE' },
  { value: 'lower', label: 'lowercase' },
  { value: 'title', label: 'Title Case' },
  { value: 'sentence', label: 'Sentence case' },
  { value: 'toggle', label: 'tOGGLE cASE' },
  { value: 'camel', label: 'camelCase' },
  { value: 'pascal', label: 'PascalCase' },
  { value: 'snake', label: 'snake_case' },
  { value: 'kebab', label: 'kebab-case' },
];

export function CaseConverterEn() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [selectedCase, setSelectedCase] = useState<CaseType>('upper');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const doConvert = (text: string, type: CaseType): string => {
    switch (type) {
      case 'upper':
        return text.toUpperCase();
      case 'lower':
        return text.toLowerCase();
      case 'title':
        return text.replace(
          /\w\S*/g,
          (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
        );
      case 'sentence':
        return text
          .toLowerCase()
          .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
      case 'toggle':
        return text
          .split('')
          .map((c) =>
            c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()
          )
          .join('');
      case 'camel':
        return text
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase());
      case 'pascal':
        return text
          .toLowerCase()
          .replace(/(^|[^a-zA-Z0-9]+)(.)/g, (_, __, c) => c.toUpperCase());
      case 'snake':
        return text
          .replace(/\s+/g, '_')
          .replace(/([a-z])([A-Z])/g, '$1_$2')
          .toLowerCase();
      case 'kebab':
        return text
          .replace(/\s+/g, '-')
          .replace(/([a-z])([A-Z])/g, '$1-$2')
          .toLowerCase();
      default:
        return text;
    }
  };

  // Auto convert
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!input.trim()) {
      setOutput('');
      return;
    }

    debounceRef.current = setTimeout(() => {
      setOutput(doConvert(input, selectedCase));
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [input, selectedCase]);

  const convertCase = (type: CaseType) => {
    setSelectedCase(type);
    if (input.trim()) {
      setOutput(doConvert(input, type));
    }
  };

  return (
    <div className="space-y-2">
      {/* Input */}
      <div>
        <Textarea
          label="Enter Text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to convert..."
          rows={5}
        />
      </div>

      {/* Convert buttons */}
      <div className="flex flex-wrap gap-2">
        {caseOptions.map((option) => (
          <Button
            key={option.value}
            variant={selectedCase === option.value ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => convertCase(option.value)}
          >
            {option.label}
          </Button>
        ))}
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
          placeholder="Converted text will appear here."
          rows={5}
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
          🔤 What Is a Case Converter?
        </h2>
        <p className="text-sm leading-relaxed">
          <strong className="text-gray-900 dark:text-white">A case converter transforms text between different letter case formats instantly.</strong>{' '}
          It supports <strong>UPPERCASE</strong>, <strong>lowercase</strong>, Title Case, <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">camelCase</code>, <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">PascalCase</code>, <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">snake_case</code>, <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">kebab-case</code>,
          <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">CONSTANT_CASE</code>, and more. Whether you are naming programming variables, formatting titles,
          or converting API response keys, this tool handles <strong>all case transformations in one place</strong>.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 Case Types Explained
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>camelCase:</strong> First word lowercase, subsequent words capitalized. JavaScript/Java variables (e.g., <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">userName</code>)</li>
          <li><strong>PascalCase:</strong> Every word capitalized. Class names and components (e.g., <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">UserProfile</code>)</li>
          <li><strong>snake_case:</strong> Words joined by underscores. Python and Ruby (e.g., <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">user_name</code>)</li>
          <li><strong>kebab-case:</strong> Words joined by hyphens. URLs and CSS classes (e.g., <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">user-name</code>)</li>
          <li><strong>CONSTANT_CASE:</strong> All uppercase with underscores. Constants (e.g., <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">MAX_COUNT</code>)</li>
          <li><strong>Title Case:</strong> First letter of each word capitalized. Headings and titles</li>
        </ul>
      </section>

      <div className="rounded-lg bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 p-4 text-sm">
        <p className="font-semibold text-indigo-900 dark:text-indigo-200 mb-1">💡 Quick tip</p>
        <p className="text-indigo-800 dark:text-indigo-300">
          Use <strong>camelCase</strong> for variables, <strong>PascalCase</strong> for classes/types, and <strong>CONSTANT_CASE</strong> for constants. This is the most common convention across modern code styles.
        </p>
      </div>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Which case should I use for programming?',
            answer: 'It depends on the language. JavaScript/Java use camelCase for variables and PascalCase for classes. Python uses snake_case. CSS uses kebab-case. Follow your language\'s conventions.',
          },
          {
            question: 'What is the difference between camelCase and PascalCase?',
            answer: 'camelCase starts with a lowercase letter (userName), while PascalCase starts with an uppercase letter (UserName). Use camelCase for variables and PascalCase for classes/types.',
          },
          {
            question: 'Can this handle non-English characters?',
            answer: 'Case conversion only applies to alphabetic characters. Non-alphabetic characters (numbers, symbols, CJK characters) are preserved as-is during conversion.',
          },
        ]}
      />
    </div>
  );
}
