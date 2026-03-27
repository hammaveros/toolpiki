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
          UUID (Universally Unique Identifier) is a 128-bit identifier that is globally unique.
          This tool generates UUID version 4 (random), with astronomically low collision probability making it practically unique.
          Used for database primary keys, API tokens, session IDs, filenames, and anywhere duplicates are not allowed.
          Powered by Web Crypto API for cryptographically secure random number generation.
        </p>
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
        ]}
      />
    </div>
  );
}
