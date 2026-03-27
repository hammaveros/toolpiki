import Link from 'next/link';
import { siteConfig } from '@/data/site';

interface FooterProps {
  focusMode?: boolean;
}

export function Footer({ focusMode = false }: FooterProps) {
  if (focusMode) return null;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 dark:border-[var(--border-subtle)] bg-gray-50 dark:bg-[#0a0d14] mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <Link href="/" className="inline-block text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              {siteConfig.name}
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              웹에서 바로 쓰는 무료 온라인 도구 모음.
              <br />모든 작업은 브라우저에서 처리됩니다.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">카테고리</h3>
            <div className="grid grid-cols-2 gap-1.5">
              <FooterLink href="/tools?category=text">📝 텍스트</FooterLink>
              <FooterLink href="/tools?category=encoding">🔐 인코딩</FooterLink>
              <FooterLink href="/tools?category=formatter">📋 포맷/변환</FooterLink>
              <FooterLink href="/tools?category=image">🖼️ 이미지</FooterLink>
              <FooterLink href="/tools?category=color">🎨 색상</FooterLink>
              <FooterLink href="/tools?category=calculator">🔢 계산/생성</FooterLink>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">정보</h3>
            <div className="space-y-1.5">
              <FooterLink href="/about">소개</FooterLink>
              <FooterLink href="/contact">문의하기</FooterLink>
              <FooterLink href="/privacy">개인정보처리방침</FooterLink>
              <FooterLink href="/terms">이용약관</FooterLink>
            </div>
          </div>
        </div>
        <div className="pt-6 border-t border-gray-200 dark:border-[var(--border-subtle)] text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            © {currentYear} {siteConfig.name}. 개인이 운영하는 독립 프로젝트입니다.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="block text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors py-0.5">
      {children}
    </Link>
  );
}
