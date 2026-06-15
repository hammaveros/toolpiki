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
  'chat',
  // 검색 의도 약한 미니게임/위젯 (AdSense thin content 대응)
  'color-perception-test',
  'shell-game',
  'typing-practice',
  'order-picker',
  'team-picker',
  'letter-qr',
  'number-guess',
  // 추천형 도구 (사용자 행동 중심, SEO 약함)
  'menu-recommender',
  'weekend-recommender',
  'rest-recommender',
  // 오락/위젯형 도구 (검색 의도 약함, AdSense thin content 대응 - 2차 솎기)
  'roulette-selector',
  'ladder-game',
  'reaction-time-test',
  'timing-test',
  'random-decision-maker',
  'typing-game',
  'pros-cons-comparator',
  'nickname-generator',
]);

export const NOINDEX_SLUGS_EN: ReadonlySet<string> = new Set([
  'daily-horoscope-en',
  'love-calculator-en',
  'ship-name-generator-en',
  'us-lotto-generator-en',
  'personality-color-quiz-en',
  // 검색 의도 약한 미니게임/위젯 (AdSense thin content 대응)
  'color-perception-test-en',
  'shell-game-en',
  'typing-practice-en',
  'order-picker-en',
  'team-picker-en',
  'letter-qr-en',
  'number-guess-en',
  // 오락/위젯형 도구 (검색 의도 약함, AdSense thin content 대응 - 2차 솎기)
  'roulette-selector-en',
  'ladder-game-en',
  'reaction-time-test-en',
  'timing-test-en',
  'random-decision-maker-en',
  'typing-game-en',
  'pros-cons-comparator-en',
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
