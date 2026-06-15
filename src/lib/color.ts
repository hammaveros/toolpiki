// 색상 공유 유틸 — 파싱 / 변환(HEX·RGB·HSL·HSV·CMYK) / 대비(WCAG) / 배색 / 명도 스케일 / 근접 이름색
// color-converter(색상 종합 도구) 및 다른 색상 도구가 공통으로 사용.

export interface RGB {
  r: number;
  g: number;
  b: number;
}
export interface HSL {
  h: number;
  s: number;
  l: number;
}
export interface HSV {
  h: number;
  s: number;
  v: number;
}
export interface CMYK {
  c: number;
  m: number;
  y: number;
  k: number;
}

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const clamp255 = (n: number) => clamp(Math.round(n), 0, 255);

// ── HEX ↔ RGB ─────────────────────────────────────────────
export function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const h = clamp255(x).toString(16);
        return h.length === 1 ? '0' + h : h;
      })
      .join('')
      .toUpperCase()
  );
}

export function hexToRgb(hex: string): RGB | null {
  let h = hex.trim().replace(/^#/, '');
  // 3자리(#RGB) → 6자리로 확장
  if (/^[a-f\d]{3}$/i.test(h)) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  }
  // 8자리(#RRGGBBAA)는 알파 무시하고 RGB만
  if (/^[a-f\d]{8}$/i.test(h)) h = h.slice(0, 6);
  if (!/^[a-f\d]{6}$/i.test(h)) return null;
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

// ── RGB ↔ HSL ─────────────────────────────────────────────
export function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function hslToRgb(h: number, s: number, l: number): RGB {
  h = ((h % 360) + 360) % 360;
  s = clamp(s, 0, 100) / 100;
  l = clamp(l, 0, 100) / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let rp = 0;
  let gp = 0;
  let bp = 0;
  if (h < 60) [rp, gp, bp] = [c, x, 0];
  else if (h < 120) [rp, gp, bp] = [x, c, 0];
  else if (h < 180) [rp, gp, bp] = [0, c, x];
  else if (h < 240) [rp, gp, bp] = [0, x, c];
  else if (h < 300) [rp, gp, bp] = [x, 0, c];
  else [rp, gp, bp] = [c, 0, x];
  return { r: clamp255((rp + m) * 255), g: clamp255((gp + m) * 255), b: clamp255((bp + m) * 255) };
}

// ── RGB → HSV / CMYK ─────────────────────────────────────
export function rgbToHsv(r: number, g: number, b: number): HSV {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  const s = max === 0 ? 0 : d / max;
  return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(max * 100) };
}

export function rgbToCmyk(r: number, g: number, b: number): CMYK {
  const rp = r / 255;
  const gp = g / 255;
  const bp = b / 255;
  const k = 1 - Math.max(rp, gp, bp);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  return {
    c: Math.round(((1 - rp - k) / (1 - k)) * 100),
    m: Math.round(((1 - gp - k) / (1 - k)) * 100),
    y: Math.round(((1 - bp - k) / (1 - k)) * 100),
    k: Math.round(k * 100),
  };
}

// ── 통합 파서: HEX / rgb() / hsl() / 이름색 어떤 형식이든 RGB 로 ──
export function parseColor(input: string): RGB | null {
  const s = input.trim().toLowerCase();
  if (!s) return null;
  // hex
  if (s.startsWith('#') || /^[a-f\d]{3,8}$/i.test(s)) {
    const rgb = hexToRgb(s);
    if (rgb) return rgb;
  }
  // rgb()/rgba()
  const rgbM = s.match(/rgba?\(([^)]+)\)/);
  if (rgbM) {
    const parts = rgbM[1].split(/[,/\s]+/).filter(Boolean).map(Number);
    if (parts.length >= 3 && parts.slice(0, 3).every((n) => !Number.isNaN(n))) {
      return { r: clamp255(parts[0]), g: clamp255(parts[1]), b: clamp255(parts[2]) };
    }
  }
  // hsl()/hsla()
  const hslM = s.match(/hsla?\(([^)]+)\)/);
  if (hslM) {
    const parts = hslM[1].split(/[,/\s]+/).filter(Boolean).map((p) => parseFloat(p));
    if (parts.length >= 3 && parts.slice(0, 3).every((n) => !Number.isNaN(n))) {
      return hslToRgb(parts[0], parts[1], parts[2]);
    }
  }
  // 공백 없는 "59,130,246" 형태
  const bare = s.split(/[,\s]+/).filter(Boolean).map(Number);
  if (bare.length === 3 && bare.every((n) => !Number.isNaN(n) && n >= 0 && n <= 255)) {
    return { r: clamp255(bare[0]), g: clamp255(bare[1]), b: clamp255(bare[2]) };
  }
  // 이름색
  if (NAMED_COLORS[s]) return hexToRgb(NAMED_COLORS[s]);
  return null;
}

// ── 대비 / WCAG ──────────────────────────────────────────
function channelLum(c: number): number {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}
export function relativeLuminance({ r, g, b }: RGB): number {
  return 0.2126 * channelLum(r) + 0.7152 * channelLum(g) + 0.0722 * channelLum(b);
}
export function contrastRatio(a: RGB, b: RGB): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const light = Math.max(la, lb);
  const dark = Math.min(la, lb);
  return (light + 0.05) / (dark + 0.05);
}
// 배경색 위에 흰/검 중 더 잘 읽히는 글자색
export function bestTextColor(bg: RGB): '#FFFFFF' | '#000000' {
  const white = contrastRatio(bg, { r: 255, g: 255, b: 255 });
  const black = contrastRatio(bg, { r: 0, g: 0, b: 0 });
  return white >= black ? '#FFFFFF' : '#000000';
}
export interface WcagResult {
  ratio: number;
  aaNormal: boolean; // 4.5:1
  aaLarge: boolean; // 3:1
  aaaNormal: boolean; // 7:1
}
export function wcag(fg: RGB, bg: RGB): WcagResult {
  const ratio = contrastRatio(fg, bg);
  return {
    ratio: Math.round(ratio * 100) / 100,
    aaNormal: ratio >= 4.5,
    aaLarge: ratio >= 3,
    aaaNormal: ratio >= 7,
  };
}

// ── 배색(색상환 회전) ────────────────────────────────────
function rotate(hsl: HSL, deg: number): string {
  const rgb = hslToRgb(hsl.h + deg, hsl.s, hsl.l);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}
export interface Harmony {
  complementary: string;
  analogous: [string, string];
  triadic: [string, string];
}
export function harmony(rgb: RGB): Harmony {
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  return {
    complementary: rotate(hsl, 180),
    analogous: [rotate(hsl, -30), rotate(hsl, 30)],
    triadic: [rotate(hsl, 120), rotate(hsl, 240)],
  };
}

// ── 명도 스케일(shades/tints) ────────────────────────────
// L=5%~95% 까지 단계별 HEX. 입력색의 H/S 유지.
export function lightnessScale(rgb: RGB, steps = 10): { l: number; hex: string }[] {
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const out: { l: number; hex: string }[] = [];
  for (let i = 0; i < steps; i++) {
    const l = Math.round(95 - (90 / (steps - 1)) * i); // 95 → 5
    const c = hslToRgb(hsl.h, hsl.s, l);
    out.push({ l, hex: rgbToHex(c.r, c.g, c.b) });
  }
  return out;
}

// ── CSS 이름색(대표 세트) + 근접 매칭 ────────────────────
export const NAMED_COLORS: Record<string, string> = {
  black: '#000000', white: '#FFFFFF', red: '#FF0000', lime: '#00FF00', blue: '#0000FF',
  yellow: '#FFFF00', cyan: '#00FFFF', magenta: '#FF00FF', silver: '#C0C0C0', gray: '#808080',
  maroon: '#800000', olive: '#808000', green: '#008000', purple: '#800080', teal: '#008080',
  navy: '#000080', orange: '#FFA500', gold: '#FFD700', pink: '#FFC0CB', hotpink: '#FF69B4',
  crimson: '#DC143C', tomato: '#FF6347', coral: '#FF7F50', salmon: '#FA8072', brown: '#A52A2A',
  chocolate: '#D2691E', indianred: '#CD5C5C', orangered: '#FF4500', darkorange: '#FF8C00',
  khaki: '#F0E68C', indigo: '#4B0082', violet: '#EE82EE', orchid: '#DA70D6', plum: '#DDA0DD',
  turquoise: '#40E0D0', skyblue: '#87CEEB', steelblue: '#4682B4', royalblue: '#4169E1',
  dodgerblue: '#1E90FF', cornflowerblue: '#6495ED', slateblue: '#6A5ACD', mediumseagreen: '#3CB371',
  seagreen: '#2E8B57', forestgreen: '#228B22', limegreen: '#32CD32', darkgreen: '#006400',
  yellowgreen: '#9ACD32', beige: '#F5F5DC', ivory: '#FFFFF0', lavender: '#E6E6FA',
  slategray: '#708090', dimgray: '#696969', lightgray: '#D3D3D3', whitesmoke: '#F5F5F5',
};

export function nearestNamedColor(rgb: RGB): { name: string; hex: string; distance: number } {
  let best = { name: 'black', hex: '#000000', distance: Infinity };
  for (const [name, hex] of Object.entries(NAMED_COLORS)) {
    const c = hexToRgb(hex)!;
    const d = Math.sqrt((c.r - rgb.r) ** 2 + (c.g - rgb.g) ** 2 + (c.b - rgb.b) ** 2);
    if (d < best.distance) best = { name, hex, distance: Math.round(d) };
  }
  return best;
}
