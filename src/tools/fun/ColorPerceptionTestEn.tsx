'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ResultShareButtonsEn } from '@/components/share/ResultShareButtonsEn';
import { FaqSection } from '@/components/ui/FaqItem';

interface Round {
  targetColor: string;
  options: string[];
  correctIndex: number;
}

function generateRandomColor(): string {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}

function generateSimilarColor(base: string, variance: number): string {
  const match = base.match(/rgb\((\d+), (\d+), (\d+)\)/);
  if (!match) return base;

  const r = Math.min(255, Math.max(0, parseInt(match[1]) + Math.floor((Math.random() - 0.5) * variance)));
  const g = Math.min(255, Math.max(0, parseInt(match[2]) + Math.floor((Math.random() - 0.5) * variance)));
  const b = Math.min(255, Math.max(0, parseInt(match[3]) + Math.floor((Math.random() - 0.5) * variance)));
  return `rgb(${r}, ${g}, ${b})`;
}

export function ColorPerceptionTestEn() {
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'result'>('ready');
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState<Round | null>(null);
  const [startTime, setStartTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [difficulty, setDifficulty] = useState(80);

  const totalRounds = 10;

  const generateRound = useCallback(() => {
    const targetColor = generateRandomColor();
    const correctIndex = Math.floor(Math.random() * 4);
    const options: string[] = [];

    for (let i = 0; i < 4; i++) {
      if (i === correctIndex) {
        options.push(targetColor);
      } else {
        options.push(generateSimilarColor(targetColor, difficulty));
      }
    }

    return { targetColor, options, correctIndex };
  }, [difficulty]);

  const startGame = () => {
    setGameState('playing');
    setRound(1);
    setScore(0);
    setTotalTime(0);
    setCurrentRound(generateRound());
    setStartTime(Date.now());
  };

  const handleSelect = (index: number) => {
    if (!currentRound) return;

    const elapsed = Date.now() - startTime;
    setTotalTime((prev) => prev + elapsed);

    if (index === currentRound.correctIndex) {
      setScore((prev) => prev + 1);
    }

    if (round >= totalRounds) {
      setGameState('result');
    } else {
      setRound((prev) => prev + 1);
      setCurrentRound(generateRound());
      setStartTime(Date.now());
      setDifficulty((prev) => Math.max(20, prev - 5));
    }
  };

  const getResultMessage = () => {
    const accuracy = (score / totalRounds) * 100;
    const avgTime = totalTime / totalRounds;

    if (accuracy >= 90 && avgTime < 1500) return '🎨 Color genius! You have designer potential';
    if (accuracy >= 80) return '👀 Excellent color perception!';
    if (accuracy >= 60) return '😊 Average color perception';
    return '🔍 Color distinction is a bit challenging';
  };

  const getShareUrl = () => {
    const accuracy = Math.round((score / totalRounds) * 100);
    const avgTime = (totalTime / totalRounds / 1000).toFixed(2);
    const data = { score, total: totalRounds, accuracy, avgTime };
    const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
    return `${window.location.origin}${window.location.pathname}#share=${encoded}`;
  };

  // Restore shared data from URL hash
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (hash.startsWith('#share=')) {
      try {
        const decoded = decodeURIComponent(atob(hash.slice(7)));
        const parsed = JSON.parse(decoded);
        if (parsed.score !== undefined && parsed.total) {
          setScore(parsed.score);
          setTotalTime(parsed.avgTime * parsed.total * 1000);
          setRound(parsed.total);
          setGameState('result');
          window.history.replaceState(null, '', window.location.pathname);
        }
      } catch {
        // Ignore invalid hash
      }
    }
  }, []);

  return (
    <div className="space-y-4">
      {gameState === 'ready' && (
        <Card variant="bordered" className="p-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Find the exact matching color among 4 options!<br />
            {totalRounds} rounds, difficulty increases as you progress.
          </p>
          <Button onClick={startGame}>
            Start
          </Button>
        </Card>
      )}

      {gameState === 'playing' && currentRound && (
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>Round {round}/{totalRounds}</span>
            <span>Score: {score}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 text-center">
              <p className="text-xs text-gray-500 mb-1">Target</p>
              <div
                className="w-16 h-16 rounded-lg shadow"
                style={{ backgroundColor: currentRound.targetColor }}
              />
            </div>

            <div className="grid grid-cols-4 gap-2 flex-1">
              {currentRound.options.map((color, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className="aspect-square rounded-lg shadow hover:scale-105 transition-transform border-2 border-transparent hover:border-blue-500"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {gameState === 'result' && (
        <Card variant="bordered" className="p-4 text-center">
          <h2 className="text-lg font-bold mb-3">Test Complete!</h2>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-500">Accuracy</p>
              <p className="text-2xl font-bold text-blue-600">
                {Math.round((score / totalRounds) * 100)}%
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-500">Avg. Response</p>
              <p className="text-2xl font-bold text-green-600">
                {(totalTime / totalRounds / 1000).toFixed(2)}s
              </p>
            </div>
          </div>

          <p className="text-sm mb-4">{getResultMessage()}</p>

          <div className="mb-4">
            <ResultShareButtonsEn
              url={getShareUrl()}
              title={`Color Perception Test: ${Math.round((score / totalRounds) * 100)}% Accuracy`}
              description={`Avg response ${(totalTime / totalRounds / 1000).toFixed(2)}s - ToolPiki`}
            />
          </div>

          <Button onClick={() => {
            setGameState('ready');
            setDifficulty(80);
          }}>
            Try Again
          </Button>
        </Card>
      )}

      <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
        <p>• Find the exact color match among similar shades</p>
        <p>• Color differences decrease as rounds progress</p>
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
          🎨 What is Color Perception Test?
        </h2>
        <p className="text-sm leading-relaxed">
          Color Perception Test measures your ability to distinguish subtle color differences.
          Find the exact matching color among 4 similar options in each round.
          Difficulty increases across 10 rounds while tracking both accuracy and response time.
          Perfect for designers, illustrators, photographers, and anyone curious about their color vision abilities.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 Color Perception Levels
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Accuracy</th>
                <th className="text-left py-2 px-2">Rating</th>
                <th className="text-left py-2 px-2">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">90%+</td><td className="font-medium text-emerald-600">Excellent</td><td>Designer-level color perception</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">70-89%</td><td className="font-medium text-green-600">Good</td><td>Above average color recognition</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">50-69%</td><td className="font-medium text-yellow-600">Average</td><td>Typical color perception</td></tr>
              <tr><td className="py-2 px-2 font-mono">Below 50%</td><td className="font-medium text-orange-600">Needs Work</td><td>Practice recommended</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Tips to Improve Color Perception
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Monitor calibration</strong>: Ensure accurate color display on your screen</li>
          <li><strong>Good lighting</strong>: Color perception decreases in dim environments</li>
          <li><strong>Learn color theory</strong>: Understanding complementary and analogous colors helps</li>
          <li><strong>Art exposure</strong>: Viewing diverse color combinations develops perception</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Will color blindness affect my test results?',
            answer: 'Yes, depending on the type and severity. Red-green color blindness may cause difficulty with those color ranges. This test is not a diagnostic tool - consult an eye doctor if concerned.',
          },
          {
            question: 'Do results vary between different monitors?',
            answer: 'Yes, monitor color settings and panel types affect how colors appear. IPS panels with proper calibration provide the most accurate results.',
          },
          {
            question: 'Is color perception innate or can it be trained?',
            answer: 'Basic color recognition is genetic, but the ability to distinguish subtle differences can be improved through practice. Designers develop sharper color perception through continuous work.',
          },
        ]}
      />
    </div>
  );
}
