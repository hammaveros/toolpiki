'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { db, auth } from '@/lib/firebase';
import { signInAnonymously } from 'firebase/auth';
import {
  collection, addDoc, query, orderBy, limit, onSnapshot,
  serverTimestamp, where, Timestamp, doc, setDoc, deleteDoc,
} from 'firebase/firestore';
import { filterMessage } from '@/lib/chat/filter';
import { getSavedNickname, saveNickname } from '@/lib/chat/nickname';
import { getRandomAmbient, getRandomInteraction, HEADER_QUOTES } from '@/lib/chat/ambient';
import { NicknameModal } from './NicknameModal';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

interface Message {
  id: string;
  text: string;
  nickname: string;
  emoji: string;
  uid: string;
  type: 'message' | 'system' | 'ambient' | 'interaction';
  createdAt: Timestamp | null;
}

export function ChatRoom() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [nickname, setNickname] = useState<{ name: string; emoji: string } | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  const [joined, setJoined] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const [headerQuote, setHeaderQuote] = useState('');
  const [toast, setToast] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMsgsRef = useRef<string[]>([]);
  const ambientTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // 헤더 문구 로테이션
  useEffect(() => {
    setHeaderQuote(HEADER_QUOTES[Math.floor(Math.random() * HEADER_QUOTES.length)]);
    const interval = setInterval(() => {
      setHeaderQuote(HEADER_QUOTES[Math.floor(Math.random() * HEADER_QUOTES.length)]);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Firebase 익명 로그인 + 저장된 닉네임 자동 입장
  useEffect(() => {
    signInAnonymously(auth).then((cred) => {
      setUid(cred.user.uid);
      const saved = getSavedNickname();
      if (saved) {
        setNickname(saved);
        setJoined(true);
      }
    });
  }, []);

  // 메시지 실시간 구독
  useEffect(() => {
    const twentyFourHoursAgo = Timestamp.fromDate(new Date(Date.now() - 24 * 60 * 60 * 1000));
    const q = query(
      collection(db, 'messages'),
      where('createdAt', '>', twentyFourHoursAgo),
      orderBy('createdAt', 'asc'),
      limit(100),
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = [];
      snapshot.forEach((d) => {
        msgs.push({ id: d.id, ...d.data() } as Message);
      });
      setMessages(msgs);
    });

    return () => unsub();
  }, []);

  // 접속자 수 실시간
  useEffect(() => {
    if (!uid || !joined) return;

    // presence 등록
    const presenceRef = doc(db, 'presence', uid);
    setDoc(presenceRef, {
      nickname: nickname?.name || '???',
      lastSeen: serverTimestamp(),
    });

    // 주기적 업데이트
    const interval = setInterval(() => {
      setDoc(presenceRef, {
        nickname: nickname?.name || '???',
        lastSeen: serverTimestamp(),
      });
    }, 15000);

    // presence 구독
    const thirtySecsAgo = Timestamp.fromDate(new Date(Date.now() - 30000));
    const q = query(
      collection(db, 'presence'),
      where('lastSeen', '>', thirtySecsAgo),
    );
    const unsub = onSnapshot(q, (snapshot) => {
      setOnlineCount(snapshot.size);
    });

    // 퇴장 시 삭제
    const handleUnload = () => {
      deleteDoc(presenceRef);
    };
    window.addEventListener('beforeunload', handleUnload);

    return () => {
      clearInterval(interval);
      unsub();
      window.removeEventListener('beforeunload', handleUnload);
      deleteDoc(presenceRef);
    };
  }, [uid, joined, nickname]);

  // 자동 스크롤 (하단 근처일 때만)
  const chatContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
    if (isNearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 분위기 메시지 (30초 이상 새 메시지 없으면)
  useEffect(() => {
    if (!joined) return;

    const resetAmbientTimer = () => {
      if (ambientTimerRef.current) clearTimeout(ambientTimerRef.current);
      ambientTimerRef.current = setTimeout(() => {
        const ambient = getRandomAmbient();
        setMessages((prev) => [...prev, {
          id: `ambient-${Date.now()}`,
          text: `${ambient.emoji} ${ambient.text}`,
          nickname: '',
          emoji: '',
          uid: '',
          type: 'ambient',
          createdAt: null,
        }]);
      }, 30000);
    };

    resetAmbientTimer();
    // 새 메시지 올 때마다 리셋
    return () => {
      if (ambientTimerRef.current) clearTimeout(ambientTimerRef.current);
    };
  }, [joined, messages.length]);

  // 퇴근 카운트다운
  const [countdown, setCountdown] = useState('');
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setHours(18, 0, 0, 0);

      if (now >= endOfDay) {
        setCountdown('🎉 퇴근 축하!');
      } else {
        const diff = endOfDay.getTime() - now.getTime();
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setCountdown(`⏰ 퇴근까지 ${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
      }
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // 입장 처리
  const handleJoin = useCallback(async (nick: { name: string; emoji: string }) => {
    setNickname(nick);
    saveNickname(nick);
    setJoined(true);

    if (uid) {
      await addDoc(collection(db, 'messages'), {
        text: `🌿 ${nick.emoji} ${nick.name} 님이 탕비실에 들어왔어요`,
        nickname: nick.name,
        emoji: nick.emoji,
        uid,
        type: 'system',
        createdAt: serverTimestamp(),
      });
    }
  }, [uid]);

  // 메시지 전송
  const handleSend = useCallback(async (text: string) => {
    if (!uid || !nickname || cooldown) return;

    // 도배 체크
    lastMsgsRef.current.push(text);
    if (lastMsgsRef.current.length > 3) lastMsgsRef.current.shift();
    if (lastMsgsRef.current.length >= 3 && lastMsgsRef.current.every((m) => m === text)) {
      setToast('같은 말 그만! 😅');
      setCooldown(true);
      setTimeout(() => setCooldown(false), 30000);
      setTimeout(() => setToast(''), 3000);
      return;
    }

    const { filtered, blocked, reason } = filterMessage(text);
    if (blocked) {
      setToast(reason || '전송 불가');
      setTimeout(() => setToast(''), 3000);
      return;
    }

    await addDoc(collection(db, 'messages'), {
      text: filtered,
      nickname: nickname.name,
      emoji: nickname.emoji,
      uid,
      type: 'message',
      createdAt: serverTimestamp(),
    });

    // 2초 쿨다운
    setCooldown(true);
    setTimeout(() => setCooldown(false), 2000);
  }, [uid, nickname, cooldown]);

  // 인터랙션: 커피 내리기
  const handleCoffee = useCallback(async () => {
    if (!uid || !nickname || cooldown) return;
    const msg = getRandomInteraction('coffee');

    await addDoc(collection(db, 'messages'), {
      text: msg,
      nickname: nickname.name,
      emoji: nickname.emoji,
      uid,
      type: 'interaction',
      createdAt: serverTimestamp(),
    });

    setCooldown(true);
    setTimeout(() => setCooldown(false), 3000);
  }, [uid, nickname, cooldown]);

  // 간식 카운터
  const [snackCount, setSnackCount] = useState(() => {
    if (typeof window === 'undefined') return 0;
    return Number(localStorage.getItem('tangbisil-snack-count') || '0');
  });

  // 인터랙션: 간식 훔치기
  const handleSnack = useCallback(async () => {
    if (!uid || !nickname || cooldown) return;
    const newCount = snackCount + 1;
    setSnackCount(newCount);
    localStorage.setItem('tangbisil-snack-count', String(newCount));

    const msg = getRandomInteraction('snack');

    await addDoc(collection(db, 'messages'), {
      text: `${msg} (${newCount}번째 간식 훔치기!)`,
      nickname: nickname.name,
      emoji: nickname.emoji,
      uid,
      type: 'interaction',
      createdAt: serverTimestamp(),
    });

    setCooldown(true);
    setTimeout(() => setCooldown(false), 3000);
  }, [uid, nickname, cooldown, snackCount]);

  // 시간 포맷
  const formatTime = (ts: Timestamp | null) => {
    if (!ts) return '';
    const d = ts.toDate();
    const h = d.getHours();
    const m = String(d.getMinutes()).padStart(2, '0');
    return `${h >= 12 ? '오후' : '오전'} ${h > 12 ? h - 12 : h || 12}:${m}`;
  };

  // 닉네임 모달 (저장된 닉네임 없을 때만)
  if (!joined && uid) {
    return <NicknameModal onJoin={handleJoin} />;
  }

  if (!uid) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-pulse">☕</div>
          <p className="text-sm text-[#A89880]">탕비실 여는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] max-w-2xl mx-auto bg-[#FAF6F1] dark:bg-[#1C1917] fixed inset-0 z-40">
      {/* 헤더 */}
      <div className="border-b border-[#E8DFD4] dark:border-[#3D3530] px-4 py-3 text-center flex-shrink-0">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-lg">☕</span>
          <h1 className="text-lg font-bold text-[#5C4A3A] dark:text-[#D4B896]">랜선탕비실</h1>
        </div>
        <div className="flex items-center justify-center gap-3 text-xs text-[#A89880] dark:text-[#6B5E50]">
          <span>🫧 {onlineCount}명 접속 중</span>
          <span>·</span>
          <span>{countdown}</span>
        </div>
        <p className="text-[10px] text-[#C4B8A8] dark:text-[#5C5048] mt-1 transition-opacity duration-500">
          &quot;{headerQuote}&quot;
        </p>
      </div>

      {/* 메시지 영역 */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-0.5 scroll-smooth">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-[#C4B8A8] dark:text-[#5C5048]">
            <span className="text-3xl mb-2">🫧</span>
            <p className="text-sm">아직 조용해요...</p>
            <p className="text-xs mt-1">첫 마디를 남겨보세요</p>
          </div>
        )}
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            nickname={msg.nickname}
            emoji={msg.emoji}
            text={msg.text}
            time={formatTime(msg.createdAt)}
            isMine={msg.uid === uid}
            type={msg.type}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 인터랙션 버튼 */}
      <div className="flex justify-center gap-2 px-4 py-2 border-t border-[#E8DFD4] dark:border-[#3D3530]">
        <button
          onClick={handleCoffee}
          disabled={cooldown}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#E8DFD4] dark:bg-[#3D3530] text-xs text-[#8B7B6B] dark:text-[#A89880] hover:bg-[#DDD2C4] dark:hover:bg-[#4D4540] transition-colors disabled:opacity-40"
        >
          ☕ 커피 내리기
        </button>
        <button
          onClick={handleSnack}
          disabled={cooldown}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#E8DFD4] dark:bg-[#3D3530] text-xs text-[#8B7B6B] dark:text-[#A89880] hover:bg-[#DDD2C4] dark:hover:bg-[#4D4540] transition-colors disabled:opacity-40"
        >
          🍪 간식 훔치기{snackCount > 0 && ` (${snackCount})`}
        </button>
      </div>

      {/* 입력창 */}
      <ChatInput onSend={handleSend} cooldown={cooldown} />

      {/* 토스트 */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-[#5C4A3A] text-white text-sm px-4 py-2 rounded-full shadow-lg animate-fade-in z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
