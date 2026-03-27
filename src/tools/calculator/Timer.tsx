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

export function Timer() {
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
          // 알림음
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
          // 다음 페이즈로
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
      {/* 모드 선택 */}
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
            {m === 'timer' && '타이머'}
            {m === 'stopwatch' && '스톱워치'}
            {m === 'pomodoro' && '뽀모도로'}
          </button>
        ))}
      </div>

      {/* 타이머 */}
      {mode === 'timer' && (
        <Card variant="bordered" className="p-6">
          {!timerRunning && timerRemaining === 0 ? (
            <div className="space-y-6">
              <div className="flex justify-center gap-4">
                <div className="text-center">
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">분</label>
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
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">초</label>
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
                    {m}분
                  </button>
                ))}
              </div>
              <Button onClick={startTimer} className="w-full">시작</Button>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="text-6xl font-mono font-bold text-gray-900 dark:text-white">
                {formatTime(timerRemaining)}
              </div>
              <div className="flex gap-4 justify-center">
                {timerRunning ? (
                  <Button onClick={() => setTimerRunning(false)} variant="secondary">일시정지</Button>
                ) : (
                  <Button onClick={() => setTimerRunning(true)}>계속</Button>
                )}
                <Button onClick={() => { setTimerRunning(false); setTimerRemaining(0); }} variant="secondary">
                  초기화
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* 스톱워치 */}
      {mode === 'stopwatch' && (
        <Card variant="bordered" className="p-6">
          <div className="text-center space-y-6">
            <div className="text-5xl font-mono font-bold text-gray-900 dark:text-white">
              {formatStopwatch(stopwatchTime)}
            </div>
            <div className="flex gap-4 justify-center">
              {!stopwatchRunning ? (
                <Button onClick={startStopwatch}>{stopwatchTime > 0 ? '계속' : '시작'}</Button>
              ) : (
                <Button onClick={pauseStopwatch} variant="secondary">일시정지</Button>
              )}
              {stopwatchRunning && (
                <Button onClick={addLap} variant="secondary">랩</Button>
              )}
              {stopwatchTime > 0 && !stopwatchRunning && (
                <Button onClick={resetStopwatch} variant="secondary">초기화</Button>
              )}
            </div>
          </div>
          {laps.length > 0 && (
            <div className="mt-6 max-h-40 overflow-y-auto">
              {laps.map((lap, i) => (
                <div key={i} className="flex justify-between py-2 border-b dark:border-gray-700 text-sm">
                  <span className="text-gray-500">랩 {laps.length - i}</span>
                  <span className="font-mono">{formatStopwatch(lap)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* 뽀모도로 */}
      {mode === 'pomodoro' && (
        <Card variant="bordered" className="p-6">
          <div className="text-center space-y-6">
            <div className={cn(
              'text-lg font-medium',
              pomodoroPhase === 'work' && 'text-red-600 dark:text-red-400',
              pomodoroPhase === 'shortBreak' && 'text-green-600 dark:text-green-400',
              pomodoroPhase === 'longBreak' && 'text-blue-600 dark:text-blue-400'
            )}>
              {pomodoroPhase === 'work' && '집중 시간'}
              {pomodoroPhase === 'shortBreak' && '짧은 휴식'}
              {pomodoroPhase === 'longBreak' && '긴 휴식'}
            </div>
            <div className="text-6xl font-mono font-bold text-gray-900 dark:text-white">
              {formatTime(pomodoroRemaining)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              완료한 뽀모도로: {pomodoroCount}회
            </div>
            <div className="flex gap-4 justify-center">
              {pomodoroRunning ? (
                <Button onClick={() => setPomodoroRunning(false)} variant="secondary">일시정지</Button>
              ) : (
                <Button onClick={() => setPomodoroRunning(true)}>
                  {pomodoroRemaining === POMODORO_TIMES[pomodoroPhase] ? '시작' : '계속'}
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
                초기화
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
          ⏱️ 타이머 & 스톱워치란?
        </h2>
        <p className="text-sm leading-relaxed">
          타이머, 스톱워치, 뽀모도로를 한 곳에서 사용할 수 있는 올인원 시간 관리 도구입니다.
          요리, 운동, 공부, 업무 등 다양한 상황에서 정확한 시간 측정이 필요할 때 유용합니다.
          빠른 설정 버튼으로 1분, 3분, 5분 등 자주 쓰는 시간을 원클릭으로 설정할 수 있습니다.
          스톱워치의 랩 기능으로 구간별 시간을 기록하고 비교할 수 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 모드별 기능 비교
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">모드</th>
                <th className="text-left py-2 px-2">특징</th>
                <th className="text-left py-2 px-2">활용 예시</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">타이머</td><td>카운트다운, 알림음</td><td>요리, 휴식, 프레젠테이션</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">스톱워치</td><td>경과 시간, 랩 기록</td><td>운동, 경기, 작업 시간 측정</td></tr>
              <tr><td className="py-2 px-2 font-medium">뽀모도로</td><td>25분 집중 + 5분 휴식</td><td>공부, 업무 집중력 향상</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 효과적인 시간 관리 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>타이머</strong>: 작업 시작 전 시간 제한을 두면 집중력과 효율이 높아짐</li>
          <li><strong>스톱워치</strong>: 반복 작업의 시간을 측정해 개선점 파악</li>
          <li><strong>뽀모도로</strong>: 4세트(2시간) 완료 후 15분 긴 휴식 권장</li>
          <li><strong>랩 기능</strong>: 운동 인터벌 훈련에 구간별 기록 활용</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '타이머 완료 시 알림음이 나오나요?',
            answer: '네, 타이머가 0이 되면 알림음이 재생됩니다. 브라우저 설정에서 소리가 활성화되어 있어야 합니다.',
          },
          {
            question: '페이지를 닫아도 타이머가 계속 작동하나요?',
            answer: '아니요, 브라우저 탭을 닫으면 타이머가 중지됩니다. 백그라운드에서 계속 작동하려면 탭을 열어두세요.',
          },
          {
            question: '스톱워치 랩 기록은 저장되나요?',
            answer: '랩 기록은 현재 세션에서만 유지됩니다. 페이지를 새로고침하면 초기화되며, 서버에 저장되지 않습니다.',
          },
        ]}
      />
    </div>
  );
}
