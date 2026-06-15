// 큐레이션 색상 — 자주 검색되는 이름색 세트.
// 각 색은 /tools/color/<slug> 정적 상세 페이지 + OG 스와치 PNG(public/og/color/<slug>.png)를 가진다.
// hex 는 대문자 6자리. slug 는 영문 이름(소문자).

export interface CuratedColor {
  slug: string;
  hex: string;
  ko: string; // 한국어 색 이름
  en: string; // 영어 색 이름
}

export const curatedColors: CuratedColor[] = [
  { slug: 'red', hex: '#FF0000', ko: '빨강', en: 'Red' },
  { slug: 'orange', hex: '#FFA500', ko: '주황', en: 'Orange' },
  { slug: 'yellow', hex: '#FFFF00', ko: '노랑', en: 'Yellow' },
  { slug: 'green', hex: '#008000', ko: '초록', en: 'Green' },
  { slug: 'lime', hex: '#00FF00', ko: '라임', en: 'Lime' },
  { slug: 'blue', hex: '#0000FF', ko: '파랑', en: 'Blue' },
  { slug: 'navy', hex: '#000080', ko: '남색', en: 'Navy' },
  { slug: 'skyblue', hex: '#87CEEB', ko: '하늘색', en: 'Sky Blue' },
  { slug: 'cyan', hex: '#00FFFF', ko: '청록(시안)', en: 'Cyan' },
  { slug: 'teal', hex: '#008080', ko: '청록', en: 'Teal' },
  { slug: 'turquoise', hex: '#40E0D0', ko: '터쿼이즈', en: 'Turquoise' },
  { slug: 'purple', hex: '#800080', ko: '보라', en: 'Purple' },
  { slug: 'violet', hex: '#EE82EE', ko: '바이올렛', en: 'Violet' },
  { slug: 'indigo', hex: '#4B0082', ko: '인디고', en: 'Indigo' },
  { slug: 'magenta', hex: '#FF00FF', ko: '마젠타', en: 'Magenta' },
  { slug: 'pink', hex: '#FFC0CB', ko: '분홍', en: 'Pink' },
  { slug: 'hotpink', hex: '#FF69B4', ko: '핫핑크', en: 'Hot Pink' },
  { slug: 'crimson', hex: '#DC143C', ko: '진홍', en: 'Crimson' },
  { slug: 'tomato', hex: '#FF6347', ko: '토마토', en: 'Tomato' },
  { slug: 'coral', hex: '#FF7F50', ko: '코랄(산호색)', en: 'Coral' },
  { slug: 'salmon', hex: '#FA8072', ko: '연어색', en: 'Salmon' },
  { slug: 'gold', hex: '#FFD700', ko: '금색', en: 'Gold' },
  { slug: 'khaki', hex: '#F0E68C', ko: '카키', en: 'Khaki' },
  { slug: 'olive', hex: '#808000', ko: '올리브', en: 'Olive' },
  { slug: 'brown', hex: '#A52A2A', ko: '갈색', en: 'Brown' },
  { slug: 'chocolate', hex: '#D2691E', ko: '초콜릿', en: 'Chocolate' },
  { slug: 'maroon', hex: '#800000', ko: '적갈색', en: 'Maroon' },
  { slug: 'beige', hex: '#F5F5DC', ko: '베이지', en: 'Beige' },
  { slug: 'ivory', hex: '#FFFFF0', ko: '아이보리', en: 'Ivory' },
  { slug: 'lavender', hex: '#E6E6FA', ko: '라벤더', en: 'Lavender' },
  { slug: 'mintgreen', hex: '#98FF98', ko: '민트색', en: 'Mint Green' },
  { slug: 'forestgreen', hex: '#228B22', ko: '짙은 초록', en: 'Forest Green' },
  { slug: 'royalblue', hex: '#4169E1', ko: '로열블루', en: 'Royal Blue' },
  { slug: 'dodgerblue', hex: '#1E90FF', ko: '도저블루', en: 'Dodger Blue' },
  { slug: 'steelblue', hex: '#4682B4', ko: '스틸블루', en: 'Steel Blue' },
  { slug: 'slateblue', hex: '#6A5ACD', ko: '슬레이트블루', en: 'Slate Blue' },
  { slug: 'black', hex: '#000000', ko: '검정', en: 'Black' },
  { slug: 'white', hex: '#FFFFFF', ko: '흰색', en: 'White' },
  { slug: 'gray', hex: '#808080', ko: '회색', en: 'Gray' },
  { slug: 'silver', hex: '#C0C0C0', ko: '은색', en: 'Silver' },
  { slug: 'lightgray', hex: '#D3D3D3', ko: '밝은 회색', en: 'Light Gray' },
  { slug: 'slategray', hex: '#708090', ko: '슬레이트그레이', en: 'Slate Gray' },
];

export function getCuratedColor(slug: string): CuratedColor | undefined {
  return curatedColors.find((c) => c.slug === slug);
}
