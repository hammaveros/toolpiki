'use client';

interface ChatMessageProps {
  nickname: string;
  emoji: string;
  text: string;
  time: string;
  isMine: boolean;
  type: 'message' | 'system' | 'ambient' | 'interaction';
}

export function ChatMessage({ nickname, emoji, text, time, isMine, type }: ChatMessageProps) {
  // 시스템/분위기 메시지
  if (type === 'system' || type === 'ambient') {
    return (
      <div className="flex justify-center my-2 animate-fade-in">
        <span className="text-xs text-[#A89880] dark:text-[#6B5E50] bg-[#F0E8DE]/60 dark:bg-[#292524]/60 px-3 py-1 rounded-full">
          {text}
        </span>
      </div>
    );
  }

  // 인터랙션 메시지 (커피, 간식)
  if (type === 'interaction') {
    return (
      <div className="flex justify-center my-2 animate-fade-in">
        <span className="text-xs text-[#8B7B6B] dark:text-[#A89880] bg-[#E8DFD4]/40 dark:bg-[#3D3530]/40 px-3 py-1.5 rounded-full">
          <span className="font-medium">{emoji} {nickname}</span> {text}
        </span>
      </div>
    );
  }

  // 내 메시지
  if (isMine) {
    return (
      <div className="flex justify-end mb-3 animate-fade-in">
        <div className="max-w-[75%]">
          <div className="flex items-center justify-end gap-1 mb-0.5">
            <span className="text-xs font-medium text-[#D4A574] dark:text-[#D4A574]/80">{nickname}</span>
            <span className="text-sm">{emoji}</span>
          </div>
          <div className="flex items-end gap-1.5 justify-end">
            <div className="bg-[#D4A574]/20 dark:bg-[#D4A574]/10 border border-[#D4A574]/30 dark:border-[#D4A574]/20 px-3.5 py-2 rounded-2xl rounded-br-md">
              <p className="text-sm text-[#5C4A3A] dark:text-[#D4B896] break-words whitespace-pre-wrap">{text}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 남 메시지
  return (
    <div className="flex justify-start mb-3 animate-fade-in">
      <div className="max-w-[75%]">
        <div className="flex items-center gap-1 mb-0.5">
          <span className="text-sm">{emoji}</span>
          <span className="text-xs font-medium text-[#8B7B6B] dark:text-[#A89880]">{nickname}</span>
        </div>
        <div className="flex items-end gap-1.5">
          <div className="bg-white dark:bg-[#292524] border border-[#E8DFD4] dark:border-[#3D3530] px-3.5 py-2 rounded-2xl rounded-bl-md">
            <p className="text-sm text-[#5C4A3A] dark:text-[#D4B896] break-words whitespace-pre-wrap">{text}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
