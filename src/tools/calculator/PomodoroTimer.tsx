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
  work: '집중 시간',
  shortBreak: '짧은 휴식',
  longBreak: '긴 휴식',
};

const modeColors: Record<TimerMode, { bg: string; ring: string }> = {
  work: { bg: 'bg-red-50 dark:bg-red-900/20', ring: 'stroke-red-500' },
  shortBreak: { bg: 'bg-green-50 dark:bg-green-900/20', ring: 'stroke-green-500' },
  longBreak: { bg: 'bg-blue-50 dark:bg-blue-900/20', ring: 'stroke-blue-500' },
};

export function PomodoroTimer() {
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

  // 알림 재생
  const playNotification = useCallback(() => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleQUALI/Z5OJ2ChMvhuLq6XILGjF+5u/q8woaMYDn8+3wCxozgej07/ELGDKA6PTv8AoXMH/o9O/wChcvfuj07vAKFy595/Pu8AoXLX3n8+7wChct');
      }
      audioRef.current.play().catch(() => {});
    } catch {}
  }, []);

  // 타이머 완료 처리
  const handleTimerComplete = useCallback(() => {
    playNotification();

    if (mode === 'work') {
      const newCount = completedPomodoros + 1;
      setCompletedPomodoros(newCount);

      // 긴 휴식 간격에 도달했는지 확인
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

  // 타이머 로직
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
      {/* 시간 설정 (상단) */}
      <Card variant="bordered" className="p-4">
        <div className="grid grid-cols-4 gap-3">
          <div className="text-center">
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">집중</label>
            <input
              type="number"
              value={settings.workMinutes}
              onChange={(e) => updateSetting('workMinutes', parseInt(e.target.value) || 25)}
              className="w-full px-2 py-2 text-center text-lg font-bold border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              min={1}
              max={99}
            />
            <span className="text-xs text-gray-400">분</span>
          </div>
          <div className="text-center">
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">짧은휴식</label>
            <input
              type="number"
              value={settings.shortBreakMinutes}
              onChange={(e) => updateSetting('shortBreakMinutes', parseInt(e.target.value) || 5)}
              className="w-full px-2 py-2 text-center text-lg font-bold border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              min={1}
              max={99}
            />
            <span className="text-xs text-gray-400">분</span>
          </div>
          <div className="text-center">
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">긴휴식</label>
            <input
              type="number"
              value={settings.longBreakMinutes}
              onChange={(e) => updateSetting('longBreakMinutes', parseInt(e.target.value) || 15)}
              className="w-full px-2 py-2 text-center text-lg font-bold border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              min={1}
              max={99}
            />
            <span className="text-xs text-gray-400">분</span>
          </div>
          <div className="text-center">
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">긴휴식간격</label>
            <input
              type="number"
              value={settings.longBreakInterval}
              onChange={(e) => updateSetting('longBreakInterval', parseInt(e.target.value) || 4)}
              className="w-full px-2 py-2 text-center text-lg font-bold border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              min={1}
              max={10}
            />
            <span className="text-xs text-gray-400">회</span>
          </div>
        </div>
      </Card>

      {/* 모드 선택 */}
      <Card variant="bordered" className="p-2">
        <div className="flex gap-1">
          {(['work', 'shortBreak', 'longBreak'] as TimerMode[]).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                mode === m
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {modeLabels[m]}
            </button>
          ))}
        </div>
      </Card>

      {/* 타이머 */}
      <Card variant="bordered" className={`p-8 ${colors.bg}`}>
        <div className="flex flex-col items-center">
          {/* 원형 프로그레스 */}
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

          {/* 컨트롤 버튼 */}
          <div className="flex gap-3 mt-6">
            <Button onClick={toggleTimer} size="lg" className="w-32">
              {isRunning ? '일시정지' : '시작'}
            </Button>
            <Button onClick={resetTimer} variant="secondary" size="lg">
              초기화
            </Button>
          </div>
        </div>
      </Card>

      {/* 통계 */}
      <Card variant="bordered" className="p-4">
        <div>
          <span className="text-sm text-gray-500">완료한 뽀모도로</span>
          <div className="flex items-center gap-2 mt-1">
            {Array.from({ length: Math.min(completedPomodoros, 8) }).map((_, i) => (
              <span key={i} className="text-xl">🍅</span>
            ))}
            {completedPomodoros > 8 && (
              <span className="text-sm text-gray-500">+{completedPomodoros - 8}</span>
            )}
            {completedPomodoros === 0 && <span className="text-gray-400 text-sm">아직 없음</span>}
          </div>
        </div>
      </Card>

      {/* 설명 */}
      <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
        <p>• 뽀모도로 기법: 25분 집중 → 5분 휴식을 반복</p>
        <p>• 4회 완료 시 긴 휴식 (15분)</p>
        <p>• 타이머 완료 시 알림음이 재생됩니다</p>
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
          🍅 뽀모도로 타이머란?
        </h2>
        <p className="text-sm leading-relaxed">
          뽀모도로 기법은 25분 집중 후 5분 휴식을 반복하는 시간 관리 방법론입니다.
          1980년대 이탈리아의 프란체스코 시릴로가 토마토 모양 주방 타이머로 시작한 것에서 유래했습니다.
          이 도구는 집중 시간, 짧은 휴식, 긴 휴식을 자유롭게 설정할 수 있으며, 원형 프로그레스로 진행 상황을 시각적으로 확인합니다.
          4회 완료 시 자동으로 긴 휴식(15분)으로 전환되어 지속 가능한 집중력을 유지합니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 뽀모도로 기본 사이클
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">단계</th>
                <th className="text-left py-2 px-2">기본 시간</th>
                <th className="text-left py-2 px-2">목적</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">집중 시간</td><td>25분</td><td>한 가지 작업에 몰입</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">짧은 휴식</td><td>5분</td><td>뇌 재충전, 스트레칭</td></tr>
              <tr><td className="py-2 px-2 font-medium">긴 휴식</td><td>15분</td><td>4사이클 후 완전한 회복</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 뽀모도로 효과 극대화 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>한 가지 작업</strong>: 집중 시간에는 하나의 작업만 수행</li>
          <li><strong>방해 차단</strong>: 알림 끄기, 집중 모드 활성화</li>
          <li><strong>휴식 준수</strong>: 짧은 휴식에도 화면에서 눈을 떼기</li>
          <li><strong>기록 유지</strong>: 완료한 뽀모도로 수로 생산성 파악</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '25분이 너무 길거나 짧으면 조절해도 되나요?',
            answer: '네, 상단 설정에서 집중/휴식 시간을 자유롭게 조절할 수 있습니다. 초보자는 15분부터 시작해 점차 늘리는 것을 권장합니다.',
          },
          {
            question: '뽀모도로 중간에 방해받으면 어떻게 하나요?',
            answer: '짧은 방해(2분 이내)는 무시하고 계속하세요. 긴 방해는 뽀모도로를 무효 처리하고 다시 시작하는 것이 원칙입니다.',
          },
          {
            question: '하루에 몇 뽀모도로가 적당한가요?',
            answer: '일반적으로 8~12개(4~6시간)가 현실적인 목표입니다. 처음에는 4개부터 시작해 점차 늘려가세요.',
          },
        ]}
      />
    </div>
  );
}
