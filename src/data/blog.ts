export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  toolSlug: string;
  toolUrl: string;
  readingTime: number;
}

export const blogPostsKr: BlogPost[] = [
  {
    slug: 'character-counter',
    title: '글자수 세기 사이트, 광고 없이 쓸 수 없는 건가',
    description: '블로그 원고, 카카오톡 메시지, 공공기관 제출물. 글자수 제한 있는 상황에서 글자수 세는 사이트들이 왜 이렇게 불편한지 정리했다.',
    date: '2026-06-10',
    category: '텍스트',
    toolSlug: 'character-counter',
    toolUrl: '/tools/character-counter',
    readingTime: 3,
  },
  {
    slug: 'json-formatter',
    title: 'JSON 정리할 때마다 검색이 귀찮아서 만든 것',
    description: 'API 응답 확인, 설정 파일 수정, 로그 분석. JSON을 정리할 때마다 매번 검색하고 들어가는 사이트가 매번 달랐다.',
    date: '2026-06-12',
    category: '포맷터',
    toolSlug: 'json-formatter',
    toolUrl: '/tools/json-formatter',
    readingTime: 3,
  },
  {
    slug: 'image-compress',
    title: '이미지 압축, 파일을 서버에 올리지 않아도 되는 방법',
    description: '이미지 압축할 때마다 느끼는 찝찝함. 내 파일이 어딘가 서버에 올라가는 게 싫어서 브라우저에서만 처리하는 도구를 찾아봤다.',
    date: '2026-06-15',
    category: '이미지',
    toolSlug: 'image-compress',
    toolUrl: '/tools/image-compress',
    readingTime: 4,
  },
  {
    slug: 'qr-generator',
    title: 'QR 코드 만드는 데 왜 회원가입이 필요한 거야',
    description: 'URL 하나 QR로 바꾸는 데 이메일 인증까지 요구하는 서비스들. 회원가입 없이 바로 만들 수 있는 방법을 정리했다.',
    date: '2026-06-18',
    category: '계산/생성',
    toolSlug: 'qr-generator',
    toolUrl: '/tools/qr-generator',
    readingTime: 3,
  },
  {
    slug: 'base64',
    title: 'Base64 변환, 개발하다 보면 매일 쓰는데 좋은 도구가 없더라',
    description: 'API 토큰 확인, 이미지 임베딩, JWT 디코딩. Base64는 개발자라면 거의 매일 쓰는데, 정작 쓸 만한 도구가 별로 없다.',
    date: '2026-06-20',
    category: '인코딩',
    toolSlug: 'base64',
    toolUrl: '/tools/base64',
    readingTime: 4,
  },
];

export const blogPostsEn: BlogPost[] = [
  {
    slug: 'character-counter',
    title: 'Character Counter Sites Are Surprisingly Frustrating to Use',
    description: 'Blog posts, social media captions, official forms. Every time you need to count characters, you end up on some ad-heavy site that makes the whole thing painful.',
    date: '2026-06-10',
    category: 'Text',
    toolSlug: 'character-counter-en',
    toolUrl: '/en/tools/character-counter-en',
    readingTime: 3,
  },
  {
    slug: 'json-formatter',
    title: "I Got Tired of Googling a JSON Formatter Every Time, So I Built One",
    description: 'Checking API responses, editing config files, reading logs. Every time I needed to format JSON, I was searching for a different site and hitting ads.',
    date: '2026-06-12',
    category: 'Formatter',
    toolSlug: 'json-formatter-en',
    toolUrl: '/en/tools/json-formatter-en',
    readingTime: 3,
  },
  {
    slug: 'image-compress',
    title: 'Image Compression Without Uploading Your Files to a Server',
    description: "Every time you compress an image on most sites, your file gets uploaded somewhere. Here's how to do it entirely in your browser — no uploads required.",
    date: '2026-06-15',
    category: 'Image',
    toolSlug: 'image-compress-en',
    toolUrl: '/en/tools/image-compress-en',
    readingTime: 4,
  },
  {
    slug: 'qr-generator',
    title: 'Why Do QR Code Generators Require Sign-Up?',
    description: "You want to turn a URL into a QR code. Simple request. But most sites want your email first. Here's one that doesn't.",
    date: '2026-06-18',
    category: 'Calculator',
    toolSlug: 'qr-generator-en',
    toolUrl: '/en/tools/qr-generator-en',
    readingTime: 3,
  },
  {
    slug: 'base64',
    title: 'Base64 Encoder/Decoder: The Tool Every Developer Uses Daily',
    description: 'API tokens, image embedding, JWT inspection — Base64 comes up constantly in development. Finding a clean, ad-free tool for it is harder than it should be.',
    date: '2026-06-20',
    category: 'Encoding',
    toolSlug: 'base64-en',
    toolUrl: '/en/tools/base64-en',
    readingTime: 4,
  },
];

export function getBlogPost(slug: string, lang: 'kr' | 'en'): BlogPost | undefined {
  const posts = lang === 'kr' ? blogPostsKr : blogPostsEn;
  return posts.find((p) => p.slug === slug);
}
