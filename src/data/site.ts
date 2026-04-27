// 사이트 설정 - 도메인 변경 시 여기만 수정
export const siteConfig = {
  // 기본 정보 (도메인 변경 가능)
  name: 'ToolPiki',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://toolpiki.com',

  // 문의 이메일
  contactEmail: 'hammaveros@gmail.com',

  // SEO 기본값 (메인은 허브 역할, 도구 키워드는 도구 페이지에서)
  defaultTitle: '툴피키(ToolPiki) - 무료 온라인 도구 | 글자수세기, QR코드 생성, 이미지 압축',
  defaultDescription:
    '툴피키(ToolPiki) - 설치 없이 바로 쓰는 무료 웹 도구 모음. 글자수 세기, QR코드 생성기, 이미지 압축, JSON 포맷터, Base64 변환, 색상 변환, HTTP 상태 코드, 모스부호 변환 등 100개 이상의 실용 유틸리티를 회원가입 없이 무료로 제공합니다.',
  defaultKeywords: [
    '툴피키',
    'ToolPiki',
    '온라인 도구',
    '무료 도구',
    '글자수 세기',
    'QR코드 생성기',
    '이미지 압축',
    'JSON 포맷터',
    'Base64 변환',
    '색상 변환',
    '개발자 도구',
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
