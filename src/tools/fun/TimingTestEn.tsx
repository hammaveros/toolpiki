'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ResultShareButtonsEn } from '@/components/share/ResultShareButtonsEn';
import { siteConfig } from '@/data/site';
import { FaqSection } from '@/components/ui/FaqItem';

type GameMode = '5' | '10' | '30';

export function TimingTestEn() {
  const [gameState, setGameState] = useState<'ready' | 'counting' | 'result'>('ready');
  const [mode, setMode] = useState<GameMode>('10');
  const [startTime, setStartTime] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [results, setResults] = useState<number[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const targetSeconds = parseInt(mode);

  const startGame = () => {
    setGameState('counting');
    setStartTime(Date.now());
    setElapsed(0);

    intervalRef.current = setInterval(() => {
      setElapsed(Date.now() - Date.now());
    }, 100);
  };

  const stopGame = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const finalTime = (Date.now() - startTime) / 1000;
    setElapsed(finalTime);
    setResults((prev) => [...prev, finalTime]);
    setGameState('result');
  };

  const resetGame = () => {
    setGameState('ready');
    setElapsed(0);
  };

  const clearResults = () => {
    setResults([]);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const getDifference = () => {
    const diff = elapsed - targetSeconds;
    return diff;
  };

  const getAccuracyMessage = () => {
    const diff = Math.abs(getDifference());
    if (diff < 0.1) return 'Perfect! Incredible timing sense!';
    if (diff < 0.3) return 'Excellent! Almost perfect!';
    if (diff < 0.5) return 'Great! Pretty accurate!';
    if (diff < 1) return 'Good! A little more practice';
    if (diff < 2) return 'Not bad... Try to focus more';
    return 'Way off! Try again!';
  };

  const getAccuracyColor = () => {
    const diff = Math.abs(getDifference());
    if (diff < 0.3) return 'text-green-600 dark:text-green-400';
    if (diff < 1) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const averageResult = results.length > 0
    ? results.reduce((a, b) => a + b, 0) / results.length
    : 0;

  const bestResult = results.length > 0
    ? results.reduce((best, curr) => {
        const bestDiff = Math.abs(best - targetSeconds);
        const currDiff = Math.abs(curr - targetSeconds);
        return currDiff < bestDiff ? curr : best;
      })
    : 0;

  const getShareUrl = () => {
    const data = { target: targetSeconds, elapsed: elapsed.toFixed(3), diff: getDifference().toFixed(3) };
    const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
    return `${siteConfig.url}/en/tools/timing-test#share=${encoded}`;
  };

  // Restore shared data from URL hash
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (hash.startsWith('#share=')) {
      try {
        const decoded = decodeURIComponent(atob(hash.slice(7)));
        const parsed = JSON.parse(decoded);
        if (parsed.target && parsed.elapsed) {
          setMode(parsed.target.toString() as GameMode);
          setElapsed(parseFloat(parsed.elapsed));
          setGameState('result');
          window.history.replaceState(null, '', window.location.pathname);
        }
      } catch {
        // Ignore invalid hash
      }
    }
  }, []);

  return (
    <div className="space-y-2">
      {/* Mode Selection */}
      <div className="flex justify-center gap-2">
        {(['5', '10', '30'] as GameMode[]).map((m) => (
          <Button
            key={m}
            variant={mode === m ? 'primary' : 'secondary'}
            onClick={() => setMode(m)}
            disabled={gameState === 'counting'}
          >
            {m}s
          </Button>
        ))}
      </div>

      {/* Game Area */}
      <Card variant="bordered" className="p-4 md:p-6 text-center min-h-[250px] flex flex-col justify-center">
        {gameState === 'ready' && (
          <>
            <h2 className="text-2xl font-bold mb-4">Guess {targetSeconds} Seconds</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Press start, then press stop when you think<br />
              exactly {targetSeconds} seconds have passed!
            </p>
            <Button onClick={startGame} size="lg">
              Start
            </Button>
          </>
        )}

        {gameState === 'counting' && (
          <>
            <div className="text-6xl mb-8">🙈</div>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
              Counting to {targetSeconds} seconds...
            </p>
            <Button onClick={stopGame} size="lg" className="bg-red-500 hover:bg-red-600">
              Stop!
            </Button>
          </>
        )}

        {gameState === 'result' && (
          <>
            <p className="text-sm text-gray-500 mb-2">Target: {targetSeconds}s</p>
            <p className={`text-5xl font-bold mb-2 ${getAccuracyColor()}`}>
              {elapsed.toFixed(3)}s
            </p>
            <p className="text-lg mb-2">
              {getDifference() > 0 ? '+' : ''}{getDifference().toFixed(3)}s
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {getAccuracyMessage()}
            </p>
            <div className="mb-4">
              <ResultShareButtonsEn
                url={getShareUrl()}
                title={`Timing Test: ${targetSeconds}s target → ${elapsed.toFixed(3)}s`}
                description={`Difference ${Math.abs(getDifference()).toFixed(3)}s - JSSpace`}
              />
            </div>
            <Button onClick={resetGame}>
              Try Again
            </Button>
          </>
        )}
      </Card>

      {/* Records */}
      {results.length > 0 && (
        <Card variant="bordered" className="p-4">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-medium">Records ({results.length})</p>
            <Button variant="ghost" size="sm" onClick={clearResults}>
              Clear
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            <div>
              <p className="text-xs text-gray-500">Average</p>
              <p className="font-mono font-bold">{averageResult.toFixed(3)}s</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Best</p>
              <p className="font-mono font-bold text-green-600">{bestResult.toFixed(3)}s</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Best Diff</p>
              <p className="font-mono font-bold">
                {Math.abs(bestResult - targetSeconds).toFixed(3)}s
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {results.map((result, idx) => {
              const diff = Math.abs(result - targetSeconds);
              const color = diff < 0.3 ? 'bg-green-100 dark:bg-green-900/30'
                : diff < 1 ? 'bg-yellow-100 dark:bg-yellow-900/30'
                : 'bg-red-100 dark:bg-red-900/30';
              return (
                <span
                  key={idx}
                  className={`px-2 py-1 rounded text-xs font-mono ${color}`}
                >
                  {result.toFixed(2)}s
                </span>
              );
            })}
          </div>
        </Card>
      )}

      <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
        <p>• Try without looking at the screen - use your internal clock</p>
        <p>• Under 0.1s difference = incredible timing sense!</p>
      </div>
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          What is the Timing Test?
        </h2>
        <p className="text-sm leading-relaxed">
          The Timing Test is a time perception game that challenges you to guess exactly how long a specific duration has passed without looking at a clock or timer.
          Choose a target time of 5, 10, or 30 seconds, press start, then press stop when you feel the target time has elapsed.
          Your result is measured to 0.001 second (millisecond) precision, and statistics like average and best records are tracked.
          Test how accurate your internal body clock really is!
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          Accuracy Rating Chart
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-3 font-semibold">Difference</th>
                <th className="text-left py-2 px-3 font-semibold">Rating</th>
                <th className="text-left py-2 px-3 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-400">
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3 font-mono">&lt; 0.1s</td>
                <td className="py-2 px-3">Perfect</td>
                <td className="py-2 px-3">Incredible timing sense</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3 font-mono">0.1-0.3s</td>
                <td className="py-2 px-3">Excellent</td>
                <td className="py-2 px-3">Almost perfect accuracy</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3 font-mono">0.3-0.5s</td>
                <td className="py-2 px-3">Great</td>
                <td className="py-2 px-3">Pretty accurate</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3 font-mono">0.5-1s</td>
                <td className="py-2 px-3">Good</td>
                <td className="py-2 px-3">Average time sense</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3 font-mono">1-2s</td>
                <td className="py-2 px-3">Needs Work</td>
                <td className="py-2 px-3">Try to focus more</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-mono">&gt; 2s</td>
                <td className="py-2 px-3">Try Again</td>
                <td className="py-2 px-3">Way off - practice more</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          Tips to Improve Your Timing
        </h2>
        <ul className="text-sm space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
          <li>Count numbers in your head at a steady rhythm (one, two, three...)</li>
          <li>Use your heartbeat or breathing rhythm as a reference</li>
          <li>Start with short durations (5s) and gradually try longer ones</li>
          <li>Repeated practice helps calibrate your internal clock</li>
          <li>Losing focus can make time feel like it passes faster</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Why is the timer hidden during the test?',
            answer: 'The timer is intentionally hidden to test your true time perception. If you could see the clock, it would not be a genuine internal clock test. You must rely solely on your sense of time.',
          },
          {
            question: 'Which target time is the hardest?',
            answer: 'Generally, 30 seconds is the most difficult. Longer durations make it harder to maintain focus, and time distortion effects become more pronounced. 5 seconds is too short and affected by reaction time, while 10 seconds offers the most balanced challenge.',
          },
          {
            question: 'Are my records saved?',
            answer: 'Only the current session records are displayed on screen - they reset when you refresh the page. You can use the share feature to save and share specific results via a link.',
          },
        ]}
      />
    </div>
  );
}
