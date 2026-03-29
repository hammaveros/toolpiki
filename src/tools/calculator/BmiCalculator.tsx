'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import { FaqSection } from '@/components/ui/FaqItem';

interface BmiRange {
  min: number;
  max: number;
  label: string;
  color: string;
  bgColor: string;
}

const BMI_RANGES: BmiRange[] = [
  { min: 0, max: 18.5, label: '저체중', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  { min: 18.5, max: 23, label: '정상', color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-900/30' },
  { min: 23, max: 25, label: '과체중', color: 'text-yellow-600 dark:text-yellow-400', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30' },
  { min: 25, max: 30, label: '비만', color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
  { min: 30, max: 100, label: '고도비만', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900/30' },
];

function getBmiRange(bmi: number): BmiRange {
  return BMI_RANGES.find((r) => bmi >= r.min && bmi < r.max) || BMI_RANGES[BMI_RANGES.length - 1];
}

export function BmiCalculator() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [showResult, setShowResult] = useState(false);

  const result = useMemo(() => {
    const h = parseFloat(height) / 100; // cm to m
    const w = parseFloat(weight);

    if (!h || !w || h <= 0 || w <= 0) return null;

    const bmi = w / (h * h);
    const range = getBmiRange(bmi);

    // 정상 체중 범위
    const normalMin = 18.5 * h * h;
    const normalMax = 23 * h * h;

    // 이상적인 체중 (BMI 21 기준)
    const idealWeight = 21 * h * h;

    // 체중 차이
    const weightDiff = w - idealWeight;

    return {
      bmi: bmi.toFixed(1),
      range,
      normalMin: normalMin.toFixed(1),
      normalMax: normalMax.toFixed(1),
      idealWeight: idealWeight.toFixed(1),
      weightDiff: weightDiff.toFixed(1),
      needToLose: weightDiff > 0,
    };
  }, [height, weight]);

  const handleCalculate = () => {
    if (height && weight) {
      setShowResult(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCalculate();
    }
  };

  return (
    <div className="space-y-2">
      <Card variant="bordered" className="p-5">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              키 (cm)
            </label>
            <Input
              type="number"
              value={height}
              onChange={(e) => { setHeight(e.target.value); setShowResult(false); }}
              onKeyDown={handleKeyDown}
              placeholder="예: 170"
              min="100"
              max="250"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              체중 (kg)
            </label>
            <Input
              type="number"
              value={weight}
              onChange={(e) => { setWeight(e.target.value); setShowResult(false); }}
              onKeyDown={handleKeyDown}
              placeholder="예: 65"
              min="20"
              max="300"
            />
          </div>
          <Button onClick={handleCalculate} className="w-full">
            계산하기
          </Button>
        </div>
      </Card>

      {showResult && result && (
        <>
          <Card variant="bordered" className={cn('p-6 text-center', result.range.bgColor)}>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              BMI (체질량지수)
            </div>
            <div className={cn('text-5xl font-bold mb-2', result.range.color)}>
              {result.bmi}
            </div>
            <div className={cn('text-xl font-medium', result.range.color)}>
              {result.range.label}
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card variant="bordered" className="p-4 text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">정상 체중 범위</div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {result.normalMin} ~ {result.normalMax} kg
              </div>
            </Card>
            <Card variant="bordered" className="p-4 text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">이상적인 체중</div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {result.idealWeight} kg
              </div>
            </Card>
          </div>

          {parseFloat(result.weightDiff) !== 0 && (
            <Card variant="bordered" className="p-4 text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                이상 체중까지
              </div>
              <div className={cn(
                'text-2xl font-bold',
                result.needToLose
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-blue-600 dark:text-blue-400'
              )}>
                {result.needToLose ? '-' : '+'}{Math.abs(parseFloat(result.weightDiff))} kg
              </div>
            </Card>
          )}

          {/* BMI 범위 시각화 */}
          <Card variant="bordered" className="p-4">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              BMI 범위
            </div>
            <div className="relative h-8 rounded-full overflow-hidden flex">
              {BMI_RANGES.map((range, i) => (
                <div
                  key={i}
                  className={cn('flex-1 flex items-center justify-center text-xs font-medium', range.bgColor, range.color)}
                >
                  {range.label}
                </div>
              ))}
            </div>
            <div className="relative mt-2">
              <div
                className="absolute w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-gray-900 dark:border-b-white"
                style={{
                  left: `${Math.min(Math.max((parseFloat(result.bmi) / 35) * 100, 2), 98)}%`,
                  transform: 'translateX(-50%)',
                }}
              />
            </div>
          </Card>
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
          ⚖️ BMI 계산기란?
        </h2>
        <p className="text-sm leading-relaxed">
          BMI(Body Mass Index, 체질량지수)는 키와 체중의 비율로 비만도를 측정하는 국제 표준 지표입니다.
          체중(kg)을 키(m)의 제곱으로 나눈 값으로, 세계보건기구(WHO)에서 권장하는 비만 판정 기준입니다.
          이 계산기는 입력된 키와 체중으로 BMI를 계산하고, 정상 체중 범위와 이상적인 체중까지 알려줍니다.
          시각화된 BMI 범위 차트로 현재 건강 상태를 직관적으로 파악할 수 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 대한비만학회 BMI 기준
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">분류</th>
                <th className="text-left py-2 px-2">BMI 범위</th>
                <th className="text-left py-2 px-2">건강 위험도</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">저체중</td><td className="font-mono">18.5 미만</td><td>영양실조, 면역력 저하 주의</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">정상</td><td className="font-mono">18.5 ~ 22.9</td><td>건강한 체중 범위</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">과체중</td><td className="font-mono">23 ~ 24.9</td><td>생활습관 개선 권장</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">비만 1단계</td><td className="font-mono">25 ~ 29.9</td><td>대사증후군 위험 증가</td></tr>
              <tr><td className="py-2 px-2 font-medium">비만 2단계</td><td className="font-mono">30 이상</td><td>심혈관 질환 고위험</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-2">※ 아시아인 기준(대한비만학회)으로 서양 기준과 다릅니다.</p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 BMI의 한계와 보완 지표
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>근육량 미반영</strong>: 운동선수는 BMI가 높아도 건강할 수 있음 (체지방률 확인 필요)</li>
          <li><strong>체지방 분포</strong>: 복부 비만이 더 위험하므로 허리둘레 측정 권장</li>
          <li><strong>연령/성별 차이</strong>: 같은 BMI라도 노인과 젊은 성인은 의미가 다름</li>
          <li><strong>임산부 비적용</strong>: 임신 중에는 BMI 기준 적용 불가</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 연령별 정상 BMI 범위
        </h2>
        <p className="text-sm leading-relaxed mb-3">
          같은 BMI라도 연령에 따라 건강 의미가 달라집니다. 아래는 대한비만학회 및 WHO 자료를 참고한 연령별 권장 BMI 범위입니다.
        </p>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">연령대</th>
                <th className="text-left py-2 px-2">권장 BMI</th>
                <th className="text-left py-2 px-2">참고</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">20대</td><td className="font-mono">18.5 ~ 22.9</td><td>근육량이 가장 높은 시기, 표준 기준 적용</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">30대</td><td className="font-mono">18.5 ~ 23.5</td><td>기초대사량 감소 시작, 체중 관리 필요</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">40대</td><td className="font-mono">18.5 ~ 24.0</td><td>내장지방 증가 주의, 허리둘레 함께 체크</td></tr>
              <tr><td className="py-2 px-2 font-medium">50대 이상</td><td className="font-mono">20.0 ~ 25.0</td><td>저체중이 더 위험, 약간 높은 BMI가 유리</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-2">※ 개인 건강 상태에 따라 다를 수 있으며, 정확한 판단은 전문의 상담을 권장합니다.</p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🔍 마른 비만 자가진단
        </h2>
        <p className="text-sm leading-relaxed mb-3">
          마른 비만(Skinny Fat)은 BMI가 정상 범위(18.5~22.9)인데 체지방률이 높은 상태를 말합니다.
          겉으로 보기에 날씬하지만 근육은 적고 내장지방이 많아 대사증후군 위험이 높습니다.
        </p>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>체지방률 기준</strong>: 남성 25% 이상, 여성 30% 이상이면 마른 비만 의심</li>
          <li><strong>허리둘레</strong>: 남성 90cm(35인치), 여성 85cm(33인치) 이상이면 복부 비만</li>
          <li><strong>주요 원인</strong>: 운동 부족, 극단적 식이 제한(요요), 근력 운동 없이 유산소만 수행</li>
          <li><strong>개선 방법</strong>: 단백질 섭취 증가 + 근력 운동 병행이 핵심</li>
        </ul>
        <p className="text-xs text-gray-500 mt-2">체성분 분석기(인바디 등)로 체지방률과 근육량을 정확히 측정하는 것을 권장합니다.</p>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '아시아인 BMI 기준이 서양과 다른 이유는?',
            answer: '아시아인은 같은 BMI에서도 체지방률이 높고 내장지방이 많아 심혈관 질환 위험이 더 큽니다. 따라서 WHO 기준(25 이상 과체중)보다 낮은 23 이상을 과체중으로 분류합니다.',
          },
          {
            question: 'BMI가 정상인데 왜 배가 나왔나요?',
            answer: 'BMI는 전체 체중 비율만 측정하므로 "마른 비만"을 감지하지 못합니다. 허리둘레(남성 90cm, 여성 85cm 이상)나 체지방률을 함께 확인하세요.',
          },
          {
            question: '어린이/청소년도 이 기준을 쓰나요?',
            answer: '아닙니다. 성장기에는 연령별 BMI 백분위수를 사용합니다. 성인 기준 BMI는 만 18세 이상에게만 적용됩니다.',
          },
        ]}
      />
    </div>
  );
}
