'use client';

import { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';

export function Base64ToolEn() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Auto convert
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }

    debounceRef.current = setTimeout(() => {
      try {
        if (mode === 'encode') {
          const encoded = btoa(
            encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (_, p1) =>
              String.fromCharCode(parseInt(p1, 16))
            )
          );
          setOutput(encoded);
          setError('');
        } else {
          const decoded = decodeURIComponent(
            Array.prototype.map
              .call(atob(input.replace(/\s/g, '')), (c: string) =>
                '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
              )
              .join('')
          );
          setOutput(decoded);
          setError('');
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
  }, [input, mode]);

  const handleEncode = () => {
    setError('');
    try {
      // UTF-8 encoding support
      const encoded = btoa(
        encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (_, p1) =>
          String.fromCharCode(parseInt(p1, 16))
        )
      );
      setOutput(encoded);
      setMode('encode');
    } catch {
      setError('Failed to encode.');
    }
  };

  const handleDecode = () => {
    setError('');
    try {
      // UTF-8 decoding support
      const decoded = decodeURIComponent(
        Array.prototype.map
          .call(atob(input), (c: string) =>
            '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
          )
          .join('')
      );
      setOutput(decoded);
      setMode('decode');
    } catch {
      setError('Invalid Base64 string. Only A-Z, a-z, 0-9, +, /, = characters are allowed.');
    }
  };

  const handleExample = () => {
    if (mode === 'encode') {
      setInput('Hello, World! 안녕하세요!');
    } else {
      setInput('SGVsbG8sIFdvcmxkISDslYjrhZXtlZjshLjsmpQh');
    }
    setOutput('');
    setError('');
  };

  const handleSwap = () => {
    setInput(output);
    setOutput('');
    setError('');
  };

  return (
    <div className="space-y-2">
      {/* Input */}
      <div>
        <Textarea
          label={mode === 'encode' ? 'Text to Encode' : 'Base64 to Decode'}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError('');
          }}
          placeholder={
            mode === 'encode'
              ? 'Enter text to encode...'
              : 'Enter Base64 string to decode...'
          }
          rows={6}
          error={error}
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button variant="primary" onClick={handleEncode}>
          Encode (Text → Base64)
        </Button>
        <Button variant="secondary" onClick={handleDecode}>
          Decode (Base64 → Text)
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
            Result {mode === 'encode' ? '(Base64)' : '(Text)'}
          </label>
          {output && <CopyButton text={output} />}
        </div>
        <Textarea
          value={output}
          readOnly
          placeholder="Result will appear here."
          rows={6}
          className="bg-gray-50 dark:bg-gray-800/50 font-mono"
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
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">🔐 What is Base64 Encoding?</h2>
        <p className="text-sm leading-relaxed">
          Base64 is an encoding scheme that converts binary data into 64 ASCII characters (A-Z, a-z, 0-9, +, /).
          It is widely used in email systems (MIME), HTML Data URLs, REST API communication, and anywhere
          binary data needs to be safely transmitted through text-only channels.
          While it increases data size by roughly 33%, it ensures data integrity across different systems.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">📋 Common Use Cases</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h3 className="font-semibold mb-1">Email Attachments</h3>
            <p>MIME standard encodes attachments in Base64 because email protocols only support 7-bit ASCII.</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h3 className="font-semibold mb-1">Data URLs (Inline Images)</h3>
            <p>Embed images directly in CSS or HTML using data:image/png;base64,... format.</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h3 className="font-semibold mb-1">JWT Tokens</h3>
            <p>JSON Web Token Header and Payload are encoded using Base64url encoding.</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h3 className="font-semibold mb-1">API Authentication</h3>
            <p>HTTP Basic Auth sends username:password encoded in Base64.</p>
          </div>
        </div>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          { question: 'Is Base64 encryption?', answer: 'No, Base64 is encoding, not encryption. Anyone can easily decode it, so never use Base64 alone to protect passwords or sensitive information.' },
          { question: 'How much larger does Base64 make data?', answer: 'Base64 increases data size by approximately 33%. This is because 3 bytes of original data are converted into 4 Base64 characters.' },
          { question: 'What is the difference between Base64 and Base64url?', answer: 'Base64url replaces + with - and / with _, and omits padding (=) to make it URL-safe. It is commonly used in JWT tokens.' },
        ]}
      />
    </div>
  );
}
