import Link from 'next/link';

// 랜선 탕비실(실시간 익명 UGC)은 점검을 위해 임시 비활성화 상태입니다.
// 다시 열 때는 이 파일을 <ChatRoom />로 되돌리세요. (백업: 아래 주석 참고)
//   import { ChatRoom } from '@/components/chat/ChatRoom';
//   return <div className="flex justify-center h-[calc(100vh-64px)]"><div className="w-full max-w-2xl"><ChatRoom /></div></div>;
export default function ChatPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-5xl mb-4">☕</div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          랜선 탕비실은 잠시 쉬는 중이에요
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
          더 편하게 이용하실 수 있도록 점검 중입니다. 조금만 기다려 주세요.
          그동안 다른 도구들을 둘러보시는 건 어떠세요?
        </p>
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          도구 둘러보기 →
        </Link>
      </div>
    </div>
  );
}
