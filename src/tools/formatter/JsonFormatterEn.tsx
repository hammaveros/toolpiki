'use client';

import { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { Select } from '@/components/ui/Select';
import { TwoColumnLayout } from '@/components/ui/TwoColumnLayout';
import { FaqSection } from '@/components/ui/FaqItem';

function JsonTreeNode({
  data,
  keyName,
  defaultExpanded = true,
  depth = 0,
}: {
  data: unknown;
  keyName?: string;
  defaultExpanded?: boolean;
  depth?: number;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  if (data === null) {
    return (
      <div style={{ paddingLeft: depth * 16 }} className="font-mono text-sm py-0.5">
        {keyName !== undefined && (
          <span className="text-purple-600 dark:text-purple-400">&quot;{keyName}&quot;: </span>
        )}
        <span className="text-gray-500">null</span>
      </div>
    );
  }

  if (typeof data === 'boolean') {
    return (
      <div style={{ paddingLeft: depth * 16 }} className="font-mono text-sm py-0.5">
        {keyName !== undefined && (
          <span className="text-purple-600 dark:text-purple-400">&quot;{keyName}&quot;: </span>
        )}
        <span className="text-orange-600 dark:text-orange-400">{data.toString()}</span>
      </div>
    );
  }

  if (typeof data === 'number') {
    return (
      <div style={{ paddingLeft: depth * 16 }} className="font-mono text-sm py-0.5">
        {keyName !== undefined && (
          <span className="text-purple-600 dark:text-purple-400">&quot;{keyName}&quot;: </span>
        )}
        <span className="text-blue-600 dark:text-blue-400">{data}</span>
      </div>
    );
  }

  if (typeof data === 'string') {
    return (
      <div style={{ paddingLeft: depth * 16 }} className="font-mono text-sm py-0.5">
        {keyName !== undefined && (
          <span className="text-purple-600 dark:text-purple-400">&quot;{keyName}&quot;: </span>
        )}
        <span className="text-green-600 dark:text-green-400">&quot;{data}&quot;</span>
      </div>
    );
  }

  if (Array.isArray(data)) {
    const count = data.length;
    return (
      <div style={{ paddingLeft: depth * 16 }} className="font-mono text-sm">
        <button
          onClick={() => setExpanded(!expanded)}
          className="py-0.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded px-1 -ml-1"
        >
          <span className="text-gray-400 mr-1">{expanded ? '\u25BC' : '\u25B6'}</span>
          {keyName !== undefined && (
            <span className="text-purple-600 dark:text-purple-400">&quot;{keyName}&quot;: </span>
          )}
          <span className="text-gray-500">
            [{!expanded && <span> ...{count}items </span>}]
          </span>
        </button>
        {expanded && (
          <>
            {data.map((item, i) => (
              <JsonTreeNode key={i} data={item} depth={depth + 1} defaultExpanded={true} />
            ))}
          </>
        )}
      </div>
    );
  }

  if (typeof data === 'object') {
    const entries = Object.entries(data as Record<string, unknown>);
    const count = entries.length;
    return (
      <div style={{ paddingLeft: depth * 16 }} className="font-mono text-sm">
        <button
          onClick={() => setExpanded(!expanded)}
          className="py-0.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded px-1 -ml-1"
        >
          <span className="text-gray-400 mr-1">{expanded ? '\u25BC' : '\u25B6'}</span>
          {keyName !== undefined && (
            <span className="text-purple-600 dark:text-purple-400">&quot;{keyName}&quot;: </span>
          )}
          <span className="text-gray-500">
            {'{'}
            {!expanded && <span> ...{count}keys </span>}
            {!expanded && '}'}
          </span>
        </button>
        {expanded && (
          <>
            {entries.map(([key, value]) => (
              <JsonTreeNode key={key} data={value} keyName={key} depth={depth + 1} defaultExpanded={true} />
            ))}
            <div style={{ paddingLeft: (depth + 1) * 16 - 16 }} className="text-gray-500 py-0.5 pl-1">{'}'}</div>
          </>
        )}
      </div>
    );
  }

  return null;
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 What is JSON Formatter?
        </h2>
        <p className="text-sm leading-relaxed">
          JSON (JavaScript Object Notation) is the most widely used lightweight format for data exchange.
          JSON Formatter prettifies compressed JSON with indentation and line breaks for readability,
          or minifies it by removing unnecessary whitespace. It is an essential tool for API response analysis,
          config file editing, database record inspection, and debugging throughout development workflows.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🔧 Key Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">Format (Prettify)</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Indent compressed JSON with 2/4 spaces or tabs for readability
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">Minify</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Remove whitespace and line breaks to minimize file size
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">Validation</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Detect JSON syntax errors with specific location and cause hints
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">Real-time Conversion</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Auto-format as you type (300ms debounce)
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 JSON Syntax Rules
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li>Keys must be wrapped in double quotes (single quotes not allowed)</li>
          <li>String values use double quotes; numbers/booleans/null do not</li>
          <li>Trailing commas after the last item are not allowed</li>
          <li>Comments are not supported (JSON5, JSONC do support them)</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'What is the difference between JSON and JavaScript objects?',
            answer: 'JSON is a data exchange format requiring double-quoted keys and does not support functions, undefined, or comments. JavaScript objects are more flexible but must follow JSON rules when serializing.',
          },
          {
            question: 'What is the standard indentation size?',
            answer: 'There is no official standard. 2 spaces is most common, 4 spaces is also popular. Follow your project coding conventions.',
          },
          {
            question: 'How can I add comments to JSON?',
            answer: 'Standard JSON does not support comments. For config files, use JSONC (JSON with Comments) or JSON5 format, or use workarounds like a "_comment" key.',
          },
        ]}
      />
    </div>
  );
}

export function JsonFormatterEn() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState('2');
  const [parsedJson, setParsedJson] = useState<unknown>(null);
  const [viewMode, setViewMode] = useState<'tree' | 'text'>('text');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const getIndentValue = (ind: string): string | number => {
    if (ind === 'tab') return '\t';
    return parseInt(ind);
  };

  // Auto-format (runs 300ms after input changes)
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!input.trim()) {
      setOutput('');
      setError('');
      setParsedJson(null);
      return;
    }

    debounceRef.current = setTimeout(() => {
      try {
        const parsed = JSON.parse(input);
        setOutput(JSON.stringify(parsed, null, getIndentValue(indent)));
        setParsedJson(parsed);
        setError('');
      } catch (e) {
        const hint = getJsonErrorHint((e as Error).message);
        setError(`JSON parsing error: ${hint}`);
        setOutput('');
        setParsedJson(null);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [input, indent]);

  const getJsonErrorHint = (errorMessage: string): string => {
    const msg = errorMessage.toLowerCase();
    if (msg.includes('unexpected token')) {
      if (msg.includes("'")) return 'Use double quotes (") instead of single quotes (\').';
      return 'Unexpected character found. Check commas (,) and quotes (").';
    }
    if (msg.includes('unexpected end')) return 'JSON is incomplete. Make sure all braces ({}) and brackets ([]) are closed.';
    if (msg.includes('position')) {
      const match = errorMessage.match(/position (\d+)/i);
      if (match) return `Error near character ${match[1]}. Check commas and quotes around that position.`;
    }
    return 'Keys must be wrapped in double quotes ("). Trailing commas are not allowed.';
  };

  const handleFormat = () => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, getIndentValue(indent)));
      setParsedJson(parsed);
    } catch (e) {
      const hint = getJsonErrorHint((e as Error).message);
      setError(`JSON parsing error: ${hint}`);
      setOutput('');
      setParsedJson(null);
    }
  };

  const handleBeautify = () => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      const beautified = JSON.stringify(parsed, null, getIndentValue(indent));
      setInput(beautified);
      setOutput(beautified);
      setParsedJson(parsed);
    } catch (e) {
      const hint = getJsonErrorHint((e as Error).message);
      setError(`JSON parsing error: ${hint}`);
    }
  };

  const handleMinify = () => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setInput(minified);
      setParsedJson(parsed);
    } catch (e) {
      const hint = getJsonErrorHint((e as Error).message);
      setError(`JSON parsing error: ${hint}`);
      setOutput('');
      setParsedJson(null);
    }
  };

  const handleValidate = () => {
    setError('');
    try {
      JSON.parse(input);
      setError('');
      setOutput('✓ Valid JSON.');
      setParsedJson(null);
    } catch (e) {
      const hint = getJsonErrorHint((e as Error).message);
      setError(`Invalid JSON: ${hint}`);
      setOutput('');
      setParsedJson(null);
    }
  };

  const handleSample = () => {
    const sample = {
      name: 'JSSpace',
      version: '1.0.0',
      features: ['JSON Formatter', 'Code Converter', 'Hash Generator'],
      config: {
        theme: 'dark',
        language: 'en',
      },
      active: true,
    };
    setInput(JSON.stringify(sample));
  };

  return (
    <div className="space-y-2">
      {/* Options and buttons */}
      <div className="flex flex-wrap gap-3 items-end">
        <div className="w-32">
          <Select
            label="Indent"
            value={indent}
            onChange={(e) => setIndent(e.target.value)}
            options={[
              { value: '2', label: '2 spaces' },
              { value: '4', label: '4 spaces' },
              { value: 'tab', label: 'Tab' },
            ]}
          />
        </div>
        <Button variant="primary" onClick={handleBeautify}>
          Beautify
        </Button>
        <Button variant="secondary" onClick={handleFormat}>
          Format
        </Button>
        <Button variant="secondary" onClick={handleMinify}>
          Minify
        </Button>
        <Button variant="secondary" onClick={handleValidate}>
          Validate
        </Button>
      </div>

      {/* Two column layout */}
      <TwoColumnLayout
        leftLabel="JSON Input"
        leftHeader={
          <Button variant="secondary" size="sm" onClick={handleSample}>
            Sample JSON
          </Button>
        }
        rightLabel="Result"
        rightHeader={
          <div className="flex items-center gap-2">
            {parsedJson !== null && (
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setViewMode('text')}
                  className={`px-2 py-0.5 text-xs rounded transition-colors ${
                    viewMode === 'text'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  Beautify
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('tree')}
                  className={`px-2 py-0.5 text-xs rounded transition-colors ${
                    viewMode === 'tree'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  Tree
                </button>
              </div>
            )}
            {output && !output.startsWith('✓') && <CopyButton text={output} />}
          </div>
        }
        left={
          <Textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError('');
            }}
            placeholder='{"key": "value"}'
            rows={32}
            className="font-mono text-sm h-[600px]"
            error={error}
          />
        }
        right={
          parsedJson !== null && viewMode === 'tree' ? (
            <div className="w-full h-[600px] overflow-auto rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 p-4">
              <JsonTreeNode data={parsedJson} defaultExpanded={true} />
            </div>
          ) : (
            <Textarea
              value={output}
              readOnly
              placeholder="Formatted JSON will appear here."
              rows={32}
              className={`font-mono text-sm h-[600px] ${
                output.startsWith('✓')
                  ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
                  : 'bg-gray-50 dark:bg-gray-800/50'
              }`}
            />
          )
        }
      />

      <SeoContent />
    </div>
  );
}
