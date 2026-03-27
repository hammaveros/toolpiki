'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';

export function DateCalculator() {
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState('');
  const [addDays, setAddDays] = useState('');
  const [mode, setMode] = useState<'diff' | 'add'>('diff');

  // 날짜 차이 계산
  const dateDiff = useMemo(() => {
    if (!startDate || !endDate) return null;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const absDays = Math.abs(diffDays);
    const years = Math.floor(absDays / 365);
    const months = Math.floor((absDays % 365) / 30);
    const days = absDays % 30;
    const weeks = Math.floor(absDays / 7);

    return {
      days: diffDays,
      absDays,
      years,
      months,
      remainingDays: days,
      weeks,
      hours: absDays * 24,
      isPast: diffDays < 0,
    };
  }, [startDate, endDate]);

  // 날짜 더하기/빼기 결과
  const addResult = useMemo(() => {
    if (!startDate) return null;

    const days = addDays === '' ? 0 : parseInt(addDays, 10);
    if (isNaN(days)) return null;

    const date = new Date(startDate);
    date.setDate(date.getDate() + days);

    return {
      date: date.toISOString().split('T')[0],
      formatted: date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      }),
      days,
    };
  }, [startDate, addDays]);

  const setToday = () => {
    setStartDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-2">
      {/* 모드 선택 */}
      <div className="flex gap-2">
        <Button
          variant={mode === 'diff' ? 'primary' : 'secondary'}
          onClick={() => setMode('diff')}
        >
          날짜 차이 계산
        </Button>
        <Button
          variant={mode === 'add' ? 'primary' : 'secondary'}
          onClick={() => setMode('add')}
        >
          날짜 더하기/빼기
        </Button>
      </div>

      {mode === 'diff' ? (
        <>
          {/* 날짜 차이 계산 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  시작일
                </label>
                <Button variant="ghost" size="sm" onClick={setToday}>
                  오늘
                </Button>
              </div>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  종료일
                </label>
              </div>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* 결과 */}
          {dateDiff && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <ResultCard
                label="총 일수"
                value={`${dateDiff.absDays}일`}
                highlight
              />
              <ResultCard label="총 주수" value={`${dateDiff.weeks}주`} />
              <ResultCard label="총 시간" value={`${dateDiff.hours}시간`} />
              <ResultCard
                label="상세"
                value={`${dateDiff.years}년 ${dateDiff.months}개월 ${dateDiff.remainingDays}일`}
              />
            </div>
          )}

          {dateDiff && (
            <p className="text-center text-gray-600 dark:text-gray-400">
              {dateDiff.isPast ? (
                <>
                  종료일이 시작일보다{' '}
                  <strong className="text-red-500">{dateDiff.absDays}일 전</strong>
                  입니다.
                </>
              ) : dateDiff.days === 0 ? (
                '같은 날짜입니다.'
              ) : (
                <>
                  시작일로부터{' '}
                  <strong className="text-blue-600 dark:text-blue-400">
                    {dateDiff.absDays}일 후
                  </strong>
                  입니다.
                </>
              )}
            </p>
          )}
        </>
      ) : (
        <>
          {/* 날짜 더하기/빼기 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  기준일
                </label>
                <Button variant="ghost" size="sm" onClick={setToday}>
                  오늘
                </Button>
              </div>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  더하거나 뺄 일수
                </label>
              </div>
              <Input
                type="number"
                value={addDays}
                onChange={(e) => setAddDays(e.target.value)}
                placeholder="양수: 더하기, 음수: 빼기"
              />
            </div>
          </div>

          {/* 빠른 버튼 */}
          <div className="flex flex-wrap gap-2">
            {[7, 30, 90, 180, 365, -7, -30].map((days) => (
              <Button
                key={days}
                variant="secondary"
                size="sm"
                onClick={() => setAddDays(String(days))}
              >
                {days > 0 ? `+${days}일` : `${days}일`}
              </Button>
            ))}
          </div>

          {/* 결과 */}
          {addResult && (
            <Card variant="bordered" className="p-4 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                결과 날짜
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {addResult.formatted}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {addResult.date}
              </p>
            </Card>
          )}
        </>
      )}

      <SeoContent />
    </div>
  );
}

function ResultCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <Card
      variant="bordered"
      className={`p-4 text-center ${
        highlight ? 'border-blue-500 dark:border-blue-400' : ''
      }`}
    >
      <div
        className={`text-xl font-bold ${
          highlight
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-gray-900 dark:text-white'
        }`}
      >
        {value}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        {label}
      </div>
    </Card>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📅 날짜 계산기란?
        </h2>
        <p className="text-sm leading-relaxed">
          날짜 계산기는 두 날짜 사이의 기간을 계산하거나, 특정 날짜에서 일수를 더하고 빼는 도구입니다.
          D-day 계산, 프로젝트 일정 관리, 계약 기간 산정, 여행 일정 계획 등 다양한 상황에서 활용됩니다.
          결과를 일, 주, 시간, 년/월/일 단위로 동시에 보여주어 필요한 형태로 바로 확인할 수 있습니다.
          빠른 버튼으로 자주 사용하는 기간(7일, 30일, 90일 등)을 원클릭으로 적용합니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 날짜 계산 활용 예시
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">상황</th>
                <th className="text-left py-2 px-2">모드</th>
                <th className="text-left py-2 px-2">예시</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">D-day 계산</td><td>날짜 차이</td><td>시험일까지 며칠 남았나?</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">계약 만료일</td><td>날짜 더하기</td><td>오늘부터 365일 후는?</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">재직 기간</td><td>날짜 차이</td><td>입사일~오늘 근무 일수</td></tr>
              <tr><td className="py-2 px-2 font-medium">일정 역산</td><td>날짜 빼기</td><td>여행 30일 전 예약 시작일</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 날짜 계산 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>영업일 계산</strong>: 총 일수에서 주말(2/7)을 대략 빼면 영업일 추정 가능</li>
          <li><strong>윤년 주의</strong>: 2월 29일이 포함된 기간은 1년 = 366일</li>
          <li><strong>시차 고려</strong>: 해외 일정은 시간대 변환도 함께 확인</li>
          <li><strong>음력 변환</strong>: 음력 생일, 명절은 별도 음력 변환기 사용</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '날짜 차이 계산에서 첫날과 마지막 날이 포함되나요?',
            answer: '종료일에서 시작일을 빼므로 시작일은 포함, 종료일은 미포함입니다. 둘 다 포함하려면 결과에 +1을 하세요.',
          },
          {
            question: '100일 기념일은 어떻게 계산하나요?',
            answer: '"날짜 더하기" 모드에서 시작일(만난 날)에 99일을 더하면 100일째 날짜가 나옵니다. 1일째를 만난 날로 계산하기 때문입니다.',
          },
          {
            question: '과거 날짜도 계산할 수 있나요?',
            answer: '네, "날짜 더하기/빼기" 모드에서 음수를 입력하면 과거 날짜를 계산합니다. 예: -30 입력 시 30일 전 날짜.',
          },
        ]}
      />
    </div>
  );
}
