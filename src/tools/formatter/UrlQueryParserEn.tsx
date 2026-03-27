'use client';

import { useState, useMemo } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🔗 What is URL Query Parser?
        </h2>
        <p className="text-sm leading-relaxed">
          URL Query Parser extracts and edits query parameters (?key=value format) from URLs.
          Analyze UTM parameters in marketing URLs, debug API endpoint query strings,
          and automatically decode encoded values for easy inspection.
          Edited parameters are reconstructed into a new URL ready to copy and use.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 Understanding URL Structure
        </h2>
        <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded text-xs font-mono mb-3">
          <span className="text-blue-600">https://</span>
          <span className="text-green-600">example.com</span>
          <span className="text-purple-600">/path/to/page</span>
          <span className="text-orange-600">?key1=value1&key2=value2</span>
          <span className="text-red-600">#section</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
          <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded"><span className="text-blue-600">Protocol</span>: https://</div>
          <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded"><span className="text-green-600">Host</span>: Domain name</div>
          <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded"><span className="text-purple-600">Path</span>: Page location</div>
          <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded"><span className="text-orange-600">Query</span>: ?key=value</div>
          <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded"><span className="text-red-600">Hash</span>: #anchor</div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 UTM Parameter Guide
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>utm_source</strong>: Traffic source (google, facebook, newsletter)</li>
          <li><strong>utm_medium</strong>: Marketing medium (cpc, email, social)</li>
          <li><strong>utm_campaign</strong>: Campaign name (spring_sale, launch)</li>
          <li><strong>utm_term</strong>: Search keywords (for paid search)</li>
          <li><strong>utm_content</strong>: Content variation (for A/B testing)</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'What is URL encoding?',
            answer: 'URL encoding converts special characters and non-ASCII text into %XX format for safe transmission. Example: space becomes %20, and special characters are percent-encoded.',
          },
          {
            question: 'What happens with multiple parameters using the same key?',
            answer: 'The URL standard allows multiple values for the same key (e.g., ?color=red&color=blue). This tool displays each as a separate parameter.',
          },
          {
            question: 'Is the hash (#) fragment sent to the server?',
            answer: 'No, the hash fragment is browser-only and never sent to the server. It is used for in-page navigation or client-side routing in SPAs.',
          },
        ]}
      />
    </div>
  );
}

interface QueryParam {
  key: string;
  value: string;
  decoded: string;
}

export function UrlQueryParserEn() {
  const [url, setUrl] = useState('');
  const [params, setParams] = useState<QueryParam[]>([]);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const parsed = useMemo(() => {
    if (!url.trim()) return null;

    try {
      let urlObj: URL;
      try {
        urlObj = new URL(url);
      } catch {
        urlObj = new URL(`https://${url}`);
      }

      const searchParams = urlObj.searchParams;
      const queryParams: QueryParam[] = [];

      searchParams.forEach((value, key) => {
        queryParams.push({
          key,
          value,
          decoded: decodeURIComponent(value),
        });
      });

      return {
        protocol: urlObj.protocol,
        host: urlObj.host,
        pathname: urlObj.pathname,
        hash: urlObj.hash,
        params: queryParams,
      };
    } catch {
      return null;
    }
  }, [url]);

  const reconstructedUrl = useMemo(() => {
    if (!parsed) return '';

    const urlObj = new URL(`${parsed.protocol}//${parsed.host}${parsed.pathname}`);

    params.forEach(({ key, value }) => {
      if (key) urlObj.searchParams.set(key, value);
    });

    if (parsed.hash) {
      urlObj.hash = parsed.hash;
    }

    return urlObj.toString();
  }, [parsed, params]);

  const handleParse = () => {
    if (parsed) {
      setParams(parsed.params.map((p) => ({ ...p })));
    }
  };

  const updateParam = (index: number, field: 'key' | 'value', newVal: string) => {
    setParams((prev) =>
      prev.map((p, i) =>
        i === index
          ? { ...p, [field]: newVal, decoded: field === 'value' ? decodeURIComponent(newVal) : p.decoded }
          : p
      )
    );
  };

  const removeParam = (index: number) => {
    setParams((prev) => prev.filter((_, i) => i !== index));
  };

  const addParam = () => {
    if (!newKey.trim()) return;
    setParams((prev) => [
      ...prev,
      { key: newKey, value: newValue, decoded: decodeURIComponent(newValue) },
    ]);
    setNewKey('');
    setNewValue('');
  };

  return (
    <div className="space-y-2">
      {/* URL Input */}
      <div>
        <Textarea
          label="URL Input"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/path?key1=value1&key2=value2"
          rows={3}
        />
        <div className="flex justify-end mt-2">
          <Button onClick={handleParse} disabled={!parsed}>
            Extract Parameters
          </Button>
        </div>
      </div>

      {/* Parsed result */}
      {parsed && (
        <Card variant="bordered" className="p-4">
          <p className="text-sm font-medium mb-3">URL Structure</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Protocol:</span>
              <span className="ml-2 font-mono">{parsed.protocol}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Host:</span>
              <span className="ml-2 font-mono">{parsed.host}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Path:</span>
              <span className="ml-2 font-mono">{parsed.pathname}</span>
            </div>
            {parsed.hash && (
              <div>
                <span className="text-gray-500 dark:text-gray-400">Hash:</span>
                <span className="ml-2 font-mono">{parsed.hash}</span>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Parameter editor */}
      {params.length > 0 && (
        <Card variant="bordered" className="p-4">
          <p className="text-sm font-medium mb-3">Query Parameters ({params.length})</p>
          <div className="space-y-3">
            {params.map((param, idx) => (
              <div key={idx} className="flex gap-2 items-start">
                <Input
                  value={param.key}
                  onChange={(e) => updateParam(idx, 'key', e.target.value)}
                  placeholder="key"
                  className="flex-1"
                />
                <span className="text-gray-400 mt-2">=</span>
                <div className="flex-[2]">
                  <Input
                    value={param.value}
                    onChange={(e) => updateParam(idx, 'value', e.target.value)}
                    placeholder="value"
                  />
                  {param.value !== param.decoded && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono truncate">
                      Decoded: {param.decoded}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => removeParam(idx)}
                  className="mt-2 text-gray-400 hover:text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Add parameter */}
          <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Input
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="New key"
              className="flex-1"
            />
            <span className="text-gray-400 mt-2">=</span>
            <Input
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="New value"
              className="flex-[2]"
              onKeyDown={(e) => e.key === 'Enter' && addParam()}
            />
            <Button variant="secondary" onClick={addParam}>
              Add
            </Button>
          </div>
        </Card>
      )}

      {/* Reconstructed URL */}
      {params.length > 0 && reconstructedUrl && (
        <Card variant="bordered" className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">Reconstructed URL</p>
            <CopyButton text={reconstructedUrl} />
          </div>
          <p className="font-mono text-sm break-all bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
            {reconstructedUrl}
          </p>
        </Card>
      )}

      {/* Tips */}
      <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
        <p>• Enter a URL and click "Extract Parameters" to edit</p>
        <p>• Encoded values are automatically decoded for display</p>
      </div>

      <SeoContent />
    </div>
  );
}
