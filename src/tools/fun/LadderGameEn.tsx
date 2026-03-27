'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ResultShareButtonsEn } from '@/components/share/ResultShareButtonsEn';
import { siteConfig } from '@/data/site';
import { FaqSection } from '@/components/ui/FaqItem';

interface LadderPath {
  col: number;
  row: number;
  direction: 'left' | 'right';
}

export function LadderGameEn() {
  const [playersInput, setPlayersInput] = useState('A, B, C');
  const [resultsInput, setResultsInput] = useState('Win, Lose, Lose');
  const [players, setPlayers] = useState<string[]>(['A', 'B', 'C']);
  const [results, setResults] = useState<string[]>(['Win', 'Lose', 'Lose']);
  const [error, setError] = useState<string | null>(null);
  const [ladderPaths, setLadderPaths] = useState<LadderPath[]>([]);
  const [isRevealed, setIsRevealed] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const [animationPath, setAnimationPath] = useState<{ col: number; row: number }[]>([]);
  const [currentPosition, setCurrentPosition] = useState<{ col: number; row: number } | null>(null);
  const [finalResults, setFinalResults] = useState<Map<number, number>>(new Map());
  const [hideMiddle, setHideMiddle] = useState(true); // Hide middle option
  const [isShuffling, setIsShuffling] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const restoredFromShare = useRef(false);

  // Dynamic rows based on player count (min 8, max 14)
  const rows = Math.min(14, Math.max(8, players.length * 2 + 2));

  // Generate ladder - ensures all participants match to different results
  const generateLadder = useCallback(() => {
    const cols = players.length;
    let paths: LadderPath[] = [];
    let attempts = 0;
    const maxAttempts = 100;

    // Minimum horizontal lines (complex enough)
    const minPaths = Math.max(rows * (cols - 1) * 0.4, cols * 2);

    while (attempts < maxAttempts) {
      paths = [];

      for (let row = 0; row < rows; row++) {
        const availableCols: number[] = [];
        for (let col = 0; col < cols - 1; col++) {
          const hasAdjacentPath = paths.some(
            (p) => p.row === row && Math.abs(p.col - col) <= 1
          );
          if (!hasAdjacentPath) {
            availableCols.push(col);
          }
        }

        // 70% chance for horizontal line (more complex)
        for (const col of availableCols) {
          if (Math.random() < 0.7) {
            const hasAdjacentPath = paths.some(
              (p) => p.row === row && Math.abs(p.col - col) <= 1
            );
            if (!hasAdjacentPath) {
              paths.push({ col, row, direction: 'right' });
            }
          }
        }
      }

      // Add more lines if below minimum
      if (paths.length < minPaths) {
        for (let row = 0; row < rows && paths.length < minPaths; row++) {
          for (let col = 0; col < cols - 1 && paths.length < minPaths; col++) {
            const hasPath = paths.some((p) => p.row === row && p.col === col);
            const hasAdjacentPath = paths.some(
              (p) => p.row === row && Math.abs(p.col - col) <= 1
            );
            if (!hasPath && !hasAdjacentPath) {
              paths.push({ col, row, direction: 'right' });
            }
          }
        }
      }

      const resultMapping: number[] = [];
      for (let startCol = 0; startCol < cols; startCol++) {
        let currentCol = startCol;
        for (let row = 0; row < rows; row++) {
          const rightPath = paths.find((p) => p.col === currentCol && p.row === row);
          const leftPath = paths.find((p) => p.col === currentCol - 1 && p.row === row);
          if (rightPath) currentCol++;
          else if (leftPath) currentCol--;
        }
        resultMapping.push(currentCol);
      }

      const uniqueResults = new Set(resultMapping);
      if (uniqueResults.size === cols && paths.length >= minPaths) {
        break;
      }

      attempts++;
    }

    setLadderPaths(paths);
    setIsRevealed(false);
    setSelectedPlayer(null);
    setAnimationPath([]);
    setCurrentPosition(null);
    setFinalResults(new Map());
  }, [players.length]);

  useEffect(() => {
    generateLadder();
  }, [generateLadder]);

  // Draw ladder
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cols = players.length;
    const colWidth = width / cols;
    const rowHeight = height / (rows + 1);

    ctx.clearRect(0, 0, width, height);

    // Hide mode check (reveal immediately when any player is clicked)
    const shouldHide = hideMiddle && !isRevealed && finalResults.size === 0 && selectedPlayer === null;

    // Hide area (cover everything except small margins at top/bottom)
    const hideStartY = rowHeight * 1.2;  // Just below top
    const hideEndY = height - rowHeight * 1.2;  // Just above bottom

    // Vertical lines (full)
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 3;
    for (let col = 0; col < cols; col++) {
      const x = colWidth * col + colWidth / 2;
      ctx.beginPath();
      ctx.moveTo(x, rowHeight * 0.5);
      ctx.lineTo(x, height - rowHeight * 0.5);
      ctx.stroke();
    }

    // Horizontal lines (only when not hiding)
    if (!shouldHide) {
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 3;
      ladderPaths.forEach(({ col, row }) => {
        const x1 = colWidth * col + colWidth / 2;
        const x2 = colWidth * (col + 1) + colWidth / 2;
        const y = rowHeight * (row + 1);

        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.stroke();
      });
    }

    // Cover box (opaque overlay)
    if (shouldHide) {
      // Match background color (detect dark mode)
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      // Gradient for smooth transition
      const gradient = ctx.createLinearGradient(0, hideStartY - 20, 0, hideStartY + 20);
      gradient.addColorStop(0, isDark ? 'rgba(31, 41, 55, 0)' : 'rgba(249, 250, 251, 0)');
      gradient.addColorStop(1, isDark ? 'rgba(31, 41, 55, 1)' : 'rgba(249, 250, 251, 1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, hideStartY - 20, width, 40);

      // Fully opaque middle
      ctx.fillStyle = isDark ? '#1f2937' : '#f9fafb';
      ctx.fillRect(0, hideStartY, width, hideEndY - hideStartY);

      // Bottom gradient
      const gradient2 = ctx.createLinearGradient(0, hideEndY - 20, 0, hideEndY + 20);
      gradient2.addColorStop(0, isDark ? 'rgba(31, 41, 55, 1)' : 'rgba(249, 250, 251, 1)');
      gradient2.addColorStop(1, isDark ? 'rgba(31, 41, 55, 0)' : 'rgba(249, 250, 251, 0)');
      ctx.fillStyle = gradient2;
      ctx.fillRect(0, hideEndY - 20, width, 40);

      // Question mark
      ctx.fillStyle = isDark ? '#6b7280' : '#9ca3af';
      ctx.font = 'bold 32px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('?', width / 2, (hideStartY + hideEndY) / 2);
    }

    // Animation path
    if (animationPath.length > 1) {
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 5;
      ctx.beginPath();

      animationPath.forEach((point, idx) => {
        const x = colWidth * point.col + colWidth / 2;
        // row 0 = start, row 1~rows = horizontal line positions, row > rows = end
        const y = point.row === 0
          ? rowHeight * 0.5
          : point.row > rows
            ? height - rowHeight * 0.5
            : rowHeight * point.row;

        if (idx === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
    }

    // Draw ball at current position
    if (currentPosition) {
      const x = colWidth * currentPosition.col + colWidth / 2;
      // row 0 = start, row 1~rows = horizontal line positions, row > rows = end
      const y = currentPosition.row === 0
        ? rowHeight * 0.5
        : currentPosition.row > rows
          ? height - rowHeight * 0.5
          : rowHeight * currentPosition.row;

      // Shadow
      ctx.beginPath();
      ctx.arc(x + 2, y + 2, 12, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fill();

      // Ball
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, 2 * Math.PI);
      const gradient = ctx.createRadialGradient(x - 4, y - 4, 0, x, y, 12);
      gradient.addColorStop(0, '#FF6B6B');
      gradient.addColorStop(1, '#EE5A5A');
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.strokeStyle = '#CC4444';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Highlight
      ctx.beginPath();
      ctx.arc(x - 4, y - 4, 4, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fill();
    }
  }, [players.length, ladderPaths, animationPath, currentPosition, hideMiddle, isRevealed, finalResults, rows]);

  // Run ladder
  const runLadder = (startCol: number) => {
    if (isAnimating) return;

    setIsAnimating(true);
    setSelectedPlayer(startCol);
    setCurrentPosition(null);
    setAnimationPath([]);

    // Calculate full path (including horizontal moves)
    const fullPath: { col: number; row: number }[] = [];
    let currentCol = startCol;

    // Start point
    fullPath.push({ col: startCol, row: 0 });

    for (let row = 0; row < rows; row++) {
      const rightPath = ladderPaths.find((p) => p.col === currentCol && p.row === row);
      const leftPath = ladderPaths.find((p) => p.col === currentCol - 1 && p.row === row);

      if (rightPath) {
        // Move down to horizontal line
        fullPath.push({ col: currentCol, row: row + 1 });
        // Move sideways
        currentCol++;
        fullPath.push({ col: currentCol, row: row + 1 });
      } else if (leftPath) {
        // Move down to horizontal line
        fullPath.push({ col: currentCol, row: row + 1 });
        // Move sideways
        currentCol--;
        fullPath.push({ col: currentCol, row: row + 1 });
      } else {
        // Just move down
        fullPath.push({ col: currentCol, row: row + 1 });
      }
    }

    // Add endpoint (separate from last horizontal line position)
    fullPath.push({ col: currentCol, row: rows + 1 });

    // Animation - ball follows the path
    let i = 0;
    const animate = () => {
      if (i < fullPath.length) {
        setCurrentPosition(fullPath[i]);
        setAnimationPath(fullPath.slice(0, i + 1));
        i++;
        setTimeout(animate, 120);
      } else {
        // Animation complete
        setTimeout(() => {
          setCurrentPosition(null);
          setFinalResults((prev) => new Map(prev).set(startCol, currentCol));
          setIsAnimating(false);
        }, 300);
      }
    };
    animate();
  };

  // Reveal all
  const revealAll = () => {
    const newResults = new Map<number, number>();

    for (let startCol = 0; startCol < players.length; startCol++) {
      let currentCol = startCol;

      for (let row = 0; row < rows; row++) {
        const rightPath = ladderPaths.find((p) => p.col === currentCol && p.row === row);
        const leftPath = ladderPaths.find((p) => p.col === currentCol - 1 && p.row === row);

        if (rightPath) {
          currentCol++;
        } else if (leftPath) {
          currentCol--;
        }
      }

      newResults.set(startCol, currentCol);
    }

    setFinalResults(newResults);
    setIsRevealed(true);
  };

  // Auto-apply when input changes
  useEffect(() => {
    // Skip parsing/reset right after share restoration
    if (restoredFromShare.current) {
      restoredFromShare.current = false;
      return;
    }

    const parsedPlayers = playersInput.split(',').map(s => s.trim()).filter(Boolean);
    const parsedResults = resultsInput.split(',').map(s => s.trim()).filter(Boolean);

    if (parsedPlayers.length < 2) {
      setError('Enter at least 2 participants');
      return;
    }
    if (parsedPlayers.length > 8) {
      setError('Maximum 8 participants allowed');
      return;
    }
    if (parsedResults.length !== parsedPlayers.length) {
      setError(`${parsedPlayers.length} participants, ${parsedResults.length} results - please match the count`);
      return;
    }

    // Auto-apply when count matches
    setError(null);
    setPlayers(parsedPlayers);
    setResults(parsedResults);
  }, [playersInput, resultsInput]);

  // Reset
  const resetGame = () => {
    setPlayersInput('A, B, C');
    setResultsInput('Win, Lose, Lose');
    setPlayers(['A', 'B', 'C']);
    setResults(['Win', 'Lose', 'Lose']);
    setError(null);
    setIsRevealed(false);
    setSelectedPlayer(null);
    setAnimationPath([]);
    setFinalResults(new Map());
  };

  const shuffleResults = () => {
    if (isShuffling) return;
    setIsShuffling(true);

    const original = [...results];
    let count = 0;
    const maxCycles = 6;

    const interval = setInterval(() => {
      count++;
      if (count < maxCycles) {
        const temp = [...original].sort(() => Math.random() - 0.5);
        setResults(temp);
      } else {
        clearInterval(interval);
        const finalShuffled = [...original].sort(() => Math.random() - 0.5);
        setResults(finalShuffled);
        setResultsInput(finalShuffled.join(', '));
        generateLadder();
        setTimeout(() => setIsShuffling(false), 200);
      }
    }, 80);
  };

  // Calculate ladder width
  const ladderWidth = Math.min(400, players.length * 80);

  const getShareUrl = () => {
    if (finalResults.size === 0) return '';
    const mappings = players.map((player, idx) => ({
      player,
      result: results[finalResults.get(idx) || 0]
    }));
    const data = { mappings };
    const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
    return `${siteConfig.url}/en/tools/ladder-game-en#share=${encoded}`;
  };

  // Restore shared data from URL hash
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (hash.startsWith('#share=')) {
      try {
        const decoded = decodeURIComponent(atob(hash.slice(7)));
        const parsed = JSON.parse(decoded);
        if (parsed.mappings && Array.isArray(parsed.mappings)) {
          restoredFromShare.current = true;
          const sharedPlayers = parsed.mappings.map((m: { player: string }) => m.player);
          const sharedResults = parsed.mappings.map((m: { result: string }) => m.result);
          setPlayers(sharedPlayers);
          setPlayersInput(sharedPlayers.join(', '));
          setResults(sharedResults);
          setResultsInput(sharedResults.join(', '));
          const newFinalResults = new Map<number, number>();
          parsed.mappings.forEach((_: unknown, idx: number) => {
            newFinalResults.set(idx, idx);
          });
          setFinalResults(newFinalResults);
          setIsRevealed(true);
          window.history.replaceState(null, '', window.location.pathname);
        }
      } catch {
        // ignore
      }
    }
  }, []);

  return (
    <div className="space-y-2">
      {/* Ladder area - aligned players/ladder/results */}
      <div className="flex flex-col items-center">
        {/* Players */}
        <div
          className="grid gap-1 mb-2"
          style={{
            width: ladderWidth,
            gridTemplateColumns: `repeat(${players.length}, 1fr)`
          }}
        >
          {players.map((player, idx) => (
            <button
              key={idx}
              onClick={() => runLadder(idx)}
              disabled={isAnimating}
              className={`px-2 py-2 rounded-lg font-medium transition-all text-sm truncate ${
                selectedPlayer === idx && isAnimating
                  ? 'bg-red-500 text-white'
                  : finalResults.has(idx)
                  ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 border-2 border-green-400'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {finalResults.has(idx)
                ? `${player} → ${results[finalResults.get(idx)!]}`
                : player}
            </button>
          ))}
        </div>

        {/* Ladder */}
        <canvas
          ref={canvasRef}
          width={ladderWidth}
          height={300}
          className="bg-gray-50 dark:bg-gray-800 rounded-lg"
        />

        {/* Results */}
        <div
          className="grid gap-1 mt-2"
          style={{
            width: ladderWidth,
            gridTemplateColumns: `repeat(${results.length}, 1fr)`
          }}
        >
          {results.map((result, idx) => {
            const winnerIdx = [...finalResults.entries()].find(([, v]) => v === idx)?.[0];
            return (
              <div
                key={idx}
                className={`px-2 py-2 rounded-lg text-center text-sm transition-all duration-100 ${
                  isShuffling
                    ? 'bg-blue-100 dark:bg-blue-900/30 scale-95'
                    : winnerIdx !== undefined
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-400'
                    : 'bg-gray-100 dark:bg-gray-800'
                }`}
              >
                <p className="font-medium truncate">{result || '?'}</p>
                {winnerIdx !== undefined && (
                  <p className="text-xs text-gray-500 truncate">{players[winnerIdx]}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Options */}
      <div className="flex justify-center">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={hideMiddle}
            onChange={(e) => setHideMiddle(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300"
          />
          <span className="text-gray-700 dark:text-gray-300">Hide middle section</span>
        </label>
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-3 flex-wrap">
        <Button variant="secondary" onClick={generateLadder}>
          Regenerate
        </Button>
        <Button variant="secondary" onClick={shuffleResults} disabled={isShuffling}>
          {isShuffling ? '🔀 Shuffling...' : '🔀 Shuffle Results'}
        </Button>
        <Button onClick={revealAll} disabled={isRevealed}>
          Reveal All
        </Button>
        <Button variant="ghost" onClick={resetGame}>
          Reset
        </Button>
      </div>

      {/* Share results - after reveal */}
      {isRevealed && finalResults.size > 0 && (
        <div>
          <div>
            <Card variant="bordered" className="p-4">
              <p className="text-sm font-bold mb-3">Ladder Game Results</p>
              <div className="space-y-2">
                {players.map((player, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-gray-900 dark:text-white">{player}</span>
                    <span className="text-gray-400">→</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">{results[finalResults.get(idx) ?? 0]}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          <Card variant="bordered" className="p-4 mt-3">
            <p className="text-sm font-medium mb-3">Share Results</p>
            <ResultShareButtonsEn
              url={getShareUrl()}
              title={`Ladder Game Results: ${players.length} players`}
              description={players.map((p, i) => `${p}→${results[finalResults.get(i) || 0]}`).join(', ')}
            />
          </Card>
        </div>
      )}

      {/* Settings */}
      <Card variant="bordered" className="p-4 space-y-3">
        <div>
          <p className="text-xs font-medium text-gray-500 mb-1">Participants (comma-separated, max 8)</p>
          <Input
            value={playersInput}
            onChange={(e) => setPlayersInput(e.target.value)}
            placeholder="e.g., Alice, Bob, Charlie"
          />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 mb-1">Results (same count as participants)</p>
          <Input
            value={resultsInput}
            onChange={(e) => setResultsInput(e.target.value)}
            placeholder="e.g., Win, Lose, Lose"
          />
        </div>
        {error && (
          <p className="text-xs text-orange-500 font-medium">{error}</p>
        )}
      </Card>

      <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
        <p>• Click a name to climb the ladder</p>
        <p>• Use Reveal All to see all results at once</p>
        <p>• Participants and results count must match</p>
      </div>
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          What is the Ladder Game (Ghost Leg)?
        </h2>
        <p className="text-sm leading-relaxed">
          The Ladder Game, also known as Ghost Leg or Amidakuji, is a lottery method where participants choose a starting point at the top and follow vertical lines down, moving sideways whenever they encounter a horizontal line, until they reach a result at the bottom.
          Since horizontal rungs are randomly placed, no one can predict which result they will get, ensuring a fair and unbiased selection.
          Perfect for assigning chores, deciding who pays the bill, gift exchanges, presentation order, or any group decision.
          Supports up to 8 participants with animated path visualization.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          Use Case Examples
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-3 font-semibold">Situation</th>
                <th className="text-left py-2 px-3 font-semibold">Participants</th>
                <th className="text-left py-2 px-3 font-semibold">Results</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-400">
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">Who pays the bill</td>
                <td className="py-2 px-3">Friend names</td>
                <td className="py-2 px-3">Pays, Safe, Safe, Safe</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">Chore assignment</td>
                <td className="py-2 px-3">A, B, C, D</td>
                <td className="py-2 px-3">Kitchen, Bathroom, Trash, Free</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">Gift exchange</td>
                <td className="py-2 px-3">Team members</td>
                <td className="py-2 px-3">Gift 1, Gift 2, Gift 3...</td>
              </tr>
              <tr>
                <td className="py-2 px-3">Presentation order</td>
                <td className="py-2 px-3">Group names</td>
                <td className="py-2 px-3">1st, 2nd, 3rd...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          Tips for Using
        </h2>
        <ul className="text-sm space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
          <li>Number of participants must match number of results (separate with commas)</li>
          <li>Use "Hide Middle" option to conceal paths until results are revealed</li>
          <li>Click "Shuffle Results" to randomize the order of outcomes</li>
          <li>Click on a participant name to see their animated path</li>
          <li>Share results with friends using the share buttons</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Is the ladder result truly fair and random?',
            answer: 'Yes, horizontal rungs are randomly generated ensuring all participants have an equal chance of reaching any result. Each new ladder is completely regenerated with a fresh random pattern.',
          },
          {
            question: 'How many participants can join?',
            answer: 'Up to 8 participants can join. As the number of participants increases, the ladder automatically adds more horizontal rungs to maintain complexity and fairness.',
          },
          {
            question: 'How can I prevent people from seeing results beforehand?',
            answer: 'Enable the "Hide Middle" option to obscure the middle section of the ladder. Paths will only be revealed when someone clicks on a participant, perfect for fair group decisions.',
          },
        ]}
      />
    </div>
  );
}
