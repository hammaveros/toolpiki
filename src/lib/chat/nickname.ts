const ADJECTIVES = [
  '졸린', '배고픈', '한가한', '심심한', '피곤한', '나른한', '느긋한', '여유로운',
  '멍때리는', '행복한', '몽글몽글', '포근한', '쿨한', '따뜻한', '슬금슬금',
  '살금살금', '두근두근', '반짝이는', '조용한', '수줍은',
  '졸깃졸깃', '몽롱한', '꾸벅꾸벅', '게으른', '활발한', '신나는', '덜렁덜렁',
  '얌전한', '까칠한', '소심한', '당당한', '엉뚱한', '천진난만', '새침한',
  '덤덤한', '호기심많은', '기분좋은', '나긋나긋', '보들보들', '뭉클한',
  // 확장
  '나른나른', '몰랑몰랑', '말랑한', '통통한', '오동통', '꼬물꼬물', '방실방실',
  '쫄깃한', '쿠키먹은', '커피마신', '야근하는', '월급루팡', '퇴근하고픈', '재택중인',
  '출근싫은', '점심고민', '간식찾는', '커피부족', '집가고픈', '눈치보는',
  '설레는', '들뜬', '나른해진', '보송보송', '말캉한', '폭신한', '따끈한',
  '냐옹하는', '하품하는', '기지개켜는', '뒹굴대는', '꼬박꼬박', '스르르', '나풀나풀',
  '반짝반짝', '뽀송한', '아늑한', '노곤한', '개운한', '상큼한', '싱그러운',
  '차분한', '느릿느릿', '토실토실', '말똥말똥', '초롱초롱', '방긋방긋', '싱글벙글',
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
  { name: '카피바라', emoji: '🦫' },
  { name: '미어캣', emoji: '🐾' },
  { name: '앵무새', emoji: '🦜' },
  { name: '두더지', emoji: '🐹' },
  { name: '해파리', emoji: '🪼' },
  { name: '문어', emoji: '🐙' },
  { name: '고래', emoji: '🐋' },
  { name: '플라밍고', emoji: '🦩' },
  { name: '올빼미', emoji: '🦉' },
  { name: '너구리', emoji: '🦝' },
  { name: '사슴', emoji: '🦌' },
  { name: '개구리', emoji: '🐸' },
  { name: '나비', emoji: '🦋' },
  { name: '꿀벌', emoji: '🐝' },
  { name: '달팽이', emoji: '🐌' },
  { name: '북극곰', emoji: '🐻‍❄️' },
  { name: '치타', emoji: '🐆' },
  { name: '하마', emoji: '🦛' },
  { name: '기린', emoji: '🦒' },
  { name: '래서판다', emoji: '🐾' },
  // 확장
  { name: '햄찌', emoji: '🐹' },
  { name: '수리부엉이', emoji: '🦉' },
  { name: '아기양', emoji: '🐑' },
  { name: '염소', emoji: '🐐' },
  { name: '순록', emoji: '🦌' },
  { name: '레서팬더', emoji: '🐾' },
  { name: '판다곰', emoji: '🐼' },
  { name: '아기펭귄', emoji: '🐧' },
  { name: '삵', emoji: '🐈' },
  { name: '치와와', emoji: '🐕' },
  { name: '시바견', emoji: '🐕' },
  { name: '푸들', emoji: '🐩' },
  { name: '앙고라', emoji: '🐰' },
  { name: '친칠라', emoji: '🐹' },
  { name: '레밍', emoji: '🐭' },
  { name: '생쥐', emoji: '🐭' },
  { name: '다람쥐', emoji: '🐿️' },
  { name: '청설모', emoji: '🐿️' },
  { name: '수달이', emoji: '🦦' },
  { name: '바다표범', emoji: '🦭' },
  { name: '펭수', emoji: '🐧' },
  { name: '벌새', emoji: '🐦' },
  { name: '참새', emoji: '🐦' },
  { name: '까치', emoji: '🐦‍⬛' },
  { name: '왕관앵무', emoji: '🦜' },
  { name: '금붕어', emoji: '🐠' },
  { name: '복어', emoji: '🐡' },
  { name: '가재', emoji: '🦞' },
  { name: '새우', emoji: '🦐' },
  { name: '불가사리', emoji: '⭐' },
  { name: '무당벌레', emoji: '🐞' },
  { name: '잠자리', emoji: '🪰' },
  { name: '귀뚜라미', emoji: '🦗' },
  { name: '거미', emoji: '🕷️' },
  { name: '지렁이', emoji: '🪱' },
  { name: '아기공룡', emoji: '🦕' },
  { name: '티라노', emoji: '🦖' },
  { name: '용', emoji: '🐉' },
  { name: '유니콘', emoji: '🦄' },
  { name: '얼룩말', emoji: '🦓' },
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
