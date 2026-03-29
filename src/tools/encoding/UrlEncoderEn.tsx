'use client';

import { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';

export function UrlEncoderEn() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [encodeType, setEncodeType] = useState<'component' | 'full'>('component');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

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
      try {
        if (mode === 'encode') {
          if (encodeType === 'component') {
            setOutput(encodeURIComponent(input));
          } else {
            setOutput(encodeURI(input));
          }
        } else {
          if (encodeType === 'component') {
            setOutput(decodeURIComponent(input));
          } else {
            setOutput(decodeURI(input));
          }
        }
      } catch {
        // Don't show error while typing
        setOutput('');
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [input, encodeType, mode]);

  const handleEncode = () => {
    setMode('encode');
    if (encodeType === 'component') {
      setOutput(encodeURIComponent(input));
    } else {
      setOutput(encodeURI(input));
    }
  };

  const handleDecode = () => {
    setMode('decode');
    try {
      if (encodeType === 'component') {
        setOutput(decodeURIComponent(input));
      } else {
        setOutput(decodeURI(input));
      }
    } catch {
      setOutput('❌ Invalid URL encoding.\n\nHint: Check the %XX format. Example: %20 (space), %2F (/)');
    }
  };

  const handleExample = () => {
    setInput('Hello World! param=value&name=test');
    setOutput('');
  };

  const handleSwap = () => {
    setInput(output);
    setOutput('');
  };

  return (
    <div className="space-y-2">
      {/* Input */}
      <div>
        <Textarea
          label="Input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to encode or decode..."
          rows={5}
        />
      </div>

      {/* Encoding type selection */}
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="encodeType"
            checked={encodeType === 'component'}
            onChange={() => setEncodeType('component')}
            className="w-4 h-4"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            encodeURIComponent (Recommended)
          </span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="encodeType"
            checked={encodeType === 'full'}
            onChange={() => setEncodeType('full')}
            className="w-4 h-4"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            encodeURI (Full URL)
          </span>
        </label>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button variant="primary" onClick={handleEncode}>
          Encode
        </Button>
        <Button variant="secondary" onClick={handleDecode}>
          Decode
        </Button>
        <Button variant="secondary" onClick={handleExample}>
          Example
        </Button>
        {output && (
          <Button variant="ghost" onClick={handleSwap}>
            ↕ Swap Input/Output
          </Button>
        )}
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
          rows={5}
          className="bg-gray-50 dark:bg-gray-800/50 font-mono"
        />
      </div>

      {/* Help */}
      <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
        <p>
          • <strong>encodeURIComponent</strong>: Best for query parameter values
        </p>
        <p>
          • <strong>encodeURI</strong>: Full URL encoding (preserves :/? etc.)
        </p>
      </div>

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">🔗 What is URL Encoding?</h2>
        <p className="text-sm leading-relaxed">
          URL encoding (Percent-encoding) converts characters that are not allowed in URLs into %XX format.
          It's essential for safely transmitting URLs containing spaces, special characters, or non-ASCII characters.
          Following RFC 3986, reserved characters and non-ASCII characters are first converted to UTF-8 byte sequences,
          then each byte is represented as %HH. It is one of the most fundamental encoding methods in web development.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">⚙️ encodeURI vs encodeURIComponent</h2>
        <div className="text-sm space-y-3">
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h3 className="font-semibold mb-1">encodeURIComponent (Recommended)</h3>
            <p>Use for encoding query parameter values. Encodes all URL delimiters including =, &amp;, ?, /, : so special characters in parameter values are handled safely.</p>
            <code className="text-xs bg-gray-100 dark:bg-gray-700 px-1 rounded mt-1 inline-block">?name=encodeURIComponent("John&Jane")</code>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h3 className="font-semibold mb-1">encodeURI (Full URL)</h3>
            <p>Use for encoding complete URLs. Preserves URL structure characters like :, /, ?, #, &amp; while encoding everything else.</p>
            <code className="text-xs bg-gray-100 dark:bg-gray-700 px-1 rounded mt-1 inline-block">encodeURI("https://example.com/search?q=hello world")</code>
          </div>
        </div>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          { question: 'Why is URL encoding necessary?', answer: 'URLs only allow ASCII characters. Spaces, special characters, and non-ASCII text must be converted to %XX format so browsers and servers can interpret them correctly.' },
          { question: 'Should spaces be encoded as + or %20?', answer: 'encodeURIComponent encodes spaces as %20. The + sign is only used in application/x-www-form-urlencoded format (HTML forms).' },
          { question: 'Why do encoded URLs look so long?', answer: 'Non-ASCII characters like CJK text are first converted to UTF-8 bytes, where each character may produce 3 bytes (%XX%XX%XX). This is normal and ensures cross-platform compatibility.' },
        ]}
      />
    </div>
  );
}
