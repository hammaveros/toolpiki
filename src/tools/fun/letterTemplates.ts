export interface LetterTemplate {
  id: number;
  nameKr: string;
  nameEn: string;
  icon: string;
  /** 카드 외부 컨테이너 클래스 */
  cardClass: string;
  /** 본문 텍스트 클래스 */
  textClass: string;
  /** 워터마크(jsspace.online) 색 */
  watermarkClass: string;
  /** toPng backgroundColor */
  bgColor: string;
  /** 상단 꾸미기 (아이콘 대신 쓸 데코) */
  topDecor: string;
  /** 하단 꾸미기 (좌우 코너) */
  cornerDecor?: { topLeft?: string; topRight?: string; bottomLeft?: string; bottomRight?: string };
}

export const LETTER_TEMPLATES: LetterTemplate[] = [
  {
    id: 1,
    nameKr: '기본 편지',
    nameEn: 'Classic',
    icon: '✉️',
    cardClass: 'bg-amber-50 border-2 border-amber-200 rounded-2xl shadow-md',
    textClass: 'text-gray-800 font-medium',
    watermarkClass: 'text-amber-300',
    bgColor: '#fffbeb',
    topDecor: '✉️',
  },
  {
    id: 2,
    nameKr: '빈티지',
    nameEn: 'Vintage',
    icon: '📜',
    cardClass: 'bg-orange-50 border-2 border-dashed border-orange-300 rounded-lg shadow-inner',
    textClass: 'text-orange-900 italic',
    watermarkClass: 'text-orange-200',
    bgColor: '#fff7ed',
    topDecor: '📜',
    cornerDecor: { topLeft: '~', topRight: '~', bottomLeft: '~', bottomRight: '~' },
  },
  {
    id: 3,
    nameKr: '하늘',
    nameEn: 'Sky',
    icon: '☁️',
    cardClass: 'bg-gradient-to-b from-sky-100 to-blue-50 border-2 border-sky-200 rounded-3xl shadow-lg',
    textClass: 'text-sky-900 font-medium',
    watermarkClass: 'text-sky-200',
    bgColor: '#e0f2fe',
    topDecor: '☁️',
    cornerDecor: { topLeft: '·', topRight: '·', bottomLeft: '☁', bottomRight: '☁' },
  },
  {
    id: 4,
    nameKr: '밤하늘',
    nameEn: 'Night Sky',
    icon: '⭐',
    cardClass: 'bg-gradient-to-b from-indigo-950 to-slate-900 border border-indigo-400/30 rounded-2xl shadow-xl',
    textClass: 'text-indigo-100 font-medium',
    watermarkClass: 'text-indigo-700',
    bgColor: '#1e1b4b',
    topDecor: '⭐',
    cornerDecor: { topLeft: '✦', topRight: '✦', bottomLeft: '✧', bottomRight: '✧' },
  },
  {
    id: 5,
    nameKr: '봄날',
    nameEn: 'Spring',
    icon: '🌸',
    cardClass: 'bg-gradient-to-br from-pink-50 via-white to-green-50 border-2 border-pink-200 rounded-2xl shadow-md',
    textClass: 'text-pink-900 font-medium',
    watermarkClass: 'text-pink-200',
    bgColor: '#fdf2f8',
    topDecor: '🌸',
    cornerDecor: { topLeft: '🌿', topRight: '🌿', bottomLeft: '🌷', bottomRight: '🌷' },
  },
];

export function getTemplate(id: number): LetterTemplate {
  return LETTER_TEMPLATES.find((t) => t.id === id) || LETTER_TEMPLATES[0];
}
