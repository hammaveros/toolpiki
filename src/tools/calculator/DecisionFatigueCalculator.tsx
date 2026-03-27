'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FaqSection } from '@/components/ui/FaqItem';

interface DailyInput {
  meetings: string;
  emails: string;
  decisions: string;
  interruptions: string;
}

export function DecisionFatigueCalculator() {
  const [input, setInput] = useState<DailyInput>({
    meetings: '',
    emails: '',
    decisions: '',
    interruptions: '',
  });

  const result = useMemo(() => {
    const meetings = parseInt(input.meetings) || 0;
    const emails = parseInt(input.emails) || 0;
    const decisions = parseInt(input.decisions) || 0;
    const interruptions = parseInt(input.interruptions) || 0;

    if (meetings === 0 && emails === 0 && decisions === 0 && interruptions === 0) {
      return null;
    }

    // 결정 피로도 점수 계산 (가중치 기반)
    // 회의: 3점/개, 이메일: 0.5점/개, 주요 결정: 5점/개, 업무 중단: 2점/개
    const score =
      meetings * 3 +
      emails * 0.5 +
      decisions * 5 +
      interruptions * 2;

    // 등급 산정
    let level: string;
    let color: string;
    let message: string;

    if (score < 20) {
      level = '낮음';
      color = 'text-green-600 dark:text-green-400';
      message = '오늘 결정 부담이 적습니다.';
    } else if (score < 40) {
      level = '보통';
      color = 'text-yellow-600 dark:text-yellow-400';
      message = '일반적인 수준입니다.';
    } else if (score < 60) {
      level = '높음';
      color = 'text-orange-600 dark:text-orange-400';
      message = '중요한 결정은 오전에 하는 것을 권장합니다.';
    } else {
      level = '매우 높음';
      color = 'text-red-600 dark:text-red-400';
      message = '결정 피로 누적 가능성이 있습니다.';
    }

    return {
      score: Math.round(score),
      level,
      color,
      message,
      breakdown: {
        meetings: meetings * 3,
        emails: Math.round(emails * 0.5),
        decisions: decisions * 5,
        interruptions: interruptions * 2,
      },
    };
  }, [input]);

  const handleChange = (field: keyof DailyInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleReset = () => {
    setInput({ meetings: '', emails: '', decisions: '', interruptions: '' });
  };

  return (
    <div className="space-y-2">
      {/* 입력 필드 */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="회의 수"
          type="number"
          min="0"
          value={input.meetings}
          onChange={handleChange('meetings')}
          placeholder="0"
        />
        <Input
          label="처리한 이메일 수"
          type="number"
          min="0"
          value={input.emails}
          onChange={handleChange('emails')}
          placeholder="0"
        />
        <Input
          label="주요 결정 횟수"
          type="number"
          min="0"
          value={input.decisions}
          onChange={handleChange('decisions')}
          placeholder="0"
        />
        <Input
          label="업무 중단 횟수"
          type="number"
          min="0"
          value={input.interruptions}
          onChange={handleChange('interruptions')}
          placeholder="0"
        />
      </div>

      {/* 결과 */}
      {result && (
        <Card variant="bordered" className="p-6">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              오늘의 결정 피로도
            </p>
            <p className={`text-4xl font-bold ${result.color}`}>
              {result.score}점
            </p>
            <p className={`text-lg font-medium mt-1 ${result.color}`}>
              {result.level}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {result.message}
            </p>
          </div>

          {/* 점수 분해 */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">점수 상세</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">회의</span>
                <span className="font-mono">+{result.breakdown.meetings}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">이메일</span>
                <span className="font-mono">+{result.breakdown.emails}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">주요 결정</span>
                <span className="font-mono">+{result.breakdown.decisions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">업무 중단</span>
                <span className="font-mono">+{result.breakdown.interruptions}</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* 초기화 버튼 */}
      <div className="flex justify-end">
        <Button variant="secondary" size="sm" onClick={handleReset}>
          초기화
        </Button>
      </div>

      {/* 안내 */}
      <p className="text-xs text-gray-400 dark:text-gray-500">
        ※ 참고용 지표입니다. 실제 피로도는 개인차가 있습니다.
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
          🧠 결정 피로도 계산기란?
        </h2>
        <p className="text-sm leading-relaxed">
          결정 피로도 계산기는 하루 동안 축적되는 의사결정 부담을 수치화하는 생산성 도구입니다.
          회의 수, 이메일 처리량, 주요 결정 횟수, 업무 중단 빈도를 입력하면 가중치 기반 점수가 계산됩니다.
          점수가 높을수록 중요한 결정은 다음 날 오전으로 미루는 것이 좋습니다.
          스티브 잡스가 매일 같은 옷을 입은 이유도 이 &quot;결정 피로&quot;를 줄이기 위해서였습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 결정 피로 가중치 기준
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">활동 유형</th>
                <th className="text-left py-2 px-2">가중치</th>
                <th className="text-left py-2 px-2">피로 요인</th>
                <th className="text-left py-2 px-2">예시</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">회의</td><td className="font-mono">×3점</td><td>다중 판단, 사회적 에너지</td><td>1시간 회의 = 3점</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">이메일</td><td className="font-mono">×0.5점</td><td>미세 판단 누적</td><td>20개 처리 = 10점</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">주요 결정</td><td className="font-mono">×5점</td><td>인지적 부하 집중</td><td>프로젝트 방향 결정</td></tr>
              <tr><td className="py-2 px-2 font-medium">업무 중단</td><td className="font-mono">×2점</td><td>컨텍스트 전환 비용</td><td>슬랙 알림, 전화</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 결정 피로 줄이는 방법
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>중요한 결정은 오전에</strong>: 에너지가 충분할 때 핵심 의사결정 처리</li>
          <li><strong>루틴화</strong>: 반복 업무는 자동화/습관화하여 결정 요소 제거</li>
          <li><strong>배치 처리</strong>: 이메일, 메시지는 정해진 시간에 몰아서 확인</li>
          <li><strong>선택지 제한</strong>: 옵션이 많을수록 피로↑, 2-3개로 좁히기</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '결정 피로(Decision Fatigue)란 무엇인가요?',
            answer: '하루 동안 결정을 많이 내릴수록 이후 결정의 질이 떨어지는 심리 현상입니다. 판사의 가석방 결정 연구에서 오전보다 오후 결정의 질이 낮았다는 유명한 연구가 있습니다.',
          },
          {
            question: '점수가 높으면 어떻게 해야 하나요?',
            answer: '60점 이상이면 중요한 결정을 내일 오전으로 미루세요. 지금 당장 결정해야 한다면 짧은 휴식이나 간식 섭취(포도당 보충)가 도움됩니다.',
          },
          {
            question: '매일 측정해야 하나요?',
            answer: '매일 측정할 필요는 없습니다. 평소보다 피곤하거나 중요한 결정 전에 점검용으로 활용하면 됩니다. 평균 점수를 알아두면 비교 기준이 됩니다.',
          },
        ]}
      />
    </div>
  );
}
