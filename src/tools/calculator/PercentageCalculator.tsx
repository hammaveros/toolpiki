'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FaqSection } from '@/components/ui/FaqItem';

type CalcMode = 'percent-of' | 'what-percent' | 'increase' | 'decrease';

export function PercentageCalculator() {
  const [mode, setMode] = useState<CalcMode>('percent-of');
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');

  const result = useMemo(() => {
    const v1 = parseFloat(value1);
    const v2 = parseFloat(value2);

    if (isNaN(v1) || isNaN(v2)) return null;

    switch (mode) {
      case 'percent-of':
        // v1%의 v2는?
        return {
          value: (v1 / 100) * v2,
          formula: `${v1}% × ${v2} = ${((v1 / 100) * v2).toFixed(2)}`,
        };
      case 'what-percent':
        // v1은 v2의 몇 %?
        return {
          value: (v1 / v2) * 100,
          formula: `${v1} ÷ ${v2} × 100 = ${((v1 / v2) * 100).toFixed(2)}%`,
        };
      case 'increase':
        // v1에서 v2% 증가하면?
        return {
          value: v1 * (1 + v2 / 100),
          formula: `${v1} × (1 + ${v2}%) = ${(v1 * (1 + v2 / 100)).toFixed(2)}`,
        };
      case 'decrease':
        // v1에서 v2% 감소하면?
        return {
          value: v1 * (1 - v2 / 100),
          formula: `${v1} × (1 - ${v2}%) = ${(v1 * (1 - v2 / 100)).toFixed(2)}`,
        };
      default:
        return null;
    }
  }, [mode, value1, value2]);

  const modeOptions: { value: CalcMode; label: string; desc: string }[] = [
    { value: 'percent-of', label: 'A%의 B는?', desc: 'A% × B' },
    { value: 'what-percent', label: 'A는 B의 몇 %?', desc: 'A ÷ B × 100' },
    { value: 'increase', label: 'A에서 B% 증가', desc: 'A × (1 + B%)' },
    { value: 'decrease', label: 'A에서 B% 감소', desc: 'A × (1 - B%)' },
  ];

  const getLabels = () => {
    switch (mode) {
      case 'percent-of':
        return { label1: '퍼센트 (%)', label2: '기준값' };
      case 'what-percent':
        return { label1: '부분값', label2: '전체값' };
      case 'increase':
        return { label1: '원래 값', label2: '증가율 (%)' };
      case 'decrease':
        return { label1: '원래 값', label2: '감소율 (%)' };
    }
  };

  const labels = getLabels();

  return (
    <div className="space-y-2">
      {/* 모드 선택 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {modeOptions.map((option) => (
          <Button
            key={option.value}
            variant={mode === option.value ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setMode(option.value)}
            className="flex flex-col h-auto py-2"
          >
            <span>{option.label}</span>
            <span className="text-xs opacity-70">{option.desc}</span>
          </Button>
        ))}
      </div>

      {/* 입력 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={labels.label1}
          type="number"
          value={value1}
          onChange={(e) => setValue1(e.target.value)}
          placeholder="숫자 입력"
        />
        <Input
          label={labels.label2}
          type="number"
          value={value2}
          onChange={(e) => setValue2(e.target.value)}
          placeholder="숫자 입력"
        />
      </div>

      {/* 결과 */}
      {result && (
        <Card variant="bordered" className="p-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">결과</p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {result.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            {mode === 'what-percent' && '%'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-mono">
            {result.formula}
          </p>
        </Card>
      )}

      {/* 빠른 계산 예시 */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        <p className="font-medium mb-2">사용 예시:</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>50000원의 20% 할인 → 모드: "A%의 B는?"</li>
          <li>30000원이 100000원의 몇 %인지 → 모드: "A는 B의 몇 %?"</li>
          <li>연봉 5000만원에서 10% 인상 → 모드: "A에서 B% 증가"</li>
        </ul>
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
          🔢 퍼센트 계산기란?
        </h2>
        <p className="text-sm leading-relaxed">
          퍼센트 계산기는 다양한 백분율 계산을 4가지 모드로 쉽게 해결하는 도구입니다.
          할인가 계산, 비율 구하기, 증감률 적용 등 일상과 업무에서 자주 필요한 퍼센트 연산을 지원합니다.
          계산 공식도 함께 표시되어 어떻게 계산되는지 원리를 이해할 수 있습니다.
          쇼핑 할인 계산, 세금 계산, 성장률/감소율 분석, 성적 환산 등에 활용하세요.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 퍼센트 계산 유형
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">모드</th>
                <th className="text-left py-2 px-2">공식</th>
                <th className="text-left py-2 px-2">활용 예시</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">A%의 B는?</td><td className="font-mono">A/100 × B</td><td>50000원의 20% 할인액</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">A는 B의 몇%?</td><td className="font-mono">A/B × 100</td><td>30점이 100점의 몇 %?</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">A에서 B% 증가</td><td className="font-mono">A × (1 + B/100)</td><td>연봉 5000에서 10% 인상</td></tr>
              <tr><td className="py-2 px-2 font-medium">A에서 B% 감소</td><td className="font-mono">A × (1 - B/100)</td><td>주가 10000에서 15% 하락</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 퍼센트 계산 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>할인 후 가격</strong>: 원가 - (원가 × 할인율) 또는 원가 × (1 - 할인율)</li>
          <li><strong>부가세 포함</strong>: 공급가 × 1.1 = 부가세 포함 가격 (한국 10%)</li>
          <li><strong>연속 변화</strong>: 10% 증가 후 10% 감소 ≠ 원래 값 (실제: 99%)</li>
          <li><strong>비율 역산</strong>: 30%가 150원이면 전체는 150 ÷ 0.3 = 500원</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📐 자주 쓰는 백분율 공식 정리
        </h2>
        <p className="text-sm leading-relaxed mb-3">
          업무에서 자주 쓰는 퍼센트 공식들을 한눈에 정리했습니다. 헷갈릴 때 참고하세요.
        </p>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">개념</th>
                <th className="text-left py-2 px-2">공식</th>
                <th className="text-left py-2 px-2">예시</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">증감률</td><td className="font-mono">(나중값 - 처음값) ÷ 처음값 × 100</td><td>1만→1.2만 = +20%</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">할인율</td><td className="font-mono">(정상가 - 할인가) ÷ 정상가 × 100</td><td>5만→4만 = 20% 할인</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">원가 마진율</td><td className="font-mono">(판매가 - 원가) ÷ 원가 × 100</td><td>원가 1만, 판매 1.5만 = 50%</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">매출 마진율</td><td className="font-mono">(판매가 - 원가) ÷ 판매가 × 100</td><td>원가 1만, 판매 1.5만 ≈ 33.3%</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">달성률</td><td className="font-mono">실적 ÷ 목표 × 100</td><td>목표 100, 실적 85 = 85%</td></tr>
              <tr><td className="py-2 px-2 font-medium">성장률(CAGR 단일기)</td><td className="font-mono">(끝 ÷ 시작) - 1</td><td>100→121 (1년) = 21%</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🛒 실무 활용 사례
        </h2>
        <p className="text-sm leading-relaxed mb-3">
          퍼센트 계산은 분야를 가리지 않고 등장합니다. 자주 쓰이는 상황을 정리했습니다.
        </p>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>쇼핑/리테일</strong>: 할인가 계산, 쿠폰 중복 적용 후 최종가, 적립 포인트 환산</li>
          <li><strong>회계/세무</strong>: 부가세 포함/미포함 변환, 원천징수 3.3% 차감 후 실수령액</li>
          <li><strong>마케팅</strong>: 전환율(CVR), 클릭률(CTR), 이탈률(Bounce Rate) 계산</li>
          <li><strong>인사/급여</strong>: 연봉 인상률, 성과급 비율, 4대보험 공제 후 실수령액</li>
          <li><strong>학업/시험</strong>: 점수 환산, 출석률, 정답률, 등수 백분위(상위 몇 %)</li>
          <li><strong>건강</strong>: 체지방률 변화, 목표 체중까지의 감량 비율</li>
          <li><strong>투자</strong>: 수익률, 손실률, 매수가 대비 현재가 등락률</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '20% 할인된 가격을 원래 가격으로 되돌리려면?',
            answer: '할인 후 가격을 (1 - 할인율)로 나눕니다. 예: 8000원이 20% 할인가라면 8000 ÷ 0.8 = 10000원이 원래 가격입니다.',
          },
          {
            question: '두 번 연속 50% 할인하면 무료인가요?',
            answer: '아닙니다. 첫 50% 할인 후 남은 50%에서 다시 50% 할인하므로 최종 가격은 원가의 25%입니다 (75% 할인).',
          },
          {
            question: '증가율과 감소율 중 어느 것이 더 큰 영향을 미치나요?',
            answer: '같은 퍼센트라면 감소의 영향이 더 큽니다. 100에서 20% 증가 후 20% 감소하면 96이 되어 4%가 손실됩니다.',
          },
          {
            question: '원가 마진율과 매출 마진율은 어떻게 다른가요?',
            answer: '같은 이익이라도 분모가 다릅니다. 원가 1만, 판매 1.5만일 때 원가 마진율은 5천 ÷ 1만 = 50%, 매출 마진율은 5천 ÷ 1.5만 ≈ 33.3%입니다. 보통 유통/소매에서는 매출 마진율을 더 자주 씁니다.',
          },
          {
            question: '퍼센트(%)와 퍼센트포인트(%p)는 어떻게 다른가요?',
            answer: '퍼센트는 비율의 변화이고 퍼센트포인트는 절댓값의 차이입니다. 금리가 3%에서 5%로 오른 경우, "2%p 인상" 또는 "약 66.7% 인상"이라고 표현합니다. 둘을 섞어 쓰면 의미가 완전히 달라지니 주의하세요.',
          },
        ]}
      />
    </div>
  );
}
