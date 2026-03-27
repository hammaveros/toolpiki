'use client';

import { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';

type EscapeType = 'json' | 'javascript' | 'html' | 'url' | 'regex' | 'sql';

const escapeTypes: { value: EscapeType; label: string }[] = [
  { value: 'json', label: 'JSON' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'html', label: 'HTML' },
  { value: 'url', label: 'URL' },
  { value: 'regex', label: 'Regex' },
  { value: 'sql', label: 'SQL' },
];

export function StringEscapeEn() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [escapeType, setEscapeType] = useState<EscapeType>('json');
  const [mode, setMode] = useState<'escape' | 'unescape'>('escape');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const escapeString = (text: string, type: EscapeType): string => {
    switch (type) {
      case 'json':
        return text
          .replace(/\\/g, '\\\\')
          .replace(/"/g, '\\"')
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '\\r')
          .replace(/\t/g, '\\t');
      case 'javascript':
        return text
          .replace(/\\/g, '\\\\')
          .replace(/'/g, "\\'")
          .replace(/"/g, '\\"')
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '\\r')
          .replace(/\t/g, '\\t')
          .replace(/\0/g, '\\0');
      case 'html':
        return text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
      case 'url':
        return encodeURIComponent(text);
      case 'regex':
        return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      case 'sql':
        return text.replace(/'/g, "''");
      default:
        return text;
    }
  };

  const unescapeString = (text: string, type: EscapeType): string => {
    switch (type) {
      case 'json':
      case 'javascript':
        return text
          .replace(/\\n/g, '\n')
          .replace(/\\r/g, '\r')
          .replace(/\\t/g, '\t')
          .replace(/\\"/g, '"')
          .replace(/\\'/g, "'")
          .replace(/\\0/g, '\0')
          .replace(/\\\\/g, '\\');
      case 'html':
        const textarea = document.createElement('textarea');
        textarea.innerHTML = text;
        return textarea.value;
      case 'url':
        try {
          return decodeURIComponent(text);
        } catch {
          return text;
        }
      case 'regex':
        return text.replace(/\\([.*+?^${}()|[\]\\])/g, '$1');
      case 'sql':
        return text.replace(/''/g, "'");
      default:
        return text;
    }
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (!input.trim()) {
        setOutput('');
        return;
      }
      if (mode === 'escape') {
        setOutput(escapeString(input, escapeType));
      } else {
        setOutput(unescapeString(input, escapeType));
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input, escapeType, mode]);

  const handleSwap = () => {
    setInput(output);
    setOutput('');
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={mode === 'escape' ? 'primary' : 'secondary'}
          onClick={() => setMode('escape')}
        >
          Escape
        </Button>
        <Button
          variant={mode === 'unescape' ? 'primary' : 'secondary'}
          onClick={() => setMode('unescape')}
        >
          Unescape
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {escapeTypes.map((type) => (
          <Button
            key={type.value}
            variant={escapeType === type.value ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setEscapeType(type.value)}
          >
            {type.label}
          </Button>
        ))}
      </div>

      <Textarea
        label={mode === 'escape' ? 'Original String' : 'Escaped String'}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter string to convert..."
        rows={6}
        className="font-mono"
      />

      <div className="flex gap-2">
        <Button variant="secondary" onClick={handleSwap} disabled={!output}>
          ↕ Use Result as Input
        </Button>
        <Button variant="secondary" onClick={() => { setInput(''); setOutput(''); }}>
          Clear
        </Button>
      </div>

      {output && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Result
            </label>
            <CopyButton text={output} />
          </div>
          <Textarea
            value={output}
            readOnly
            rows={6}
            className="font-mono bg-gray-50 dark:bg-gray-800/50"
          />
        </div>
      )}

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">🔤 What is String Escape?</h2>
        <p className="text-sm leading-relaxed">
          String escaping converts characters with special meaning in programming languages or data formats
          into safe representations. For example, a double quote (") in a JSON string is interpreted as a
          string delimiter, so it must be escaped as \".
          This tool supports escape/unescape for 6 formats: JSON, JavaScript, HTML, URL, Regex, and SQL.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">📋 Format-Specific Rules</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h3 className="font-semibold mb-1">JSON / JavaScript</h3>
            <p>Escapes \\, ", ', newlines (\\n), tabs (\\t) with backslash prefix.</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h3 className="font-semibold mb-1">HTML</h3>
            <p>Converts &lt;, &gt;, &amp;, ", ' to HTML entities (&amp;lt; etc.).</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h3 className="font-semibold mb-1">Regex</h3>
            <p>Escapes regex special characters like . * + ? ^ $ with backslash.</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h3 className="font-semibold mb-1">SQL</h3>
            <p>Doubles single quotes ('' → '') to prevent SQL injection attacks.</p>
          </div>
        </div>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          { question: 'What happens if I skip escaping?', answer: 'Syntax errors, data loss, or security vulnerabilities (XSS, SQL injection) can occur. User input should always be properly escaped before use.' },
          { question: 'What is the difference between JSON and JavaScript escaping?', answer: 'JSON uses only double quotes (") as string delimiters, while JavaScript supports both single and double quotes. JavaScript also escapes \\0 (null character).' },
          { question: 'How does real-time auto-conversion work?', answer: 'Input is debounced by 300ms, automatically converting when typing stops. Changing the mode (escape/unescape) or format is reflected immediately.' },
        ]}
      />
    </div>
  );
}
