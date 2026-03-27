'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ResultShareButtons } from '@/components/share/ResultShareButtons';
import { siteConfig } from '@/data/site';
import { FaqSection } from '@/components/ui/FaqItem';

type GameMode = '5' | '10' | '30';

export function TimingTest() {
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

    // 실시간 업데이트 (눈가리기 모드라 실제로는 안 보임)
    intervalRef.current = setInterval(() => {
      setElapsed(Date.now() - Date.now()); // 의도적으로 0 유지
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
    if (diff < 0.1) return '🎯 완벽! 천재적인 타이밍 감각!';
    if (diff < 0.3) return '🌟 훌륭해요! 거의 정확해요!';
    if (diff < 0.5) return '👍 좋아요! 꽤 정확해요!';
    if (diff < 1) return '😊 괜찮아요! 조금만 더 연습하면 돼요';
    if (diff < 2) return '🤔 음... 좀 더 집중해보세요';
    return '😅 많이 벗어났네요. 다시 도전!';
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
    return `${siteConfig.url}/tools/timing-test#share=${encoded}`;
  };

  // URL hash에서 공유 데이터 복원
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
        // 잘못된 hash는 무시
      }
    }
  }, []);

  return (
    <div className="space-y-2">
      {/* 모드 선택 */}
      <div className="flex justify-center gap-2">
        {(['5', '10', '30'] as GameMode[]).map((m) => (
          <Button
            key={m}
            variant={mode === m ? 'primary' : 'secondary'}
            onClick={() => setMode(m)}
            disabled={gameState === 'counting'}
          >
            {m}초
          </Button>
        ))}
      </div>

      {/* 게임 영역 */}
      <Card variant="bordered" className="p-4 md:p-6 text-center min-h-[250px] flex flex-col justify-center">
        {gameState === 'ready' && (
          <>
            <h2 className="text-2xl font-bold mb-4">⏱️ {targetSeconds}초 맞추기</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              시작 버튼을 누른 후, 정확히 {targetSeconds}초가 됐다고 느껴질 때<br />
              멈춤 버튼을 누르세요!
            </p>
            <Button onClick={startGame} size="lg">
              시작
            </Button>
          </>
        )}

        {gameState === 'counting' && (
          <>
            <div className="text-6xl mb-8">🙈</div>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
              {targetSeconds}초를 세는 중...
            </p>
            <Button onClick={stopGame} size="lg" className="bg-red-500 hover:bg-red-600">
              멈춤!
            </Button>
          </>
        )}

        {gameState === 'result' && (
          <>
            <p className="text-sm text-gray-500 mb-2">목표: {targetSeconds}초</p>
            <p className={`text-5xl font-bold mb-2 ${getAccuracyColor()}`}>
              {elapsed.toFixed(3)}초
            </p>
            <p className="text-lg mb-2">
              {getDifference() > 0 ? '+' : ''}{getDifference().toFixed(3)}초
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {getAccuracyMessage()}
            </p>
            <div className="mb-4">
              <ResultShareButtons
                url={getShareUrl()}
                title={`타이밍 테스트: ${targetSeconds}초 목표 → ${elapsed.toFixed(3)}초`}
                description={`오차 ${Math.abs(getDifference()).toFixed(3)}초 - JSSpace`}
              />
            </div>
            <Button onClick={resetGame}>
              다시 하기
            </Button>
          </>
        )}
      </Card>

      {/* 기록 */}
      {results.length > 0 && (
        <Card variant="bordered" className="p-4">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-medium">기록 ({results.length}회)</p>
            <Button variant="ghost" size="sm" onClick={clearResults}>
              초기화
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            <div>
              <p className="text-xs text-gray-500">평균</p>
              <p className="font-mono font-bold">{averageResult.toFixed(3)}초</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">최고 기록</p>
              <p className="font-mono font-bold text-green-600">{bestResult.toFixed(3)}초</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">최고 오차</p>
              <p className="font-mono font-bold">
                {Math.abs(bestResult - targetSeconds).toFixed(3)}초
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
        <p>• 화면을 보지 않고 시간 감각만으로 맞춰보세요</p>
        <p>• 오차 0.1초 이내면 천재급 타이밍 감각!</p>
      </div>
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          ⏱️ 타이밍 테스트란?
        </h2>
        <p className="text-sm leading-relaxed">
          타이밍 테스트는 시계나 화면을 보지 않고 정확히 특정 시간을 맞추는 시간 감각 테스트입니다.
          5초, 10초, 30초 중 원하는 목표 시간을 선택하고 시작 버튼을 누른 뒤, 목표 시간이 됐다고 느껴질 때 멈춤 버튼을 누르세요.
          0.001초(밀리초) 단위로 정밀하게 측정하며, 평균 기록과 최고 기록 통계를 제공합니다.
          당신의 내부 시계(체내 시계)가 얼마나 정확한지 테스트해보세요.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          오차 기준표
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-3 font-semibold">오차 범위</th>
                <th className="text-left py-2 px-3 font-semibold">등급</th>
                <th className="text-left py-2 px-3 font-semibold">설명</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-400">
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3 font-mono">0.1초 미만</td>
                <td className="py-2 px-3">🎯 완벽</td>
                <td className="py-2 px-3">천재적 타이밍 감각</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3 font-mono">0.1~0.3초</td>
                <td className="py-2 px-3">🌟 훌륭</td>
                <td className="py-2 px-3">거의 정확한 시간 감각</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3 font-mono">0.3~0.5초</td>
                <td className="py-2 px-3">👍 좋음</td>
                <td className="py-2 px-3">꽤 정확한 편</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3 font-mono">0.5~1초</td>
                <td className="py-2 px-3">😊 보통</td>
                <td className="py-2 px-3">평균적인 시간 감각</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3 font-mono">1~2초</td>
                <td className="py-2 px-3">🤔 노력 필요</td>
                <td className="py-2 px-3">좀 더 집중 필요</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-mono">2초 이상</td>
                <td className="py-2 px-3">😅 재도전</td>
                <td className="py-2 px-3">다시 도전해보세요</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          시간 감각 향상 팁
        </h2>
        <ul className="text-sm space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
          <li>마음 속으로 일정한 리듬으로 숫자를 세보세요 (하나, 둘, 셋...)</li>
          <li>심장 박동이나 호흡 리듬을 기준으로 삼아보세요</li>
          <li>짧은 시간(5초)부터 연습하고 점차 긴 시간에 도전하세요</li>
          <li>여러 번 반복하면 내부 시계가 보정됩니다</li>
          <li>집중력이 흐트러지면 시간이 빠르게 느껴질 수 있어요</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '왜 화면에 시간이 안 보이나요?',
            answer: '진정한 시간 감각 테스트를 위해 의도적으로 타이머를 숨깁니다. 화면을 보지 않고 오직 내부 시계에 의존해서 시간을 맞춰야 정확한 테스트가 됩니다.',
          },
          {
            question: '어떤 목표 시간이 가장 어려운가요?',
            answer: '일반적으로 30초가 가장 어렵습니다. 시간이 길어질수록 집중력 유지가 어렵고, 시간 왜곡 현상이 더 크게 나타나기 때문입니다. 5초는 너무 짧아서 반응 속도의 영향을 받고, 10초가 가장 균형 잡힌 난이도입니다.',
          },
          {
            question: '기록이 저장되나요?',
            answer: '현재 세션의 기록만 화면에 표시되며, 페이지를 새로고침하면 초기화됩니다. 결과 공유 기능을 통해 링크로 특정 기록을 저장하고 공유할 수 있습니다.',
          },
        ]}
      />
    </div>
  );
}
