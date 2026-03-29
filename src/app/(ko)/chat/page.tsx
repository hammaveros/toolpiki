'use client';

import { ChatRoom } from '@/components/chat/ChatRoom';
import { AdSlot } from '@/components/ads/AdSlot';

export default function ChatPage() {
  return (
    <div className="flex justify-center gap-4 px-4 h-[calc(100vh-64px)]">
      {/* 왼쪽 광고 - PC만 */}
      <div className="hidden xl:flex flex-col items-center pt-4 w-[160px] flex-shrink-0">
        <AdSlot format="vertical" className="sticky top-20" />
      </div>

      {/* 채팅방 */}
      <div className="w-full max-w-2xl">
        <ChatRoom />
      </div>

      {/* 오른쪽 광고 - PC만 */}
      <div className="hidden xl:flex flex-col items-center pt-4 w-[160px] flex-shrink-0">
        <AdSlot format="vertical" className="sticky top-20" />
      </div>
    </div>
  );
}
