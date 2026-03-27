'use client';

import { useState, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import { FaqSection } from '@/components/ui/FaqItem';

type Mode = 'number' | 'list';

interface PickResult {
  values: (number | string)[];
  timestamp: Date;
}

function getSecureRandom(): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] / (0xffffffff + 1);
}

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(getSecureRandom() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function RandomPicker() {
  const [mode, setMode] = useState<Mode>('number');

  // 숫자 모드
  const [minNum, setMinNum] = useState('1');
  const [maxNum, setMaxNum] = useState('45');
  const [pickCount, setPickCount] = useState('6');
  const [allowDuplicates, setAllowDuplicates] = useState(false);

  // 리스트 모드
  const [listInput, setListInput] = useState('');
  const [listPickCount, setListPickCount] = useState('1');

  // 결과
  const [results, setResults] = useState<PickResult[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const pickNumbers = useCallback(() => {
    const min = parseInt(minNum) || 1;
    const max = parseInt(maxNum) || 100;
    const count = parseInt(pickCount) || 1;

    if (min > max) return;

    const range = max - min + 1;
    if (!allowDuplicates && count > range) return;

    setIsAnimating(true);

    setTimeout(() => {
      let picked: number[] = [];

      if (allowDuplicates) {
        for (let i = 0; i < count; i++) {
          picked.push(Math.floor(getSecureRandom() * range) + min);
        }
      } else {
        const pool = Array.from({ length: range }, (_, i) => i + min);
        const shuffled = shuffleArray(pool);
        picked = shuffled.slice(0, count).sort((a, b) => a - b);
      }

      setResults(prev => [{
        values: picked,
        timestamp: new Date()
      }, ...prev.slice(0, 9)]);

      setIsAnimating(false);
    }, 500);
  }, [minNum, maxNum, pickCount, allowDuplicates]);

  const pickFromList = useCallback(() => {
    const items = listInput
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (items.length === 0) return;

    const count = Math.min(parseInt(listPickCount) || 1, items.length);

    setIsAnimating(true);

    setTimeout(() => {
      const shuffled = shuffleArray(items);
      const picked = shuffled.slice(0, count);

      setResults(prev => [{
        values: picked,
        timestamp: new Date()
      }, ...prev.slice(0, 9)]);

      setIsAnimating(false);
    }, 500);
  }, [listInput, listPickCount]);

  const clearResults = () => setResults([]);

  return (
    <div className="space-y-2">
      {/* 모드 선택 */}
      <div className="flex gap-2">
        {(['number', 'list'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setResults([]); }}
            className={cn(
              'flex-1 py-2 px-4 rounded-lg font-medium transition-colors text-sm',
              mode === m
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            )}
          >
            {m === 'number' && '숫자 추첨'}
            {m === 'list' && '리스트 추첨'}
          </button>
        ))}
      </div>

      {/* 숫자 추첨 */}
      {mode === 'number' && (
        <Card variant="bordered" className="p-5">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  최소값
                </label>
                <Input
                  type="number"
                  value={minNum}
                  onChange={(e) => setMinNum(e.target.value)}
                  placeholder="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  최대값
                </label>
                <Input
                  type="number"
                  value={maxNum}
                  onChange={(e) => setMaxNum(e.target.value)}
                  placeholder="45"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                추첨 개수
              </label>
              <Input
                type="number"
                value={pickCount}
                onChange={(e) => setPickCount(e.target.value)}
                min="1"
                max="100"
                placeholder="6"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={allowDuplicates}
                onChange={(e) => setAllowDuplicates(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                중복 허용
              </span>
            </label>

            <Button
              onClick={pickNumbers}
              className="w-full"
              disabled={isAnimating}
            >
              {isAnimating ? '추첨 중...' : '추첨하기'}
            </Button>

            {/* 빠른 설정 */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { setMinNum('1'); setMaxNum('45'); setPickCount('6'); setAllowDuplicates(false); }}
                className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                로또 (1~45, 6개)
              </button>
              <button
                onClick={() => { setMinNum('1'); setMaxNum('100'); setPickCount('1'); setAllowDuplicates(false); }}
                className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                1~100
              </button>
              <button
                onClick={() => { setMinNum('1'); setMaxNum('10'); setPickCount('1'); setAllowDuplicates(false); }}
                className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                1~10
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* 리스트 추첨 */}
      {mode === 'list' && (
        <Card variant="bordered" className="p-5">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                항목 목록 (줄바꿈으로 구분)
              </label>
              <textarea
                value={listInput}
                onChange={(e) => setListInput(e.target.value)}
                placeholder={"홍길동\n김철수\n이영희\n박민수"}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                추첨 개수
              </label>
              <Input
                type="number"
                value={listPickCount}
                onChange={(e) => setListPickCount(e.target.value)}
                min="1"
                placeholder="1"
              />
            </div>

            <Button
              onClick={pickFromList}
              className="w-full"
              disabled={isAnimating || listInput.trim().length === 0}
            >
              {isAnimating ? '추첨 중...' : '추첨하기'}
            </Button>
          </div>
        </Card>
      )}

      {/* 결과 */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              추첨 결과
            </h3>
            <button
              onClick={clearResults}
              className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              기록 삭제
            </button>
          </div>

          {results.map((result, idx) => (
            <Card
              key={idx}
              variant="bordered"
              className={cn(
                'p-4',
                idx === 0 && 'ring-2 ring-blue-500'
              )}
            >
              <div className="flex flex-wrap gap-2 justify-center mb-2">
                {result.values.map((value, i) => (
                  <div
                    key={i}
                    className={cn(
                      'min-w-[48px] h-12 flex items-center justify-center rounded-full font-bold text-lg',
                      typeof value === 'number'
                        ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                        : 'bg-gradient-to-br from-green-500 to-teal-600 text-white px-4'
                    )}
                  >
                    {value}
                  </div>
                ))}
              </div>
              <div className="text-xs text-center text-gray-400">
                {result.timestamp.toLocaleTimeString()}
              </div>
            </Card>
          ))}
        </div>
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
          🎲 랜덤 추첨기란?
        </h2>
        <p className="text-sm leading-relaxed">
          랜덤 추첨기는 지정한 범위에서 무작위 숫자를 뽑거나 목록에서 항목을 추첨하는 도구입니다.
          로또 번호 생성, 제비뽑기, 당첨자 선정, 순서 정하기 등 다양한 상황에 활용할 수 있습니다.
          암호학적으로 안전한 난수 생성기(crypto.getRandomValues)를 사용하여 예측 불가능한 진정한 무작위 결과를 제공합니다.
          최대 10개의 추첨 기록을 저장하여 이전 결과를 확인할 수 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 추첨 모드 비교
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">모드</th>
                <th className="text-left py-2 px-2">입력</th>
                <th className="text-left py-2 px-2">활용 예시</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">숫자 추첨</td><td>최소값~최대값, 개수</td><td>로또 번호, 랜덤 숫자 게임</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">리스트 추첨</td><td>항목 목록 (줄바꿈)</td><td>당첨자 선정, 순서 정하기</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">중복 허용</td><td>숫자 모드 옵션</td><td>주사위 시뮬레이션</td></tr>
              <tr><td className="py-2 px-2 font-medium">중복 불허</td><td>숫자 모드 기본값</td><td>로또, 추첨 당첨자</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 활용 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>로또 번호</strong>: 빠른 설정의 "로또" 버튼으로 1~45 중 6개 즉시 추첨</li>
          <li><strong>팀 순서</strong>: 팀원 이름을 리스트에 입력하고 발표 순서 결정</li>
          <li><strong>경품 추첨</strong>: 참가자 명단 입력 후 당첨자 수만큼 추첨</li>
          <li><strong>과제 배분</strong>: 과제 목록 입력 후 랜덤 배분</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '랜덤 결과가 정말 무작위인가요?',
            answer: 'crypto.getRandomValues() API를 사용하여 암호학적으로 안전한 진정한 난수를 생성합니다. Math.random()보다 예측 불가능하고 공정한 결과를 제공합니다.',
          },
          {
            question: '같은 숫자가 여러 번 나올 수 있나요?',
            answer: '숫자 모드에서 "중복 허용" 옵션을 체크하면 같은 숫자가 여러 번 나올 수 있습니다. 체크하지 않으면 모든 숫자가 고유합니다.',
          },
          {
            question: '추첨 기록은 어디에 저장되나요?',
            answer: '추첨 기록은 브라우저 메모리에만 저장됩니다. 페이지를 새로고침하면 기록이 삭제되며, 서버에 전송되지 않습니다.',
          },
        ]}
      />
    </div>
  );
}
