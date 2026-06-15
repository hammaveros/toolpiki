'use strict';
// 큐레이션 색상별 OG 스와치 PNG 생성 (무의존성: Node 내장 zlib).
// public/og/color/<slug>.png — 1200x630 솔리드 색. og:image + 본문 <img> 공용.
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public', 'og', 'color');
const COLORS_TS = path.join(ROOT, 'src', 'data', 'colors.ts');

const W = 1200;
const H = 630;

// ── CRC32 ───────────────────────────────────────────────
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const body = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

function solidPng(r, g, b) {
  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(W, 0);
  ihdr.writeUInt32BE(H, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type: truecolor RGB
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  // raw scanlines: each row = filter byte(0) + W*3 RGB
  const rowLen = 1 + W * 3;
  const raw = Buffer.alloc(rowLen * H);
  for (let y = 0; y < H; y++) {
    const off = y * rowLen;
    raw[off] = 0; // filter: none
    for (let x = 0; x < W; x++) {
      const p = off + 1 + x * 3;
      raw[p] = r;
      raw[p + 1] = g;
      raw[p + 2] = b;
    }
  }
  const idat = zlib.deflateSync(raw, { level: 9 });

  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ── colors.ts 에서 slug+hex 추출 ─────────────────────────
function readColors() {
  const s = fs.readFileSync(COLORS_TS, 'utf8');
  const re = /slug:\s*'([^']+)',\s*hex:\s*'#([0-9A-Fa-f]{6})'/g;
  const out = [];
  let m;
  while ((m = re.exec(s))) out.push({ slug: m[1], hex: m[2] });
  return out;
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const colors = readColors();
  if (!colors.length) {
    console.error('[error] colors.ts 에서 색을 못 읽었습니다.');
    process.exit(1);
  }
  for (const { slug, hex } of colors) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    fs.writeFileSync(path.join(OUT_DIR, `${slug}.png`), solidPng(r, g, b));
  }
  console.log(`[ok] ${colors.length}개 OG 스와치 생성 → public/og/color/`);
}

main();
