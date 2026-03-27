'use client';

import { useState, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';

interface DataField {
  key: string;
  type: FieldType;
  enabled: boolean;
}

type FieldType = 'name' | 'email' | 'phone' | 'address' | 'company' | 'job' | 'date' | 'number' | 'uuid' | 'lorem';

const fieldTypes: { type: FieldType; label: string }[] = [
  { type: 'name', label: 'Name' },
  { type: 'email', label: 'Email' },
  { type: 'phone', label: 'Phone' },
  { type: 'address', label: 'Address' },
  { type: 'company', label: 'Company' },
  { type: 'job', label: 'Job' },
  { type: 'date', label: 'Date' },
  { type: 'number', label: 'Number' },
  { type: 'uuid', label: 'UUID' },
  { type: 'lorem', label: 'Lorem' },
];

const firstNames = ['James', 'Emma', 'Michael', 'Sophia', 'William', 'Olivia', 'John', 'Ava', 'David', 'Isabella'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Martinez', 'Wilson'];
const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'];
const companies = ['Acme Corp', 'Tech Solutions', 'Global Inc', 'Digital Labs', 'Cloud Systems', 'Data Works', 'Code Factory', 'Web Masters', 'App Dynamics', 'Cyber Tech'];
const jobs = ['Developer', 'Designer', 'Marketing Manager', 'Product Manager', 'Engineer', 'Sales Representative', 'Accountant', 'Lawyer', 'Doctor', 'Teacher'];
const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'Austin'];
const streets = ['Main St', 'Oak Ave', 'Maple Dr', 'Cedar Ln', 'Pine Rd', 'Elm St', 'Park Ave', 'Lake Dr', 'Hill Rd', 'River Ln'];
const loremWords = ['Lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor'];

function generateValue(type: FieldType): string {
  switch (type) {
    case 'name': {
      const first = firstNames[Math.floor(Math.random() * firstNames.length)];
      const last = lastNames[Math.floor(Math.random() * lastNames.length)];
      return `${first} ${last}`;
    }
    case 'email': {
      const first = firstNames[Math.floor(Math.random() * firstNames.length)].toLowerCase();
      const last = lastNames[Math.floor(Math.random() * lastNames.length)].toLowerCase();
      const domain = domains[Math.floor(Math.random() * domains.length)];
      return `${first}.${last}${Math.floor(Math.random() * 100)}@${domain}`;
    }
    case 'phone':
      return `+1-${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
    case 'address': {
      const num = Math.floor(Math.random() * 9999) + 1;
      const street = streets[Math.floor(Math.random() * streets.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];
      return `${num} ${street}, ${city}`;
    }
    case 'company':
      return companies[Math.floor(Math.random() * companies.length)];
    case 'job':
      return jobs[Math.floor(Math.random() * jobs.length)];
    case 'date': {
      const year = 1980 + Math.floor(Math.random() * 44);
      const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
      const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    case 'number':
      return String(Math.floor(Math.random() * 10000));
    case 'uuid':
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    case 'lorem': {
      const words = Array.from({ length: 8 + Math.floor(Math.random() * 12) }, () =>
        loremWords[Math.floor(Math.random() * loremWords.length)]
      );
      return words.join(' ') + '.';
    }
    default:
      return '';
  }
}

export function FakeDataGeneratorEn() {
  const [fields, setFields] = useState<DataField[]>([
    { key: 'name', type: 'name', enabled: true },
    { key: 'email', type: 'email', enabled: true },
    { key: 'phone', type: 'phone', enabled: true },
    { key: 'address', type: 'address', enabled: false },
    { key: 'company', type: 'company', enabled: false },
  ]);
  const [count, setCount] = useState(5);
  const [format, setFormat] = useState<'json' | 'csv'>('json');
  const [data, setData] = useState<Record<string, string>[]>([]);

  const generate = useCallback(() => {
    const enabledFields = fields.filter(f => f.enabled);
    const result: Record<string, string>[] = [];

    for (let i = 0; i < count; i++) {
      const row: Record<string, string> = {};
      for (const field of enabledFields) {
        row[field.key] = generateValue(field.type);
      }
      result.push(row);
    }

    setData(result);
  }, [fields, count]);

  const toggleField = (key: string) => {
    setFields(prev => prev.map(f => f.key === key ? { ...f, enabled: !f.enabled } : f));
  };

  const addField = (type: FieldType) => {
    const existing = fields.filter(f => f.type === type).length;
    const key = existing > 0 ? `${type}${existing + 1}` : type;
    setFields(prev => [...prev, { key, type, enabled: true }]);
  };

  const removeField = (key: string) => {
    setFields(prev => prev.filter(f => f.key !== key));
  };

  const output = format === 'json'
    ? JSON.stringify(data, null, 2)
    : data.length > 0
      ? [Object.keys(data[0]).join(','), ...data.map(row => Object.values(row).join(','))].join('\n')
      : '';

  const downloadData = () => {
    const blob = new Blob([output], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fake-data.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Field Selection */}
      <Card variant="bordered" className="p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Data Fields</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {fields.map(field => (
            <div
              key={field.key}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer transition-colors ${
                field.enabled
                  ? 'bg-blue-100 border-blue-300 dark:bg-blue-900/30 dark:border-blue-700'
                  : 'bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
              }`}
              onClick={() => toggleField(field.key)}
            >
              <span className="text-sm">{fieldTypes.find(f => f.type === field.type)?.label} ({field.key})</span>
              <button
                onClick={(e) => { e.stopPropagation(); removeField(field.key); }}
                className="text-gray-400 hover:text-red-500"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">Add field:</span>
          {fieldTypes.map(ft => (
            <Button
              key={ft.type}
              variant="secondary"
              size="sm"
              onClick={() => addField(ft.type)}
            >
              + {ft.label}
            </Button>
          ))}
        </div>
      </Card>

      {/* Settings */}
      <Card variant="bordered" className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Count</label>
            <input
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) => setCount(Math.min(100, Math.max(1, Number(e.target.value))))}
              className="w-24 px-3 py-2 text-sm border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as 'json' | 'csv')}
              className="px-3 py-2 text-sm border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            >
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
            </select>
          </div>
          <div className="flex-1" />
          <Button variant="primary" onClick={generate}>
            Generate
          </Button>
        </div>
      </Card>

      {/* Result */}
      {data.length > 0 && (
        <Card variant="bordered" className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Result ({data.length} items)
            </h3>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={downloadData}>
                Download
              </Button>
              <CopyButton text={output} />
            </div>
          </div>
          <pre className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-mono overflow-x-auto max-h-96">
            {output}
          </pre>
        </Card>
      )}

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🎲 What is Fake Data Generator?
        </h2>
        <p className="text-sm leading-relaxed">
          Fake Data Generator creates realistic dummy data for development and testing purposes.
          Combine various fields like name, email, phone, address, company, job, date, number, UUID, and lorem text.
          Export to JSON or CSV format, generating up to 100 records at once.
          Safely build development and testing environments without using real personal information.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 Supported Field Types
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Field</th>
                <th className="text-left py-2 px-2">Format</th>
                <th className="text-left py-2 px-2">Use Case</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Name</td><td>First + Last name</td><td>User lists</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Email</td><td>random@domain</td><td>Sign-up testing</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Phone</td><td>+1-XXX-XXX-XXXX</td><td>Contact database</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Address</td><td>Street, City</td><td>Shipping tests</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">UUID</td><td>v4 UUID</td><td>Unique identifiers</td></tr>
              <tr><td className="py-2 px-2 font-medium">Lorem</td><td>Random sentences</td><td>Content placeholders</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Usage Tips
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>API testing</strong>: Generate bulk user data for performance tests</li>
          <li><strong>UI development</strong>: Test layouts with varying name/address lengths</li>
          <li><strong>Demo environments</strong>: Prepare sample data for client presentations</li>
          <li><strong>Database seeding</strong>: Initialize development environments with seed data</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Is the generated data real personal information?',
            answer: 'No. All data is randomly generated fake data. Email domains and phone formats may look realistic, but they have no connection to real people or companies.',
          },
          {
            question: 'Should I choose JSON or CSV format?',
            answer: 'JSON is better for API development and programming, while CSV is ideal for Excel or database imports. Both formats are widely supported across most environments.',
          },
          {
            question: 'Can I add multiple fields of the same type?',
            answer: 'Yes, you can add multiple fields of the same type. For example, adding two email fields creates email and email2 keys, each with different generated values.',
          },
        ]}
      />
    </div>
  );
}
