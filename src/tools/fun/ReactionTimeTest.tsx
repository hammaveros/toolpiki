'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { ResultShareButtons } from '@/components/share/ResultShareButtons';
import { cn } from '@/lib/utils/cn';
import { siteConfig } from '@/data/site';
import { FaqSection } from '@/components/ui/FaqItem';

type GameState = 'idle' | 'waiting' | 'go' | 'tooSoon' | 'result';

interface RoundResult {
  round: number;
  time: number;
}

const TOTAL_ROUNDS = 5;
const MIN_DELAY = 400;
const MAX_DELAY = 2000;

function getSecureRandomDelay(): number {
  if (typeof window !== 'undefined' && window.crypto) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return MIN_DELAY + (array[0] % (MAX_DELAY - MIN_DELAY + 1));
  }
  return MIN_DELAY + Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY + 1));
}

export function ReactionTimeTest() {
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
      // 너무 빨리 클릭 - 처음부터 다시
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
        // 바로 다음 라운드로 (waiting 상태에서 이전 결과 보여줌)
        setCurrentRound((prev) => prev + 1);
        startRound();
      }
      return;
    }

    if (gameState === 'tooSoon') {
      // 처음부터 다시 시작
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
      if (e.repeat) return; // 키 반복 방지
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
    return `반응속도 테스트 결과\n평균: ${stats.average}ms\n최소: ${stats.min}ms\n최대: ${stats.max}ms\n\n라운드별:\n${results.map(r => `${r.round}회차: ${r.time}ms`).join('\n')}`;
  };

  const getShareUrl = () => {
    if (!stats || results.length === 0) return '';
    const data = { results: results.map(r => r.time), avg: stats.average };
    const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
    return `${siteConfig.url}/tools/reaction-time-test#share=${encoded}`;
  };

  // URL hash에서 공유 데이터 복원
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
          // hash 제거
          window.history.replaceState(null, '', window.location.pathname);
        }
      } catch {
        // 잘못된 hash는 무시
      }
    }
  }, []);

  const getReactionRating = (ms: number) => {
    if (ms < 250) return { label: '매우 빠름', color: 'text-emerald-600 dark:text-emerald-400' };
    if (ms < 300) return { label: '빠름', color: 'text-green-600 dark:text-green-400' };
    if (ms < 350) return { label: '보통', color: 'text-yellow-600 dark:text-yellow-400' };
    return { label: '느림', color: 'text-orange-600 dark:text-orange-400' };
  };

  return (
    <div className="space-y-2">
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => {
          // 키보드 이벤트는 window에서만 처리 (중복 방지)
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
                클릭하여 시작
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                클릭, 터치, 또는 스페이스바
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
                초록색으로 바뀌면 클릭
              </p>
              <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                {currentRound} / {TOTAL_ROUNDS} 라운드
              </p>
              {lastTime > 0 && (
                <p className={cn('text-sm mt-2', getReactionRating(lastTime).color)}>
                  이전: {lastTime}ms ({getReactionRating(lastTime).label})
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
              지금 클릭!
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
                너무 빨랐습니다
              </p>
              <p className="text-sm text-rose-600 dark:text-rose-400 mt-1">
                처음부터 다시 시작합니다
              </p>
              <p className="text-xs text-rose-500 dark:text-rose-500 mt-2">
                클릭하여 재시작
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
                클릭하여 다시 시작
              </p>
            </div>
          </>
        )}
      </div>

      {results.length > 0 && (
        <Card variant="bordered" className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              측정 결과
            </h3>
            {gameState === 'result' && (
              <CopyButton text={getResultText()} label="결과 복사" />
            )}
          </div>

          {stats && (
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <p className="text-xs text-slate-500 dark:text-slate-400">평균</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{stats.average}ms</p>
              </div>
              <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                <p className="text-xs text-emerald-600 dark:text-emerald-400">최소</p>
                <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">{stats.min}ms</p>
              </div>
              <div className="text-center p-3 bg-rose-50 dark:bg-rose-900/20 rounded-lg">
                <p className="text-xs text-rose-600 dark:text-rose-400">최대</p>
                <p className="text-xl font-bold text-rose-700 dark:text-rose-300">{stats.max}ms</p>
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
                  {result.round}회차
                </span>
                <span className={cn('font-mono font-semibold', getReactionRating(result.time).color)}>
                  {result.time}ms
                </span>
              </div>
            ))}
          </div>

          {gameState === 'result' && stats && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <ResultShareButtons
                url={getShareUrl()}
                title={`반응속도 테스트 결과: 평균 ${stats.average}ms`}
                description={`최소 ${stats.min}ms, 최대 ${stats.max}ms - ToolPiki`}
              />
            </div>
          )}
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
          ⚡ 반응속도 테스트란?
        </h2>
        <p className="text-sm leading-relaxed">
          반응속도 테스트는 시각적 자극에 대한 반응 시간을 밀리초(ms) 단위로 측정하는 도구입니다.
          화면이 초록색으로 바뀌는 순간 얼마나 빨리 클릭하는지를 5회 측정하여 평균을 냅니다.
          일반 성인의 평균 반응속도는 200~300ms이며, 프로게이머는 150ms 이하를 기록하기도 합니다.
          측정 결과를 공유하여 친구들과 비교해보세요.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 반응속도 기준표
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">반응시간</th>
                <th className="text-left py-2 px-2">등급</th>
                <th className="text-left py-2 px-2">해당 그룹</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">150ms 이하</td><td className="font-medium text-emerald-600">최상위</td><td>프로게이머, 운동선수</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">150~200ms</td><td className="font-medium text-green-600">매우 빠름</td><td>숙련된 게이머</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">200~250ms</td><td className="font-medium text-blue-600">빠름</td><td>일반 게이머</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">250~300ms</td><td className="font-medium text-yellow-600">평균</td><td>일반 성인</td></tr>
              <tr><td className="py-2 px-2 font-mono">300ms 이상</td><td className="font-medium text-orange-600">느림</td><td>개선 여지 있음</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 반응속도 향상 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>충분한 수면</strong>: 피로는 반응속도를 20~30% 저하시킴</li>
          <li><strong>카페인</strong>: 적정량의 카페인은 일시적으로 반응속도 향상</li>
          <li><strong>모니터 주사율</strong>: 144Hz 이상 모니터는 시각 인지 빠름</li>
          <li><strong>꾸준한 연습</strong>: 매일 연습하면 반응속도 향상 가능</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '반응속도는 타고난 건가요, 훈련되는 건가요?',
            answer: '기본적인 신경 전달 속도는 유전이지만, 예측과 판단 속도는 훈련으로 향상됩니다. 프로게이머들도 꾸준한 연습으로 반응속도를 개선합니다.',
          },
          {
            question: '나이가 들면 반응속도가 느려지나요?',
            answer: '네, 일반적으로 20대 중반 이후 반응속도가 서서히 감소합니다. 하지만 규칙적인 운동과 뇌 자극 활동으로 감소 속도를 늦출 수 있습니다.',
          },
          {
            question: '모바일과 PC 결과가 다른 이유는?',
            answer: '입력 장치 지연 시간이 다릅니다. 터치스크린은 10~50ms, 마우스는 1~10ms 지연이 있어 PC 결과가 더 빠르게 나올 수 있습니다.',
          },
        ]}
      />
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
