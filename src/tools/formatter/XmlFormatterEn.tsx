'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { Input } from '@/components/ui/Input';
import { TwoColumnLayout } from '@/components/ui/TwoColumnLayout';
import { FaqSection } from '@/components/ui/FaqItem';

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📄 What is XML Formatter?
        </h2>
        <p className="text-sm leading-relaxed">
          XML (eXtensible Markup Language) is a markup language for structuring, storing, and transmitting data.
          XML Formatter indents compressed XML according to hierarchy for readability, or removes whitespace to reduce file size.
          It is used for API response analysis, config file editing (pom.xml, web.xml), SOAP message debugging,
          and RSS/Atom feed verification across various development workflows.
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
              Visualize hierarchy with 1-8 space indentation
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">Minify</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Remove whitespace and line breaks to minimize size
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">Validation</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Auto-check if XML is well-formed
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">Copy Function</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Copy result to clipboard instantly
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 XML vs JSON Comparison
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Aspect</th>
                <th className="text-left py-2 px-2">XML</th>
                <th className="text-left py-2 px-2">JSON</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2">Readability</td><td>Clear with tags</td><td>Concise</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2">Size</td><td>Larger</td><td>Smaller</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2">Attributes</td><td>Supported</td><td>Not supported</td></tr>
              <tr><td className="py-2 px-2">Comments</td><td>Supported</td><td>Not supported</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'What is the difference between well-formed and valid XML?',
            answer: 'Well-formed XML follows syntax rules (matching tags, case sensitivity, etc.). Valid XML conforms to a DTD or XSD schema. This tool checks well-formedness.',
          },
          {
            question: 'Is the XML declaration (<?xml ...?>) required?',
            answer: 'Not required but recommended. Without it, UTF-8 encoding is assumed. Other encodings must be declared explicitly.',
          },
          {
            question: 'When should I use CDATA sections?',
            answer: 'Use <![CDATA[ ... ]]> when including HTML or special characters (<, >, &) as text without escaping them.',
          },
        ]}
      />
    </div>
  );
}

export function XmlFormatterEn() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indentSize, setIndentSize] = useState(2);
  const [error, setError] = useState('');

  const formatXml = (xml: string, indent: number): string => {
    const PADDING = ' '.repeat(indent);
    let formatted = '';
    let pad = 0;

    const nodes = xml
      .replace(/>\s*</g, '><')
      .replace(/</g, '~<')
      .replace(/>/g, '>~')
      .split('~')
      .filter((n) => n.trim());

    nodes.forEach((node) => {
      if (node.match(/^<\?/)) {
        formatted += node + '\n';
      } else if (node.match(/^<\//)) {
        pad--;
        formatted += PADDING.repeat(pad) + node + '\n';
      } else if (node.match(/\/>$/)) {
        formatted += PADDING.repeat(pad) + node + '\n';
      } else if (node.match(/^</)) {
        formatted += PADDING.repeat(pad) + node + '\n';
        pad++;
      } else {
        formatted += PADDING.repeat(pad) + node + '\n';
      }
    });

    return formatted.trim();
  };

  const minifyXml = (xml: string): string => {
    return xml
      .replace(/>\s+</g, '><')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const handleFormat = () => {
    setError('');
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(input, 'application/xml');
      const parseError = doc.querySelector('parsererror');
      if (parseError) {
        throw new Error('Invalid XML.');
      }
      setOutput(formatXml(input, indentSize));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred during formatting.');
    }
  };

  const handleMinify = () => {
    setError('');
    try {
      setOutput(minifyXml(input));
    } catch {
      setError('An error occurred during minification.');
    }
  };

  return (
    <div className="space-y-2">
      {/* Options and buttons */}
      <div className="flex gap-4 items-center flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">Indent:</label>
          <Input
            type="number"
            min={1}
            max={8}
            value={indentSize}
            onChange={(e) => setIndentSize(Number(e.target.value))}
            className="w-16"
          />
          <span className="text-sm text-gray-500">spaces</span>
        </div>
        <Button onClick={handleFormat}>Format</Button>
        <Button variant="secondary" onClick={handleMinify}>
          Minify
        </Button>
        <Button variant="secondary" onClick={() => { setInput(''); setOutput(''); setError(''); }}>
          Clear
        </Button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Two column layout */}
      <TwoColumnLayout
        leftLabel="XML Input"
        rightLabel="Result"
        rightHeader={output ? <CopyButton text={output} /> : undefined}
        left={
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='<root><item id="1"><name>Test</name></item></root>'
            rows={16}
            className="font-mono text-sm h-[400px]"
          />
        }
        right={
          <Textarea
            value={output}
            readOnly
            placeholder="Formatted XML will appear here."
            rows={16}
            className="font-mono text-sm h-[400px] bg-gray-50 dark:bg-gray-800/50"
          />
        }
      />

      <SeoContent />
    </div>
  );
}
