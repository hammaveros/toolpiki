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
  { name: '쉬움', range: 50, maxAttempts: 8 },
  { name: '보통', range: 100, maxAttempts: 7 },
  { name: '어려움', range: 1000, maxAttempts: 10 },
];

export function NumberGuess() {
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
    setMessage(`1부터 ${diff.range} 사이의 숫자를 맞춰보세요!`);
  }, []);

  const handleGuess = useCallback(() => {
    if (!game || game.status === 'won') return;

    const guess = parseInt(input);
    if (isNaN(guess) || guess < 1 || guess > difficulty.range) {
      setMessage(`1부터 ${difficulty.range} 사이의 숫자를 입력하세요`);
      return;
    }

    const newAttempts = game.attempts + 1;
    let hint: 'up' | 'down' | 'correct';
    let newMin = game.min;
    let newMax = game.max;

    if (guess === game.target) {
      hint = 'correct';
      setMessage(`🎉 정답! ${newAttempts}번만에 맞추셨습니다!`);
      setGame({
        ...game,
        attempts: newAttempts,
        history: [...game.history, { guess, hint }],
        status: 'won',
      });
    } else if (guess < game.target) {
      hint = 'up';
      newMin = Math.max(game.min, guess + 1);
      setMessage(`📈 UP! ${guess}보다 큽니다`);
      setGame({
        ...game,
        attempts: newAttempts,
        min: newMin,
        history: [...game.history, { guess, hint }],
      });
    } else {
      hint = 'down';
      newMax = Math.min(game.max, guess - 1);
      setMessage(`📉 DOWN! ${guess}보다 작습니다`);
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
          <h2 className="text-xl font-bold mb-4">숫자 맞추기 게임</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            컴퓨터가 생각한 숫자를 맞춰보세요!<br />
            힌트를 보고 UP/DOWN을 판단하세요.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-gray-500 mb-2">난이도 선택</p>
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
              <span className="text-sm text-gray-500">난이도: {difficulty.name}</span>
              <span className="text-sm text-gray-500">시도: {game.attempts}회</span>
            </div>
            <div className="text-center py-4">
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {game.min} ~ {game.max}
              </p>
              <p className="text-sm text-gray-500 mt-1">범위</p>
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
                  placeholder="숫자 입력"
                  className="flex-1 px-4 py-2 text-center text-lg border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                  min={1}
                  max={difficulty.range}
                  autoFocus
                />
                <Button onClick={handleGuess}>확인</Button>
              </div>
            )}

            {game.status === 'won' && (
              <div className="flex gap-2 justify-center">
                <Button onClick={() => startGame(difficulty)}>다시 하기</Button>
                <Button variant="secondary" onClick={() => setGame(null)}>
                  난이도 변경
                </Button>
              </div>
            )}
          </Card>

          {game.history.length > 0 && (
            <Card variant="bordered" className="p-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                기록
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
          🔢 숫자 맞추기 게임이란?
        </h2>
        <p className="text-sm leading-relaxed">
          숫자 맞추기(Up and Down) 게임은 컴퓨터가 특정 범위에서 생각한 숫자를 UP/DOWN 힌트를 통해 맞추는 고전 추리 게임입니다.
          숫자를 입력하면 정답보다 큰지 작은지 알려주어 범위를 좁혀나갈 수 있습니다.
          이진 탐색(Binary Search) 전략을 활용하면 1-100 범위에서 최대 7번, 1-1000 범위에서도 최대 10번이면 정답을 찾을 수 있습니다.
          쉬움/보통/어려움 세 가지 난이도로 도전해보세요.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          난이도별 정보
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-3 font-semibold">난이도</th>
                <th className="text-left py-2 px-3 font-semibold">범위</th>
                <th className="text-left py-2 px-3 font-semibold">최적 전략 횟수</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-400">
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">쉬움</td>
                <td className="py-2 px-3">1~50</td>
                <td className="py-2 px-3">최대 6회</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">보통</td>
                <td className="py-2 px-3">1~100</td>
                <td className="py-2 px-3">최대 7회</td>
              </tr>
              <tr>
                <td className="py-2 px-3">어려움</td>
                <td className="py-2 px-3">1~1000</td>
                <td className="py-2 px-3">최대 10회</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          공략 팁 (이진 탐색)
        </h2>
        <ul className="text-sm space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
          <li>항상 현재 범위의 중간값을 선택하세요</li>
          <li>예: 1~100 → 50 입력 → UP이면 51~100, DOWN이면 1~49</li>
          <li>매번 범위가 절반으로 줄어들어 빠르게 정답에 도달합니다</li>
          <li>기록에서 이전 추측과 힌트를 확인하며 전략을 세우세요</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '이진 탐색이 뭔가요?',
            answer: '범위의 중간값을 선택해 탐색 범위를 매번 절반으로 줄이는 알고리즘입니다. 1-100에서 시작하면 50→25 또는 75→... 순서로 범위를 좁혀 최대 7번이면 답을 찾습니다.',
          },
          {
            question: '랜덤으로 찍어도 맞출 수 있나요?',
            answer: '가능하지만 확률이 매우 낮습니다. 100 범위에서 1%의 확률이죠. 이진 탐색을 사용하면 확실하게 7번 이내에 맞출 수 있습니다.',
          },
          {
            question: '게임 기록이 저장되나요?',
            answer: '현재 게임의 추측 기록만 화면에 표시됩니다. 게임을 새로 시작하면 기록이 초기화됩니다. 여러 번 도전해서 최소 횟수에 도전해보세요!',
          },
        ]}
      />
    </div>
  );
}
