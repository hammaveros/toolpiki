'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';

type Difficulty = 'easy' | 'normal' | 'hard';
type GameMode = 'survival' | 'timeattack' | 'sentence';

// 긴 글 연습용 텍스트들
interface LongText {
  id: string;
  title: string;
  lines: string[];
}

const LONG_TEXTS: LongText[] = [
  {
    id: 'aegukga',
    title: '🇰🇷 애국가',
    lines: [
      "동해물과 백두산이 마르고 닳도록",
      "하느님이 보우하사 우리나라 만세",
      "무궁화 삼천리 화려강산",
      "대한사람 대한으로 길이 보전하세",
      "남산 위에 저 소나무 철갑을 두른 듯",
      "바람서리 불변함은 우리 기상일세",
      "무궁화 삼천리 화려강산",
      "대한사람 대한으로 길이 보전하세",
      "가을 하늘 공활한데 높고 구름 없이",
      "밝은 달은 우리 가슴 일편단심일세",
      "무궁화 삼천리 화려강산",
      "대한사람 대한으로 길이 보전하세",
      "이 기상과 이 맘으로 충성을 다하여",
      "괴로우나 즐거우나 나라 사랑하세",
      "무궁화 삼천리 화려강산",
      "대한사람 대한으로 길이 보전하세",
    ],
  },
  {
    id: 'hunminjeongeum',
    title: '📜 훈민정음 서문',
    lines: [
      "나랏말이 중국과 달라",
      "문자와 서로 통하지 아니하므로",
      "이런 까닭으로 어리석은 백성이",
      "이르고자 할 바가 있어도",
      "마침내 제 뜻을 능히 펴지 못하는 사람이 많다",
      "내가 이를 위하여 가엾이 여겨",
      "새로 스물여덟 자를 만드노니",
      "사람마다 하여금 쉬이 익혀",
      "날로 씀에 편안케 하고자 할 따름이다",
    ],
  },
  {
    id: 'azalea',
    title: '🌸 진달래꽃 - 김소월',
    lines: [
      "나 보기가 역겨워 가실 때에는",
      "말없이 고이 보내 드리우리다",
      "영변에 약산 진달래꽃",
      "아름 따다 가실 길에 뿌리우리다",
      "가시는 걸음걸음 놓인 그 꽃을",
      "사뿐히 즈려밟고 가시옵소서",
      "나 보기가 역겨워 가실 때에는",
      "죽어도 아니 눈물 흘리우리다",
    ],
  },
  {
    id: 'foreword',
    title: '📖 서시 - 윤동주',
    lines: [
      "죽는 날까지 하늘을 우러러",
      "한 점 부끄럼이 없기를",
      "잎새에 이는 바람에도",
      "나는 괴로워했다",
      "별을 노래하는 마음으로",
      "모든 죽어가는 것을 사랑해야지",
      "그리고 나한테 주어진 길을",
      "걸어가야겠다",
      "오늘 밤에도 별이 바람에 스치운다",
    ],
  },
  {
    id: 'road',
    title: '🛤️ 가지 않은 길 - 로버트 프로스트',
    lines: [
      "노란 숲 속에 길이 두 갈래로 났었습니다",
      "나는 두 길을 다 가지 못하는 것을 안타깝게 생각하면서",
      "오랫동안 서서 한 길이 굽어 꺾여 내려간 데까지",
      "바라다볼 수 있는 데까지 멀리 바라다보았습니다",
      "그리고 똑같이 아름다운 다른 길을 택했습니다",
      "그 길에는 풀이 더 있고 사람이 걸은 자취가 적어",
      "아마 더 걸어야 될 길이라고 나는 생각했던 게지요",
      "그 길을 걸으므로 해서 두 길은 거의 같아졌지만",
      "훗날에 나는 어디선가 한숨을 쉬며 이야기할 것입니다",
      "숲 속에 두 갈래 길이 있었다고",
      "나는 사람이 적게 간 길을 택하였다고",
      "그리고 그것 때문에 모든 것이 달라졌다고",
    ],
  },
  {
    id: 'developer',
    title: '💻 개발자 명언',
    lines: [
      "먼저 문제를 풀고, 그 다음에 코드를 작성하라.",
      "좋은 코드는 그 자체로 최고의 문서다.",
      "프로그래밍은 생각하는 것이지 타이핑하는 것이 아니다.",
      "버그를 찾는 것은 버그를 고치는 것보다 두 배 어렵다.",
      "단순함이 궁극의 정교함이다.",
      "코드는 한 번 작성되지만 수백 번 읽힌다.",
      "완벽한 것은 더할 것이 없을 때가 아니라 뺄 것이 없을 때 달성된다.",
      "측정할 수 없으면 개선할 수 없다.",
      "일찍 실패하고, 자주 실패하라.",
      "오늘의 삽질이 내일의 실력이다.",
    ],
  },
  {
    id: 'life',
    title: '🌱 인생 명언',
    lines: [
      "천 리 길도 한 걸음부터 시작한다.",
      "실패는 성공의 어머니다.",
      "오늘 할 수 있는 일을 내일로 미루지 마라.",
      "배움에는 끝이 없다.",
      "작은 것에도 최선을 다하라.",
      "포기하지 않는 한 실패란 없다.",
      "시간은 금이다.",
      "뜻이 있는 곳에 길이 있다.",
      "고생 끝에 낙이 온다.",
      "꾸준함이 천재를 이긴다.",
    ],
  },
];

// 저작권 없는 짧은 단어/문장들
const WORDS = {
  easy: [
    '사과', '바나나', '포도', '딸기', '수박',
    '컴퓨터', '키보드', '마우스', '모니터', '스피커',
    '학교', '회사', '병원', '공원', '도서관',
    '빨강', '파랑', '노랑', '초록', '보라',
    '커피', '우유', '주스', '물', '차',
    '봄', '여름', '가을', '겨울', '눈',
    '바람', '구름', '하늘', '별', '달',
    '고양이', '강아지', '토끼', '새', '물고기',
    '책', '연필', '지우개', '공책', '가방',
    '시계', '안경', '모자', '신발', '양말',
  ],
  normal: [
    '프로그래밍', '알고리즘', '데이터베이스', '네트워크', '운영체제',
    '스마트폰', '노트북', '태블릿', '이어폰', '충전기',
    '인터넷', '소프트웨어', '하드웨어', '메모리', '프로세서',
    '자바스크립트', '타입스크립트', '리액트', '서버', '클라이언트',
    '아침 식사', '점심 시간', '저녁 노을', '밤하늘 별', '새벽 공기',
    '열심히 공부', '꾸준히 운동', '건강한 식단', '충분한 수면', '규칙적 생활',
    '행복한 하루', '즐거운 주말', '설레는 여행', '따뜻한 커피', '시원한 바람',
  ],
  hard: [
    '소프트웨어 개발자', '인공지능 기술', '머신러닝 알고리즘',
    '클라우드 컴퓨팅', '사이버 보안', '데이터 분석가',
    '사용자 경험 디자인', '반응형 웹사이트', '모바일 애플리케이션',
    '오픈소스 프로젝트', '버전 관리 시스템', '지속적 통합 배포',
    '꾸준함이 힘이다', '작은 것이 아름답다', '시작이 반이다',
    '천 리 길도 한 걸음부터', '뜻이 있는 곳에 길이 있다',
    '오늘 할 일을 내일로 미루지 말자', '노력은 배신하지 않는다',
  ],
};

interface FallingWord {
  id: number;
  text: string;
  x: number;
  y: number;
  speed: number;
}

const GAME_HEIGHT = 500;
const INITIAL_SPEEDS: Record<Difficulty, number> = { easy: 0.08, normal: 0.15, hard: 0.25 };
const SPEED_INCREASE: Record<Difficulty, number> = { easy: 0.004, normal: 0.008, hard: 0.015 };
const SPAWN_INTERVALS: Record<Difficulty, number> = { easy: 3500, normal: 3000, hard: 2500 };
const TIME_ATTACK_DURATION = 60; // 60초
// 문장 모드 UI 컴포넌트
interface SentenceModeUIProps {
  selectedText: LongText;
  sentenceIndex: number;
  sentenceInput: string;
  sentenceStats: {
    totalChars: number;
    correctChars: number;
    startTime: number;
    completedSentences: number;
  };
  sentenceInputRef: React.RefObject<HTMLInputElement | null>;
  setSentenceInput: (value: string) => void;
  setSentenceIndex: (value: number) => void;
  setSentenceStats: React.Dispatch<React.SetStateAction<{
    totalChars: number;
    correctChars: number;
    startTime: number;
    completedSentences: number;
  }>>;
  endGame: () => void;
  goToIdle: () => void;
}

function SentenceModeUI({
  selectedText,
  sentenceIndex,
  sentenceInput,
  sentenceStats,
  sentenceInputRef,
  setSentenceInput,
  setSentenceIndex,
  setSentenceStats,
  endGame,
  goToIdle,
}: SentenceModeUIProps) {
  const currentSentence = selectedText.lines[sentenceIndex] || '';
  const totalLines = selectedText.lines.length;
  const VISIBLE_LINES = 5; // 한 화면에 보여줄 줄 수

  // 보여줄 줄 범위 계산 (현재 줄 중심으로 5줄)
  const getVisibleRange = () => {
    const halfVisible = Math.floor(VISIBLE_LINES / 2);
    let start = Math.max(0, sentenceIndex - halfVisible);
    let end = Math.min(totalLines, start + VISIBLE_LINES);
    // 끝에 도달하면 시작점 조정
    if (end - start < VISIBLE_LINES && start > 0) {
      start = Math.max(0, end - VISIBLE_LINES);
    }
    return { start, end };
  };

  const { start: visibleStart, end: visibleEnd } = getVisibleRange();

  // 타수 계산
  const calculateWPM = () => {
    if (!sentenceStats.startTime) return 0;
    const minutes = (Date.now() - sentenceStats.startTime) / 60000;
    if (minutes < 0.1) return 0;
    return Math.round(sentenceStats.totalChars / minutes);
  };

  // 정확도 계산
  const calculateAccuracy = () => {
    if (sentenceStats.totalChars === 0) return 100;
    return Math.round((sentenceStats.correctChars / sentenceStats.totalChars) * 100);
  };

  // 실시간 글자 비교 (특정 줄)
  const renderLineWithHighlight = (lineIndex: number) => {
    const line = selectedText.lines[lineIndex] || '';
    const isCurrent = lineIndex === sentenceIndex;
    const isPast = lineIndex < sentenceIndex;

    return line.split('').map((char: string, idx: number) => {
      let className = '';

      if (isPast) {
        // 이미 완료한 줄은 연하게
        className = 'text-gray-300 dark:text-gray-600';
      } else if (isCurrent) {
        // 현재 줄
        if (idx < sentenceInput.length) {
          if (sentenceInput[idx] === char) {
            className = 'text-green-600 dark:text-green-400'; // 맞음
          } else {
            className = 'text-red-500 bg-red-100 dark:bg-red-900/30'; // 틀림
          }
        } else if (idx === sentenceInput.length) {
          className = 'text-gray-900 dark:text-white bg-blue-100 dark:bg-blue-900/50'; // 현재 커서
        } else {
          className = 'text-gray-700 dark:text-gray-300'; // 아직 입력 안함
        }
      } else {
        // 아직 안 한 줄
        className = 'text-gray-400 dark:text-gray-500';
      }

      return (
        <span key={idx} className={className}>
          {char}
        </span>
      );
    });
  };

  // 줄 완료 시 정확도 계산 (최종 입력 기준)
  const completeLine = (inputText: string) => {
    let correctCount = 0;
    const len = Math.min(inputText.length, currentSentence.length);
    for (let i = 0; i < len; i++) {
      if (inputText[i] === currentSentence[i]) correctCount++;
    }

    setSentenceStats(prev => ({
      ...prev,
      totalChars: prev.totalChars + currentSentence.length,
      correctChars: prev.correctChars + correctCount,
      completedSentences: prev.completedSentences + 1,
    }));

    if (sentenceIndex + 1 >= totalLines) {
      endGame();
    } else {
      setSentenceIndex(sentenceIndex + 1);
      setTimeout(() => {
        if (sentenceInputRef.current) {
          sentenceInputRef.current.blur();
          sentenceInputRef.current.value = '';
          setSentenceInput('');
          sentenceInputRef.current.focus();
        }
      }, 10);
    }
  };

  // 입력 처리 (IME 조합 완료 후에만 처리)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInput = e.target.value;
    setSentenceInput(newInput);

    // 자동 다음 줄 (현재 줄 길이만큼 입력하면)
    if (newInput.length >= currentSentence.length) {
      let correctCount = 0;
      for (let i = 0; i < currentSentence.length; i++) {
        if (newInput[i] === currentSentence[i]) correctCount++;
      }
      const accuracy = currentSentence.length > 0 ? correctCount / currentSentence.length : 0;

      if (accuracy >= 0.7) {
        completeLine(newInput);
      }
    }
  };

  // Enter로 다음 문장 (수동)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      // 70% 이상 입력했으면 다음 줄로
      if (sentenceInput.length >= currentSentence.length * 0.7) {
        completeLine(sentenceInput);
      }
    }
  };

  return (
    <>
      {/* 상단 정보 */}
      <div className="flex justify-between items-center text-sm mb-4">
        <div className="flex gap-4">
          <span>진행: <strong className="text-blue-600">{sentenceIndex + 1}/{totalLines}</strong></span>
          <span>타수: <strong className="text-green-600">{calculateWPM()}</strong>/분</span>
          <span>정확도: <strong className="text-purple-600">{calculateAccuracy()}%</strong></span>
        </div>
        <div className="text-sm text-gray-500">
          {selectedText.title}
        </div>
      </div>

      {/* 여러 줄 문장 표시 영역 */}
      <Card variant="bordered" className="p-4 mb-4">
        <div className="space-y-2 font-mono">
          {selectedText.lines.slice(visibleStart, visibleEnd).map((_, idx) => {
            const lineIndex = visibleStart + idx;
            const isCurrent = lineIndex === sentenceIndex;
            return (
              <div
                key={lineIndex}
                className={`text-base leading-relaxed py-1 px-2 rounded transition-all ${
                  isCurrent
                    ? 'bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500'
                    : ''
                }`}
              >
                <span className="text-xs text-gray-400 mr-2 inline-block w-5">
                  {lineIndex + 1}
                </span>
                {renderLineWithHighlight(lineIndex)}
              </div>
            );
          })}
        </div>
      </Card>

      {/* 입력 영역 - input 사용 (IME 문제 해결) */}
      <div className="relative">
        <input
          ref={sentenceInputRef}
          type="text"
          value={sentenceInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="현재 줄을 입력하세요..."
          className="w-full px-4 py-3 text-lg border-2 border-blue-300 dark:border-blue-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-white font-mono"
          autoComplete="off"
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
        />
        <div className="text-xs text-gray-400 mt-2 flex justify-between">
          <span>입력: {sentenceInput.length}/{currentSentence.length}</span>
          <span>끝까지 입력하면 자동으로 다음 줄 / Enter로 건너뛰기</span>
        </div>
        <div className="mt-2 flex justify-end">
          <Button variant="secondary" size="sm" onClick={() => { endGame(); goToIdle(); }}>
            그만하기
          </Button>
        </div>
      </div>

      {/* 진행 바 */}
      <div className="mt-4">
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${((sentenceIndex + sentenceInput.length / currentSentence.length) / totalLines) * 100}%` }}
          />
        </div>
      </div>
    </>
  );
}

export function TypingGame() {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [gameMode, setGameMode] = useState<GameMode>('survival');
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [copied, setCopied] = useState(false);
  const [sharedResult, setSharedResult] = useState<{ s: number; w: number; a: number; m: string } | null>(null);

  // URL hash에서 공유 데이터 복원
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (hash.startsWith('#share=')) {
      try {
        const decoded = decodeURIComponent(atob(hash.slice(7)));
        const parsed = JSON.parse(decoded);
        if (parsed.w !== undefined && parsed.a !== undefined) {
          setSharedResult(parsed);
        }
      } catch { /* invalid share data */ }
    }
  }, []);
  const [words, setWords] = useState<FallingWord[]>([]);
  const [input, setInput] = useState('');
  const [stats, setStats] = useState({
    score: 0,
    correctWords: 0,
    wrongWords: 0,
    totalChars: 0,
    startTime: 0,
    endTime: null as number | null,
    maxCombo: 0,
  });
  const [lives, setLives] = useState(3);
  const [currentSpeed, setCurrentSpeed] = useState(INITIAL_SPEEDS.normal);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_ATTACK_DURATION);
  const [showComboEffect, setShowComboEffect] = useState(false);

  // 문장 모드 상태
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [sentenceInput, setSentenceInput] = useState('');
  const [selectedTextId, setSelectedTextId] = useState<string>('aegukga');
  const [selectedText, setSelectedText] = useState<LongText>(LONG_TEXTS[0]);
  const [sentenceStats, setSentenceStats] = useState({
    totalChars: 0,
    correctChars: 0,
    startTime: 0,
    completedSentences: 0,
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const sentenceInputRef = useRef<HTMLInputElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  const spawnTimerRef = useRef<NodeJS.Timeout | null>(null);
  const timeAttackTimerRef = useRef<NodeJS.Timeout | null>(null);
  const wordIdRef = useRef(0);
  const usedWordsRef = useRef<Set<string>>(new Set());

  // 콤보 배수 계산
  const getComboMultiplier = (currentCombo: number) => {
    if (currentCombo >= 20) return 3;
    if (currentCombo >= 10) return 2;
    if (currentCombo >= 5) return 1.5;
    return 1;
  };

  // 랜덤 단어 선택
  const getRandomWord = useCallback(() => {
    const wordList = WORDS[difficulty];
    const availableWords = wordList.filter(w => !usedWordsRef.current.has(w));
    if (availableWords.length === 0) {
      usedWordsRef.current.clear();
      return wordList[Math.floor(Math.random() * wordList.length)];
    }
    const word = availableWords[Math.floor(Math.random() * availableWords.length)];
    usedWordsRef.current.add(word);
    return word;
  }, [difficulty]);

  // 단어 생성
  const spawnWord = useCallback(() => {
    const newWord: FallingWord = {
      id: wordIdRef.current++,
      text: getRandomWord(),
      x: 10 + Math.random() * 80,
      y: 0,
      speed: currentSpeed,
    };
    setWords(prev => [...prev, newWord]);
  }, [getRandomWord, currentSpeed]);

  // 게임 시작
  const startGame = () => {
    setGameState('playing');
    setWords([]);
    setInput('');
    setLives(3);
    setCombo(0);
    setTimeLeft(TIME_ATTACK_DURATION);
    setCurrentSpeed(INITIAL_SPEEDS[difficulty]);
    setStats({
      score: 0,
      correctWords: 0,
      wrongWords: 0,
      totalChars: 0,
      startTime: Date.now(),
      endTime: null,
      maxCombo: 0,
    });
    usedWordsRef.current.clear();
    wordIdRef.current = 0;

    // 문장 모드 초기화
    if (gameMode === 'sentence') {
      const text = LONG_TEXTS.find(t => t.id === selectedTextId) || LONG_TEXTS[0];
      setSelectedText(text);
      setSentenceIndex(0);
      setSentenceInput('');
      setSentenceStats({
        totalChars: 0,
        correctChars: 0,
        startTime: Date.now(),
        completedSentences: 0,
      });
      setTimeout(() => sentenceInputRef.current?.focus(), 100);
    } else {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  // 게임 종료
  const endGame = useCallback(() => {
    setGameState('gameover');
    setStats(prev => ({ ...prev, endTime: Date.now() }));
    if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    if (timeAttackTimerRef.current) clearInterval(timeAttackTimerRef.current);
    gameLoopRef.current = null;
    spawnTimerRef.current = null;
    timeAttackTimerRef.current = null;
  }, []);

  const handleShare = useCallback(() => {
    if (gameState !== 'gameover') return;
    let data: { s?: number; w: number; a: number; m: string };
    if (gameMode === 'sentence') {
      const wpm = sentenceStats.startTime && sentenceStats.totalChars > 0
        ? Math.round(sentenceStats.totalChars / ((Date.now() - sentenceStats.startTime) / 60000))
        : 0;
      const acc = sentenceStats.totalChars > 0
        ? Math.round((sentenceStats.correctChars / sentenceStats.totalChars) * 100)
        : 100;
      data = { w: wpm, a: acc, m: 'sentence' };
    } else {
      const endTime = stats.endTime || Date.now();
      const minutes = (endTime - stats.startTime) / 60000;
      const wpm = minutes < 0.1 ? 0 : Math.round(stats.totalChars / minutes);
      const acc = stats.correctWords + stats.wrongWords > 0
        ? Math.round((stats.correctWords / (stats.correctWords + stats.wrongWords)) * 100)
        : 100;
      data = { s: stats.score, w: wpm, a: acc, m: gameMode };
    }
    const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
    const url = `${window.location.origin}${window.location.pathname}#share=${encoded}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [gameState, gameMode, stats, sentenceStats]);

  // 입력 처리
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmedInput = input.trim();
      if (!trimmedInput) return;

      const matchedWordIndex = words.findIndex(w => w.text === trimmedInput);
      if (matchedWordIndex !== -1) {
        const matchedWord = words[matchedWordIndex];
        const newCombo = combo + 1;
        const multiplier = getComboMultiplier(newCombo);
        const baseScore = matchedWord.text.length * 10;
        const finalScore = Math.round(baseScore * multiplier);

        setWords(prev => prev.filter(w => w.id !== matchedWord.id));
        setCombo(newCombo);
        setStats(prev => ({
          ...prev,
          score: prev.score + finalScore,
          correctWords: prev.correctWords + 1,
          totalChars: prev.totalChars + matchedWord.text.length,
          maxCombo: Math.max(prev.maxCombo, newCombo),
        }));
        setCurrentSpeed(prev => prev + SPEED_INCREASE[difficulty]);

        // 콤보 이펙트
        if (newCombo >= 5 && newCombo % 5 === 0) {
          setShowComboEffect(true);
          setTimeout(() => setShowComboEffect(false), 500);
        }
      } else {
        setCombo(0); // 틀리면 콤보 초기화
        setStats(prev => ({ ...prev, wrongWords: prev.wrongWords + 1 }));
      }
      setInput('');
    }
  };

  // 게임 루프 (서바이벌/타임어택 모드)
  useEffect(() => {
    if (gameState !== 'playing' || gameMode === 'sentence') return;

    let lastTime = performance.now();
    const gameLoop = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 16.67;
      lastTime = currentTime;

      setWords(prevWords => {
        const newWords: FallingWord[] = [];
        let lostLife = false;

        for (const word of prevWords) {
          const newY = word.y + word.speed * deltaTime;
          if (newY >= 100) {
            lostLife = true;
          } else {
            newWords.push({ ...word, y: newY, speed: currentSpeed });
          }
        }

        if (lostLife) {
          setCombo(0); // 놓치면 콤보 초기화
          if (gameMode === 'survival') {
            setLives(prev => {
              const newLives = prev - 1;
              if (newLives <= 0) setTimeout(endGame, 0);
              return newLives;
            });
          }
          setStats(prev => ({ ...prev, wrongWords: prev.wrongWords + 1 }));
        }
        return newWords;
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => { if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current); };
  }, [gameState, currentSpeed, endGame, gameMode]);

  // 단어 스폰 (서바이벌/타임어택 모드)
  useEffect(() => {
    if (gameState !== 'playing' || gameMode === 'sentence') return;
    spawnWord();
    // 타임어택은 단어가 더 자주 생성됨
    const interval = gameMode === 'timeattack'
      ? Math.max(SPAWN_INTERVALS[difficulty] - 500, 1500)
      : SPAWN_INTERVALS[difficulty];
    spawnTimerRef.current = setInterval(spawnWord, interval);
    return () => { if (spawnTimerRef.current) clearInterval(spawnTimerRef.current); };
  }, [gameState, difficulty, spawnWord, gameMode]);

  // 타임어택 타이머
  useEffect(() => {
    if (gameState !== 'playing' || gameMode !== 'timeattack') return;

    timeAttackTimerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setTimeout(endGame, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => { if (timeAttackTimerRef.current) clearInterval(timeAttackTimerRef.current); };
  }, [gameState, gameMode, endGame]);

  // 타수 계산
  const calculateTypingSpeed = () => {
    if (!stats.startTime) return 0;
    const endTime = stats.endTime || Date.now();
    const minutes = (endTime - stats.startTime) / 60000;
    if (minutes < 0.1) return 0;
    return Math.round(stats.totalChars / minutes);
  };

  const modeLabels: Record<GameMode, { name: string; desc: string }> = {
    survival: { name: '서바이벌', desc: '목숨 3개, 단어 놓치면 끝!' },
    timeattack: { name: '타임어택', desc: '60초 안에 최대 점수!' },
    sentence: { name: '긴문장', desc: '긴 문장 한 줄씩 연습!' },
  };

  return (
    <div className="space-y-4">
      {sharedResult && (
        <Card variant="bordered" className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-1">🏆 친구의 기록</p>
          <p className="text-center text-lg font-bold text-yellow-700 dark:text-yellow-300">
            {sharedResult.m === 'sentence' ? '긴문장' : sharedResult.m === 'timeattack' ? '타임어택' : '서바이벌'} 모드
            {sharedResult.s !== undefined && ` | ${sharedResult.s}점`} | {sharedResult.w}타/분 | 정확도 {sharedResult.a}%
          </p>
          <p className="text-center text-sm text-gray-500 mt-2">나도 도전해보세요! 👇</p>
        </Card>
      )}

      {/* 시작 화면 */}
      {gameState === 'idle' && (
        <Card variant="bordered" className="p-6">
          <div className="text-center">
            {/* 게임 모드 선택 */}
            <h2 className="text-xl font-bold mb-4">게임 모드</h2>
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {(['survival', 'timeattack', 'sentence'] as GameMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setGameMode(m)}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    gameMode === m
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className={`font-bold ${gameMode === m ? 'text-blue-600' : 'text-gray-700 dark:text-gray-300'}`}>
                    {modeLabels[m].name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{modeLabels[m].desc}</div>
                </button>
              ))}
            </div>

            {/* 긴문장 모드: 텍스트 선택 */}
            {gameMode === 'sentence' && (
              <>
                <h2 className="text-xl font-bold mb-4">연습할 글 선택</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6 max-w-lg mx-auto">
                  {LONG_TEXTS.map((text) => (
                    <button
                      key={text.id}
                      onClick={() => setSelectedTextId(text.id)}
                      className={`px-3 py-2 rounded-lg border-2 transition-all text-left ${
                        selectedTextId === text.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className={`text-sm font-medium ${selectedTextId === text.id ? 'text-blue-600' : 'text-gray-700 dark:text-gray-300'}`}>
                        {text.title}
                      </div>
                      <div className="text-xs text-gray-400">{text.lines.length}줄</div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* 난이도 선택 (서바이벌/타임어택만) */}
            {gameMode !== 'sentence' && (
              <>
                <h2 className="text-xl font-bold mb-4">난이도 선택</h2>
                <div className="flex justify-center gap-3 mb-6">
                  {(['easy', 'normal', 'hard'] as Difficulty[]).map((d) => (
                    <Button
                      key={d}
                      variant={difficulty === d ? 'primary' : 'secondary'}
                      onClick={() => setDifficulty(d)}
                    >
                      {d === 'easy' ? '쉬움' : d === 'normal' ? '보통' : '어려움'}
                    </Button>
                  ))}
                </div>
                <div className="text-sm text-gray-500 mb-6 space-y-1">
                  <p>쉬움: 짧은 단어, 느린 속도</p>
                  <p>보통: 중간 길이, 보통 속도</p>
                  <p>어려움: 긴 문장, 빠른 속도</p>
                </div>
              </>
            )}

            <Button onClick={startGame} className="text-lg px-8 py-3">
              게임 시작
            </Button>
          </div>
        </Card>
      )}

      {/* 게임 플레이 - 서바이벌/타임어택 */}
      {gameState === 'playing' && gameMode !== 'sentence' && (
        <>
          <div className="flex justify-between items-center text-sm">
            <div className="flex gap-4">
              <span>점수: <strong className="text-blue-600">{stats.score}</strong></span>
              <span>타수: <strong className="text-green-600">{calculateTypingSpeed()}</strong>/분</span>
              {combo >= 5 && (
                <span className={`font-bold ${showComboEffect ? 'animate-pulse scale-110' : ''} ${
                  combo >= 20 ? 'text-red-500' : combo >= 10 ? 'text-orange-500' : 'text-yellow-500'
                }`}>
                  {combo} COMBO! (x{getComboMultiplier(combo)})
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {gameMode === 'survival' ? (
                <div className="flex gap-1">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <span key={i} className={`text-xl ${i < lives ? 'text-red-500' : 'text-gray-300'}`}>♥</span>
                  ))}
                </div>
              ) : (
                <div className={`text-xl font-bold ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-blue-600'}`}>
                  ⏱ {timeLeft}초
                </div>
              )}
            </div>
          </div>

          <div
            className="relative bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 rounded-lg overflow-hidden border-2 border-blue-200 dark:border-gray-700"
            style={{ height: GAME_HEIGHT }}
          >
            {words.map((word) => (
              <div
                key={word.id}
                className="absolute px-3 py-1 bg-white dark:bg-gray-700 rounded-lg shadow-md border border-gray-200 dark:border-gray-600 font-medium text-gray-800 dark:text-white whitespace-nowrap"
                style={{ left: `${word.x}%`, top: `${word.y}%`, transform: 'translateX(-50%)' }}
              >
                {word.text}
              </div>
            ))}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-400" />

            {/* 콤보 이펙트 */}
            {showComboEffect && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-4xl font-bold text-yellow-500 animate-bounce">
                  {combo} COMBO!
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="단어를 입력하고 Enter"
              className="flex-1 px-4 py-3 text-lg border-2 border-blue-300 dark:border-blue-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              autoComplete="off"
              spellCheck={false}
            />
            <Button variant="secondary" onClick={() => { endGame(); setGameState('idle'); }}>
              그만하기
            </Button>
          </div>
        </>
      )}

      {/* 게임 플레이 - 긴문장 모드 */}
      {gameState === 'playing' && gameMode === 'sentence' && (
        <SentenceModeUI
          selectedText={selectedText}
          sentenceIndex={sentenceIndex}
          sentenceInput={sentenceInput}
          sentenceStats={sentenceStats}
          sentenceInputRef={sentenceInputRef}
          setSentenceInput={setSentenceInput}
          setSentenceIndex={setSentenceIndex}
          setSentenceStats={setSentenceStats}
          endGame={endGame}
          goToIdle={() => setGameState('idle')}
        />
      )}

      {/* 게임 오버 - 서바이벌/타임어택 */}
      {gameState === 'gameover' && gameMode !== 'sentence' && (
        <Card variant="bordered" className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-500">
            {gameMode === 'timeattack' ? '타임 오버!' : '게임 오버!'}
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-6 max-w-sm mx-auto">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <p className="text-sm text-gray-500">최종 점수</p>
              <p className="text-2xl font-bold text-blue-600">{stats.score}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <p className="text-sm text-gray-500">타수</p>
              <p className="text-2xl font-bold text-green-600">{calculateTypingSpeed()}/분</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
              <p className="text-sm text-gray-500">정확도</p>
              <p className="text-2xl font-bold text-purple-600">
                {stats.correctWords + stats.wrongWords > 0
                  ? Math.round((stats.correctWords / (stats.correctWords + stats.wrongWords)) * 100)
                  : 100}%
              </p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
              <p className="text-sm text-gray-500">맞춘 단어</p>
              <p className="text-2xl font-bold text-orange-600">{stats.correctWords}개</p>
            </div>
            <div className="col-span-2 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
              <p className="text-sm text-gray-500">최대 콤보</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.maxCombo} COMBO</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-3">
              <Button onClick={startGame}>다시 하기</Button>
              <Button variant="secondary" onClick={() => setGameState('idle')}>처음으로</Button>
            </div>
            <Button variant="secondary" onClick={handleShare}>
              {copied ? '✅ 복사됨!' : '🔗 결과 공유하기'}
            </Button>
          </div>
        </Card>
      )}

      {/* 게임 오버 - 긴문장 모드 */}
      {gameState === 'gameover' && gameMode === 'sentence' && (
        <Card variant="bordered" className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-4 text-green-500">
            🎉 {sentenceStats.completedSentences === selectedText.lines.length ? '완료!' : '연습 종료'}
          </h2>
          <p className="text-gray-500 mb-4">{selectedText.title}</p>
          <div className="grid grid-cols-2 gap-4 mb-6 max-w-sm mx-auto">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <p className="text-sm text-gray-500">완료 줄</p>
              <p className="text-2xl font-bold text-blue-600">{sentenceStats.completedSentences}/{selectedText.lines.length}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <p className="text-sm text-gray-500">타수</p>
              <p className="text-2xl font-bold text-green-600">
                {sentenceStats.startTime && sentenceStats.totalChars > 0
                  ? Math.round(sentenceStats.totalChars / ((Date.now() - sentenceStats.startTime) / 60000))
                  : 0}/분
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
              <p className="text-sm text-gray-500">정확도</p>
              <p className="text-2xl font-bold text-purple-600">
                {sentenceStats.totalChars > 0
                  ? Math.round((sentenceStats.correctChars / sentenceStats.totalChars) * 100)
                  : 100}%
              </p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
              <p className="text-sm text-gray-500">총 입력</p>
              <p className="text-2xl font-bold text-orange-600">{sentenceStats.totalChars}자</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-3">
              <Button onClick={startGame}>다시 하기</Button>
              <Button variant="secondary" onClick={() => setGameState('idle')}>처음으로</Button>
            </div>
            <Button variant="secondary" onClick={handleShare}>
              {copied ? '✅ 복사됨!' : '🔗 결과 공유하기'}
            </Button>
          </div>
        </Card>
      )}

      {/* 설명 */}
      {gameState === 'idle' && (
        <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
          <p>• <strong>서바이벌</strong>: 떨어지는 단어 입력, 목숨 3개</p>
          <p>• <strong>타임어택</strong>: 60초 안에 최대 점수 달성!</p>
          <p>• <strong>긴문장</strong>: 긴 문장 10개를 한 줄씩 따라 입력</p>
          <p>• 콤보 시스템: 연속 정답 시 점수 배수 (5콤보 x1.5, 10콤보 x2, 20콤보 x3)</p>
        </div>
      )}

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          ⌨️ 온라인 타이핑 게임이란?
        </h2>
        <p className="text-sm leading-relaxed">
          타이핑 게임은 키보드 입력 속도와 정확도를 재미있게 향상시킬 수 있는 도구입니다.
          단순히 빠르게 치는 것이 아니라, 정확하게 입력하는 습관을 기르는 것이 핵심입니다.
          서바이벌, 타임어택, 긴 문장 모드 등 다양한 게임 방식으로 지루하지 않게 연습할 수 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🎮 게임 모드 소개
        </h2>
        <div className="space-y-3 text-sm leading-relaxed">
          <div>
            <p className="font-medium">서바이벌 모드</p>
            <p>화면 위에서 떨어지는 단어를 제한 시간 내에 입력해야 합니다. 목숨은 3개이며, 놓친 단어마다 목숨이 줄어듭니다. 난이도가 올라갈수록 단어가 빨라집니다.</p>
          </div>
          <div>
            <p className="font-medium">타임어택 모드</p>
            <p>60초 안에 최대한 많은 단어를 정확하게 입력하세요. 콤보 시스템으로 연속 정답 시 점수 배수가 올라갑니다.</p>
          </div>
          <div>
            <p className="font-medium">긴 문장 모드</p>
            <p>실제 문장을 한 줄씩 따라 입력하는 모드입니다. 정확도와 타수를 동시에 측정하여 실전 타이핑 실력을 점검할 수 있습니다.</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📈 타이핑 속도 향상 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li>키보드를 보지 않고 치는 터치 타이핑을 연습하세요</li>
          <li>처음에는 속도보다 정확도에 집중하세요</li>
          <li>매일 10~15분씩 꾸준히 연습하는 것이 효과적입니다</li>
          <li>올바른 손가락 위치(홈 포지션)를 유지하세요</li>
          <li>쉬운 난이도부터 시작해서 점차 올리는 것이 좋습니다</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '타이핑 속도는 어떻게 측정되나요?',
            answer: '분당 입력 글자 수(타/분)로 측정됩니다. 일반적으로 200타/분 이상이면 빠른 편이고, 400타/분 이상이면 상급자입니다.',
          },
          {
            question: '한글과 영어 타이핑 속도가 다른가요?',
            answer: '네, 한글은 자음+모음 조합 방식이므로 영어보다 키 입력 수가 더 많습니다. 같은 속도여도 한글이 더 높은 타수로 측정될 수 있습니다.',
          },
          {
            question: '콤보 시스템은 어떻게 작동하나요?',
            answer: '연속으로 단어를 맞추면 콤보가 쌓입니다. 5콤보에서 1.5배, 10콤보에서 2배, 20콤보에서 3배의 점수를 받습니다.',
          },
        ]}
      />
    </div>
  );
}
