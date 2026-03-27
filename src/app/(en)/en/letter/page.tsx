import type { Metadata } from 'next';
import { siteConfig } from '@/data/site';
import { LetterViewerEn } from './LetterViewerEn';

export const metadata: Metadata = {
  title: `Letter - ${siteConfig.name}`,
  description: 'Read a letter received via QR code.',
  robots: { index: false, follow: false },
};

export default function LetterPage() {
  return <LetterViewerEn />;
}
