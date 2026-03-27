'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { ResultShareButtonsEn } from '@/components/share/ResultShareButtonsEn';
import { cn } from '@/lib/utils/cn';
import { siteConfig } from '@/data/site';
import { FaqSection } from '@/components/ui/FaqItem';

type GameState = 'idle' | 'waiting' | 'go' | 'tooSoon' | 'result';

interface RoundResult {
  round: number;
  time: number;
}

const TOTAL_ROUNDS = 5;
const MIN_DELAY = 800;
const MAX_DELAY = 2500;

function getSecureRandomDelay(): number {
  if (typeof window !== 'undefined' && window.crypto) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return MIN_DELAY + (array[0] % (MAX_DELAY - MIN_DELAY + 1));
  }
  return MIN_DELAY + Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY + 1));
}

export function ReactionTimeTestEn() {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [results, setResults] = useState<RoundResult[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [lastTime, setLastTime] = useState<number>(0);
  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimeouts = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearTimeouts();
  }, [clearTimeouts]);

  const startRound = useCallback(() => {
    clearTimeouts();
    setGameState('waiting');

    const delay = getSecureRandomDelay();
    timeoutRef.current = setTimeout(() => {
      setGameState('go');
      startTimeRef.current = performance.now();
    }, delay);
  }, [clearTimeouts]);

  const handleClick = useCallback(() => {
    if (gameState === 'idle') {
      setResults([]);
      setCurrentRound(1);
      setLastTime(0);
      startRound();
      return;
    }

    if (gameState === 'waiting') {
      clearTimeouts();
      setGameState('tooSoon');
      return;
    }

    if (gameState === 'go') {
      const endTime = performance.now();
      const reactionTime = Math.round(endTime - startTimeRef.current);

      const newResult: RoundResult = {
        round: currentRound,
        time: reactionTime,
      };

      const newResults = [...results, newResult];
      setResults(newResults);
      setLastTime(reactionTime);

      if (currentRound >= TOTAL_ROUNDS) {
        setGameState('result');
      } else {
        // Go directly to next round (show previous result in waiting state)
        setCurrentRound((prev) => prev + 1);
        startRound();
      }
      return;
    }

    if (gameState === 'tooSoon') {
      setResults([]);
      setCurrentRound(1);
      setLastTime(0);
      startRound();
      return;
    }

    if (gameState === 'result') {
      setGameState('idle');
      setResults([]);
      setCurrentRound(0);
      setLastTime(0);
    }
  }, [gameState, currentRound, results, startRound, clearTimeouts]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return; // Prevent key repeat
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        handleClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [handleClick]);

  const stats = results.length > 0 ? {
    average: Math.round(results.reduce((sum, r) => sum + r.time, 0) / results.length),
    min: Math.min(...results.map(r => r.time)),
    max: Math.max(...results.map(r => r.time)),
  } : null;

  const getResultText = () => {
    if (!stats) return '';
    return `Reaction Time Test Results\nAverage: ${stats.average}ms\nMin: ${stats.min}ms\nMax: ${stats.max}ms\n\nRounds:\n${results.map(r => `Round ${r.round}: ${r.time}ms`).join('\n')}`;
  };

  const getShareUrl = () => {
    if (!stats || results.length === 0) return '';
    const data = { results: results.map(r => r.time), avg: stats.average };
    const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
    return `${siteConfig.url}/en/tools/reaction-time-test#share=${encoded}`;
  };

  // Restore shared data from URL hash
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (hash.startsWith('#share=')) {
      try {
        const decoded = decodeURIComponent(atob(hash.slice(7)));
        const parsed = JSON.parse(decoded);
        if (parsed.results && Array.isArray(parsed.results)) {
          const restoredResults: RoundResult[] = parsed.results.map((time: number, idx: number) => ({
            round: idx + 1,
            time,
          }));
          setResults(restoredResults);
          setGameState('result');
          setCurrentRound(parsed.results.length);
          // Remove hash
          window.history.replaceState(null, '', window.location.pathname);
        }
      } catch {
        // Ignore invalid hash
      }
    }
  }, []);

  const getReactionRating = (ms: number) => {
    if (ms < 250) return { label: 'Very Fast', color: 'text-emerald-600 dark:text-emerald-400' };
    if (ms < 300) return { label: 'Fast', color: 'text-green-600 dark:text-green-400' };
    if (ms < 350) return { label: 'Average', color: 'text-yellow-600 dark:text-yellow-400' };
    return { label: 'Slow', color: 'text-orange-600 dark:text-orange-400' };
  };

  return (
    <div className="space-y-2">
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => {
          // Handle keyboard events only at window level (prevent duplicates)
          e.preventDefault();
        }}
        className={cn(
          'relative w-full aspect-[2.5/1] min-h-[200px] rounded-2xl cursor-pointer select-none',
          'flex flex-col items-center justify-center gap-4 transition-colors duration-150',
          'focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2',
          gameState === 'idle' && 'bg-slate-100 dark:bg-slate-800 focus-visible:ring-slate-400',
          gameState === 'waiting' && 'bg-amber-100 dark:bg-amber-900/40 focus-visible:ring-amber-400',
          gameState === 'go' && 'bg-emerald-100 dark:bg-emerald-900/40 focus-visible:ring-emerald-400',
          gameState === 'tooSoon' && 'bg-rose-100 dark:bg-rose-900/30 focus-visible:ring-rose-400',
          gameState === 'result' && 'bg-blue-100 dark:bg-blue-900/30 focus-visible:ring-blue-400'
        )}
      >
        {gameState === 'idle' && (
          <>
            <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
              <TargetIcon className="w-6 h-6 text-slate-500 dark:text-slate-400" />
            </div>
            <div className="text-center px-4">
              <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                Click to Start
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Click, tap, or press spacebar
              </p>
            </div>
          </>
        )}

        {gameState === 'waiting' && (
          <>
            <div className="w-12 h-12 rounded-full bg-amber-200 dark:bg-amber-800/50 flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="text-center px-4">
              <p className="text-lg font-semibold text-amber-700 dark:text-amber-300">
                Wait for green...
              </p>
              <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                Round {currentRound} / {TOTAL_ROUNDS}
              </p>
              {lastTime > 0 && (
                <p className={cn('text-sm mt-2', getReactionRating(lastTime).color)}>
                  Previous: {lastTime}ms ({getReactionRating(lastTime).label})
                </p>
              )}
            </div>
          </>
        )}

        {gameState === 'go' && (
          <>
            <div className="w-12 h-12 rounded-full bg-emerald-200 dark:bg-emerald-800/50 flex items-center justify-center">
              <BoltIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
              Click Now!
            </p>
          </>
        )}

        {gameState === 'tooSoon' && (
          <>
            <div className="w-12 h-12 rounded-full bg-rose-200 dark:bg-rose-800/40 flex items-center justify-center">
              <XIcon className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            </div>
            <div className="text-center px-4">
              <p className="text-lg font-semibold text-rose-700 dark:text-rose-300">
                Too Soon!
              </p>
              <p className="text-sm text-rose-600 dark:text-rose-400 mt-1">
                Starting over...
              </p>
              <p className="text-xs text-rose-500 dark:text-rose-500 mt-2">
                Click to restart
              </p>
            </div>
          </>
        )}

        {gameState === 'result' && stats && (
          <>
            <div className="w-12 h-12 rounded-full bg-blue-200 dark:bg-blue-800/50 flex items-center justify-center">
              <TrophyIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-center px-4">
              <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                {stats.average}ms
              </p>
              <p className={cn('text-lg font-medium mt-1', getReactionRating(stats.average).color)}>
                {getReactionRating(stats.average).label}
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                Click to try again
              </p>
            </div>
          </>
        )}
      </div>

      {results.length > 0 && (
        <Card variant="bordered" className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Results
            </h3>
            {gameState === 'result' && (
              <CopyButton text={getResultText()} label="Copy" />
            )}
          </div>

          {stats && (
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <p className="text-sm text-slate-500 dark:text-slate-400">Average</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.average}ms</p>
              </div>
              <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                <p className="text-sm text-emerald-600 dark:text-emerald-400">Min</p>
                <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{stats.min}ms</p>
              </div>
              <div className="text-center p-4 bg-rose-50 dark:bg-rose-900/20 rounded-xl">
                <p className="text-sm text-rose-600 dark:text-rose-400">Max</p>
                <p className="text-2xl font-bold text-rose-700 dark:text-rose-300">{stats.max}ms</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {results.map((result) => (
              <div
                key={result.round}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
              >
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Round {result.round}
                </span>
                <span className={cn('font-mono font-semibold', getReactionRating(result.time).color)}>
                  {result.time}ms
                </span>
              </div>
            ))}
          </div>

          {gameState === 'result' && stats && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <ResultShareButtonsEn
                url={getShareUrl()}
                title={`Reaction Time Test: Average ${stats.average}ms`}
                description={`Min ${stats.min}ms, Max ${stats.max}ms - JSSpace`}
              />
            </div>
          )}
        </Card>
      )}

      <SeoContent />
    </div>
  );
}

function TargetIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="M12 7v5l3 3" />
    </svg>
  );
}

function BoltIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3h14v4a7 7 0 01-14 0V3z" />
      <path strokeLinecap="round" d="M12 14v4m-3 3h6" />
      <path strokeLinecap="round" d="M5 5H3a1 1 0 00-1 1v2a4 4 0 004 4m14-7h2a1 1 0 011 1v2a4 4 0 01-4 4" />
    </svg>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          ⚡ What is Reaction Time Test?
        </h2>
        <p className="text-sm leading-relaxed">
          Reaction Time Test measures how quickly you respond to visual stimuli in milliseconds (ms).
          Click as fast as you can when the screen turns green across 5 rounds to get your average reaction time.
          Average adult reaction time is 200-300ms, while professional gamers can achieve under 150ms.
          Share your results to compare with friends or track your improvement over time.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 Reaction Time Benchmarks
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Response Time</th>
                <th className="text-left py-2 px-2">Rating</th>
                <th className="text-left py-2 px-2">Typical Group</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">Under 150ms</td><td className="font-medium text-emerald-600">Elite</td><td>Pro gamers, athletes</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">150-200ms</td><td className="font-medium text-green-600">Very Fast</td><td>Experienced gamers</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">200-250ms</td><td className="font-medium text-blue-600">Fast</td><td>Casual gamers</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">250-300ms</td><td className="font-medium text-yellow-600">Average</td><td>General adults</td></tr>
              <tr><td className="py-2 px-2 font-mono">Over 300ms</td><td className="font-medium text-orange-600">Slow</td><td>Room for improvement</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Tips to Improve Reaction Time
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Get enough sleep</strong>: Fatigue can slow reaction time by 20-30%</li>
          <li><strong>Moderate caffeine</strong>: Can temporarily improve reaction speed</li>
          <li><strong>High refresh monitor</strong>: 144Hz+ displays reduce visual latency</li>
          <li><strong>Regular practice</strong>: Consistent training can measurably improve speed</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Is reaction time genetic or can it be trained?',
            answer: 'Basic nerve conduction speed is genetic, but prediction and decision-making speed can be improved through training. Even pro gamers improve their reaction times through consistent practice.',
          },
          {
            question: 'Does reaction time decrease with age?',
            answer: 'Yes, reaction time typically starts declining after mid-20s. However, regular exercise and cognitive activities can slow this decline significantly.',
          },
          {
            question: 'Why are my mobile and PC results different?',
            answer: 'Input device latency differs. Touchscreens have 10-50ms delay while mice have 1-10ms delay, so PC results may appear faster.',
          },
        ]}
      />
    </div>
  );
}
