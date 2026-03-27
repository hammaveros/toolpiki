import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,

  // Cloudflare Pages 배포를 위한 정적 빌드
  output: 'export',

  // SSG 모드에서 이미지 최적화 비활성화
  images: { unoptimized: true },

  // 트레일링 슬래시 비활성화
  trailingSlash: false,

  // 뒤로가기 시 스크롤 위치 복원
  experimental: {
    scrollRestoration: true,
  },
};

export default nextConfig;
