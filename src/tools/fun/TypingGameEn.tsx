'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';

type Difficulty = 'easy' | 'normal' | 'hard';
type GameMode = 'survival' | 'timeattack' | 'sentence';

// Long text practice options
interface LongText {
  id: string;
  title: string;
  lines: string[];
}

const LONG_TEXTS: LongText[] = [
  {
    id: 'gettysburg',
    title: '🇺🇸 Gettysburg Address',
    lines: [
      "Four score and seven years ago our fathers brought forth on this continent",
      "a new nation, conceived in Liberty, and dedicated to the proposition",
      "that all men are created equal.",
      "Now we are engaged in a great civil war,",
      "testing whether that nation, or any nation so conceived and so dedicated,",
      "can long endure.",
      "We are met on a great battle-field of that war.",
      "We have come to dedicate a portion of that field,",
      "as a final resting place for those who here gave their lives",
      "that that nation might live.",
      "It is altogether fitting and proper that we should do this.",
    ],
  },
  {
    id: 'dream',
    title: '✊ I Have a Dream (excerpt)',
    lines: [
      "I have a dream that one day this nation will rise up",
      "and live out the true meaning of its creed:",
      "We hold these truths to be self-evident, that all men are created equal.",
      "I have a dream that one day on the red hills of Georgia,",
      "the sons of former slaves and the sons of former slave owners",
      "will be able to sit down together at the table of brotherhood.",
      "I have a dream that my four little children",
      "will one day live in a nation where they will not be judged",
      "by the color of their skin but by the content of their character.",
      "I have a dream today!",
    ],
  },
  {
    id: 'road',
    title: '🛤️ The Road Not Taken',
    lines: [
      "Two roads diverged in a yellow wood,",
      "And sorry I could not travel both",
      "And be one traveler, long I stood",
      "And looked down one as far as I could",
      "To where it bent in the undergrowth;",
      "Then took the other, as just as fair,",
      "And having perhaps the better claim,",
      "Because it was grassy and wanted wear;",
      "Though as for that the passing there",
      "Had worn them really about the same,",
      "I shall be telling this with a sigh",
      "Somewhere ages and ages hence:",
      "Two roads diverged in a wood, and I—",
      "I took the one less traveled by,",
      "And that has made all the difference.",
    ],
  },
  {
    id: 'hamlet',
    title: '🎭 To Be or Not To Be',
    lines: [
      "To be, or not to be, that is the question:",
      "Whether 'tis nobler in the mind to suffer",
      "The slings and arrows of outrageous fortune,",
      "Or to take arms against a sea of troubles",
      "And by opposing end them.",
      "To die: to sleep;",
      "No more; and by a sleep to say we end",
      "The heart-ache and the thousand natural shocks",
      "That flesh is heir to.",
    ],
  },
  {
    id: 'developer',
    title: '💻 Developer Wisdom',
    lines: [
      "First, solve the problem. Then, write the code.",
      "Good code is its own best documentation.",
      "Programming is not about typing, it is about thinking.",
      "Debugging is twice as hard as writing the code in the first place.",
      "Simplicity is the ultimate sophistication.",
      "Code is read many more times than it is written.",
      "Perfection is achieved not when there is nothing more to add,",
      "but when there is nothing left to take away.",
      "If you cannot measure it, you cannot improve it.",
      "Fail early, fail often, but always fail forward.",
    ],
  },
  {
    id: 'life',
    title: '🌱 Life Quotes',
    lines: [
      "A journey of a thousand miles begins with a single step.",
      "Failure is the mother of success.",
      "Do not put off until tomorrow what you can do today.",
      "There is no end to learning.",
      "Do your best even in small things.",
      "As long as you do not give up, there is no failure.",
      "Time is gold.",
      "Where there is a will, there is a way.",
      "No pain, no gain.",
      "Consistency beats talent when talent does not work hard.",
    ],
  },
  {
    id: 'pangram',
    title: '🔤 Typing Classics',
    lines: [
      "The quick brown fox jumps over the lazy dog.",
      "Pack my box with five dozen liquor jugs.",
      "How vexingly quick daft zebras jump!",
      "The five boxing wizards jump quickly.",
      "Sphinx of black quartz, judge my vow.",
      "Two driven jocks help fax my big quiz.",
      "The jay, pig, fox, zebra, and my wolves quack!",
      "Sympathizing would fix Quaker objectives.",
      "A wizard's job is to vex chumps quickly in fog.",
      "Watch Jeopardy, Alex Trebek's fun TV quiz game.",
    ],
  },
];

// Copyright-free English words/phrases
const WORDS = {
  easy: [
    'apple', 'banana', 'grape', 'orange', 'melon',
    'computer', 'keyboard', 'mouse', 'monitor', 'speaker',
    'school', 'office', 'hospital', 'park', 'library',
    'red', 'blue', 'yellow', 'green', 'purple',
    'coffee', 'milk', 'juice', 'water', 'tea',
    'spring', 'summer', 'autumn', 'winter', 'snow',
    'wind', 'cloud', 'sky', 'star', 'moon',
    'cat', 'dog', 'rabbit', 'bird', 'fish',
    'book', 'pencil', 'eraser', 'notebook', 'bag',
    'clock', 'glasses', 'hat', 'shoes', 'socks',
  ],
  normal: [
    'programming', 'algorithm', 'database', 'network', 'operating',
    'smartphone', 'laptop', 'tablet', 'headphone', 'charger',
    'internet', 'software', 'hardware', 'memory', 'processor',
    'javascript', 'typescript', 'react', 'server', 'client',
    'good morning', 'lunch time', 'evening sky', 'night stars', 'fresh air',
    'study hard', 'exercise daily', 'healthy diet', 'good sleep', 'routine',
    'happy day', 'nice weekend', 'fun travel', 'warm coffee', 'cool breeze',
  ],
  hard: [
    'software developer', 'artificial intelligence', 'machine learning',
    'cloud computing', 'cyber security', 'data analyst',
    'user experience design', 'responsive website', 'mobile application',
    'open source project', 'version control system', 'continuous integration',
    'consistency is key', 'small steps matter', 'beginning is half done',
    'a journey of a thousand miles', 'where there is a will there is a way',
    'never put off until tomorrow', 'hard work pays off',
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
const TIME_ATTACK_DURATION = 60; // 60 seconds

// Combo multiplier
const getComboMultiplier = (currentCombo: number) => {
  if (currentCombo >= 20) return 3;
  if (currentCombo >= 10) return 2;
  if (currentCombo >= 5) return 1.5;
  return 1;
};

// Sentence mode UI component
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
  sentenceInputRef: React.RefObject<HTMLTextAreaElement | null>;
  setSentenceInput: (value: string) => void;
  setSentenceIndex: (value: number) => void;
  setSentenceStats: React.Dispatch<React.SetStateAction<{
    totalChars: number;
    correctChars: number;
    startTime: number;
    completedSentences: number;
  }>>;
  endGame: () => void;
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
}: SentenceModeUIProps) {
  const currentSentence = selectedText.lines[sentenceIndex] || '';
  const totalLines = selectedText.lines.length;

  // Calculate WPM
  const calculateWPM = () => {
    if (!sentenceStats.startTime) return 0;
    const minutes = (Date.now() - sentenceStats.startTime) / 60000;
    if (minutes < 0.1) return 0;
    return Math.round(sentenceStats.totalChars / minutes);
  };

  // Calculate accuracy
  const calculateAccuracy = () => {
    if (sentenceStats.totalChars === 0) return 100;
    return Math.round((sentenceStats.correctChars / sentenceStats.totalChars) * 100);
  };

  // Real-time character comparison
  const renderSentenceWithHighlight = () => {
    return currentSentence.split('').map((char: string, idx: number) => {
      let className = 'text-gray-400'; // Not yet typed
      if (idx < sentenceInput.length) {
        if (sentenceInput[idx] === char) {
          className = 'text-green-600 dark:text-green-400'; // Correct
        } else {
          className = 'text-red-500 bg-red-100 dark:bg-red-900/30'; // Wrong
        }
      } else if (idx === sentenceInput.length) {
        className = 'text-gray-900 dark:text-white underline'; // Current character
      }
      return (
        <span key={idx} className={className}>
          {char}
        </span>
      );
    });
  };

  // Handle input
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newInput = e.target.value;

    // Count newly typed characters
    if (newInput.length > sentenceInput.length) {
      const addedChars = newInput.length - sentenceInput.length;
      const startIdx = sentenceInput.length;
      let correctAdded = 0;

      for (let i = 0; i < addedChars; i++) {
        const idx = startIdx + i;
        if (idx < currentSentence.length && newInput[idx] === currentSentence[idx]) {
          correctAdded++;
        }
      }

      setSentenceStats(prev => ({
        ...prev,
        totalChars: prev.totalChars + addedChars,
        correctChars: prev.correctChars + correctAdded,
      }));
    }

    setSentenceInput(newInput);
  };

  // Enter to go to next line
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      // Check if current sentence is completed (80%+ typed, 70%+ accuracy)
      let correctCount = 0;
      for (let i = 0; i < Math.min(sentenceInput.length, currentSentence.length); i++) {
        if (sentenceInput[i] === currentSentence[i]) correctCount++;
      }
      const accuracy = currentSentence.length > 0 ? correctCount / currentSentence.length : 0;

      if (sentenceInput.length >= currentSentence.length * 0.8 && accuracy >= 0.7) {
        // Go to next line
        setSentenceStats(prev => ({
          ...prev,
          completedSentences: prev.completedSentences + 1,
        }));

        if (sentenceIndex + 1 >= totalLines) {
          // All lines completed
          endGame();
        } else {
          setSentenceIndex(sentenceIndex + 1);
          setSentenceInput('');
        }
      }
    }
  };

  return (
    <>
      {/* Top info */}
      <div className="flex justify-between items-center text-sm mb-4">
        <div className="flex gap-4">
          <span>Progress: <strong className="text-blue-600">{sentenceIndex + 1}/{totalLines}</strong></span>
          <span>CPM: <strong className="text-green-600">{calculateWPM()}</strong></span>
          <span>Accuracy: <strong className="text-purple-600">{calculateAccuracy()}%</strong></span>
        </div>
        <div className="text-sm text-gray-500">
          {selectedText.title}
        </div>
      </div>

      {/* Sentence display area */}
      <Card variant="bordered" className="p-4 mb-4">
        <div className="text-xs text-gray-500 mb-2">Line #{sentenceIndex + 1}</div>
        <div className="text-lg leading-relaxed font-medium">
          {renderSentenceWithHighlight()}
        </div>
      </Card>

      {/* Input area */}
      <div className="relative">
        <textarea
          ref={sentenceInputRef}
          value={sentenceInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type the line shown above..."
          className="w-full px-4 py-3 text-lg border-2 border-blue-300 dark:border-blue-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-white resize-none"
          rows={2}
          autoComplete="off"
          spellCheck={false}
        />
        <div className="text-xs text-gray-400 mt-2 text-right">
          Press Enter for next line (80%+ typed, 70%+ accuracy required)
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${(sentenceIndex / totalLines) * 100}%` }}
          />
        </div>
      </div>
    </>
  );
}

export function TypingGameEn() {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [gameMode, setGameMode] = useState<GameMode>('survival');
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [words, setWords] = useState<FallingWord[]>([]);
  const [input, setInput] = useState('');
  const [combo, setCombo] = useState(0);
  const [showComboEffect, setShowComboEffect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_ATTACK_DURATION);
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

  // Sentence mode state
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [sentenceInput, setSentenceInput] = useState('');
  const [selectedTextId, setSelectedTextId] = useState<string>('gettysburg');
  const [selectedText, setSelectedText] = useState<LongText>(LONG_TEXTS[0]);
  const [sentenceStats, setSentenceStats] = useState({
    totalChars: 0,
    correctChars: 0,
    startTime: 0,
    completedSentences: 0,
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const sentenceInputRef = useRef<HTMLTextAreaElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  const spawnTimerRef = useRef<NodeJS.Timeout | null>(null);
  const wordIdRef = useRef(0);
  const usedWordsRef = useRef<Set<string>>(new Set());

  // Random word selection
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

  // Spawn word
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

  // Start game
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

    // Sentence mode initialization
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

  // End game
  const endGame = useCallback(() => {
    setGameState('gameover');
    setStats(prev => ({ ...prev, endTime: Date.now() }));
    if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    gameLoopRef.current = null;
    spawnTimerRef.current = null;
  }, []);

  // Handle input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmedInput = input.trim();
      if (!trimmedInput) return;

      const matchedWordIndex = words.findIndex(w => w.text === trimmedInput);
      if (matchedWordIndex !== -1) {
        const matchedWord = words[matchedWordIndex];
        setWords(prev => prev.filter(w => w.id !== matchedWord.id));

        // Update combo
        const newCombo = combo + 1;
        setCombo(newCombo);

        // Combo effect at 5 intervals
        if (newCombo > 0 && newCombo % 5 === 0) {
          setShowComboEffect(true);
          setTimeout(() => setShowComboEffect(false), 500);
        }

        // Calculate score with multiplier
        const multiplier = getComboMultiplier(newCombo);
        const baseScore = matchedWord.text.length * 10;
        const finalScore = Math.round(baseScore * multiplier);

        setStats(prev => ({
          ...prev,
          score: prev.score + finalScore,
          correctWords: prev.correctWords + 1,
          totalChars: prev.totalChars + matchedWord.text.length,
          maxCombo: Math.max(prev.maxCombo, newCombo),
        }));
        setCurrentSpeed(prev => prev + SPEED_INCREASE[difficulty]);
      } else {
        setCombo(0); // Reset combo on wrong answer
        setStats(prev => ({ ...prev, wrongWords: prev.wrongWords + 1 }));
      }
      setInput('');
    }
  };

  // Time attack timer
  useEffect(() => {
    if (gameState !== 'playing' || gameMode !== 'timeattack') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setTimeout(endGame, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, gameMode, endGame]);

  // Game loop (survival/timeattack only)
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
          setCombo(0); // Reset combo when word drops
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

  // Word spawn (survival/timeattack only)
  useEffect(() => {
    if (gameState !== 'playing' || gameMode === 'sentence') return;
    spawnWord();
    spawnTimerRef.current = setInterval(spawnWord, SPAWN_INTERVALS[difficulty]);
    return () => { if (spawnTimerRef.current) clearInterval(spawnTimerRef.current); };
  }, [gameState, difficulty, spawnWord]);

  // Calculate typing speed (CPM)
  const calculateTypingSpeed = () => {
    if (!stats.startTime) return 0;
    const endTime = stats.endTime || Date.now();
    const minutes = (endTime - stats.startTime) / 60000;
    if (minutes < 0.1) return 0;
    return Math.round(stats.totalChars / minutes);
  };

  // Get multiplier display
  const currentMultiplier = getComboMultiplier(combo);

  return (
    <div className="space-y-4">
      {/* Start screen */}
      {gameState === 'idle' && (
        <Card variant="bordered" className="p-6">
          <div className="text-center">
            {/* Game Mode Selection */}
            <h2 className="text-xl font-bold mb-4">Select Mode</h2>
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <Button
                variant={gameMode === 'survival' ? 'primary' : 'secondary'}
                onClick={() => setGameMode('survival')}
              >
                Survival
              </Button>
              <Button
                variant={gameMode === 'timeattack' ? 'primary' : 'secondary'}
                onClick={() => setGameMode('timeattack')}
              >
                Time Attack
              </Button>
              <Button
                variant={gameMode === 'sentence' ? 'primary' : 'secondary'}
                onClick={() => setGameMode('sentence')}
              >
                Long Sentence
              </Button>
            </div>
            <div className="text-sm text-gray-500 mb-6">
              {gameMode === 'survival'
                ? 'Game over when you lose all 3 lives'
                : gameMode === 'timeattack'
                ? 'Score as high as possible in 60 seconds'
                : 'Practice typing famous texts line by line'}
            </div>

            {/* Text Selection for Sentence Mode */}
            {gameMode === 'sentence' && (
              <>
                <h2 className="text-xl font-bold mb-4">Select Text</h2>
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
                      <div className="text-xs text-gray-400">{text.lines.length} lines</div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Difficulty Selection (Survival/Time Attack only) */}
            {gameMode !== 'sentence' && (
              <>
                <h2 className="text-xl font-bold mb-4">Select Difficulty</h2>
                <div className="flex justify-center gap-3 mb-6">
                  {(['easy', 'normal', 'hard'] as Difficulty[]).map((d) => (
                    <Button
                      key={d}
                      variant={difficulty === d ? 'primary' : 'secondary'}
                      onClick={() => setDifficulty(d)}
                    >
                      {d === 'easy' ? 'Easy' : d === 'normal' ? 'Normal' : 'Hard'}
                    </Button>
                  ))}
                </div>
                <div className="text-sm text-gray-500 mb-6 space-y-1">
                  <p>Easy: Short words, slow speed</p>
                  <p>Normal: Medium length, normal speed</p>
                  <p>Hard: Long phrases, fast speed</p>
                </div>
              </>
            )}

            <Button onClick={startGame} className="text-lg px-8 py-3">
              Start Game
            </Button>
          </div>
        </Card>
      )}

      {/* Game play - Survival/Time Attack */}
      {gameState === 'playing' && gameMode !== 'sentence' && (
        <>
          <div className="flex justify-between items-center text-sm">
            <div className="flex gap-4">
              <span>Score: <strong className="text-blue-600">{stats.score}</strong></span>
              <span>CPM: <strong className="text-green-600">{calculateTypingSpeed()}</strong></span>
              {combo > 0 && (
                <span className={`font-bold ${currentMultiplier >= 2 ? 'text-orange-500' : currentMultiplier >= 1.5 ? 'text-yellow-500' : 'text-gray-500'}`}>
                  {combo} Combo {currentMultiplier > 1 && `(x${currentMultiplier})`}
                </span>
              )}
            </div>
            <div className="flex gap-2 items-center">
              {gameMode === 'timeattack' ? (
                <span className={`font-bold ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-blue-600'}`}>
                  {timeLeft}s
                </span>
              ) : (
                <div className="flex gap-1">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <span key={i} className={`text-xl ${i < lives ? 'text-red-500' : 'text-gray-300'}`}>&#9829;</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div
            className="relative bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 rounded-lg overflow-hidden border-2 border-blue-200 dark:border-gray-700"
            style={{ height: GAME_HEIGHT }}
          >
            {/* Combo effect */}
            {showComboEffect && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <span className="text-4xl font-bold text-orange-500 animate-ping">
                  {combo} COMBO!
                </span>
              </div>
            )}

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
          </div>

          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type the word and press Enter"
              className="w-full px-4 py-3 text-lg border-2 border-blue-300 dark:border-blue-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        </>
      )}

      {/* Game play - Long Sentence mode */}
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
        />
      )}

      {/* Game over - Survival/Time Attack */}
      {gameState === 'gameover' && gameMode !== 'sentence' && (
        <Card variant="bordered" className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-500">
            {gameMode === 'timeattack' ? "Time's Up!" : 'Game Over!'}
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-6 max-w-xs mx-auto">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Final Score</p>
              <p className="text-2xl font-bold text-blue-600">{stats.score}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <p className="text-sm text-gray-500">CPM</p>
              <p className="text-2xl font-bold text-green-600">{calculateTypingSpeed()}</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Accuracy</p>
              <p className="text-2xl font-bold text-purple-600">
                {stats.correctWords + stats.wrongWords > 0
                  ? Math.round((stats.correctWords / (stats.correctWords + stats.wrongWords)) * 100)
                  : 100}%
              </p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Max Combo</p>
              <p className="text-2xl font-bold text-orange-600">{stats.maxCombo}</p>
            </div>
          </div>
          <div className="flex justify-center gap-3">
            <Button onClick={startGame}>Play Again</Button>
            <Button variant="secondary" onClick={() => setGameState('idle')}>Back</Button>
          </div>
        </Card>
      )}

      {/* Game over - Long Sentence mode */}
      {gameState === 'gameover' && gameMode === 'sentence' && (
        <Card variant="bordered" className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-4 text-green-500">
            🎉 {sentenceStats.completedSentences === selectedText.lines.length ? 'Completed!' : 'Practice Ended'}
          </h2>
          <p className="text-gray-500 mb-4">{selectedText.title}</p>
          <div className="grid grid-cols-2 gap-4 mb-6 max-w-xs mx-auto">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Lines</p>
              <p className="text-2xl font-bold text-blue-600">{sentenceStats.completedSentences}/{selectedText.lines.length}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <p className="text-sm text-gray-500">CPM</p>
              <p className="text-2xl font-bold text-green-600">
                {sentenceStats.startTime && sentenceStats.totalChars > 0
                  ? Math.round(sentenceStats.totalChars / ((Date.now() - sentenceStats.startTime) / 60000))
                  : 0}
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Accuracy</p>
              <p className="text-2xl font-bold text-purple-600">
                {sentenceStats.totalChars > 0
                  ? Math.round((sentenceStats.correctChars / sentenceStats.totalChars) * 100)
                  : 100}%
              </p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Total Typed</p>
              <p className="text-2xl font-bold text-orange-600">{sentenceStats.totalChars}</p>
            </div>
          </div>
          <div className="flex justify-center gap-3">
            <Button onClick={startGame}>Play Again</Button>
            <Button variant="secondary" onClick={() => setGameState('idle')}>Back</Button>
          </div>
        </Card>
      )}

      {/* Instructions */}
      {gameState === 'idle' && (
        <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
          <p>• <strong>Survival</strong>: Type falling words, 3 lives</p>
          <p>• <strong>Time Attack</strong>: Score high in 60 seconds!</p>
          <p>• <strong>Long Sentence</strong>: Type 10 sentences one by one</p>
          <p>• Combo system: Score multipliers (5=x1.5, 10=x2, 20=x3)</p>
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
          ⌨️ What Is This Typing Game?
        </h2>
        <p className="text-sm leading-relaxed">
          This typing game helps you improve your keyboard typing speed and accuracy in a fun way.
          Instead of just typing fast, the focus is on building the habit of typing accurately.
          With multiple game modes like Survival, Time Attack, and Long Sentence, practice never gets boring.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🎮 Game Modes
        </h2>
        <div className="space-y-3 text-sm leading-relaxed">
          <div>
            <p className="font-medium">Survival Mode</p>
            <p>Words fall from the top of the screen and you must type them before they reach the bottom. You have 3 lives, and each missed word costs one. Difficulty increases as you progress.</p>
          </div>
          <div>
            <p className="font-medium">Time Attack Mode</p>
            <p>Type as many words as you can within 60 seconds. The combo system rewards consecutive correct answers with score multipliers.</p>
          </div>
          <div>
            <p className="font-medium">Long Sentence Mode</p>
            <p>Type real sentences line by line. This mode measures both accuracy and typing speed, giving you a realistic assessment of your typing skills.</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📈 Tips to Improve Typing Speed
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li>Practice touch typing without looking at the keyboard</li>
          <li>Focus on accuracy first, then build up speed</li>
          <li>Practice 10-15 minutes daily for consistent improvement</li>
          <li>Keep your fingers on the home row position</li>
          <li>Start with easy difficulty and gradually increase</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'How is typing speed measured?',
            answer: 'Typing speed is measured in characters per minute (CPM). Generally, 200+ CPM is considered fast, and 400+ CPM is expert level.',
          },
          {
            question: 'How does the combo system work?',
            answer: 'Consecutive correct words build your combo. At 5 combo you get 1.5x points, at 10 combo 2x, and at 20 combo 3x score multiplier.',
          },
          {
            question: 'Can I practice with different difficulty levels?',
            answer: 'Yes! Easy mode uses shorter and common words, Normal uses medium-length words, and Hard mode features longer and more complex words.',
          },
        ]}
      />
    </div>
  );
}
