import type { CategoryMeta, CategorySlug } from '@/types';

// 대분류 정의
export interface CategoryGroup {
  name: string;
  icon: string;
  categories: CategorySlug[];
}

export const categoryGroups: CategoryGroup[] = [
  {
    name: '텍스트 & 데이터',
    icon: '📄',
    categories: ['text', 'encoding', 'formatter'],
  },
  {
    name: '미디어',
    icon: '🎨',
    categories: ['image', 'color'],
  },
  {
    name: '유틸리티',
    icon: '🛠️',
    categories: ['calculator', 'fun'],
  },
];

export const categories: Record<CategorySlug, CategoryMeta> = {
  text: {
    slug: 'text',
    name: '텍스트',
    description: '텍스트 변환, 포맷팅, 분석 도구',
    icon: '📝',
    order: 2,
  },
  encoding: {
    slug: 'encoding',
    name: '인코딩',
    description: '텍스트 및 데이터 인코딩/디코딩 변환 도구',
    icon: '🔐',
    order: 3,
  },
  formatter: {
    slug: 'formatter',
    name: '포맷/변환',
    description: 'JSON, XML 등 데이터 포맷 정리 및 변환 도구',
    icon: '📋',
    order: 4,
  },
  image: {
    slug: 'image',
    name: '이미지',
    description: '이미지 변환, 리사이즈, 압축 도구',
    icon: '🖼️',
    order: 5,
  },
  color: {
    slug: 'color',
    name: '색상',
    description: '색상 변환, 팔레트 생성, 추출 도구',
    icon: '🎨',
    order: 6,
  },
  calculator: {
    slug: 'calculator',
    name: '계산/생성',
    description: '다양한 계산 및 데이터 생성 도구',
    icon: '🔢',
    order: 7,
  },
  fun: {
    slug: 'fun',
    name: '재미/테스트',
    description: '반응속도, 랜덤 생성기, 심리테스트, 추천 등',
    icon: '🎮',
    order: 8,
  },
};

// 정렬된 카테고리 목록
export const categoryList = Object.values(categories).sort(
  (a, b) => a.order - b.order
);

// 카테고리 slug로 찾기
export function getCategoryBySlug(slug: string): CategoryMeta | undefined {
  return categories[slug as CategorySlug];
}
