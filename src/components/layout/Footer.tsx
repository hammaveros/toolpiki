import Link from 'next/link';
import { siteConfig } from '@/data/site';

interface FooterProps {
  focusMode?: boolean;
}

export function Footer({ focusMode = false }: FooterProps) {
  if (focusMode) return null;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 dark:border-white/[0.07] bg-gray-50 dark:bg-[#0a0d14] mt-8">
      <div className="max-w-6xl mx-auto px-6 md:px-10 pt-6 pb-0">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_2fr_1fr] gap-6 md:gap-8 pb-6 border-b border-gray-200 dark:border-white/[0.07]">
          {/* 브랜드 */}
          <div>
            <Link href="/" className="inline-block text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              {siteConfig.name}
            </Link>
            <p className="text-[13px] text-gray-500 dark:text-white/40 leading-relaxed">
              웹에서 바로 쓰는 무료 온라인 도구 모음.
              <br />모든 작업은 브라우저에서 처리됩니다.
            </p>
          </div>

          {/* 카테고리 */}
          <div>
            <h3 className="text-[11px] font-semibold text-gray-400 dark:text-white/50 uppercase tracking-widest mb-3">
              카테고리
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-0.5">
              <FooterLink href="/tools?category=text">📝 텍스트</FooterLink>
              <FooterLink href="/tools?category=encoding">🔐 인코딩</FooterLink>
              <FooterLink href="/tools?category=formatter">📋 포맷/변환</FooterLink>
              <FooterLink href="/tools?category=image">🖼️ 이미지</FooterLink>
              <FooterLink href="/tools?category=color">🎨 색상</FooterLink>
              <FooterLink href="/tools?category=calculator">🔢 계산/생성</FooterLink>
              <FooterLink href="/tools?category=fun">🎮 재미/테스트</FooterLink>
            </div>
          </div>

          {/* 정보 */}
          <div>
            <h3 className="text-[11px] font-semibold text-gray-400 dark:text-white/50 uppercase tracking-widest mb-3">
              정보
            </h3>
            <div className="space-y-0.5">
              <FooterLink href="/about">소개</FooterLink>
              <FooterLink href="/contact">문의하기</FooterLink>
              <FooterLink href="/privacy">개인정보처리방침</FooterLink>
              <FooterLink href="/terms">이용약관</FooterLink>
            </div>
          </div>
        </div>

        {/* 저작권 */}
        <div className="py-4 text-center">
          <p className="text-xs text-gray-400 dark:text-white/30 tracking-wide">
            © {currentYear} {siteConfig.name}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="block text-[13px] text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white/85 transition-colors py-0.5">
      {children}
    </Link>
  );
}
