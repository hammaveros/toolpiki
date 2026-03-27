'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils/cn';
import { FaqSection } from '@/components/ui/FaqItem';

type Mode = 'timer' | 'stopwatch' | 'pomodoro';
type PomodoroPhase = 'work' | 'shortBreak' | 'longBreak';

const POMODORO_TIMES = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0) {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function formatStopwatch(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const centiseconds = Math.floor((ms % 1000) / 10);

  if (h > 0) {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  }
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
}

export function TimerEn() {
  const [mode, setMode] = useState<Mode>('timer');

  // Timer state
  const [timerMinutes, setTimerMinutes] = useState(5);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRemaining, setTimerRemaining] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  // Stopwatch state
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const stopwatchStartRef = useRef<number>(0);
  const stopwatchAccumulatedRef = useRef<number>(0);

  // Pomodoro state
  const [pomodoroPhase, setPomodoroPhase] = useState<PomodoroPhase>('work');
  const [pomodoroRemaining, setPomodoroRemaining] = useState(POMODORO_TIMES.work);
  const [pomodoroRunning, setPomodoroRunning] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);

  // Timer logic
  useEffect(() => {
    if (!timerRunning || timerRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimerRemaining((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          if (typeof window !== 'undefined' && 'Notification' in window) {
            new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2Onp6Xkop+c29uc3+KlZqZlI2Dfnl4fIOOmZ6emZKLgXt4eHyDjpmfnpmSioB7eHh9hI+aoJ6ZkYh+eXl6f4aSmp+dmI+GfHl5e4GHkpqdm5aNg3x5eXyCiJObnZuUjIJ8eXl+g4mUm52ak4uBe3l5f4SKlJycmpKKgHp5en+EipWcnJmRiX96eXqAhYuVnJyZkIh+enp6gYaLlZybmJCHfXp6e4GGjJacm5iQhn16ent/hoyWnJuXj4Z9enp7gIaMlpyblo+FfHp6e4CHjZacm5WOhHx6enuAh42WnJuVjYN8enp7gIeNlpyblI2De3p6e4CHjZacm5SNg3t6').play().catch(() => {});
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRunning, timerRemaining]);

  // Stopwatch logic
  useEffect(() => {
    if (!stopwatchRunning) return;

    const interval = setInterval(() => {
      setStopwatchTime(stopwatchAccumulatedRef.current + (Date.now() - stopwatchStartRef.current));
    }, 10);

    return () => clearInterval(interval);
  }, [stopwatchRunning]);

  // Pomodoro logic
  useEffect(() => {
    if (!pomodoroRunning || pomodoroRemaining <= 0) return;

    const interval = setInterval(() => {
      setPomodoroRemaining((prev) => {
        if (prev <= 1) {
          if (pomodoroPhase === 'work') {
            const newCount = pomodoroCount + 1;
            setPomodoroCount(newCount);
            if (newCount % 4 === 0) {
              setPomodoroPhase('longBreak');
              return POMODORO_TIMES.longBreak;
            } else {
              setPomodoroPhase('shortBreak');
              return POMODORO_TIMES.shortBreak;
            }
          } else {
            setPomodoroPhase('work');
            return POMODORO_TIMES.work;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [pomodoroRunning, pomodoroRemaining, pomodoroPhase, pomodoroCount]);

  const startTimer = useCallback(() => {
    const total = timerMinutes * 60 + timerSeconds;
    if (total > 0) {
      setTimerRemaining(total);
      setTimerRunning(true);
    }
  }, [timerMinutes, timerSeconds]);

  const startStopwatch = useCallback(() => {
    stopwatchStartRef.current = Date.now();
    setStopwatchRunning(true);
  }, []);

  const pauseStopwatch = useCallback(() => {
    stopwatchAccumulatedRef.current = stopwatchTime;
    setStopwatchRunning(false);
  }, [stopwatchTime]);

  const resetStopwatch = useCallback(() => {
    setStopwatchRunning(false);
    setStopwatchTime(0);
    stopwatchAccumulatedRef.current = 0;
    setLaps([]);
  }, []);

  const addLap = useCallback(() => {
    setLaps((prev) => [stopwatchTime, ...prev]);
  }, [stopwatchTime]);

  return (
    <div className="space-y-2">
      {/* Mode selection */}
      <div className="flex gap-2">
        {(['timer', 'stopwatch', 'pomodoro'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              'flex-1 py-2 px-4 rounded-lg font-medium transition-colors',
              mode === m
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            )}
          >
            {m === 'timer' && 'Timer'}
            {m === 'stopwatch' && 'Stopwatch'}
            {m === 'pomodoro' && 'Pomodoro'}
          </button>
        ))}
      </div>

      {/* Timer */}
      {mode === 'timer' && (
        <Card variant="bordered" className="p-6">
          {!timerRunning && timerRemaining === 0 ? (
            <div className="space-y-6">
              <div className="flex justify-center gap-4">
                <div className="text-center">
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">Min</label>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={timerMinutes}
                    onChange={(e) => setTimerMinutes(Math.max(0, Math.min(99, parseInt(e.target.value) || 0)))}
                    className="w-20 text-center text-3xl font-mono p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
                <span className="text-3xl font-mono self-end pb-2">:</span>
                <div className="text-center">
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">Sec</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={timerSeconds}
                    onChange={(e) => setTimerSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                    className="w-20 text-center text-3xl font-mono p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-center">
                {[1, 3, 5, 10, 15, 30].map((m) => (
                  <button
                    key={m}
                    onClick={() => { setTimerMinutes(m); setTimerSeconds(0); }}
                    className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    {m}m
                  </button>
                ))}
              </div>
              <Button onClick={startTimer} className="w-full">Start</Button>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="text-6xl font-mono font-bold text-gray-900 dark:text-white">
                {formatTime(timerRemaining)}
              </div>
              <div className="flex gap-4 justify-center">
                {timerRunning ? (
                  <Button onClick={() => setTimerRunning(false)} variant="secondary">Pause</Button>
                ) : (
                  <Button onClick={() => setTimerRunning(true)}>Resume</Button>
                )}
                <Button onClick={() => { setTimerRunning(false); setTimerRemaining(0); }} variant="secondary">
                  Reset
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Stopwatch */}
      {mode === 'stopwatch' && (
        <Card variant="bordered" className="p-6">
          <div className="text-center space-y-6">
            <div className="text-5xl font-mono font-bold text-gray-900 dark:text-white">
              {formatStopwatch(stopwatchTime)}
            </div>
            <div className="flex gap-4 justify-center">
              {!stopwatchRunning ? (
                <Button onClick={startStopwatch}>{stopwatchTime > 0 ? 'Resume' : 'Start'}</Button>
              ) : (
                <Button onClick={pauseStopwatch} variant="secondary">Pause</Button>
              )}
              {stopwatchRunning && (
                <Button onClick={addLap} variant="secondary">Lap</Button>
              )}
              {stopwatchTime > 0 && !stopwatchRunning && (
                <Button onClick={resetStopwatch} variant="secondary">Reset</Button>
              )}
            </div>
          </div>
          {laps.length > 0 && (
            <div className="mt-6 max-h-40 overflow-y-auto">
              {laps.map((lap, i) => (
                <div key={i} className="flex justify-between py-2 border-b dark:border-gray-700 text-sm">
                  <span className="text-gray-500">Lap {laps.length - i}</span>
                  <span className="font-mono">{formatStopwatch(lap)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Pomodoro */}
      {mode === 'pomodoro' && (
        <Card variant="bordered" className="p-6">
          <div className="text-center space-y-6">
            <div className={cn(
              'text-lg font-medium',
              pomodoroPhase === 'work' && 'text-red-600 dark:text-red-400',
              pomodoroPhase === 'shortBreak' && 'text-green-600 dark:text-green-400',
              pomodoroPhase === 'longBreak' && 'text-blue-600 dark:text-blue-400'
            )}>
              {pomodoroPhase === 'work' && 'Focus Time'}
              {pomodoroPhase === 'shortBreak' && 'Short Break'}
              {pomodoroPhase === 'longBreak' && 'Long Break'}
            </div>
            <div className="text-6xl font-mono font-bold text-gray-900 dark:text-white">
              {formatTime(pomodoroRemaining)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Completed: {pomodoroCount} pomodoros
            </div>
            <div className="flex gap-4 justify-center">
              {pomodoroRunning ? (
                <Button onClick={() => setPomodoroRunning(false)} variant="secondary">Pause</Button>
              ) : (
                <Button onClick={() => setPomodoroRunning(true)}>
                  {pomodoroRemaining === POMODORO_TIMES[pomodoroPhase] ? 'Start' : 'Resume'}
                </Button>
              )}
              <Button
                onClick={() => {
                  setPomodoroRunning(false);
                  setPomodoroPhase('work');
                  setPomodoroRemaining(POMODORO_TIMES.work);
                  setPomodoroCount(0);
                }}
                variant="secondary"
              >
                Reset
              </Button>
            </div>
          </div>
        </Card>
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
          ⏱️ What is Timer & Stopwatch?
        </h2>
        <p className="text-sm leading-relaxed">
          An all-in-one time management tool combining timer, stopwatch, and Pomodoro functionality.
          Perfect for cooking, exercise, study, work, and any situation requiring precise time tracking.
          Quick preset buttons let you set common durations like 1, 3, or 5 minutes with a single click.
          The stopwatch lap feature records interval times for comparison and analysis.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 Mode Comparison
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Mode</th>
                <th className="text-left py-2 px-2">Features</th>
                <th className="text-left py-2 px-2">Use Cases</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Timer</td><td>Countdown, alerts</td><td>Cooking, breaks, presentations</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Stopwatch</td><td>Elapsed time, laps</td><td>Exercise, races, task timing</td></tr>
              <tr><td className="py-2 px-2 font-medium">Pomodoro</td><td>25 min focus + 5 min break</td><td>Study, work productivity</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Effective Time Management Tips
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Timer</strong>: Setting time limits before tasks improves focus and efficiency</li>
          <li><strong>Stopwatch</strong>: Measure repetitive tasks to identify improvement opportunities</li>
          <li><strong>Pomodoro</strong>: After 4 cycles (2 hours), take a 15-minute long break</li>
          <li><strong>Lap feature</strong>: Use for interval training to track segment times</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Does the timer play an alert sound?',
            answer: 'Yes, an alert plays when the timer reaches zero. Ensure your browser sound settings are enabled.',
          },
          {
            question: 'Does the timer continue if I close the page?',
            answer: 'No, closing the browser tab stops the timer. Keep the tab open for background operation.',
          },
          {
            question: 'Are stopwatch lap records saved?',
            answer: 'Lap records persist only during the current session. Refreshing the page resets them, and nothing is saved to any server.',
          },
        ]}
      />
    </div>
  );
}
