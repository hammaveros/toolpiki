'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

interface Settings {
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  longBreakInterval: number;
}

const defaultSettings: Settings = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakInterval: 4,
};

const modeLabels: Record<TimerMode, string> = {
  work: 'Focus Time',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
};

const modeColors: Record<TimerMode, { bg: string; ring: string }> = {
  work: { bg: 'bg-red-50 dark:bg-red-900/20', ring: 'stroke-red-500' },
  shortBreak: { bg: 'bg-green-50 dark:bg-green-900/20', ring: 'stroke-green-500' },
  longBreak: { bg: 'bg-blue-50 dark:bg-blue-900/20', ring: 'stroke-blue-500' },
};

export function PomodoroTimerEn() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(defaultSettings.workMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const totalTime = useCallback(() => {
    switch (mode) {
      case 'work':
        return settings.workMinutes * 60;
      case 'shortBreak':
        return settings.shortBreakMinutes * 60;
      case 'longBreak':
        return settings.longBreakMinutes * 60;
    }
  }, [mode, settings]);

  const progress = ((totalTime() - timeLeft) / totalTime()) * 100;

  // Play notification
  const playNotification = useCallback(() => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleQUALI/Z5OJ2ChMvhuLq6XILGjF+5u/q8woaMYDn8+3wCxozgej07/ELGDKA6PTv8AoXMH/o9O/wChcvfuj07vAKFy595/Pu8AoXLX3n8+7wChct');
      }
      audioRef.current.play().catch(() => {});
    } catch {}
  }, []);

  // Handle timer completion
  const handleTimerComplete = useCallback(() => {
    playNotification();

    if (mode === 'work') {
      const newCount = completedPomodoros + 1;
      setCompletedPomodoros(newCount);

      // Check if long break interval reached
      if (newCount % settings.longBreakInterval === 0) {
        setMode('longBreak');
        setTimeLeft(settings.longBreakMinutes * 60);
      } else {
        setMode('shortBreak');
        setTimeLeft(settings.shortBreakMinutes * 60);
      }
    } else {
      setMode('work');
      setTimeLeft(settings.workMinutes * 60);
    }

    setIsRunning(false);
  }, [mode, completedPomodoros, settings, playNotification]);

  // Timer logic
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimerComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, handleTimerComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(totalTime());
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsRunning(false);
    switch (newMode) {
      case 'work':
        setTimeLeft(settings.workMinutes * 60);
        break;
      case 'shortBreak':
        setTimeLeft(settings.shortBreakMinutes * 60);
        break;
      case 'longBreak':
        setTimeLeft(settings.longBreakMinutes * 60);
        break;
    }
  };

  const updateSetting = (key: keyof Settings, value: number) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const colors = modeColors[mode];

  return (
    <div className="space-y-4">
      {/* Time Settings (Top) */}
      <Card variant="bordered" className="p-4">
        <div className="grid grid-cols-4 gap-3">
          <div className="text-center">
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Focus</label>
            <input
              type="number"
              value={settings.workMinutes}
              onChange={(e) => updateSetting('workMinutes', parseInt(e.target.value) || 25)}
              className="w-full px-2 py-2 text-center text-lg font-bold border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              min={1}
              max={99}
            />
            <span className="text-xs text-gray-400">min</span>
          </div>
          <div className="text-center">
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Short</label>
            <input
              type="number"
              value={settings.shortBreakMinutes}
              onChange={(e) => updateSetting('shortBreakMinutes', parseInt(e.target.value) || 5)}
              className="w-full px-2 py-2 text-center text-lg font-bold border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              min={1}
              max={99}
            />
            <span className="text-xs text-gray-400">min</span>
          </div>
          <div className="text-center">
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Long</label>
            <input
              type="number"
              value={settings.longBreakMinutes}
              onChange={(e) => updateSetting('longBreakMinutes', parseInt(e.target.value) || 15)}
              className="w-full px-2 py-2 text-center text-lg font-bold border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              min={1}
              max={99}
            />
            <span className="text-xs text-gray-400">min</span>
          </div>
          <div className="text-center">
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Interval</label>
            <input
              type="number"
              value={settings.longBreakInterval}
              onChange={(e) => updateSetting('longBreakInterval', parseInt(e.target.value) || 4)}
              className="w-full px-2 py-2 text-center text-lg font-bold border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              min={1}
              max={10}
            />
            <span className="text-xs text-gray-400">cycles</span>
          </div>
        </div>
      </Card>

      {/* Mode Selection */}
      <Card variant="bordered" className="p-2">
        <div className="flex gap-1">
          {(['work', 'shortBreak', 'longBreak'] as TimerMode[]).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                mode === m
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {modeLabels[m]}
            </button>
          ))}
        </div>
      </Card>

      {/* Timer */}
      <Card variant="bordered" className={`p-8 ${colors.bg}`}>
        <div className="flex flex-col items-center">
          {/* Circular Progress */}
          <div className="relative w-64 h-64">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="120"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="128"
                cy="128"
                r="120"
                fill="none"
                strokeWidth="8"
                strokeLinecap="round"
                className={colors.ring}
                strokeDasharray={2 * Math.PI * 120}
                strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold text-gray-800 dark:text-white font-mono">
                {formatTime(timeLeft)}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 mt-2">{modeLabels[mode]}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex gap-3 mt-6">
            <Button onClick={toggleTimer} size="lg" className="w-32">
              {isRunning ? 'Pause' : 'Start'}
            </Button>
            <Button onClick={resetTimer} variant="secondary" size="lg">
              Reset
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <Card variant="bordered" className="p-4">
        <div>
          <span className="text-sm text-gray-500">Completed Pomodoros</span>
          <div className="flex items-center gap-2 mt-1">
            {Array.from({ length: Math.min(completedPomodoros, 8) }).map((_, i) => (
              <span key={i} className="text-xl">🍅</span>
            ))}
            {completedPomodoros > 8 && (
              <span className="text-sm text-gray-500">+{completedPomodoros - 8}</span>
            )}
            {completedPomodoros === 0 && <span className="text-gray-400 text-sm">None yet</span>}
          </div>
        </div>
      </Card>

      {/* Description */}
      <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
        <p>• Pomodoro Technique: 25 min focus → 5 min break, repeat</p>
        <p>• After 4 cycles, take a long break (15 min)</p>
        <p>• A notification sound plays when timer completes</p>
      </div>

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🍅 What is Pomodoro Timer?
        </h2>
        <p className="text-sm leading-relaxed">
          The Pomodoro Technique is a time management method alternating 25-minute focus sessions with 5-minute breaks.
          Created by Francesco Cirillo in the 1980s, it takes its name from his tomato-shaped kitchen timer.
          This tool lets you customize focus time, short breaks, and long breaks, with a circular progress display to visualize progress.
          After 4 completed cycles, it automatically switches to a long break (15 min) to maintain sustainable focus.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 Pomodoro Cycle Structure
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Phase</th>
                <th className="text-left py-2 px-2">Default Time</th>
                <th className="text-left py-2 px-2">Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Focus Time</td><td>25 min</td><td>Deep work on single task</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Short Break</td><td>5 min</td><td>Brain recharge, stretching</td></tr>
              <tr><td className="py-2 px-2 font-medium">Long Break</td><td>15 min</td><td>Full recovery after 4 cycles</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Tips for Maximum Effectiveness
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Single task</strong>: Work on only one task during focus time</li>
          <li><strong>Block distractions</strong>: Disable notifications, enable focus mode</li>
          <li><strong>Honor breaks</strong>: Look away from screens during short breaks</li>
          <li><strong>Track progress</strong>: Monitor completed pomodoros to gauge productivity</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Can I adjust the 25-minute focus time?',
            answer: 'Yes, you can freely customize focus and break durations in the settings above. Beginners may start with 15 minutes and gradually increase.',
          },
          {
            question: 'What if I get interrupted during a pomodoro?',
            answer: 'For short interruptions (under 2 min), continue your session. For longer interruptions, void the pomodoro and restart fresh.',
          },
          {
            question: 'How many pomodoros per day is ideal?',
            answer: 'Typically 8-12 pomodoros (4-6 hours) is a realistic goal. Start with 4 and gradually increase as you build the habit.',
          },
        ]}
      />
    </div>
  );
}
