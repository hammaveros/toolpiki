'use client';

import { useState, useCallback } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';

type HashAlgorithm = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';

interface HashResult {
  algorithm: HashAlgorithm;
  hash: string;
}

export function HashGeneratorEn() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<HashResult[]>([]);
  const [loading, setLoading] = useState(false);

  const generateHash = useCallback(
    async (algorithm: HashAlgorithm): Promise<string> => {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);

      // MD5 is not supported by Web Crypto API
      if (algorithm === 'MD5') {
        return md5(input);
      }

      const hashBuffer = await crypto.subtle.digest(algorithm, data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    },
    [input]
  );

  const handleGenerateAll = async () => {
    if (!input) return;

    setLoading(true);
    const algorithms: HashAlgorithm[] = [
      'MD5',
      'SHA-1',
      'SHA-256',
      'SHA-384',
      'SHA-512',
    ];

    const newResults: HashResult[] = [];

    for (const algorithm of algorithms) {
      const hash = await generateHash(algorithm);
      newResults.push({ algorithm, hash });
    }

    setResults(newResults);
    setLoading(false);
  };

  const handleGenerateSingle = async (algorithm: HashAlgorithm) => {
    if (!input) return;

    setLoading(true);
    const hash = await generateHash(algorithm);
    setResults([{ algorithm, hash }]);
    setLoading(false);
  };

  return (
    <div className="space-y-2">
      {/* Input */}
      <div>
        <Textarea
          label="Text to Hash"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to generate hash..."
          rows={5}
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="primary"
          onClick={handleGenerateAll}
          disabled={!input || loading}
        >
          Generate All Hashes
        </Button>
        <Button
          variant="secondary"
          onClick={() => handleGenerateSingle('MD5')}
          disabled={!input || loading}
        >
          MD5
        </Button>
        <Button
          variant="secondary"
          onClick={() => handleGenerateSingle('SHA-256')}
          disabled={!input || loading}
        >
          SHA-256
        </Button>
        <Button
          variant="secondary"
          onClick={() => handleGenerateSingle('SHA-512')}
          disabled={!input || loading}
        >
          SHA-512
        </Button>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Results
          </p>
          {results.map((result) => (
            <Card key={result.algorithm} variant="bordered" className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {result.algorithm}
                </span>
                <CopyButton text={result.hash} size="sm" />
              </div>
              <code className="text-sm break-all font-mono text-gray-600 dark:text-gray-400">
                {result.hash}
              </code>
            </Card>
          ))}
        </div>
      )}

      {/* Help */}
      <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
        <p>• MD5: 128-bit hash (not recommended for security)</p>
        <p>• SHA-256: 256-bit hash (most widely used)</p>
        <p>• SHA-512: 512-bit hash (higher security)</p>
      </div>

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">🔒 What is Hash Generator?</h2>
        <p className="text-sm leading-relaxed">
          A hash function takes any input and produces a fixed-length output called a hash.
          The same input always produces the same hash, but recovering the original from the hash is impossible.
          It is widely used for file integrity verification, password storage, digital signatures, and blockchain.
          This tool supports MD5, SHA-1, SHA-256, SHA-384, and SHA-512 algorithms.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">📊 Hash Algorithm Comparison</h2>
        <div className="text-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-2">Algorithm</th>
                <th className="text-left py-2 px-2">Output Length</th>
                <th className="text-left py-2 px-2">Security</th>
                <th className="text-left py-2 px-2">Use Case</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              <tr className="border-b border-gray-100 dark:border-gray-800"><td className="py-1 px-2">MD5</td><td className="py-1 px-2">128bit (32 chars)</td><td className="py-1 px-2 text-red-500">Weak</td><td className="py-1 px-2">Checksums (non-security)</td></tr>
              <tr className="border-b border-gray-100 dark:border-gray-800"><td className="py-1 px-2">SHA-1</td><td className="py-1 px-2">160bit (40 chars)</td><td className="py-1 px-2 text-yellow-500">Deprecated</td><td className="py-1 px-2">Legacy compatibility</td></tr>
              <tr className="border-b border-gray-100 dark:border-gray-800"><td className="py-1 px-2">SHA-256</td><td className="py-1 px-2">256bit (64 chars)</td><td className="py-1 px-2 text-green-500">Secure</td><td className="py-1 px-2">General purpose (recommended)</td></tr>
              <tr className="border-b border-gray-100 dark:border-gray-800"><td className="py-1 px-2">SHA-384</td><td className="py-1 px-2">384bit (96 chars)</td><td className="py-1 px-2 text-green-500">Secure</td><td className="py-1 px-2">High security</td></tr>
              <tr><td className="py-1 px-2">SHA-512</td><td className="py-1 px-2">512bit (128 chars)</td><td className="py-1 px-2 text-green-500">Secure</td><td className="py-1 px-2">Maximum security</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          { question: 'Why is MD5 considered insecure?', answer: 'Collision attacks were discovered in 2004, meaning two different inputs can produce the same hash. Use MD5 only for non-security purposes like file checksums.' },
          { question: 'Which hash should I use for passwords?', answer: 'Use dedicated password hashing functions like bcrypt, scrypt, or Argon2 instead of general hash functions. These are intentionally slow to resist brute-force attacks.' },
          { question: 'Will the same text produce the same hash on different computers?', answer: 'Yes, the same algorithm and input always produce identical hash values regardless of the platform. This property makes hashing useful for file integrity verification.' },
        ]}
      />
    </div>
  );
}

// MD5 implementation (Web Crypto API doesn't support MD5)
function md5(string: string): string {
  function rotateLeft(value: number, shift: number) {
    return (value << shift) | (value >>> (32 - shift));
  }

  function addUnsigned(x: number, y: number) {
    const x8 = x & 0x80000000;
    const y8 = y & 0x80000000;
    const x4 = x & 0x40000000;
    const y4 = y & 0x40000000;
    const result = (x & 0x3fffffff) + (y & 0x3fffffff);
    if (x4 & y4) return result ^ 0x80000000 ^ x8 ^ y8;
    if (x4 | y4) {
      if (result & 0x40000000) return result ^ 0xc0000000 ^ x8 ^ y8;
      else return result ^ 0x40000000 ^ x8 ^ y8;
    } else return result ^ x8 ^ y8;
  }

  function f(x: number, y: number, z: number) {
    return (x & y) | (~x & z);
  }
  function g(x: number, y: number, z: number) {
    return (x & z) | (y & ~z);
  }
  function h(x: number, y: number, z: number) {
    return x ^ y ^ z;
  }
  function i(x: number, y: number, z: number) {
    return y ^ (x | ~z);
  }

  function ff(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(f(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function gg(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(g(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function hh(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(h(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function ii(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(i(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function convertToWordArray(str: string) {
    let wordCount;
    const msgLength = str.length;
    const msgLengthMod = msgLength + 8;
    const wordArrayMod = (msgLengthMod - (msgLengthMod % 64)) / 64;
    const wordArrayLength = (wordArrayMod + 1) * 16;
    const wordArray = Array(wordArrayLength - 1);
    let bytePosition = 0;
    let byteCount = 0;
    while (byteCount < msgLength) {
      wordCount = (byteCount - (byteCount % 4)) / 4;
      bytePosition = (byteCount % 4) * 8;
      wordArray[wordCount] = wordArray[wordCount] | (str.charCodeAt(byteCount) << bytePosition);
      byteCount++;
    }
    wordCount = (byteCount - (byteCount % 4)) / 4;
    bytePosition = (byteCount % 4) * 8;
    wordArray[wordCount] = wordArray[wordCount] | (0x80 << bytePosition);
    wordArray[wordArrayLength - 2] = msgLength << 3;
    wordArray[wordArrayLength - 1] = msgLength >>> 29;
    return wordArray;
  }

  function wordToHex(value: number) {
    let hex = '',
      temp = '',
      byte,
      count;
    for (count = 0; count <= 3; count++) {
      byte = (value >>> (count * 8)) & 255;
      temp = '0' + byte.toString(16);
      hex = hex + temp.slice(-2);
    }
    return hex;
  }

  const utf8Encode = unescape(encodeURIComponent(string));
  const x = convertToWordArray(utf8Encode);

  let a = 0x67452301,
    b = 0xefcdab89,
    c = 0x98badcfe,
    d = 0x10325476;

  const S11 = 7, S12 = 12, S13 = 17, S14 = 22;
  const S21 = 5, S22 = 9, S23 = 14, S24 = 20;
  const S31 = 4, S32 = 11, S33 = 16, S34 = 23;
  const S41 = 6, S42 = 10, S43 = 15, S44 = 21;

  for (let k = 0; k < x.length; k += 16) {
    const AA = a, BB = b, CC = c, DD = d;

    a = ff(a, b, c, d, x[k + 0], S11, 0xd76aa478);
    d = ff(d, a, b, c, x[k + 1], S12, 0xe8c7b756);
    c = ff(c, d, a, b, x[k + 2], S13, 0x242070db);
    b = ff(b, c, d, a, x[k + 3], S14, 0xc1bdceee);
    a = ff(a, b, c, d, x[k + 4], S11, 0xf57c0faf);
    d = ff(d, a, b, c, x[k + 5], S12, 0x4787c62a);
    c = ff(c, d, a, b, x[k + 6], S13, 0xa8304613);
    b = ff(b, c, d, a, x[k + 7], S14, 0xfd469501);
    a = ff(a, b, c, d, x[k + 8], S11, 0x698098d8);
    d = ff(d, a, b, c, x[k + 9], S12, 0x8b44f7af);
    c = ff(c, d, a, b, x[k + 10], S13, 0xffff5bb1);
    b = ff(b, c, d, a, x[k + 11], S14, 0x895cd7be);
    a = ff(a, b, c, d, x[k + 12], S11, 0x6b901122);
    d = ff(d, a, b, c, x[k + 13], S12, 0xfd987193);
    c = ff(c, d, a, b, x[k + 14], S13, 0xa679438e);
    b = ff(b, c, d, a, x[k + 15], S14, 0x49b40821);

    a = gg(a, b, c, d, x[k + 1], S21, 0xf61e2562);
    d = gg(d, a, b, c, x[k + 6], S22, 0xc040b340);
    c = gg(c, d, a, b, x[k + 11], S23, 0x265e5a51);
    b = gg(b, c, d, a, x[k + 0], S24, 0xe9b6c7aa);
    a = gg(a, b, c, d, x[k + 5], S21, 0xd62f105d);
    d = gg(d, a, b, c, x[k + 10], S22, 0x2441453);
    c = gg(c, d, a, b, x[k + 15], S23, 0xd8a1e681);
    b = gg(b, c, d, a, x[k + 4], S24, 0xe7d3fbc8);
    a = gg(a, b, c, d, x[k + 9], S21, 0x21e1cde6);
    d = gg(d, a, b, c, x[k + 14], S22, 0xc33707d6);
    c = gg(c, d, a, b, x[k + 3], S23, 0xf4d50d87);
    b = gg(b, c, d, a, x[k + 8], S24, 0x455a14ed);
    a = gg(a, b, c, d, x[k + 13], S21, 0xa9e3e905);
    d = gg(d, a, b, c, x[k + 2], S22, 0xfcefa3f8);
    c = gg(c, d, a, b, x[k + 7], S23, 0x676f02d9);
    b = gg(b, c, d, a, x[k + 12], S24, 0x8d2a4c8a);

    a = hh(a, b, c, d, x[k + 5], S31, 0xfffa3942);
    d = hh(d, a, b, c, x[k + 8], S32, 0x8771f681);
    c = hh(c, d, a, b, x[k + 11], S33, 0x6d9d6122);
    b = hh(b, c, d, a, x[k + 14], S34, 0xfde5380c);
    a = hh(a, b, c, d, x[k + 1], S31, 0xa4beea44);
    d = hh(d, a, b, c, x[k + 4], S32, 0x4bdecfa9);
    c = hh(c, d, a, b, x[k + 7], S33, 0xf6bb4b60);
    b = hh(b, c, d, a, x[k + 10], S34, 0xbebfbc70);
    a = hh(a, b, c, d, x[k + 13], S31, 0x289b7ec6);
    d = hh(d, a, b, c, x[k + 0], S32, 0xeaa127fa);
    c = hh(c, d, a, b, x[k + 3], S33, 0xd4ef3085);
    b = hh(b, c, d, a, x[k + 6], S34, 0x4881d05);
    a = hh(a, b, c, d, x[k + 9], S31, 0xd9d4d039);
    d = hh(d, a, b, c, x[k + 12], S32, 0xe6db99e5);
    c = hh(c, d, a, b, x[k + 15], S33, 0x1fa27cf8);
    b = hh(b, c, d, a, x[k + 2], S34, 0xc4ac5665);

    a = ii(a, b, c, d, x[k + 0], S41, 0xf4292244);
    d = ii(d, a, b, c, x[k + 7], S42, 0x432aff97);
    c = ii(c, d, a, b, x[k + 14], S43, 0xab9423a7);
    b = ii(b, c, d, a, x[k + 5], S44, 0xfc93a039);
    a = ii(a, b, c, d, x[k + 12], S41, 0x655b59c3);
    d = ii(d, a, b, c, x[k + 3], S42, 0x8f0ccc92);
    c = ii(c, d, a, b, x[k + 10], S43, 0xffeff47d);
    b = ii(b, c, d, a, x[k + 1], S44, 0x85845dd1);
    a = ii(a, b, c, d, x[k + 8], S41, 0x6fa87e4f);
    d = ii(d, a, b, c, x[k + 15], S42, 0xfe2ce6e0);
    c = ii(c, d, a, b, x[k + 6], S43, 0xa3014314);
    b = ii(b, c, d, a, x[k + 13], S44, 0x4e0811a1);
    a = ii(a, b, c, d, x[k + 4], S41, 0xf7537e82);
    d = ii(d, a, b, c, x[k + 11], S42, 0xbd3af235);
    c = ii(c, d, a, b, x[k + 2], S43, 0x2ad7d2bb);
    b = ii(b, c, d, a, x[k + 9], S44, 0xeb86d391);

    a = addUnsigned(a, AA);
    b = addUnsigned(b, BB);
    c = addUnsigned(c, CC);
    d = addUnsigned(d, DD);
  }

  return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase();
}
