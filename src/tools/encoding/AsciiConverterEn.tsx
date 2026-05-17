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
          ASCII was standardised in 1963 by ANSI X3.4 as a 7-bit code that maps the integers 0 through 127 onto English letters, digits, punctuation, and a handful of control characters.
          Its teletype origins are still visible today through <code>\n</code> (LF, 10), <code>\r</code> (CR, 13), and <code>\t</code> (TAB, 9), which carry over into every modern programming language.
          This tool decomposes a string character by character and shows each code in decimal, hexadecimal, and binary, or rebuilds text from any of those forms.
          It is especially handy while learning C, Java, or Python and verifying how a string is actually stored in memory.
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

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">🧠 Handy ASCII Tricks</h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc pl-5">
          <li><strong>Case toggle in one bit</strong>: 'A' (65) and 'a' (97) differ only at bit 5. Flipping that bit with <code>code ^ 0x20</code> swaps case in a single CPU instruction, faster than any string method.</li>
          <li><strong>Digit to integer</strong>: classic <code>atoi</code> implementations rely on <code>'9' - '0' = 9</code>. The subtraction works because digits occupy a contiguous block from 48 to 57.</li>
          <li><strong>Alphabet test</strong>: range checks 65–90 and 97–122 outperform regex by an order of magnitude and dominate embedded firmware parsing.</li>
          <li><strong>HTTP parsing</strong>: every protocol delimiter — <code>:</code> (58), space (32), and CRLF (13, 10) — lives in ASCII, which is why byte-level HTTP/1.1 parsers stay simple and portable.</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          { question: 'ASCII vs Unicode — what is the difference?', answer: 'ASCII is a 7-bit table of 128 characters; Unicode is a much larger catalogue of more than 150,000. The first 128 Unicode code points are identical to ASCII, so English-only data behaves the same either way. The difference shows up once you bring in non-Latin scripts, emoji, or math symbols, which need a Unicode encoding such as UTF-8.' },
          { question: 'Can I convert non-English characters with this tool?', answer: 'Strictly speaking, no. Anything beyond U+007F is outside ASCII. If you paste, say, an emoji or a CJK character the tool prints the underlying UTF-16 code unit JavaScript exposes, which is technically not an ASCII code. For those scripts, switch to the Unicode Converter instead.' },
          { question: 'Decimal, hex, or binary — when to use which?', answer: 'Decimal reads most naturally for humans. Hexadecimal is the standard for memory dumps, packet captures, and color codes because it groups four bits per digit. Binary is best when you really need to highlight bit-level structure, such as permission flags or protocol headers.' },
        ]}
      />
    </div>
  );
}
