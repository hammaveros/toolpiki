'use client';

import { useState } from 'react';
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

  // Focus 모드에서는 헤더 숨김
  if (focusMode) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-gray-900/80">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          {/* 로고 */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-gray-900 dark:text-white"
          >
            <span className="text-blue-600">{siteConfig.name}</span>
          </Link>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink href="/">
              <HomeIcon size={18} />
              <span>홈</span>
            </NavLink>
            <NavLink href="/tools">
              <ToolsIcon size={18} />
              <span>도구</span>
            </NavLink>
            <ThemeToggle isEnglish={false} />
          </nav>

          {/* 모바일: 테마 토글 + 메뉴 버튼 */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle isEnglish={false} />
            <button
              type="button"
              className="p-2 -mr-2 text-gray-600 dark:text-gray-400"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
            <MobileNavLink href="/" onClick={() => setMobileMenuOpen(false)}>
              <HomeIcon size={20} />
              <span>홈</span>
            </MobileNavLink>
            <MobileNavLink
              href="/tools"
              onClick={() => setMobileMenuOpen(false)}
            >
              <ToolsIcon size={20} />
              <span>도구</span>
            </MobileNavLink>
          </nav>
        )}
      </div>
    </header>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-2 py-3 text-base font-medium',
        'text-gray-700 dark:text-gray-300',
        'hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors',
        'min-h-[44px]' // 터치 타겟
      )}
    >
      {children}
    </Link>
  );
}
