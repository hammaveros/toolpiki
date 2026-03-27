'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState, useRef } from 'react';

type ThemeOption = 'light' | 'dark' | 'system';

const themeOptions: { value: ThemeOption; labelKr: string; labelEn: string; icon: React.ReactNode }[] = [
  {
    value: 'light',
    labelKr: '라이트',
    labelEn: 'Light',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    value: 'dark',
    labelKr: '다크',
    labelEn: 'Dark',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    ),
  },
  {
    value: 'system',
    labelKr: '시스템',
    labelEn: 'System',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
];

interface ThemeToggleProps {
  isEnglish?: boolean;
}

export function ThemeToggle({ isEnglish = false }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 외부 클릭시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ESC 키로 닫기
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  if (!mounted) {
    return (
      <button
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
        aria-label={isEnglish ? 'Theme' : '테마'}
      >
        <span className="w-5 h-5 block" />
      </button>
    );
  }

  const isDark = resolvedTheme === 'dark';
  const currentTheme = theme as ThemeOption || 'system';
  const currentOption = themeOptions.find(opt => opt.value === currentTheme) || themeOptions[2];

  const getCurrentIcon = () => {
    if (currentTheme === 'system') {
      // 시스템 테마일 때는 실제 적용된 테마 아이콘 표시
      return isDark ? themeOptions[1].icon : themeOptions[0].icon;
    }
    return currentOption.icon;
  };

  const getTooltip = () => {
    const label = isEnglish ? currentOption.labelEn : currentOption.labelKr;
    if (currentTheme === 'system') {
      const actual = isDark
        ? (isEnglish ? 'Dark' : '다크')
        : (isEnglish ? 'Light' : '라이트');
      return `${label} (${actual})`;
    }
    return label;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
        aria-label={isEnglish ? 'Change theme' : '테마 변경'}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        title={getTooltip()}
      >
        <span className="w-5 h-5 flex items-center justify-center">
          {getCurrentIcon()}
        </span>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 py-1 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
          role="listbox"
          aria-label={isEnglish ? 'Theme options' : '테마 옵션'}
        >
          {themeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setTheme(option.value);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                currentTheme === option.value
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              role="option"
              aria-selected={currentTheme === option.value}
            >
              {option.icon}
              <span>{isEnglish ? option.labelEn : option.labelKr}</span>
              {currentTheme === option.value && (
                <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
