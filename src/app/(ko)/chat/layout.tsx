'use client';

import { useEffect } from 'react';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // body 스크롤만 막고, 채팅 내부 스크롤은 허용
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, []);

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
      {children}
    </div>
  );
}
