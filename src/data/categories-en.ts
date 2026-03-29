import type { CategoryMeta, CategorySlug } from '@/types';

// EN Category Groups (대분류)
export interface CategoryGroupEn {
  name: string;
  icon: string;
  categories: CategorySlug[];
}

export const categoryGroupsEn: CategoryGroupEn[] = [
  {
    name: 'Popular',
    icon: '🔥',
    categories: ['popular'],
  },
  {
    name: 'Text & Data',
    icon: '📄',
    categories: ['text', 'encoding', 'formatter'],
  },
  {
    name: 'Media',
    icon: '🎨',
    categories: ['image', 'color'],
  },
  {
    name: 'Utilities',
    icon: '🛠️',
    categories: ['calculator', 'fun'],
  },
];

/**
 * EN 카테고리 메타데이터
 */
export const categoriesEn: CategoryMeta[] = [
  {
    slug: 'popular',
    name: 'Popular',
    description: 'Most popular tools',
    icon: '🔥',
    order: 1,
  },
  {
    slug: 'text',
    name: 'Text',
    description: 'Character counting, text formatting, and manipulation tools',
    icon: '📝',
    order: 2,
  },
  {
    slug: 'calculator',
    name: 'Calculate',
    description: 'Date, unit, percentage, and utility calculators',
    icon: '🔢',
    order: 3,
  },
  {
    slug: 'image',
    name: 'Image',
    description: 'Resize, compress, crop, and convert images',
    icon: '🖼️',
    order: 4,
  },
  {
    slug: 'formatter',
    name: 'Format',
    description: 'JSON, XML, SQL, and code formatting tools',
    icon: '📄',
    order: 5,
  },
  {
    slug: 'color',
    name: 'Color',
    description: 'Color conversion, palettes, and accessibility checks',
    icon: '🎨',
    order: 6,
  },
  {
    slug: 'encoding',
    name: 'Encoding',
    description: 'Base64, URL encoding, hashing, and data conversion',
    icon: '🔠',
    order: 7,
  },
  {
    slug: 'fun',
    name: 'Fun & Tests',
    description: 'Reaction tests, random generators, and interactive tools',
    icon: '🎮',
    order: 8,
  },
];

export const categoryListEn = categoriesEn;

// Get category by slug
export function getCategoryBySlugEn(slug: string): CategoryMeta | undefined {
  return categoriesEn.find((cat) => cat.slug === slug);
}
