'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  cooldown?: boolean;
  cooldownSeconds?: number;
}

export function ChatInput({ onSend, disabled, cooldown, cooldownSeconds = 0 }: ChatInputProps) {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [remainSec, setRemainSec] = useState(0);

  // 쿨다운 카운트다운
  useEffect(() => {
    if (cooldown && cooldownSeconds > 0) {
      setRemainSec(cooldownSeconds);
      const interval = setInterval(() => {
        setRemainSec(prev => {
          if (prev <= 1) { clearInterval(interval); return 0; }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setRemainSec(0);
    }
  }, [cooldown, cooldownSeconds]);

  // 포커스가 iframe(광고)으로 넘어가면 입력창으로 되돌리기
  useEffect(() => {
    const handleBlur = () => {
      setTimeout(() => {
        if (document.activeElement?.tagName === 'IFRAME') {
          inputRef.current?.focus();
        }
      }, 100);
    };
    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, []);

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || disabled || cooldown) return;
    onSend(trimmed);
    setText('');
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [text, disabled, cooldown, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const placeholder = cooldown && remainSec > 0
    ? `${remainSec}초 후 가능`
    : cooldown
      ? '잠시만요...'
      : '☕ 한마디 남기기...';

  return (
    <div className="border-t border-[#E8DFD4] dark:border-[#3D3530] bg-[#FAF6F1] dark:bg-[#1C1917] px-3 py-1.5">
      <div className="flex items-center gap-1.5">
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 200))}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || cooldown}
            autoFocus
            rows={1}
            className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-[#292524] border border-[#E8DFD4] dark:border-[#3D3530] text-sm text-[#5C4A3A] dark:text-[#D4B896] placeholder:text-[#C4B8A8] dark:placeholder:text-[#5C5048] resize-none focus:outline-none focus:ring-2 focus:ring-[#D4A574]/50 disabled:opacity-50"
            style={{ maxHeight: 80 }}
          />
          {text.length > 0 && (
            <span className={`absolute right-3 bottom-2 text-[10px] ${text.length > 180 ? 'text-red-400' : 'text-[#C4B8A8]'}`}>
              {text.length}/200
            </span>
          )}
        </div>
        <button
          onClick={handleSend}
          disabled={!text.trim() || disabled || cooldown}
          className="px-3 py-1.5 rounded-xl bg-[#D4A574] hover:bg-[#C49564] disabled:opacity-40 text-white text-sm font-medium transition-colors flex-shrink-0"
        >
          {cooldown && remainSec > 0 ? `${remainSec}s` : '전송'}
        </button>
      </div>
    </div>
  );
}
