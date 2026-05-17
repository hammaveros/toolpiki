'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';

const presets = [
  { name: '매분', cron: '* * * * *' },
  { name: '매시간', cron: '0 * * * *' },
  { name: '매일 자정', cron: '0 0 * * *' },
  { name: '매일 오전 9시', cron: '0 9 * * *' },
  { name: '매주 월요일', cron: '0 0 * * 1' },
  { name: '매월 1일', cron: '0 0 1 * *' },
  { name: '평일 오전 9시', cron: '0 9 * * 1-5' },
  { name: '5분마다', cron: '*/5 * * * *' },
  { name: '30분마다', cron: '*/30 * * * *' },
  { name: '매시 15분', cron: '15 * * * *' },
];

const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
const monthNames = ['', '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

export function CronParser() {
  const [cronExpression, setCronExpression] = useState('0 9 * * 1-5');
  const [description, setDescription] = useState('');
  const [nextRuns, setNextRuns] = useState<string[]>([]);
  const [error, setError] = useState('');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const parseCronField = (field: string, min: number, max: number): number[] => {
    const values: number[] = [];

    if (field === '*') {
      for (let i = min; i <= max; i++) values.push(i);
      return values;
    }

    const parts = field.split(',');
    for (const part of parts) {
      if (part.includes('/')) {
        const [range, step] = part.split('/');
        const stepNum = parseInt(step);
        let start = min;
        let end = max;
        if (range !== '*') {
          if (range.includes('-')) {
            [start, end] = range.split('-').map(Number);
          } else {
            start = parseInt(range);
          }
        }
        for (let i = start; i <= end; i += stepNum) {
          values.push(i);
        }
      } else if (part.includes('-')) {
        const [start, end] = part.split('-').map(Number);
        for (let i = start; i <= end; i++) values.push(i);
      } else {
        values.push(parseInt(part));
      }
    }
    return [...new Set(values)].sort((a, b) => a - b);
  };

  const describeCron = (cron: string): string => {
    const parts = cron.trim().split(/\s+/);
    if (parts.length !== 5) return '올바른 형식: 분 시 일 월 요일 (5개 필드)';

    const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;
    const descriptions: string[] = [];

    // 분
    if (minute === '*') descriptions.push('매분');
    else if (minute.startsWith('*/')) descriptions.push(`${minute.slice(2)}분마다`);
    else descriptions.push(`${minute}분에`);

    // 시
    if (hour === '*') descriptions.push('매시간');
    else if (hour.startsWith('*/')) descriptions.push(`${hour.slice(2)}시간마다`);
    else descriptions.push(`${hour}시`);

    // 일
    if (dayOfMonth !== '*') {
      if (dayOfMonth.includes('-')) {
        const [start, end] = dayOfMonth.split('-');
        descriptions.push(`${start}일~${end}일`);
      } else {
        descriptions.push(`${dayOfMonth}일`);
      }
    }

    // 월
    if (month !== '*') {
      const months = parseCronField(month, 1, 12);
      descriptions.push(months.map(m => monthNames[m]).join(', '));
    }

    // 요일
    if (dayOfWeek !== '*') {
      if (dayOfWeek === '1-5') descriptions.push('평일');
      else if (dayOfWeek === '0,6' || dayOfWeek === '6,0') descriptions.push('주말');
      else {
        const days = parseCronField(dayOfWeek, 0, 6);
        descriptions.push(days.map(d => dayNames[d] + '요일').join(', '));
      }
    }

    return descriptions.join(' ');
  };

  const calculateNextRuns = (cron: string, count: number = 5): Date[] => {
    const parts = cron.trim().split(/\s+/);
    if (parts.length !== 5) return [];

    const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;
    const minutes = parseCronField(minute, 0, 59);
    const hours = parseCronField(hour, 0, 23);
    const days = parseCronField(dayOfMonth, 1, 31);
    const months = parseCronField(month, 1, 12);
    const daysOfWeek = parseCronField(dayOfWeek, 0, 6);

    const results: Date[] = [];
    const now = new Date();
    const current = new Date(now);
    current.setSeconds(0);
    current.setMilliseconds(0);

    const maxIterations = 10000;
    let iterations = 0;

    while (results.length < count && iterations < maxIterations) {
      iterations++;
      current.setMinutes(current.getMinutes() + 1);

      const m = current.getMinutes();
      const h = current.getHours();
      const d = current.getDate();
      const mo = current.getMonth() + 1;
      const dow = current.getDay();

      if (
        minutes.includes(m) &&
        hours.includes(h) &&
        days.includes(d) &&
        months.includes(mo) &&
        (dayOfWeek === '*' || daysOfWeek.includes(dow))
      ) {
        results.push(new Date(current));
      }
    }

    return results;
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      try {
        const desc = describeCron(cronExpression);
        setDescription(desc);

        const runs = calculateNextRuns(cronExpression, 5);
        setNextRuns(runs.map(d =>
          d.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            weekday: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })
        ));
        setError('');
      } catch {
        setError('올바르지 않은 Cron 표현식입니다');
        setDescription('');
        setNextRuns([]);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [cronExpression]);

  return (
    <div className="space-y-4">
      <Card variant="bordered" className="p-4">
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cron 표현식
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={cronExpression}
                onChange={(e) => setCronExpression(e.target.value)}
                className="flex-1 px-3 py-2 font-mono text-lg border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                placeholder="* * * * *"
              />
              <CopyButton text={cronExpression} />
            </div>
          </div>
        </div>
        <div className="mt-2 grid grid-cols-5 gap-2 text-xs text-center text-gray-500">
          <span>분 (0-59)</span>
          <span>시 (0-23)</span>
          <span>일 (1-31)</span>
          <span>월 (1-12)</span>
          <span>요일 (0-6)</span>
        </div>
      </Card>

      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <Button
            key={preset.cron}
            variant={cronExpression === preset.cron ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setCronExpression(preset.cron)}
          >
            {preset.name}
          </Button>
        ))}
      </div>

      {error ? (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
          {error}
        </div>
      ) : (
        <>
          {description && (
            <Card variant="bordered" className="p-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">설명</h3>
              <p className="text-lg font-medium">{description}</p>
            </Card>
          )}

          {nextRuns.length > 0 && (
            <Card variant="bordered" className="p-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                다음 실행 시간
              </h3>
              <div className="space-y-2">
                {nextRuns.map((run, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
                  >
                    <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs">
                      {idx + 1}
                    </span>
                    <span className="font-mono">{run}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
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
          ⏰ Cron 표현식, 머리 아프지 않게 풀어보기
        </h2>
        <p className="text-sm leading-relaxed">
          <strong className="text-gray-900 dark:text-white">Cron 표현식을 한국어로 풀이하고 다음 실행 시각 5개를 미리 보여줍니다.</strong>{' '}
          <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">0 9 * * 1-5</code> 같은 별표투성이 문자열을 매번 검색할 필요가 없습니다.
          <strong>AWS EventBridge</strong>, <strong>GitHub Actions schedule</strong>, <strong>Kubernetes CronJob</strong>, Spring <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">@Scheduled</code>, crontab까지 거의 모든 표기를 분 단위로 해석합니다.
          입력은 <strong>브라우저 안에서만 처리</strong>되므로 운영 스크립트 검증에도 안전합니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 5개 필드 한눈에 보기
        </h2>
        <div className="text-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-left py-2 px-2">필드</th>
                  <th className="text-left py-2 px-2">범위</th>
                  <th className="text-left py-2 px-2">특수문자</th>
                  <th className="text-left py-2 px-2">예시</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                <tr className="border-b dark:border-gray-800"><td className="py-2 px-2">분</td><td>0-59</td><td>* , - /</td><td>0, 30, */5</td></tr>
                <tr className="border-b dark:border-gray-800"><td className="py-2 px-2">시</td><td>0-23</td><td>* , - /</td><td>9, 0-8, */2</td></tr>
                <tr className="border-b dark:border-gray-800"><td className="py-2 px-2">일</td><td>1-31</td><td>* , - /</td><td>1, 15, 1-7</td></tr>
                <tr className="border-b dark:border-gray-800"><td className="py-2 px-2">월</td><td>1-12</td><td>* , - /</td><td>1, 6-8, */3</td></tr>
                <tr><td className="py-2 px-2">요일</td><td>0-6</td><td>* , - /</td><td>0(일), 1-5</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 자주 쓰는 패턴
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded font-mono text-xs">
            <span className="text-blue-600 dark:text-blue-400">0 9 * * 1-5</span>
            <span className="ml-2 text-gray-500">평일 오전 9시 (출근 알림)</span>
          </div>
          <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded font-mono text-xs">
            <span className="text-blue-600 dark:text-blue-400">0 0 1 * *</span>
            <span className="ml-2 text-gray-500">매월 1일 자정 (정산 배치)</span>
          </div>
          <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded font-mono text-xs">
            <span className="text-blue-600 dark:text-blue-400">*/15 * * * *</span>
            <span className="ml-2 text-gray-500">15분마다 (헬스체크)</span>
          </div>
          <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded font-mono text-xs">
            <span className="text-blue-600 dark:text-blue-400">0 */2 * * *</span>
            <span className="ml-2 text-gray-500">2시간마다 (백업)</span>
          </div>
          <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded font-mono text-xs">
            <span className="text-blue-600 dark:text-blue-400">30 3 * * 0</span>
            <span className="ml-2 text-gray-500">일요일 새벽 3시 30분</span>
          </div>
          <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded font-mono text-xs">
            <span className="text-blue-600 dark:text-blue-400">0 0,12 * * *</span>
            <span className="ml-2 text-gray-500">매일 자정과 정오</span>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          ⚠️ 자주 빠지는 함정
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>요일과 일을 둘 다 지정</strong>: 표준 cron에서는 OR 조건이 됩니다. 매월 15일 + 매주 금요일을 동시에 쓰면 둘 중 하나라도 맞으면 실행되어 의도와 다르게 동작할 수 있어요.</li>
          <li><strong>2월 30일 같은 존재하지 않는 날짜</strong>: 0 0 30 2 *처럼 쓰면 절대 실행되지 않습니다. 마지막 날을 원하면 L 확장 문법(Quartz 등)을 지원하는 환경인지 먼저 확인하세요.</li>
          <li><strong>매주 일요일은 0과 7 둘 다 가능</strong>: 시스템에 따라 다르므로 안전하게 0을 쓰세요.</li>
        </ul>
      </section>

      <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 p-4 text-sm">
        <p className="font-semibold text-amber-900 dark:text-amber-200 mb-1">⚠️ 타임존 체크리스트</p>
        <p className="text-amber-800 dark:text-amber-300">
          <strong>cron은 시스템 타임존</strong>을 따릅니다. UTC 서버에서 KST 오전 9시에 돌리려면 <code className="px-1 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-xs font-mono">0 0 * * *</code>로 적어야 합니다.
          AWS EventBridge·GitHub Actions는 <strong>UTC 고정</strong>이니 환경별로 한 번 더 점검하세요.
        </p>
      </div>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: 'Cron과 Crontab의 차이가 정확히 뭔가요?',
            answer: 'Cron은 백그라운드에서 돌아가는 스케줄링 데몬이고, Crontab은 사용자가 어떤 명령을 언제 실행할지 적어두는 설정 파일입니다. 터미널에서 crontab -e로 편집, crontab -l로 확인할 수 있고, 각 사용자별로 별도의 crontab을 가집니다.',
          },
          {
            question: '초 단위로 더 자주 돌리려면 어떻게 해야 하나요?',
            answer: '표준 cron은 분 단위가 최소 단위입니다. 1초 간격이 필요하면 Spring @Scheduled, Quartz, node-cron(6필드 모드), Kubernetes의 별도 워크어라운드 같은 확장 구현을 써야 하고, 이때는 표현식 앞에 초 필드가 하나 더 붙어 6칸이 됩니다.',
          },
          {
            question: '서버 시간대가 UTC인데 9시 KST에 돌리고 싶어요',
            answer: 'cron 자체는 시스템 타임존을 따라가므로 UTC 서버라면 KST 9시 = UTC 0시, 즉 0 0 * * *로 적어야 합니다. AWS EventBridge처럼 명시적으로 cron(0 0 * * ? *) 형태와 UTC가 고정인 서비스도 있어 환경별로 한 번씩 점검이 필요합니다.',
          },
          {
            question: '이 도구가 보여주는 다음 실행 시간은 어디 기준인가요?',
            answer: '브라우저가 인식한 사용자의 로컬 타임존입니다. 한국에서 접속하면 KST 기준으로 계산되니, UTC 서버에 배포할 cron을 작성한다면 시간대 차이를 한 번 더 점검하세요.',
          },
        ]}
      />
    </div>
  );
}
