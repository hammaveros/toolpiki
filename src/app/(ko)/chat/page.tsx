import type { Metadata } from 'next';
import { ChatRoom } from '@/components/chat/ChatRoom';

export const metadata: Metadata = {
  title: '랜선탕비실 - 익명 실시간 채팅',
  description: '잠깐 쉬어가세요. 익명으로 편하게 수다 떠는 온라인 탕비실.',
  keywords: ['랜선탕비실', '익명 채팅', '실시간 채팅', '쉬는 시간'],
};

export default function ChatPage() {
  return <ChatRoom />;
}
