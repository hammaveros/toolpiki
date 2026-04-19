'use client';

import { useState } from 'react';
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
          📊 What is JSON ↔ CSV Converter?
        </h2>
        <p className="text-sm leading-relaxed">
          JSON (JavaScript Object Notation) and CSV (Comma-Separated Values) are both formats for data storage and transfer.
          JSON is commonly used for API communication, while CSV is preferred for spreadsheet work.
          This tool converts between the two formats bidirectionally, allowing you to open API data in Excel
          or convert spreadsheet data to JSON for use in web applications.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 JSON vs CSV Comparison
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Aspect</th>
                <th className="text-left py-2 px-2">JSON</th>
                <th className="text-left py-2 px-2">CSV</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2">Structure</td><td>Hierarchical (nestable)</td><td>Flat (tabular)</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2">Type Support</td><td>Number, string, boolean, null, array, object</td><td>All strings</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2">Readability</td><td>Developer-friendly</td><td>Excel-friendly</td></tr>
              <tr><td className="py-2 px-2">Main Use</td><td>APIs, config files</td><td>Data export, bulk upload</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Use Cases
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li>Convert REST API responses to CSV for Excel analysis</li>
          <li>Convert Excel data to JSON for web app uploads</li>
          <li>Open database dumps in spreadsheets</li>
          <li>Generate and convert test data formats</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Can nested JSON be converted to CSV?',
            answer: 'Nested objects/arrays are serialized as JSON strings into a single cell. To fully flatten, simplify the JSON structure beforehand.',
          },
          {
            question: 'How are special characters (commas, quotes) in CSV handled?',
            answer: 'Values containing commas, quotes, or line breaks are automatically wrapped in double quotes, and internal quotes are escaped with double quotes ("").',
          },
          {
            question: 'How are types determined when converting CSV to JSON?',
            answer: 'true/false become booleans, numeric values become Numbers. Everything else remains as strings.',
          },
        ]}
      />
    </div>
  );
}

export function JsonCsvConverterEn() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'json-to-csv' | 'csv-to-json'>('json-to-csv');
  const [error, setError] = useState('');

  const jsonToCsv = (jsonStr: string): string => {
    const data = JSON.parse(jsonStr);
    const array = Array.isArray(data) ? data : [data];

    if (array.length === 0) return '';

    const keys = new Set<string>();
    array.forEach((obj) => {
      if (typeof obj === 'object' && obj !== null) {
        Object.keys(obj).forEach((key) => keys.add(key));
      }
    });

    const headers = Array.from(keys);
    const csvRows = [headers.join(',')];

    array.forEach((obj) => {
      const values = headers.map((header) => {
        const val = obj[header];
        if (val === null || val === undefined) return '';
        if (typeof val === 'string') {
          if (val.includes(',') || val.includes('"') || val.includes('\n')) {
            return `"${val.replace(/"/g, '""')}"`;
          }
          return val;
        }
        return JSON.stringify(val);
      });
      csvRows.push(values.join(','));
    });

    return csvRows.join('\n');
  };

  const csvToJson = (csvStr: string): string => {
    const lines = csvStr.trim().split('\n');
    if (lines.length < 2) throw new Error('CSV requires at least a header and one data row.');

    const parseCSVLine = (line: string): string[] => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (inQuotes) {
          if (char === '"') {
            if (line[i + 1] === '"') {
              current += '"';
              i++;
            } else {
              inQuotes = false;
            }
          } else {
            current += char;
          }
        } else {
          if (char === '"') {
            inQuotes = true;
          } else if (char === ',') {
            result.push(current);
            current = '';
          } else {
            current += char;
          }
        }
      }
      result.push(current);
      return result;
    };

    const headers = parseCSVLine(lines[0]);
    const result = lines.slice(1).map((line) => {
      const values = parseCSVLine(line);
      const obj: Record<string, string | number | boolean> = {};
      headers.forEach((header, idx) => {
        const val = values[idx] || '';
        if (val === 'true') obj[header] = true;
        else if (val === 'false') obj[header] = false;
        else if (!isNaN(Number(val)) && val !== '') obj[header] = Number(val);
        else obj[header] = val;
      });
      return obj;
    });

    return JSON.stringify(result, null, 2);
  };

  const handleConvert = () => {
    setError('');
    try {
      if (mode === 'json-to-csv') {
        setOutput(jsonToCsv(input));
      } else {
        setOutput(csvToJson(input));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred during conversion.');
      setOutput('');
    }
  };

  const handleSwap = () => {
    setMode(mode === 'json-to-csv' ? 'csv-to-json' : 'json-to-csv');
    setInput(output);
    setOutput('');
    setError('');
  };

  const handleSample = () => {
    setError('');
    setOutput('');
    if (mode === 'json-to-csv') {
      const sample = [
        { id: 1, name: 'John Doe', age: 30, city: 'New York', active: true },
        { id: 2, name: 'Jane Smith', age: 25, city: 'Los Angeles', active: false },
        { id: 3, name: 'Bob Lee', age: 28, city: 'Austin, TX', active: true },
        { id: 4, name: 'Alice Kim', age: 35, city: 'Seattle', active: true },
      ];
      setInput(JSON.stringify(sample, null, 2));
    } else {
      const sample = `id,name,age,city,active
1,John Doe,30,New York,true
2,Jane Smith,25,Los Angeles,false
3,Bob Lee,28,"Austin, TX",true
4,Alice Kim,35,Seattle,true`;
      setInput(sample);
    }
  };

  return (
    <div className="space-y-2">
      {/* Mode selection and buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={mode === 'json-to-csv' ? 'primary' : 'secondary'}
          onClick={() => setMode('json-to-csv')}
        >
          JSON → CSV
        </Button>
        <Button
          variant={mode === 'csv-to-json' ? 'primary' : 'secondary'}
          onClick={() => setMode('csv-to-json')}
        >
          CSV → JSON
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
        leftLabel={mode === 'json-to-csv' ? 'JSON' : 'CSV'}
        rightLabel={mode === 'json-to-csv' ? 'CSV' : 'JSON'}
        leftHeader={
          <Button variant="secondary" size="sm" onClick={handleSample}>
            Sample Data
          </Button>
        }
        rightHeader={output ? <CopyButton text={output} /> : undefined}
        left={
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === 'json-to-csv'
                ? '[{"name": "John Doe", "age": 30}, {"name": "Jane Smith", "age": 25}]'
                : 'name,age\nJohn Doe,30\nJane Smith,25'
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

      <SeoContent />
    </div>
  );
}
