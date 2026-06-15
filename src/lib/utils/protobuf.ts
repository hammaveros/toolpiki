// Protocol Buffers 디코딩/인코딩 공통 로직 (언어 중립)
// - Raw 디코드: .proto 스키마 없이 wire format 만으로 필드 구조 추론
// - 스키마 기반: protobufjs로 .proto 파싱 후 JSON <-> 바이너리 변환
//
// 여기 담긴 라벨(uint, string, double 등)은 모두 기술 용어라 KR/EN 공통으로 사용한다.

import * as protobuf from 'protobufjs';

// ---------------------------------------------------------------------------
// 바이트 입력 파싱 (hex / base64 / 자동 감지)
// ---------------------------------------------------------------------------

export type ByteFormat = 'auto' | 'hex' | 'base64';

const HEX_RE = /^[0-9a-fA-F\s:,]+$/;

export function detectFormat(raw: string): 'hex' | 'base64' {
  const trimmed = raw.trim();
  const compact = trimmed.replace(/[\s:,]/g, '');
  // 16진수 문자만 있고 길이가 짝수면 hex 로 본다
  if (HEX_RE.test(trimmed) && compact.length % 2 === 0 && compact.length > 0) {
    return 'hex';
  }
  return 'base64';
}

export function bytesFromInput(raw: string, format: ByteFormat): Uint8Array {
  const trimmed = raw.trim();
  if (!trimmed) return new Uint8Array(0);

  const fmt = format === 'auto' ? detectFormat(trimmed) : format;

  if (fmt === 'hex') {
    const compact = trimmed.replace(/[\s:,]/g, '');
    if (!/^[0-9a-fA-F]*$/.test(compact)) {
      throw new Error('INVALID_HEX');
    }
    if (compact.length % 2 !== 0) {
      throw new Error('ODD_HEX');
    }
    const out = new Uint8Array(compact.length / 2);
    for (let i = 0; i < out.length; i++) {
      out[i] = parseInt(compact.slice(i * 2, i * 2 + 2), 16);
    }
    return out;
  }

  // base64 (url-safe 도 허용)
  const normalized = trimmed.replace(/\s/g, '').replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  let binary: string;
  try {
    binary = atob(padded);
  } catch {
    throw new Error('INVALID_BASE64');
  }
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}

export function bytesToHex(bytes: Uint8Array): string {
  let s = '';
  for (let i = 0; i < bytes.length; i++) {
    s += bytes[i].toString(16).padStart(2, '0');
  }
  return s;
}

export function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

// ---------------------------------------------------------------------------
// Raw 디코드 (스키마 없이 wire format 파싱)
// ---------------------------------------------------------------------------

export interface RawInterpretation {
  label: string;
  value: string;
}

export interface RawNode {
  fieldNumber: number;
  wireType: number;
  wireTypeName: string;
  interpretations: RawInterpretation[];
  children?: RawNode[];
  rawHex: string;
}

const WIRE_TYPE_NAMES: Record<number, string> = {
  0: 'varint (0)',
  1: '64-bit (1)',
  2: 'length-delimited (2)',
  5: '32-bit (5)',
};

const B0 = BigInt(0);
const B1 = BigInt(1);
const B3 = BigInt(3);
const B7 = BigInt(7);

function readVarint(bytes: Uint8Array, pos: number): [bigint, number] {
  let result = B0;
  let shift = B0;
  let p = pos;
  while (true) {
    if (p >= bytes.length) throw new Error('TRUNCATED_VARINT');
    const b = bytes[p++];
    result |= BigInt(b & 0x7f) << shift;
    if ((b & 0x80) === 0) break;
    shift += B7;
    if (shift > BigInt(70)) throw new Error('VARINT_TOO_LONG');
  }
  return [result, p];
}

// zigzag 디코딩 (sint32/sint64 표현)
function zigzag(n: bigint): bigint {
  return (n >> B1) ^ -(n & B1);
}

// 제어문자(탭 0x09, 개행 0x0a, 캐리지리턴 0x0d 제외)가 섞여 있으면 문자열로 보지 않는다
const CONTROL_CHAR_RE = new RegExp('[\\x00-\\x08\\x0b\\x0c\\x0e-\\x1f]');

function isPrintableUtf8(bytes: Uint8Array): string | null {
  if (bytes.length === 0) return null;
  try {
    const decoded = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    if (CONTROL_CHAR_RE.test(decoded)) return null;
    return decoded;
  } catch {
    return null;
  }
}

const MAX_DEPTH = 20;

export function parseRawMessage(bytes: Uint8Array, depth = 0): RawNode[] {
  const nodes: RawNode[] = [];
  let pos = 0;
  while (pos < bytes.length) {
    const fieldStart = pos;
    const [tag, afterTag] = readVarint(bytes, pos);
    pos = afterTag;
    const fieldNumber = Number(tag >> B3);
    const wireType = Number(tag & B7);
    if (fieldNumber === 0) throw new Error('INVALID_FIELD_NUMBER');

    const wireTypeName = WIRE_TYPE_NAMES[wireType];
    if (!wireTypeName) throw new Error('UNSUPPORTED_WIRE_TYPE');

    const interpretations: RawInterpretation[] = [];
    let children: RawNode[] | undefined;

    if (wireType === 0) {
      const [val, after] = readVarint(bytes, pos);
      pos = after;
      interpretations.push({ label: 'uint', value: val.toString() });
      const sint = zigzag(val);
      if (sint < B0) interpretations.push({ label: 'sint (zigzag)', value: sint.toString() });
      if (val === B0 || val === B1) {
        interpretations.push({ label: 'bool', value: val === B1 ? 'true' : 'false' });
      }
    } else if (wireType === 1) {
      if (pos + 8 > bytes.length) throw new Error('TRUNCATED_64BIT');
      const slice = bytes.slice(pos, pos + 8);
      pos += 8;
      const dv = new DataView(slice.buffer, slice.byteOffset, 8);
      interpretations.push({ label: 'uint64', value: dv.getBigUint64(0, true).toString() });
      interpretations.push({ label: 'int64', value: dv.getBigInt64(0, true).toString() });
      interpretations.push({ label: 'double', value: String(dv.getFloat64(0, true)) });
    } else if (wireType === 2) {
      const [len, afterLen] = readVarint(bytes, pos);
      pos = afterLen;
      const length = Number(len);
      if (pos + length > bytes.length) throw new Error('TRUNCATED_LENGTH_DELIMITED');
      const content = bytes.slice(pos, pos + length);
      pos += length;

      // 중첩 메시지로 파싱 시도
      if (length > 0 && depth < MAX_DEPTH) {
        try {
          const sub = parseRawMessage(content, depth + 1);
          if (sub.length > 0) children = sub;
        } catch {
          // 중첩 메시지가 아님
        }
      }
      const str = isPrintableUtf8(content);
      if (str !== null) interpretations.push({ label: 'string', value: str });
      interpretations.push({ label: 'bytes (hex)', value: bytesToHex(content) });
    } else if (wireType === 5) {
      if (pos + 4 > bytes.length) throw new Error('TRUNCATED_32BIT');
      const slice = bytes.slice(pos, pos + 4);
      pos += 4;
      const dv = new DataView(slice.buffer, slice.byteOffset, 4);
      interpretations.push({ label: 'uint32', value: dv.getUint32(0, true).toString() });
      interpretations.push({ label: 'int32', value: dv.getInt32(0, true).toString() });
      interpretations.push({ label: 'float', value: String(dv.getFloat32(0, true)) });
    }

    nodes.push({
      fieldNumber,
      wireType,
      wireTypeName,
      interpretations,
      children,
      rawHex: bytesToHex(bytes.slice(fieldStart, pos)),
    });
  }
  return nodes;
}

// ---------------------------------------------------------------------------
// 스키마 기반 (protobufjs)
// ---------------------------------------------------------------------------

export interface ParsedProto {
  root: protobuf.Root;
  types: string[];
}

export function parseProto(protoText: string): ParsedProto {
  const result = protobuf.parse(protoText, { keepCase: true });
  const root = result.root;
  const types: string[] = [];
  const walk = (ns: protobuf.ReflectionObject) => {
    if (ns instanceof protobuf.Type) {
      types.push(ns.fullName.replace(/^\./, ''));
    }
    if (ns instanceof protobuf.Namespace) {
      ns.nestedArray.forEach(walk);
    }
  };
  walk(root);
  return { root, types };
}

export function encodeMessage(root: protobuf.Root, typeName: string, json: string): Uint8Array {
  const Type = root.lookupType(typeName);
  const obj = JSON.parse(json);
  const verifyError = Type.verify(obj);
  if (verifyError) throw new Error(verifyError);
  const message = Type.fromObject(obj);
  return Type.encode(message).finish();
}

export function decodeMessage(root: protobuf.Root, typeName: string, bytes: Uint8Array): string {
  const Type = root.lookupType(typeName);
  const message = Type.decode(bytes);
  const obj = Type.toObject(message, {
    longs: String,
    enums: String,
    bytes: String,
    defaults: true,
    arrays: true,
    objects: true,
  });
  return JSON.stringify(obj, null, 2);
}
