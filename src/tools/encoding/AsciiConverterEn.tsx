'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';

type OutputFormat = 'decimal' | 'hex' | 'binary';

export function AsciiConverterEn() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'text-to-ascii' | 'ascii-to-text'>('text-to-ascii');
  const [format, setFormat] = useState<OutputFormat>('decimal');

  const textToAscii = (text: string, fmt: OutputFormat): string => {
    return text
      .split('')
      .map((char) => {
        const code = char.charCodeAt(0);
        switch (fmt) {
          case 'decimal':
            return code.toString();
          case 'hex':
            return '0x' + code.toString(16).toUpperCase();
          case 'binary':
            return code.toString(2).padStart(8, '0');
        }
      })
      .join(' ');
  };

  const asciiToText = (ascii: string, fmt: OutputFormat): string => {
    try {
      const codes = ascii.trim().split(/\s+/);
      return codes
        .map((code) => {
          let num: number;
          switch (fmt) {
            case 'decimal':
              num = parseInt(code, 10);
              break;
            case 'hex':
              num = parseInt(code.replace('0x', ''), 16);
              break;
            case 'binary':
              num = parseInt(code, 2);
              break;
          }
          return String.fromCharCode(num);
        })
        .join('');
    } catch {
      return 'Conversion error: Invalid format.';
    }
  };

  const handleConvert = () => {
    if (mode === 'text-to-ascii') {
      setOutput(textToAscii(input, format));
    } else {
      setOutput(asciiToText(input, format));
    }
  };

  const handleSwap = () => {
    setMode(mode === 'text-to-ascii' ? 'ascii-to-text' : 'text-to-ascii');
    setInput(output);
    setOutput('');
  };

  const placeholders: Record<string, Record<OutputFormat, string>> = {
    'text-to-ascii': {
      decimal: 'Hello',
      hex: 'Hello',
      binary: 'Hello',
    },
    'ascii-to-text': {
      decimal: '72 101 108 108 111',
      hex: '0x48 0x65 0x6C 0x6C 0x6F',
      binary: '01001000 01100101 01101100 01101100 01101111',
    },
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={mode === 'text-to-ascii' ? 'primary' : 'secondary'}
          onClick={() => setMode('text-to-ascii')}
        >
          Text → ASCII
        </Button>
        <Button
          variant={mode === 'ascii-to-text' ? 'primary' : 'secondary'}
          onClick={() => setMode('ascii-to-text')}
        >
          ASCII → Text
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <label className="text-sm text-gray-600 dark:text-gray-400 self-center">Format:</label>
        <Button
          variant={format === 'decimal' ? 'primary' : 'secondary'}
          onClick={() => setFormat('decimal')}
          size="sm"
        >
          Decimal
        </Button>
        <Button
          variant={format === 'hex' ? 'primary' : 'secondary'}
          onClick={() => setFormat('hex')}
          size="sm"
        >
          Hexadecimal
        </Button>
        <Button
          variant={format === 'binary' ? 'primary' : 'secondary'}
          onClick={() => setFormat('binary')}
          size="sm"
        >
          Binary
        </Button>
      </div>

      <Textarea
        label={mode === 'text-to-ascii' ? 'Text' : 'ASCII Code'}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholders[mode][format]}
        rows={5}
      />

      <div className="flex gap-2">
        <Button onClick={handleConvert}>Convert</Button>
        <Button variant="secondary" onClick={handleSwap}>
          ↔ Switch Mode
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
          <Textarea value={output} readOnly rows={5} className="font-mono" />
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Common ASCII Codes
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          <div>A = 65</div>
          <div>Z = 90</div>
          <div>a = 97</div>
          <div>z = 122</div>
          <div>0 = 48</div>
          <div>9 = 57</div>
          <div>Space = 32</div>
          <div>Enter = 13</div>
        </div>
      </div>

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">💻 What is ASCII Converter?</h2>
        <p className="text-sm leading-relaxed">
          ASCII (American Standard Code for Information Interchange) is a character encoding standard that represents
          English letters, digits, and special characters using 7-bit numeric codes (0-127). Established in 1963,
          it became the foundation for computer communication and remains the base compatibility range for modern
          encodings like UTF-8. This tool converts between text and ASCII codes in decimal, hexadecimal, and binary formats.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">📊 ASCII Code Structure</h2>
        <div className="text-sm space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded"><strong>0-31</strong>: Control characters (newline, tab, etc.)</div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded"><strong>32-47</strong>: Special chars (space, !, ", # etc.)</div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded"><strong>48-57</strong>: Digits (0-9)</div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded"><strong>65-90</strong>: Uppercase (A-Z)</div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded"><strong>97-122</strong>: Lowercase (a-z)</div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded"><strong>127</strong>: DEL (delete control character)</div>
          </div>
        </div>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          { question: 'What is the difference between ASCII and Unicode?', answer: 'ASCII represents only 128 characters (English letters, digits, special chars). Unicode covers all characters worldwide and includes ASCII range (0-127) as a subset.' },
          { question: 'Can I convert non-English characters with ASCII?', answer: 'Non-English characters are outside the ASCII range. Use the Unicode Converter or UTF-8 tools for CJK, Arabic, Cyrillic, and other scripts.' },
          { question: 'Which format should I use: decimal, hex, or binary?', answer: 'Decimal is most readable for general use. Hexadecimal is common for memory addresses and color codes. Binary is used in bit operations and network protocol analysis.' },
        ]}
      />
    </div>
  );
}
