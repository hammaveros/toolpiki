import type { Metadata } from 'next';
import { siteConfig } from '@/data/site';
import { LetterViewer } from './LetterViewer';

export const metadata: Metadata = {
  title: `편지 - ${siteConfig.name}`,
  description: 'QR코드로 받은 편지를 확인하세요.',
  robots: { index: false, follow: false },
};

export default function LetterPage() {
  return <LetterViewer />;
}
