'use client';

import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';

export function UuidGeneratorEn() {
  const [count, setCount] = useState(1);
  const [uuids, setUuids] = useState<string[]>([]);
  const [format, setFormat] = useState<'default' | 'uppercase' | 'nodash'>('default');

  const generateUuid = useCallback((): string => {
    let uuid = crypto.randomUUID();

    switch (format) {
      case 'uppercase':
        uuid = uuid.toUpperCase();
        break;
      case 'nodash':
        uuid = uuid.replace(/-/g, '');
        break;
    }

    return uuid;
  }, [format]);

  const handleGenerate = () => {
    const newUuids: string[] = [];
    for (let i = 0; i < count; i++) {
      newUuids.push(generateUuid());
    }
    setUuids(newUuids);
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(uuids.join('\n'));
  };

  return (
    <div className="space-y-2">
      {/* Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Count"
          type="number"
          min={1}
          max={100}
          value={count}
          onChange={(e) => setCount(Math.min(100, Math.max(1, Number(e.target.value))))}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Format
          </label>
          <div className="flex flex-wrap gap-2">
            <FormatButton
              active={format === 'default'}
              onClick={() => setFormat('default')}
            >
              Default
            </FormatButton>
            <FormatButton
              active={format === 'uppercase'}
              onClick={() => setFormat('uppercase')}
            >
              Uppercase
            </FormatButton>
            <FormatButton
              active={format === 'nodash'}
              onClick={() => setFormat('nodash')}
            >
              No Dashes
            </FormatButton>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <Button variant="primary" onClick={handleGenerate} className="w-full sm:w-auto">
        Generate UUID
      </Button>

      {/* Results */}
      {uuids.length > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Generated UUIDs ({uuids.length})
            </p>
            {uuids.length > 1 && (
              <Button variant="ghost" size="sm" onClick={handleCopyAll}>
                Copy All
              </Button>
            )}
          </div>
          {uuids.map((uuid, index) => (
            <Card key={index} variant="bordered" className="p-3">
              <div className="flex items-center justify-between gap-3">
                <code className="text-sm font-mono text-gray-900 dark:text-white flex-1">
                  {uuid}
                </code>
                <CopyButton text={uuid} size="sm" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Help */}
      <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
        <p>• Generates UUID v4 (random UUID).</p>
        <p>• Uses the browser's crypto.randomUUID() API.</p>
        <p>• Generated UUIDs are globally unique.</p>
      </div>

      <SeoContent />
    </div>
  );
}

function FormatButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors min-h-[36px] ${
        active
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
    >
      {children}
    </button>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🔑 What is UUID Generator?
        </h2>
        <p className="text-sm leading-relaxed">
          <strong className="text-gray-900 dark:text-white">UUID (Universally Unique Identifier) is a 128-bit globally unique identifier.</strong>{' '}
          This tool generates <strong>UUID version 4 (random)</strong>, with astronomically low collision probability making it practically unique.
          Used for <strong>database primary keys, API tokens, session IDs, filenames</strong>, and anywhere duplicates are not allowed.
          Powered by the <strong>Web Crypto API</strong> for cryptographically secure random number generation.
        </p>

        <div className="mt-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 p-4 text-sm">
          <p className="font-semibold text-blue-900 dark:text-blue-200 mb-1">💡 Key Point</p>
          <p className="text-blue-800 dark:text-blue-300">v4 uses <strong>122 bits of randomness</strong>, making collisions effectively impossible. It's the most widely adopted version.</p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 UUID Version Comparison
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Version</th>
                <th className="text-left py-2 px-2">Generation Method</th>
                <th className="text-left py-2 px-2">Characteristics</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">v1</td><td>Time + MAC address</td><td>Traceable, security concerns</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">v4 ✓</td><td>Random (this tool)</td><td>Most widely used, untraceable</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">v5</td><td>Namespace + SHA-1</td><td>Same input = same UUID</td></tr>
              <tr><td className="py-2 px-2 font-medium">v7</td><td>Time + random</td><td>Sortable, newest standard</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 UUID Usage Tips
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Database keys</strong>: Use UUID instead of auto-increment for distributed systems</li>
          <li><strong>Case sensitivity</strong>: Spec says case-insensitive, but maintain consistency</li>
          <li><strong>No dashes</strong>: Use when a 32-character continuous string is needed</li>
          <li><strong>URL safe</strong>: UUIDs can be safely included in URLs</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🔍 UUID Versions in Detail
        </h2>
        <p className="text-sm leading-relaxed mb-3">
          A closer look at the most commonly used versions helps you pick the right one.
        </p>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>v1 (time + MAC)</strong>: Embeds the generation time so you can extract a timestamp later. The downside is that it leaks part of the host MAC address, which is a concern in security-sensitive contexts.</li>
          <li><strong>v4 (random)</strong>: Built on 122 bits of randomness. It is the most common choice, untraceable, and easy to implement, which is why most languages ship it as the default. This tool generates v4.</li>
          <li><strong>v7 (time + random)</strong>: Standardized in RFC 9562 (2024). The leading bytes carry a millisecond Unix timestamp, so the values are sortable and produce friendlier B-tree index locality than v4. It is gaining traction as a primary key in distributed systems.</li>
          <li><strong>v5 (namespace hash)</strong>: Always returns the same UUID for the same namespace and name pair. Useful when you need a deterministic ID derived from inputs like a URL or DNS name.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🆚 UUID vs GUID vs ULID
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Identifier</th>
                <th className="text-left py-2 px-2">Length</th>
                <th className="text-left py-2 px-2">Sortable?</th>
                <th className="text-left py-2 px-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">UUID</td><td>36 chars (with dashes)</td><td>Only v7</td><td>RFC standard, most widely supported</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">GUID</td><td>36 chars</td><td>Same as UUID</td><td>Microsoft terminology, technically a UUID</td></tr>
              <tr><td className="py-2 px-2 font-medium">ULID</td><td>26 chars (Crockford Base32)</td><td>Time-sortable</td><td>Popular before UUID v7, shorter and URL-friendly</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🛡️ Security Considerations
        </h2>
        <p className="text-sm leading-relaxed mb-3">
          <strong>A UUID is "unique" but not necessarily "secret."</strong> Where you place it changes what you need to think about.
        </p>

        <div className="mt-4 mb-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 p-4 text-sm">
          <p className="font-semibold text-amber-900 dark:text-amber-200 mb-1">⚠️ Warning</p>
          <p className="text-amber-800 dark:text-amber-300">A UUID is an <strong>identifier</strong>, not a <strong>secret</strong>. Don't use it as an authentication token.</p>
        </div>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Not a substitute for secrets</strong>: For auth tokens or password reset links, generate a dedicated random string (for example 32 random bytes) instead of a UUID. The 122 random bits in v4 may look strong, but the value is meant to be an identifier, not a secret.</li>
          <li><strong>Predictability</strong>: v1 leaks the timestamp and MAC fragment, so avoid exposing it directly in public APIs. v4 and v7 random parts are not predictable.</li>
          <li><strong>Enumeration protection</strong>: Replacing auto-increment IDs with UUIDs prevents trivial guesses like /users/1, /users/2, adding a layer of defense against IDOR-style issues. Do not use it as a replacement for proper authorization checks though.</li>
          <li><strong>Logs and URLs</strong>: UUIDs end up in server logs, search engines, and analytics. Treat sensitive resources with explicit access checks regardless of how unguessable the URL looks.</li>
          <li><strong>Random source</strong>: This tool uses the browser's <code>crypto.randomUUID()</code>, which is backed by the OS-level cryptographically secure random number generator.</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Can UUIDs ever collide?',
            answer: 'UUID v4 collision probability is 1 in 2^122. You would need to generate 1 billion per second for 85 years to reach 50% probability. Practically, collisions never occur.',
          },
          {
            question: 'What is the difference between GUID and UUID?',
            answer: 'GUID (Globally Unique Identifier) is Microsoft terminology for UUID. They are identical in format and generation method.',
          },
          {
            question: 'What is the UUID format?',
            answer: 'The format is xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx. The 4 indicates version (v4), and y is one of 8, 9, a, or b.',
          },
          {
            question: 'Will UUID primary keys hurt database performance?',
            answer: 'Random UUIDs like v4 scatter index pages and can slow down writes on large tables. If that is a concern, consider UUID v7 or ULID. Both keep index locality close to that of an auto-increment key while still being globally unique.',
          },
          {
            question: 'Is it OK to use a UUID as an authentication token?',
            answer: 'Not recommended. The 122 random bits in UUID v4 look strong, but the value is designed to be an identifier rather than a secret. For session tokens or password reset links, generate a dedicated random string of at least 32 bytes.',
          },
        ]}
      />
    </div>
  );
}
