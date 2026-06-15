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
  INVALID_HEX: '16진수가 아닌 문자가 포함되어 있습니다.',
  ODD_HEX: '16진수 길이가 홀수입니다. (바이트는 2자리씩 짝을 이뤄야 합니다)',
  INVALID_BASE64: '올바른 Base64 문자열이 아닙니다.',
  TRUNCATED_VARINT: 'varint가 중간에 끊겼습니다.',
  VARINT_TOO_LONG: 'varint가 너무 깁니다. (손상된 데이터일 수 있습니다)',
  INVALID_FIELD_NUMBER: '필드 번호 0은 허용되지 않습니다.',
  UNSUPPORTED_WIRE_TYPE: '지원하지 않는 wire type 입니다. (그룹 타입 3/4는 deprecated)',
  TRUNCATED_64BIT: '64비트 값을 읽다가 데이터가 끊겼습니다.',
  TRUNCATED_32BIT: '32비트 값을 읽다가 데이터가 끊겼습니다.',
  TRUNCATED_LENGTH_DELIMITED: 'length-delimited 값의 길이가 실제 데이터보다 깁니다.',
};

function rawErrorText(e: unknown): string {
  const code = e instanceof Error ? e.message : '';
  return RAW_ERROR_MESSAGES[code] || '파싱에 실패했습니다. 올바른 Protobuf 바이너리인지 확인하세요.';
}

const FORMAT_OPTIONS = [
  { value: 'auto', label: '자동 감지' },
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
              <span className="text-xs text-gray-500 dark:text-gray-400">↳ 중첩 메시지 (추정)</span>
              <RawFieldList nodes={node.children} depth={depth + 1} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function ProtobufDecoder() {
  const [mode, setMode] = useState<'raw' | 'schema'>('raw');

  // --- Raw 디코드 ---
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

  // --- 스키마 기반 ---
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
      if (types.length === 0) return { root: null, types: [], error: '.proto 안에서 message 정의를 찾지 못했습니다.' };
      return { root, types, error: '' };
    } catch (e) {
      return { root: null, types: [], error: e instanceof Error ? e.message : '.proto 파싱에 실패했습니다.' };
    }
  }, [protoText]);

  // 타입 목록이 바뀌면 선택값 보정
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
      const msg = e instanceof Error ? e.message : '변환에 실패했습니다.';
      return { output: '', error: RAW_ERROR_MESSAGES[msg] || msg };
    }
  }, [protoParse.root, selectedType, direction, jsonInput, binInput, binFormat, encodeFormat]);

  const typeOptions = protoParse.types.map((t) => ({ value: t, label: t }));

  return (
    <div className="space-y-4">
      {/* 모드 탭 */}
      <div className="flex gap-2">
        <Button variant={mode === 'raw' ? 'primary' : 'secondary'} onClick={() => setMode('raw')}>
          Raw 디코드
        </Button>
        <Button variant={mode === 'schema' ? 'primary' : 'secondary'} onClick={() => setMode('schema')}>
          스키마(.proto) 기반
        </Button>
      </div>

      {mode === 'raw' ? (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            .proto 없이 Protobuf 바이너리(hex/base64)를 붙여 넣으면 <strong>필드 번호 · wire type · 값</strong>을 추론해서 보여 줍니다.
            필드 이름은 스키마가 없으면 복원할 수 없습니다.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-end">
            <Textarea
              label="Protobuf 바이너리"
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              placeholder="0a05416c696365107b... 또는 Base64"
              rows={4}
              className="font-mono text-sm"
            />
            <div className="w-full sm:w-40">
              <Select
                label="입력 형식"
                options={FORMAT_OPTIONS}
                value={rawFormat}
                onChange={(e) => setRawFormat(e.target.value as ByteFormat)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={() => setRawInput(SAMPLE_RAW)}>
              예시 입력
            </Button>
            {rawInput && (
              <Button variant="ghost" size="sm" onClick={() => setRawInput('')}>
                지우기
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
                  필드 {rawResult.nodes.length}개
                </h3>
              </div>
              <RawFieldList nodes={rawResult.nodes} />
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <Textarea
            label=".proto 스키마"
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
              예시 입력
            </Button>
          </div>

          {protoParse.types.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Select
                  label="메시지 타입"
                  options={typeOptions}
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                />
                <Select
                  label="변환 방향"
                  options={[
                    { value: 'decode', label: '디코드 (바이너리 → JSON)' },
                    { value: 'encode', label: '인코드 (JSON → 바이너리)' },
                  ]}
                  value={direction}
                  onChange={(e) => setDirection(e.target.value as 'decode' | 'encode')}
                />
              </div>

              {direction === 'encode' ? (
                <>
                  <Textarea
                    label="JSON 입력"
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    placeholder={SAMPLE_JSON}
                    rows={6}
                    className="font-mono text-sm"
                  />
                  <div className="w-full sm:w-48">
                    <Select
                      label="출력 형식"
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
                    label="Protobuf 바이너리"
                    value={binInput}
                    onChange={(e) => setBinInput(e.target.value)}
                    placeholder="0a05416c696365107b... 또는 Base64"
                    rows={4}
                    className="font-mono text-sm"
                  />
                  <div className="w-full sm:w-40">
                    <Select
                      label="입력 형식"
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
                      결과 {direction === 'encode' ? `(${encodeFormat === 'hex' ? 'Hex' : 'Base64'})` : '(JSON)'}
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
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Wire Type 종류</h3>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <li><span className="font-mono text-purple-500">0 varint</span> — int32/64, uint, bool, enum, sint(zigzag)</li>
          <li><span className="font-mono text-purple-500">1 64-bit</span> — fixed64, sfixed64, double</li>
          <li><span className="font-mono text-purple-500">2 length-delimited</span> — string, bytes, 중첩 메시지, packed</li>
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
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">📦 Protobuf 디코더/인코더란?</h2>
        <p className="text-sm leading-relaxed">
          <strong className="text-gray-900 dark:text-white">Protocol Buffers(프로토콜 버퍼, protobuf)는 구글이 만든 언어 중립 바이너리 직렬화 포맷으로, gRPC가 메시지를 주고받을 때 쓰는 바로 그 인코딩 방식입니다.</strong>{' '}
          JSON처럼 사람이 읽는 텍스트가 아니라 <strong>필드 번호 + wire type + 값</strong>으로 촘촘하게 압축된 바이트열이라, 같은 데이터라도 훨씬 작고 빠릅니다.
          이 도구는 두 가지 모드를 제공합니다. <strong>Raw 디코드</strong>는 <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">.proto</code> 정의가 없어도
          hex/Base64 바이너리를 붙여 넣으면 wire format을 해석해 필드 구조를 추론해 줍니다(<code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">protoc --decode_raw</code> 와 비슷).
          <strong>스키마 기반</strong>은 <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">.proto</code> 를 붙여 넣고 메시지 타입을 고르면 JSON ↔ 바이너리를 양방향으로 변환합니다.
          모든 처리는 브라우저 안에서만 일어나며 입력 데이터가 외부로 전송되지 않습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">🧩 두 모드, 언제 뭘 쓰나</h2>
        <ul className="text-sm space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
          <li><strong className="text-gray-900 dark:text-white">Raw 디코드</strong> — gRPC 트래픽 캡처, 로그, 어디선가 긁은 바이너리를 스키마 없이 빠르게 들여다볼 때. 필드 번호와 타입은 보이지만 <strong>필드 이름은 복원되지 않습니다.</strong> 같은 길이 데이터가 문자열인지 중첩 메시지인지 애매하면 두 해석을 모두 보여 줍니다.</li>
          <li><strong className="text-gray-900 dark:text-white">스키마 기반</strong> — <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">.proto</code> 가 있을 때. 필드 이름까지 정확히 디코딩되고, 반대로 JSON을 넣어 실제 전송될 바이너리를 만들어 API를 테스트할 수 있습니다.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">⚠️ 알아두면 좋은 점</h2>
        <ul className="text-sm space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
          <li><strong className="text-gray-900 dark:text-white">암호화가 아닙니다.</strong> Base64처럼 인코딩일 뿐이라, 바이너리만 있으면 구조가 그대로 드러납니다. 민감 정보는 별도 암호화가 필요합니다.</li>
          <li><strong className="text-gray-900 dark:text-white">proto2/proto3 차이</strong> — 기본값 처리, optional 표현이 다릅니다. 이 도구는 protobufjs 기반으로 두 문법을 모두 파싱합니다.</li>
          <li><strong className="text-gray-900 dark:text-white">64비트 정수</strong> — JavaScript 정밀도 한계 때문에 int64/uint64 는 문자열로 출력됩니다.</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          { question: 'Protobuf도 인코딩 도구가 될 수 있나요?', answer: '네. Protocol Buffers는 데이터를 바이너리로 직렬화(인코딩)하는 포맷이라, JSON을 바이너리로 인코딩하거나 바이너리를 다시 사람이 읽는 형태로 디코딩하는 도구로 동작합니다. gRPC가 내부적으로 쓰는 인코딩이 바로 이것입니다.' },
          { question: '.proto 파일 없이 디코딩할 수 있나요?', answer: 'Raw 디코드 모드를 쓰면 스키마 없이도 필드 번호, wire type, 값을 추론할 수 있습니다. 다만 바이너리에는 필드 이름이 들어있지 않으므로 이름은 복원되지 않고, 정확한 타입 해석은 .proto가 있어야 가능합니다.' },
          { question: 'gRPC 요청 바이너리를 그대로 넣어도 되나요?', answer: 'gRPC는 메시지 앞에 5바이트 길이 프리픽스(compression flag 1바이트 + length 4바이트)를 붙입니다. 순수 메시지 바이트만 떼어 넣어야 정확히 파싱됩니다. 프리픽스가 붙은 채로는 첫 필드가 깨져 보일 수 있습니다.' },
          { question: '입력한 데이터가 서버로 전송되나요?', answer: '아니요. 파싱과 변환 모두 브라우저 안에서만 수행되며 .proto나 바이너리 데이터가 외부 서버로 전송되지 않습니다.' },
        ]}
      />
    </div>
  );
}
