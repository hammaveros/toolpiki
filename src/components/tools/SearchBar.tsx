'use client';

import { useCallback } from 'react';
import { SearchIcon } from '@/components/icons';
import { cn } from '@/lib/utils/cn';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

/**
 * 도구 검색 바
 */
export function SearchBar({
  placeholder = '도구 검색...',
  value = '',
  onChange,
}: SearchBarProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.value);
    },
    [onChange]
  );

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
  }, []);

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      <SearchIcon
        size={20}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="search"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn(
          'w-full pl-10 pr-4 py-2.5 rounded-lg border transition-colors',
          'bg-white dark:bg-gray-900',
          'border-gray-300 dark:border-gray-600',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'placeholder:text-gray-400 dark:placeholder:text-gray-500',
          'text-gray-900 dark:text-gray-100',
          'min-h-[44px]'
        )}
      />
    </form>
  );
}
