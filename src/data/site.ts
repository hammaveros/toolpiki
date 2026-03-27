// 사이트 설정 - 도메인 변경 시 여기만 수정
export const siteConfig = {
  // 기본 정보 (도메인 변경 가능)
  name: 'ToolPiki',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://toolpiki.com',

  // 문의 이메일
  contactEmail: 'hammaveros@gmail.com',

  // SEO 기본값 (메인은 허브 역할, 도구 키워드는 도구 페이지에서)
  defaultTitle: '무료 온라인 도구 모음',
  defaultDescription:
    '누구나 쓸 수 있는 무료 온라인 도구 모음. 텍스트 변환, 이미지 편집, 색상 도구, 계산기, 재미있는 테스트까지 다양한 유틸리티를 제공합니다.',
  defaultKeywords: [
    '온라인 도구',
    '무료 도구',
    '웹 유틸리티',
    '편리한 도구',
    'ToolPiki',
  ],

  // 소셜
  locale: 'ko_KR',
  themeColor: '#1e293b',

  // 검색엔진 인증 (배포 후 설정)
  verification: {
    google: '', // Google Search Console 인증 코드
    naver: '943e1ba5022da6564eda3471b5a0062c69b54fc1',
    bing: '',   // Bing Webmaster Tools 인증 코드
  },
};

export type SiteConfig = typeof siteConfig;
