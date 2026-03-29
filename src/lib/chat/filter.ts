// 메이플 스타일 비속어 → 귀여운 단어 치환
const PROFANITY_MAP: [RegExp, string][] = [
  [/시발|씨발|쉬발|쒸발|슈발|시팔|씨팔/gi, '세상에~'],
  [/ㅅㅂ|ㅆㅂ/g, '세상에~'],
  [/꺼져/gi, '가세요~'],
  [/닥쳐/gi, '조용히~'],
  [/병신/gi, '귀요미'],
  [/ㅂㅅ/g, '귀요미'],
  [/지랄/gi, '재롱'],
  [/ㅈㄹ/g, '재롱'],
  [/존나|ㅈㄴ/gi, '매우'],
  [/개새끼|ㄱㅅㄲ/gi, '강아지🐶'],
  [/새끼|ㅅㄲ/gi, '아기🍼'],
  [/미친놈|미친년/gi, '천재'],
  [/좆|ㅈ같/gi, '음~'],
  [/씹/gi, '냠'],
  [/느금마|ㄴㄱㅁ|니애미|니엄마|니미|애미|에미/gi, '어머님💐'],
  [/걸레/gi, '걸레(청소용)🧹'],
  [/뒤질|뒈질|디질/gi, '잠들'],
  [/빡대가리/gi, '빛나는머리✨'],
  [/개소리/gi, '멍멍🐶'],
  [/개지랄/gi, '댕댕재롱🐶'],
  [/개같/gi, '댕댕같'],
  [/엿먹/gi, '엿먹(달콤)🍬'],
  [/쌍년|쌍놈/gi, '쌍둥이👯'],
  [/찐따/gi, '친구'],
  [/한남|한녀/gi, '사람'],
  [/틀딱/gi, '어르신'],
  [/엠창/gi, '음~'],
  [/보지|ㅂㅈ/gi, '🙈'],
  [/자지|ㅈㅈ/gi, '🙈'],
  [/후장/gi, '🙈'],
  [/빠구리/gi, '🙈'],
  [/색히/gi, '친구야'],
];

// URL 패턴
const URL_PATTERN = /(https?:\/\/|www\.|\.com|\.kr|\.net|\.org|\.io)/i;

/**
 * 비속어 → 귀여운 단어로 치환 (메이플 스타일)
 */
export function filterProfanity(text: string): string {
  let filtered = text;
  for (const [regex, replacement] of PROFANITY_MAP) {
    filtered = filtered.replace(regex, replacement);
  }
  return filtered;
}

/**
 * URL 포함 여부 체크
 */
export function containsUrl(text: string): boolean {
  return URL_PATTERN.test(text);
}

/**
 * 자음/모음 반복 제한 (20자 이상이면 10자로)
 */
export function limitRepeat(text: string): string {
  return text.replace(/([ㄱ-ㅎㅏ-ㅣ])\1{9,}/g, (_match, char) => char.repeat(10));
}

/**
 * 메시지 전체 필터
 */
export function filterMessage(text: string): { filtered: string; blocked: boolean; reason?: string } {
  const trimmed = text.trim();

  if (!trimmed) {
    return { filtered: '', blocked: true, reason: '빈 메시지' };
  }

  if (trimmed.length > 200) {
    return { filtered: '', blocked: true, reason: '200자 초과' };
  }

  if (containsUrl(trimmed)) {
    return { filtered: '', blocked: true, reason: '링크는 못 보내요 🙅' };
  }

  let result = limitRepeat(trimmed);
  result = filterProfanity(result);

  return { filtered: result, blocked: false };
}
