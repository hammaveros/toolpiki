'use client';

import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ResultShareButtons } from '@/components/share/ResultShareButtons';
import { cn } from '@/lib/utils/cn';
import { FaqSection } from '@/components/ui/FaqItem';
import { encodeShareData } from '@/lib/utils/share-encoding';

type GameState = 'setup' | 'shuffling' | 'selecting' | 'result';

interface RevealedCup {
  index: number;
  isPrize: boolean;
}

const SHUFFLE_DURATION = 2000;
const SHUFFLE_MOVES = 8;

export function ShellGame() {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [cupCount, setCupCount] = useState(3);
  const [prizeCount, setPrizeCount] = useState(1);
  const [prizeCups, setPrizeCups] = useState<number[]>([]);
  const [revealedCups, setRevealedCups] = useState<RevealedCup[]>([]);
  const [cupPositions, setCupPositions] = useState<number[]>([]);
  const [stats, setStats] = useState({ wins: 0, total: 0, prizeFound: 0 });
  const shuffleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const initCups = useCallback((count: number) => {
    return Array.from({ length: count }, (_, i) => i);
  }, []);

  const startGame = useCallback(() => {
    // 유효성 검사
    if (prizeCount >= cupCount) {
      return;
    }

    // 당첨 컵 랜덤 선택
    const shuffled = [...Array(cupCount).keys()].sort(() => Math.random() - 0.5);
    const newPrizeCups = shuffled.slice(0, prizeCount);
    setPrizeCups(newPrizeCups);
    setRevealedCups([]);
    setCupPositions(initCups(cupCount));
    setGameState('shuffling');

    // 섞기 애니메이션
    let moveCount = 0;
    const shuffle = () => {
      if (moveCount < SHUFFLE_MOVES) {
        setCupPositions(prev => {
          const newPositions = [...prev];
          const i = Math.floor(Math.random() * cupCount);
          let j = Math.floor(Math.random() * cupCount);
          while (j === i) j = Math.floor(Math.random() * cupCount);
          [newPositions[i], newPositions[j]] = [newPositions[j], newPositions[i]];
          return newPositions;
        });
        moveCount++;
        shuffleTimeoutRef.current = setTimeout(shuffle, SHUFFLE_DURATION / SHUFFLE_MOVES);
      } else {
        setGameState('selecting');
      }
    };

    shuffleTimeoutRef.current = setTimeout(shuffle, 300);
  }, [cupCount, prizeCount, initCups]);

  const selectCup = useCallback((cupIndex: number) => {
    if (gameState !== 'selecting') return;
    // 이미 뒤집은 컵은 선택 불가
    if (revealedCups.some(r => r.index === cupIndex)) return;

    // cupPositions[cupIndex]가 실제 컵 번호, prizeCups에 포함되어 있으면 당첨
    const actualCup = cupPositions[cupIndex];
    const isPrize = prizeCups.includes(actualCup);

    const newRevealed = [...revealedCups, { index: cupIndex, isPrize }];
    setRevealedCups(newRevealed);

    // 당첨 찾으면 통계 업데이트
    if (isPrize) {
      setStats(prev => ({
        ...prev,
        prizeFound: prev.prizeFound + 1,
      }));
    }

    // 모든 컵을 뒤집었으면 결과
    if (newRevealed.length === cupCount) {
      const foundPrizes = newRevealed.filter(r => r.isPrize).length;
      setStats(prev => ({
        wins: prev.wins + (foundPrizes > 0 ? 1 : 0),
        total: prev.total + 1,
        prizeFound: prev.prizeFound,
      }));
      setGameState('result');
    }
  }, [gameState, cupPositions, prizeCups, revealedCups, cupCount]);

  const resetToSetup = () => {
    setGameState('setup');
    setRevealedCups([]);
    setCupPositions([]);
    if (shuffleTimeoutRef.current) {
      clearTimeout(shuffleTimeoutRef.current);
    }
  };

  const getShareUrl = () => {
    if (gameState !== 'result') return '';
    const foundPrizes = revealedCups.filter(r => r.isPrize).length;
    const data = { found: foundPrizes, total: prizeCount, cups: cupCount };
    const encoded = encodeShareData(data);
    return `${window.location.origin}${window.location.pathname}#share=${encoded}`;
  };

  // 현재까지 찾은 당첨 수
  const currentPrizesFound = revealedCups.filter(r => r.isPrize).length;
  const winOdds = cupCount > 0 ? Math.round((prizeCount / cupCount) * 100) : 0;

  return (
    <div className="space-y-2">
      <Card variant="bordered" className="p-6">
        {/* 설정 영역 */}
        {gameState === 'setup' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-5xl mb-4">🥤</div>
              <h2 className="text-xl font-bold mb-2">컵 뒤집기 게임</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                컵 개수와 당첨 개수를 설정하세요
              </p>
            </div>

            <div className="max-w-xs mx-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  컵 개수 (3~10)
                </label>
                <Input
                  type="number"
                  min={3}
                  max={10}
                  value={cupCount}
                  onChange={(e) => {
                    const val = Math.max(3, Math.min(10, parseInt(e.target.value) || 3));
                    setCupCount(val);
                    if (prizeCount >= val) setPrizeCount(val - 1);
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  당첨 개수 (1~{cupCount - 1})
                </label>
                <Input
                  type="number"
                  min={1}
                  max={cupCount - 1}
                  value={prizeCount}
                  onChange={(e) => {
                    const val = Math.max(1, Math.min(cupCount - 1, parseInt(e.target.value) || 1));
                    setPrizeCount(val);
                  }}
                />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                당첨 확률: {prizeCount}/{cupCount} ({winOdds}%)
              </p>
            </div>

            <div className="flex justify-center">
              <Button onClick={startGame} size="lg">
                게임 시작
              </Button>
            </div>
          </div>
        )}

        {/* 게임 진행 영역 */}
        {gameState !== 'setup' && (
          <>
            <div className="text-center mb-6">
              {gameState === 'shuffling' && (
                <p className="text-lg font-medium text-blue-600 dark:text-blue-400 mb-4">
                  🔄 컵을 섞는 중...
                </p>
              )}

              {gameState === 'selecting' && (
                <div className="mb-4">
                  <p className="text-lg font-medium text-green-600 dark:text-green-400 mb-2">
                    👆 컵을 하나씩 뒤집어보세요!
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    진행: {revealedCups.length}/{cupCount} | 당첨: {currentPrizesFound}/{prizeCount}
                  </p>
                </div>
              )}

              {gameState === 'result' && (
                <div className="mb-4">
                  <div className="text-5xl mb-2">🎉</div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    게임 종료!
                  </p>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                    {prizeCount}개 중 <span className="text-green-600 dark:text-green-400 font-bold">{currentPrizesFound}개</span> 당첨 발견
                  </p>
                </div>
              )}
            </div>

            {/* 컵 영역 */}
            <div className="flex justify-center flex-wrap gap-3 mb-6 min-h-[120px] items-end">
              {Array.from({ length: cupCount }, (_, index) => {
                const actualPosition = cupPositions.indexOf(index);
                const actualCup = cupPositions[index];
                const isPrize = prizeCups.includes(actualCup);
                const revealed = revealedCups.find(r => r.index === index);
                const isRevealed = !!revealed;
                const revealOrder = revealedCups.findIndex(r => r.index === index) + 1;

                return (
                  <div
                    key={index}
                    className="relative"
                    style={{
                      order: actualPosition,
                      transition: 'order 0.3s ease-in-out',
                      perspective: '800px',
                    }}
                  >
                    <button
                      onClick={() => selectCup(index)}
                      disabled={gameState !== 'selecting' || isRevealed}
                      className={cn(
                        'relative w-16 h-28 sm:w-20 sm:h-32 flex flex-col items-center justify-end transition-all duration-300',
                        gameState === 'selecting' && !isRevealed && 'cursor-pointer hover:-translate-y-1',
                        gameState === 'shuffling' && 'animate-bounce',
                      )}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      {/* 바닥판 */}
                      <div className="absolute bottom-0 w-14 sm:w-16 h-2 bg-gradient-to-b from-amber-600 to-amber-800 rounded-sm shadow-md" />

                      {/* 공/빈칸 (바닥에 고정) */}
                      <div className={cn(
                        'absolute bottom-2 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-500',
                        isRevealed ? 'opacity-100 scale-100' : 'opacity-0 scale-50',
                        isPrize ? 'bg-gradient-to-br from-green-400 to-green-600 shadow-lg' : 'bg-gray-200 dark:bg-gray-700'
                      )}>
                        <span className="text-xl sm:text-2xl">
                          {isPrize ? '⚽' : '✕'}
                        </span>
                      </div>

                      {/* 컵 컨테이너 (3D 변환) */}
                      <div
                        className="absolute bottom-2 transition-all ease-out"
                        style={{
                          transformStyle: 'preserve-3d',
                          transformOrigin: 'center bottom',
                          transform: isRevealed
                            ? 'translateY(-70px) translateZ(20px) rotateX(-60deg)'
                            : 'translateY(0) translateZ(0) rotateX(0deg)',
                          transitionDuration: isRevealed ? '800ms' : '300ms',
                        }}
                      >
                        {/* 컵 - SVG로 더 사실적인 컵 */}
                        <svg
                          width="56"
                          height="72"
                          viewBox="0 0 56 72"
                          className="sm:w-16 sm:h-20 drop-shadow-xl"
                          style={{
                            filter: isRevealed ? 'drop-shadow(0 8px 12px rgba(0,0,0,0.3))' : 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))',
                          }}
                        >
                          {/* 컵 몸체 */}
                          <defs>
                            <linearGradient id={`cupGrad-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#dc2626" />
                              <stop offset="30%" stopColor="#ef4444" />
                              <stop offset="50%" stopColor="#f87171" />
                              <stop offset="70%" stopColor="#ef4444" />
                              <stop offset="100%" stopColor="#b91c1c" />
                            </linearGradient>
                            <linearGradient id={`rimGrad-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#fca5a5" />
                              <stop offset="100%" stopColor="#dc2626" />
                            </linearGradient>
                          </defs>
                          {/* 컵 몸체 (사다리꼴) */}
                          <path
                            d="M8 8 L48 8 L52 68 L4 68 Z"
                            fill={`url(#cupGrad-${index})`}
                            stroke="#991b1b"
                            strokeWidth="1"
                          />
                          {/* 컵 상단 테두리 (타원) */}
                          <ellipse
                            cx="28"
                            cy="8"
                            rx="22"
                            ry="6"
                            fill={`url(#rimGrad-${index})`}
                            stroke="#991b1b"
                            strokeWidth="0.5"
                          />
                          {/* 컵 내부 (어두운 부분) */}
                          <ellipse
                            cx="28"
                            cy="8"
                            rx="18"
                            ry="4"
                            fill="#7f1d1d"
                          />
                          {/* 하이라이트 */}
                          <path
                            d="M12 12 L14 64 L10 64 L8 12 Z"
                            fill="rgba(255,255,255,0.2)"
                          />
                          {/* 줄무늬 */}
                          <line x1="10" y1="20" x2="46" y2="20" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                          <line x1="9" y1="30" x2="47" y2="30" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                        </svg>
                      </div>
                    </button>

                    {/* 순서 표시 */}
                    {isRevealed && (
                      <div className={cn(
                        'absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md',
                        isPrize
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-400 dark:bg-gray-500 text-white'
                      )}>
                        {revealOrder}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 버튼 */}
            <div className="flex justify-center gap-3">
              {gameState === 'result' && (
                <>
                  <Button onClick={startGame} size="lg">
                    다시 하기
                  </Button>
                  <Button onClick={resetToSetup} variant="secondary" size="lg">
                    설정 변경
                  </Button>
                </>
              )}
            </div>

            {/* 통계 */}
            {stats.total > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-center gap-6 sm:gap-8 text-sm">
                  <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400">플레이</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400">총 당첨</p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">{stats.prizeFound}</p>
                  </div>
                </div>
              </div>
            )}

            {/* 공유 */}
            {gameState === 'result' && (
              <div className="mt-4">
                <ResultShareButtons
                  url={getShareUrl()}
                  title={`컵 뒤집기 - ${currentPrizesFound}/${prizeCount} 당첨!`}
                  description={`${cupCount}개 컵 중 ${prizeCount}개 당첨, ${currentPrizesFound}개 발견!`}
                  visible={true}
                />
              </div>
            )}
          </>
        )}
      </Card>

      <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1 text-center">
        <p>• 컵을 하나씩 뒤집어서 당첨을 찾아보세요</p>
        <p>• 모든 컵을 뒤집으면 게임이 끝납니다</p>
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
          🥤 컵 뒤집기 게임이란?
        </h2>
        <p className="text-sm leading-relaxed">
          컵 뒤집기 게임(Shell Game)은 여러 개의 컵 중 공(당첨)이 숨겨진 컵을 찾는 고전적인 운 게임입니다.
          컵을 섞은 후 하나씩 뒤집어 당첨을 찾습니다. 컵 개수(3~10개)와 당첨 개수를 자유롭게 설정할 수 있어 난이도 조절이 가능합니다.
          친구들과 번갈아 플레이하며 누가 더 빨리, 더 적은 시도로 당첨을 찾는지 겨뤄보세요.
          3D 애니메이션으로 컵이 뒤집히는 모습을 실감나게 볼 수 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          당첨 확률표
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-3 font-semibold">컵 수</th>
                <th className="text-left py-2 px-3 font-semibold">당첨 1개</th>
                <th className="text-left py-2 px-3 font-semibold">당첨 2개</th>
                <th className="text-left py-2 px-3 font-semibold">당첨 3개</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-400">
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">3개</td>
                <td className="py-2 px-3">33%</td>
                <td className="py-2 px-3">67%</td>
                <td className="py-2 px-3">-</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">5개</td>
                <td className="py-2 px-3">20%</td>
                <td className="py-2 px-3">40%</td>
                <td className="py-2 px-3">60%</td>
              </tr>
              <tr>
                <td className="py-2 px-3">10개</td>
                <td className="py-2 px-3">10%</td>
                <td className="py-2 px-3">20%</td>
                <td className="py-2 px-3">30%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          게임 팁
        </h2>
        <ul className="text-sm space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
          <li>컵이 섞이는 동안 공이 있는 컵을 눈으로 따라가보세요</li>
          <li>섞는 속도가 빠르니 집중력이 중요합니다</li>
          <li>당첨 개수를 늘리면 쉬워지고, 컵 개수를 늘리면 어려워집니다</li>
          <li>통계에서 총 플레이 수와 찾은 당첨 수를 확인하세요</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '컵을 눈으로 따라가면 맞출 수 있나요?',
            answer: '섞는 속도가 빠르고 여러 번 교차하기 때문에 완벽히 따라가기는 어렵습니다. 어느 정도 운이 필요한 게임입니다.',
          },
          {
            question: '당첨 확률은 어떻게 계산되나요?',
            answer: '첫 번째 선택에서 당첨을 찾을 확률은 (당첨 개수 / 컵 개수)입니다. 예를 들어 5개 컵 중 1개 당첨이면 첫 시도에 찾을 확률은 20%입니다.',
          },
          {
            question: '게임 기록이 저장되나요?',
            answer: '현재 세션의 플레이 통계(총 플레이, 찾은 당첨 수)가 화면에 표시됩니다. 페이지를 새로고침하면 초기화됩니다.',
          },
        ]}
      />
    </div>
  );
}
