'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { siteConfig } from '@/data/site';
import { MenuIcon, CloseIcon, HomeIcon, ToolsIcon } from '@/components/icons';
import { ThemeToggle } from '@/components/ThemeToggle';

interface HeaderProps {
  focusMode?: boolean;
}

export function Header({ focusMode = false }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (focusMode) return null;

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-200 backdrop-blur-xl',
        scrolled
          ? 'bg-white/80 dark:bg-[#0f1117]/80 border-b border-gray-200/60 dark:border-gray-700/40 shadow-sm'
          : 'bg-white/95 dark:bg-[#0f1117]/95 border-b border-transparent'
      )}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {siteConfig.name}
            </span>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full">
              100+ 도구
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <NavLink href="/"><HomeIcon size={16} /><span>홈</span></NavLink>
            <NavLink href="/tools"><ToolsIcon size={16} /><span>도구</span></NavLink>
            <NavLink href="/chat"><span>☕</span><span>탕비실</span></NavLink>
            <NavLink href="/contact"><span>문의</span></NavLink>
            <div className="ml-2"><ThemeToggle isEnglish={false} /></div>
          </nav>

          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle isEnglish={false} />
            <button
              type="button"
              className="p-2 -mr-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden py-3 border-t border-gray-200 dark:border-gray-700/50">
            <MobileNavLink href="/" onClick={() => setMobileMenuOpen(false)}><HomeIcon size={20} /><span>홈</span></MobileNavLink>
            <MobileNavLink href="/tools" onClick={() => setMobileMenuOpen(false)}><ToolsIcon size={20} /><span>도구</span></MobileNavLink>
            <MobileNavLink href="/chat" onClick={() => setMobileMenuOpen(false)}><span>☕</span><span>랜선 탕비실</span></MobileNavLink>
            <MobileNavLink href="/contact" onClick={() => setMobileMenuOpen(false)}><span>📩</span><span>문의하기</span></MobileNavLink>
          </nav>
        )}
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-all duration-200"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-2 py-3 text-base font-medium',
        'text-gray-700 dark:text-gray-300',
        'hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors',
        'min-h-[44px]'
      )}
    >
      {children}
    </Link>
  );
}
