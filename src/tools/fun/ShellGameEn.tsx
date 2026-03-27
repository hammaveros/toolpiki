'use client';

import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ResultShareButtons } from '@/components/share/ResultShareButtons';
import { siteConfig } from '@/data/site';
import { cn } from '@/lib/utils/cn';
import { FaqSection } from '@/components/ui/FaqItem';

type GameState = 'setup' | 'shuffling' | 'selecting' | 'result';

interface RevealedCup {
  index: number;
  isPrize: boolean;
}

const SHUFFLE_DURATION = 2000;
const SHUFFLE_MOVES = 8;

export function ShellGameEn() {
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
    if (prizeCount >= cupCount) {
      return;
    }

    const shuffled = [...Array(cupCount).keys()].sort(() => Math.random() - 0.5);
    const newPrizeCups = shuffled.slice(0, prizeCount);
    setPrizeCups(newPrizeCups);
    setRevealedCups([]);
    setCupPositions(initCups(cupCount));
    setGameState('shuffling');

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
    if (revealedCups.some(r => r.index === cupIndex)) return;

    const actualCup = cupPositions[cupIndex];
    const isPrize = prizeCups.includes(actualCup);

    const newRevealed = [...revealedCups, { index: cupIndex, isPrize }];
    setRevealedCups(newRevealed);

    if (isPrize) {
      setStats(prev => ({
        ...prev,
        prizeFound: prev.prizeFound + 1,
      }));
    }

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
    const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
    return `${siteConfig.url}/en/tools/shell-game-en#share=${encoded}`;
  };

  const currentPrizesFound = revealedCups.filter(r => r.isPrize).length;
  const winOdds = cupCount > 0 ? Math.round((prizeCount / cupCount) * 100) : 0;

  return (
    <div className="space-y-2">
      <Card variant="bordered" className="p-6">
        {/* Setup Section */}
        {gameState === 'setup' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-5xl mb-4">🥤</div>
              <h2 className="text-xl font-bold mb-2">Shell Game</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Set the number of cups and prizes
              </p>
            </div>

            <div className="max-w-xs mx-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Number of Cups (3-10)
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
                  Number of Prizes (1-{cupCount - 1})
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
                Win probability: {prizeCount}/{cupCount} ({winOdds}%)
              </p>
            </div>

            <div className="flex justify-center">
              <Button onClick={startGame} size="lg">
                Start Game
              </Button>
            </div>
          </div>
        )}

        {/* Game Section */}
        {gameState !== 'setup' && (
          <>
            <div className="text-center mb-6">
              {gameState === 'shuffling' && (
                <p className="text-lg font-medium text-blue-600 dark:text-blue-400 mb-4">
                  🔄 Shuffling cups...
                </p>
              )}

              {gameState === 'selecting' && (
                <div className="mb-4">
                  <p className="text-lg font-medium text-green-600 dark:text-green-400 mb-2">
                    👆 Flip the cups one by one!
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Progress: {revealedCups.length}/{cupCount} | Prizes found: {currentPrizesFound}/{prizeCount}
                  </p>
                </div>
              )}

              {gameState === 'result' && (
                <div className="mb-4">
                  <div className="text-5xl mb-2">🎉</div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    Game Over!
                  </p>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                    Found <span className="text-green-600 dark:text-green-400 font-bold">{currentPrizesFound}</span> out of {prizeCount} prizes
                  </p>
                </div>
              )}
            </div>

            {/* Cups Area */}
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
                      {/* Base plate */}
                      <div className="absolute bottom-0 w-14 sm:w-16 h-2 bg-gradient-to-b from-amber-600 to-amber-800 rounded-sm shadow-md" />

                      {/* Ball/Empty (fixed at bottom) */}
                      <div className={cn(
                        'absolute bottom-2 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-500',
                        isRevealed ? 'opacity-100 scale-100' : 'opacity-0 scale-50',
                        isPrize ? 'bg-gradient-to-br from-green-400 to-green-600 shadow-lg' : 'bg-gray-200 dark:bg-gray-700'
                      )}>
                        <span className="text-xl sm:text-2xl">
                          {isPrize ? '⚽' : '✕'}
                        </span>
                      </div>

                      {/* Cup container (3D transform) */}
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
                        {/* Cup - SVG for more realistic cup */}
                        <svg
                          width="56"
                          height="72"
                          viewBox="0 0 56 72"
                          className="sm:w-16 sm:h-20 drop-shadow-xl"
                          style={{
                            filter: isRevealed ? 'drop-shadow(0 8px 12px rgba(0,0,0,0.3))' : 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))',
                          }}
                        >
                          {/* Cup body */}
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
                          {/* Cup body (trapezoid) */}
                          <path
                            d="M8 8 L48 8 L52 68 L4 68 Z"
                            fill={`url(#cupGrad-${index})`}
                            stroke="#991b1b"
                            strokeWidth="1"
                          />
                          {/* Cup top rim (ellipse) */}
                          <ellipse
                            cx="28"
                            cy="8"
                            rx="22"
                            ry="6"
                            fill={`url(#rimGrad-${index})`}
                            stroke="#991b1b"
                            strokeWidth="0.5"
                          />
                          {/* Cup interior (dark part) */}
                          <ellipse
                            cx="28"
                            cy="8"
                            rx="18"
                            ry="4"
                            fill="#7f1d1d"
                          />
                          {/* Highlight */}
                          <path
                            d="M12 12 L14 64 L10 64 L8 12 Z"
                            fill="rgba(255,255,255,0.2)"
                          />
                          {/* Stripes */}
                          <line x1="10" y1="20" x2="46" y2="20" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                          <line x1="9" y1="30" x2="47" y2="30" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                        </svg>
                      </div>
                    </button>

                    {/* Order indicator */}
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

            {/* Buttons */}
            <div className="flex justify-center gap-3">
              {gameState === 'result' && (
                <>
                  <Button onClick={startGame} size="lg">
                    Play Again
                  </Button>
                  <Button onClick={resetToSetup} variant="secondary" size="lg">
                    Change Settings
                  </Button>
                </>
              )}
            </div>

            {/* Stats */}
            {stats.total > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-center gap-6 sm:gap-8 text-sm">
                  <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400">Played</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400">Prizes Found</p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">{stats.prizeFound}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Share */}
            {gameState === 'result' && (
              <div className="mt-4">
                <ResultShareButtons
                  url={getShareUrl()}
                  title={`Shell Game - Found ${currentPrizesFound}/${prizeCount}!`}
                  description={`Found ${currentPrizesFound} prizes out of ${prizeCount} in ${cupCount} cups!`}
                  visible={true}
                />
              </div>
            )}
          </>
        )}
      </Card>

      <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1 text-center">
        <p>• Flip cups one by one to find the prizes</p>
        <p>• Game ends when all cups are revealed</p>
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
          What is Shell Game?
        </h2>
        <p className="text-sm leading-relaxed">
          Shell Game is a classic luck-based game where you flip cups to find hidden prizes (balls).
          After the cups are shuffled, reveal them one by one to find the prizes. You can set the number of cups (3-10) and prizes for adjustable difficulty.
          Take turns with friends and compete to see who finds prizes faster with fewer attempts.
          Watch the cups flip with realistic 3D animation effects.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          Win Probability Chart
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-3 font-semibold">Cups</th>
                <th className="text-left py-2 px-3 font-semibold">1 Prize</th>
                <th className="text-left py-2 px-3 font-semibold">2 Prizes</th>
                <th className="text-left py-2 px-3 font-semibold">3 Prizes</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-400">
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">3 cups</td>
                <td className="py-2 px-3">33%</td>
                <td className="py-2 px-3">67%</td>
                <td className="py-2 px-3">-</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">5 cups</td>
                <td className="py-2 px-3">20%</td>
                <td className="py-2 px-3">40%</td>
                <td className="py-2 px-3">60%</td>
              </tr>
              <tr>
                <td className="py-2 px-3">10 cups</td>
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
          Game Tips
        </h2>
        <ul className="text-sm space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
          <li>Try to follow the cup with the ball while shuffling</li>
          <li>The shuffle is fast, so focus is key</li>
          <li>More prizes = easier; more cups = harder</li>
          <li>Check your stats for total plays and prizes found</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Can I win by tracking the cups visually?',
            answer: 'The shuffle is fast with multiple exchanges, making it difficult to track perfectly. Some luck is always involved in this game.',
          },
          {
            question: 'How is win probability calculated?',
            answer: 'The probability of finding a prize on your first pick is (number of prizes / number of cups). For example, with 5 cups and 1 prize, the first-try probability is 20%.',
          },
          {
            question: 'Are my game stats saved?',
            answer: 'Current session statistics (total plays, prizes found) are displayed on screen. Refreshing the page will reset the stats.',
          },
        ]}
      />
    </div>
  );
}
