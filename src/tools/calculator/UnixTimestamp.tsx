'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { Input } from '@/components/ui/Input';
import { FaqSection } from '@/components/ui/FaqItem';

export function UnixTimestamp() {
  const [currentTimestamp, setCurrentTimestamp] = useState(Math.floor(Date.now() / 1000));
  const [inputTimestamp, setInputTimestamp] = useState('');
  const [inputDate, setInputDate] = useState('');
  const [inputTime, setInputTime] = useState('');
  const [convertedDate, setConvertedDate] = useState<Date | null>(null);
  const [convertedTimestamp, setConvertedTimestamp] = useState<number | null>(null);

  // 실시간 타임스탬프 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 날짜 입력 초기화
  useEffect(() => {
    const now = new Date();
    setInputDate(now.toISOString().split('T')[0]);
    setInputTime(now.toTimeString().slice(0, 5));
  }, []);

  const timestampToDate = () => {
    const ts = parseInt(inputTimestamp);
    if (isNaN(ts)) return;

    // 밀리초인지 초인지 판단 (13자리면 밀리초)
    const timestamp = inputTimestamp.length > 10 ? ts : ts * 1000;
    setConvertedDate(new Date(timestamp));
  };

  const dateToTimestamp = () => {
    const dateTime = new Date(`${inputDate}T${inputTime}`);
    if (isNaN(dateTime.getTime())) return;

    setConvertedTimestamp(Math.floor(dateTime.getTime() / 1000));
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      weekday: 'long',
    });
  };

  const formatIso = (date: Date): string => {
    return date.toISOString();
  };

  const formatUtc = (date: Date): string => {
    return date.toUTCString();
  };

  const commonTimestamps = [
    { label: '지금', getValue: () => Math.floor(Date.now() / 1000) },
    { label: '오늘 시작', getValue: () => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      return Math.floor(d.getTime() / 1000);
    }},
    { label: '내일 시작', getValue: () => {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      d.setHours(0, 0, 0, 0);
      return Math.floor(d.getTime() / 1000);
    }},
    { label: '1주 후', getValue: () => Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 },
    { label: '1달 후', getValue: () => Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60 },
  ];

  return (
    <div className="space-y-2">
      {/* 현재 타임스탬프 */}
      <Card variant="bordered" className="p-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">현재 Unix 타임스탬프</p>
        <div className="flex justify-center items-center gap-4">
          <p className="text-4xl font-mono font-bold text-blue-600 dark:text-blue-400">
            {currentTimestamp}
          </p>
          <CopyButton text={currentTimestamp.toString()} />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {formatDate(new Date())}
        </p>
      </Card>

      {/* 타임스탬프 → 날짜 */}
      <Card variant="bordered" className="p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          타임스탬프 → 날짜
        </h3>
        <div className="flex gap-2 mb-3">
          <Input
            type="number"
            value={inputTimestamp}
            onChange={(e) => setInputTimestamp(e.target.value)}
            placeholder="1704067200 또는 1704067200000"
            className="font-mono"
          />
          <Button onClick={timestampToDate}>변환</Button>
        </div>

        <div className="flex gap-1 flex-wrap">
          {commonTimestamps.map(({ label, getValue }) => (
            <Button
              key={label}
              variant="secondary"
              size="sm"
              onClick={() => {
                const ts = getValue();
                setInputTimestamp(ts.toString());
                setConvertedDate(new Date(ts * 1000));
              }}
            >
              {label}
            </Button>
          ))}
        </div>

        {convertedDate && (
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <span className="text-gray-500">로컬</span>
              <span className="font-mono">{formatDate(convertedDate)}</span>
              <CopyButton text={formatDate(convertedDate)} size="sm" />
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <span className="text-gray-500">ISO 8601</span>
              <span className="font-mono">{formatIso(convertedDate)}</span>
              <CopyButton text={formatIso(convertedDate)} size="sm" />
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <span className="text-gray-500">UTC</span>
              <span className="font-mono">{formatUtc(convertedDate)}</span>
              <CopyButton text={formatUtc(convertedDate)} size="sm" />
            </div>
          </div>
        )}
      </Card>

      {/* 날짜 → 타임스탬프 */}
      <Card variant="bordered" className="p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          날짜 → 타임스탬프
        </h3>
        <div className="flex gap-2 mb-3 flex-wrap">
          <Input
            type="date"
            value={inputDate}
            onChange={(e) => setInputDate(e.target.value)}
            className="w-auto"
          />
          <Input
            type="time"
            value={inputTime}
            onChange={(e) => setInputTime(e.target.value)}
            className="w-auto"
          />
          <Button onClick={dateToTimestamp}>변환</Button>
        </div>

        {convertedTimestamp !== null && (
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <span className="text-gray-500">초 (s)</span>
              <span className="font-mono">{convertedTimestamp}</span>
              <CopyButton text={convertedTimestamp.toString()} size="sm" />
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <span className="text-gray-500">밀리초 (ms)</span>
              <span className="font-mono">{convertedTimestamp * 1000}</span>
              <CopyButton text={(convertedTimestamp * 1000).toString()} size="sm" />
            </div>
          </div>
        )}
      </Card>

      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs text-gray-600 dark:text-gray-400">
        <p><strong>Unix 타임스탬프</strong>: 1970년 1월 1일 00:00:00 UTC부터 경과한 초</p>
        <p>10자리 = 초 (s), 13자리 = 밀리초 (ms)</p>
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
          🕐 Unix 타임스탬프란?
        </h2>
        <p className="text-sm leading-relaxed">
          Unix 타임스탬프는 1970년 1월 1일 00:00:00 UTC(Unix Epoch)부터 경과한 초를 나타내는 숫자입니다.
          시간대와 무관하게 전 세계에서 동일한 시점을 표현할 수 있어 시스템 간 시간 교환에 표준으로 사용됩니다.
          이 도구는 타임스탬프와 사람이 읽을 수 있는 날짜를 상호 변환하며, 초(10자리)와 밀리초(13자리)를 자동 인식합니다.
          실시간으로 현재 타임스탬프를 확인하고 복사할 수 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 주요 타임스탬프 참조
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">날짜</th>
                <th className="text-left py-2 px-2">타임스탬프 (초)</th>
                <th className="text-left py-2 px-2">의미</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">1970-01-01</td><td className="font-mono">0</td><td>Unix Epoch (기준점)</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">2000-01-01</td><td className="font-mono">946684800</td><td>Y2K</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">2038-01-19</td><td className="font-mono">2147483647</td><td>32비트 한계 (Y2K38)</td></tr>
              <tr><td className="py-2 px-2 font-medium">2100-01-01</td><td className="font-mono">4102444800</td><td>64비트로 처리 가능</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 타임스탬프 활용 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>디버깅</strong>: 로그의 타임스탬프를 날짜로 변환해 문제 시점 파악</li>
          <li><strong>API 검증</strong>: 토큰 만료 시간, 캐시 유효 기간 확인</li>
          <li><strong>데이터 분석</strong>: CSV/JSON의 타임스탬프를 사람이 읽을 수 있게 변환</li>
          <li><strong>시간대 주의</strong>: 타임스탬프는 항상 UTC 기준, 로컬 시간과 차이 있음</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '초와 밀리초는 어떻게 구분하나요?',
            answer: '10자리 숫자는 초(seconds), 13자리 숫자는 밀리초(milliseconds)입니다. 이 도구는 자리수를 자동으로 감지하여 변환합니다.',
          },
          {
            question: 'Y2K38 문제가 뭔가요?',
            answer: '32비트 시스템에서 초를 저장하는 한계가 2038년 1월 19일입니다. 이 날짜 이후는 오버플로우가 발생하므로 64비트 시스템 사용이 필요합니다.',
          },
          {
            question: '음수 타임스탬프는 가능한가요?',
            answer: '네, 1970년 이전 날짜는 음수 타임스탬프로 표현됩니다. 예: 1969-12-31 23:59:59 UTC는 -1입니다.',
          },
        ]}
      />
    </div>
  );
}
