import Link from 'next/link';
import { siteConfig } from '@/data/site';

interface FooterProps {
  focusMode?: boolean;
}

export function Footer({ focusMode = false }: FooterProps) {
  // Focus 모드에서는 푸터 숨김
  if (focusMode) return null;

  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 mt-12">
      <div className="container mx-auto px-4 py-8">
        {/* 개인 프로젝트 안내 */}
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center mb-6">
          JSSpace는 개인이 운영하는 웹 유틸리티 프로젝트입니다.
          특정 기업, 에이전시, 조직과 무관하며 클라이언트 업무를 수행하지 않습니다.
        </p>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* 저작권 */}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {currentYear} {siteConfig.name}
          </p>

          {/* 링크 */}
          <nav className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
            <FooterLink href="/about">소개</FooterLink>
            <FooterLink href="/contact">문의하기</FooterLink>
            <FooterLink href="/privacy">개인정보처리방침</FooterLink>
            <FooterLink href="/terms">이용약관</FooterLink>
          </nav>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
    >
      {children}
    </Link>
  );
}
