'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ResultShareButtons } from '@/components/share/ResultShareButtons';
import { FaqSection } from '@/components/ui/FaqItem';

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
  '#BB8FCE', '#85C1E9', '#F8B500', '#00CED1'
];

interface RouletteItem {
  name: string;
  weight: number;
}

export function RouletteSelector() {
  const [items, setItems] = useState<RouletteItem[]>([
    { name: '옵션 1', weight: 1 },
    { name: '옵션 2', weight: 1 },
    { name: '옵션 3', weight: 1 },
  ]);
  const [newItem, setNewItem] = useState('');
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 총 가중치 계산
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);

  const addItem = () => {
    if (!newItem.trim() || items.length >= 12) return;
    setItems([...items, { name: newItem.trim(), weight: 1 }]);
    setNewItem('');
  };

  const removeItem = (index: number) => {
    if (items.length <= 2) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: 'name' | 'weight', value: string | number) => {
    const newItems = [...items];
    if (field === 'name') {
      newItems[index].name = value as string;
    } else {
      newItems[index].weight = Math.max(1, Math.min(1000, Number(value) || 1));
    }
    setItems(newItems);
  };

  // 룰렛 그리기
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = center - 10;

    ctx.clearRect(0, 0, size, size);

    let currentAngle = (rotation * Math.PI) / 180;

    items.forEach((item, i) => {
      // 가중치에 따른 각도 계산
      const sliceAngle = (item.weight / totalWeight) * 2 * Math.PI;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;

      // 파이 조각
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 텍스트 (조각이 너무 작으면 숨김)
      if (sliceAngle > 0.3) {
        ctx.save();
        ctx.translate(center, center);
        ctx.rotate(startAngle + sliceAngle / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#000';
        ctx.font = 'bold 14px sans-serif';
        const text = item.name.length > 8 ? item.name.slice(0, 8) + '...' : item.name;
        ctx.fillText(text, radius - 20, 5);
        ctx.restore();
      }

      currentAngle = endAngle;
    });

    // 중앙 원
    ctx.beginPath();
    ctx.arc(center, center, 20, 0, 2 * Math.PI);
    ctx.fillStyle = '#333';
    ctx.fill();
  }, [items, rotation, totalWeight]);

  // 결과 인덱스와 최종 각도 저장 (공유용)
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);
  const [finalAngle, setFinalAngle] = useState<number | null>(null);

  const spinToAngle = (targetFinalAngle: number, targetWinnerIdx: number, duration = 4000) => {
    setIsSpinning(true);
    setResult(null);

    const startRotation = rotation;
    // 최소 5바퀴 + 목표 각도까지
    const minSpins = 5 * 360;
    const targetMod = ((targetFinalAngle % 360) + 360) % 360;
    const currentMod = ((startRotation % 360) + 360) % 360;
    let diff = targetMod - currentMod;
    if (diff < 0) diff += 360;
    const totalRotation = minSpins + diff;

    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentRotation = startRotation + totalRotation * eased;

      setRotation(currentRotation);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        setWinnerIndex(targetWinnerIdx);
        setFinalAngle(currentRotation);
        setResult(items[targetWinnerIdx]?.name ?? '');
      }
    };

    requestAnimationFrame(animate);
  };

  const spin = () => {
    if (isSpinning || items.length < 2) return;

    setIsSpinning(true);
    setResult(null);

    const spins = 5 + Math.random() * 5; // 5~10바퀴
    const extraDegrees = Math.random() * 360;
    const totalRotation = spins * 360 + extraDegrees;

    // 애니메이션
    const startRotation = rotation;
    const duration = 4000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentRotation = startRotation + totalRotation * eased;

      setRotation(currentRotation);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);

        // 결과 계산 (화살표는 오른쪽 = 0도, 3시 방향)
        const finalRotation = currentRotation % 360;
        // 화살표가 오른쪽에 있으므로 0도 기준, 반시계 방향으로 계산
        const adjustedRotation = (360 - finalRotation) % 360;
        const targetAngle = adjustedRotation / 360; // 0~1 비율로 변환

        // 가중치 기반으로 어떤 항목에 도달했는지 계산
        let accumulatedWeight = 0;
        let selectedIndex = 0;
        for (let i = 0; i < items.length; i++) {
          accumulatedWeight += items[i].weight / totalWeight;
          if (targetAngle < accumulatedWeight) {
            selectedIndex = i;
            break;
          }
        }

        setWinnerIndex(selectedIndex);
        setFinalAngle(currentRotation);
        setResult(items[selectedIndex].name);
      }
    };

    requestAnimationFrame(animate);
  };

  const getShareUrl = () => {
    if (!result || winnerIndex === null || finalAngle === null) return '';
    const data = {
      i: items.map(item => item.name),
      iw: items.map(item => item.weight),
      w: winnerIndex,
      a: finalAngle,
    };
    const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
    return `${window.location.origin}${window.location.pathname}#share=${encoded}`;
  };

  // URL hash에서 공유 데이터 복원
  const sharedDataRef = useRef<{ items: RouletteItem[]; winnerIndex: number; angle: number } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (!hash.startsWith('#share=')) return;

    try {
      const decoded = decodeURIComponent(atob(hash.slice(7)));
      const parsed = JSON.parse(decoded);

      // 새 형식: { i, iw, w, a }
      if (parsed.i && typeof parsed.w === 'number' && typeof parsed.a === 'number') {
        const weights: number[] = parsed.iw || parsed.i.map(() => 1);
        const loadedItems: RouletteItem[] = (parsed.i as string[]).map((name: string, idx: number) => ({
          name,
          weight: weights[idx] ?? 1,
        }));
        setItems(loadedItems);
        sharedDataRef.current = { items: loadedItems, winnerIndex: parsed.w, angle: parsed.a };
        window.history.replaceState(null, '', window.location.pathname);
        return;
      }

      // 이전 버전 호환 (items + result)
      if (parsed.items && parsed.result) {
        const loadedItems = parsed.items.map((item: string | RouletteItem) =>
          typeof item === 'string' ? { name: item, weight: 1 } : item
        );
        setItems(loadedItems);
        setResult(parsed.result);
        window.history.replaceState(null, '', window.location.pathname);
      }
    } catch {
      // ignore
    }
  }, []);

  // 공유 데이터가 세팅된 후 자동 스핀
  const hasAutoSpun = useRef(false);
  useEffect(() => {
    if (hasAutoSpun.current || !sharedDataRef.current) return;
    if (items.length < 2) return;
    // items가 세팅된 후 실행
    const data = sharedDataRef.current;
    if (items[0]?.name !== data.items[0]?.name) return;
    hasAutoSpun.current = true;
    sharedDataRef.current = null;
    // 약간의 딜레이 후 자동 스핀
    const timer = setTimeout(() => {
      spinToAngle(data.angle, data.winnerIndex);
    }, 500);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  return (
    <div className="space-y-2">
      {/* 룰렛 */}
      <div className="relative flex justify-center">
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          className="rounded-full shadow-lg"
        />
        {/* 화살표 */}
        <div className="absolute right-[calc(50%-160px)] top-1/2 -translate-y-1/2">
          <div className="w-0 h-0 border-t-[15px] border-t-transparent border-r-[25px] border-r-red-500 border-b-[15px] border-b-transparent" />
        </div>
      </div>

      {/* 결과 + 버튼 영역 */}
      <Card variant="bordered" className="p-4 md:p-6 text-center">
        <div>
          <div className={`text-3xl font-bold mb-4 min-h-[50px] flex items-center justify-center ${isSpinning ? 'animate-pulse' : ''}`}>
            {result ? (
              <span className="text-blue-600 dark:text-blue-400">🎉 {result}</span>
            ) : (
              <span className="text-gray-400">?</span>
            )}
          </div>
          {result && !isSpinning && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {items.length}개 항목 중 선택됨
              </p>
            </div>
          )}
        </div>
        <Button
          onClick={spin}
          disabled={isSpinning || items.length < 2}
          size="lg"
          className="px-8"
        >
          {isSpinning ? '돌아가는 중...' : '🎰 돌리기!'}
        </Button>
        {result && !isSpinning && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <ResultShareButtons
              url={getShareUrl()}
              title={`룰렛 결과: ${result}`}
              description={`${items.length}개 항목 중 선택 - ToolPiki`}
            />
          </div>
        )}
      </Card>

      {/* 항목 관리 */}
      <Card variant="bordered" className="p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium">항목 ({items.length}/12)</p>
          <p className="text-xs text-gray-500">가중치: 1~1000 (높을수록 당첨 확률 ↑)</p>
        </div>

        <div className="space-y-2 mb-3">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[idx % COLORS.length] }}
              />
              <Input
                value={item.name}
                onChange={(e) => updateItem(idx, 'name', e.target.value)}
                className="flex-1"
              />
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={1}
                  max={1000}
                  value={item.weight}
                  onChange={(e) => updateItem(idx, 'weight', e.target.value)}
                  className="w-16 h-9 text-center text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                />
                <span className="text-xs text-gray-400 w-12">
                  ({Math.round((item.weight / totalWeight) * 100)}%)
                </span>
              </div>
              {items.length > 2 && (
                <button
                  onClick={() => removeItem(idx)}
                  className="text-gray-400 hover:text-red-500 px-2"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="새 항목 추가"
            onKeyDown={(e) => e.key === 'Enter' && addItem()}
            className="flex-1"
          />
          <Button onClick={addItem} disabled={items.length >= 12} size="sm">
            추가
          </Button>
        </div>
      </Card>

      {/* SEO 콘텐츠 */}
      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🎰 룰렛 돌리기란?
        </h2>
        <p className="text-sm leading-relaxed">
          룰렛 돌리기는 여러 선택지 중 하나를 무작위로 선정하는 시각적으로 재미있는 도구입니다.
          최대 12개 항목을 추가하고, 화려한 색상과 부드러운 애니메이션으로 룰렛이 돌아가는 것을 감상하세요.
          각 항목에 가중치(1~1000)를 설정하여 당첨 확률을 세밀하게 조절할 수 있습니다.
          점심 메뉴, 당번 정하기, 경품 추첨, 발표 순서 등 다양한 상황에서 활용하세요.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          가중치 활용 예시
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-3 font-semibold">상황</th>
                <th className="text-left py-2 px-3 font-semibold">설정 예시</th>
                <th className="text-left py-2 px-3 font-semibold">효과</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-400">
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">경품 추첨</td>
                <td className="py-2 px-3">1등(1), 2등(3), 3등(6)</td>
                <td className="py-2 px-3">등수 낮을수록 잘 나옴</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">선호도 반영</td>
                <td className="py-2 px-3">좋아하는 메뉴(5), 싫은 메뉴(1)</td>
                <td className="py-2 px-3">선호 메뉴 자주 당첨</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3">벌칙 완화</td>
                <td className="py-2 px-3">면제(8), 가벼운 벌칙(5), 강한 벌칙(1)</td>
                <td className="py-2 px-3">강한 벌칙 거의 안 나옴</td>
              </tr>
              <tr>
                <td className="py-2 px-3">공정한 추첨</td>
                <td className="py-2 px-3">모든 항목 가중치 1</td>
                <td className="py-2 px-3">동일 확률 (기본값)</td>
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
          <li>가중치가 높을수록 파이 조각이 커지고 당첨 확률이 높아집니다</li>
          <li>가중치 옆 (%)는 실제 당첨 확률을 보여줍니다</li>
          <li>균등 확률을 원하면 모든 항목의 가중치를 1로 설정하세요</li>
          <li>최소 2개, 최대 12개까지 항목을 추가할 수 있습니다</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '가중치는 어떻게 작동하나요?',
            answer: '가중치는 해당 항목의 상대적 당첨 확률을 결정합니다. 예를 들어 A(가중치 2)와 B(가중치 1)가 있으면 A는 약 67%, B는 약 33% 확률로 당첨됩니다.',
          },
          {
            question: '균등한 확률로 하려면?',
            answer: '모든 항목의 가중치를 동일하게(예: 전부 1) 설정하면 N개 항목이 각각 1/N 확률로 동일하게 선택됩니다.',
          },
          {
            question: '가중치 범위가 왜 1~1000인가요?',
            answer: '세밀한 확률 조절을 위해 넓은 범위를 제공합니다. 예를 들어 0.1% 확률을 표현하려면 1:999 비율로 설정할 수 있습니다.',
          },
        ]}
      />
    </div>
  );
}
