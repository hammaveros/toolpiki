'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { MenuIcon, CloseIcon, HomeIcon, ToolsIcon } from '@/components/icons';
import { ThemeToggle } from '@/components/ThemeToggle';

interface HeaderEnProps {
  focusMode?: boolean;
}

export function HeaderEn({ focusMode = false }: HeaderEnProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (focusMode) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-gray-900/80">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link
            href="/en"
            className="flex items-center gap-2 font-bold text-xl text-gray-900 dark:text-white"
          >
            <span className="text-blue-600">ToolPiki</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink href="/en">
              <HomeIcon size={18} />
              <span>Home</span>
            </NavLink>
            <NavLink href="/en/tools">
              <ToolsIcon size={18} />
              <span>Tools</span>
            </NavLink>
            <ThemeToggle isEnglish />
          </nav>

          {/* Mobile: Theme Toggle + Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle isEnglish />
            <button
              type="button"
              className="p-2 -mr-2 text-gray-600 dark:text-gray-400"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
            <MobileNavLink href="/en" onClick={() => setMobileMenuOpen(false)}>
              <HomeIcon size={20} />
              <span>Home</span>
            </MobileNavLink>
            <MobileNavLink
              href="/en/tools"
              onClick={() => setMobileMenuOpen(false)}
            >
              <ToolsIcon size={20} />
              <span>Tools</span>
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
        'min-h-[44px]'
      )}
    >
      {children}
    </Link>
  );
}
