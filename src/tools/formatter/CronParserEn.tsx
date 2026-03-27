'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';

const presets = [
  { name: 'Every minute', cron: '* * * * *' },
  { name: 'Every hour', cron: '0 * * * *' },
  { name: 'Daily midnight', cron: '0 0 * * *' },
  { name: 'Daily 9 AM', cron: '0 9 * * *' },
  { name: 'Every Monday', cron: '0 0 * * 1' },
  { name: 'Monthly 1st', cron: '0 0 1 * *' },
  { name: 'Weekdays 9 AM', cron: '0 9 * * 1-5' },
  { name: 'Every 5 min', cron: '*/5 * * * *' },
  { name: 'Every 30 min', cron: '*/30 * * * *' },
  { name: 'At 15 past', cron: '15 * * * *' },
];

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function CronParserEn() {
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
    if (parts.length !== 5) return 'Format: minute hour day month weekday (5 fields)';

    const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;
    const descriptions: string[] = [];

    // Minute
    if (minute === '*') descriptions.push('every minute');
    else if (minute.startsWith('*/')) descriptions.push(`every ${minute.slice(2)} minutes`);
    else descriptions.push(`at minute ${minute}`);

    // Hour
    if (hour === '*') descriptions.push('of every hour');
    else if (hour.startsWith('*/')) descriptions.push(`every ${hour.slice(2)} hours`);
    else descriptions.push(`at ${hour}:00`);

    // Day
    if (dayOfMonth !== '*') {
      if (dayOfMonth.includes('-')) {
        const [start, end] = dayOfMonth.split('-');
        descriptions.push(`on days ${start}-${end}`);
      } else {
        descriptions.push(`on day ${dayOfMonth}`);
      }
    }

    // Month
    if (month !== '*') {
      const months = parseCronField(month, 1, 12);
      descriptions.push(`in ${months.map(m => monthNames[m]).join(', ')}`);
    }

    // Day of week
    if (dayOfWeek !== '*') {
      if (dayOfWeek === '1-5') descriptions.push('on weekdays');
      else if (dayOfWeek === '0,6' || dayOfWeek === '6,0') descriptions.push('on weekends');
      else {
        const days = parseCronField(dayOfWeek, 0, 6);
        descriptions.push(`on ${days.map(d => dayNames[d]).join(', ')}`);
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
          d.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            weekday: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })
        ));
        setError('');
      } catch {
        setError('Invalid cron expression');
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
              Cron Expression
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
          <span>Min (0-59)</span>
          <span>Hour (0-23)</span>
          <span>Day (1-31)</span>
          <span>Month (1-12)</span>
          <span>Weekday (0-6)</span>
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
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</h3>
              <p className="text-lg font-medium">{description}</p>
            </Card>
          )}

          {nextRuns.length > 0 && (
            <Card variant="bordered" className="p-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Next Run Times
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
          ⏰ What is Cron Parser?
        </h2>
        <p className="text-sm leading-relaxed">
          Cron expressions are time-based syntax used for job scheduling in Unix/Linux systems.
          They consist of 5 fields (minute, hour, day, month, weekday), and each field can combine numbers,
          wildcards (*), ranges (-), and lists (,) to express complex schedules.
          This tool interprets cron expressions in plain English and calculates upcoming execution times
          to help verify your schedule before deployment.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 Cron Expression Structure
        </h2>
        <div className="text-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-left py-2 px-2">Field</th>
                  <th className="text-left py-2 px-2">Range</th>
                  <th className="text-left py-2 px-2">Special</th>
                  <th className="text-left py-2 px-2">Example</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                <tr className="border-b dark:border-gray-800"><td className="py-2 px-2">Minute</td><td>0-59</td><td>* , - /</td><td>0, 30, */5</td></tr>
                <tr className="border-b dark:border-gray-800"><td className="py-2 px-2">Hour</td><td>0-23</td><td>* , - /</td><td>9, 0-8, */2</td></tr>
                <tr className="border-b dark:border-gray-800"><td className="py-2 px-2">Day</td><td>1-31</td><td>* , - /</td><td>1, 15, 1-7</td></tr>
                <tr className="border-b dark:border-gray-800"><td className="py-2 px-2">Month</td><td>1-12</td><td>* , - /</td><td>1, 6-8, */3</td></tr>
                <tr><td className="py-2 px-2">Weekday</td><td>0-6</td><td>* , - /</td><td>0(Sun), 1-5</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Common Patterns
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded font-mono text-xs">
            <span className="text-blue-600 dark:text-blue-400">0 9 * * 1-5</span>
            <span className="ml-2 text-gray-500">Weekdays at 9 AM</span>
          </div>
          <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded font-mono text-xs">
            <span className="text-blue-600 dark:text-blue-400">0 0 1 * *</span>
            <span className="ml-2 text-gray-500">1st of each month</span>
          </div>
          <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded font-mono text-xs">
            <span className="text-blue-600 dark:text-blue-400">*/15 * * * *</span>
            <span className="ml-2 text-gray-500">Every 15 minutes</span>
          </div>
          <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded font-mono text-xs">
            <span className="text-blue-600 dark:text-blue-400">0 */2 * * *</span>
            <span className="ml-2 text-gray-500">Every 2 hours</span>
          </div>
        </div>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'What is the difference between Cron and Crontab?',
            answer: 'Cron is the scheduling daemon (service), and Crontab is the configuration file where users register cron jobs. Edit it with the "crontab -e" command.',
          },
          {
            question: 'How do I schedule tasks by the second?',
            answer: 'Standard cron only supports minute-level precision. For second-level scheduling, use extended implementations like node-cron (Node.js) or @Scheduled (Spring). Some support 6 fields including seconds.',
          },
          {
            question: 'How does server timezone affect cron execution?',
            answer: 'Cron runs based on the system timezone. If your server is set to EST, cron uses EST. In cloud environments, always verify your timezone configuration.',
          },
        ]}
      />
    </div>
  );
}
