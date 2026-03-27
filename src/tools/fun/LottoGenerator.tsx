'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { ResultShareButtons } from '@/components/share/ResultShareButtons';
import { cn } from '@/lib/utils/cn';
import { FaqSection } from '@/components/ui/FaqItem';

interface LottoSet {
  id: number;
  numbers: number[];
  bonus?: number;
}

const MAX_SETS = 10;
const MAX_HISTORY = 10;

function getSecureRandomNumbers(count: number, max: number, exclude: number[] = []): number[] {
  const available = Array.from({ length: max }, (_, i) => i + 1).filter(n => !exclude.includes(n));
  const result: number[] = [];

  for (let i = 0; i < count && available.length > 0; i++) {
    let randomIndex: number;
    if (typeof window !== 'undefined' && window.crypto) {
      const array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      randomIndex = array[0] % available.length;
    } else {
      randomIndex = Math.floor(Math.random() * available.length);
    }
    result.push(available[randomIndex]);
    available.splice(randomIndex, 1);
  }

  return result;
}

function getBallColor(num: number): string {
  if (num <= 10) return 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 ring-amber-200 dark:ring-amber-800';
  if (num <= 20) return 'bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 ring-sky-200 dark:ring-sky-800';
  if (num <= 30) return 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 ring-rose-200 dark:ring-rose-800';
  if (num <= 40) return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 ring-slate-200 dark:ring-slate-700';
  return 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 ring-emerald-200 dark:ring-emerald-800';
}

function LottoBall({ number, isBonus = false }: { number: number; isBonus?: boolean }) {
  return (
    <div
      className={cn(
        'w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center',
        'font-bold text-sm sm:text-base ring-1 transition-transform hover:scale-105',
        getBallColor(number),
        isBonus && 'ring-2'
      )}
    >
      {number}
    </div>
  );
}

interface ShareData {
  numbers: number[][];
  bonus?: number[];
}

export function LottoGenerator() {
  const [setCount, setSetCount] = useState(1);
  const [includeBonus, setIncludeBonus] = useState(false);
  const [sortNumbers, setSortNumbers] = useState(true);
  const [results, setResults] = useState<LottoSet[]>([]);
  const [history, setHistory] = useState<LottoSet[][]>([]);

  // URL hash에서 공유 데이터 복원
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (hash.startsWith('#share=')) {
      try {
        const encoded = hash.slice(7);
        const decoded = decodeURIComponent(atob(encoded));
        const parsed = JSON.parse(decoded) as ShareData;
        if (parsed.numbers?.length) {
          const restored: LottoSet[] = parsed.numbers.map((nums, i) => ({
            id: Date.now() + i,
            numbers: nums,
            bonus: parsed.bonus?.[i],
          }));
          setResults(restored);
          if (parsed.bonus?.length) setIncludeBonus(true);
        }
      } catch {
        // 파싱 실패 시 무시
      }
    }
  }, []);

  // 공유 URL 생성
  const getShareUrl = () => {
    if (typeof window === 'undefined' || !results.length) return '';
    try {
      const data: ShareData = {
        numbers: results.map(r => r.numbers),
        bonus: results.some(r => r.bonus) ? results.map(r => r.bonus || 0) : undefined,
      };
      const json = JSON.stringify(data);
      const encoded = btoa(encodeURIComponent(json));
      const baseUrl = window.location.href.split('#')[0];
      return `${baseUrl}#share=${encoded}`;
    } catch {
      return '';
    }
  };

  const generateLotto = useCallback(() => {
    const newResults: LottoSet[] = [];

    for (let i = 0; i < setCount; i++) {
      let numbers = getSecureRandomNumbers(6, 45);
      if (sortNumbers) {
        numbers = numbers.sort((a, b) => a - b);
      }

      const set: LottoSet = {
        id: Date.now() + i,
        numbers,
      };

      if (includeBonus) {
        set.bonus = getSecureRandomNumbers(1, 45, numbers)[0];
      }

      newResults.push(set);
    }

    setResults(newResults);
    setHistory(prev => [newResults, ...prev].slice(0, MAX_HISTORY));
  }, [setCount, includeBonus, sortNumbers]);

  const formatForCopy = (sets: LottoSet[], multiline: boolean): string => {
    return sets.map(set => {
      const nums = set.numbers.join(', ');
      const bonus = set.bonus ? ` + ${set.bonus}` : '';
      return nums + bonus;
    }).join(multiline ? '\n' : ' | ');
  };

  return (
    <div className="space-y-2">
      <Card variant="bordered" className="p-6">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-5">
          생성 옵션
        </h3>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              생성 세트 수
            </label>
            <div className="flex gap-2 flex-wrap">
              {[1, 3, 5, 10].map(count => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setSetCount(count)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors min-h-[44px]',
                    setCount === count
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  )}
                >
                  {count}세트
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeBonus}
                onChange={(e) => setIncludeBonus(e.target.checked)}
                className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">보너스 번호 포함</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={sortNumbers}
                onChange={(e) => setSortNumbers(e.target.checked)}
                className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">오름차순 정렬</span>
            </label>
          </div>
        </div>

        <Button
          onClick={generateLotto}
          size="lg"
          className="w-full mt-6"
        >
          번호 생성
        </Button>
      </Card>

      {results.length > 0 && (
        <Card variant="bordered" className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              생성 결과
            </h3>
            <div className="flex flex-wrap gap-2">
              <CopyButton text={formatForCopy(results, false)} label="한 줄" size="sm" />
              <CopyButton text={formatForCopy(results, true)} label="여러 줄" size="sm" />
            </div>
          </div>

          <ResultShareButtons
            url={getShareUrl()}
            title={`로또 번호 ${results.length}세트`}
            description={results.map(r => r.numbers.join(', ')).join(' | ')}
            visible={results.length > 0}
            className="mb-4"
          />

          <div className="space-y-2">
            {results.map((set, index) => (
              <div
                key={set.id}
                className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex items-center gap-3"
              >
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded shrink-0">
                  {index + 1}
                </span>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  {set.numbers.map((num, i) => (
                    <LottoBall key={i} number={num} />
                  ))}
                  {set.bonus && (
                    <>
                      <span className="text-slate-400 dark:text-slate-500 font-medium mx-0.5 sm:mx-1">+</span>
                      <LottoBall number={set.bonus} isBonus />
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {history.length > 1 && (
        <Card variant="bordered" className="p-6">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-5">
            이전 생성 기록
          </h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {history.slice(1).map((sets, hIndex) => (
              <div
                key={hIndex}
                className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {sets.length}세트
                  </span>
                  <CopyButton text={formatForCopy(sets, true)} size="sm" />
                </div>
                <div className="space-y-1 font-mono text-slate-600 dark:text-slate-400">
                  {sets.map((set, sIndex) => (
                    <div key={set.id}>
                      {set.numbers.join(', ')}{set.bonus ? ` + ${set.bonus}` : ''}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-5 gap-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
        <div className="text-center">
          <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/40 mx-auto mb-1" />
          <span className="text-xs text-slate-500 dark:text-slate-400">1-10</span>
        </div>
        <div className="text-center">
          <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-900/40 mx-auto mb-1" />
          <span className="text-xs text-slate-500 dark:text-slate-400">11-20</span>
        </div>
        <div className="text-center">
          <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/40 mx-auto mb-1" />
          <span className="text-xs text-slate-500 dark:text-slate-400">21-30</span>
        </div>
        <div className="text-center">
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 mx-auto mb-1" />
          <span className="text-xs text-slate-500 dark:text-slate-400">31-40</span>
        </div>
        <div className="text-center">
          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 mx-auto mb-1" />
          <span className="text-xs text-slate-500 dark:text-slate-400">41-45</span>
        </div>
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
          🎱 로또 번호 생성기란?
        </h2>
        <p className="text-sm leading-relaxed">
          한국 로또 6/45 형식에 맞춰 1~45 중 6개 번호를 암호학적으로 안전한 난수(crypto.getRandomValues)로 생성하는 도구입니다.
          보너스 번호 포함 옵션과 최대 10세트 동시 생성을 지원합니다.
          번호 선택이 고민될 때 빠르게 추천받아 보세요.
          단, 모든 번호 조합의 당첨 확률은 동일합니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 로또 당첨 확률
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 pr-4 font-semibold text-gray-900 dark:text-white">등수</th>
                <th className="text-left py-2 pr-4 font-semibold text-gray-900 dark:text-white">맞춘 개수</th>
                <th className="text-left py-2 font-semibold text-gray-900 dark:text-white">확률</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-400">
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4 font-medium">1등</td>
                <td className="py-2 pr-4">6개 전부</td>
                <td className="py-2">1/8,145,060</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4 font-medium">2등</td>
                <td className="py-2 pr-4">5개 + 보너스</td>
                <td className="py-2">1/1,357,510</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4 font-medium">3등</td>
                <td className="py-2 pr-4">5개</td>
                <td className="py-2">1/35,724</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4 font-medium">4등</td>
                <td className="py-2 pr-4">4개</td>
                <td className="py-2">1/733</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium">5등</td>
                <td className="py-2 pr-4">3개</td>
                <td className="py-2">1/45</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 사용 팁
        </h2>
        <ul className="text-sm space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
          <li><strong>오름차순 정렬:</strong> 실제 로또 결과처럼 정렬하면 비교가 쉬움</li>
          <li><strong>보너스 번호:</strong> 2등 확인용으로 함께 생성 가능</li>
          <li><strong>여러 세트:</strong> 한 번에 최대 10세트까지 생성</li>
          <li><strong>이전 기록:</strong> 최근 생성 기록 10회분 자동 저장</li>
          <li><strong>복사/공유:</strong> 생성된 번호를 쉽게 공유</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          { question: '특정 번호가 더 잘 나오나요?', answer: '아니요. 암호학적 난수 생성기를 사용해 모든 번호가 동일한 확률로 나옵니다. 어떤 번호 조합도 당첨 확률은 같습니다.' },
          { question: '생성한 번호를 저장할 수 있나요?', answer: '이전 생성 기록이 최대 10회분 자동 저장됩니다. 복사 버튼으로 클립보드에 복사하거나 공유 기능을 이용하세요.' },
          { question: '당첨 확률을 높일 수 있나요?', answer: '수학적으로 어떤 방법도 당첨 확률을 높일 수 없습니다. 이 도구는 재미를 위한 것이며, 책임감 있는 복권 구매를 권장합니다.' },
        ]}
      />
    </div>
  );
}
