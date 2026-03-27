'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';

interface GameState {
  target: number;
  min: number;
  max: number;
  attempts: number;
  history: { guess: number; hint: 'up' | 'down' | 'correct' }[];
  status: 'playing' | 'won';
}

const difficulties = [
  { name: 'Easy', range: 50, maxAttempts: 8 },
  { name: 'Normal', range: 100, maxAttempts: 7 },
  { name: 'Hard', range: 1000, maxAttempts: 10 },
];

export function NumberGuessEn() {
  const [difficulty, setDifficulty] = useState(difficulties[1]);
  const [game, setGame] = useState<GameState | null>(null);
  const [input, setInput] = useState('');
  const [message, setMessage] = useState('');

  const startGame = useCallback((diff: typeof difficulties[0]) => {
    setDifficulty(diff);
    setGame({
      target: Math.floor(Math.random() * diff.range) + 1,
      min: 1,
      max: diff.range,
      attempts: 0,
      history: [],
      status: 'playing',
    });
    setInput('');
    setMessage(`Guess a number between 1 and ${diff.range}!`);
  }, []);

  const handleGuess = useCallback(() => {
    if (!game || game.status === 'won') return;

    const guess = parseInt(input);
    if (isNaN(guess) || guess < 1 || guess > difficulty.range) {
      setMessage(`Enter a number between 1 and ${difficulty.range}`);
      return;
    }

    const newAttempts = game.attempts + 1;
    let hint: 'up' | 'down' | 'correct';
    let newMin = game.min;
    let newMax = game.max;

    if (guess === game.target) {
      hint = 'correct';
      setMessage(`Correct! You got it in ${newAttempts} attempts!`);
      setGame({
        ...game,
        attempts: newAttempts,
        history: [...game.history, { guess, hint }],
        status: 'won',
      });
    } else if (guess < game.target) {
      hint = 'up';
      newMin = Math.max(game.min, guess + 1);
      setMessage(`Higher! The number is greater than ${guess}`);
      setGame({
        ...game,
        attempts: newAttempts,
        min: newMin,
        history: [...game.history, { guess, hint }],
      });
    } else {
      hint = 'down';
      newMax = Math.min(game.max, guess - 1);
      setMessage(`Lower! The number is less than ${guess}`);
      setGame({
        ...game,
        attempts: newAttempts,
        max: newMax,
        history: [...game.history, { guess, hint }],
      });
    }

    setInput('');
  }, [game, input, difficulty.range]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGuess();
    }
  };

  return (
    <div className="space-y-4 max-w-md mx-auto">
      {!game ? (
        <Card variant="bordered" className="p-6 text-center">
          <h2 className="text-xl font-bold mb-4">Number Guessing Game</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Try to guess the number the computer is thinking of!<br />
            Use the hints to determine if you need to go higher or lower.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-gray-500 mb-2">Select Difficulty</p>
            <div className="flex gap-2 justify-center">
              {difficulties.map((diff) => (
                <Button
                  key={diff.name}
                  onClick={() => startGame(diff)}
                  variant="primary"
                >
                  {diff.name} (1-{diff.range})
                </Button>
              ))}
            </div>
          </div>
        </Card>
      ) : (
        <>
          <Card variant="bordered" className="p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">Difficulty: {difficulty.name}</span>
              <span className="text-sm text-gray-500">Attempts: {game.attempts}</span>
            </div>
            <div className="text-center py-4">
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {game.min} ~ {game.max}
              </p>
              <p className="text-sm text-gray-500 mt-1">Range</p>
            </div>
          </Card>

          <Card variant="bordered" className="p-4">
            <p className={`text-center text-lg font-medium mb-4 ${
              game.status === 'won' ? 'text-green-600 dark:text-green-400' : ''
            }`}>
              {message}
            </p>

            {game.status === 'playing' && (
              <div className="flex gap-2">
                <input
                  type="number"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter number"
                  className="flex-1 px-4 py-2 text-center text-lg border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                  min={1}
                  max={difficulty.range}
                  autoFocus
                />
                <Button onClick={handleGuess}>Guess</Button>
              </div>
            )}

            {game.status === 'won' && (
              <div className="flex gap-2 justify-center">
                <Button onClick={() => startGame(difficulty)}>Play Again</Button>
                <Button variant="secondary" onClick={() => setGame(null)}>
                  Change Difficulty
                </Button>
              </div>
            )}
          </Card>

          {game.history.length > 0 && (
            <Card variant="bordered" className="p-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                History
              </h3>
              <div className="flex flex-wrap gap-2">
                {game.history.map((item, idx) => (
                  <span
                    key={idx}
                    className={`px-3 py-1 rounded-full text-sm font-mono ${
                      item.hint === 'correct'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : item.hint === 'up'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}
                  >
                    {item.guess} {item.hint === 'up' ? '↑' : item.hint === 'down' ? '↓' : '✓'}
                  </span>
                ))}
              </div>
            </Card>
          )}
        </>
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
          What is Number Guessing Game?
        </h2>
        <p className="text-sm leading-relaxed">
          Number Guessing (Higher or Lower) is a classic deduction game where you try to find the number the computer is thinking of using UP/DOWN hints.
          After each guess, you are told whether the target is higher or lower, allowing you to narrow down the range.
          Using a binary search strategy, you can find any number in a 1-100 range in at most 7 attempts, and in a 1-1000 range in at most 10 attempts.
          Try three difficulty levels: Easy, Normal, and Hard.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          Difficulty Levels
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-3 font-semibold">Difficulty</th>
                <th className="text-left py-2 px-3 font-semibold">Range</th>
                <th className="text-left py-2 px-3 font-semibold">Optimal Attempts</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-400">
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">Easy</td>
                <td className="py-2 px-3">1-50</td>
                <td className="py-2 px-3">Max 6</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">Normal</td>
                <td className="py-2 px-3">1-100</td>
                <td className="py-2 px-3">Max 7</td>
              </tr>
              <tr>
                <td className="py-2 px-3">Hard</td>
                <td className="py-2 px-3">1-1000</td>
                <td className="py-2 px-3">Max 10</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          Strategy Tips (Binary Search)
        </h2>
        <ul className="text-sm space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
          <li>Always choose the middle value of the current range</li>
          <li>Example: 1-100 start, guess 50, if Higher then range becomes 51-100</li>
          <li>Each guess cuts the range in half for fast convergence</li>
          <li>Check the history to track your previous guesses and hints</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'What is binary search?',
            answer: 'Binary search is an algorithm that selects the middle value to halve the search range each time. Starting from 1-100, you guess 50, then 25 or 75, narrowing down until you find the answer in at most 7 guesses.',
          },
          {
            question: 'Can I win by guessing randomly?',
            answer: 'Technically yes, but the probability is very low - just 1% in a 100-number range. Using binary search guarantees finding the answer within 7 attempts.',
          },
          {
            question: 'Are my game records saved?',
            answer: 'Only the current game guess history is displayed on screen. Starting a new game resets the history. Challenge yourself to find the number in the fewest attempts!',
          },
        ]}
      />
    </div>
  );
}
