'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';
import { ResultShareButtons } from '@/components/share/ResultShareButtons';
import { siteConfig } from '@/data/site';
import { FaqSection } from '@/components/ui/FaqItem';

type DecisionType = 'yesno' | 'custom' | 'number' | 'coin';

export function RandomDecisionMaker() {
  const [type, setType] = useState<DecisionType>('yesno');
  const [customOptions, setCustomOptions] = useState('');
  const [numberMin, setNumberMin] = useState(1);
  const [numberMax, setNumberMax] = useState(100);
  const [yesProbability, setYesProbability] = useState(50); // Yes 확률 (%)
  const [result, setResult] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [stats, setStats] = useState({ yes: 0, no: 0, heads: 0, tails: 0 });

  const makeDecision = () => {
    setIsAnimating(true);
    setResult(null);

    // 애니메이션 효과
    let count = 0;
    const maxCount = 10;
    const interval = setInterval(() => {
      count++;

      // 임시 결과 보여주기
      const tempResult = getRandomResult();
      setResult(tempResult);

      if (count >= maxCount) {
        clearInterval(interval);
        const finalResult = getRandomResult(true);
        setResult(finalResult);
        setHistory((prev) => [finalResult, ...prev].slice(0, 10));
        setIsAnimating(false);
      }
    }, 100);
  };

  const getRandomResult = (isFinal = false): string => {
    switch (type) {
      case 'yesno':
        const isYes = Math.random() * 100 < yesProbability;
        if (isFinal) {
          setStats(prev => ({
            ...prev,
            yes: prev.yes + (isYes ? 1 : 0),
            no: prev.no + (isYes ? 0 : 1)
          }));
        }
        return isYes ? '✅ YES' : '❌ NO';

      case 'coin':
        const isHeads = Math.random() < 0.5;
        if (isFinal) {
          setStats(prev => ({
            ...prev,
            heads: prev.heads + (isHeads ? 1 : 0),
            tails: prev.tails + (isHeads ? 0 : 1)
          }));
        }
        return isHeads ? '🪙 앞면' : '🪙 뒷면';

      case 'number':
        const num = Math.floor(Math.random() * (numberMax - numberMin + 1)) + numberMin;
        return `🔢 ${num}`;

      case 'custom':
        const options = customOptions
          .split('\n')
          .map((o) => o.trim())
          .filter((o) => o);
        if (options.length === 0) return '옵션을 입력하세요';
        return `🎯 ${options[Math.floor(Math.random() * options.length)]}`;

      default:
        return '';
    }
  };

  const types: { key: DecisionType; label: string; icon: string }[] = [
    { key: 'yesno', label: 'Yes/No', icon: '✅❌' },
    { key: 'coin', label: '동전 던지기', icon: '🪙' },
    { key: 'number', label: '숫자 뽑기', icon: '🔢' },
    { key: 'custom', label: '직접 입력', icon: '✏️' },
  ];

  const getShareUrl = () => {
    if (!result) return '';
    const data = { type, result };
    const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
    return `${siteConfig.url}/tools/random-decision#share=${encoded}`;
  };

  // URL hash에서 공유 데이터 복원
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (hash.startsWith('#share=')) {
      try {
        const decoded = decodeURIComponent(atob(hash.slice(7)));
        const parsed = JSON.parse(decoded);
        if (parsed.type && parsed.result) {
          setType(parsed.type);
          setResult(parsed.result);
          window.history.replaceState(null, '', window.location.pathname);
        }
      } catch {
        // ignore
      }
    }
  }, []);

  return (
    <div className="space-y-2">
      {/* 타입 선택 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {types.map((t) => (
          <button
            key={t.key}
            onClick={() => setType(t.key)}
            className={`p-3 rounded-lg text-center transition-all ${
              type === t.key
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <span className="text-xl block mb-1">{t.icon}</span>
            <span className="text-sm">{t.label}</span>
          </button>
        ))}
      </div>

      {/* 옵션 설정 */}
      {type === 'yesno' && (
        <Card variant="bordered" className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">Yes 확률</p>
            <span className="text-lg font-bold text-blue-600">{yesProbability}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={yesProbability}
            onChange={(e) => setYesProbability(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0% (항상 NO)</span>
            <span>50% (공정)</span>
            <span>100% (항상 YES)</span>
          </div>
          {(stats.yes > 0 || stats.no > 0) && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 mb-2">통계</p>
              <div className="flex gap-4 text-sm">
                <span className="text-green-600">✅ YES: {stats.yes}회</span>
                <span className="text-red-600">❌ NO: {stats.no}회</span>
                <span className="text-gray-500">
                  ({stats.yes + stats.no > 0 ? Math.round(stats.yes / (stats.yes + stats.no) * 100) : 0}%)
                </span>
              </div>
            </div>
          )}
        </Card>
      )}

      {type === 'coin' && (stats.heads > 0 || stats.tails > 0) && (
        <Card variant="bordered" className="p-4">
          <p className="text-xs text-gray-500 mb-2">통계</p>
          <div className="flex gap-4 text-sm">
            <span>🪙 앞면: {stats.heads}회</span>
            <span>🪙 뒷면: {stats.tails}회</span>
          </div>
        </Card>
      )}

      {type === 'number' && (
        <Card variant="bordered" className="p-4">
          <p className="text-sm font-medium mb-3">숫자 범위</p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={numberMin}
              onChange={(e) => setNumberMin(parseInt(e.target.value) || 0)}
              className="w-24 px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            />
            <span className="text-gray-500">~</span>
            <input
              type="number"
              value={numberMax}
              onChange={(e) => setNumberMax(parseInt(e.target.value) || 0)}
              className="w-24 px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
        </Card>
      )}

      {type === 'custom' && (
        <Textarea
          label="선택지 입력 (줄바꿈으로 구분)"
          value={customOptions}
          onChange={(e) => setCustomOptions(e.target.value)}
          placeholder="옵션 1&#10;옵션 2&#10;옵션 3"
          rows={5}
        />
      )}

      {/* 결과 영역 */}
      <Card variant="bordered" className="p-4 md:p-6 text-center">
        <div className={`text-4xl font-bold mb-4 min-h-[60px] ${isAnimating ? 'animate-pulse' : ''}`}>
          {result || '?'}
        </div>
        <Button
          onClick={makeDecision}
          disabled={isAnimating || (type === 'custom' && !customOptions.trim())}
          size="lg"
          className="px-8"
        >
          {isAnimating ? '결정 중...' : '🎲 결정하기!'}
        </Button>
        {result && !isAnimating && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <ResultShareButtons
              url={getShareUrl()}
              title={`랜덤 결정: ${result}`}
              description="JSSpace 랜덤 결정 도구"
            />
          </div>
        )}
      </Card>

      {/* 히스토리 */}
      {history.length > 0 && (
        <Card variant="bordered" className="p-4">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-medium">최근 기록</p>
            <Button variant="ghost" size="sm" onClick={() => setHistory([])}>
              초기화
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {history.map((h, idx) => (
              <span
                key={idx}
                className={`px-3 py-1 rounded-full text-sm ${
                  idx === 0
                    ? 'bg-blue-100 dark:bg-blue-900/30 font-medium'
                    : 'bg-gray-100 dark:bg-gray-800'
                }`}
              >
                {h}
              </span>
            ))}
          </div>
        </Card>
      )}

      <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
        <p>• 결정 장애가 있을 때 빠르게 결정하세요</p>
        <p>• 결과에 따라야 할 의무는 없습니다 😄</p>
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
          🎲 랜덤 결정 도구란?
        </h2>
        <p className="text-sm leading-relaxed">
          랜덤 결정 도구는 선택하기 어려운 상황에서 운에 맡겨 무작위로 결과를 정해주는 유틸리티입니다.
          Yes/No 결정, 동전 던지기, 숫자 범위 뽑기, 직접 입력한 선택지 중 고르기 등 4가지 모드를 지원합니다.
          Yes 확률 조절 기능으로 원하는 비율로 결과를 조정할 수도 있습니다.
          결정 장애가 있을 때, 빠르게 결론을 내야 할 때 활용하세요.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          모드별 설명
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-3 font-semibold">모드</th>
                <th className="text-left py-2 px-3 font-semibold">설명</th>
                <th className="text-left py-2 px-3 font-semibold">활용 예시</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-400">
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">Yes/No</td>
                <td className="py-2 px-3">확률 조절 가능한 이진 결정</td>
                <td className="py-2 px-3">오늘 운동할까? 전화할까?</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">동전 던지기</td>
                <td className="py-2 px-3">앞면/뒷면 50:50</td>
                <td className="py-2 px-3">누가 먼저? A팀 vs B팀</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">숫자 뽑기</td>
                <td className="py-2 px-3">범위 내 랜덤 숫자</td>
                <td className="py-2 px-3">1~100 중 번호 뽑기</td>
              </tr>
              <tr>
                <td className="py-2 px-3">직접 입력</td>
                <td className="py-2 px-3">내가 정한 선택지 중 뽑기</td>
                <td className="py-2 px-3">점심 메뉴, 영화 고르기</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          사용 팁
        </h2>
        <ul className="text-sm space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
          <li>Yes/No 모드에서 확률을 조절해 원하는 방향으로 기울일 수 있습니다</li>
          <li>통계 기능으로 Yes/No, 앞면/뒷면의 실제 분포를 확인하세요</li>
          <li>직접 입력 모드에서는 줄바꿈으로 선택지를 구분합니다</li>
          <li>결과에 따르지 않아도 됩니다 - 참고용으로만 활용하세요</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '결과가 정말 무작위인가요?',
            answer: 'JavaScript의 Math.random() 함수를 사용하여 의사 난수(pseudo-random)를 생성합니다. 일반적인 용도에는 충분히 무작위이지만, 암호학적 보안이 필요한 곳에는 적합하지 않습니다.',
          },
          {
            question: 'Yes 확률을 바꾸면 어떻게 되나요?',
            answer: 'Yes 확률을 50% 이외로 설정하면 결과가 한쪽으로 기울어집니다. 예를 들어 70%로 설정하면 10번 중 약 7번은 Yes가 나옵니다.',
          },
          {
            question: '기록이 저장되나요?',
            answer: '최근 10개의 결과가 화면에 표시되며, 페이지를 새로고침하면 초기화됩니다. 공유 기능으로 특정 결과를 저장할 수 있습니다.',
          },
        ]}
      />
    </div>
  );
}
