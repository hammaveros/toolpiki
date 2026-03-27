import type { CategorySlug } from './tool';

// 카테고리 메타데이터
export interface CategoryMeta {
  slug: CategorySlug;
  name: string;
  description: string;
  icon: string;
  order: number;
}
