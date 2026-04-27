// AdSense 정책상 회색지대 도구의 슬러그 모음.
// 검색 엔진 인덱스에서 제외(noindex)하고, 페이지 내 광고 슬롯도 노출하지 않는다.
// 사주/운세/타로/궁합/심리테스트/복권/실시간 채팅 등이 해당된다.

export const NOINDEX_SLUGS_KR: ReadonlySet<string> = new Set([
  'saju-reading',
  'saju-compatibility',
  'team-saju',
  'daily-tarot',
  'birthday-compatibility',
  'name-compatibility',
  'fortune-cookie',
  'lotto-generator',
]);

export const NOINDEX_SLUGS_EN: ReadonlySet<string> = new Set([
  'daily-horoscope-en',
  'love-calculator-en',
  'ship-name-generator-en',
  'us-lotto-generator-en',
  'personality-color-quiz-en',
]);

// 라우트 단위로 noindex/광고 미노출되는 정적 경로 (locale prefix 제외한 형태)
export const NOINDEX_STATIC_PATHS: readonly string[] = ['/chat'];

export function isRestrictedSlug(slug: string): boolean {
  return NOINDEX_SLUGS_KR.has(slug) || NOINDEX_SLUGS_EN.has(slug);
}

// 주어진 pathname이 광고 미노출 + noindex 대상인지 판별한다.
// pathname 예시:
//   /chat, /en/chat
//   /tools/saju-reading, /en/tools/daily-horoscope-en
export function isRestrictedPath(pathname: string): boolean {
  if (!pathname) return false;
  const normalized = pathname.replace(/\/$/, '') || '/';
  const stripped = normalized.startsWith('/en') ? normalized.slice(3) || '/' : normalized;
  if (NOINDEX_STATIC_PATHS.includes(stripped)) return true;
  const match = normalized.match(/^(?:\/en)?\/tools\/([^/]+)$/);
  if (match && isRestrictedSlug(match[1])) return true;
  return false;
}
