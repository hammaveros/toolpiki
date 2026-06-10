'use client';

import { useState, useMemo, useEffect } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';
import {
  type ByteFormat,
  type RawNode,
  bytesFromInput,
  bytesToHex,
  bytesToBase64,
  parseRawMessage,
  parseProto,
  encodeMessage,
  decodeMessage,
} from '@/lib/utils/protobuf';

const SAMPLE_RAW = '0a05416c696365107b1a076140782e636f6d';
const SAMPLE_PROTO = `syntax = "proto3";

message Person {
  string name = 1;
  int32 id = 2;
  repeated string emails = 3;
}`;
const SAMPLE_JSON = `{
  "name": "Alice",
  "id": 123,
  "emails": ["a@x.com"]
}`;

const RAW_ERROR_MESSAGES: Record<string, string> = {
  INVALID_HEX: 'The input contains non-hexadecimal characters.',
  ODD_HEX: 'Hex length is odd. (Bytes must come in pairs of two digits.)',
  INVALID_BASE64: 'Not a valid Base64 string.',
  TRUNCATED_VARINT: 'A varint was truncated.',
  VARINT_TOO_LONG: 'A varint is too long. (The data may be corrupted.)',
  INVALID_FIELD_NUMBER: 'Field number 0 is not allowed.',
  UNSUPPORTED_WIRE_TYPE: 'Unsupported wire type. (Group types 3/4 are deprecated.)',
  TRUNCATED_64BIT: 'The data ended while reading a 64-bit value.',
  TRUNCATED_32BIT: 'The data ended while reading a 32-bit value.',
  TRUNCATED_LENGTH_DELIMITED: 'A length-delimited field claims more bytes than are available.',
};

function rawErrorText(e: unknown): string {
  const code = e instanceof Error ? e.message : '';
  return RAW_ERROR_MESSAGES[code] || 'Failed to parse. Make sure the input is valid Protobuf binary.';
}

const FORMAT_OPTIONS = [
  { value: 'auto', label: 'Auto detect' },
  { value: 'hex', label: 'Hex' },
  { value: 'base64', label: 'Base64' },
];

function RawFieldList({ nodes, depth = 0 }: { nodes: RawNode[]; depth?: number }) {
  return (
    <div className={depth > 0 ? 'mt-2 space-y-2 border-l-2 border-gray-200 dark:border-gray-700 pl-3' : 'space-y-2'}>
      {nodes.map((node, i) => (
        <div key={i} className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-3 text-sm">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">
              #{node.fieldNumber}
            </span>
            <span className="text-xs px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-mono">
              {node.wireTypeName}
            </span>
          </div>
          <div className="space-y-1">
            {node.interpretations.map((it, j) => (
              <div key={j} className="flex gap-2 font-mono text-xs">
                <span className="text-purple-600 dark:text-purple-400 shrink-0 w-28">{it.label}</span>
                <span className="text-gray-800 dark:text-gray-200 break-all">{it.value}</span>
              </div>
            ))}
          </div>
          {node.children && (
            <div className="mt-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">↳ nested message (inferred)</span>
              <RawFieldList nodes={node.children} depth={depth + 1} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function ProtobufDecoderEn() {
  const [mode, setMode] = useState<'raw' | 'schema'>('raw');

  // --- Raw decode ---
  const [rawInput, setRawInput] = useState('');
  const [rawFormat, setRawFormat] = useState<ByteFormat>('auto');

  const rawResult = useMemo<{ nodes: RawNode[] | null; error: string }>(() => {
    if (!rawInput.trim()) return { nodes: null, error: '' };
    try {
      const bytes = bytesFromInput(rawInput, rawFormat);
      if (bytes.length === 0) return { nodes: null, error: '' };
      return { nodes: parseRawMessage(bytes), error: '' };
    } catch (e) {
      return { nodes: null, error: rawErrorText(e) };
    }
  }, [rawInput, rawFormat]);

  // --- Schema based ---
  const [protoText, setProtoText] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [direction, setDirection] = useState<'decode' | 'encode'>('decode');
  const [jsonInput, setJsonInput] = useState('');
  const [binInput, setBinInput] = useState('');
  const [binFormat, setBinFormat] = useState<ByteFormat>('auto');
  const [encodeFormat, setEncodeFormat] = useState<'hex' | 'base64'>('hex');

  const protoParse = useMemo<{ root: ReturnType<typeof parseProto>['root'] | null; types: string[]; error: string }>(() => {
    if (!protoText.trim()) return { root: null, types: [], error: '' };
    try {
      const { root, types } = parseProto(protoText);
      if (types.length === 0) return { root: null, types: [], error: 'No message definitions found in the .proto.' };
      return { root, types, error: '' };
    } catch (e) {
      return { root: null, types: [], error: e instanceof Error ? e.message : 'Failed to parse the .proto.' };
    }
  }, [protoText]);

  useEffect(() => {
    if (protoParse.types.length === 0) {
      if (selectedType) setSelectedType('');
    } else if (!protoParse.types.includes(selectedType)) {
      setSelectedType(protoParse.types[0]);
    }
  }, [protoParse.types, selectedType]);

  const schemaResult = useMemo<{ output: string; error: string }>(() => {
    if (!protoParse.root || !selectedType) return { output: '', error: '' };
    try {
      if (direction === 'encode') {
        if (!jsonInput.trim()) return { output: '', error: '' };
        const bytes = encodeMessage(protoParse.root, selectedType, jsonInput);
        return { output: encodeFormat === 'hex' ? bytesToHex(bytes) : bytesToBase64(bytes), error: '' };
      } else {
        if (!binInput.trim()) return { output: '', error: '' };
        const bytes = bytesFromInput(binInput, binFormat);
        return { output: decodeMessage(protoParse.root, selectedType, bytes), error: '' };
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Conversion failed.';
      return { output: '', error: RAW_ERROR_MESSAGES[msg] || msg };
    }
  }, [protoParse.root, selectedType, direction, jsonInput, binInput, binFormat, encodeFormat]);

  const typeOptions = protoParse.types.map((t) => ({ value: t, label: t }));

  return (
    <div className="space-y-4">
      {/* Mode tabs */}
      <div className="flex gap-2">
        <Button variant={mode === 'raw' ? 'primary' : 'secondary'} onClick={() => setMode('raw')}>
          Raw decode
        </Button>
        <Button variant={mode === 'schema' ? 'primary' : 'secondary'} onClick={() => setMode('schema')}>
          Schema (.proto)
        </Button>
      </div>

      {mode === 'raw' ? (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Paste Protobuf binary (hex/base64) without a .proto and this infers the <strong>field number, wire type, and value</strong>.
            Field names cannot be recovered without a schema.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-end">
            <Textarea
              label="Protobuf binary"
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              placeholder="0a05416c696365107b... or Base64"
              rows={4}
              className="font-mono text-sm"
            />
            <div className="w-full sm:w-40">
              <Select
                label="Input format"
                options={FORMAT_OPTIONS}
                value={rawFormat}
                onChange={(e) => setRawFormat(e.target.value as ByteFormat)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={() => setRawInput(SAMPLE_RAW)}>
              Load example
            </Button>
            {rawInput && (
              <Button variant="ghost" size="sm" onClick={() => setRawInput('')}>
                Clear
              </Button>
            )}
          </div>

          {rawResult.error && (
            <Card variant="bordered" className="p-4 border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20">
              <p className="text-red-600 dark:text-red-400 text-sm">{rawResult.error}</p>
            </Card>
          )}

          {rawResult.nodes && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {rawResult.nodes.length} field(s)
                </h3>
              </div>
              <RawFieldList nodes={rawResult.nodes} />
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <Textarea
            label=".proto schema"
            value={protoText}
            onChange={(e) => setProtoText(e.target.value)}
            placeholder={SAMPLE_PROTO}
            rows={8}
            className="font-mono text-sm"
            error={protoParse.error || undefined}
          />

          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setProtoText(SAMPLE_PROTO);
                setDirection('encode');
                setJsonInput(SAMPLE_JSON);
              }}
            >
              Load example
            </Button>
          </div>

          {protoParse.types.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Select
                  label="Message type"
                  options={typeOptions}
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                />
                <Select
                  label="Direction"
                  options={[
                    { value: 'decode', label: 'Decode (binary → JSON)' },
                    { value: 'encode', label: 'Encode (JSON → binary)' },
                  ]}
                  value={direction}
                  onChange={(e) => setDirection(e.target.value as 'decode' | 'encode')}
                />
              </div>

              {direction === 'encode' ? (
                <>
                  <Textarea
                    label="JSON input"
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    placeholder={SAMPLE_JSON}
                    rows={6}
                    className="font-mono text-sm"
                  />
                  <div className="w-full sm:w-48">
                    <Select
                      label="Output format"
                      options={[
                        { value: 'hex', label: 'Hex' },
                        { value: 'base64', label: 'Base64' },
                      ]}
                      value={encodeFormat}
                      onChange={(e) => setEncodeFormat(e.target.value as 'hex' | 'base64')}
                    />
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-end">
                  <Textarea
                    label="Protobuf binary"
                    value={binInput}
                    onChange={(e) => setBinInput(e.target.value)}
                    placeholder="0a05416c696365107b... or Base64"
                    rows={4}
                    className="font-mono text-sm"
                  />
                  <div className="w-full sm:w-40">
                    <Select
                      label="Input format"
                      options={FORMAT_OPTIONS}
                      value={binFormat}
                      onChange={(e) => setBinFormat(e.target.value as ByteFormat)}
                    />
                  </div>
                </div>
              )}

              {schemaResult.error && (
                <Card variant="bordered" className="p-4 border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20">
                  <p className="text-red-600 dark:text-red-400 text-sm break-all">{schemaResult.error}</p>
                </Card>
              )}

              {schemaResult.output && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Result {direction === 'encode' ? `(${encodeFormat === 'hex' ? 'Hex' : 'Base64'})` : '(JSON)'}
                    </label>
                    <CopyButton text={schemaResult.output} size="sm" />
                  </div>
                  <Textarea
                    value={schemaResult.output}
                    readOnly
                    rows={direction === 'encode' ? 4 : 8}
                    className="bg-gray-50 dark:bg-gray-800/50 font-mono text-sm break-all"
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Wire types</h3>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <li><span className="font-mono text-purple-500">0 varint</span> — int32/64, uint, bool, enum, sint (zigzag)</li>
          <li><span className="font-mono text-purple-500">1 64-bit</span> — fixed64, sfixed64, double</li>
          <li><span className="font-mono text-purple-500">2 length-delimited</span> — string, bytes, nested message, packed</li>
          <li><span className="font-mono text-purple-500">5 32-bit</span> — fixed32, sfixed32, float</li>
        </ul>
      </div>

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">📦 What is the Protobuf Decoder / Encoder?</h2>
        <p className="text-sm leading-relaxed">
          <strong className="text-gray-900 dark:text-white">Protocol Buffers (protobuf) is Google&apos;s language-neutral binary serialization format — the exact encoding gRPC uses to send messages over the wire.</strong>{' '}
          Unlike human-readable JSON, a protobuf payload is a tightly packed byte stream of <strong>field number + wire type + value</strong>, so the same data is far smaller and faster.
          This tool offers two modes. <strong>Raw decode</strong> works without a <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">.proto</code>: paste hex/Base64 binary and it parses the wire format to infer the field structure (similar to <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">protoc --decode_raw</code>).
          <strong>Schema based</strong> lets you paste a <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">.proto</code>, pick a message type, and convert JSON ↔ binary in both directions.
          Everything runs entirely in your browser — no input data is ever sent to a server.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">🧩 Which mode to use</h2>
        <ul className="text-sm space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
          <li><strong className="text-gray-900 dark:text-white">Raw decode</strong> — for peeking at captured gRPC traffic, logs, or binary you found somewhere, with no schema. You see field numbers and types, but <strong>field names cannot be recovered.</strong> When a length-delimited value is ambiguous between a string and a nested message, both interpretations are shown.</li>
          <li><strong className="text-gray-900 dark:text-white">Schema based</strong> — when you have the <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">.proto</code>. Fields decode with their real names, and you can encode JSON into the exact bytes that would be sent to test an API.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">⚠️ Good to know</h2>
        <ul className="text-sm space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
          <li><strong className="text-gray-900 dark:text-white">It is not encryption.</strong> Like Base64, it is just an encoding — anyone with the bytes can read the structure. Sensitive data needs separate encryption.</li>
          <li><strong className="text-gray-900 dark:text-white">proto2 vs proto3</strong> differ in default handling and optional semantics. This tool parses both syntaxes via protobufjs.</li>
          <li><strong className="text-gray-900 dark:text-white">64-bit integers</strong> are emitted as strings to avoid JavaScript number precision loss for int64/uint64.</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          { question: 'Can Protobuf work as an encoding tool?', answer: 'Yes. Protocol Buffers is a format for serializing (encoding) data into binary, so it acts as a tool that encodes JSON into binary and decodes binary back into a human-readable form. This is exactly the encoding gRPC uses under the hood.' },
          { question: 'Can I decode without a .proto file?', answer: 'Use Raw decode mode to infer field numbers, wire types, and values without a schema. However, field names are not stored in the binary, so they cannot be recovered, and accurate type interpretation requires the .proto.' },
          { question: 'Can I paste a raw gRPC request body?', answer: 'gRPC prefixes each message with 5 bytes (a 1-byte compression flag plus a 4-byte length). Strip that prefix and paste only the message bytes for accurate parsing; with the prefix attached, the first field will look corrupted.' },
          { question: 'Is my data sent to a server?', answer: 'No. Parsing and conversion happen entirely in your browser. Your .proto and binary data never leave your device.' },
        ]}
      />
    </div>
  );
}
