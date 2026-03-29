'use client';

import { useState, useCallback } from 'react';
import { generateNickname } from '@/lib/chat/nickname';

interface NicknameModalProps {
  onJoin: (nickname: { name: string; emoji: string }) => void;
}

export function NicknameModal({ onJoin }: NicknameModalProps) {
  const [nickname, setNickname] = useState(() => generateNickname());
  const [customMode, setCustomMode] = useState(false);
  const [customName, setCustomName] = useState('');

  const reroll = useCallback(() => {
    setNickname(generateNickname());
  }, []);

  const handleJoin = () => {
    if (customMode && customName.trim()) {
      onJoin({ name: customName.trim().slice(0, 10), emoji: '😊' });
    } else {
      onJoin(nickname);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-[#FAF6F1] dark:bg-[#1C1917] rounded-2xl p-6 w-full max-w-sm shadow-xl border border-[#E8DFD4] dark:border-[#3D3530]">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">☕</div>
          <h2 className="text-xl font-bold text-[#5C4A3A] dark:text-[#D4B896]">랜선 탕비실</h2>
          <p className="text-sm text-[#8B7B6B] dark:text-[#A89880] mt-1">잠깐 쉬어가세요</p>
        </div>

        {!customMode ? (
          <div className="text-center mb-6">
            <p className="text-xs text-[#8B7B6B] dark:text-[#A89880] mb-2">오늘의 닉네임</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">{nickname.emoji}</span>
              <span className="text-lg font-semibold text-[#5C4A3A] dark:text-[#D4B896]">{nickname.name}</span>
              <button
                onClick={reroll}
                className="p-1.5 rounded-full hover:bg-[#E8DFD4] dark:hover:bg-[#3D3530] transition-colors"
                aria-label="다시 뽑기"
              >
                🔄
              </button>
            </div>
            <button
              onClick={() => setCustomMode(true)}
              className="text-xs text-[#A89880] hover:text-[#8B7B6B] mt-2 underline underline-offset-2"
            >
              직접 입력할래요
            </button>
          </div>
        ) : (
          <div className="mb-6">
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value.slice(0, 10))}
              placeholder="닉네임 입력 (최대 10자)"
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#292524] border border-[#E8DFD4] dark:border-[#3D3530] text-[#5C4A3A] dark:text-[#D4B896] text-center text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A574]"
              autoFocus
            />
            <div className="flex justify-between mt-2">
              <button
                onClick={() => { setCustomMode(false); setCustomName(''); }}
                className="text-xs text-[#A89880] hover:text-[#8B7B6B] underline underline-offset-2"
              >
                랜덤으로 할래요
              </button>
              <span className="text-xs text-[#A89880]">{customName.length}/10</span>
            </div>
          </div>
        )}

        <button
          onClick={handleJoin}
          disabled={customMode && !customName.trim()}
          className="w-full py-3 rounded-xl bg-[#D4A574] hover:bg-[#C49564] disabled:opacity-40 text-white font-semibold transition-colors"
        >
          입장하기
        </button>
      </div>
    </div>
  );
}
