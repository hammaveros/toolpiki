import { memo } from 'react';
import Link from 'next/link';
import type { ToolMeta } from '@/types';
import { cn } from '@/lib/utils/cn';

interface ToolCardProps {
  tool: ToolMeta;
  compact?: boolean;
  showRemove?: boolean;
  onRemove?: () => void;
  basePath?: string;
}

const CATEGORY_BORDER: Record<string, string> = {
  text: 'border-l-blue-500',
  encoding: 'border-l-purple-500',
  formatter: 'border-l-emerald-500',
  image: 'border-l-amber-500',
  color: 'border-l-pink-500',
  calculator: 'border-l-cyan-500',
  fun: 'border-l-orange-500',
};

const CATEGORY_ICON_BG: Record<string, string> = {
  text: 'bg-blue-50 dark:bg-blue-900/20',
  encoding: 'bg-purple-50 dark:bg-purple-900/20',
  formatter: 'bg-emerald-50 dark:bg-emerald-900/20',
  image: 'bg-amber-50 dark:bg-amber-900/20',
  color: 'bg-pink-50 dark:bg-pink-900/20',
  calculator: 'bg-cyan-50 dark:bg-cyan-900/20',
  fun: 'bg-orange-50 dark:bg-orange-900/20',
};

export const ToolCard = memo(function ToolCard({ tool, compact = false, showRemove = false, onRemove, basePath = '/tools' }: ToolCardProps) {
  const isExternal = !!tool.externalUrl;
  const href = tool.externalUrl || `${basePath}/${tool.slug}`;
  const borderColor = CATEGORY_BORDER[tool.category] || 'border-l-gray-400';
  const iconBg = CATEGORY_ICON_BG[tool.category] || 'bg-gray-100 dark:bg-gray-800';
  const linkProps = isExternal ? { target: '_blank' as const, rel: 'noopener noreferrer' } : {};

  const specialStyles = tool.isSpecial
    ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-400 text-white hover:from-purple-600 hover:to-pink-600'
    : '';

  if (compact) {
    return (
      <div className="relative group">
        <Link
          href={href}
          {...linkProps}
          className={cn(
            'flex items-center gap-3 p-3 rounded-xl border-l-[3px] border border-gray-200 dark:border-[var(--border-subtle)] transition-all duration-200',
            tool.isSpecial
              ? specialStyles
              : cn(
                  borderColor,
                  'bg-white dark:bg-[var(--bg-surface)]',
                  'hover:-translate-y-0.5 hover:shadow-md dark:hover:shadow-black/20',
                  'hover:bg-gray-50 dark:hover:bg-[var(--bg-elevated)]'
                ),
            showRemove && ''
          )}
        >
          <span
            className={cn(
              'w-9 h-9 flex items-center justify-center rounded-lg text-lg flex-shrink-0',
              tool.isSpecial ? 'bg-white/20' : iconBg,
              tool.slug === 'shell-game' && 'rotate-180'
            )}
            role="img"
            aria-hidden="true"
          >
            {tool.icon}
          </span>
          <span className={cn('font-medium text-sm truncate', tool.isSpecial ? 'text-white' : 'text-gray-900 dark:text-white')}>
            {tool.name}
            {isExternal && <span className="ml-1 text-xs opacity-50">↗</span>}
          </span>
          {!tool.isSpecial && (
            <span className="ml-auto text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity text-xs flex-shrink-0 self-center">→</span>
          )}
        </Link>
      </div>
    );
  }

  return (
    <div className="relative group">
      <Link
        href={href}
        {...linkProps}
        className={cn(
          'block p-4 rounded-xl border-l-[3px] border border-gray-200 dark:border-[var(--border-subtle)] transition-all duration-200',
          tool.isSpecial
            ? specialStyles
            : cn(
                borderColor,
                'bg-white dark:bg-[var(--bg-surface)]',
                'hover:-translate-y-0.5 hover:shadow-md dark:hover:shadow-black/20',
                'hover:bg-gray-50 dark:hover:bg-[var(--bg-elevated)]'
              )
        )}
      >
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'w-10 h-10 flex items-center justify-center rounded-lg text-xl flex-shrink-0',
              tool.isSpecial ? 'bg-white/20' : iconBg,
              tool.slug === 'shell-game' && 'rotate-180'
            )}
            role="img"
            aria-hidden="true"
          >
            {tool.icon}
          </span>
          <h3 className={cn('font-medium', tool.isSpecial ? 'text-white' : 'text-gray-900 dark:text-white')}>
            {tool.name}
            {isExternal && <span className="ml-1 text-xs opacity-50">↗</span>}
          </h3>
          <span className="ml-auto text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity text-sm flex-shrink-0">→</span>
        </div>
      </Link>
    </div>
  );
});
