'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';

type ConversionMode = 'text-to-unicode' | 'unicode-to-text' | 'text-to-utf8' | 'utf8-to-text';

export function UnicodeConverterEn() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<ConversionMode>('text-to-unicode');

  const textToUnicode = (text: string): string => {
    return text
      .split('')
      .map((char) => '\\u' + char.charCodeAt(0).toString(16).padStart(4, '0'))
      .join('');
  };

  const unicodeToText = (unicode: string): string => {
    try {
      return unicode.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
        String.fromCharCode(parseInt(hex, 16))
      );
    } catch {
      return 'Conversion error: Invalid Unicode format.';
    }
  };

  const textToUtf8 = (text: string): string => {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(text);
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0').toUpperCase())
      .join(' ');
  };

  const utf8ToText = (hex: string): string => {
    try {
      const bytes = hex
        .trim()
        .split(/\s+/)
        .map((h) => parseInt(h, 16));
      const decoder = new TextDecoder();
      return decoder.decode(new Uint8Array(bytes));
    } catch {
      return 'Conversion error: Invalid UTF-8 format.';
    }
  };

  const handleConvert = () => {
    switch (mode) {
      case 'text-to-unicode':
        setOutput(textToUnicode(input));
        break;
      case 'unicode-to-text':
        setOutput(unicodeToText(input));
        break;
      case 'text-to-utf8':
        setOutput(textToUtf8(input));
        break;
      case 'utf8-to-text':
        setOutput(utf8ToText(input));
        break;
    }
  };

  const modeLabels: Record<ConversionMode, { input: string; output: string; placeholder: string }> = {
    'text-to-unicode': {
      input: 'Text',
      output: 'Unicode',
      placeholder: 'Hello World',
    },
    'unicode-to-text': {
      input: 'Unicode',
      output: 'Text',
      placeholder: '\\u0048\\u0065\\u006c\\u006c\\u006f',
    },
    'text-to-utf8': {
      input: 'Text',
      output: 'UTF-8 (HEX)',
      placeholder: 'Hello World',
    },
    'utf8-to-text': {
      input: 'UTF-8 (HEX)',
      output: 'Text',
      placeholder: '48 65 6C 6C 6F',
    },
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={mode === 'text-to-unicode' ? 'primary' : 'secondary'}
          onClick={() => setMode('text-to-unicode')}
          size="sm"
        >
          Text → Unicode
        </Button>
        <Button
          variant={mode === 'unicode-to-text' ? 'primary' : 'secondary'}
          onClick={() => setMode('unicode-to-text')}
          size="sm"
        >
          Unicode → Text
        </Button>
        <Button
          variant={mode === 'text-to-utf8' ? 'primary' : 'secondary'}
          onClick={() => setMode('text-to-utf8')}
          size="sm"
        >
          Text → UTF-8
        </Button>
        <Button
          variant={mode === 'utf8-to-text' ? 'primary' : 'secondary'}
          onClick={() => setMode('utf8-to-text')}
          size="sm"
        >
          UTF-8 → Text
        </Button>
      </div>

      <Textarea
        label={modeLabels[mode].input}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={modeLabels[mode].placeholder}
        rows={5}
      />

      <div className="flex gap-2">
        <Button onClick={handleConvert}>Convert</Button>
        <Button variant="secondary" onClick={() => { setInput(''); setOutput(''); }}>
          Clear
        </Button>
      </div>

      {output && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {modeLabels[mode].output}
            </label>
            <CopyButton text={output} />
          </div>
          <Textarea value={output} readOnly rows={5} />
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
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">🌐 What is Unicode Converter?</h2>
        <p className="text-sm leading-relaxed">
          Unicode is an international standard that represents all characters worldwide in a single character set.
          Each character is assigned a unique code point (U+XXXX), supporting over 150,000 characters.
          This tool converts text to Unicode escape (\uXXXX) format or UTF-8 bytes (HEX).
          It is useful for safely representing non-ASCII characters in JSON and JavaScript source code.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">📋 Conversion Modes</h2>
        <div className="text-sm space-y-2">
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h3 className="font-semibold mb-1">Text → Unicode (\uXXXX)</h3>
            <p>Converts each character to \u + 4-digit hex. Used in JavaScript and JSON. Example: "A" → \u0041</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h3 className="font-semibold mb-1">Text → UTF-8 (HEX)</h3>
            <p>Shows UTF-8 encoded byte values in hexadecimal. Useful for network debugging. Example: "A" → 41</p>
          </div>
        </div>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          { question: 'What is the difference between Unicode and UTF-8?', answer: 'Unicode is a character set (which number is assigned to each character), while UTF-8 is an encoding method (how to store those numbers as bytes). UTF-8 is the most widely used way to store Unicode.' },
          { question: 'Where is the \\uXXXX format used?', answer: 'It is used in JavaScript strings and JSON files to represent non-ASCII characters. The \\u prefix followed by 4 hex digits can represent all BMP (Basic Multilingual Plane) characters.' },
          { question: 'How many bytes is a CJK character in UTF-8?', answer: 'CJK characters (Chinese, Japanese, Korean) use 3 bytes in UTF-8 encoding, 2 bytes in UTF-16. Their Unicode code points typically fall in various ranges like U+4E00-U+9FFF.' },
        ]}
      />
    </div>
  );
}
