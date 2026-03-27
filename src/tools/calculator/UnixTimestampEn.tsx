'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { Input } from '@/components/ui/Input';
import { FaqSection } from '@/components/ui/FaqItem';

export function UnixTimestampEn() {
  const [currentTimestamp, setCurrentTimestamp] = useState(Math.floor(Date.now() / 1000));
  const [inputTimestamp, setInputTimestamp] = useState('');
  const [inputDate, setInputDate] = useState('');
  const [inputTime, setInputTime] = useState('');
  const [convertedDate, setConvertedDate] = useState<Date | null>(null);
  const [convertedTimestamp, setConvertedTimestamp] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const now = new Date();
    setInputDate(now.toISOString().split('T')[0]);
    setInputTime(now.toTimeString().slice(0, 5));
  }, []);

  const timestampToDate = () => {
    const ts = parseInt(inputTimestamp);
    if (isNaN(ts)) return;

    const timestamp = inputTimestamp.length > 10 ? ts : ts * 1000;
    setConvertedDate(new Date(timestamp));
  };

  const dateToTimestamp = () => {
    const dateTime = new Date(`${inputDate}T${inputTime}`);
    if (isNaN(dateTime.getTime())) return;

    setConvertedTimestamp(Math.floor(dateTime.getTime() / 1000));
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleString('en-US', {
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
    { label: 'Now', getValue: () => Math.floor(Date.now() / 1000) },
    { label: 'Today Start', getValue: () => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      return Math.floor(d.getTime() / 1000);
    }},
    { label: 'Tomorrow', getValue: () => {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      d.setHours(0, 0, 0, 0);
      return Math.floor(d.getTime() / 1000);
    }},
    { label: '1 Week', getValue: () => Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 },
    { label: '1 Month', getValue: () => Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60 },
  ];

  return (
    <div className="space-y-2">
      {/* Current timestamp */}
      <Card variant="bordered" className="p-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Current Unix Timestamp</p>
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

      {/* Timestamp → Date */}
      <Card variant="bordered" className="p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Timestamp → Date
        </h3>
        <div className="flex gap-2 mb-3">
          <Input
            type="number"
            value={inputTimestamp}
            onChange={(e) => setInputTimestamp(e.target.value)}
            placeholder="1704067200 or 1704067200000"
            className="font-mono"
          />
          <Button onClick={timestampToDate}>Convert</Button>
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
              <span className="text-gray-500">Local</span>
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

      {/* Date → Timestamp */}
      <Card variant="bordered" className="p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Date → Timestamp
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
          <Button onClick={dateToTimestamp}>Convert</Button>
        </div>

        {convertedTimestamp !== null && (
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <span className="text-gray-500">Seconds (s)</span>
              <span className="font-mono">{convertedTimestamp}</span>
              <CopyButton text={convertedTimestamp.toString()} size="sm" />
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <span className="text-gray-500">Milliseconds (ms)</span>
              <span className="font-mono">{convertedTimestamp * 1000}</span>
              <CopyButton text={(convertedTimestamp * 1000).toString()} size="sm" />
            </div>
          </div>
        )}
      </Card>

      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs text-gray-600 dark:text-gray-400">
        <p><strong>Unix Timestamp</strong>: Seconds elapsed since January 1, 1970 00:00:00 UTC</p>
        <p>10 digits = seconds (s), 13 digits = milliseconds (ms)</p>
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
          🕐 What is Unix Timestamp?
        </h2>
        <p className="text-sm leading-relaxed">
          Unix timestamp represents the number of seconds elapsed since January 1, 1970 00:00:00 UTC (Unix Epoch).
          It provides a timezone-independent way to represent the same moment globally, making it standard for cross-system time exchange.
          This tool converts between timestamps and human-readable dates, auto-detecting seconds (10 digits) and milliseconds (13 digits).
          View and copy the current timestamp in real-time.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 Key Timestamp References
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Date</th>
                <th className="text-left py-2 px-2">Timestamp (s)</th>
                <th className="text-left py-2 px-2">Significance</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">1970-01-01</td><td className="font-mono">0</td><td>Unix Epoch (origin)</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">2000-01-01</td><td className="font-mono">946684800</td><td>Y2K</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">2038-01-19</td><td className="font-mono">2147483647</td><td>32-bit limit (Y2K38)</td></tr>
              <tr><td className="py-2 px-2 font-medium">2100-01-01</td><td className="font-mono">4102444800</td><td>64-bit compatible</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Timestamp Usage Tips
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Debugging</strong>: Convert log timestamps to dates to identify issue timing</li>
          <li><strong>API validation</strong>: Check token expiration times, cache validity periods</li>
          <li><strong>Data analysis</strong>: Convert CSV/JSON timestamps to human-readable format</li>
          <li><strong>Timezone awareness</strong>: Timestamps are always UTC, differ from local time</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'How do I distinguish seconds from milliseconds?',
            answer: '10-digit numbers are seconds, 13-digit numbers are milliseconds. This tool auto-detects the format based on digit count.',
          },
          {
            question: 'What is the Y2K38 problem?',
            answer: '32-bit systems storing seconds will overflow on January 19, 2038. Dates after this require 64-bit systems.',
          },
          {
            question: 'Can timestamps be negative?',
            answer: 'Yes, dates before 1970 are represented as negative timestamps. Example: 1969-12-31 23:59:59 UTC is -1.',
          },
        ]}
      />
    </div>
  );
}
