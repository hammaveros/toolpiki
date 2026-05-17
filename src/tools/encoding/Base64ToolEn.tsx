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
      setInput('Hello, World! This is a test.');
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
          <strong className="text-gray-900 dark:text-white">Base64 safely carries binary data across text-only channels.</strong>{' '}
          It first appeared in <strong>RFC 1421 (PEM)</strong> in 1987 and was formalised for general use in the <strong>MIME specification (RFC 2045)</strong>.
          It slices arbitrary binary data into <strong>6-bit chunks</strong> and maps each chunk to one of 64 printable ASCII characters — A–Z, a–z, 0–9, plus &quot;+&quot; and &quot;/&quot; — with <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">=</code> used as padding when the input length isn&apos;t a multiple of three bytes.
          The practical purpose is bridging text-only channels: SMTP, HTTP headers, JSON, and XML all tolerate ASCII but can mangle raw bytes.
          Base64 grows payloads by <strong>roughly 4/3 (about 33%)</strong>, the trade-off for safe transport through systems that might otherwise rewrite line endings or strip the high bit.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">📋 Common Use Cases</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h3 className="font-semibold mb-1">Email Attachments</h3>
            <p><strong>MIME standard</strong> encodes attachments in Base64 because email protocols only support <strong>7-bit ASCII</strong>.</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h3 className="font-semibold mb-1">Data URLs (Inline Images)</h3>
            <p>Embed images directly in CSS or HTML using <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">data:image/png;base64,...</code> format.</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h3 className="font-semibold mb-1">JWT Tokens</h3>
            <p>JSON Web Token <strong>Header and Payload</strong> are encoded using <strong>Base64url</strong> encoding.</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h3 className="font-semibold mb-1">API Authentication</h3>
            <p>HTTP <strong>Basic Auth</strong> sends <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">username:password</code> encoded in Base64.</p>
          </div>
        </div>
      </section>

      <div className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 p-4 text-sm">
        <p className="font-semibold text-red-900 dark:text-red-200 mb-1">🔒 Security Note</p>
        <p className="text-red-800 dark:text-red-300">Base64 is <strong>encoding, not encryption</strong>. Anyone can decode it in seconds. Use bcrypt/Argon2 for passwords and HTTPS/TLS for transport security.</p>
      </div>

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
