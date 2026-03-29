'use client';

import { useEffect } from 'react';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return <div className="h-[calc(100vh-64px)] overflow-hidden">{children}</div>;
}
