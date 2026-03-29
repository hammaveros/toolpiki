'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ResultShareButtons } from '@/components/share/ResultShareButtons';
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

export function ColorPerceptionTest() {
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'result'>('ready');
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState<Round | null>(null);
  const [startTime, setStartTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [difficulty, setDifficulty] = useState(80); // 색상 차이 (낮을수록 어려움)

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
      // 점점 어렵게
      setDifficulty((prev) => Math.max(20, prev - 5));
    }
  };

  const getResultMessage = () => {
    const accuracy = (score / totalRounds) * 100;
    const avgTime = totalTime / totalRounds;

    if (accuracy >= 90 && avgTime < 1500) return '🎨 색상 인지 천재! 디자이너 소질 있음';
    if (accuracy >= 80) return '👀 훌륭한 색상 감각!';
    if (accuracy >= 60) return '😊 평균적인 색상 인지력';
    return '🔍 색상 구분이 좀 어려운 편';
  };

  const getShareUrl = () => {
    const accuracy = Math.round((score / totalRounds) * 100);
    const avgTime = (totalTime / totalRounds / 1000).toFixed(2);
    const data = { score, total: totalRounds, accuracy, avgTime };
    const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
    return `${window.location.origin}${window.location.pathname}#share=${encoded}`;
  };

  // URL hash에서 공유 데이터 복원
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
        // 잘못된 hash는 무시
      }
    }
  }, []);

  return (
    <div className="space-y-4">
      {gameState === 'ready' && (
        <Card variant="bordered" className="p-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            제시된 색상과 동일한 색상을 4개 중에서 찾으세요!<br />
            총 {totalRounds}라운드, 점점 어려워집니다.
          </p>
          <Button onClick={startGame}>
            시작하기
          </Button>
        </Card>
      )}

      {gameState === 'playing' && currentRound && (
        <div className="space-y-4 max-w-lg">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>라운드 {round}/{totalRounds}</span>
            <span>점수: {score}</span>
          </div>

          {/* 타겟 색상 + 선택지 한 줄 */}
          <div className="flex items-center gap-4">
            {/* 타겟 */}
            <div className="flex-shrink-0 text-center">
              <p className="text-xs text-gray-500 mb-1">정답</p>
              <div
                className="w-14 h-14 rounded-lg shadow"
                style={{ backgroundColor: currentRound.targetColor }}
              />
            </div>

            {/* 선택지 */}
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
          <h2 className="text-lg font-bold mb-3">테스트 완료!</h2>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-500">정확도</p>
              <p className="text-2xl font-bold text-blue-600">
                {Math.round((score / totalRounds) * 100)}%
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-500">평균 반응시간</p>
              <p className="text-2xl font-bold text-green-600">
                {(totalTime / totalRounds / 1000).toFixed(2)}초
              </p>
            </div>
          </div>

          <p className="text-sm mb-4">{getResultMessage()}</p>

          <div className="mb-4">
            <ResultShareButtons
              url={getShareUrl()}
              title={`색감 테스트 결과: 정확도 ${Math.round((score / totalRounds) * 100)}%`}
              description={`평균 반응시간 ${(totalTime / totalRounds / 1000).toFixed(2)}초 - ToolPiki`}
            />
          </div>

          <Button onClick={() => {
            setGameState('ready');
            setDifficulty(80);
          }}>
            다시 하기
          </Button>
        </Card>
      )}

      <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
        <p>• 비슷한 색상 중 정확히 같은 색을 찾는 테스트</p>
        <p>• 라운드가 진행될수록 색상 차이가 줄어듭니다</p>
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
          🎨 색감 테스트란?
        </h2>
        <p className="text-sm leading-relaxed">
          색감 테스트는 미세한 색상 차이를 구별하는 능력을 측정하는 도구입니다.
          제시된 색상과 정확히 일치하는 색을 4개의 유사한 색상 중에서 찾아야 합니다.
          10라운드 동안 난이도가 점점 높아지며, 정확도와 반응시간을 함께 측정합니다.
          디자이너, 일러스트레이터, 사진작가 등 색상을 다루는 직업군에서 유용하게 활용할 수 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 색감 능력 수준
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">정확도</th>
                <th className="text-left py-2 px-2">등급</th>
                <th className="text-left py-2 px-2">설명</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">90% 이상</td><td className="font-medium text-emerald-600">뛰어남</td><td>디자이너급 색감</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">70~89%</td><td className="font-medium text-green-600">우수</td><td>평균 이상의 색상 인지력</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">50~69%</td><td className="font-medium text-yellow-600">보통</td><td>일반적인 색상 인지력</td></tr>
              <tr><td className="py-2 px-2 font-mono">50% 미만</td><td className="font-medium text-orange-600">개선 필요</td><td>색상 구분 연습 권장</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 색감 향상 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>모니터 캘리브레이션</strong>: 정확한 색상 표현을 위해 모니터 색감 조정</li>
          <li><strong>밝은 환경</strong>: 어두운 환경에서는 색상 구분력이 저하됨</li>
          <li><strong>색상 이론 학습</strong>: 보색, 유사색 등 색상 관계 이해</li>
          <li><strong>미술 감상</strong>: 다양한 색상 조합에 노출되면 감각 발달</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '색맹/색약이면 이 테스트를 통과하기 어렵나요?',
            answer: '색맹/색약의 정도에 따라 다릅니다. 적록색맹은 빨강-초록 계열에서 어려움을 겪을 수 있습니다. 이 테스트는 진단 도구가 아니며, 의심되면 안과 검사를 권장합니다.',
          },
          {
            question: '테스트 결과가 모니터마다 다른가요?',
            answer: '네, 모니터 색감 설정과 패널 종류에 따라 색상이 다르게 보일 수 있습니다. IPS 패널과 캘리브레이션된 모니터에서 가장 정확한 결과를 얻을 수 있습니다.',
          },
          {
            question: '색감은 타고난 건가요?',
            answer: '기본적인 색상 인지 능력은 유전이지만, 미세한 차이를 구별하는 능력은 훈련으로 향상됩니다. 디자이너들은 지속적인 작업을 통해 색감이 발달합니다.',
          },
        ]}
      />
    </div>
  );
}
