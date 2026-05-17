'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';
import { ResultShareButtons } from '@/components/share/ResultShareButtons';
import { FaqSection } from '@/components/ui/FaqItem';
import { encodeShareData, decodeShareData } from '@/lib/utils/share-encoding';

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
    const encoded = encodeShareData(data);
    return `${window.location.origin}${window.location.pathname}#share=${encoded}`;
  };

  // URL hash에서 공유 데이터 복원
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (hash.startsWith('#share=')) {
      try {
        const parsed = decodeShareData(hash.slice(7));
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
              description="ToolPiki 랜덤 결정 도구"
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
          <strong className="text-gray-900 dark:text-white">랜덤 결정 도구는 선택하기 어려울 때 운에 맡겨 무작위로 결과를 정해주는 유틸리티입니다.</strong>{' '}
          <strong>Yes/No 결정</strong>, <strong>동전 던지기</strong>, <strong>숫자 범위 뽑기</strong>, <strong>직접 입력 선택지</strong> 등 4가지 모드를 지원합니다.
          Yes 확률 조절 기능으로 원하는 비율로 결과를 조정할 수도 있습니다.
          결정 장애가 있을 때, 빠르게 결론을 내야 할 때 활용하세요.
        </p>

        <div className="mt-4 rounded-lg bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900 p-4 text-sm">
          <p className="font-semibold text-violet-900 dark:text-violet-200 mb-1">🧠 결정 피로 줄이기</p>
          <p className="text-violet-800 dark:text-violet-300">
            성인은 하루 평균 <strong>약 35,000번</strong>의 결정을 내립니다. 사소한 건 무작위 장치에 맡기면 <strong>인지 부담</strong>이 줄어듭니다.
          </p>
        </div>
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
          🧠 결정 장애가 생기는 이유
        </h2>
        <p className="text-sm leading-relaxed mb-3">
          심리학에서는 이를 '결정 피로(decision fatigue)' 또는 '분석 마비(analysis paralysis)'라고 부릅니다.
          하루 평균 성인은 약 35,000번의 결정을 내린다는 컬럼비아대 연구가 있으며, 그 중 점심 메뉴 같은 사소한 선택에 매일 평균 132초를 쓰는 것으로 알려져 있습니다.
          선택지가 많을수록 후회 가능성이 높아져 오히려 결정이 느려지는데(잼 실험에서 24종 진열대는 6종 진열대보다 구매율이 10분의 1 수준이었음), 동전 던지기 같은 무작위 장치는 이 '선택의 압박'을 외부로 옮겨 인지 부담을 줄여줍니다.
        </p>
        <ul className="text-sm space-y-1 list-disc list-inside text-gray-600 dark:text-gray-400">
          <li><strong>점심 메뉴</strong>: 4~5개로 추리고 랜덤 돌리면 평균 80% 시간 절약</li>
          <li><strong>구독 해지 여부</strong>: Yes 30%로 설정해서 살짝 미루는 쪽으로 기울이기</li>
          <li><strong>다음 휴가지</strong>: 후보 도시 5곳을 직접 입력 모드로 추첨</li>
          <li><strong>운동 갈까 말까</strong>: Yes 60% 설정해서 '자신을 살짝 속이기'</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 무작위 결과를 더 잘 활용하는 법
        </h2>
        <ul className="text-sm space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
          <li><strong>두 번 돌리지 않기</strong>: 첫 결과가 마음에 안 들면 그게 진짜 원하는 답입니다. 마음의 신호로 활용하세요.</li>
          <li><strong>확률 미세 조정</strong>: Yes 50%가 아닌 55~70%로 살짝 기울이면 직관과 비슷한 결과가 자주 나옵니다.</li>
          <li><strong>줄바꿈으로 옵션 구분</strong>: 직접 입력 모드는 한 줄에 하나씩 선택지를 적습니다. 옵션은 3~7개가 가장 효과적입니다.</li>
          <li><strong>통계 확인</strong>: 동전 30회 이상 던지면 실제 분포가 50:50에 수렴하는 것을 확인할 수 있습니다(큰수의 법칙).</li>
          <li><strong>책임 회피용 아님</strong>: 도덕적·재무적 결정에는 사용하지 말고, 일상의 가벼운 선택에만 활용하세요.</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '결과가 정말 무작위인가요?',
            answer: 'JavaScript의 Math.random() 함수로 의사 난수(pseudo-random)를 생성합니다. 일상적인 추첨에는 충분히 무작위이지만, 보안용 난수(암호 키, 보안 토큰)로는 적합하지 않습니다. 보안이 필요한 영역은 crypto.getRandomValues() 같은 별도 API를 써야 합니다.',
          },
          {
            question: 'Yes 확률을 70% 같은 비대칭 값으로 설정해도 되나요?',
            answer: '네, 의도적으로 한쪽으로 결과를 기울이고 싶을 때 유용합니다. 예를 들어 다이어트 중인데 디저트를 먹을지 말지 결정한다면 No 70%로 설정해 의지를 약간 보조할 수 있습니다. 단, 결과는 여전히 확률적이라 30% 쪽이 나올 수도 있습니다.',
          },
          {
            question: '직접 입력 모드에서 선택지를 가중치별로 다르게 줄 수 있나요?',
            answer: '현재는 균등 확률만 지원합니다. 가중치 기반 추첨이 필요하면 룰렛 선택기 도구를 사용하면 1~1000 범위로 비중을 조절할 수 있습니다.',
          },
          {
            question: '히스토리가 페이지 새로고침 후에도 남나요?',
            answer: '아니요. 최근 10개의 결과는 메모리에만 저장되며 새로고침하면 초기화됩니다. 특정 결과를 보존하고 싶다면 결과 공유 버튼으로 링크를 만들어 두세요.',
          },
        ]}
      />
    </div>
  );
}
