import type { ToolMeta } from '@/types';

/**
 * 도구 검색 유틸리티 (KR/EN 공용)
 *
 * 제공 기능:
 * 1. 정규화 매칭 - 소문자화 + 공백/구분자 제거 후 부분일치
 * 2. 한글 초성 검색 - "ㄱㅈㅅ" -> "글자수..." 매칭
 */

// 한글 초성 (compatibility jamo, 19개)
const CHOSUNG = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
];

const CHOSUNG_SET = new Set(CHOSUNG);

const HANGUL_BASE = 0xac00; // '가'
const HANGUL_END = 0xd7a3; // '힣'

/**
 * 검색어/필드 정규화: 소문자화 + 공백 및 흔한 구분자 제거.
 * "글자 수 세기" -> "글자수세기", "Image Compress" -> "imagecompress"
 */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\s\-_./\\,]+/g, '');
}

/**
 * 문자열에서 초성 문자열 추출.
 * 완성형 한글은 초성으로, 그 외 문자(영문/숫자/기존 자모)는 그대로 유지.
 * "글자수 세기" -> "ㄱㅈㅅㅅㄱ" (공백 제거됨)
 */
export function toChosung(text: string): string {
  let result = '';
  for (const ch of text) {
    const code = ch.charCodeAt(0);
    if (code >= HANGUL_BASE && code <= HANGUL_END) {
      const idx = Math.floor((code - HANGUL_BASE) / 588);
      result += CHOSUNG[idx];
    } else if (ch.trim() !== '') {
      result += ch.toLowerCase();
    }
  }
  return result;
}

/**
 * 검색어가 초성만으로 이뤄졌는지 판별.
 * (공백 제외 최소 1글자 이상이며 모든 글자가 초성 자모)
 */
export function isChosungQuery(query: string): boolean {
  const chars = [...query].filter((c) => c.trim() !== '');
  if (chars.length === 0) return false;
  return chars.every((c) => CHOSUNG_SET.has(c));
}

/**
 * 단일 도구가 검색어에 매칭되는지 판별.
 * - 정규화 부분일치: name, description, keywords, tags
 * - 초성 검색: 검색어가 초성-only일 때 name / keywords 초성과 부분일치
 */
export function toolMatchesQuery(tool: ToolMeta, rawQuery: string): boolean {
  const q = rawQuery.trim();
  if (!q) return true;

  // 1) 초성 전용 검색
  if (isChosungQuery(q)) {
    const chosungQuery = [...q].filter((c) => c.trim() !== '').join('');
    if (toChosung(tool.name).includes(chosungQuery)) return true;
    if (tool.keywords?.some((k) => toChosung(k).includes(chosungQuery))) return true;
    if (tool.tags?.some((t) => toChosung(t).includes(chosungQuery))) return true;
    return false;
  }

  // 2) 정규화 부분일치
  const nq = normalize(q);
  if (!nq) return true;

  if (normalize(tool.name).includes(nq)) return true;
  if (normalize(tool.description).includes(nq)) return true;
  if (tool.keywords?.some((k) => normalize(k).includes(nq))) return true;
  if (tool.tags?.some((t) => normalize(t).includes(nq))) return true;

  return false;
}

/**
 * 도구 목록을 검색어로 필터링.
 */
export function filterToolsByQuery(tools: ToolMeta[], rawQuery: string): ToolMeta[] {
  if (!rawQuery.trim()) return tools;
  return tools.filter((tool) => toolMatchesQuery(tool, rawQuery));
}
