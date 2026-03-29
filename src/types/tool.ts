// 카테고리 슬러그 타입
export type CategorySlug =
  | 'popular'
  | 'text'
  | 'encoding'
  | 'formatter'
  | 'image'
  | 'color'
  | 'calculator'
  | 'fun';

// 도구 메타데이터 타입
export interface ToolMeta {
  // 기본 정보
  slug: string;
  name: string;
  description: string;
  longDescription?: string;

  // 분류
  category: CategorySlug;
  tags: string[];

  // 표시 옵션
  icon: string;
  featured?: boolean;
  isNew?: boolean;
  isSpecial?: boolean;      // 특별 스타일 (게임센터 등)
  externalUrl?: string;     // 외부 링크 (다른 사이트로 이동)

  // SEO 기본
  keywords: string[];

  // SEO 강화 (검색 상단 노출용)
  seoTitle?: string;        // 검색결과 타이틀 (예: "글자수 세기 - 실시간 글자수 계산기")
  seoDescription?: string;  // 검색결과 설명 (160자 이내)
  seoContent?: string;      // 도구 UI 아래 표시할 설명 텍스트 (800자)
  faqs?: { question: string; answer: string }[]; // FAQ 구조화 데이터

  // 관련 도구
  relatedSlugs?: string[];
}

// 도구 컴포넌트 Props
export interface ToolComponentProps {
  meta: ToolMeta;
}
