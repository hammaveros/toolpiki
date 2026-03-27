'use client';

import { useState, useCallback } from 'react';
import { copyToClipboard } from '@/lib/utils/clipboard';

interface UseCopyToClipboardReturn {
  copied: boolean;
  copy: (text: string) => Promise<boolean>;
}

/**
 * 클립보드 복사 훅
 */
export function useCopyToClipboard(
  resetDelay = 2000
): UseCopyToClipboardReturn {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      const success = await copyToClipboard(text);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), resetDelay);
      }
      return success;
    },
    [resetDelay]
  );

  return { copied, copy };
}
