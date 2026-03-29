'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';
import { CopyButton } from '@/components/ui/CopyButton';
import { ResultShareButtons } from '@/components/share/ResultShareButtons';
import { FaqSection } from '@/components/ui/FaqItem';

// Fisher-Yates shuffle (random)
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Seeded shuffle for reproducible results
function shuffleWithSeed(arr: string[], seed: number): string[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    seed = (seed * 16807 + 0) % 2147483647;
    const j = Math.floor((seed / 2147483647) * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const STORAGE_KEY = 'toolpiki-order-picker-items';

export function OrderPicker() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<string[] | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const [currentSeed, setCurrentSeed] = useState<number | null>(null);
  const [isFromShare, setIsFromShare] = useState(false);

  // 로컬 스토리지에서 복원
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setInput(saved);
  }, []);

  // 입력 변경 시 로컬 스토리지 저장
  const handleInputChange = (value: string) => {
    setInput(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, value);
    }
  };

  const items = input
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s);

  const pickOrder = useCallback(() => {
    if (items.length < 2) return;

    setIsShuffling(true);
    setResult(null);
    setIsFromShare(false);

    const seed = Math.floor(Math.random() * 2147483646) + 1;

    // 셔플 애니메이션 (12회)
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setResult(shuffle(items));

      if (count >= 12) {
        clearInterval(interval);
        const finalResult = shuffleWithSeed(items, seed);
        setResult(finalResult);
        setCurrentSeed(seed);
        setIsShuffling(false);
      }
    }, 100);
  }, [items]);

  const resultText = result
    ? result.map((item, idx) => `${idx + 1}. ${item}`).join('\n')
    : '';

  const getShareUrl = () => {
    if (!result || !currentSeed) return '';
    const data = { s: currentSeed, n: items };
    const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
    return `${window.location.origin}${window.location.pathname}#share=${encoded}`;
  };

  // URL hash에서 공유 데이터 복원 (seed 기반 재현)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (hash.startsWith('#share=')) {
      try {
        const decoded = decodeURIComponent(atob(hash.slice(7)));
        const parsed = JSON.parse(decoded);
        // 새 형식: seed + names
        if (parsed.s && parsed.n && Array.isArray(parsed.n)) {
          const names = parsed.n as string[];
          const seed = parsed.s as number;
          setInput(names.join(', '));
          setResult(shuffleWithSeed(names, seed));
          setCurrentSeed(seed);
          setIsFromShare(true);
          window.history.replaceState(null, '', window.location.pathname);
        }
        // 구 형식 호환
        else if (parsed.order && Array.isArray(parsed.order)) {
          setInput(parsed.order.join(', '));
          setResult(parsed.order);
          setIsFromShare(true);
          window.history.replaceState(null, '', window.location.pathname);
        }
      } catch {
        // ignore
      }
    }
  }, []);

  return (
    <div className="space-y-2">
      <Textarea
        label="항목 입력 (콤마로 구분)"
        value={input}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder="철수, 영희, 민수, 지현"
        rows={3}
      />

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {items.length}개 항목 {items.length < 2 && items.length > 0 && '(최소 2개 필요)'}
        </span>
        <Button
          onClick={pickOrder}
          disabled={items.length < 2 || isShuffling}
        >
          {isShuffling ? '섞는 중...' : '순번 정하기'}
        </Button>
      </div>

      {result && (
        <Card variant="bordered" className="p-4">
          {isFromShare && (
            <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-700 dark:text-blue-300">
              🔗 공유된 순번 결과입니다 (입력: {items.join(', ')})
            </div>
          )}
          <div>
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm font-medium">결과</p>
              <CopyButton text={resultText} />
            </div>
            <div className="space-y-2">
              {result.map((item, idx) => (
                <div
                  key={`${item}-${idx}`}
                  className={`flex items-center gap-3 p-2 rounded-lg ${
                    idx === 0
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 font-medium'
                      : 'bg-gray-50 dark:bg-gray-800'
                  }`}
                >
                  <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm ${
                    idx === 0
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}>
                    {idx + 1}
                  </span>
                  <span>{item}</span>
                  {idx === 0 && <span className="text-yellow-500 ml-auto">★ 첫 번째</span>}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-wrap items-center gap-2">
            <ResultShareButtons
              url={getShareUrl()}
              title={`순번 정하기 결과: 1위 ${result[0]}`}
              description={`${result.length}명 순번 - ToolPiki`}
            />
          </div>
        </Card>
      )}

      <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
        <p>• Fisher-Yates 알고리즘으로 공정하게 섞습니다</p>
        <p>• 회의 순서, 발표 순서 등에 활용하세요</p>
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
          🔢 순번 정하기란?
        </h2>
        <p className="text-sm leading-relaxed">
          순번 정하기는 여러 항목이나 사람들의 순서를 무작위로 결정하는 도구입니다.
          Fisher-Yates 셔플 알고리즘을 사용하여 모든 순열이 동일한 확률로 나오도록 보장합니다.
          발표 순서, 게임 턴, 회의 발언 순서, 심사 순서 등 순번이 결과에 영향을 줄 수 있는 모든 상황에서 공정하게 사용할 수 있습니다.
          결과는 링크로 공유할 수 있어 원격으로도 활용 가능합니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          활용 예시
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-3 font-semibold">상황</th>
                <th className="text-left py-2 px-3 font-semibold">예시</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-400">
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">발표 순서</td>
                <td className="py-2 px-3">학교/회사 발표, 세미나 진행 순서</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">게임 턴</td>
                <td className="py-2 px-3">보드게임, 카드게임 시작 순서</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">심사/평가</td>
                <td className="py-2 px-3">오디션, 대회, 면접 순서</td>
              </tr>
              <tr>
                <td className="py-2 px-3">회의</td>
                <td className="py-2 px-3">발언 순서, 아이디어 공유 순서</td>
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
          <li>콤마(,)로 항목을 구분하면 편리합니다</li>
          <li>최소 2개 이상의 항목이 필요합니다</li>
          <li>결과가 마음에 안 들면 "다시 섞기"로 새로운 순서를 생성하세요</li>
          <li>공유 기능으로 결과를 팀원들에게 전달할 수 있습니다</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '순서가 정말 공정하게 정해지나요?',
            answer: 'Fisher-Yates 알고리즘은 모든 가능한 순열이 동일한 확률로 나오도록 수학적으로 보장된 셔플 방식입니다. 첫 번째든 마지막이든 동일한 확률로 배치됩니다.',
          },
          {
            question: '몇 개까지 순번을 정할 수 있나요?',
            answer: '개수 제한 없이 원하는 만큼 항목을 추가할 수 있습니다. 다만 화면 표시의 편의를 위해 적절한 수로 사용하는 것을 권장합니다.',
          },
          {
            question: '결과를 저장할 수 있나요?',
            answer: '공유 버튼을 통해 결과가 포함된 URL을 생성할 수 있습니다. 이 링크를 저장하거나 공유하면 같은 결과를 다시 볼 수 있습니다.',
          },
        ]}
      />
    </div>
  );
}
