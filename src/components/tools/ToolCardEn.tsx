import Link from 'next/link';
import type { ToolMeta } from '@/types';
import { cn } from '@/lib/utils/cn';

interface ToolCardEnProps {
  tool: ToolMeta;
  compact?: boolean;
  showRemove?: boolean;
  onRemove?: () => void;
}

/**
 * EN Tool Card Component
 */
export function ToolCardEn({
  tool,
  compact = false,
  showRemove = false,
  onRemove,
}: ToolCardEnProps) {
  const isExternal = !!tool.externalUrl;
  const href = tool.externalUrl
    ? tool.externalUrl
    : `/en/tools/${tool.slug}`;

  // Special styles (Game Center etc.)
  const specialStyles = tool.isSpecial
    ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-400 text-white hover:from-purple-600 hover:to-pink-600'
    : '';

  // Link common props
  const linkProps = isExternal
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {};

  if (compact) {
    return (
      <div className="relative group flex items-center gap-1">
        <Link
          href={href}
          {...linkProps}
          className={cn(
            'flex-1 flex items-center gap-3 p-3 rounded-lg border transition-all',
            tool.isSpecial
              ? specialStyles
              : cn(
                  'bg-white dark:bg-gray-800',
                  'border-gray-200 dark:border-gray-700',
                  'hover:border-blue-300 dark:hover:border-blue-700',
                  'hover:bg-blue-50 dark:hover:bg-blue-900/20'
                ),
            showRemove && 'pr-8'
          )}
        >
          <span
            className={cn(
              'text-xl flex-shrink-0',
              tool.slug === 'shell-game-en' && 'inline-block rotate-180'
            )}
            role="img"
            aria-hidden="true"
          >
            {tool.icon}
          </span>
          <span
            className={cn(
              'font-medium truncate',
              tool.isSpecial
                ? 'text-white'
                : 'text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'
            )}
          >
            {tool.name}
            {isExternal && <span className="ml-1 text-xs opacity-70">↗</span>}
          </span>
        </Link>
        {/* Remove button (Recent) - inside card, right side */}
        {showRemove && onRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove();
            }}
            className={cn(
              'absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded transition-colors',
              'text-gray-400 hover:text-red-500'
            )}
            aria-label="Remove"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative group">
      <Link
        href={href}
        {...linkProps}
        className={cn(
          'block p-4 rounded-xl border transition-all',
          tool.isSpecial
            ? specialStyles
            : cn(
                'bg-white dark:bg-gray-800',
                'border-gray-200 dark:border-gray-700',
                'hover:border-blue-300 dark:hover:border-blue-700',
                'hover:shadow-md dark:hover:shadow-blue-900/20'
              )
        )}
      >
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'text-2xl flex-shrink-0',
              tool.slug === 'shell-game-en' && 'inline-block rotate-180'
            )}
            role="img"
            aria-hidden="true"
          >
            {tool.icon}
          </span>
          <h3
            className={cn(
              'font-medium',
              tool.isSpecial
                ? 'text-white'
                : 'text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'
            )}
          >
            {tool.name}
            {isExternal && <span className="ml-1 text-xs opacity-70">↗</span>}
          </h3>
        </div>
      </Link>
    </div>
  );
}
