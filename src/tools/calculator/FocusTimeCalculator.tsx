'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FaqSection } from '@/components/ui/FaqItem';

interface FocusInput {
  wakeTime: string;
  workStart: string;
  lunchStart: string;
  lunchEnd: string;
  workEnd: string;
}

interface TimeBlock {
  label: string;
  start: string;
  end: string;
  quality: 'high' | 'medium' | 'low';
  description: string;
}

export function FocusTimeCalculator() {
  const [input, setInput] = useState<FocusInput>({
    wakeTime: '07:00',
    workStart: '09:00',
    lunchStart: '12:00',
    lunchEnd: '13:00',
    workEnd: '18:00',
  });

  const result = useMemo(() => {
    const { wakeTime, workStart, lunchStart, lunchEnd, workEnd } = input;

    // 시간을 분으로 변환
    const toMinutes = (time: string) => {
      const [h, m] = time.split(':').map(Number);
      return h * 60 + m;
    };

    const wake = toMinutes(wakeTime);
    const start = toMinutes(workStart);
    const lunch = toMinutes(lunchStart);
    const lunchE = toMinutes(lunchEnd);
    const end = toMinutes(workEnd);

    // 기상 후 2-4시간이 골든타임 (과학적 근거)
    const goldenStart = wake + 120; // 기상 2시간 후
    const goldenEnd = wake + 240; // 기상 4시간 후

    // 시간 블록 생성
    const blocks: TimeBlock[] = [];

    // 오전 블록
    if (start < lunch) {
      const amStart = Math.max(start, goldenStart);
      const amEnd = Math.min(lunch, goldenEnd);

      if (amStart < amEnd && amStart >= start) {
        blocks.push({
          label: '오전 골든타임',
          start: formatTime(amStart),
          end: formatTime(amEnd),
          quality: 'high',
          description: '복잡한 업무, 중요한 의사결정',
        });
      }

      // 골든타임 이전
      if (start < goldenStart && goldenStart < lunch) {
        blocks.push({
          label: '출근 직후',
          start: formatTime(start),
          end: formatTime(Math.min(goldenStart, lunch)),
          quality: 'medium',
          description: '이메일 확인, 하루 계획',
        });
      }

      // 골든타임 이후 ~ 점심
      if (goldenEnd < lunch && goldenEnd > start) {
        blocks.push({
          label: '오전 후반',
          start: formatTime(goldenEnd),
          end: formatTime(lunch),
          quality: 'medium',
          description: '협업, 회의',
        });
      }
    }

    // 오후 블록
    if (lunchE < end) {
      // 점심 직후 슬럼프
      const slumpEnd = Math.min(lunchE + 90, end);
      blocks.push({
        label: '점심 후 슬럼프',
        start: formatTime(lunchE),
        end: formatTime(slumpEnd),
        quality: 'low',
        description: '단순 작업, 정리',
      });

      // 오후 회복
      if (slumpEnd < end) {
        const recoveryEnd = Math.min(slumpEnd + 120, end);
        blocks.push({
          label: '오후 회복',
          start: formatTime(slumpEnd),
          end: formatTime(recoveryEnd),
          quality: 'medium',
          description: '중간 난이도 업무',
        });

        // 퇴근 전
        if (recoveryEnd < end) {
          blocks.push({
            label: '퇴근 전',
            start: formatTime(recoveryEnd),
            end: formatTime(end),
            quality: 'low',
            description: '마무리, 내일 준비',
          });
        }
      }
    }

    // 골든타임 계산
    const goldenHours = calculateOverlap(
      Math.max(goldenStart, start),
      Math.min(goldenEnd, end),
      lunch,
      lunchE
    );

    return {
      blocks,
      goldenStart: formatTime(goldenStart),
      goldenEnd: formatTime(goldenEnd),
      goldenHours,
    };
  }, [input]);

  // 분을 시:분 형식으로 변환
  function formatTime(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  // 겹치는 시간 계산 (점심 제외)
  function calculateOverlap(s1: number, e1: number, lunchS: number, lunchE: number): number {
    if (s1 >= e1) return 0;

    let total = e1 - s1;

    // 점심시간과 겹치는 부분 제외
    const overlapStart = Math.max(s1, lunchS);
    const overlapEnd = Math.min(e1, lunchE);
    if (overlapStart < overlapEnd) {
      total -= (overlapEnd - overlapStart);
    }

    return Math.max(0, Math.round(total / 60 * 10) / 10);
  }

  const handleChange = (field: keyof FocusInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const qualityColors = {
    high: 'bg-green-100 dark:bg-green-900/30 border-green-500',
    medium: 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-500',
    low: 'bg-gray-100 dark:bg-gray-800 border-gray-400',
  };

  const qualityLabels = {
    high: '집중',
    medium: '보통',
    low: '낮음',
  };

  return (
    <div className="space-y-2">
      {/* 시간 입력 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Input
          label="기상 시간"
          type="time"
          value={input.wakeTime}
          onChange={handleChange('wakeTime')}
        />
        <Input
          label="출근 시간"
          type="time"
          value={input.workStart}
          onChange={handleChange('workStart')}
        />
        <Input
          label="점심 시작"
          type="time"
          value={input.lunchStart}
          onChange={handleChange('lunchStart')}
        />
        <Input
          label="점심 종료"
          type="time"
          value={input.lunchEnd}
          onChange={handleChange('lunchEnd')}
        />
        <Input
          label="퇴근 시간"
          type="time"
          value={input.workEnd}
          onChange={handleChange('workEnd')}
        />
      </div>

      {/* 골든타임 요약 */}
      <Card variant="bordered" className="p-4 bg-green-50 dark:bg-green-900/20">
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            오늘의 골든타임
          </p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {result.goldenStart} ~ {result.goldenEnd}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            업무 중 약 {result.goldenHours}시간
          </p>
        </div>
      </Card>

      {/* 시간대별 블록 */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          시간대별 집중도
        </p>
        {result.blocks.map((block, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg border-l-4 ${qualityColors[block.quality]}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">{block.label}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                  {block.start} - {block.end}
                </span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded ${
                block.quality === 'high'
                  ? 'bg-green-500 text-white'
                  : block.quality === 'medium'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-400 text-white'
              }`}>
                {qualityLabels[block.quality]}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {block.description}
            </p>
          </div>
        ))}
      </div>

      {/* 안내 */}
      <p className="text-xs text-gray-400 dark:text-gray-500">
        ※ 기상 후 2~4시간을 &quot;골든타임&quot;으로 계산합니다. 개인차가 있습니다.
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
          ⏰ 집중 시간 계산기란?
        </h2>
        <p className="text-sm leading-relaxed">
          집중 시간 계산기는 기상 시간을 기준으로 하루 중 최적의 집중 시간대를 알려주는 생산성 도구입니다.
          과학 연구에 따르면 기상 후 2~4시간이 인지 능력의 &quot;골든타임&quot;으로, 이 시간에 복잡한 업무를 처리하는 것이 효율적입니다.
          점심 후 슬럼프 시간대, 오후 회복 시간 등 시간대별 집중도를 시각화해 업무 배치에 활용할 수 있습니다.
          개인의 근무 시간에 맞춰 맞춤형 시간 블록을 생성합니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 시간대별 집중도 특성
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">시간대</th>
                <th className="text-left py-2 px-2">집중도</th>
                <th className="text-left py-2 px-2">적합한 업무</th>
                <th className="text-left py-2 px-2">생리학적 이유</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">기상+2~4시간</td><td className="text-green-600">높음</td><td>복잡한 문제 해결, 창의적 작업</td><td>코르티솔 피크</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">오전 후반</td><td className="text-yellow-600">보통</td><td>회의, 협업, 소통</td><td>에너지 안정기</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">점심 후 1~2시간</td><td className="text-gray-500">낮음</td><td>단순 작업, 정리</td><td>소화 에너지 소모</td></tr>
              <tr><td className="py-2 px-2 font-medium">오후 후반</td><td className="text-yellow-600">보통</td><td>루틴 업무, 마무리</td><td>제2의 각성 시간</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 골든타임 활용 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>골든타임 보호</strong>: 이 시간대에는 회의, 전화를 피하고 딥 워크에 집중</li>
          <li><strong>점심 슬럼프 활용</strong>: 짧은 낮잠(10-20분) 또는 가벼운 산책으로 회복</li>
          <li><strong>올빼미형은 다르다</strong>: 야행성이라면 저녁~밤 시간이 골든타임일 수 있음</li>
          <li><strong>일관된 기상 시간</strong>: 골든타임 예측을 위해 기상 시간 규칙화 권장</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '골든타임이 왜 기상 후 2~4시간인가요?',
            answer: '기상 직후 코르티솔(각성 호르몬)이 분비되어 약 2시간 후 피크에 도달합니다. 이때 전두엽 기능이 최고조에 달해 복잡한 의사결정과 창의적 작업에 최적입니다.',
          },
          {
            question: '점심 슬럼프는 왜 발생하나요?',
            answer: '식사 후 소화 기관으로 혈류가 집중되면서 뇌로 가는 산소와 포도당이 일시적으로 감소합니다. 또한 생체리듬상 오후 1~3시에 자연스럽게 졸음이 오도록 설계되어 있습니다.',
          },
          {
            question: '야간 근무자도 사용할 수 있나요?',
            answer: '네, 기상 시간만 정확히 입력하면 됩니다. 밤 10시에 기상한다면 자정~새벽 2시가 골든타임이 됩니다. 핵심은 "기상 후 몇 시간"이 기준이라는 점입니다.',
          },
        ]}
      />
    </div>
  );
}
