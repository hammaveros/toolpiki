'use client';

import { Suspense } from 'react';
import { Header, Footer } from '@/components/layout';

export default function ChatTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={null}>
        <Header />
      </Suspense>
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
