'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FaqSection } from '@/components/ui/FaqItem';

interface MeetingInput {
  participants: string;
  duration: string;
  avgSalary: string;
}

export function MeetingCostCalculator() {
  const [input, setInput] = useState<MeetingInput>({
    participants: '',
    duration: '',
    avgSalary: '5000',
  });

  const result = useMemo(() => {
    const participants = parseInt(input.participants) || 0;
    const duration = parseInt(input.duration) || 0;
    const avgSalary = parseInt(input.avgSalary) || 0;

    if (participants === 0 || duration === 0 || avgSalary === 0) {
      return null;
    }

    // 연봉 → 시급 계산 (연 2080 근무시간 기준: 52주 × 40시간)
    const hourlyRate = avgSalary * 10000 / 2080;
    const minuteRate = hourlyRate / 60;

    // 회의 비용 계산
    const totalMinutes = participants * duration;
    const totalCost = totalMinutes * minuteRate;

    // 월간 비용 (주 5일 기준, 매일 이 회의가 있다면)
    const monthlyCost = totalCost * 22;

    return {
      totalCost: Math.round(totalCost),
      hourlyRate: Math.round(hourlyRate),
      totalManHours: (totalMinutes / 60).toFixed(1),
      monthlyCost: Math.round(monthlyCost),
    };
  }, [input]);

  const handleChange = (field: keyof MeetingInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const presetSalaries = [
    { label: '3천만원', value: '3000' },
    { label: '5천만원', value: '5000' },
    { label: '7천만원', value: '7000' },
    { label: '1억원', value: '10000' },
  ];

  const presetDurations = [
    { label: '30분', value: '30' },
    { label: '1시간', value: '60' },
    { label: '1.5시간', value: '90' },
    { label: '2시간', value: '120' },
  ];

  return (
    <div className="space-y-2">
      {/* 참여자 수 */}
      <Input
        label="참여 인원"
        type="number"
        min="1"
        value={input.participants}
        onChange={handleChange('participants')}
        placeholder="예: 5"
      />

      {/* 회의 시간 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          회의 시간 (분)
        </label>
        <div className="flex gap-2 mb-2">
          {presetDurations.map((preset) => (
            <Button
              key={preset.value}
              variant={input.duration === preset.value ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setInput((prev) => ({ ...prev, duration: preset.value }))}
            >
              {preset.label}
            </Button>
          ))}
        </div>
        <Input
          type="number"
          min="1"
          value={input.duration}
          onChange={handleChange('duration')}
          placeholder="직접 입력"
        />
      </div>

      {/* 평균 연봉 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          평균 연봉 (만원)
        </label>
        <div className="flex gap-2 mb-2">
          {presetSalaries.map((preset) => (
            <Button
              key={preset.value}
              variant={input.avgSalary === preset.value ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setInput((prev) => ({ ...prev, avgSalary: preset.value }))}
            >
              {preset.label}
            </Button>
          ))}
        </div>
        <Input
          type="number"
          min="1"
          value={input.avgSalary}
          onChange={handleChange('avgSalary')}
          placeholder="직접 입력"
        />
      </div>

      {/* 결과 */}
      {result && (
        <Card variant="bordered" className="p-6">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              이 회의의 비용
            </p>
            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              {result.totalCost.toLocaleString()}원
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400">총 투입 시간</p>
              <p className="font-medium text-lg">{result.totalManHours}시간</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400">인당 시급</p>
              <p className="font-medium text-lg">{result.hourlyRate.toLocaleString()}원</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              매일 이 회의를 한다면 월간
            </p>
            <p className="text-xl font-semibold text-orange-600 dark:text-orange-400">
              {result.monthlyCost.toLocaleString()}원
            </p>
          </div>
        </Card>
      )}

      {/* 안내 */}
      <p className="text-xs text-gray-400 dark:text-gray-500">
        ※ 연 2,080 근무시간(주 40시간) 기준. 참고용 추정치입니다.
      </p>

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💰 회의 비용 계산기란?
        </h2>
        <p className="text-sm leading-relaxed">
          회의 비용 계산기는 회의에 투입되는 인건비를 가시화하는 도구입니다.
          참여 인원, 회의 시간, 평균 연봉을 입력하면 회의의 숨겨진 비용을 원 단위로 계산합니다.
          연간 2,080 근무시간(주 40시간 × 52주) 기준으로 시급을 산출하여 정확한 비용을 추정합니다.
          불필요한 회의를 줄이고 생산성을 높이는 의사결정에 참고할 수 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 회의 비용 예시
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">시나리오</th>
                <th className="text-left py-2 px-2">구성</th>
                <th className="text-left py-2 px-2">1회 비용</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">팀 스탠드업</td><td>5명 × 15분 × 5천만</td><td className="font-mono">~6,000원</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">부서 정기회의</td><td>10명 × 60분 × 5천만</td><td className="font-mono">~240,000원</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">임원 전략회의</td><td>8명 × 120분 × 1억</td><td className="font-mono">~770,000원</td></tr>
              <tr><td className="py-2 px-2 font-medium">전사 타운홀</td><td>100명 × 60분 × 5천만</td><td className="font-mono">~2,400,000원</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 회의 비용 절감 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>참석자 최소화</strong>: 의사결정에 필수적인 인원만 참석</li>
          <li><strong>시간 제한</strong>: 30분/45분 단위로 회의 시간 제한</li>
          <li><strong>비동기 대체</strong>: 공유만 필요하면 문서/슬랙으로 대체</li>
          <li><strong>스탠딩 미팅</strong>: 서서 하면 자연스럽게 짧아짐</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '회의 비용 계산이 왜 중요한가요?',
            answer: '회의는 눈에 보이지 않는 비용입니다. 5명이 1시간 회의하면 5시간의 업무 시간이 소모됩니다. 비용을 가시화하면 불필요한 회의를 줄이고 효율적인 의사결정이 가능합니다.',
          },
          {
            question: '2,080시간은 어떻게 계산되나요?',
            answer: '연간 근무시간의 표준 기준입니다. 주 40시간 × 52주 = 2,080시간. 휴가, 공휴일을 제외한 실제 근무시간은 이보다 적으므로 실제 시급은 더 높을 수 있습니다.',
          },
          {
            question: '정확한 비용을 알려면 어떻게 해야 하나요?',
            answer: '참석자 개인별 연봉을 입력하면 더 정확합니다. 이 계산기는 평균 연봉으로 추정하므로 실제와 차이가 있을 수 있습니다. 복리후생비를 포함하면 실제 비용은 20-40% 더 높습니다.',
          },
        ]}
      />
    </div>
  );
}
