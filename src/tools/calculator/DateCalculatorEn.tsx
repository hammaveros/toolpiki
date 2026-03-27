'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';

export function DateCalculatorEn() {
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState('');
  const [addDays, setAddDays] = useState('');
  const [mode, setMode] = useState<'diff' | 'add'>('diff');

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

  const addResult = useMemo(() => {
    if (!startDate) return null;

    const days = addDays === '' ? 0 : parseInt(addDays, 10);
    if (isNaN(days)) return null;

    const date = new Date(startDate);
    date.setDate(date.getDate() + days);

    return {
      date: date.toISOString().split('T')[0],
      formatted: date.toLocaleDateString('en-US', {
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
      {/* Mode selection */}
      <div className="flex gap-2">
        <Button
          variant={mode === 'diff' ? 'primary' : 'secondary'}
          onClick={() => setMode('diff')}
        >
          Date Difference
        </Button>
        <Button
          variant={mode === 'add' ? 'primary' : 'secondary'}
          onClick={() => setMode('add')}
        >
          Add/Subtract Days
        </Button>
      </div>

      {mode === 'diff' ? (
        <>
          {/* Date difference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Start Date
                </label>
                <Button variant="ghost" size="sm" onClick={setToday}>
                  Today
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
                  End Date
                </label>
              </div>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Results */}
          {dateDiff && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <ResultCard
                label="Total Days"
                value={`${dateDiff.absDays} days`}
                highlight
              />
              <ResultCard label="Total Weeks" value={`${dateDiff.weeks} weeks`} />
              <ResultCard label="Total Hours" value={`${dateDiff.hours} hours`} />
              <ResultCard
                label="Breakdown"
                value={`${dateDiff.years}y ${dateDiff.months}m ${dateDiff.remainingDays}d`}
              />
            </div>
          )}

          {dateDiff && (
            <p className="text-center text-gray-600 dark:text-gray-400">
              {dateDiff.isPast ? (
                <>
                  End date is{' '}
                  <strong className="text-red-500">{dateDiff.absDays} days before</strong>{' '}
                  the start date.
                </>
              ) : dateDiff.days === 0 ? (
                'Same date.'
              ) : (
                <>
                  End date is{' '}
                  <strong className="text-blue-600 dark:text-blue-400">
                    {dateDiff.absDays} days after
                  </strong>{' '}
                  the start date.
                </>
              )}
            </p>
          )}
        </>
      ) : (
        <>
          {/* Add/subtract days */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Base Date
                </label>
                <Button variant="ghost" size="sm" onClick={setToday}>
                  Today
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
                  Days to Add/Subtract
                </label>
              </div>
              <Input
                type="number"
                value={addDays}
                onChange={(e) => setAddDays(e.target.value)}
                placeholder="Positive: add, Negative: subtract"
              />
            </div>
          </div>

          {/* Quick buttons */}
          <div className="flex flex-wrap gap-2">
            {[7, 30, 90, 180, 365, -7, -30].map((days) => (
              <Button
                key={days}
                variant="secondary"
                size="sm"
                onClick={() => setAddDays(String(days))}
              >
                {days > 0 ? `+${days}` : days} days
              </Button>
            ))}
          </div>

          {/* Result */}
          {addResult && (
            <Card variant="bordered" className="p-4 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Result Date
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
          📅 What is Date Calculator?
        </h2>
        <p className="text-sm leading-relaxed">
          Date Calculator computes the duration between two dates or adds/subtracts days from a specific date.
          Use it for D-day countdowns, project deadlines, contract periods, and travel planning.
          Results are shown in multiple formats: days, weeks, hours, and years/months/days breakdown.
          Quick buttons let you apply common intervals (7, 30, 90 days) with one click.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 Date Calculation Use Cases
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Scenario</th>
                <th className="text-left py-2 px-2">Mode</th>
                <th className="text-left py-2 px-2">Example</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">D-day countdown</td><td>Date Difference</td><td>Days until exam/wedding?</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Contract expiry</td><td>Add Days</td><td>365 days from today?</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">Employment period</td><td>Date Difference</td><td>Days since start date</td></tr>
              <tr><td className="py-2 px-2 font-medium">Backward planning</td><td>Subtract Days</td><td>When to book 30 days before trip?</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Date Calculation Tips
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Business days</strong>: Subtract about 2/7 from total days for weekday estimate</li>
          <li><strong>Leap years</strong>: Periods including Feb 29 have 366 days per year</li>
          <li><strong>Time zones</strong>: For international dates, consider time zone differences</li>
          <li><strong>Inclusive counting</strong>: Add 1 to include both start and end dates</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Does the date difference include the start and end dates?',
            answer: 'The calculation subtracts start from end, so the start date is included but the end date is not. Add 1 to the result if you want both dates included.',
          },
          {
            question: 'How do I calculate a 100-day anniversary?',
            answer: 'In "Add Days" mode, add 99 days to your start date (the day you met). Day 1 is the starting day, so day 100 is 99 days later.',
          },
          {
            question: 'Can I calculate past dates?',
            answer: 'Yes, in "Add/Subtract Days" mode, enter a negative number to calculate past dates. For example, -30 gives you the date 30 days ago.',
          },
        ]}
      />
    </div>
  );
}
