import type { Metadata } from 'next';

// 실시간 채팅(UGC)은 AdSense 정책 회색지대라 검색엔진 인덱스에서 제외한다.
export const metadata: Metadata = {
  title: '랜선 탕비실',
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: false,
      follow: true,
      noimageindex: true,
      'max-snippet': 0,
      'max-image-preview': 'none',
      'max-video-preview': 0,
    },
  },
};

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
