'use client';

import { useState, useRef, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';

// Copyright-free English sentences for practice
const PRACTICE_TEXTS = [
  'The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet.',
  'Programming is the process of solving problems. Break complex problems into smaller pieces and tackle them one by one.',
  'Consistency is the most important thing. Practice a little every day and your skills will improve before you know it.',
  'When learning to type, accuracy matters more than speed at first. Speed will come naturally with practice.',
  'Good code is readable code. Make it a habit to write clearly so others can understand your work.',
  'Do not fear failure. Failure is part of the journey to success. What matters is that you never give up.',
  'A healthy mind lives in a healthy body. Exercise regularly and get enough sleep to stay sharp.',
  'Learning new things takes time. Be patient with yourself and take it step by step.',
  'Collaboration is essential in the modern world. Learn to respect others opinions and communicate effectively.',
  'Do not limit yourself. You will never know what is possible unless you try.',
  'Small wins add up to big achievements. Start with something small that you can do today.',
  'Learning never ends. Stay curious and keep exploring new things.',
  'Time is given equally to everyone. How you use it determines your results.',
  'A positive mindset gives you the strength to overcome challenges. Believe you can and you will.',
  'Instead of chasing perfection, focus on steady progress. Be better tomorrow than you are today.',
];

export function TypingPracticeEn() {
  const [practiceText, setPracticeText] = useState('');
  const [practiceInput, setPracticeInput] = useState('');
  const [practiceStartTime, setPracticeStartTime] = useState<number | null>(null);
  const [practiceComplete, setPracticeComplete] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [history, setHistory] = useState<Array<{ wpm: number; accuracy: number; length: number }>>([]);
  const [usedIndexes, setUsedIndexes] = useState<Set<number>>(new Set());

  const practiceInputRef = useRef<HTMLTextAreaElement>(null);

  const getNextText = () => {
    let available = PRACTICE_TEXTS.map((_, i) => i).filter((i) => !usedIndexes.has(i));
    if (available.length === 0) { setUsedIndexes(new Set()); available = PRACTICE_TEXTS.map((_, i) => i); }
    const idx = available[Math.floor(Math.random() * available.length)];
    setUsedIndexes((prev) => new Set(prev).add(idx));
    return PRACTICE_TEXTS[idx];
  };

  // Start practice
  const startPractice = () => {
    setPracticeText(getNextText());
    setPracticeInput('');
    setPracticeStartTime(null);
    setPracticeComplete(false);
    setIsPlaying(true);
    setTimeout(() => practiceInputRef.current?.focus(), 100);
  };

  // Handle input
  const handlePracticeInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (!practiceStartTime && value.length > 0) {
      setPracticeStartTime(Date.now());
    }
    setPracticeInput(value);

    // Check completion
    if (value === practiceText) {
      setPracticeComplete(true);
    }
  };

  // Calculate typing speed (CPM)
  const practiceTypingSpeed = useMemo(() => {
    if (!practiceStartTime || practiceInput.length === 0) return 0;
    const endTime = practiceComplete ? Date.now() : Date.now();
    const minutes = (endTime - practiceStartTime) / 60000;
    if (minutes < 0.05) return 0;
    return Math.round(practiceInput.length / minutes);
  }, [practiceStartTime, practiceInput, practiceComplete]);

  // Calculate WPM (Words Per Minute)
  const practiceWpm = useMemo(() => {
    if (!practiceStartTime || practiceInput.length === 0) return 0;
    const endTime = practiceComplete ? Date.now() : Date.now();
    const minutes = (endTime - practiceStartTime) / 60000;
    if (minutes < 0.05) return 0;
    // Standard: 5 characters = 1 word
    return Math.round((practiceInput.length / 5) / minutes);
  }, [practiceStartTime, practiceInput, practiceComplete]);

  // Accuracy
  const practiceAccuracy = useMemo(() => {
    if (practiceInput.length === 0) return 100;
    let correct = 0;
    for (let i = 0; i < practiceInput.length; i++) {
      if (practiceInput[i] === practiceText[i]) correct++;
    }
    return Math.round((correct / practiceInput.length) * 100);
  }, [practiceInput, practiceText]);

  const [countdown, setCountdown] = useState(0);

  // Auto-next on complete + save history
  useEffect(() => {
    if (!practiceComplete) return;
    setHistory((prev) => [...prev, { wpm: practiceWpm, accuracy: practiceAccuracy, length: practiceText.length }]);
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setPracticeText(getNextText()); setPracticeInput(''); setPracticeStartTime(null); setPracticeComplete(false);
          setTimeout(() => practiceInputRef.current?.focus(), 100);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [practiceComplete]);

  const totalStats = useMemo(() => {
    if (history.length === 0) return null;
    return {
      rounds: history.length,
      totalChars: history.reduce((s, r) => s + r.length, 0),
      avgWpm: Math.round(history.reduce((s, r) => s + r.wpm, 0) / history.length),
      avgAcc: Math.round(history.reduce((s, r) => s + r.accuracy, 0) / history.length),
    };
  }, [history]);

  // Render text with colors
  const renderPracticeText = () => {
    return practiceText.split('').map((char, i) => {
      let className = 'text-gray-400'; // Not typed yet
      if (i < practiceInput.length) {
        className = practiceInput[i] === char
          ? 'text-green-600 dark:text-green-400'
          : 'text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      }
      return (
        <span key={i} className={className}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="space-y-4">
      {/* Start screen */}
      {!isPlaying && (
        <Card variant="bordered" className="p-6">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4">Typing Practice</h2>
            <div className="text-sm text-gray-500 mb-6 space-y-1">
              <p>A random sentence will be shown</p>
              <p>Type it as accurately as possible</p>
              <p>Your speed and accuracy will be displayed in real-time</p>
            </div>
            <Button onClick={startPractice} className="text-lg px-8 py-3">
              Start Practice
            </Button>
          </div>
        </Card>
      )}

      {/* Practice in progress */}
      {isPlaying && (
        <>
          {totalStats && (
            <div className="flex justify-center gap-4 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg px-3 py-2">
              <span>📝 {totalStats.rounds} sentences</span>
              <span>⌨️ Avg {totalStats.avgWpm} WPM</span>
              <span>🎯 Avg {totalStats.avgAcc}%</span>
              <span>📊 {totalStats.totalChars} chars</span>
            </div>
          )}
          <div className="flex justify-between items-center text-sm mb-2">
            <span>WPM: <strong className="text-green-600">{practiceWpm}</strong></span>
            <span>Accuracy: <strong className="text-blue-600">{practiceAccuracy}%</strong></span>
            <span>Progress: <strong>{practiceInput.length}</strong>/{practiceText.length}</span>
          </div>

          {/* Original text */}
          <Card variant="bordered" className="p-4 font-mono text-lg leading-relaxed">
            {renderPracticeText()}
          </Card>

          {/* Input area */}
          <textarea
            ref={practiceInputRef}
            value={practiceInput}
            onChange={handlePracticeInput}
            placeholder="Type the sentence above..."
            className="w-full px-4 py-3 text-lg border-2 border-blue-300 dark:border-blue-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-white font-mono resize-none"
            rows={4}
            spellCheck={false}
            disabled={practiceComplete}
          />

          {practiceComplete && (
            <Card variant="bordered" className="p-4 text-center bg-green-50 dark:bg-green-900/20">
              <p className="text-xl font-bold text-green-600 mb-2">Complete!</p>
              <div className="flex justify-center gap-6 text-sm">
                <span>WPM: <strong>{practiceWpm}</strong></span>
                <span>Accuracy: <strong>{practiceAccuracy}%</strong></span>
              </div>
              <p className="text-xs text-gray-400 mt-2">Next sentence in 3 seconds...</p>
              <div className="flex justify-center gap-3 mt-3">
                <Button onClick={() => { setPracticeText(getNextText()); setPracticeInput(''); setPracticeStartTime(null); setPracticeComplete(false); setTimeout(() => practiceInputRef.current?.focus(), 100); }}>Next →</Button>
                <Button variant="secondary" onClick={() => setIsPlaying(false)}>Stop</Button>
              </div>
            </Card>
          )}

          {!practiceComplete && (
            <Button variant="secondary" onClick={() => setIsPlaying(false)}>
              Stop
            </Button>
          )}
        </>
      )}

      {/* Instructions */}
      {!isPlaying && (
        <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
          <p>Type the given sentence exactly as shown</p>
          <p>Your typing speed (WPM) is measured in real-time</p>
          <p>Incorrect characters are highlighted in red</p>
          <p>Focus on both accuracy and speed</p>
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
          ⌨️ What Is Typing Practice?
        </h2>
        <p className="text-sm leading-relaxed">
          Typing practice helps you improve your keyboard skills by typing real sentences.
          Unlike typing games, this tool focuses on practical typing ability that you can use in everyday work.
          Your typing speed (WPM) and accuracy are measured in real-time so you can track your progress objectively.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 WPM Reference Guide
        </h2>
        <div className="text-sm leading-relaxed">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Beginner</p>
              <p className="text-xs text-gray-500">20~35 WPM</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Intermediate</p>
              <p className="text-xs text-gray-500">35~60 WPM</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Advanced</p>
              <p className="text-xs text-gray-500">60~90 WPM</p>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="font-medium">Expert</p>
              <p className="text-xs text-gray-500">90+ WPM</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Effective Practice Tips
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li>Start slow and maintain 95%+ accuracy before increasing speed</li>
          <li>When you make a mistake, consciously check the key position</li>
          <li>Practicing 10 minutes daily is more effective than occasional long sessions</li>
          <li>Try different sentences to get comfortable with various letter combinations</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'What is the difference between typing practice and typing game?',
            answer: 'Typing practice focuses on real sentences to measure your actual typing ability, while the typing game uses survival, time attack, and other fun modes to make practice entertaining.',
          },
          {
            question: 'How is WPM calculated?',
            answer: 'WPM (Words Per Minute) counts each word as 5 characters. Your total characters typed divided by 5, then divided by elapsed minutes gives your WPM score.',
          },
          {
            question: 'What should I do if my accuracy is low?',
            answer: 'Slow down and focus on accuracy first. Maintain 95%+ accuracy and gradually increase your speed. This is the most effective approach for long-term improvement.',
          },
        ]}
      />
    </div>
  );
}
