const ADJECTIVES = [
  '졸린', '배고픈', '한가한', '심심한', '피곤한', '나른한', '느긋한', '여유로운',
  '멍때리는', '행복한', '몽글몽글', '포근한', '쿨한', '따뜻한', '슬금슬금',
  '살금살금', '두근두근', '반짝이는', '조용한', '수줍은',
];

const ANIMALS = [
  { name: '판다', emoji: '🐼' },
  { name: '고양이', emoji: '🐱' },
  { name: '수달', emoji: '🦦' },
  { name: '펭귄', emoji: '🐧' },
  { name: '강아지', emoji: '🐶' },
  { name: '곰', emoji: '🐻' },
  { name: '토끼', emoji: '🐰' },
  { name: '햄스터', emoji: '🐹' },
  { name: '여우', emoji: '🦊' },
  { name: '코알라', emoji: '🐨' },
  { name: '다람쥐', emoji: '🐿️' },
  { name: '오리', emoji: '🦆' },
  { name: '부엉이', emoji: '🦉' },
  { name: '나무늘보', emoji: '🦥' },
  { name: '돌고래', emoji: '🐬' },
  { name: '병아리', emoji: '🐥' },
  { name: '거북이', emoji: '🐢' },
  { name: '고슴도치', emoji: '🦔' },
  { name: '알파카', emoji: '🦙' },
  { name: '물범', emoji: '🦭' },
];

const STORAGE_KEY = 'tangbisil-nickname';

export function generateNickname(): { name: string; emoji: string } {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  return { name: `${adj}${animal.name}`, emoji: animal.emoji };
}

export function getSavedNickname(): { name: string; emoji: string } | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
}

export function saveNickname(nickname: { name: string; emoji: string }) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nickname));
}
