'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, where, Timestamp } from 'firebase/firestore';

interface WidgetMessage {
  id: string;
  text: string;
  nickname: string;
  emoji: string;
  type: string;
}

const FALLBACK_MESSAGES = [
  { id: 'f1', text: '점심 뭐 먹지...', nickname: '졸린판다', emoji: '🐼', type: 'message' },
  { id: 'f2', text: '커피 한 잔 더 마셔야겠다', nickname: '배고픈수달', emoji: '🦦', type: 'message' },
  { id: 'f3', text: '오늘 왜 이렇게 길어', nickname: '나른한냥', emoji: '🐱', type: 'message' },
  { id: 'f4', text: 'ㅋㅋㅋ 진짜', nickname: '심심한펭귄', emoji: '🐧', type: 'message' },
  { id: 'f5', text: '퇴근하고 뭐하지', nickname: '느긋한코알라', emoji: '🐨', type: 'message' },
];

export function ChatWidget() {
  const [messages, setMessages] = useState<WidgetMessage[]>(FALLBACK_MESSAGES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [onlineCount, setOnlineCount] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  // 실시간 메시지 구독
  useEffect(() => {
    try {
      const fiveMinAgo = Timestamp.fromDate(new Date(Date.now() - 5 * 60 * 1000));
      const q = query(
        collection(db, 'messages'),
        where('type', '==', 'message'),
        where('createdAt', '>', fiveMinAgo),
        orderBy('createdAt', 'desc'),
        limit(10),
      );

      const unsub = onSnapshot(q, (snapshot) => {
        if (snapshot.empty) return; // fallback 유지
        const msgs: WidgetMessage[] = [];
        snapshot.forEach((d) => {
          const data = d.data();
          msgs.push({ id: d.id, text: data.text, nickname: data.nickname, emoji: data.emoji, type: data.type });
        });
        if (msgs.length > 0) setMessages(msgs.reverse());
      }, () => {
        // 에러 시 fallback 유지
      });

      return () => unsub();
    } catch {
      // Firebase 초기화 실패 시 fallback 유지
    }
  }, []);

  // 접속자 수
  useEffect(() => {
    try {
      const thirtySecsAgo = Timestamp.fromDate(new Date(Date.now() - 30000));
      const q = query(
        collection(db, 'presence'),
        where('lastSeen', '>', thirtySecsAgo),
      );
      const unsub = onSnapshot(q, (snapshot) => {
        setOnlineCount(snapshot.size);
      }, () => {});
      return () => unsub();
    } catch {}
  }, []);

  // 메시지 로테이션
  useEffect(() => {
    if (messages.length === 0) return;
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % messages.length);
        setVisible(true);
      }, 500);
    }, 4000);
    return () => clearInterval(interval);
  }, [messages]);

  // 닫기 (24시간)
  useEffect(() => {
    const dismissedAt = localStorage.getItem('chat-widget-dismissed');
    if (dismissedAt && Date.now() - Number(dismissedAt) < 24 * 60 * 60 * 1000) {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('chat-widget-dismissed', String(Date.now()));
  };

  if (dismissed) return null;

  const current = messages[currentIndex];
  if (!current) return null;

  return (
    <div className="relative mx-auto max-w-4xl mb-6 px-4">
      <Link
        href="/chat"
        className="block bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-all group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">☕</span>
            <span className="font-semibold text-sm text-gray-900 dark:text-white">랜선 탕비실</span>
            {onlineCount > 0 && (
              <span className="text-[10px] bg-[#D4A574]/20 text-[#D4A574] px-2 py-0.5 rounded-full">
                🔴 {onlineCount}명
              </span>
            )}
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-xs text-gray-400 group-hover:text-blue-500 transition-colors">
              들어가기 →
            </span>
            <div className={`transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}>
              <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                <span>{current.emoji}</span>
                <span className="font-medium">{current.nickname}</span>
                <span className="text-gray-400 dark:text-gray-500 truncate max-w-[15ch]">{current.text}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>

      <button
        onClick={(e) => { e.preventDefault(); handleDismiss(); }}
        className="absolute top-2 right-6 p-1 text-[#C4B8A8] hover:text-[#8B7B6B] transition-colors"
        aria-label="닫기"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
