'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FaqSection } from '@/components/ui/FaqItem';

interface Item {
  id: string;
  text: string;
  weight: number;
  isPro: boolean;
}

interface Option {
  name: string;
  items: Item[];
}

export function ProsConsComparator() {
  const [optionA, setOptionA] = useState<Option>({ name: '선택지 A', items: [] });
  const [optionB, setOptionB] = useState<Option>({ name: '선택지 B', items: [] });
  const [newItemA, setNewItemA] = useState({ text: '', isPro: true });
  const [newItemB, setNewItemB] = useState({ text: '', isPro: true });

  const generateId = () => Math.random().toString(36).slice(2, 9);

  const addItem = (option: 'A' | 'B') => {
    const newItem = option === 'A' ? newItemA : newItemB;
    if (!newItem.text.trim()) return;

    const item: Item = {
      id: generateId(),
      text: newItem.text.trim(),
      weight: 1,
      isPro: newItem.isPro,
    };

    if (option === 'A') {
      setOptionA((prev) => ({ ...prev, items: [...prev.items, item] }));
      setNewItemA({ text: '', isPro: true });
    } else {
      setOptionB((prev) => ({ ...prev, items: [...prev.items, item] }));
      setNewItemB({ text: '', isPro: true });
    }
  };

  const removeItem = (option: 'A' | 'B', id: string) => {
    if (option === 'A') {
      setOptionA((prev) => ({ ...prev, items: prev.items.filter((i) => i.id !== id) }));
    } else {
      setOptionB((prev) => ({ ...prev, items: prev.items.filter((i) => i.id !== id) }));
    }
  };

  const updateWeight = (option: 'A' | 'B', id: string, weight: number) => {
    const updateFn = (items: Item[]) =>
      items.map((i) => (i.id === id ? { ...i, weight: Math.max(1, Math.min(3, weight)) } : i));

    if (option === 'A') {
      setOptionA((prev) => ({ ...prev, items: updateFn(prev.items) }));
    } else {
      setOptionB((prev) => ({ ...prev, items: updateFn(prev.items) }));
    }
  };

  const calcScore = (items: Item[]) => {
    const pros = items.filter((i) => i.isPro).reduce((sum, i) => sum + i.weight, 0);
    const cons = items.filter((i) => !i.isPro).reduce((sum, i) => sum + i.weight, 0);
    return pros - cons;
  };

  const result = useMemo(() => {
    const scoreA = calcScore(optionA.items);
    const scoreB = calcScore(optionB.items);

    if (optionA.items.length === 0 && optionB.items.length === 0) return null;

    let winner: 'A' | 'B' | 'tie';
    let message: string;

    if (scoreA > scoreB) {
      winner = 'A';
      message = `${optionA.name}이(가) ${scoreA - scoreB}점 높습니다`;
    } else if (scoreB > scoreA) {
      winner = 'B';
      message = `${optionB.name}이(가) ${scoreB - scoreA}점 높습니다`;
    } else {
      winner = 'tie';
      message = '두 선택지가 동점입니다';
    }

    return { scoreA, scoreB, winner, message };
  }, [optionA, optionB]);

  const handleReset = () => {
    setOptionA({ name: '선택지 A', items: [] });
    setOptionB({ name: '선택지 B', items: [] });
    setNewItemA({ text: '', isPro: true });
    setNewItemB({ text: '', isPro: true });
  };

  const renderOption = (option: Option, key: 'A' | 'B', newItem: typeof newItemA, setNewItem: typeof setNewItemA) => {
    const pros = option.items.filter((i) => i.isPro);
    const cons = option.items.filter((i) => !i.isPro);

    return (
      <Card variant="bordered" className="p-4">
        <Input
          value={option.name}
          onChange={(e) =>
            key === 'A'
              ? setOptionA((prev) => ({ ...prev, name: e.target.value }))
              : setOptionB((prev) => ({ ...prev, name: e.target.value }))
          }
          className="font-medium text-center mb-4"
          placeholder="선택지 이름"
        />

        {/* 장점 */}
        <div className="mb-4">
          <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">
            👍 장점 ({pros.length})
          </p>
          <div className="space-y-2">
            {pros.map((item) => (
              <div key={item.id} className="flex items-center gap-2 text-sm">
                <span className="flex-1 truncate">{item.text}</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3].map((w) => (
                    <button
                      key={w}
                      onClick={() => updateWeight(key, item.id, w)}
                      className={`w-6 h-6 rounded text-xs ${
                        item.weight >= w
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => removeItem(key, item.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 단점 */}
        <div className="mb-4">
          <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">
            👎 단점 ({cons.length})
          </p>
          <div className="space-y-2">
            {cons.map((item) => (
              <div key={item.id} className="flex items-center gap-2 text-sm">
                <span className="flex-1 truncate">{item.text}</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3].map((w) => (
                    <button
                      key={w}
                      onClick={() => updateWeight(key, item.id, w)}
                      className={`w-6 h-6 rounded text-xs ${
                        item.weight >= w
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => removeItem(key, item.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 추가 입력 */}
        <div className="flex gap-2">
          <div className="flex gap-1">
            <button
              onClick={() => setNewItem((prev) => ({ ...prev, isPro: true }))}
              className={`px-2 py-1 text-xs rounded ${
                newItem.isPro
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              장점
            </button>
            <button
              onClick={() => setNewItem((prev) => ({ ...prev, isPro: false }))}
              className={`px-2 py-1 text-xs rounded ${
                !newItem.isPro
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              단점
            </button>
          </div>
          <input
            type="text"
            value={newItem.text}
            onChange={(e) => setNewItem((prev) => ({ ...prev, text: e.target.value }))}
            onKeyDown={(e) => e.key === 'Enter' && addItem(key)}
            placeholder="항목 입력 후 Enter"
            className="flex-1 px-3 py-1 text-sm border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-2">
      {/* 두 선택지 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderOption(optionA, 'A', newItemA, setNewItemA)}
        {renderOption(optionB, 'B', newItemB, setNewItemB)}
      </div>

      {/* 결과 */}
      {result && (
        <Card variant="bordered" className="p-6">
          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{optionA.name}</p>
              <p className={`text-3xl font-bold ${
                result.winner === 'A' ? 'text-green-600 dark:text-green-400' : ''
              }`}>
                {result.scoreA}점
              </p>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-2xl text-gray-400">VS</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{optionB.name}</p>
              <p className={`text-3xl font-bold ${
                result.winner === 'B' ? 'text-green-600 dark:text-green-400' : ''
              }`}>
                {result.scoreB}점
              </p>
            </div>
          </div>
          <p className="text-center text-gray-600 dark:text-gray-400">
            {result.message}
          </p>
        </Card>
      )}

      {/* 버튼 */}
      <div className="flex justify-end">
        <Button variant="secondary" size="sm" onClick={handleReset}>
          초기화
        </Button>
      </div>

      {/* 안내 */}
      <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
        <p>• 가중치 1~3: 중요도에 따라 점수 부여</p>
        <p>• 점수 = 장점 합계 - 단점 합계</p>
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
          ⚖️ 장단점 비교 도구란?
        </h2>
        <p className="text-sm leading-relaxed">
          장단점 비교 도구는 두 가지 선택지의 장점과 단점을 체계적으로 비교하는 의사결정 도구입니다.
          각 항목에 1~3점의 가중치를 부여해 중요도를 반영하고, 점수 합계로 객관적인 결과를 도출합니다.
          이직, 이사, 구매, 투자 등 어려운 선택 상황에서 감정보다 논리적으로 판단하는 데 도움이 됩니다.
          모든 데이터는 브라우저에서만 처리되며 서버에 저장되지 않습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 의사결정 활용 예시
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">상황</th>
                <th className="text-left py-2 px-2">선택지 예시</th>
                <th className="text-left py-2 px-2">비교 포인트</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">이직 결정</td><td>현 직장 vs 이직</td><td>연봉, 워라밸, 성장성</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">주거 선택</td><td>전세 vs 월세</td><td>초기 비용, 유동성, 안정성</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">구매 결정</td><td>A 제품 vs B 제품</td><td>가격, 기능, 브랜드</td></tr>
              <tr><td className="py-2 px-2 font-medium">투자 선택</td><td>주식 vs 부동산</td><td>수익률, 리스크, 유동성</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 효과적인 비교 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>구체적으로 작성</strong>: "좋음" 대신 "출퇴근 30분 단축" 처럼 수치로</li>
          <li><strong>가중치 활용</strong>: 핵심 기준은 3점, 부수적인 건 1점으로 차등</li>
          <li><strong>숨은 항목 추가</strong>: 기회비용, 장기적 영향 등 놓치기 쉬운 요소도 포함</li>
          <li><strong>제3자 관점</strong>: 감정에 치우치지 않도록 객관적으로 평가</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '점수가 같으면 어떻게 하나요?',
            answer: '동점인 경우 가장 중요한 항목 1~2개를 다시 검토해보세요. 결정적인 차이를 만드는 핵심 요소에 가중치를 높이거나, 리스크가 적은 선택을 우선하는 것도 방법입니다.',
          },
          {
            question: '가중치는 어떻게 정하나요?',
            answer: '후회할 가능성이 높은 항목일수록 높은 가중치를 부여하세요. 예: 건강 관련 요소, 장기적 영향, 복구 불가능한 결정은 3점 권장입니다.',
          },
          {
            question: '작성한 비교 내용을 저장할 수 있나요?',
            answer: '현재는 브라우저 세션에서만 유지됩니다. 중요한 결정은 스크린샷이나 메모로 따로 저장해두세요. 개인정보 보호를 위해 서버에 저장하지 않습니다.',
          },
        ]}
      />
    </div>
  );
}
