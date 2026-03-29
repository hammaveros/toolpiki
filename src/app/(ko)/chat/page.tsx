'use client';

import { ChatRoom } from '@/components/chat/ChatRoom';

export default function ChatPage() {
  return (
    <div className="flex justify-center h-[calc(100vh-64px)]">
      <div className="w-full max-w-2xl">
        <ChatRoom />
      </div>
    </div>
  );
}
