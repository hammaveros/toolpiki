'use client';

import { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';

const exampleJson = `{
  "store": {
    "name": "My Store",
    "books": [
      { "title": "Book Title 1", "author": "Author 1", "price": 8.95 },
      { "title": "Book Title 2", "author": "Author 2", "price": 12.99 },
      { "title": "Book Title 3", "author": "Author 1", "price": 8.99 }
    ],
    "bicycle": {
      "color": "red",
      "price": 399
    }
  }
}`;

const presetPaths = [
  { path: '$.store.name', desc: 'Store name' },
  { path: '$.store.books', desc: 'All books' },
  { path: '$.store.books[0]', desc: 'First book' },
  { path: '$.store.books[*].title', desc: 'All book titles' },
  { path: '$.store.books[*].price', desc: 'All book prices' },
  { path: '$.store.bicycle.color', desc: 'Bicycle color' },
];

export function JsonPathTesterEn() {
  const [jsonInput, setJsonInput] = useState(exampleJson);
  const [pathInput, setPathInput] = useState('$.store.books[*].title');
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState('');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Simple JSONPath implementation
  const evaluateJsonPath = (obj: unknown, path: string): unknown => {
    if (!path.startsWith('$')) throw new Error('Path must start with $');

    const tokens = path.slice(1).split(/\.|\[/).filter(Boolean);
    let current: unknown = obj;

    for (let i = 0; i < tokens.length; i++) {
      let token = tokens[i].replace(/\]$/, '');

      if (current === null || current === undefined) {
        return undefined;
      }

      // Array index
      if (/^\d+$/.test(token)) {
        if (!Array.isArray(current)) throw new Error(`${token} is not an array`);
        current = current[parseInt(token)];
      }
      // Wildcard
      else if (token === '*') {
        if (!Array.isArray(current)) throw new Error('* can only be used with arrays');
        // Process remaining path
        const remainingPath = '$.' + tokens.slice(i + 1).join('.');
        if (tokens.length > i + 1) {
          return current.map(item => evaluateJsonPath(item, remainingPath));
        }
        return current;
      }
      // Regular key
      else {
        if (typeof current !== 'object' || current === null) {
          throw new Error(`Cannot access ${token}`);
        }
        current = (current as Record<string, unknown>)[token];
      }
    }

    return current;
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (!jsonInput.trim() || !pathInput.trim()) {
        setResult('');
        setError('');
        return;
      }

      try {
        const json = JSON.parse(jsonInput);
        const pathResult = evaluateJsonPath(json, pathInput);
        setResult(JSON.stringify(pathResult, null, 2));
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error occurred');
        setResult('');
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [jsonInput, pathInput]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        <div className="flex flex-col">
          <Textarea
            label="JSON Data"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Enter JSON data..."
            rows={15}
            className="font-mono text-sm"
          />
          <Button
            variant="secondary"
            size="sm"
            className="mt-2"
            onClick={() => setJsonInput(exampleJson)}
          >
            Load Example
          </Button>
        </div>

        <div className="flex flex-col space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              JSONPath Expression
            </label>
            <input
              type="text"
              value={pathInput}
              onChange={(e) => setPathInput(e.target.value)}
              className="w-full px-3 py-2 font-mono border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              placeholder="$.store.books[*].title"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {presetPaths.map((preset) => (
              <Button
                key={preset.path}
                variant={pathInput === preset.path ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setPathInput(preset.path)}
                title={preset.desc}
              >
                {preset.path}
              </Button>
            ))}
          </div>

          {error ? (
            <Card variant="bordered" className="p-4 bg-red-50 dark:bg-red-900/20">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </Card>
          ) : result ? (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Result
                </label>
                <CopyButton text={result} />
              </div>
              <Textarea
                value={result}
                readOnly
                rows={10}
                className="font-mono text-sm bg-gray-50 dark:bg-gray-800/50"
              />
            </div>
          ) : null}
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
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🔍 Pluck Values Out of Deep JSON
        </h2>
        <p className="text-sm leading-relaxed">
          JSONPath is a tiny query language for JSON, similar to how XPath works on XML.
          With a single expression like <span className="font-mono">$.data.users[*].email</span> you can pull every email
          out of a 4-level nested API response without writing a loop. Paste your JSON on the left, type the path on
          the right, and the result appears after a 300ms debounce. Everything runs locally in your browser, so payloads
          containing access tokens, internal IDs, or PII never leave the page. Expressions you craft here translate
          almost directly to <span className="font-mono">jq</span>, Python <span className="font-mono">jsonpath-ng</span>,
          and Spring&apos;s JsonPath library.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 JSONPath Syntax Essentials
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Expression</th>
                <th className="text-left py-2 px-2">Description</th>
                <th className="text-left py-2 px-2">Example</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">$</td><td>Root object</td><td className="font-mono text-xs">$</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">.key</td><td>Property access</td><td className="font-mono text-xs">$.store.name</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">[n]</td><td>Array index (0-based)</td><td className="font-mono text-xs">$.books[0]</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">[*]</td><td>All elements</td><td className="font-mono text-xs">$.books[*].title</td></tr>
              <tr><td className="py-2 px-2 font-mono">..</td><td>Recursive descent</td><td className="font-mono text-xs">$..price</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🛠️ Where It Pays Off
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Paginated REST responses</strong> — <span className="font-mono">$.data.items[*].id</span> gives you 50 IDs in one shot.</li>
          <li><strong>Postman / Insomnia tests</strong> — Validate that your <span className="font-mono">pm.expect</span> path resolves before committing the test.</li>
          <li><strong>kubectl scripting</strong> — Prototype the expression you will paste into <span className="font-mono">-o jsonpath=...</span>.</li>
          <li><strong>Elasticsearch / OpenSearch responses</strong> — <span className="font-mono">$.hits.hits[*]._source</span> isolates the documents.</li>
          <li><strong>GraphQL response inspection</strong> — Drill into nested <span className="font-mono">data.viewer.repositories</span> structures fast.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Pitfall-Avoidance Tips
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li>Keys with dashes or spaces (like <span className="font-mono">user-name</span>) need bracket notation: <span className="font-mono">$[&apos;user-name&apos;]</span>.</li>
          <li>Getting <span className="font-mono">undefined</span>? Walk the path back one segment at a time—usually it&apos;s a typo or an unexpected null in the chain.</li>
          <li>On huge arrays, start with <span className="font-mono">[0:5]</span> to peek at the shape before unleashing <span className="font-mono">[*]</span>.</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'JSONPath vs JSON Pointer (RFC 6901) — when do I use which?',
            answer: 'JSON Pointer addresses exactly one node with a path like /store/books/0/title and is the right choice for JSON Patch (RFC 6902) or schema $refs. JSONPath is a query language: wildcards, recursion, filters. Use Pointer for precise referencing, JSONPath for extraction and search.',
          },
          {
            question: 'Are filter expressions like ?(@.price > 10) supported?',
            answer: 'This tool focuses on the core syntax: property access, array index, wildcard, and recursive descent. For full-spec filters, slices, or script expressions, fall back to a complete library such as jsonpath-plus or jq.',
          },
          {
            question: 'The result is always an array—how do I get a single scalar?',
            answer: 'Wildcards and recursive descent can match many nodes, so the result is wrapped in an array. Either append [0] to take the first match, or narrow the path with explicit indices and property names so only one node resolves.',
          },
          {
            question: 'How do I find a key anywhere in a deeply nested object?',
            answer: 'Use recursive descent: $..id collects every node with the key id, regardless of depth. It is convenient, but expensive on multi-megabyte JSON—scope it to a subtree (e.g. $.data..id) whenever you can.',
          },
        ]}
      />
    </div>
  );
}
