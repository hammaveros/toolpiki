'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';

export function HtmlEntityEn() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const encode = useCallback((text: string): string => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/\//g, '&#x2F;')
      .replace(/`/g, '&#x60;')
      .replace(/=/g, '&#x3D;');
  }, []);

  const decode = useCallback((text: string): string => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  }, []);

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
      if (mode === 'encode') {
        setOutput(encode(input));
      } else {
        setOutput(decode(input));
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [input, mode, encode, decode]);

  const handleConvert = () => {
    if (mode === 'encode') {
      setOutput(encode(input));
    } else {
      setOutput(decode(input));
    }
  };

  const handleSwap = () => {
    setMode(mode === 'encode' ? 'decode' : 'encode');
    setInput(output);
    setOutput('');
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={mode === 'encode' ? 'primary' : 'secondary'}
          onClick={() => setMode('encode')}
        >
          Encode
        </Button>
        <Button
          variant={mode === 'decode' ? 'primary' : 'secondary'}
          onClick={() => setMode('decode')}
        >
          Decode
        </Button>
      </div>

      <Textarea
        label={mode === 'encode' ? 'Plain Text' : 'HTML Entities'}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={mode === 'encode' ? '<div class="test">' : '&lt;div class=&quot;test&quot;&gt;'}
        rows={6}
      />

      <div className="flex gap-2">
        <Button onClick={handleConvert}>
          {mode === 'encode' ? 'Encode' : 'Decode'}
        </Button>
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
          <Textarea value={output} readOnly rows={6} />
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Common HTML Entities
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          <div>&lt; → &amp;lt;</div>
          <div>&gt; → &amp;gt;</div>
          <div>&amp; → &amp;amp;</div>
          <div>&quot; → &amp;quot;</div>
          <div>&apos; → &amp;#39;</div>
          <div>&nbsp; → &amp;nbsp;</div>
          <div>&copy; → &amp;copy;</div>
          <div>&reg; → &amp;reg;</div>
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
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">🏷️ What is HTML Entity Encoding?</h2>
        <p className="text-sm leading-relaxed">
          HTML entities are character references used to safely represent characters with special meaning in HTML.
          Characters like &lt;, &gt;, and &amp; can be interpreted as HTML tags, so they must be converted to entities.
          This is the most fundamental method for preventing XSS (Cross-Site Scripting) attacks in web security,
          and is a mandatory process when displaying user input in HTML content.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">📌 Common HTML Entities</h2>
        <div className="text-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-2">Character</th>
                <th className="text-left py-2 px-2">Named Entity</th>
                <th className="text-left py-2 px-2">Numeric Entity</th>
                <th className="text-left py-2 px-2">Description</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs">
              <tr className="border-b border-gray-100 dark:border-gray-800"><td className="py-1 px-2">&lt;</td><td className="py-1 px-2">&amp;lt;</td><td className="py-1 px-2">&amp;#60;</td><td className="py-1 px-2 font-sans">Less than</td></tr>
              <tr className="border-b border-gray-100 dark:border-gray-800"><td className="py-1 px-2">&gt;</td><td className="py-1 px-2">&amp;gt;</td><td className="py-1 px-2">&amp;#62;</td><td className="py-1 px-2 font-sans">Greater than</td></tr>
              <tr className="border-b border-gray-100 dark:border-gray-800"><td className="py-1 px-2">&amp;</td><td className="py-1 px-2">&amp;amp;</td><td className="py-1 px-2">&amp;#38;</td><td className="py-1 px-2 font-sans">Ampersand</td></tr>
              <tr className="border-b border-gray-100 dark:border-gray-800"><td className="py-1 px-2">&quot;</td><td className="py-1 px-2">&amp;quot;</td><td className="py-1 px-2">&amp;#34;</td><td className="py-1 px-2 font-sans">Double quote</td></tr>
              <tr className="border-b border-gray-100 dark:border-gray-800"><td className="py-1 px-2">&apos;</td><td className="py-1 px-2">&amp;#39;</td><td className="py-1 px-2">&amp;#39;</td><td className="py-1 px-2 font-sans">Single quote</td></tr>
              <tr><td className="py-1 px-2">&nbsp;</td><td className="py-1 px-2">&amp;nbsp;</td><td className="py-1 px-2">&amp;#160;</td><td className="py-1 px-2 font-sans">Non-breaking space</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          { question: 'What happens if I skip HTML entity encoding?', answer: 'User input containing tags like <script> can lead to XSS attacks. Entity encoding is a fundamental web security practice.' },
          { question: 'Named vs numeric entities - what is the difference?', answer: 'Named entities (&amp;lt;) are more readable, while numeric entities (&amp;#60;) are supported by all browsers. Both produce identical results.' },
          { question: 'Does React handle HTML entity encoding automatically?', answer: 'JSX in React automatically escapes strings to prevent XSS. However, when using dangerouslySetInnerHTML, manual encoding is still required.' },
        ]}
      />
    </div>
  );
}
