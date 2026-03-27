'use client';

import { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { TwoColumnLayout } from '@/components/ui/TwoColumnLayout';
import { FaqSection } from '@/components/ui/FaqItem';

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🔄 What is YAML ↔ JSON Converter?
        </h2>
        <p className="text-sm leading-relaxed">
          YAML (YAML Ain't Markup Language) and JSON (JavaScript Object Notation) are both data serialization formats
          with different syntax. YAML uses indentation and is human-readable, while JSON uses braces and quotes for machine processing.
          This tool converts between the two formats bidirectionally, useful for Docker Compose, Kubernetes, GitHub Actions
          config files and API response analysis.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 YAML vs JSON Comparison
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Aspect</th>
                <th className="text-left py-2 px-2">YAML</th>
                <th className="text-left py-2 px-2">JSON</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2">Syntax</td><td>Indentation-based</td><td>Braces, brackets</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2">Comments</td><td># supported</td><td>Not supported</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2">Quotes</td><td>Optional</td><td>Required</td></tr>
              <tr><td className="py-2 px-2">Main Use</td><td>Config files</td><td>API communication</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Use Cases
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li>Convert Docker Compose YAML to JSON for programmatic parsing</li>
          <li>Convert Kubernetes manifests to JSON for API submission</li>
          <li>Convert JSON API responses to YAML for readable inspection</li>
          <li>Debug GitHub Actions workflow files</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Does it support complex YAML?',
            answer: 'This tool supports basic YAML syntax (key-value, arrays, nested objects). Advanced features like anchors (&), aliases (*), and multiline strings (|, >) are only partially supported.',
          },
          {
            question: 'What happens to YAML comments?',
            answer: 'JSON does not support comments, so YAML # comments are removed during conversion. Save important comments separately.',
          },
          {
            question: 'How does type conversion work?',
            answer: 'true/false become booleans, numeric values become Numbers, null/~ become null. Wrap in quotes to keep as strings.',
          },
        ]}
      />
    </div>
  );
}

export function YamlJsonConverterEn() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'yaml-to-json' | 'json-to-yaml'>('yaml-to-json');
  const [error, setError] = useState('');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const parseYaml = (yaml: string): unknown => {
    const lines = yaml.split('\n');
    const result: Record<string, unknown> = {};
    const stack: { indent: number; obj: Record<string, unknown>; key?: string }[] = [{ indent: -1, obj: result }];

    for (const line of lines) {
      if (!line.trim() || line.trim().startsWith('#')) continue;

      const indent = line.search(/\S/);
      const content = line.trim();

      while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
        stack.pop();
      }

      const parent = stack[stack.length - 1].obj;

      if (content.startsWith('- ')) {
        const value = content.slice(2).trim();
        const parentKey = stack[stack.length - 1].key;

        if (parentKey) {
          if (!Array.isArray(parent[parentKey])) {
            parent[parentKey] = [];
          }
          const arr = parent[parentKey] as unknown[];

          if (value.includes(':')) {
            const [k, v] = value.split(':').map(s => s.trim());
            const newObj: Record<string, unknown> = { [k]: parseValue(v) };
            arr.push(newObj);
            stack.push({ indent, obj: newObj, key: k });
          } else {
            arr.push(parseValue(value));
          }
        }
        continue;
      }

      if (content.includes(':')) {
        const colonIdx = content.indexOf(':');
        const key = content.slice(0, colonIdx).trim();
        const value = content.slice(colonIdx + 1).trim();

        if (value === '' || value === '|' || value === '>') {
          parent[key] = {};
          stack.push({ indent, obj: parent[key] as Record<string, unknown>, key });
        } else {
          parent[key] = parseValue(value);
          stack.push({ indent, obj: parent, key });
        }
      }
    }

    return result;
  };

  const parseValue = (value: string): unknown => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (value === 'null' || value === '~') return null;
    if (!isNaN(Number(value)) && value !== '') return Number(value);
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      return value.slice(1, -1);
    }
    return value;
  };

  const jsonToYaml = (obj: unknown, indent: number = 0): string => {
    const spaces = '  '.repeat(indent);
    let result = '';

    if (Array.isArray(obj)) {
      obj.forEach((item) => {
        if (typeof item === 'object' && item !== null) {
          result += `${spaces}- `;
          const entries = Object.entries(item);
          entries.forEach(([k, v], idx) => {
            if (idx === 0) {
              if (typeof v === 'object' && v !== null) {
                result += `${k}:\n${jsonToYaml(v, indent + 2)}`;
              } else {
                result += `${k}: ${formatYamlValue(v)}\n`;
              }
            } else {
              if (typeof v === 'object' && v !== null) {
                result += `${spaces}  ${k}:\n${jsonToYaml(v, indent + 2)}`;
              } else {
                result += `${spaces}  ${k}: ${formatYamlValue(v)}\n`;
              }
            }
          });
        } else {
          result += `${spaces}- ${formatYamlValue(item)}\n`;
        }
      });
    } else if (typeof obj === 'object' && obj !== null) {
      Object.entries(obj).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          result += `${spaces}${key}:\n${jsonToYaml(value, indent + 1)}`;
        } else {
          result += `${spaces}${key}: ${formatYamlValue(value)}\n`;
        }
      });
    }

    return result;
  };

  const formatYamlValue = (value: unknown): string => {
    if (value === null) return 'null';
    if (typeof value === 'string') {
      if (value.includes(':') || value.includes('#') || value.includes('\n')) {
        return `"${value}"`;
      }
      return value;
    }
    return String(value);
  };

  // Auto convert (runs 300ms after input changes)
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
        if (mode === 'yaml-to-json') {
          const parsed = parseYaml(input);
          setOutput(JSON.stringify(parsed, null, 2));
          setError('');
        } else {
          const parsed = JSON.parse(input);
          setOutput(jsonToYaml(parsed));
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

  const handleConvert = () => {
    setError('');
    try {
      if (mode === 'yaml-to-json') {
        const parsed = parseYaml(input);
        setOutput(JSON.stringify(parsed, null, 2));
      } else {
        const parsed = JSON.parse(input);
        setOutput(jsonToYaml(parsed));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred during conversion.');
      setOutput('');
    }
  };

  const handleSwap = () => {
    setMode(mode === 'yaml-to-json' ? 'json-to-yaml' : 'yaml-to-json');
    setInput(output);
    setOutput('');
    setError('');
  };

  return (
    <div className="space-y-2">
      {/* Mode selection and buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={mode === 'yaml-to-json' ? 'primary' : 'secondary'}
          onClick={() => setMode('yaml-to-json')}
        >
          YAML → JSON
        </Button>
        <Button
          variant={mode === 'json-to-yaml' ? 'primary' : 'secondary'}
          onClick={() => setMode('json-to-yaml')}
        >
          JSON → YAML
        </Button>
        <Button onClick={handleConvert}>Convert</Button>
        <Button variant="secondary" onClick={handleSwap}>
          ↔ Switch Mode
        </Button>
        <Button variant="secondary" onClick={() => { setInput(''); setOutput(''); setError(''); }}>
          Clear
        </Button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Two column layout */}
      <TwoColumnLayout
        leftLabel={mode === 'yaml-to-json' ? 'YAML' : 'JSON'}
        rightLabel={mode === 'yaml-to-json' ? 'JSON' : 'YAML'}
        rightHeader={output ? <CopyButton text={output} /> : undefined}
        left={
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === 'yaml-to-json'
                ? 'name: John Doe\nage: 30\nhobbies:\n  - reading\n  - coding'
                : '{\n  "name": "John Doe",\n  "age": 30,\n  "hobbies": ["reading", "coding"]\n}'
            }
            rows={16}
            className="font-mono text-sm h-[400px]"
          />
        }
        right={
          <Textarea
            value={output}
            readOnly
            placeholder="Conversion result will appear here."
            rows={16}
            className="font-mono text-sm h-[400px] bg-gray-50 dark:bg-gray-800/50"
          />
        }
      />

      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs text-gray-600 dark:text-gray-400">
        <p>Note: This tool only supports basic YAML syntax. Complex YAML may not convert accurately.</p>
      </div>

      <SeoContent />
    </div>
  );
}
